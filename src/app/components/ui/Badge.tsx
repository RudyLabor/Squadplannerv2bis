import { memo, ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

const BadgeComponent = ({ 
  children, 
  variant = 'neutral',
  size = 'md',
  className = '' 
}: BadgeProps) => {
  const variantStyles = {
    primary: 'bg-[var(--primary-500)]/12 text-[var(--primary-500)]',
    success: 'bg-[var(--success-500)]/12 text-[var(--success-500)]',
    warning: 'bg-[var(--warning-500)]/12 text-[var(--warning-500)]',
    danger: 'bg-[var(--destructive-500)]/12 text-[var(--destructive-500)]',
    neutral: 'glass-2 text-[var(--fg-secondary)]'
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[var(--text-xs)]',
    md: 'px-2.5 py-1 text-[var(--text-sm)]'
  };

  return (
    <span className={`
      inline-flex items-center justify-center gap-1
      rounded-lg font-medium
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${className}
    `}>
      {children}
    </span>
  );
};

BadgeComponent.displayName = 'Badge';

export const Badge = memo(BadgeComponent);
