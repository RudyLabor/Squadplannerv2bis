/**
 * Stripe Payment Integration
 *
 * Handles Premium subscription checkout flows
 */

// Stripe Publishable Key (add to .env)
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
const API_URL = import.meta.env.VITE_API_URL || 'https://your-supabase-project.supabase.co/functions/v1';

/**
 * Create a Stripe checkout session for Premium subscription
 */
export const createCheckoutSession = async (
  priceId: string,
  userId: string
): Promise<{ sessionId: string; url: string }> => {
  try {
    const response = await fetch(`${API_URL}/payments/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        successUrl: `${window.location.origin}/premium/success`,
        cancelUrl: `${window.location.origin}/premium`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
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
    const response = await fetch(`${API_URL}/payments/cancel-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionId }),
    });

    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }
  } catch (error: any) {
    console.error('[Stripe] Cancel error:', error);
    throw error;
  }
};

/**
 * Get customer portal URL for managing subscription
 */
export const getCustomerPortalUrl = async (customerId: string): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/payments/customer-portal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl: `${window.location.origin}/premium`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get portal URL');
    }

    const data = await response.json();
    return data.url;
  } catch (error: any) {
    console.error('[Stripe] Portal error:', error);
    throw error;
  }
};

export default {
  upgradeToPremium,
  upgradeToPro,
  cancelSubscription,
  getCustomerPortalUrl,
};
