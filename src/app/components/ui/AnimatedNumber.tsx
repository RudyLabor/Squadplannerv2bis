import { motion, useSpring, useTransform } from 'motion/react';
import { useEffect, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  decimals?: number;
  className?: string;
  duration?: number;
}

export function AnimatedNumber({ 
  value, 
  suffix = '', 
  decimals = 0,
  className = '',
  duration = 2
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  // Spring animation avec config premium
  const spring = useSpring(0, {
    stiffness: 50,
    damping: 30,
    mass: 0.5
  });

  const display = useTransform(spring, (latest) => {
    // Format le nombre avec les décimales appropriées
    const formatted = latest.toFixed(decimals);
    return formatted;
  });

  useEffect(() => {
    // Anime de 0 vers la valeur cible
    spring.set(value);
  }, [value, spring]);

  // Subscribe to display changes
  useEffect(() => {
    const unsubscribe = display.on('change', (latest) => {
      setDisplayValue(parseFloat(latest));
    });
    return unsubscribe;
  }, [display]);

  // Format pour affichage avec suffixe personnalisé (K, M, etc.)
  const formatNumber = (num: number): string => {
    if (suffix === 'K') {
      return (num / 1000).toFixed(1);
    }
    if (suffix === '%') {
      return Math.round(num).toString();
    }
    return Math.round(num).toString();
  };

  return (
    <motion.span 
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: 'spring',
        stiffness: 200,
        damping: 20,
        duration: 0.4
      }}
    >
      {formatNumber(displayValue)}{suffix}
    </motion.span>
  );
}
