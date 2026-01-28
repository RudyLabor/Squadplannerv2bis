import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface CelebrationProps {
  title: string;
  subtitle?: string;
  variant?: 'success' | 'achievement' | 'milestone';
  onComplete?: () => void;
  onEnd?: () => void; // Alias for compatibility
  duration?: number;
  className?: string;
}

export function Celebration({
  title,
  subtitle,
  variant = 'success',
  onComplete,
  onEnd,
  duration = 2000,
  className = ""
}: CelebrationProps) {
  
  const handleComplete = onComplete || onEnd;
  
  useEffect(() => {
    // Confetti animation based on variant
    const fireConfetti = () => {
      if (variant === 'success') {
        // Simple burst
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#14B8A6', '#10B981', '#3B82F6']
        });
      } else if (variant === 'achievement') {
        // Double burst
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      } else if (variant === 'milestone') {
        // Continuous rain
        const duration = 3000;
        const end = Date.now() + duration;
        
        const frame = () => {
          confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#F59E0B', '#14B8A6']
          });
          confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#F59E0B', '#14B8A6']
          });
          
          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };
        frame();
      }
    };

    fireConfetti();

    // Auto-complete after duration
    if (handleComplete) {
      const timer = setTimeout(handleComplete, duration);
      return () => clearTimeout(timer);
    }
  }, [variant, handleComplete, duration]);

  return (
    <motion.div
      className={`fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/50 backdrop-blur-sm ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="bg-white rounded-3xl p-8 max-w-sm mx-4 text-center shadow-2xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [0, 1.2, 1],
          opacity: 1
        }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.68, -0.55, 0.265, 1.55] // EASE_BOUNCE
        }}
      >
        {/* Checkmark icon */}
        <motion.div
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--success-500)] flex items-center justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.2,
            duration: 0.5,
            ease: [0.68, -0.55, 0.265, 1.55]
          }}
        >
          <Check className="w-10 h-10 text-white" strokeWidth={3} />
        </motion.div>

        {/* Title */}
        <motion.h2
          className="text-2xl font-semibold text-[var(--fg-primary)] mb-2 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          {title}
        </motion.h2>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            className="text-base text-[var(--fg-secondary)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}
