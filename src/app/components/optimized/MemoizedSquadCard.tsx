import { memo } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Wifi } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface Squad {
  id: number;
  name: string;
  game: string;
  gameImage: string;
  members: number;
  reliability: number;
  nextSession: string;
  isActive: boolean;
  onlineMembers: number;
}

interface SquadCardProps {
  squad: Squad;
  onClick: (squadId: number) => void;
  index?: number;
}

const getReliabilityColor = (reliability: number) => {
  if (reliability >= 90) return 'text-[var(--success-600)] bg-gradient-to-br from-[var(--success-50)] to-[var(--success-100)] border-[var(--success-200)]';
  if (reliability >= 75) return 'text-[var(--primary-600)] bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] border-[var(--primary-200)]';
  return 'text-[var(--warning-600)] bg-gradient-to-br from-[var(--warning-50)] to-[var(--warning-100)] border-[var(--warning-200)]';
};

/**
 * Memoized Squad Card component for optimal rendering performance
 * Only re-renders when squad data or onClick handler changes
 */
export const MemoizedSquadCard = memo<SquadCardProps>(({ squad, onClick, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      <motion.div
        className="bg-white rounded-2xl border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-xl cursor-pointer overflow-hidden group"
        onClick={() => onClick(squad.id)}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header with game badge */}
        <div className="relative h-24 bg-gradient-to-br from-[var(--bg-base)] to-white border-b border-[var(--border-subtle)]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-lg">
              <ImageWithFallback
                src={squad.gameImage}
                alt={squad.game}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Online indicator */}
          {squad.onlineMembers > 0 && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--success-500)] text-white text-xs font-bold shadow-sm">
              <Wifi className="w-3 h-3" strokeWidth={2.5} />
              {squad.onlineMembers}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Squad name */}
          <h3 className="text-base font-bold text-[var(--fg-primary)] mb-1 truncate group-hover:text-[var(--primary-600)] transition-colors">
            {squad.name}
          </h3>
          <p className="text-xs text-[var(--fg-tertiary)] font-medium mb-4 truncate">
            {squad.game}
          </p>

          {/* Stats grid */}
          <div className="space-y-2 mb-4">
            {/* Members */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--fg-tertiary)] font-medium flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" strokeWidth={2} />
                Membres
              </span>
              <span className="text-xs font-bold text-[var(--fg-primary)]">
                {squad.members}
              </span>
            </div>

            {/* Reliability */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--fg-tertiary)] font-medium flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" strokeWidth={2} />
                Fiabilité
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getReliabilityColor(squad.reliability)}`}>
                {squad.reliability}%
              </span>
            </div>
          </div>

          {/* Next session */}
          <div className={`pt-3 border-t border-[var(--border-subtle)] ${
            squad.isActive 
              ? 'bg-gradient-to-r from-[var(--primary-50)] to-[var(--primary-100)] -mx-4 -mb-4 px-4 pb-4 mt-3' 
              : ''
          }`}>
            <div className="flex items-center gap-1.5 text-xs">
              <div className={`w-1.5 h-1.5 rounded-full ${
                squad.isActive ? 'bg-[var(--primary-500)] animate-pulse' : 'bg-[var(--fg-tertiary)]/30'
              }`} />
              <span className={`font-semibold ${
                squad.isActive ? 'text-[var(--primary-700)]' : 'text-[var(--fg-tertiary)]'
              }`}>
                {squad.nextSession}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for optimal re-rendering
  return (
    prevProps.squad.id === nextProps.squad.id &&
    prevProps.squad.name === nextProps.squad.name &&
    prevProps.squad.members === nextProps.squad.members &&
    prevProps.squad.reliability === nextProps.squad.reliability &&
    prevProps.squad.onlineMembers === nextProps.squad.onlineMembers &&
    prevProps.squad.isActive === nextProps.squad.isActive &&
    prevProps.onClick === nextProps.onClick
  );
});

MemoizedSquadCard.displayName = 'MemoizedSquadCard';
