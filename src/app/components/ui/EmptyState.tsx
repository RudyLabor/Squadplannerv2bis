import { memo, ReactNode } from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyStateComponent = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel,
  onAction,
  className = '' 
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`
        flex flex-col items-center justify-center
        text-center py-16 px-6
        ${className}
      `}
    >
      {Icon && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6 w-16 h-16 rounded-3xl bg-[var(--bg-subtle)] flex items-center justify-center"
        >
          <Icon className="w-8 h-8 text-[var(--fg-tertiary)]" strokeWidth={1.5} />
        </motion.div>
      )}
      
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold text-[var(--fg-primary)] mb-3 tracking-tight"
      >
        {title}
      </motion.h3>
      
      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-[var(--fg-tertiary)] max-w-md mb-8 font-medium leading-relaxed"
        >
          {description}
        </motion.p>
      )}
      
      {actionLabel && onAction && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={onAction}
          className="px-6 py-3 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white rounded-2xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

EmptyStateComponent.displayName = 'EmptyState';

export const EmptyState = memo(EmptyStateComponent);
