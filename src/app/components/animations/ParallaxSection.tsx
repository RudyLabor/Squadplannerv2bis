import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';
import { gpuAcceleration } from '@/app/utils/animations';

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number; // 0.1 = slow, 1 = normal, 2 = fast
  enableFade?: boolean;
}

/**
 * 🌊 ParallaxSection - Section with parallax scroll effect
 * 
 * Usage:
 * <ParallaxSection speed={0.5}>
 *   <h1>Parallax Title</h1>
 * </ParallaxSection>
 */
export function ParallaxSection({ 
  children, 
  className = '',
  speed = 0.5,
  enableFade = false,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Parallax offset
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);
  
  // Optional fade effect
  const opacity = enableFade 
    ? useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3])
    : 1;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        y,
        opacity,
        ...gpuAcceleration,
      }}
    >
      {children}
    </motion.div>
  );
}
