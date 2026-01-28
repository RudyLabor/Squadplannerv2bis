import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Check, X, HelpCircle } from 'lucide-react';
import { useState } from 'react';

interface SwipeableRSVPProps {
  onResponse: (response: 'yes' | 'no' | 'maybe') => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export function SwipeableRSVP({ onResponse, children, disabled = false }: SwipeableRSVPProps) {
  const [swiping, setSwiping] = useState(false);
  const x = useMotionValue(0);
  
  // Opacity for action buttons
  const leftOpacity = useTransform(x, [-100, 0], [1, 0]);
  const rightOpacity = useTransform(x, [0, 100], [0, 1]);
  
  // Background color based on swipe
  const backgroundColor = useTransform(
    x,
    [-150, -50, 0, 50, 150],
    [
      'rgba(239, 68, 68, 0.15)',   // Red (No)
      'rgba(239, 68, 68, 0.05)',
      'rgba(255, 255, 255, 1)',     // White (Neutral)
      'rgba(16, 185, 129, 0.05)',
      'rgba(16, 185, 129, 0.15)'    // Green (Yes)
    ]
  );

  const handleDragEnd = (_: any, info: PanInfo) => {
    setSwiping(false);
    
    if (disabled) {
      x.set(0);
      return;
    }

    const threshold = 120;
    
    if (info.offset.x < -threshold) {
      // Swipe left = No
      onResponse('no');
      x.set(0);
    } else if (info.offset.x > threshold) {
      // Swipe right = Yes
      onResponse('yes');
      x.set(0);
    } else {
      // Return to center
      x.set(0);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Background action indicators */}
      <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none">
        {/* Left: No */}
        <motion.div
          className="flex items-center gap-2"
          style={{ opacity: leftOpacity }}
        >
          <div className="w-10 h-10 rounded-full bg-[var(--danger-500)] flex items-center justify-center">
            <X className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold text-[var(--danger-500)]">
            Pas dispo
          </span>
        </motion.div>
        
        {/* Right: Yes */}
        <motion.div
          className="flex items-center gap-2"
          style={{ opacity: rightOpacity }}
        >
          <span className="text-sm font-semibold text-[var(--success-500)]">
            Partant
          </span>
          <div className="w-10 h-10 rounded-full bg-[var(--success-500)] flex items-center justify-center">
            <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
        </motion.div>
      </div>

      {/* Swipeable card */}
      <motion.div
        drag={disabled ? false : 'x'}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragStart={() => setSwiping(true)}
        onDragEnd={handleDragEnd}
        style={{ 
          x,
          backgroundColor
        }}
        className="relative cursor-grab active:cursor-grabbing"
        whileTap={{ scale: swiping ? 0.98 : 1 }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30
        }}
      >
        {children}
      </motion.div>

      {/* Hint (first time only - you can control this with state) */}
      {!disabled && (
        <motion.div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm pointer-events-none"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: 10 }}
          transition={{ delay: 3, duration: 0.5 }}
        >
          <HelpCircle className="w-3 h-3 text-white/80" />
          <span className="text-xs text-white/80 font-medium">
            Swipe pour répondre
          </span>
        </motion.div>
      )}
    </div>
  );
}
