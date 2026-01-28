import { motion, MotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { fadeInUp, gpuAcceleration } from '@/app/utils/animations';

interface AnimatedCardSimpleProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
  threshold?: number;
  onClick?: () => void;
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
  onClick,
  ...props 
}: AnimatedCardSimpleProps) {
  return (
    <motion.div
      className={className}
      onClick={onClick}
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
