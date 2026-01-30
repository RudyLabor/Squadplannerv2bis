/**
 * Feature Gate Hook - Phase 4 Monetization
 *
 * Controls access to premium features and shows upgrade prompts
 */

import { useCallback } from 'react';
import { useSubscription, SubscriptionTier } from '@/app/contexts/SubscriptionContext';

export type Feature =
  | 'advanced_stats'
  | 'ai_suggestions'
  | 'calendar_export'
  | 'discord_bot_advanced'
  | 'custom_roles'
  | 'webhooks'
  | 'api_access'
  | 'priority_support'
  | 'white_label'
  | 'unlimited_squads'
  | 'unlimited_sessions'
  | 'recurring_sessions'
  | 'unlimited_history';

// Feature metadata
const FEATURE_INFO: Record<Feature, {
  name: string;
  description: string;
  requiredTier: SubscriptionTier;
  icon: string;
}> = {
  advanced_stats: {
    name: 'Statistiques avancées',
    description: 'Analyse détaillée de vos performances et de votre squad',
    requiredTier: 'premium',
    icon: '📊',
  },
  ai_suggestions: {
    name: 'Suggestions IA',
    description: 'Recommandations intelligentes de créneaux basées sur votre historique',
    requiredTier: 'premium',
    icon: '🧠',
  },
  calendar_export: {
    name: 'Export calendrier',
    description: 'Synchronisez vos sessions avec Google, Apple ou Outlook',
    requiredTier: 'premium',
    icon: '📅',
  },
  discord_bot_advanced: {
    name: 'Bot Discord avancé',
    description: 'Fonctionnalités avancées du bot Discord (auto-vocal, rappels, etc.)',
    requiredTier: 'premium',
    icon: '🤖',
  },
  custom_roles: {
    name: 'Rôles personnalisés',
    description: 'Créez des rôles Coach, Manager, Capitaine, etc.',
    requiredTier: 'premium',
    icon: '👑',
  },
  webhooks: {
    name: 'Webhooks',
    description: 'Intégrez Squad Planner avec vos outils externes',
    requiredTier: 'pro',
    icon: '🔗',
  },
  api_access: {
    name: 'Accès API',
    description: 'Accédez à l\'API pour des intégrations personnalisées',
    requiredTier: 'pro',
    icon: '🔌',
  },
  priority_support: {
    name: 'Support prioritaire',
    description: 'Réponse en moins de 24h garanti',
    requiredTier: 'pro',
    icon: '⚡',
  },
  white_label: {
    name: 'White Label',
    description: 'Personnalisez l\'interface à votre marque',
    requiredTier: 'enterprise',
    icon: '🏢',
  },
  unlimited_squads: {
    name: 'Squads illimitées',
    description: 'Créez autant de squads que vous voulez',
    requiredTier: 'premium',
    icon: '👥',
  },
  unlimited_sessions: {
    name: 'Sessions illimitées',
    description: 'Aucune limite sur le nombre de sessions par mois',
    requiredTier: 'pro',
    icon: '🎮',
  },
  recurring_sessions: {
    name: 'Sessions récurrentes',
    description: 'Planifiez des sessions automatiques chaque semaine',
    requiredTier: 'premium',
    icon: '🔄',
  },
  unlimited_history: {
    name: 'Historique illimité',
    description: 'Accédez à tout votre historique de sessions',
    requiredTier: 'pro',
    icon: '📚',
  },
};

// Tier hierarchy for comparison
const TIER_HIERARCHY: Record<SubscriptionTier, number> = {
  free: 0,
  premium: 1,
  pro: 2,
  enterprise: 3,
};

export interface FeatureGateResult {
  // Is the feature available to the user?
  isAvailable: boolean;

  // User's current tier
  currentTier: SubscriptionTier;

  // Required tier for this feature
  requiredTier: SubscriptionTier;

  // Feature info
  featureName: string;
  featureDescription: string;
  featureIcon: string;

  // Should show upgrade prompt?
  shouldShowUpgrade: boolean;

  // Check function that returns true if feature is available
  check: () => boolean;

  // Guard function that calls callback only if feature is available
  guard: <T>(callback: () => T, fallback?: T) => T | undefined;
}

export function useFeatureGate(feature: Feature): FeatureGateResult {
  const { subscription, limits, hasFeature, canCreateSquad, canCreateSession, canCreateRecurringSession } = useSubscription();

  const currentTier = subscription?.tier || 'free';
  const featureInfo = FEATURE_INFO[feature];
  const requiredTier = featureInfo.requiredTier;

  // Check if feature is available
  const checkAvailability = useCallback(() => {
    // Special cases for limit-based features
    switch (feature) {
      case 'unlimited_squads':
        return limits?.max_squads === -1;
      case 'unlimited_sessions':
        return limits?.max_sessions_per_month === -1;
      case 'recurring_sessions':
        return canCreateRecurringSession();
      case 'unlimited_history':
        return limits?.history_days === -1;
      default:
        // Boolean feature check
        return hasFeature(feature);
    }
  }, [feature, limits, hasFeature, canCreateRecurringSession]);

  const isAvailable = checkAvailability();
  const shouldShowUpgrade = !isAvailable && TIER_HIERARCHY[currentTier] < TIER_HIERARCHY[requiredTier];

  // Guard function
  const guard = useCallback(<T,>(callback: () => T, fallback?: T): T | undefined => {
    if (isAvailable) {
      return callback();
    }
    return fallback;
  }, [isAvailable]);

  return {
    isAvailable,
    currentTier,
    requiredTier,
    featureName: featureInfo.name,
    featureDescription: featureInfo.description,
    featureIcon: featureInfo.icon,
    shouldShowUpgrade,
    check: checkAvailability,
    guard,
  };
}

/**
 * Hook to check multiple features at once
 */
export function useFeatureGates(features: Feature[]): Record<Feature, FeatureGateResult> {
  const { subscription, limits, hasFeature, canCreateRecurringSession } = useSubscription();

  const currentTier = subscription?.tier || 'free';

  return features.reduce((acc, feature) => {
    const featureInfo = FEATURE_INFO[feature];
    const requiredTier = featureInfo.requiredTier;

    const checkAvailability = () => {
      switch (feature) {
        case 'unlimited_squads':
          return limits?.max_squads === -1;
        case 'unlimited_sessions':
          return limits?.max_sessions_per_month === -1;
        case 'recurring_sessions':
          return canCreateRecurringSession();
        case 'unlimited_history':
          return limits?.history_days === -1;
        default:
          return hasFeature(feature);
      }
    };

    const isAvailable = checkAvailability();
    const shouldShowUpgrade = !isAvailable && TIER_HIERARCHY[currentTier] < TIER_HIERARCHY[requiredTier];

    acc[feature] = {
      isAvailable,
      currentTier,
      requiredTier,
      featureName: featureInfo.name,
      featureDescription: featureInfo.description,
      featureIcon: featureInfo.icon,
      shouldShowUpgrade,
      check: checkAvailability,
      guard: <T,>(callback: () => T, fallback?: T): T | undefined => {
        if (isAvailable) return callback();
        return fallback;
      },
    };

    return acc;
  }, {} as Record<Feature, FeatureGateResult>);
}

export default useFeatureGate;
