/**
 * BUTTON COMPONENT - LINEAR DESIGN SYSTEM
 * Inspired by Linear.app - Compact, Precise, Premium
 * Uses hardcoded hex colors for consistency
 */

import { forwardRef, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'success';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
}

// ============================================
// LINEAR COLORS
// ============================================
const colors = {
  primary: '#5e6dd2',
  primaryHover: '#6a79db',
  primaryActive: '#4f5cb8',
  bgSurface: '#18191b',
  bgHover: '#1f2023',
  bgActive: '#27282b',
  border: '#27282b',
  borderHover: '#363739',
  fgPrimary: '#f7f8f8',
  fgSecondary: '#8b8d90',
  error: '#e5534b',
  errorHover: '#d13d35',
  success: '#4caf81',
  successHover: '#2e9a6a',
};

// ============================================
// LINEAR STYLES
// ============================================
const baseStyles = `
  relative inline-flex items-center justify-center gap-1.5
  font-medium transition-all duration-100
  disabled:opacity-40 disabled:cursor-not-allowed
  focus-visible:outline-none
  active:scale-[0.98]
`;

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-[#5e6dd2] text-white
    hover:bg-[#6a79db]
    active:bg-[#4f5cb8]
    focus-visible:ring-2 focus-visible:ring-[#5e6dd2]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090a]
  `,
  secondary: `
    bg-[#18191b] text-[#f7f8f8]
    border border-[#27282b]
    hover:bg-[#1f2023] hover:border-[#363739]
    active:bg-[#27282b]
  `,
  ghost: `
    bg-transparent text-[#8b8d90]
    hover:bg-[#1f2023] hover:text-[#f7f8f8]
    active:bg-[#27282b]
  `,
  destructive: `
    bg-[#e5534b] text-white
    hover:bg-[#d13d35]
    active:bg-[#b72d26]
    focus-visible:ring-2 focus-visible:ring-[#e5534b]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090a]
  `,
  success: `
    bg-[#4caf81] text-white
    hover:bg-[#2e9a6a]
    active:bg-[#1f7d54]
    focus-visible:ring-2 focus-visible:ring-[#4caf81]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090a]
  `,
};

// Linear compact sizes
const sizeStyles: Record<ButtonSize, string> = {
  xs: 'h-6 px-2 text-[11px] rounded gap-1',
  sm: 'h-7 px-2.5 text-[12px] rounded gap-1',
  md: 'h-8 px-3 text-[13px] rounded-lg gap-1.5',
  lg: 'h-9 px-4 text-[13px] rounded-lg gap-2',
};

const iconSizeStyles: Record<ButtonSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-4 h-4',
};

// ============================================
// LINEAR MOTION
// ============================================
const linearTransition = {
  duration: 0.1,
  ease: [0.25, 0.1, 0.25, 1],
};

// ============================================
// COMPONENT
// ============================================
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      iconRight,
      loading = false,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        whileTap={{ scale: isDisabled ? 1 : 0.98 }}
        transition={linearTransition}
        {...props}
      >
        {loading ? (
          <Loader2 className={cn(iconSizeStyles[size], 'animate-spin')} />
        ) : icon ? (
          <span className={cn(iconSizeStyles[size], 'flex-shrink-0')}>{icon}</span>
        ) : null}

        {children && <span className="truncate">{children}</span>}

        {iconRight && !loading && (
          <span className={cn(iconSizeStyles[size], 'flex-shrink-0')}>{iconRight}</span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

// ============================================
// ICON BUTTON VARIANT
// ============================================
interface IconButtonProps extends Omit<ButtonProps, 'children' | 'iconRight'> {
  'aria-label': string;
}

const iconOnlySizeStyles: Record<ButtonSize, string> = {
  xs: 'w-6 h-6 p-0',
  sm: 'w-7 h-7 p-0',
  md: 'w-8 h-8 p-0',
  lg: 'w-9 h-9 p-0',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'ghost', size = 'md', icon, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        icon={icon}
        className={cn(iconOnlySizeStyles[size], className)}
        {...props}
      />
    );
  }
);

IconButton.displayName = 'IconButton';

export default Button;
