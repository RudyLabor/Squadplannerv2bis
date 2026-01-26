import { motion } from 'motion/react';
import { useRef, useState, ReactNode } from 'react';
import { shouldReduceAnimations } from '@/utils/device';

interface MagneticHoverProps {
  children: ReactNode;
  strength?: number;
}

export function MagneticHover({ children, strength = 0.3 }: MagneticHoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const reducedMotion = shouldReduceAnimations();
  
  // Disable magnetic effect on mobile or with reduced motion
  if (reducedMotion) {
    return <div className="inline-block">{children}</div>;
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={position}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="inline-block gpu-accelerated"
      style={{ willChange: 'transform' }}
    >
      {children}
    </motion.div>
  );
}