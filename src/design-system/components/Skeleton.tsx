/**
 * SKELETON COMPONENT - LINEAR DESIGN SYSTEM
 * Content-aware loading with Linear colors
 */

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================
type SkeletonVariant = 'rectangular' | 'circular' | 'text';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
}

// ============================================
// BASE SKELETON
// ============================================
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = 'rectangular', className, ...props }, ref) => {
    const baseStyles = `
      bg-gradient-to-r from-[#1e2024] via-[#26282d] to-[#1e2024]
      bg-[length:200%_100%]
      animate-skeleton
    `;

    const variantStyles: Record<SkeletonVariant, string> = {
      rectangular: 'rounded-lg',
      circular: 'rounded-full',
      text: 'rounded-md h-4',
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// ============================================
// SKELETON PRESETS
// ============================================

/**
 * Skeleton for a text line
 */
export const SkeletonText = ({ lines = 1, className }: { lines?: number; className?: string }) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        className={cn('h-4', i === lines - 1 && lines > 1 && 'w-3/4')}
      />
    ))}
  </div>
);

/**
 * Skeleton for an avatar
 */
export const SkeletonAvatar = ({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) => {
  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return <Skeleton variant="circular" className={cn(sizeStyles[size], className)} />;
};

/**
 * Skeleton for a standard card - Linear style
 */
export const SkeletonCard = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'p-4 rounded-xl border border-[#26282d] bg-[#141518]',
      className
    )}
  >
    <div className="flex items-center gap-3 mb-4">
      <SkeletonAvatar />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
    <SkeletonText lines={3} />
  </div>
);

/**
 * Skeleton for a list item
 */
export const SkeletonListItem = ({ className }: { className?: string }) => (
  <div className={cn('flex items-center gap-3 py-3', className)}>
    <SkeletonAvatar />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-24" />
    </div>
    <Skeleton className="h-8 w-20 rounded-lg" />
  </div>
);

/**
 * Skeleton for stats card - Linear style
 */
export const SkeletonStat = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'p-5 rounded-xl border border-[#26282d] bg-[#141518]',
      className
    )}
  >
    <div className="flex items-center gap-3 mb-3">
      <Skeleton className="h-8 w-8 rounded-lg" />
      <Skeleton className="h-3 w-16" />
    </div>
    <Skeleton className="h-7 w-16 mb-1" />
  </div>
);

/**
 * Full page skeleton loader - Linear style
 */
export const SkeletonPage = () => (
  <div className="p-6 space-y-6 animate-fade-in bg-[#0e0f11] min-h-screen">
    {/* Header */}
    <div className="space-y-1">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-7 w-32" />
    </div>

    {/* Stats row */}
    <div className="grid grid-cols-3 gap-4">
      <SkeletonStat />
      <SkeletonStat />
      <SkeletonStat />
    </div>

    {/* Cards */}
    <div className="space-y-3">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  </div>
);

export default Skeleton;
