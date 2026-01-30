/**
 * CARD COMPONENT - LINEAR DESIGN SYSTEM
 * Inspired by Linear.app - Dark, Minimal, Precise
 * Uses hardcoded hex colors for consistency
 */

import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================
type CardVariant = 'default' | 'elevated' | 'outlined' | 'ghost';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  variant?: CardVariant;
  padding?: CardPadding;
  interactive?: boolean;
  children?: ReactNode;
}

// ============================================
// LINEAR STYLES
// ============================================
const baseStyles = `
  relative rounded-xl overflow-hidden
  transition-all duration-100
`;

const variantStyles: Record<CardVariant, string> = {
  default: `
    bg-[#18191b]
    border border-[#27282b]
  `,
  elevated: `
    bg-[#1f2023]
    border border-[#2c2d30]
  `,
  outlined: `
    bg-transparent
    border border-[#27282b]
  `,
  ghost: `
    bg-[#18191b]/50
  `,
};

const paddingStyles: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
};

const interactiveStyles = `
  cursor-pointer
  hover:bg-[#1f2023] hover:border-[#363739]
  active:scale-[0.995]
`;

// Linear transition
const linearTransition = {
  duration: 0.1,
  ease: [0.25, 0.1, 0.25, 1],
};

// ============================================
// COMPONENT
// ============================================
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      interactive = false,
      className,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          paddingStyles[padding],
          interactive && interactiveStyles,
          className
        )}
        onClick={onClick}
        whileTap={interactive ? { scale: 0.995 } : undefined}
        transition={linearTransition}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

// ============================================
// SUB-COMPONENTS
// ============================================
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, description, action, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-start justify-between gap-3 mb-3', className)}
      {...props}
    >
      <div className="flex-1 min-w-0">
        <h3 className="text-[14px] font-semibold text-[#f7f8f8] truncate">
          {title}
        </h3>
        {description && (
          <p className="text-[12px] text-[#8b8d90] mt-0.5">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  )
);

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-2 mt-3 pt-3 border-t border-[#27282b]',
        className
      )}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';

export default Card;
