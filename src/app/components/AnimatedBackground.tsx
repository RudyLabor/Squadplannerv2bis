import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { shouldReduceAnimations, isMobileDevice } from '@/utils/device';

interface AnimatedBackgroundProps {
  variant?: 'home' | 'squads' | 'sessions' | 'profile' | 'detail';
  intensity?: 'low' | 'medium' | 'high';
}

export function AnimatedBackground({ variant = 'home', intensity = 'medium' }: AnimatedBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number }>>([]);
  
  const reducedMotion = shouldReduceAnimations();
  const isMobile = isMobileDevice();

  // Track mouse for parallax effects - DISABLED ON MOBILE
  useEffect(() => {
    if (isMobile || reducedMotion) return; // Skip on mobile
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile, reducedMotion]);

  // Generate floating particles - REDUCED ON MOBILE
  useEffect(() => {
    if (reducedMotion) {
      setParticles([]); // No particles if reduced motion
      return;
    }
    
    // Drastically reduce particles on mobile
    const baseCount = intensity === 'low' ? 8 : intensity === 'medium' ? 15 : 25;
    const particleCount = isMobile ? Math.min(baseCount, 5) : baseCount;
    
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (isMobile ? 200 : 300) + 100,
      duration: Math.random() * (isMobile ? 30 : 20) + 15, // Slower on mobile
    }));
    setParticles(newParticles);
  }, [intensity, isMobile, reducedMotion]);

  // Color schemes per variant
  const colorSchemes = {
    home: {
      gradient1: 'rgba(91, 124, 255, 0.15)',
      gradient2: 'rgba(155, 107, 255, 0.12)',
      gradient3: 'rgba(255, 92, 157, 0.10)',
      accent: 'rgba(91, 124, 255, 0.25)',
    },
    squads: {
      gradient1: 'rgba(155, 107, 255, 0.15)',
      gradient2: 'rgba(91, 124, 255, 0.12)',
      gradient3: 'rgba(43, 214, 123, 0.10)',
      accent: 'rgba(155, 107, 255, 0.25)',
    },
    sessions: {
      gradient1: 'rgba(255, 176, 32, 0.12)',
      gradient2: 'rgba(255, 92, 157, 0.10)',
      gradient3: 'rgba(155, 107, 255, 0.10)',
      accent: 'rgba(255, 176, 32, 0.20)',
    },
    profile: {
      gradient1: 'rgba(43, 214, 123, 0.12)',
      gradient2: 'rgba(91, 124, 255, 0.10)',
      gradient3: 'rgba(155, 107, 255, 0.08)',
      accent: 'rgba(43, 214, 123, 0.20)',
    },
    detail: {
      gradient1: 'rgba(91, 124, 255, 0.10)',
      gradient2: 'rgba(155, 107, 255, 0.08)',
      gradient3: 'rgba(255, 92, 157, 0.08)',
      accent: 'rgba(91, 124, 255, 0.18)',
    },
  };

  const colors = colorSchemes[variant];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient mesh - STATIC ON MOBILE */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, ${colors.gradient1} 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${colors.gradient2} 0%, transparent 50%),
            radial-gradient(circle at 40% 70%, ${colors.gradient3} 0%, transparent 50%),
            radial-gradient(circle at 90% 80%, ${colors.gradient1} 0%, transparent 50%)
          `,
        }}
        animate={reducedMotion ? {} : {
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating gradient orbs - REDUCED ON MOBILE */}
      {!reducedMotion && particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full blur-[80px]"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: `radial-gradient(circle, ${colors.accent} 0%, transparent 70%)`,
            willChange: 'transform, opacity', // GPU acceleration hint
          }}
          animate={{
            x: [0, Math.random() * (isMobile ? 50 : 100) - (isMobile ? 25 : 50), 0],
            y: [0, Math.random() * (isMobile ? 50 : 100) - (isMobile ? 25 : 50), 0],
            scale: [1, isMobile ? 1.1 : 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Grid overlay - DISABLED ON MOBILE */}
      {!isMobile && (
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(91, 124, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(91, 124, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
          animate={reducedMotion ? {} : {
            backgroundPosition: ['0px 0px', '60px 60px'],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}

      {/* Scanline effect - DISABLED ON MOBILE */}
      {!isMobile && !reducedMotion && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(transparent 50%, rgba(91, 124, 255, 0.02) 50%)',
            backgroundSize: '100% 4px',
          }}
          animate={{
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Light rays from corners - DISABLED ON MOBILE */}
      {!isMobile && !reducedMotion && (
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background: `
              conic-gradient(from 45deg at 0% 0%, ${colors.accent} 0%, transparent 25%),
              conic-gradient(from 225deg at 100% 100%, ${colors.gradient2} 0%, transparent 25%)
            `,
            opacity: 0.4,
          }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Parallax effect layer - DISABLED ON MOBILE */}
      {!isMobile && !reducedMotion && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%, ${colors.accent} 0%, transparent 40%)`,
            willChange: 'transform',
          }}
          animate={{
            x: mousePosition.x * 20,
            y: mousePosition.y * 20,
          }}
          transition={{
            type: 'spring',
            stiffness: 50,
            damping: 30,
          }}
        />
      )}

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette effect */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(10, 14, 26, 0.4) 100%)',
        }}
      />

      {/* Animated mesh gradient - DISABLED ON MOBILE */}
      {!isMobile && !reducedMotion && (
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
          <g filter="url(#goo)">
            <motion.circle
              cx="20%"
              cy="30%"
              r="150"
              fill={colors.gradient1}
              animate={{
                cx: ['20%', '25%', '20%'],
                cy: ['30%', '35%', '30%'],
                r: [150, 180, 150],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.circle
              cx="80%"
              cy="70%"
              r="200"
              fill={colors.gradient2}
              animate={{
                cx: ['80%', '75%', '80%'],
                cy: ['70%', '65%', '70%'],
                r: [200, 230, 200],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 2,
              }}
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="180"
              fill={colors.gradient3}
              animate={{
                cx: ['50%', '55%', '50%'],
                cy: ['50%', '45%', '50%'],
                r: [180, 210, 180],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 4,
              }}
            />
          </g>
        </svg>
      )}

      {/* Shimmer waves - DISABLED ON MOBILE */}
      {!isMobile && !reducedMotion && (
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 100px,
                ${colors.accent} 100px,
                ${colors.accent} 101px
              )
            `,
          }}
          animate={{
            backgroundPosition: ['0px 0px', '200px 200px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </div>
  );
}

// Variant for hero sections with more intense effects
export function HeroBackground({ variant = 'home' }: Pick<AnimatedBackgroundProps, 'variant'>) {
  const reducedMotion = shouldReduceAnimations();
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatedBackground variant={variant} intensity="high" />
      
      {/* Additional spotlight effect for hero - DISABLED ON MOBILE */}
      {!reducedMotion && (
        <motion.div
          className="absolute top-0 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background: 'radial-gradient(circle, rgba(91, 124, 255, 0.15) 0%, transparent 60%)',
            filter: 'blur(60px)',
            willChange: 'transform, opacity',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </div>
  );
}

// Minimal variant for detail pages
export function SubtleBackground({ variant = 'detail' }: Pick<AnimatedBackgroundProps, 'variant'>) {
  return <AnimatedBackground variant={variant} intensity="low" />;
}