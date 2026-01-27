import { motion, MotionProps } from 'motion/react';
import { ReactNode } from 'react';
import { fadeInUp, hoverLift, scrollRevealViewport, gpuAcceleration } from '@/app/utils/animations';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
  threshold?: number;
  onClick?: () => void;
}

/**
 * 🎴 AnimatedCard - Card with scroll reveal + hover effects
 * 
 * Usage:
 * <AnimatedCard>
 *   <div>Your content</div>
 * </AnimatedCard>
 */
export function AnimatedCard({ 
  children, 
  className = '', 
  delay = 0,
  hover = true,
  onClick,
  ...props 
}: AnimatedCardProps) {
  return (
    <motion.div
      className={className}
      onClick={onClick}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={scrollRevealViewport}
      whileHover={hover ? hoverLift : undefined}
      style={{
        ...gpuAcceleration,
      }}
      transition={{
        delay,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}