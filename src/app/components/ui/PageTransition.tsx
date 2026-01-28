
import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const variants = {
  initial: { 
    opacity: 0, 
    x: 20, // Slide from right (subtle)
    scale: 0.98 // Slight zoom in
  },
  animate: { 
    opacity: 1, 
    x: 0, 
    scale: 1 
  },
  exit: { 
    opacity: 0, 
    x: -20, // Slide to left
    scale: 0.98,
    transition: { duration: 0.2 }
  }
};

const transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 1
} as const;

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={transition}
      className={`w-full min-h-screen ${className}`}
    >
      {children}
    </motion.div>
  );
};
