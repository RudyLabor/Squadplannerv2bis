import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCountdownString, getRelativeTimeString, isSessionSoon } from '@/utils/dateUtils';
import { Clock, Zap } from 'lucide-react';

interface CountdownProps {
  targetDate: Date | string;
  variant?: 'full' | 'compact' | 'inline';
  showIcon?: boolean;
  onComplete?: () => void;
  className?: string;
}

export function Countdown({ 
  targetDate, 
  variant = 'full',
  showIcon = true,
  onComplete,
  className = ''
}: CountdownProps) {
  const [timeString, setTimeString] = useState('');
  const [relativeTime, setRelativeTime] = useState('');
  const [isSoon, setIsSoon] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const countdown = getCountdownString(targetDate);
      const relative = getRelativeTimeString(targetDate);
      const soon = isSessionSoon(targetDate);
      
      setTimeString(countdown);
      setRelativeTime(relative);
      setIsSoon(soon);

      // Vérifier si terminé
      if (countdown === "00:00:00" && !isComplete) {
        setIsComplete(true);
        onComplete?.();
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onComplete, isComplete]);

  // Inline variant - juste le texte relatif
  if (variant === 'inline') {
    return (
      <span className={`inline-flex items-center gap-1 ${className}`}>
        {showIcon && <Clock className="w-3.5 h-3.5 opacity-60" />}
        <span className="font-medium">{relativeTime}</span>
      </span>
    );
  }

  // Compact variant - timer simple
  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        {showIcon && (
          <div className={`p-1.5 rounded-lg ${isSoon ? 'bg-[var(--warning-500)]/10' : 'bg-white/5'}`}>
            {isSoon ? (
              <Zap className="w-4 h-4 text-[var(--warning-500)]" />
            ) : (
              <Clock className="w-4 h-4 text-[var(--fg-tertiary)]" />
            )}
          </div>
        )}
        <div className="flex flex-col leading-tight">
          <span className={`text-sm font-mono font-bold ${isSoon ? 'text-[var(--warning-500)]' : 'text-[var(--fg-primary)]'}`}>
            {timeString}
          </span>
          <span className="text-[10px] text-[var(--fg-tertiary)]">{relativeTime}</span>
        </div>
      </div>
    );
  }

  // Full variant - carte avec animation
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background glow si "bientôt" */}
      <AnimatePresence>
        {isSoon && (
          <motion.div
            className="absolute inset-0 rounded-2xl blur-2xl opacity-30 pointer-events-none"
            style={{ background: 'radial-gradient(circle, var(--warning-500) 0%, transparent 70%)' }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.3 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Carte */}
      <div className={`relative glass-3 rounded-2xl p-6 border ${isSoon ? 'border-[var(--warning-500)]/30' : 'border-white/10'}`}>
        {/* Badge "Démarre bientôt" */}
        <AnimatePresence>
          {isSoon && (
            <motion.div
              className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[var(--warning-500)]/10 border border-[var(--warning-500)]/30"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <div className="flex items-center gap-1.5">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-[var(--warning-500)]"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--warning-500)]">
                  Bientôt
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Icône */}
        {showIcon && (
          <motion.div
            className={`inline-flex p-3 rounded-xl mb-4 ${isSoon ? 'bg-[var(--warning-500)]/10' : 'bg-white/5'}`}
            animate={isSoon ? {
              scale: [1, 1.05, 1],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {isSoon ? (
              <Zap className="w-6 h-6 text-[var(--warning-500)]" />
            ) : (
              <Clock className="w-6 h-6 text-[var(--primary-500)]" />
            )}
          </motion.div>
        )}

        {/* Timer - Chiffres animés */}
        <div className="flex items-center gap-1.5 mb-2">
          {timeString.split('').map((char, index) => (
            <motion.span
              key={`${char}-${index}`}
              className={`
                font-mono font-black text-4xl
                ${char === ':' ? 'text-[var(--fg-tertiary)] opacity-50' : isSoon ? 'text-[var(--warning-500)]' : 'text-[var(--fg-primary)]'}
              `}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* Texte relatif */}
        <p className="text-sm font-medium text-[var(--fg-secondary)]">
          {relativeTime}
        </p>

        {/* Barre de progression (optionnel - pour les sessions < 24h) */}
        {isSoon && (
          <div className="mt-4">
            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[var(--warning-500)] to-[var(--error-500)]"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Export variantes
export function InlineCountdown({ targetDate, className = '' }: { targetDate: Date | string, className?: string }) {
  return <Countdown targetDate={targetDate} variant="inline" className={className} />;
}

export function CompactCountdown({ targetDate, className = '' }: { targetDate: Date | string, className?: string }) {
  return <Countdown targetDate={targetDate} variant="compact" className={className} />;
}
