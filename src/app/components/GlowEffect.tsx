import { ReactNode } from 'react';

interface GlowEffectProps {
  children: ReactNode;
  color?: string;
  className?: string;
}

export function GlowEffect({ children, color = 'rgba(91, 124, 255, 0.3)', className = '' }: GlowEffectProps) {
  return (
    <div className={`relative group ${className}`}>
      {/* Glow effect on hover - positioned behind content */}
      <div 
        className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${color}, transparent 70%)`,
        }}
      />
      
      {/* Content */}
      {children}
    </div>
  );
}
