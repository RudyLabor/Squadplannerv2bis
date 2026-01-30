/**
 * BADGE COMPONENT - LINEAR DESIGN SYSTEM
 * Uses hardcoded hex colors for consistency
 */

import { HTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================
type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'gray';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

// ============================================
// LINEAR STYLES
// ============================================
const baseStyles = `
  inline-flex items-center justify-center gap-1
  font-medium whitespace-nowrap
  transition-colors duration-100
`;

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[#27282b] text-[#f7f8f8]',
  primary: 'bg-[#5e6dd2]/20 text-[#8090f8]',
  success: 'bg-[#4caf81]/20 text-[#76e2ae]',
  warning: 'bg-[#f2c94c]/20 text-[#f2c94c]',
  error: 'bg-[#e5534b]/20 text-[#f87171]',
  gray: 'bg-[#1f2023] text-[#8b8d90]',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[10px] rounded',
  md: 'px-2 py-0.5 text-[11px] rounded-md',
  lg: 'px-2.5 py-1 text-[12px] rounded-md',
};

const dotStyles: Record<BadgeVariant, string> = {
  default: 'bg-[#8b8d90]',
  primary: 'bg-[#5e6dd2]',
  success: 'bg-[#4caf81]',
  warning: 'bg-[#f2c94c]',
  error: 'bg-[#e5534b]',
  gray: 'bg-[#8b8d90]',
};

// ============================================
// COMPONENT
// ============================================
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', dot, icon, className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {dot && (
          <span className={cn('w-1.5 h-1.5 rounded-full', dotStyles[variant])} />
        )}
        {icon && <span className="w-3.5 h-3.5 -ml-0.5">{icon}</span>}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// ============================================
// STATUS BADGE - Semantic variant
// ============================================
type StatusType = 'online' | 'offline' | 'busy' | 'away' | 'pending';

interface StatusBadgeProps extends Omit<BadgeProps, 'variant' | 'dot' | 'children'> {
  status: StatusType;
  showLabel?: boolean;
}

const statusConfig: Record<StatusType, { variant: BadgeVariant; label: string }> = {
  online: { variant: 'success', label: 'En ligne' },
  offline: { variant: 'gray', label: 'Hors ligne' },
  busy: { variant: 'error', label: 'Occupé' },
  away: { variant: 'warning', label: 'Absent' },
  pending: { variant: 'default', label: 'En attente' },
};

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, showLabel = true, ...props }, ref) => {
    const config = statusConfig[status];

    return (
      <Badge ref={ref} variant={config.variant} dot {...props}>
        {showLabel ? config.label : null}
      </Badge>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';

export default Badge;
