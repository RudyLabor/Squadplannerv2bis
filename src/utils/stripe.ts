/**
 * Stripe Payment Integration - Phase 4 Monetization
 *
 * Handles Premium subscription checkout flows
 */

import { supabase } from '@/lib/supabase';

// Environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';

/**
 * Get auth headers for API calls
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error('Not authenticated');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`,
  };
}

/**
 * Create a Stripe checkout session for Premium subscription
 */
export const createCheckoutSession = async (
  priceId: string,
  _userId?: string // User ID is extracted from auth token
): Promise<{ sessionId: string; url: string }> => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-checkout`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        priceId,
        successUrl: `${window.location.origin}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/premium`,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create checkout session');
    }

    const data = await response.json();

    // Redirect to Stripe Checkout
    if (data.url) {
      window.location.href = data.url;
    }

    return data;
  } catch (error: any) {
    console.error('[Stripe] Checkout error:', error);
    throw error;
  }
};

/**
 * Handle Premium upgrade
 */
export const upgradeToPremium = async (userId: string, plan: 'monthly' | 'yearly' = 'monthly') => {
  // Price IDs should be configured in Stripe Dashboard
  const priceIds = {
    monthly: import.meta.env.VITE_STRIPE_PREMIUM_MONTHLY || 'price_premium_monthly',
    yearly: import.meta.env.VITE_STRIPE_PREMIUM_YEARLY || 'price_premium_yearly',
  };

  const priceId = priceIds[plan];

  return createCheckoutSession(priceId, userId);
};

/**
 * Handle Pro upgrade
 */
export const upgradeToPro = async (userId: string, plan: 'monthly' | 'yearly' = 'monthly') => {
  const priceIds = {
    monthly: import.meta.env.VITE_STRIPE_PRO_MONTHLY || 'price_pro_monthly',
    yearly: import.meta.env.VITE_STRIPE_PRO_YEARLY || 'price_pro_yearly',
  };

  const priceId = priceIds[plan];

  return createCheckoutSession(priceId, userId);
};

/**
 * Cancel subscription
 */
export const cancelSubscription = async (subscriptionId: string): Promise<void> => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${SUPABASE_URL}/functions/v1/cancel-subscription`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ subscriptionId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to cancel subscription');
    }
  } catch (error: any) {
    console.error('[Stripe] Cancel error:', error);
    throw error;
  }
};

/**
 * Get customer portal URL for managing subscription
 */
export const getCustomerPortalUrl = async (): Promise<string> => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${SUPABASE_URL}/functions/v1/customer-portal`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        returnUrl: `${window.location.origin}/premium`,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get portal URL');
    }

    const data = await response.json();
    return data.url;
  } catch (error: any) {
    console.error('[Stripe] Portal error:', error);
    throw error;
  }
};

/**
 * Open Stripe customer portal
 */
export const openCustomerPortal = async (): Promise<void> => {
  const url = await getCustomerPortalUrl();
  window.location.href = url;
};

export default {
  createCheckoutSession,
  upgradeToPremium,
  upgradeToPro,
  cancelSubscription,
  getCustomerPortalUrl,
  openCustomerPortal,
};
