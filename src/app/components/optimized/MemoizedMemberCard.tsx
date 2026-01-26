import { memo } from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { ReliabilityBadge } from '@/app/components/ReliabilityBadge';

interface Member {
  id: number;
  name: string;
  avatar: string;
  role: string;
  reliability: number;
  isOnline: boolean;
  lastSession: string;
  lastSessionStatus: 'present' | 'late' | 'absent';
}

interface MemberCardProps {
  member: Member;
  index?: number;
}

/**
 * Memoized Member Card component
 * Only re-renders when member data changes
 */
export const MemoizedMemberCard = memo<MemberCardProps>(({ member, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-[var(--border-subtle)]">
            <ImageWithFallback
              src={member.avatar}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          </div>
          {member.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-[var(--success-500)]" />
          )}
        </div>
        <div className="flex-1">
          <div className="text-sm text-[var(--fg-primary)] mb-1 font-semibold">
            {member.name}
          </div>
          <div className="text-xs text-[var(--fg-tertiary)] font-medium mb-1">
            {member.role}
          </div>
          <div className={`text-xs font-medium flex items-center gap-1 ${
            member.lastSessionStatus === 'present' 
              ? 'text-[var(--success-600)]'
              : member.lastSessionStatus === 'late'
              ? 'text-[var(--warning-600)]'
              : 'text-[var(--danger-600)]'
          }`}>
            {member.lastSessionStatus === 'present' && '✅'}
            {member.lastSessionStatus === 'late' && '⏰'}
            {member.lastSessionStatus === 'absent' && '❌'}
            <span>{member.lastSession}</span>
          </div>
        </div>
        <div className="text-right">
          <ReliabilityBadge score={member.reliability} size="sm" />
        </div>
      </div>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if member data actually changed
  return (
    prevProps.member.id === nextProps.member.id &&
    prevProps.member.name === nextProps.member.name &&
    prevProps.member.reliability === nextProps.member.reliability &&
    prevProps.member.isOnline === nextProps.member.isOnline &&
    prevProps.member.lastSessionStatus === nextProps.member.lastSessionStatus
  );
});

MemoizedMemberCard.displayName = 'MemoizedMemberCard';
