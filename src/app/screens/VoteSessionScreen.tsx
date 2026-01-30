import { ArrowLeft, CheckCircle, Trophy, Vote, Users, Calendar, Sparkles, Target } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { SlotVoting } from '@/app/components/SlotVoting';
import { Celebration } from '@/app/components/ui/Celebration';
import { useHaptic } from '@/app/hooks/useHaptic';
import { useSoundEffects } from '@/app/hooks/useSoundEffects';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Button, Card, IconButton } from '@/design-system';

interface VoteSessionScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

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
    showToast(`Vote enregistré : ${response === 'yes' ? 'Présent' : response === 'no' ? 'Absent' : 'Peut-être'}`, 'success');
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
    <div className="min-h-screen pb-24 pt-safe bg-[var(--bg-base)] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[var(--color-primary-400)]/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-success-400)]/15 to-teal-400/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.35 }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
            <IconButton
              aria-label="Retour"
              icon={<ArrowLeft className="w-5 h-5" strokeWidth={2} />}
              variant="secondary"
              size="lg"
              onClick={() => onNavigate('squad-detail', { id: session.squadId })}
              className="rounded-2xl bg-[var(--bg-elevated)]/80 backdrop-blur-sm border-[var(--border-subtle)]/50 shadow-lg hover:shadow-xl"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[var(--color-primary-600)] to-purple-600 bg-clip-text text-transparent">
                Vote sur la session
              </h1>
              <p className="text-sm text-[var(--fg-secondary)] font-medium mt-0.5">
                {session.squadName}
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary-500)] to-purple-600 flex items-center justify-center shadow-lg shadow-[var(--color-primary-500)]/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Vote className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Session Info Card */}
          <motion.div variants={itemVariants}>
            <Card variant="elevated" padding="none" className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm border-[var(--border-subtle)]/50 shadow-lg mb-8 overflow-hidden">
              <div className="relative h-32">
                <ImageWithFallback
                  src={session.gameImage}
                  alt={session.game}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-xs text-white/70 font-semibold mb-1">
                    {session.game}
                  </p>
                  <h2 className="text-xl font-bold tracking-tight text-white">
                    {session.title}
                  </h2>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-[var(--color-primary-500)] to-purple-500">
                    {session.proposedByAvatar ? (
                      <img
                        src={session.proposedByAvatar}
                        alt={session.proposedBy}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold">
                        {session.proposedBy.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-[var(--fg-secondary)] font-medium">
                      Proposé par
                    </p>
                    <p className="text-sm font-bold text-[var(--fg-primary)]">
                      {session.proposedBy}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[var(--color-primary-50)] to-purple-50 rounded-xl p-3 border border-[var(--color-primary-200)]">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-[var(--color-primary-600)]" />
                    <div>
                      <p className="text-xs text-[var(--color-primary-600)] font-medium">
                        Objectif
                      </p>
                      <p className="text-sm font-bold text-[var(--color-primary-800)]">
                        {session.playersNeeded} joueurs minimum requis
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Instructions */}
          <motion.div variants={itemVariants}>
            <Card variant="ghost" padding="lg" className="bg-gradient-to-br from-[var(--color-warning-100)]/80 to-orange-100/80 backdrop-blur-sm border border-[var(--color-warning-200)]/50 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-warning-500)] to-orange-500 flex items-center justify-center shadow-md flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-[var(--color-warning-800)] mb-2">
                    Comment voter ?
                  </h3>
                  <ul className="text-sm text-[var(--color-warning-700)] space-y-1">
                    <li>• Votez sur <span className="font-bold">chaque créneau</span> proposé</li>
                    <li>• Quand <span className="font-bold">80% ont voté</span>, le créateur peut confirmer</li>
                    <li>• Le créneau avec le <span className="font-bold">plus de "Je viens"</span> gagne</li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Quorum Progress */}
          <motion.div variants={itemVariants}>
            <Card variant="elevated" padding="lg" className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm border-[var(--border-subtle)]/50 shadow-lg mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[var(--color-primary-500)]" />
                  <span className="text-sm font-bold text-[var(--fg-primary)]">
                    Participation globale
                  </span>
                </div>
                <span className={`text-sm font-bold ${quorumReached ? 'text-[var(--color-success-600)]' : 'text-[var(--fg-secondary)]'}`}>
                  {hasVotedCount}/{session.totalMembers} membres ont voté
                </span>
              </div>
              <div className="h-3 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${session.totalMembers > 0 ? (hasVotedCount / session.totalMembers) * 100 : 0}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full rounded-full ${
                    quorumReached
                      ? 'bg-gradient-to-r from-[var(--color-success-500)] to-teal-500'
                      : 'bg-gradient-to-r from-[var(--color-primary-500)] to-purple-500'
                  }`}
                />
              </div>
              {quorumReached && (
                <p className="text-xs text-[var(--color-success-600)] font-semibold mt-2 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Quorum atteint !
                </p>
              )}
            </Card>
          </motion.div>

          {/* Slots */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-[var(--color-primary-500)]" />
              <h2 className="text-lg font-bold tracking-tight text-[var(--fg-primary)]">
                Créneaux proposés
              </h2>
            </div>
            <div className="space-y-4">
              {session.slots.map((slot) => (
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
          </motion.div>

          {/* Confirm Winner (only for session creator) */}
          {canConfirm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[var(--color-success-500)] to-teal-500 rounded-2xl p-6 mb-8 shadow-xl shadow-[var(--color-success-500)]/30 relative overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

              <div className="relative z-10 flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-white mb-1">
                    Prêt à confirmer !
                  </h3>
                  <p className="text-sm text-white/90 font-medium">
                    Le quorum est atteint et vous avez assez de joueurs confirmés. Vous pouvez valider la session.
                  </p>
                </div>
              </div>
              <Button
                onClick={handleConfirmWinner}
                variant="secondary"
                fullWidth
                size="lg"
                icon={<CheckCircle className="w-5 h-5" strokeWidth={2} />}
                className="bg-white text-[var(--color-success-600)] hover:bg-[var(--color-success-50)] rounded-xl shadow-md font-bold"
              >
                Confirmer ce créneau
              </Button>
            </motion.div>
          )}

          {/* Info Footer */}
          {!canConfirm && (
            <motion.div variants={itemVariants}>
              <Card variant="ghost" padding="md" className="text-center bg-[var(--bg-elevated)]/60 backdrop-blur-sm border-[var(--border-subtle)]/50">
                <p className="text-sm text-[var(--fg-secondary)] font-medium">
                  {!quorumReached && (
                    <>En attente de plus de votes ({Math.round((hasVotedCount / session.totalMembers) * 100)}% / 80%)</>
                  )}
                  {quorumReached && !winningSlot && (
                    <>Aucun créneau ne remporte la majorité pour le moment</>
                  )}
                  {quorumReached && winningSlot && winningSlot.yesCount < session.playersNeeded && (
                    <>Pas assez de joueurs confirmés sur le créneau gagnant</>
                  )}
                </p>
              </Card>
            </motion.div>
          )}

          {/* Celebration */}
          {showCelebration && (
            <Celebration
              title="Session confirmée !"
              className="absolute top-0 left-0 right-0 bottom-0"
              onEnd={() => setShowCelebration(false)}
            />
          )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default VoteSessionScreen;
