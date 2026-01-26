/**
 * 🌊 USE SCROLL REVEAL - Squad Planner 2026
 * Hook ultra-performant pour révéler les éléments au scroll
 * 
 * Features:
 * - IntersectionObserver natif (performance maximale)
 * - GPU acceleration automatique
 * - Threshold configurable
 * - Support du stagger
 */

import { useEffect, useRef, useState } from 'react';

interface UseScrollRevealOptions {
  /** Threshold de visibilité (0-1) */
  threshold?: number;
  /** Délai avant animation (ms) */
  delay?: number;
  /** Déclenchement unique ou répété */
  once?: boolean;
  /** Marge avant déclenchement */
  rootMargin?: string;
}

export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const {
    threshold = 0.15,
    delay = 0,
    once = true,
    rootMargin = '0px 0px -100px 0px',
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Si déjà visible et "once", skip
    if (isVisible && once) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Délai optionnel avant révélation
          if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay);
          } else {
            setIsVisible(true);
          }
          
          // Disconnect si "once"
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, delay, once, rootMargin, isVisible]);

  return { ref, isVisible };
}

/**
 * Hook pour parallax subtil
 */
export function useParallax(speed: number = 0.5) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * speed);
    };

    // Throttle pour performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [speed]);

  return offset;
}
