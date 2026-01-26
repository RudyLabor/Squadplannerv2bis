import { motion, MotionProps } from 'motion/react';
import { ReactNode } from 'react';
import { fadeIn, fadeInUp, fadeInLeft, fadeInRight, scrollRevealViewport, gpuAcceleration } from '@/app/utils/animations';

interface AnimatedSectionProps extends Omit<MotionProps, 'children'> {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right' | 'none';
  delay?: number;
}

/**
 * 📄 AnimatedSection - Section with directional reveal animation
 * 
 * Usage:
 * <AnimatedSection direction="up">
 *   <h2>Title</h2>
 *   <p>Content</p>
 * </AnimatedSection>
 */
export function AnimatedSection({ 
  children, 
  className = '',
  direction = 'up',
  delay = 0,
  ...props 
}: AnimatedSectionProps) {
  const variant = 
    direction === 'up' ? fadeInUp :
    direction === 'left' ? fadeInLeft :
    direction === 'right' ? fadeInRight :
    fadeIn;

  return (
    <motion.section
      className={className}
      variants={variant}
      initial="hidden"
      whileInView="visible"
      viewport={scrollRevealViewport}
      style={gpuAcceleration}
      transition={{
        delay,
      }}
      {...props}
    >
      {children}
    </motion.section>
  );
}
