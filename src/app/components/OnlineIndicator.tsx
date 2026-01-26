import { motion } from 'motion/react';
import { Wifi, WifiOff } from 'lucide-react';

interface OnlineIndicatorProps {
  isOnline: boolean;
  variant?: 'dot' | 'badge' | 'full';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export function OnlineIndicator({
  isOnline,
  variant = 'dot',
  size = 'md',
  showLabel = false,
  animated = true,
  className = ''
}: OnlineIndicatorProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  // Dot variant - juste un point de statut
  if (variant === 'dot') {
    return (
      <motion.div
        className={`relative ${className}`}
        initial={animated ? { scale: 0 } : {}}
        animate={animated ? { scale: 1 } : {}}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {/* Dot */}
        <motion.div
          className={`
            ${sizeClasses[size]} rounded-full
            ${isOnline ? 'bg-[var(--success-500)]' : 'bg-[var(--fg-quaternary)]'}
          `}
          animate={animated && isOnline ? {
            boxShadow: [
              '0 0 0 0 rgba(34, 197, 94, 0.4)',
              '0 0 0 6px rgba(34, 197, 94, 0)',
            ]
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
        
        {/* Pulse ring */}
        {isOnline && animated && (
          <motion.div
            className={`absolute inset-0 rounded-full bg-[var(--success-500)]`}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{
              scale: 2.5,
              opacity: 0
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        )}
      </motion.div>
    );
  }

  // Badge variant - petit badge avec texte
  if (variant === 'badge') {
    return (
      <motion.div
        className={`
          inline-flex items-center gap-1.5 px-2 py-1 rounded-full
          ${isOnline ? 'bg-[var(--success-500)]/10 border border-[var(--success-500)]/30' : 'bg-white/5 border border-white/10'}
          ${className}
        `}
        initial={animated ? { opacity: 0, scale: 0.9 } : {}}
        animate={animated ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.3 }}
      >
        <OnlineIndicator isOnline={isOnline} variant="dot" size="sm" animated={animated} />
        <span className={`text-[10px] font-bold uppercase tracking-wider ${isOnline ? 'text-[var(--success-500)]' : 'text-[var(--fg-tertiary)]'}`}>
          {isOnline ? 'En ligne' : 'Hors ligne'}
        </span>
      </motion.div>
    );
  }

  // Full variant - carte complète
  return (
    <motion.div
      className={`
        inline-flex items-center gap-3 px-4 py-3 rounded-xl
        ${isOnline ? 'bg-[var(--success-500)]/5 border border-[var(--success-500)]/20' : 'bg-white/5 border border-white/10'}
        ${className}
      `}
      initial={animated ? { opacity: 0, y: 10 } : {}}
      animate={animated ? { opacity: 1, y: 0 } : {}}
      whileHover={animated ? { scale: 1.02 } : {}}
      transition={{ duration: 0.3 }}
    >
      {/* Icon */}
      <motion.div
        className={`p-2 rounded-lg ${isOnline ? 'bg-[var(--success-500)]/10' : 'bg-white/5'}`}
        animate={animated && isOnline ? {
          scale: [1, 1.1, 1],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {isOnline ? (
          <Wifi className="w-5 h-5 text-[var(--success-500)]" />
        ) : (
          <WifiOff className="w-5 h-5 text-[var(--fg-tertiary)]" />
        )}
      </motion.div>

      {/* Content */}
      <div className="flex flex-col leading-tight">
        <span className={`text-sm font-bold ${isOnline ? 'text-[var(--success-500)]' : 'text-[var(--fg-tertiary)]'}`}>
          {isOnline ? 'En ligne' : 'Hors ligne'}
        </span>
        {showLabel && (
          <span className="text-[10px] text-[var(--fg-quaternary)]">
            {isOnline ? 'Disponible maintenant' : 'Dernière connexion inconnue'}
          </span>
        )}
      </div>

      {/* Status dot */}
      <OnlineIndicator isOnline={isOnline} variant="dot" size="md" animated={animated} className="ml-auto" />
    </motion.div>
  );
}

// Variantes pré-configurées
export function OnlineDot({ isOnline, className = '' }: { isOnline: boolean, className?: string }) {
  return <OnlineIndicator isOnline={isOnline} variant="dot" className={className} />;
}

export function OnlineBadge({ isOnline, className = '' }: { isOnline: boolean, className?: string }) {
  return <OnlineIndicator isOnline={isOnline} variant="badge" className={className} />;
}

// Hook pour simuler le statut en ligne (en attendant vrai backend)
export function useOnlineStatus(userId?: string): boolean {
  // Pour l'instant, simulation aléatoire basée sur l'ID
  // Dans une vraie app, ce serait connecté à un WebSocket / Firebase / etc.
  if (!userId) return false;
  
  // Simule 60% de chance d'être en ligne
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return hash % 10 < 6;
}
