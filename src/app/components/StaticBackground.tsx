/**
 * STATIC BACKGROUND - Performance Optimized
 * Pure CSS gradients - NO JavaScript animations
 * GPU-accelerated via CSS transforms
 */

interface StaticBackgroundProps {
  variant?: 'home' | 'squads' | 'sessions' | 'profile' | 'detail' | 'default';
}

export function StaticBackground({ variant = 'default' }: StaticBackgroundProps) {
  // Color schemes per variant
  const colorSchemes = {
    home: {
      gradient1: 'rgba(94, 106, 210, 0.12)',
      gradient2: 'rgba(139, 92, 246, 0.08)',
    },
    squads: {
      gradient1: 'rgba(139, 92, 246, 0.12)',
      gradient2: 'rgba(94, 106, 210, 0.08)',
    },
    sessions: {
      gradient1: 'rgba(251, 146, 60, 0.10)',
      gradient2: 'rgba(139, 92, 246, 0.08)',
    },
    profile: {
      gradient1: 'rgba(74, 222, 128, 0.10)',
      gradient2: 'rgba(94, 106, 210, 0.08)',
    },
    detail: {
      gradient1: 'rgba(94, 106, 210, 0.08)',
      gradient2: 'rgba(139, 92, 246, 0.06)',
    },
    default: {
      gradient1: 'rgba(94, 106, 210, 0.10)',
      gradient2: 'rgba(139, 92, 246, 0.08)',
    },
  };

  const colors = colorSchemes[variant];

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: `
          radial-gradient(ellipse 80% 50% at 20% 20%, ${colors.gradient1} 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 80% 80%, ${colors.gradient2} 0%, transparent 50%),
          radial-gradient(ellipse 40% 60% at 50% 50%, ${colors.gradient1} 0%, transparent 60%)
        `,
      }}
    >
      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

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

/**
 * Minimal background for forms and modals
 */
export function MinimalBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 bg-[#0e0f11]"
      style={{
        background: `
          radial-gradient(ellipse 100% 100% at 50% 0%, rgba(94, 106, 210, 0.05) 0%, transparent 50%)
        `,
      }}
    />
  );
}
