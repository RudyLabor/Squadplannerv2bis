/**
 * Stripe Webhooks Handler - Phase 4 Monetization
 *
 * Handles Stripe webhook events for subscription management
 * Deploy: supabase functions deploy stripe-webhooks
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';

// Initialize Stripe
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

// Initialize Supabase Admin client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Webhook secret for signature verification
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';

// Tier mapping from Stripe price IDs
const PRICE_TO_TIER: Record<string, 'free' | 'premium' | 'pro' | 'enterprise'> = {
  // Add your actual Stripe price IDs here
  'price_premium_monthly': 'premium',
  'price_premium_yearly': 'premium',
  'price_pro_monthly': 'pro',
  'price_pro_yearly': 'pro',
  'price_enterprise_monthly': 'enterprise',
  'price_enterprise_yearly': 'enterprise',
};

serve(async (req: Request) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get raw body and signature
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      throw new Error('Missing stripe-signature header');
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Received webhook event: ${event.type}`);

    // Log the event
    await supabase.from('stripe_webhook_events').insert({
      stripe_event_id: event.id,
      event_type: event.type,
      payload: event.data.object,
      status: 'processing',
    });

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Update event status
    await supabase
      .from('stripe_webhook_events')
      .update({ status: 'processed' })
      .eq('stripe_event_id', event.id);

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * Handle checkout session completed
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout completed:', session.id);

  const userId = session.client_reference_id;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!userId) {
    console.error('No user ID in checkout session');
    return;
  }

  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0]?.price.id;
  const tier = PRICE_TO_TIER[priceId] || 'premium';

  // Update or create subscription record
  await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      tier,
      status: subscription.status === 'trialing' ? 'trialing' : 'active',
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      stripe_price_id: priceId,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
      trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
    });

  // Create notification for user
  await supabase.from('notifications').insert({
    user_id: userId,
    type: 'subscription_activated',
    title: 'Bienvenue en Premium ! 🎉',
    message: `Votre abonnement ${tier} est maintenant actif. Profitez de toutes les fonctionnalités !`,
    data: { tier, subscription_id: subscriptionId },
  });

  console.log(`Subscription activated for user ${userId}: ${tier}`);
}

/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Processing subscription update:', subscription.id);

  // Find user by subscription ID
  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (!existingSub) {
    console.error('No subscription found for:', subscription.id);
    return;
  }

  const priceId = subscription.items.data[0]?.price.id;
  const tier = PRICE_TO_TIER[priceId] || 'premium';

  // Map Stripe status to our status
  const statusMap: Record<string, string> = {
    active: 'active',
    past_due: 'past_due',
    canceled: 'canceled',
    unpaid: 'past_due',
    trialing: 'trialing',
    paused: 'paused',
  };

  await supabase
    .from('subscriptions')
    .update({
      tier,
      status: statusMap[subscription.status] || 'active',
      stripe_price_id: priceId,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
    })
    .eq('stripe_subscription_id', subscription.id);

  console.log(`Subscription updated: ${subscription.id} -> ${tier} (${subscription.status})`);
}

/**
 * Handle subscription deletion
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Processing subscription deletion:', subscription.id);

  // Find and downgrade user
  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (!existingSub) {
    return;
  }

  await supabase
    .from('subscriptions')
    .update({
      tier: 'free',
      status: 'canceled',
      canceled_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  // Notify user
  await supabase.from('notifications').insert({
    user_id: existingSub.user_id,
    type: 'subscription_canceled',
    title: 'Abonnement annulé',
    message: 'Votre abonnement a été annulé. Vous pouvez vous réabonner à tout moment !',
    data: { subscription_id: subscription.id },
  });

  console.log(`Subscription canceled for user ${existingSub.user_id}`);
}

/**
 * Handle successful invoice payment
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log('Invoice paid:', invoice.id);

  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) return;

  // Update subscription status to active
  await supabase
    .from('subscriptions')
    .update({
      status: 'active',
    })
    .eq('stripe_subscription_id', subscriptionId);
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Payment failed:', invoice.id);

  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) return;

  // Find user
  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscriptionId)
    .single();

  if (!existingSub) return;

  // Update status
  await supabase
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('stripe_subscription_id', subscriptionId);

  // Notify user
  await supabase.from('notifications').insert({
    user_id: existingSub.user_id,
    type: 'payment_failed',
    title: 'Paiement échoué',
    message: 'Le paiement de votre abonnement a échoué. Veuillez mettre à jour vos informations de paiement.',
    data: { invoice_id: invoice.id },
  });
}

/**
 * Handle trial ending soon
 */
async function handleTrialWillEnd(subscription: Stripe.Subscription) {
  console.log('Trial ending soon:', subscription.id);

  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (!existingSub) return;

  const trialEnd = subscription.trial_end
    ? new Date(subscription.trial_end * 1000)
    : new Date();

  const daysRemaining = Math.ceil((trialEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  await supabase.from('notifications').insert({
    user_id: existingSub.user_id,
    type: 'trial_ending',
    title: 'Essai gratuit se termine bientôt',
    message: `Votre essai gratuit se termine dans ${daysRemaining} jours. Ajoutez un moyen de paiement pour continuer !`,
    data: { subscription_id: subscription.id, trial_end: trialEnd.toISOString() },
  });
}
