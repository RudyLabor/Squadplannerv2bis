/**
 * DIVIDER COMPONENT - LINEAR DESIGN SYSTEM
 * Subtle orange gradient divider for section separation
 */

import { cn } from '@/lib/utils';

interface DividerProps {
  className?: string;
  variant?: 'orange' | 'subtle' | 'strong';
}

/**
 * Orange gradient divider - use sparingly for visual accent
 */
export function OrangeDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-px bg-gradient-to-r from-transparent via-[#f5a623]/20 to-transparent",
        className
      )}
    />
  );
}

/**
 * Standard subtle divider
 */
export function Divider({ className, variant = 'subtle' }: DividerProps) {
  const variants = {
    orange: "bg-gradient-to-r from-transparent via-[#f5a623]/20 to-transparent",
    subtle: "bg-[#1e2024]",
    strong: "bg-[#26282d]",
  };

  return (
    <div
      className={cn(
        "h-px",
        variants[variant],
        className
      )}
    />
  );
}

export default Divider;
