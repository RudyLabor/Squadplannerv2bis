import { motion } from 'motion/react';
import { usePerformanceDebug } from '@/app/hooks/usePerformanceMonitor';

interface LogoProps {
  variant?: 'full' | 'icon' | 'header';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
  onNavigate?: (screen: string) => void;
}

export function Logo({ 
  variant = 'full', 
  size = 'md', 
  animated = false,
  className = '',
  onNavigate
}: LogoProps) {
  const { handleSecretTap, isMonitoring } = usePerformanceDebug();
  
  // Header variant - MINIMALISTE 2026
  if (variant === 'header') {
    return (
      <motion.button
        onClick={(e) => {
          // Secret tap for performance monitoring
          handleSecretTap();
          // Navigate to home if onNavigate is provided
          if (onNavigate) {
            onNavigate('home');
          }
        }}
        className={`relative inline-flex items-center gap-1.5 ${className} cursor-pointer`}
        whileHover={animated ? { scale: 1.02 } : undefined}
      >
        {/* Point vert menthe subtil - Animé si monitoring actif */}
        <div 
          className={`w-1.5 h-1.5 rounded-full ${
            isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-[var(--primary-500)]'
          }`} 
        />
        
        {/* Text ultra épuré */}
        <div className="flex items-baseline gap-1">
          <span className="text-base font-normal font-body text-[var(--fg-primary)] tracking-tight">
            Squad
          </span>
          <span className="text-xs font-normal font-body text-[var(--fg-tertiary)] tracking-wide">
            Planner
          </span>
        </div>
      </motion.button>
    );
  }

  // Icon variant - Point simple
  if (variant === 'icon') {
    const sizes = { sm: 24, md: 32, lg: 48 };
    const iconSize = sizes[size];
    
    return (
      <motion.div
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{ width: iconSize, height: iconSize }}
        whileHover={animated ? { scale: 1.05 } : undefined}
      >
        <div 
          className="w-3 h-3 rounded-full"
          style={{
            background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
          }}
        />
      </motion.div>
    );
  }

  // Full variant - Pour splash screen
  return (
    <motion.div
      className={`relative inline-flex flex-col items-center gap-2 ${className}`}
      whileHover={animated ? { scale: 1.02 } : undefined}
    >
      {/* Point vert menthe */}
      <div className="w-2 h-2 rounded-full bg-[var(--primary-500)] mb-1" />
      
      <div className="flex flex-col items-center">
        <span 
          className="font-display font-normal tracking-tight text-[var(--fg-primary)]"
          style={{ fontSize: size === 'sm' ? 24 : size === 'md' ? 32 : 48 }}
        >
          Squad Planner
        </span>
        <span className="text-xs font-normal text-[var(--fg-tertiary)] tracking-wider mt-1">
          Organize • Play • Win
        </span>
      </div>
    </motion.div>
  );
}

// Loader minimaliste
export function LogoLoader({ size = 24 }: { size?: number }) {
  return (
    <motion.div
      className="flex items-center justify-center"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <div 
        className="rounded-full"
        style={{
          width: size,
          height: size,
          background: 'conic-gradient(from 0deg, var(--primary-500), var(--primary-600), var(--primary-500))',
        }}
      />
    </motion.div>
  );
}