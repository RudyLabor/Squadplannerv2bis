// 📱 Device detection & animation optimization utilities

// Detect if user is on mobile device
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.innerWidth <= 768)
  );
};

// Detect if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Should we use reduced animations?
export const shouldReduceAnimations = (): boolean => {
  return isMobileDevice() || prefersReducedMotion();
};

// Get optimized animation config for current device
export const getAnimationConfig = () => {
  const reduce = shouldReduceAnimations();
  
  return {
    // Page transitions
    pageTransition: reduce 
      ? { duration: 0.15 }
      : { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] },
    
    // Hover effects
    hoverScale: reduce ? 1 : 1.02,
    
    // Spring physics
    spring: reduce
      ? { type: 'tween', duration: 0.15 }
      : { type: 'spring', stiffness: 400, damping: 30 },
    
    // Stagger delays
    stagger: reduce ? 0 : 0.05,
    
    // Background animations
    backgroundEnabled: !reduce,
    
    // Complex animations
    complexEnabled: !reduce,
    
    // Magnetic hover
    magneticEnabled: !reduce,
  };
};

// Optimized motion variants for mobile
export const mobileOptimizedVariants = {
  // Fade in/out only (no transform on mobile)
  fadeInOut: {
    initial: shouldReduceAnimations() 
      ? { opacity: 0 }
      : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
  },
  
  // Scale (reduced on mobile)
  scale: {
    initial: { scale: shouldReduceAnimations() ? 0.98 : 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: shouldReduceAnimations() ? 0.98 : 0.95, opacity: 0 },
  },
  
  // Slide (smaller distance on mobile)
  slideUp: {
    initial: { y: shouldReduceAnimations() ? 5 : 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: shouldReduceAnimations() ? -5 : -20, opacity: 0 },
  },
};

// Hook to get animation config
import { useEffect, useState } from 'react';

export const useAnimationConfig = () => {
  const [config, setConfig] = useState(getAnimationConfig());
  
  useEffect(() => {
    const handleResize = () => {
      setConfig(getAnimationConfig());
    };
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = () => {
      setConfig(getAnimationConfig());
    };
    
    window.addEventListener('resize', handleResize);
    mediaQuery.addEventListener('change', handleMotionChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);
  
  return config;
};
