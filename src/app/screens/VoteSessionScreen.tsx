import { ArrowLeft, CheckCircle, Trophy } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { SlotVoting } from '@/app/components/SlotVoting';
import { AnimatedProgressBar } from '@/app/components/ui/AnimatedProgressBar';
import { PulseBadge } from '@/app/components/ui/PulseBadge';
import { AvatarStack } from '@/app/components/ui/AvatarStack';
import { Celebration } from '@/app/components/ui/Celebration';
import { useHaptic } from '@/app/hooks/useHaptic';
import { useSoundEffects } from '@/app/hooks/useSoundEffects';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface VoteSessionScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function VoteSessionScreen({ onNavigate, showToast }: VoteSessionScreenProps) {
  const [userVotes, setUserVotes] = useState<Record<string, 'yes' | 'no' | 'maybe'>>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const { selection } = useHaptic();
  const { play } = useSoundEffects();

  // Mock session data with multiple slots
  const session = {
    id: 'session-1',
    title: 'Session Valorant Classé',
    game: 'Valorant',
    gameImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400',
    proposedBy: 'Alex',
    proposedByAvatar: 'https://i.pravatar.cc/150?img=1',
    playersNeeded: 5,
    status: 'voting', // 'voting' | 'confirmed' | 'cancelled'
    slots: [
      {
        id: 'slot-1',
        date: '2026-01-25',
        time: '20:00',
        duration: '2h',
        responses: [
          { playerId: '1', playerName: 'Alex', playerAvatar: 'https://i.pravatar.cc/150?img=1', response: 'yes' as const },
          { playerId: '2', playerName: 'Marie', playerAvatar: 'https://i.pravatar.cc/150?img=5', response: 'yes' as const },
          { playerId: '3', playerName: 'Lucas', playerAvatar: 'https://i.pravatar.cc/150?img=12', response: 'yes' as const },
          { playerId: '4', playerName: 'Sophie', playerAvatar: 'https://i.pravatar.cc/150?img=25', response: 'maybe' as const },
        ],
      },
      {
        id: 'slot-2',
        date: '2026-01-26',
        time: '19:00',
        duration: '2h',
        responses: [
          { playerId: '1', playerName: 'Alex', playerAvatar: 'https://i.pravatar.cc/150?img=1', response: 'yes' as const },
          { playerId: '2', playerName: 'Marie', playerAvatar: 'https://i.pravatar.cc/150?img=5', response: 'no' as const },
          { playerId: '5', playerName: 'Tom', playerAvatar: 'https://i.pravatar.cc/150?img=33', response: 'yes' as const },
        ],
      },
      {
        id: 'slot-3',
        date: '2026-01-27',
        time: '21:00',
        duration: '2h',
        responses: [
          { playerId: '3', playerName: 'Lucas', playerAvatar: 'https://i.pravatar.cc/150?img=12', response: 'yes' as const },
          { playerId: '4', playerName: 'Sophie', playerAvatar: 'https://i.pravatar.cc/150?img=25', response: 'yes' as const },
          { playerId: '5', playerName: 'Tom', playerAvatar: 'https://i.pravatar.cc/150?img=33', response: 'maybe' as const },
        ],
      },
    ],
    squadId: 'squad-1',
    squadName: 'Les Fragsters',
    totalMembers: 6,
  };

  const handleVote = (slotId: string, response: 'yes' | 'no' | 'maybe') => {
    setUserVotes(prev => ({ ...prev, [slotId]: response }));
    selection();
    play('click');
    showToast(`Vote enregistré : ${response === 'yes' ? '✅ Présent' : response === 'no' ? '❌ Absent' : '🤷 Peut-être'}`, 'success');
  };

  const handleConfirmWinner = () => {
    setShowCelebration(true);
    setTimeout(() => {
      onNavigate('squad-detail', { id: session.squadId });
    }, 2500);
  };

  // Find winning slot (most "yes" votes)
  const slotScores = session.slots.map(slot => ({
    ...slot,
    yesCount: slot.responses.filter(r => r.response === 'yes').length,
  }));
  const maxYesCount = Math.max(...slotScores.map(s => s.yesCount));
  const winningSlots = slotScores.filter(s => s.yesCount === maxYesCount && s.yesCount > 0);
  const winningSlot = winningSlots.length === 1 ? winningSlots[0] : null;

  // Check if quorum reached (80% voted on at least one slot)
  const hasVotedCount = new Set(
    session.slots.flatMap(slot => slot.responses.map(r => r.playerId))
  ).size;
  const quorumReached = (hasVotedCount / session.totalMembers) >= 0.8;

  const canConfirm = winningSlot && winningSlot.yesCount >= session.playersNeeded && quorumReached;

  return (
    <div className="min-h-screen pb-24 pt-safe">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => onNavigate('squad-detail', { id: session.squadId })}
            className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
              Vote sur la session
            </h1>
            <div className="text-sm text-[var(--fg-tertiary)] font-medium mt-0.5">
              {session.squadName}
            </div>
          </div>
        </div>

        {/* Session Info Card */}
        <div className="bg-white rounded-2xl overflow-hidden border-[0.5px] border-[var(--border-subtle)] shadow-md mb-8">
          <div className="relative h-32">
            <ImageWithFallback 
              src={session.gameImage}
              alt={session.game}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <div className="text-xs text-white/70 font-medium mb-1">
                {session.game}
              </div>
              <div className="text-xl font-bold text-white">
                {session.title}
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={session.proposedByAvatar}
                alt={session.proposedBy}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                  Proposé par
                </div>
                <div className="text-sm font-semibold text-[var(--fg-primary)]">
                  {session.proposedBy}
                </div>
              </div>
            </div>

            <div className="bg-[var(--primary-50)] rounded-xl p-3 border-[0.5px] border-[var(--primary-200)]">
              <div className="text-xs text-[var(--primary-700)] font-medium mb-1">
                Objectif
              </div>
              <div className="text-sm font-semibold text-[var(--primary-900)]">
                {session.playersNeeded} joueurs minimum requis
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-[var(--secondary-50)] rounded-2xl p-5 mb-6 border-[0.5px] border-[var(--secondary-200)]">
          <h3 className="text-sm font-semibold text-[var(--fg-primary)] mb-2">
            📊 Comment voter ?
          </h3>
          <ul className="text-sm text-[var(--fg-tertiary)] space-y-1">
            <li>• Votez sur <span className="font-semibold">chaque créneau</span> proposé</li>
            <li>• Quand <span className="font-semibold">80% ont voté</span>, le créateur peut confirmer</li>
            <li>• Le créneau avec le <span className="font-semibold">plus de "Je viens"</span> gagne</li>
          </ul>
        </div>

        {/* Quorum Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-[var(--fg-primary)]">
              Participation globale
            </div>
            <div className="text-sm font-semibold text-[var(--fg-secondary)]">
              {hasVotedCount}/{session.totalMembers} membres ont voté
            </div>
          </div>
          <div className="h-2 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${session.totalMembers > 0 ? (hasVotedCount / session.totalMembers) * 100 : 0}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full rounded-full ${
                quorumReached ? 'bg-[var(--success-500)]' : 'bg-[var(--primary-500)]'
              }`}
            />
          </div>
        </div>

        {/* Slots */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-4">
            Créneaux proposés
          </h2>
          <div className="space-y-4">
            {session.slots.map((slot, index) => (
              <SlotVoting
                key={slot.id}
                slot={slot}
                currentUserResponse={userVotes[slot.id]}
                totalMembers={session.totalMembers}
                playersNeeded={session.playersNeeded}
                onVote={handleVote}
                isWinning={winningSlot?.id === slot.id}
                isConfirmed={false}
              />
            ))}
          </div>
        </div>

        {/* Confirm Winner (only for session creator) */}
        {canConfirm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[var(--success-50)] to-[var(--primary-50)] rounded-2xl p-6 mb-8 border-[0.5px] border-[var(--success-200)] shadow-lg"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--success-500)] flex items-center justify-center flex-shrink-0">
                <Trophy className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-1">
                  Prêt à confirmer !
                </h3>
                <p className="text-sm text-[var(--fg-tertiary)]">
                  Le quorum est atteint et vous avez assez de joueurs confirmés. Vous pouvez valider la session.
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={handleConfirmWinner}
              className="w-full h-12 bg-[var(--success-500)] hover:bg-[var(--success-600)] text-white rounded-xl shadow-md font-semibold"
            >
              <CheckCircle className="w-5 h-5" strokeWidth={2} />
              Confirmer ce créneau
            </Button>
          </motion.div>
        )}

        {/* Info Footer */}
        {!canConfirm && (
          <div className="text-center text-sm text-[var(--fg-tertiary)] font-medium">
            {!quorumReached && (
              <p>En attente de plus de votes ({Math.round((hasVotedCount / session.totalMembers) * 100)}% / 80%)</p>
            )}
            {quorumReached && !winningSlot && (
              <p>Aucun créneau ne remporte la majorité pour le moment</p>
            )}
            {quorumReached && winningSlot && winningSlot.yesCount < session.playersNeeded && (
              <p>Pas assez de joueurs confirmés sur le créneau gagnant</p>
            )}
          </div>
        )}

        {/* Celebration */}
        {showCelebration && (
          <Celebration
            title="Session confirmée !"
            className="absolute top-0 left-0 right-0 bottom-0"
            onEnd={() => setShowCelebration(false)}
          />
        )}

      </div>
    </div>
  );
}
export default VoteSessionScreen;
