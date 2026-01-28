import { motion } from 'framer-motion';
import { useState } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface Ripple3DProps {
  color?: string;
  duration?: number;
  className?: string;
}

/**
 * 🌊 Ripple 3D - Effet d'onde cliquable ultra-moderne
 * Ondulations 3D au clic avec effet de profondeur
 * Niveau: Apple iOS 2026
 */
export function Ripple3D({ 
  color = 'rgba(91, 124, 255, 0.4)', 
  duration = 1.2,
  className = '' 
}: Ripple3DProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const createRipple = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y,
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, duration * 1000);
  };

  return (
    <div 
      className={`absolute inset-0 overflow-hidden rounded-inherit pointer-events-auto ${className}`}
      onClick={createRipple}
    >
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            backgroundColor: color,
            transformOrigin: 'center',
          }}
          initial={{ 
            width: 0, 
            height: 0, 
            opacity: 1,
            scale: 0,
            x: '-50%',
            y: '-50%',
          }}
          animate={{ 
            width: 400, 
            height: 400, 
            opacity: 0,
            scale: 2,
          }}
          transition={{ 
            duration,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      ))}
    </div>
  );
}
