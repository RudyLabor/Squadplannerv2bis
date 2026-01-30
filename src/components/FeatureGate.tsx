/**
 * Feature Gate Component - Phase 4 Monetization
 *
 * Conditionally renders content based on subscription tier
 * Shows upgrade prompt for locked features
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Crown, Sparkles, ArrowRight } from 'lucide-react';
import { useFeatureGate, Feature } from '@/hooks/useFeatureGate';

interface FeatureGateProps {
  feature: Feature;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
  onUpgrade?: () => void;
  className?: string;
}

/**
 * Wrap content that requires a premium feature
 * Shows locked state or upgrade prompt for free users
 */
export function FeatureGate({
  feature,
  children,
  fallback,
  showUpgradePrompt = true,
  onUpgrade,
  className = '',
}: FeatureGateProps) {
  const gate = useFeatureGate(feature);

  // Feature is available - render children
  if (gate.isAvailable) {
    return <>{children}</>;
  }

  // Feature is locked - show fallback or upgrade prompt
  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  return (
    <UpgradePrompt
      featureName={gate.featureName}
      featureDescription={gate.featureDescription}
      featureIcon={gate.featureIcon}
      requiredTier={gate.requiredTier}
      onUpgrade={onUpgrade}
      className={className}
    />
  );
}

/**
 * Upgrade Prompt Component
 */
interface UpgradePromptProps {
  featureName: string;
  featureDescription: string;
  featureIcon: string;
  requiredTier: string;
  onUpgrade?: () => void;
  className?: string;
  compact?: boolean;
}

export function UpgradePrompt({
  featureName,
  featureDescription,
  featureIcon,
  requiredTier,
  onUpgrade,
  className = '',
  compact = false,
}: UpgradePromptProps) {
  const tierLabel = {
    premium: 'Premium',
    pro: 'Pro',
    enterprise: 'Enterprise',
  }[requiredTier] || 'Premium';

  if (compact) {
    return (
      <motion.button
        onClick={onUpgrade}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Lock className="w-4 h-4 text-amber-400" />
        <span className="text-sm font-medium text-amber-400">
          {tierLabel}
        </span>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-amber-500/20 backdrop-blur-sm ${className}`}
    >
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl" />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <motion.div
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {featureIcon}
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {tierLabel} requis
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">
              {featureName}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-white/60 mb-6">
          {featureDescription}
        </p>

        {/* CTA */}
        <motion.button
          onClick={onUpgrade}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <Crown className="w-5 h-5" />
          Passer à {tierLabel}
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

/**
 * Premium Badge Component
 * Shows a badge indicating premium-only content
 */
interface PremiumBadgeProps {
  tier?: 'premium' | 'pro' | 'enterprise';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PremiumBadge({ tier = 'premium', size = 'sm', className = '' }: PremiumBadgeProps) {
  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  const labels = {
    premium: 'Premium',
    pro: 'Pro',
    enterprise: 'Enterprise',
  };

  return (
    <motion.span
      className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold ${sizes[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
    >
      <Sparkles className={size === 'sm' ? 'w-2.5 h-2.5' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} />
      {labels[tier]}
    </motion.span>
  );
}

/**
 * Feature Locked Overlay
 * Shows a blur overlay with lock icon for locked content
 */
interface FeatureLockedOverlayProps {
  feature: Feature;
  onUpgrade?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function FeatureLockedOverlay({
  feature,
  onUpgrade,
  children,
  className = '',
}: FeatureLockedOverlayProps) {
  const gate = useFeatureGate(feature);

  if (gate.isAvailable) {
    return <>{children}</>;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Blurred content */}
      <div className="filter blur-sm opacity-50 pointer-events-none">
        {children}
      </div>

      {/* Lock overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-[2px] rounded-xl"
      >
        <motion.button
          onClick={onUpgrade}
          className="flex flex-col items-center gap-3 p-6"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/30"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Lock className="w-8 h-8 text-white" />
          </motion.div>
          <div className="text-center">
            <p className="text-white font-bold mb-1">{gate.featureName}</p>
            <span className="text-xs text-amber-400 font-medium">
              Disponible en {gate.requiredTier === 'premium' ? 'Premium' : gate.requiredTier === 'pro' ? 'Pro' : 'Enterprise'}
            </span>
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}

/**
 * Usage Limit Warning
 * Shows a warning when approaching usage limits
 */
interface UsageLimitWarningProps {
  current: number;
  max: number;
  label: string;
  onUpgrade?: () => void;
  className?: string;
}

export function UsageLimitWarning({
  current,
  max,
  label,
  onUpgrade,
  className = '',
}: UsageLimitWarningProps) {
  // Don't show if unlimited (-1) or plenty of room
  if (max === -1 || current < max * 0.8) {
    return null;
  }

  const percentage = (current / max) * 100;
  const isAtLimit = current >= max;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className={`p-4 rounded-xl ${isAtLimit ? 'bg-red-500/20 border border-red-500/30' : 'bg-amber-500/20 border border-amber-500/30'} ${className}`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {isAtLimit ? (
                <Lock className="w-4 h-4 text-red-400" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-400" />
              )}
              <span className={`text-sm font-medium ${isAtLimit ? 'text-red-400' : 'text-amber-400'}`}>
                {isAtLimit ? `Limite ${label} atteinte` : `${label}: ${current}/${max}`}
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${isAtLimit ? 'bg-red-500' : 'bg-amber-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentage, 100)}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
          {onUpgrade && (
            <motion.button
              onClick={onUpgrade}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Upgrade
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default FeatureGate;
