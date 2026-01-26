import { motion, MotionProps } from 'motion/react';
import { ReactNode } from 'react';
import { fadeInUp, hoverLift, scrollRevealViewport, gpuAcceleration } from '@/app/utils/animations';

interface AnimatedCardProps extends Omit<MotionProps, 'children'> {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
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
  ...props 
}: AnimatedCardProps) {
  return (
    <motion.div
      className={className}
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