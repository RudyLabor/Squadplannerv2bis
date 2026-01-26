import { motion, MotionProps } from 'motion/react';
import { ReactNode } from 'react';
import { fadeInUp, scrollRevealViewport, gpuAcceleration } from '@/app/utils/animations';

interface AnimatedCardSimpleProps extends Omit<MotionProps, 'children'> {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
  threshold?: number;
}

/**
 * 🎴 AnimatedCardSimple - Simplified card with scroll reveal
 */
export function AnimatedCardSimple({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'up',
  threshold = 0.3,
  ...props 
}: AnimatedCardSimpleProps) {
  return (
    <motion.div
      className={className}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: threshold,
        margin: '0px 0px -50px 0px',
      }}
      style={gpuAcceleration}
      transition={{
        delay: delay / 1000, // Convert ms to seconds
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
