/**
 * 🎬 Animation Utilities
 * 
 * Reusable animation variants, easings, and helpers
 */

import { Variants, Transition } from 'motion/react';

// ============================================================
// GPU ACCELERATION
// ============================================================

export const gpuAcceleration = {
  willChange: 'transform, opacity',
  transform: 'translateZ(0)',
};

// ============================================================
// VIEWPORT SETTINGS (for scroll animations)
// ============================================================

export const scrollRevealViewport = {
  once: true,
  amount: 0.3,
  margin: '0px 0px -100px 0px',
};

// ============================================================
// EASINGS
// ============================================================

export const easings = {
  apple: [0.4, 0, 0.2, 1],
  smooth: [0.25, 0.46, 0.45, 0.94],
  bounce: [0.68, -0.55, 0.265, 1.55],
  elastic: [0.87, 0, 0.13, 1],
};

// ============================================================
// FADE ANIMATIONS
// ============================================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easings.apple,
    },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easings.apple,
    },
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: easings.apple,
    },
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: easings.apple,
    },
  },
};

// ============================================================
// STAGGER ANIMATIONS
// ============================================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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

// ============================================================
// HOVER ANIMATIONS
// ============================================================

export const hoverLift = {
  y: -4,
  scale: 1.01,
  transition: {
    duration: 0.3,
    ease: easings.apple,
  },
};

export const hoverScale = {
  scale: 1.03,
  transition: {
    duration: 0.3,
    ease: easings.apple,
  },
};

// Hover with Amber glow (primary color)
export const hoverGlow = {
  y: -4,
  scale: 1.01,
  boxShadow: '0 12px 40px rgba(245, 158, 11, 0.25)',
  transition: {
    duration: 0.3,
    ease: easings.apple,
  },
};

// Hover with Teal glow (secondary color)
export const hoverGlowTeal = {
  y: -4,
  scale: 1.01,
  boxShadow: '0 12px 40px rgba(20, 184, 166, 0.25)',
  transition: {
    duration: 0.3,
    ease: easings.apple,
  },
};

// ============================================================
// TAP ANIMATIONS
// ============================================================

export const tapScale = {
  scale: 0.97,
  transition: {
    duration: 0.15,
    ease: easings.apple,
  },
};

// ============================================================
// SLIDE ANIMATIONS
// ============================================================

export const slideInLeft: Variants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easings.apple,
    },
  },
};

export const slideInRight: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easings.apple,
    },
  },
};

// ============================================================
// SCALE ANIMATIONS
// ============================================================

export const scaleIn: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easings.bounce,
    },
  },
};

// ============================================================
// PARALLAX HELPERS
// ============================================================

export const parallaxVariants = {
  subtle: {
    y: [-20, 20],
  },
  medium: {
    y: [-40, 40],
  },
  strong: {
    y: [-60, 60],
  },
};

// ============================================================
// REDUCED MOTION SUPPORT
// ============================================================

export const reduceMotion = (animation: any) => {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return {
      ...animation,
      transition: { duration: 0.01 },
    };
  }
  return animation;
};
