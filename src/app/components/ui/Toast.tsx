import { memo, useEffect, useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: (id: string) => void;
}

const ToastComponent = forwardRef<HTMLDivElement, ToastProps>(
  ({ id, message, type = 'info', duration = 3000, onClose }, ref) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(id), 250);
      }, duration);

      return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    const icons = {
      success: <CheckCircle2 className="w-5 h-5" strokeWidth={2} />,
      error: <XCircle className="w-5 h-5" strokeWidth={2} />,
      info: <AlertCircle className="w-5 h-5" strokeWidth={2} />
    };

    const styles = {
      success: 'bg-[var(--success-50)] text-[var(--success-700)] border-[var(--success-200)]',
      error: 'bg-[var(--destructive-50)] text-[var(--destructive-700)] border-[var(--destructive-200)]',
      info: 'bg-[var(--primary-50)] text-[var(--primary-700)] border-[var(--primary-200)]'
    };

    const iconColors = {
      success: 'text-[var(--success-500)]',
      error: 'text-[var(--destructive-500)]',
      info: 'text-[var(--primary-500)]'
    };

    if (!isVisible) return null;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: -24, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.95 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className={`
          ${styles[type]}
          rounded-2xl p-4 
          shadow-lg
          border-[0.5px]
          backdrop-blur-xl
          flex items-center gap-3 
          min-w-[320px] max-w-md
        `}
      >
        <span className={iconColors[type]}>{icons[type]}</span>
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose?.(id), 250);
          }}
          className="text-current/60 hover:text-current transition-colors rounded-lg p-1"
        >
          <X className="w-4 h-4" strokeWidth={2} />
        </button>
      </motion.div>
    );
  }
);

ToastComponent.displayName = 'Toast';

export const Toast = memo(ToastComponent);

// Toast Container
interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}

export const ToastContainer = memo(({ toasts, onClose }: ToastContainerProps) => {
  return (
    <div className="fixed top-6 right-6 z-[var(--z-toast)] flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
});

ToastContainer.displayName = 'ToastContainer';

// Toast Hook
export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const closeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return { toasts, showToast, closeToast };
}
