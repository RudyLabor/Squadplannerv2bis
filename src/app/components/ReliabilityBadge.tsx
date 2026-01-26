import { Trophy, Award, Zap, Ghost } from 'lucide-react';

interface ReliabilityBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showTooltip?: boolean;
}

export function ReliabilityBadge({
  score,
  size = 'md',
  showLabel = false,
  showTooltip = false,
}: ReliabilityBadgeProps) {
  // Determine badge tier
  const getBadge = (score: number) => {
    if (score >= 95) {
      return {
        tier: 'legendary',
        label: 'Leader Fiable',
        icon: Trophy,
        color: 'text-[var(--primary-600)]',
        bg: 'bg-[var(--primary-50)]',
        border: 'border-[var(--primary-200)]',
        emoji: '👑',
      };
    } else if (score >= 85) {
      return {
        tier: 'elite',
        label: 'Pilier de Squad',
        icon: Award,
        color: 'text-[var(--secondary-600)]',
        bg: 'bg-[var(--secondary-50)]',
        border: 'border-[var(--secondary-200)]',
        emoji: '⭐',
      };
    } else if (score >= 70) {
      return {
        tier: 'reliable',
        label: 'Joueur Fiable',
        icon: Zap,
        color: 'text-[var(--success-600)]',
        bg: 'bg-[var(--success-50)]',
        border: 'border-[var(--success-200)]',
        emoji: '✅',
      };
    } else if (score >= 50) {
      return {
        tier: 'unreliable',
        label: 'Incertain',
        icon: Ghost,
        color: 'text-[var(--warning-600)]',
        bg: 'bg-[var(--warning-50)]',
        border: 'border-[var(--warning-200)]',
        emoji: '⚠️',
      };
    } else {
      return {
        tier: 'ghost',
        label: 'Fantôme',
        icon: Ghost,
        color: 'text-[var(--danger-600)]',
        bg: 'bg-[var(--danger-50)]',
        border: 'border-[var(--danger-200)]',
        emoji: '👻',
      };
    }
  };

  const badge = getBadge(score);
  const Icon = badge.icon;

  const sizeClasses = {
    sm: {
      container: 'px-2 py-1',
      icon: 'w-3 h-3',
      text: 'text-xs',
      emoji: 'text-xs',
    },
    md: {
      container: 'px-3 py-1.5',
      icon: 'w-4 h-4',
      text: 'text-sm',
      emoji: 'text-sm',
    },
    lg: {
      container: 'px-4 py-2',
      icon: 'w-5 h-5',
      text: 'text-base',
      emoji: 'text-base',
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className="relative inline-block group">
      <div
        className={`flex items-center gap-1.5 rounded-full ${badge.bg} border-[0.5px] ${badge.border} ${classes.container}`}
      >
        <span className={classes.emoji}>{badge.emoji}</span>
        <span className={`${classes.text} font-bold ${badge.color}`}>{score}%</span>
        {showLabel && (
          <span className={`${classes.text} font-semibold ${badge.color}`}>
            {badge.label}
          </span>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          <div className="bg-[var(--fg-primary)] text-white text-xs font-semibold px-3 py-2 rounded-xl whitespace-nowrap shadow-lg">
            {badge.label} • {score}% de présence
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
              <div className="w-2 h-2 bg-[var(--fg-primary)] rotate-45" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
