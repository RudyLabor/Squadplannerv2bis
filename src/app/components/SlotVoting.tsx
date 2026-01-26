import { Check, X, HelpCircle, Calendar, Clock, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { Badge } from '@/app/components/ui/Badge';
import { AnimatedProgressBar } from '@/app/components/ui/AnimatedProgressBar';
import { PulseBadge } from '@/app/components/ui/PulseBadge';
import { AvatarStack } from '@/app/components/ui/AvatarStack';

interface SlotVotingProps {
  slot: {
    id: string;
    date: string;
    time: string;
    duration: string;
    responses: Array<{
      playerId: string;
      playerName: string;
      playerAvatar?: string;
      response: 'yes' | 'no' | 'maybe';
    }>;
  };
  currentUserResponse?: 'yes' | 'no' | 'maybe';
  totalMembers: number;
  playersNeeded: number;
  onVote: (slotId: string, response: 'yes' | 'no' | 'maybe') => void;
  isWinning?: boolean;
  isConfirmed?: boolean;
}

export function SlotVoting({
  slot,
  currentUserResponse,
  totalMembers,
  playersNeeded,
  onVote,
  isWinning = false,
  isConfirmed = false,
}: SlotVotingProps) {
  const yesCount = slot.responses.filter(r => r.response === 'yes').length;
  const noCount = slot.responses.filter(r => r.response === 'no').length;
  const maybeCount = slot.responses.filter(r => r.response === 'maybe').length;
  const totalVotes = slot.responses.length;
  const votePercentage = (totalVotes / totalMembers) * 100;

  const hasEnoughPlayers = yesCount >= playersNeeded;
  const isQuorumReached = votePercentage >= 80; // 80% have voted

  // Format date
  const dateObj = new Date(slot.date);
  const dateFormatted = dateObj.toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  return (
    <motion.div
      layout
      className={`bg-white rounded-2xl p-5 border-[0.5px] transition-all duration-200 ${
        isConfirmed
          ? 'border-[var(--success-500)] ring-2 ring-[var(--success-500)]/20 shadow-lg'
          : isWinning
          ? 'border-[var(--primary-500)] ring-2 ring-[var(--primary-500)]/20 shadow-md'
          : 'border-[var(--border-subtle)] shadow-sm hover:shadow-md'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-[var(--fg-tertiary)]" strokeWidth={1.5} />
            <div className="text-sm font-semibold text-[var(--fg-primary)] capitalize">
              {dateFormatted}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--fg-tertiary)]" strokeWidth={1.5} />
            <div className="text-sm text-[var(--fg-secondary)] font-medium">
              {slot.time} • {slot.duration}
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-col gap-2 items-end">
          {isConfirmed && (
            <Badge variant="success" className="text-xs">
              <Check className="w-3 h-3" strokeWidth={2} />
              Confirmé
            </Badge>
          )}
          {isWinning && !isConfirmed && (
            <Badge variant="primary" className="text-xs">
              🏆 En tête
            </Badge>
          )}
          {isQuorumReached && !isConfirmed && (
            <Badge variant="info" className="text-xs">
              Quorum atteint
            </Badge>
          )}
        </div>
      </div>

      {/* Vote Counts */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 bg-[var(--success-50)] rounded-xl px-3 py-2 border-[0.5px] border-[var(--success-200)]">
          <div className="text-lg font-bold text-[var(--success-600)]">
            {yesCount}
          </div>
          <div className="text-xs text-[var(--success-700)] font-medium">
            Présent{yesCount > 1 ? 's' : ''}
          </div>
        </div>
        <div className="flex-1 bg-[var(--danger-50)] rounded-xl px-3 py-2 border-[0.5px] border-[var(--danger-200)]">
          <div className="text-lg font-bold text-[var(--danger-600)]">
            {noCount}
          </div>
          <div className="text-xs text-[var(--danger-700)] font-medium">
            Absent{noCount > 1 ? 's' : ''}
          </div>
        </div>
        <div className="flex-1 bg-[var(--warning-50)] rounded-xl px-3 py-2 border-[0.5px] border-[var(--warning-200)]">
          <div className="text-lg font-bold text-[var(--warning-600)]">
            {maybeCount}
          </div>
          <div className="text-xs text-[var(--warning-700)] font-medium">
            Peut-être
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-[var(--fg-tertiary)] font-medium">
            Progression des votes
          </div>
          <div className="text-xs font-semibold text-[var(--fg-secondary)]">
            {totalVotes}/{totalMembers} ({Math.round(votePercentage)}%)
          </div>
        </div>
        <AnimatedProgressBar
          value={votePercentage}
          max={100}
          height="6px"
          color={isQuorumReached ? 'success' : 'primary'}
          variant="gradient"
        />
      </div>

      {/* Players Needed Indicator */}
      {hasEnoughPlayers ? (
        <div className="flex items-center gap-2 mb-4 bg-[var(--success-50)] rounded-xl px-3 py-2 border-[0.5px] border-[var(--success-200)]">
          <Check className="w-4 h-4 text-[var(--success-600)]" strokeWidth={2} />
          <div className="text-sm text-[var(--success-700)] font-semibold">
            {yesCount}/{playersNeeded} joueurs confirmés
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 mb-4 bg-[var(--warning-50)] rounded-xl px-3 py-2 border-[0.5px] border-[var(--warning-200)]">
          <Users className="w-4 h-4 text-[var(--warning-600)]" strokeWidth={1.5} />
          <div className="text-sm text-[var(--warning-700)] font-medium">
            {yesCount}/{playersNeeded} joueurs (il manque {playersNeeded - yesCount})
          </div>
        </div>
      )}

      {/* Vote Buttons */}
      {!isConfirmed && (
        <div className="flex gap-2">
          <button
            onClick={() => onVote(slot.id, 'yes')}
            className={`flex-1 h-11 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              currentUserResponse === 'yes'
                ? 'bg-[var(--success-500)] text-white shadow-md'
                : 'bg-[var(--success-50)] text-[var(--success-700)] border-[0.5px] border-[var(--success-200)] hover:bg-[var(--success-100)]'
            }`}
          >
            <Check className="w-4 h-4" strokeWidth={2} />
            Je viens
          </button>
          <button
            onClick={() => onVote(slot.id, 'maybe')}
            className={`flex-1 h-11 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              currentUserResponse === 'maybe'
                ? 'bg-[var(--warning-500)] text-white shadow-md'
                : 'bg-[var(--warning-50)] text-[var(--warning-700)] border-[0.5px] border-[var(--warning-200)] hover:bg-[var(--warning-100)]'
            }`}
          >
            <HelpCircle className="w-4 h-4" strokeWidth={2} />
            Peut-être
          </button>
          <button
            onClick={() => onVote(slot.id, 'no')}
            className={`flex-1 h-11 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              currentUserResponse === 'no'
                ? 'bg-[var(--danger-500)] text-white shadow-md'
                : 'bg-[var(--danger-50)] text-[var(--danger-700)] border-[0.5px] border-[var(--danger-200)] hover:bg-[var(--danger-100)]'
            }`}
          >
            <X className="w-4 h-4" strokeWidth={2} />
            Absent
          </button>
        </div>
      )}
    </motion.div>
  );
}