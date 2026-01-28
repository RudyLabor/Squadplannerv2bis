import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AnimatedProgressBarProps {
  value: number; // 0-100
  max?: number;
  height?: string;
  className?: string;
  showLabel?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'teal';
  variant?: 'default' | 'gradient';
}

const colorClasses = {
  primary: 'bg-[var(--primary-500)]',
  success: 'bg-[var(--success-500)]',
  warning: 'bg-[var(--warning-500)]',
  danger: 'bg-[var(--danger-500)]',
  teal: 'bg-[var(--teal-500)]'
};

const gradientClasses = {
  primary: 'bg-gradient-to-r from-[var(--primary-400)] to-[var(--primary-600)]',
  success: 'bg-gradient-to-r from-[var(--success-400)] to-[var(--success-600)]',
  warning: 'bg-gradient-to-r from-[var(--warning-400)] to-[var(--warning-600)]',
  danger: 'bg-gradient-to-r from-[var(--danger-400)] to-[var(--danger-600)]',
  teal: 'bg-gradient-to-r from-[var(--teal-400)] to-[var(--teal-600)]'
};

export function AnimatedProgressBar({
  value,
  max = 100,
  height = '8px',
  className = '',
  showLabel = false,
  color = 'primary',
  variant = 'default'
}: AnimatedProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    // Smooth count up animation
    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const percentage = Math.min((displayValue / max) * 100, 100);

  return (
    <div className={`w-full ${className}`}>
      <div 
        className="relative w-full rounded-full bg-[var(--bg-tertiary)] overflow-hidden"
        style={{ height }}
      >
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full ${
            variant === 'gradient' 
              ? gradientClasses[color] 
              : colorClasses[color]
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1] // EASE_STANDARD
          }}
        />
        
        {/* Shine effect */}
        <motion.div
          className="absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 1.5,
            delay: 0.2,
            ease: 'easeInOut'
          }}
        />
      </div>
      
      {showLabel && (
        <motion.div
          className="mt-2 text-sm font-semibold text-[var(--fg-secondary)] text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {Math.round(percentage)}%
        </motion.div>
      )}
    </div>
  );
}
