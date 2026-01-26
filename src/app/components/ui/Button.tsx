import { motion } from 'motion/react';
import { forwardRef, useState, memo, ReactNode } from 'react';
import { shouldReduceAnimations } from '@/utils/device';

interface ButtonProps {
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const ButtonComponent = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', fullWidth = false, loading = false, disabled = false, className = '', onClick, type = 'button', ...props }, ref) => {
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
    const reducedMotion = shouldReduceAnimations();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) return;
      
      // Premium ripple effect
      if (!reducedMotion) {
        const rect = e.currentTarget.getBoundingClientRect();
        const ripple = {
          id: Date.now(),
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };

        setRipples(prev => [...prev, ripple]);
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== ripple.id));
        }, 500);
      }

      onClick?.(e);
    };

    const variantStyles = {
      primary: 'bg-[var(--primary-500)] text-white hover:bg-[var(--primary-600)] active:bg-[var(--primary-700)] shadow-[0_2px_8px_rgba(245,158,11,0.15)] hover:shadow-[0_4px_12px_rgba(245,158,11,0.25)]',
      secondary: 'bg-[var(--secondary-500)] text-white hover:bg-[var(--secondary-600)] active:bg-[var(--secondary-700)] shadow-[0_2px_8px_rgba(20,184,166,0.15)] hover:shadow-[0_4px_12px_rgba(20,184,166,0.25)]',
      ghost: 'bg-white text-[var(--fg-primary)] border-[0.5px] border-[var(--border-medium)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)] shadow-sm hover:shadow-md',
      success: 'bg-[var(--success-500)] text-white hover:bg-[var(--success-600)] active:bg-[var(--success-700)] shadow-[0_2px_8px_rgba(16,185,129,0.15)] hover:shadow-[0_4px_12px_rgba(16,185,129,0.25)]',
      danger: 'bg-[var(--destructive-500)] text-white hover:bg-[var(--destructive-600)] active:bg-[var(--destructive-700)] shadow-[0_2px_8px_rgba(244,63,94,0.15)] hover:shadow-[0_4px_12px_rgba(244,63,94,0.25)]'
    };

    const sizeStyles = {
      sm: 'px-4 py-2 text-sm h-10',
      md: 'px-6 py-3 text-sm h-12',
      lg: 'px-8 py-4 text-base h-14'
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        onClick={handleClick}
        disabled={disabled || loading}
        className={`
          relative overflow-hidden
          rounded-2xl font-semibold
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]/20
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${disabled || loading ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        whileHover={reducedMotion ? {} : { y: -1, scale: 1.01 }}
        whileTap={reducedMotion ? {} : { scale: 0.98 }}
        transition={reducedMotion 
          ? { duration: 0 }
          : { type: 'spring', stiffness: 500, damping: 30 }
        }
        {...props}
      >
        {/* Ripple effects */}
        {!reducedMotion && ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.4 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              left: ripple.x,
              top: ripple.y,
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: variant === 'ghost' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.3)',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading && (
            <motion.span
              animate={reducedMotion ? {} : { rotate: 360 }}
              transition={reducedMotion 
                ? {} 
                : { duration: 1, repeat: Infinity, ease: "linear" }
              }
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            />
          )}
          {children}
        </span>
      </motion.button>
    );
  }
);

ButtonComponent.displayName = 'Button';

export const Button = memo(ButtonComponent);