import { motion } from 'motion/react';

interface SpectacularLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dots' | 'ring' | 'pulse' | 'bars';
  color?: string;
}

/**
 * 🎭 Spectacular Loader - Loading states ultra-premium
 * Loaders animés avec effets spectaculaires
 * Niveau: Apple/Linear 2026
 */
export function SpectacularLoader({ 
  size = 'md', 
  variant = 'dots',
  color = 'var(--primary-500)' 
}: SpectacularLoaderProps) {
  const sizes = {
    sm: { container: 32, dot: 6, ring: 24, bar: 4 },
    md: { container: 48, dot: 8, ring: 36, bar: 6 },
    lg: { container: 64, dot: 12, ring: 48, bar: 8 },
  };

  const s = sizes[size];

  if (variant === 'dots') {
    return (
      <div className="flex items-center justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="rounded-full"
            style={{
              width: s.dot,
              height: s.dot,
              backgroundColor: color,
            }}
            animate={{
              y: [0, -s.dot * 2, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'ring') {
    return (
      <div className="relative" style={{ width: s.ring, height: s.ring }}>
        <motion.div
          className="absolute inset-0 rounded-full border-4"
          style={{
            borderColor: `${color}20`,
            borderTopColor: color,
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute inset-2 rounded-full"
          style={{
            background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className="relative" style={{ width: s.container, height: s.container }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: `${color}40`,
            }}
            animate={{
              scale: [0, 1.5],
              opacity: [0.8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeOut',
            }}
          />
        ))}
        <motion.div
          className="absolute inset-0 rounded-full m-auto"
          style={{
            width: s.dot * 2,
            height: s.dot * 2,
            backgroundColor: color,
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    );
  }

  if (variant === 'bars') {
    return (
      <div className="flex items-end justify-center gap-1" style={{ height: s.container }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="rounded-full"
            style={{
              width: s.bar,
              backgroundColor: color,
            }}
            animate={{
              height: [s.container * 0.3, s.container * 0.8, s.container * 0.3],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    );
  }

  return null;
}

/**
 * 🎨 Shimmer Loading - Skeleton avec shimmer effet
 */
export function ShimmerLoading({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-white/5 rounded-xl ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}

/**
 * 🌐 Loading Overlay - Full screen loader premium
 */
export function LoadingOverlay({ message = 'Chargement...' }: { message?: string }) {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-xl bg-black/60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col items-center gap-6">
        <SpectacularLoader size="lg" variant="ring" />
        <motion.p
          className="text-lg font-bold text-white"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {message}
        </motion.p>
      </div>
    </motion.div>
  );
}
