/**
 * ANIMATED BACKGROUND - Performance Optimized
 * Uses CSS animations instead of JS for infinite loops
 * GPU-accelerated, minimal CPU usage
 */

import { shouldReduceAnimations, isMobileDevice } from '@/utils/device';

interface AnimatedBackgroundProps {
  variant?: 'home' | 'squads' | 'sessions' | 'profile' | 'detail';
  intensity?: 'low' | 'medium' | 'high';
}

export function AnimatedBackground({ variant = 'home', intensity = 'medium' }: AnimatedBackgroundProps) {
  const reducedMotion = shouldReduceAnimations();
  const isMobile = isMobileDevice();

  // Color schemes per variant
  const colorSchemes = {
    home: {
      gradient1: 'rgba(94, 106, 210, 0.12)',
      gradient2: 'rgba(139, 92, 246, 0.08)',
      gradient3: 'rgba(248, 113, 113, 0.06)',
    },
    squads: {
      gradient1: 'rgba(139, 92, 246, 0.12)',
      gradient2: 'rgba(94, 106, 210, 0.08)',
      gradient3: 'rgba(74, 222, 128, 0.06)',
    },
    sessions: {
      gradient1: 'rgba(251, 146, 60, 0.10)',
      gradient2: 'rgba(248, 113, 113, 0.08)',
      gradient3: 'rgba(139, 92, 246, 0.06)',
    },
    profile: {
      gradient1: 'rgba(74, 222, 128, 0.10)',
      gradient2: 'rgba(94, 106, 210, 0.08)',
      gradient3: 'rgba(139, 92, 246, 0.06)',
    },
    detail: {
      gradient1: 'rgba(94, 106, 210, 0.08)',
      gradient2: 'rgba(139, 92, 246, 0.06)',
      gradient3: 'rgba(248, 113, 113, 0.04)',
    },
  };

  const colors = colorSchemes[variant];

  // Intensity affects opacity
  const opacityMultiplier = intensity === 'low' ? 0.6 : intensity === 'high' ? 1.2 : 1;

  // Static background for all - CSS only, no JS animations
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: `
          radial-gradient(ellipse 80% 50% at 20% 20%, ${colors.gradient1} 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 80% 80%, ${colors.gradient2} 0%, transparent 50%),
          radial-gradient(ellipse 70% 50% at 40% 60%, ${colors.gradient3} 0%, transparent 50%)
        `,
        opacity: opacityMultiplier,
      }}
    >
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(14, 15, 17, 0.4) 100%)',
        }}
      />
    </div>
  );
}

// Variant for hero sections
export function HeroBackground({ variant = 'home' }: Pick<AnimatedBackgroundProps, 'variant'>) {
  return <AnimatedBackground variant={variant} intensity="high" />;
}

// Minimal variant for detail pages
export function SubtleBackground({ variant = 'detail' }: Pick<AnimatedBackgroundProps, 'variant'>) {
  return <AnimatedBackground variant={variant} intensity="low" />;
}
