import { motion, MotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { staggerContainer, fadeIn, scrollRevealViewport, gpuAcceleration } from '@/app/utils/animations';

interface AnimatedListProps extends Omit<MotionProps, 'children'> {
  children: ReactNode;
  className?: string;
  stagger?: number;
}

/**
 * 📋 AnimatedList - Container with staggered children animation
 * 
 * Usage:
 * <AnimatedList>
 *   <AnimatedListItem>Item 1</AnimatedListItem>
 *   <AnimatedListItem>Item 2</AnimatedListItem>
 * </AnimatedList>
 */
export function AnimatedList({ 
  children, 
  className = '',
  stagger = 0.1,
  ...props 
}: AnimatedListProps) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={scrollRevealViewport}
      style={gpuAcceleration}
      transition={{
        staggerChildren: stagger,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedListItemProps extends Omit<MotionProps, 'children'> {
  children: ReactNode;
  className?: string;
}

/**
 * 📌 AnimatedListItem - Individual list item with fade in
 */
export function AnimatedListItem({ 
  children, 
  className = '',
  ...props 
}: AnimatedListItemProps) {
  return (
    <motion.div
      className={className}
      variants={fadeIn}
      style={gpuAcceleration}
      {...props}
    >
      {children}
    </motion.div>
  );
}
