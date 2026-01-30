/**
 * Subscription Context - Phase 4 Monetization
 *
 * Manages user subscription state and feature access
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

// Types
export type SubscriptionTier = 'free' | 'premium' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'paused';

export interface Subscription {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at: string | null;
  trial_end: string | null;
}

export interface FeatureLimits {
  tier: SubscriptionTier;
  max_squads: number;
  max_members_per_squad: number;
  max_sessions_per_month: number;
  max_recurring_sessions: number;
  history_days: number;
  has_advanced_stats: boolean;
  has_ai_suggestions: boolean;
  has_calendar_export: boolean;
  has_discord_bot_advanced: boolean;
  has_custom_roles: boolean;
  has_webhooks: boolean;
  has_api_access: boolean;
  has_priority_support: boolean;
  has_white_label: boolean;
}

export interface UsageTracking {
  squads_created: number;
  sessions_created: number;
  recurring_sessions_created: number;
}

interface SubscriptionContextType {
  // Subscription data
  subscription: Subscription | null;
  limits: FeatureLimits | null;
  usage: UsageTracking | null;
  loading: boolean;
  error: string | null;

  // Helper methods
  isPremium: boolean;
  isPro: boolean;
  isEnterprise: boolean;
  isTrialing: boolean;
  daysUntilExpiry: number | null;

  // Feature checks
  canCreateSquad: () => boolean;
  canCreateSession: () => boolean;
  canCreateRecurringSession: () => boolean;
  hasFeature: (feature: string) => boolean;

  // Actions
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Default limits for free tier
const FREE_LIMITS: FeatureLimits = {
  tier: 'free',
  max_squads: 1,
  max_members_per_squad: 10,
  max_sessions_per_month: 20,
  max_recurring_sessions: 0,
  history_days: 30,
  has_advanced_stats: false,
  has_ai_suggestions: false,
  has_calendar_export: false,
  has_discord_bot_advanced: false,
  has_custom_roles: false,
  has_webhooks: false,
  has_api_access: false,
  has_priority_support: false,
  has_white_label: false,
};

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [limits, setLimits] = useState<FeatureLimits | null>(FREE_LIMITS);
  const [usage, setUsage] = useState<UsageTracking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch subscription data with graceful error handling for missing tables
  const fetchSubscription = useCallback(async () => {
    if (!user?.id) {
      setSubscription(null);
      setLimits(FREE_LIMITS);
      setUsage(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch subscription - graceful handling if table doesn't exist
      let subData = null;
      try {
        const { data, error: subError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // Gestion gracieuse des erreurs 406/PGRST116 (table non accessible ou vide)
        if (subError) {
          if (subError.code === 'PGRST116' || subError.code === '406' || subError.message?.includes('406')) {
            console.warn('[Subscription] Table subscriptions non accessible, utilisation du tier gratuit');
            subData = null;
          } else if (subError.code !== 'PGRST116') {
            console.warn('[Subscription] Erreur subscription:', subError.message);
          }
        } else {
          subData = data;
        }
      } catch (e: any) {
        console.warn('[Subscription] Exception lors du fetch subscriptions:', e.message);
        // Continue avec les valeurs par défaut
      }

      setSubscription(subData as Subscription | null);

      // Fetch feature limits - with fallback
      const tier = subData?.tier || 'free';
      let limitsData = null;
      try {
        const { data, error: limitsError } = await supabase
          .from('feature_limits')
          .select('*')
          .eq('tier', tier)
          .single();

        if (limitsError) {
          // Table peut ne pas exister - utiliser les limites par défaut
          if (limitsError.code === '406' || limitsError.message?.includes('406')) {
            console.warn('[Subscription] Table feature_limits non accessible');
          } else {
            console.warn('[Subscription] Limits fetch error:', limitsError.message);
          }
        } else {
          limitsData = data;
        }
      } catch (e: any) {
        console.warn('[Subscription] Exception lors du fetch feature_limits:', e.message);
      }

      setLimits(limitsData as FeatureLimits || FREE_LIMITS);

      // Fetch current month usage - with fallback
      try {
        const currentMonth = new Date().toISOString().slice(0, 7) + '-01';
        const { data: usageData, error: usageError } = await supabase
          .from('usage_tracking')
          .select('squads_created, sessions_created, recurring_sessions_created')
          .eq('user_id', user.id)
          .eq('period_start', currentMonth)
          .single();

        if (usageError) {
          // Table peut ne pas exister
          if (usageError.code === '406' || usageError.message?.includes('406')) {
            console.warn('[Subscription] Table usage_tracking non accessible');
          }
          setUsage({ squads_created: 0, sessions_created: 0, recurring_sessions_created: 0 });
        } else {
          setUsage(usageData || { squads_created: 0, sessions_created: 0, recurring_sessions_created: 0 });
        }
      } catch (e: any) {
        console.warn('[Subscription] Exception lors du fetch usage_tracking:', e.message);
        setUsage({ squads_created: 0, sessions_created: 0, recurring_sessions_created: 0 });
      }

    } catch (err: any) {
      console.error('[Subscription] Error global:', err);
      // Ne pas afficher d'erreur à l'utilisateur, utiliser les valeurs par défaut
      setSubscription(null);
      setLimits(FREE_LIMITS);
      setUsage({ squads_created: 0, sessions_created: 0, recurring_sessions_created: 0 });
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Initial fetch
  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  // Real-time subscription updates
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('subscription_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchSubscription();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchSubscription]);

  // Computed values
  const isPremium = subscription?.tier === 'premium' || subscription?.tier === 'pro' || subscription?.tier === 'enterprise';
  const isPro = subscription?.tier === 'pro' || subscription?.tier === 'enterprise';
  const isEnterprise = subscription?.tier === 'enterprise';
  const isTrialing = subscription?.status === 'trialing';

  const daysUntilExpiry = subscription?.current_period_end
    ? Math.ceil((new Date(subscription.current_period_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  // Feature check methods
  const canCreateSquad = useCallback(() => {
    if (!limits) return false;
    if (limits.max_squads === -1) return true; // Unlimited
    return (usage?.squads_created || 0) < limits.max_squads;
  }, [limits, usage]);

  const canCreateSession = useCallback(() => {
    if (!limits) return false;
    if (limits.max_sessions_per_month === -1) return true; // Unlimited
    return (usage?.sessions_created || 0) < limits.max_sessions_per_month;
  }, [limits, usage]);

  const canCreateRecurringSession = useCallback(() => {
    if (!limits) return false;
    if (limits.max_recurring_sessions === -1) return true; // Unlimited
    if (limits.max_recurring_sessions === 0) return false; // Not available
    return (usage?.recurring_sessions_created || 0) < limits.max_recurring_sessions;
  }, [limits, usage]);

  const hasFeature = useCallback((feature: string) => {
    if (!limits) return false;
    const key = feature.startsWith('has_') ? feature : `has_${feature}`;
    return (limits as any)[key] === true;
  }, [limits]);

  const value: SubscriptionContextType = {
    subscription,
    limits,
    usage,
    loading,
    error,
    isPremium,
    isPro,
    isEnterprise,
    isTrialing,
    daysUntilExpiry,
    canCreateSquad,
    canCreateSession,
    canCreateRecurringSession,
    hasFeature,
    refreshSubscription: fetchSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

export default SubscriptionContext;
