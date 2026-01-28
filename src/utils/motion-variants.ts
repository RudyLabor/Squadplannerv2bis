/**
 * 🎬 Motion Variants & Easings
 * 
 * Premium animation variants for motion/react
 */

import { Variants } from 'framer-motion';

// ============================================================
// EASING FUNCTIONS
// ============================================================

export const easings = {
  apple: [0.4, 0, 0.2, 1], // Apple's signature easing
  smooth: [0.25, 0.46, 0.45, 0.94],
  bounce: [0.68, -0.55, 0.265, 1.55],
  elastic: [0.87, 0, 0.13, 1],
};

// ============================================================
// STAGGER CONTAINERS
// ============================================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easings.apple,
    },
  },
};
