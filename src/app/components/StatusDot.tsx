import { motion } from 'motion/react';

interface StatusDotProps {
  variant?: 'success' | 'warning' | 'danger' | 'info';
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusDot({ variant = 'info', pulse = false, size = 'md' }: StatusDotProps) {
  const colors = {
    success: '#2BD67B',
    warning: '#FFB020',
    danger: '#FF5C5C',
    info: '#5B7CFF'
  };

  const sizes = {
    sm: 6,
    md: 8,
    lg: 10
  };

  const dotSize = sizes[size];
  const color = colors[variant];

  return (
    <span className="relative inline-flex items-center justify-center">
      {pulse && (
        <motion.span
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            backgroundColor: color
          }}
        />
      )}
      <span
        style={{
          display: 'block',
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}40`
        }}
      />
    </span>
  );
}
