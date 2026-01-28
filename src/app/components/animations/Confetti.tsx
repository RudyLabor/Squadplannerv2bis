import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  velocityX: number;
  velocityY: number;
  rotationSpeed: number;
}

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
  count?: number;
  colors?: string[];
}

/**
 * 🎉 Confetti Explosion - Effet célébration ultra-premium
 * Confettis qui explosent et tombent avec physique réaliste
 * Niveau: Stripe success animation 2026
 */
export function Confetti({ 
  active, 
  onComplete,
  count = 50,
  colors = ['#5B7CFF', '#9B6BFF', '#2BD67B', '#FFB020', '#FF5C9D']
}: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!active) {
      setPieces([]);
      return;
    }

    const newPieces = Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count;
      const velocity = 3 + Math.random() * 5;
      
      return {
        id: i,
        x: 50,
        y: 50,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocityX: Math.cos(angle) * velocity,
        velocityY: Math.sin(angle) * velocity,
        rotationSpeed: (Math.random() - 0.5) * 720,
      };
    });

    setPieces(newPieces);

    const timer = setTimeout(() => {
      setPieces([]);
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [active, count, colors, onComplete]);

  if (pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-3 h-3"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
          initial={{
            scale: 0,
            opacity: 1,
          }}
          animate={{
            x: `${piece.velocityX * 100}px`,
            y: [`${piece.velocityY * -50}px`, '100vh'],
            rotate: piece.rotation + piece.rotationSpeed,
            scale: [piece.scale, piece.scale * 0.8, 0],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 3,
            ease: 'easeIn',
            times: [0, 0.5, 1],
          }}
        />
      ))}
    </div>
  );
}
