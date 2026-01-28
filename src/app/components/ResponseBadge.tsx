import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

type ResponseStatus = 'pending' | 'confirmed' | 'declined' | 'urgent';

interface ResponseBadgeProps {
  status: ResponseStatus;
  variant?: 'default' | 'pill' | 'icon';
  animated?: boolean;
  className?: string;
}

const statusConfig = {
  pending: {
    label: 'Réponse requise',
    icon: AlertCircle,
    bg: 'bg-[var(--warning-500)]/10',
    border: 'border-[var(--warning-500)]/30',
    text: 'text-[var(--warning-500)]',
    dotColor: 'bg-[var(--warning-500)]'
  },
  urgent: {
    label: 'Réponds maintenant !',
    icon: Clock,
    bg: 'bg-[var(--error-500)]/10',
    border: 'border-[var(--error-500)]/30',
    text: 'text-[var(--error-500)]',
    dotColor: 'bg-[var(--error-500)]'
  },
  confirmed: {
    label: 'Confirmé',
    icon: CheckCircle,
    bg: 'bg-[var(--success-500)]/10',
    border: 'border-[var(--success-500)]/30',
    text: 'text-[var(--success-500)]',
    dotColor: 'bg-[var(--success-500)]'
  },
  declined: {
    label: 'Décliné',
    icon: XCircle,
    bg: 'bg-[var(--fg-quaternary)]/10',
    border: 'border-[var(--fg-quaternary)]/30',
    text: 'text-[var(--fg-tertiary)]',
    dotColor: 'bg-[var(--fg-quaternary)]'
  }
};

export function ResponseBadge({ 
  status, 
  variant = 'default',
  animated = true,
  className = '' 
}: ResponseBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  // Icon only variant
  if (variant === 'icon') {
    return (
      <motion.div
        className={`inline-flex p-2 rounded-lg ${config.bg} ${className}`}
        whileHover={animated ? { scale: 1.05 } : {}}
        whileTap={animated ? { scale: 0.95 } : {}}
      >
        <Icon className={`w-4 h-4 ${config.text}`} />
      </motion.div>
    );
  }

  // Pill variant
  if (variant === 'pill') {
    return (
      <motion.div
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.bg} border ${config.border} ${className}`}
        initial={animated ? { scale: 0.9, opacity: 0 } : {}}
        animate={animated ? { scale: 1, opacity: 1 } : {}}
        whileHover={animated ? { scale: 1.02 } : {}}
        transition={{ duration: 0.2 }}
      >
        {/* Dot pulsant pour pending/urgent */}
        {(status === 'pending' || status === 'urgent') && animated && (
          <motion.div
            className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
        
        <span className={`text-xs font-bold uppercase tracking-wider ${config.text}`}>
          {config.label}
        </span>
      </motion.div>
    );
  }

  // Default variant - full badge
  return (
    <motion.div
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl ${config.bg} border ${config.border} ${className}`}
      initial={animated ? { opacity: 0, x: -10 } : {}}
      animate={animated ? { opacity: 1, x: 0 } : {}}
      whileHover={animated ? { scale: 1.02, x: 2 } : {}}
      transition={{ duration: 0.3 }}
    >
      {/* Icon avec animation */}
      <motion.div
        animate={animated && (status === 'pending' || status === 'urgent') ? {
          rotate: [0, -10, 10, -10, 0],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Icon className={`w-5 h-5 ${config.text}`} />
      </motion.div>

      {/* Label */}
      <div className="flex flex-col leading-tight">
        <span className={`text-sm font-bold ${config.text}`}>
          {config.label}
        </span>
        
        {status === 'urgent' && (
          <span className="text-[10px] text-[var(--fg-tertiary)]">
            Session dans moins de 2h
          </span>
        )}
      </div>

      {/* Pulsing dot */}
      {(status === 'pending' || status === 'urgent') && animated && (
        <motion.div
          className={`w-2 h-2 rounded-full ${config.dotColor} ml-auto`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.3, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
}

// Variantes pré-configurées pour utilisation facile
export function PendingBadge({ className = '' }: { className?: string }) {
  return <ResponseBadge status="pending" variant="pill" className={className} />;
}

export function UrgentBadge({ className = '' }: { className?: string }) {
  return <ResponseBadge status="urgent" variant="default" className={className} />;
}

export function ConfirmedBadge({ className = '' }: { className?: string }) {
  return <ResponseBadge status="confirmed" variant="pill" className={className} />;
}

export function DeclinedBadge({ className = '' }: { className?: string }) {
  return <ResponseBadge status="declined" variant="pill" className={className} />;
}
