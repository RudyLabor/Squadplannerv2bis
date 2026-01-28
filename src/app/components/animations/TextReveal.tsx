import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface TextRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  stagger?: number;
}

/**
 * 📝 Text Reveal - Animation de texte spectaculaire
 * Révélation mot par mot avec blur et slide
 * Niveau: Apple Keynote 2026
 */
export function TextReveal({ 
  children, 
  delay = 0, 
  className = '',
  stagger = 0.03 
}: TextRevealProps) {
  const text = typeof children === 'string' ? children : '';
  const words = text.split(' ');

  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ 
            opacity: 0, 
            y: 20,
            filter: 'blur(8px)',
          }}
          animate={{ 
            opacity: 1, 
            y: 0,
            filter: 'blur(0px)',
          }}
          transition={{
            duration: 0.5,
            delay: delay + (i * stagger),
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/**
 * 🎭 Text Appear - Animation simple de fade-in
 * Pour les paragraphes longs
 */
export function TextAppear({ 
  children, 
  delay = 0, 
  className = '' 
}: TextRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
