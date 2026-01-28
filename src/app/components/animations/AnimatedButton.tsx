import { motion, MotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { hoverGlow, hoverGlowTeal, hoverScale, gpuAcceleration } from '@/app/utils/animations';

interface AnimatedButtonProps extends Omit<MotionProps, 'children'> {
  children: ReactNode;
  className?: string;
  variant?: 'glow' | 'glowTeal' | 'scale';
  onClick?: () => void;
}

/**
 * 🔘 AnimatedButton - Button with premium hover effects
 * 
 * Usage:
 * <AnimatedButton variant="glow">
 *   Click me
 * </AnimatedButton>
 */
export function AnimatedButton({ 
  children, 
  className = '',
  variant = 'glow',
  onClick,
  ...props 
}: AnimatedButtonProps) {
  const hoverEffect = 
    variant === 'glow' ? hoverGlow :
    variant === 'glowTeal' ? hoverGlowTeal :
    hoverScale;

  return (
    <motion.button
      className={className}
      whileHover={hoverEffect}
      whileTap={{ scale: 0.97 }}
      style={gpuAcceleration}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
}