import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LevelProgressProps {
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  className?: string;
}

export function LevelProgress({ currentLevel, currentXP, xpToNextLevel, className = '' }: LevelProgressProps) {
  const [progress, setProgress] = useState(0);
  const percentage = Math.min((currentXP / xpToNextLevel) * 100, 100);

  useEffect(() => {
    // Animate progress on mount
    const timer = setTimeout(() => {
      setProgress(percentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className={className}>
      {/* Level info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Zap className="w-4 h-4" />
          </motion.div>
          <div>
            <div className="text-xs text-[var(--fg-tertiary)] font-bold uppercase tracking-wider">
              Niveau
            </div>
            <div className="text-lg font-black leading-none">
              {currentLevel}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-[var(--fg-tertiary)] font-medium">
            {currentXP.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP
          </div>
          <div className="text-sm font-black text-[var(--primary-500)]">
            {Math.round(percentage)}%
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 rounded-full overflow-hidden bg-[var(--bg-tertiary)]">
        {/* Background shimmer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Progress fill */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--primary-500)] via-[var(--secondary-500)] to-[var(--primary-500)] bg-[length:200%_100%]"
          initial={{ width: '0%' }}
          animate={{ 
            width: `${progress}%`,
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            width: { duration: 1.5, ease: 'easeOut', delay: 0.2 },
            backgroundPosition: { duration: 3, repeat: Infinity, ease: 'linear' }
          }}
        >
          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </motion.div>

        {/* Sparkles on progress */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full blur-[1px]"
            style={{
              left: `${Math.min(progress, 100)}%`,
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
              x: [-10, 0, 10],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Next level indicator */}
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-[var(--fg-tertiary)] font-medium">
          Niveau {currentLevel}
        </div>
        <motion.div 
          className="text-xs font-black text-[var(--primary-500)]"
          animate={{
            scale: percentage >= 100 ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 0.5,
            repeat: percentage >= 100 ? Infinity : 0,
            repeatDelay: 0.5,
          }}
        >
          Niveau {currentLevel + 1}
          {percentage >= 100 && ' 🎉'}
        </motion.div>
      </div>
    </div>
  );
}
