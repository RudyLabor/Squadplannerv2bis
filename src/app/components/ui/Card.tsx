import { memo, ReactNode, forwardRef } from 'react';
import { motion, MotionProps } from 'motion/react';

interface CardProps extends Omit<MotionProps, 'children'> {
  children: ReactNode;
  variant?: 'glass-1' | 'glass-2' | 'glass-3' | 'glass-4';
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}

const CardComponent = forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'glass-2', interactive = false, className = '', onClick, ...motionProps }, ref) => {
    return (
      <motion.div
        ref={ref}
        onClick={onClick}
        className={`
          ${variant}
          rounded-2xl
          ${interactive ? 'cursor-pointer interactive' : ''}
          gpu
          ${className}
        `}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0.0, 0.2, 1]
        }}
        whileHover={interactive ? {
          y: -3,
          transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
        } : undefined}
        whileTap={interactive ? {
          scale: 0.99,
          transition: { duration: 0.1 }
        } : undefined}
        {...motionProps}
      >
        {children}
      </motion.div>
    );
  }
);

CardComponent.displayName = 'Card';

export const Card = memo(CardComponent);