import { motion } from 'motion/react';

interface PulseBadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'teal';
  pulseIntensity?: 'subtle' | 'normal' | 'strong';
  className?: string;
}

const variantClasses = {
  primary: 'bg-[var(--primary-500)] text-white shadow-[0_2px_8px_rgba(245,158,11,0.3)]',
  success: 'bg-[var(--success-500)] text-white shadow-[0_2px_8px_rgba(16,185,129,0.3)]',
  warning: 'bg-[var(--warning-500)] text-white shadow-[0_2px_8px_rgba(251,146,60,0.3)]',
  danger: 'bg-[var(--danger-500)] text-white shadow-[0_2px_8px_rgba(239,68,68,0.3)]',
  teal: 'bg-[var(--teal-500)] text-white shadow-[0_2px_8px_rgba(20,184,166,0.3)]'
};

const pulseAnimations = {
  subtle: {
    scale: [1, 1.03, 1],
    boxShadow: [
      '0 2px 8px rgba(0,0,0,0.15)',
      '0 4px 12px rgba(0,0,0,0.20)',
      '0 2px 8px rgba(0,0,0,0.15)'
    ]
  },
  normal: {
    scale: [1, 1.05, 1],
    boxShadow: [
      '0 2px 8px rgba(0,0,0,0.15)',
      '0 4px 16px rgba(0,0,0,0.25)',
      '0 2px 8px rgba(0,0,0,0.15)'
    ]
  },
  strong: {
    scale: [1, 1.1, 1],
    boxShadow: [
      '0 2px 8px rgba(0,0,0,0.15)',
      '0 6px 20px rgba(0,0,0,0.35)',
      '0 2px 8px rgba(0,0,0,0.15)'
    ]
  }
};

export function PulseBadge({
  children,
  variant = 'primary',
  pulseIntensity = 'normal',
  className = ''
}: PulseBadgeProps) {
  return (
    <motion.div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${variantClasses[variant]} ${className}`}
      animate={pulseAnimations[pulseIntensity]}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  );
}
