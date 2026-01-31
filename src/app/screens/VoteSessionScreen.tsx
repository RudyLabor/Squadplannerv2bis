/**
 * VOTE SESSION SCREEN - LINEAR DESIGN SYSTEM
 * Premium minimal design matching SessionsScreen reference
 */

import { ArrowLeft, CheckCircle, Trophy, Vote, Users, Calendar, Sparkles, Target, Clock, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlotVoting } from '@/app/components/SlotVoting';
import { Celebration } from '@/app/components/ui/Celebration';
import { useHaptic } from '@/app/hooks/useHaptic';
import { useSoundEffects } from '@/app/hooks/useSoundEffects';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { OrangeDivider } from '@/design-system';

interface VoteSessionScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

// Animations - Linear style
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.02 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }
  }
};

// ============================================
// STAT CARD - Harmonized with HomeScreen style
// ============================================
function StatCard({
  value,
  label,
  icon: Icon,
  accentColor = "#f5a623"
}: {
  value: string | number;
  label: string;
  icon?: any;
  accentColor?: string;
}) {
  return (
    <motion.div
      className="relative p-4 md:p-5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] transition-all duration-200 group cursor-default overflow-hidden"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
    >
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150"
            style={{ backgroundColor: `${accentColor}15` }}
          >
            {Icon && (
              <Icon
                className="w-5 h-5 transition-colors"
                style={{ color: accentColor }}
                strokeWidth={1.5}
              />
            )}
          </div>
        </div>
        <p className="text-[28px] md:text-[32px] font-semibold text-[#f7f8f8] tabular-nums leading-none tracking-tight mb-0.5">
          {value}
        </p>
        <span className="text-[12px] md:text-[13px] text-[rgba(255,255,255,0.4)] uppercase tracking-wide">{label}</span>
      </div>
    </motion.div>
  );
}

// ============================================
// SLOT CARD - Linear dark style for voting
// ============================================
function SlotCard({
  slot,
  userVote,
  onVote,
  isWinning,
  playersNeeded,
  totalMembers
}: {
  slot: any;
  userVote?: 'yes' | 'no' | 'maybe';
  onVote: (slotId: string, response: 'yes' | 'no' | 'maybe') => void;
  isWinning: boolean;
  playersNeeded: number;
  totalMembers: number;
}) {
  const date = new Date(slot.date);
  const formattedDate = date.toLocaleDateString("fr-FR", {
    weekday: 'short',
    day: "numeric",
    month: "short",
  });

  const yesCount = slot.responses.filter((r: any) => r.response === 'yes').length;
  const maybeCount = slot.responses.filter((r: any) => r.response === 'maybe').length;
  const noCount = slot.responses.filter((r: any) => r.response === 'no').length;

  return (
    <motion.div
      className={`p-4 md:p-5 rounded-xl border transition-all duration-100 ${
        isWinning
          ? "bg-[rgba(74,222,128,0.05)] border-[rgba(74,222,128,0.2)]"
          : "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)]"
      }`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.1 }}
    >
      {/* Header with date/time */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1.5 text-[14px] text-[#f7f8f8] font-medium">
              <Calendar className="w-4 h-4 text-[#f5a623]/70" strokeWidth={1.5} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[14px] text-[#8b8d90]">
              <Clock className="w-4 h-4 text-[#60a5fa]/70" strokeWidth={1.5} />
              <span>{slot.time} ({slot.duration})</span>
            </div>
          </div>
          {isWinning && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-lg bg-[rgba(74,222,128,0.15)] text-[#4ade80] uppercase">
              <Trophy className="w-3 h-3" />
              Meilleur créneau
            </span>
          )}
        </div>
      </div>

      {/* Vote counts */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium ${
          yesCount >= playersNeeded
            ? "bg-[rgba(74,222,128,0.1)] text-[#4ade80]"
            : "bg-[rgba(255,255,255,0.04)] text-[#8b8d90]"
        }`}>
          <CheckCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
          {yesCount} présent{yesCount > 1 ? 's' : ''}
        </div>
        {maybeCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium bg-[rgba(245,166,35,0.1)] text-[#f5a623]">
            {maybeCount} peut-être
          </div>
        )}
        {noCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium bg-[rgba(255,255,255,0.04)] text-[#5e6063]">
            {noCount} absent{noCount > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Avatars of respondents */}
      {slot.responses.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex -space-x-2">
            {slot.responses.slice(0, 5).map((response: any, idx: number) => (
              <div
                key={response.playerId}
                className={`w-7 h-7 rounded-full border-2 overflow-hidden ${
                  response.response === 'yes'
                    ? "border-[#4ade80]/50"
                    : response.response === 'maybe'
                    ? "border-[#f5a623]/50"
                    : "border-[#5e6063]/50"
                }`}
                style={{ zIndex: 5 - idx }}
              >
                <img
                  src={response.playerAvatar}
                  alt={response.playerName}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {slot.responses.length > 5 && (
              <div className="w-7 h-7 rounded-full border-2 border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-[10px] font-medium text-[#8b8d90]">
                +{slot.responses.length - 5}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vote buttons */}
      <div className="flex gap-2">
        <motion.button
          onClick={() => onVote(slot.id, 'yes')}
          className={`flex-1 h-10 rounded-lg text-[13px] font-medium flex items-center justify-center gap-1.5 transition-colors ${
            userVote === 'yes'
              ? "bg-[#4ade80] text-[#0f2417]"
              : "bg-[rgba(74,222,128,0.1)] text-[#4ade80] hover:bg-[rgba(74,222,128,0.2)]"
          }`}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <CheckCircle className="w-4 h-4" strokeWidth={2} />
          Je viens
        </motion.button>
        <motion.button
          onClick={() => onVote(slot.id, 'maybe')}
          className={`flex-1 h-10 rounded-lg text-[13px] font-medium flex items-center justify-center gap-1.5 transition-colors ${
            userVote === 'maybe'
              ? "bg-[#f5a623] text-[#1a1408]"
              : "bg-[rgba(245,166,35,0.1)] text-[#f5a623] hover:bg-[rgba(245,166,35,0.2)]"
          }`}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          Peut-être
        </motion.button>
        <motion.button
          onClick={() => onVote(slot.id, 'no')}
          className={`flex-1 h-10 rounded-lg text-[13px] font-medium flex items-center justify-center gap-1.5 transition-colors ${
            userVote === 'no'
              ? "bg-[rgba(255,255,255,0.15)] text-[#f7f8f8]"
              : "bg-[rgba(255,255,255,0.04)] text-[#5e6063] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#8b8d90]"
          }`}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          Absent
        </motion.button>
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
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
    status: 'voting',
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

  // Stats
  const totalVotes = session.slots.reduce((acc, slot) => acc + slot.responses.length, 0);
  const yesVotes = session.slots.reduce((acc, slot) => acc + slot.responses.filter(r => r.response === 'yes').length, 0);

  return (
    <div className="min-h-screen bg-[#08090a] pb-24 md:pb-8 relative">
      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <Celebration
            title="Session confirmée !"
            className="fixed inset-0 z-50"
            onEnd={() => setShowCelebration(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="max-w-3xl mx-auto px-4 md:px-6 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <motion.button
              onClick={() => onNavigate('squad-detail', { id: session.squadId })}
              className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-[24px] md:text-[26px] font-semibold text-[#f7f8f8]">
                Vote Session
              </h1>
              <p className="text-[13px] text-[#8b8d90]">
                {session.squadName}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[rgba(245,166,35,0.1)] flex items-center justify-center">
              <Vote className="w-5 h-5 text-[#f5a623]" strokeWidth={1.5} />
            </div>
          </div>
        </motion.div>

        {/* Session Info Card */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] overflow-hidden">
            {/* Game image */}
            <div className="relative h-32 md:h-40">
              <ImageWithFallback
                src={session.gameImage}
                alt={session.game}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090a] via-[#08090a]/50 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-[11px] text-[#8b8d90] font-medium uppercase tracking-wider mb-1">
                  {session.game}
                </p>
                <h2 className="text-[18px] md:text-[20px] font-semibold text-[#f7f8f8]">
                  {session.title}
                </h2>
              </div>
            </div>

            {/* Session details */}
            <div className="p-4 md:p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg overflow-hidden bg-[rgba(255,255,255,0.05)]">
                  {session.proposedByAvatar ? (
                    <img
                      src={session.proposedByAvatar}
                      alt={session.proposedBy}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#8b8d90] font-medium text-[14px]">
                      {session.proposedBy.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[11px] text-[#5e6063] uppercase tracking-wider">
                    Proposé par
                  </p>
                  <p className="text-[14px] font-medium text-[#f7f8f8]">
                    {session.proposedBy}
                  </p>
                </div>
              </div>

              {/* Objective */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(94,109,210,0.08)] border border-[rgba(94,109,210,0.15)]">
                <Target className="w-4 h-4 text-[#8b93ff]" strokeWidth={1.5} />
                <div>
                  <p className="text-[12px] text-[#8b93ff]">
                    Objectif: <span className="font-semibold">{session.playersNeeded} joueurs minimum</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="grid grid-cols-3 gap-3">
            <StatCard value={session.slots.length} label="Créneaux" icon={Calendar} accentColor="#f5a623" />
            <StatCard value={hasVotedCount} label="Participants" icon={Users} accentColor="#60a5fa" />
            <StatCard value={yesVotes} label="Présents" icon={CheckCircle} accentColor="#4ade80" />
          </div>
          <OrangeDivider className="mt-6" />
        </motion.div>

        {/* Instructions */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="p-4 rounded-xl bg-[rgba(245,166,35,0.05)] border border-[rgba(245,166,35,0.15)]">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[rgba(245,166,35,0.15)] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-[#f5a623]" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-[#f7f8f8] mb-1.5">
                  Comment voter ?
                </h3>
                <ul className="text-[13px] text-[#8b8d90] space-y-1">
                  <li>Votez sur <span className="text-[#f7f8f8] font-medium">chaque créneau</span> proposé</li>
                  <li>Quand <span className="text-[#f7f8f8] font-medium">80% ont voté</span>, le créateur peut confirmer</li>
                  <li>Le créneau avec le <span className="text-[#f7f8f8] font-medium">plus de "Je viens"</span> gagne</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quorum Progress */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#8b93ff]" strokeWidth={1.5} />
                <span className="text-[14px] font-medium text-[#f7f8f8]">
                  Participation globale
                </span>
              </div>
              <span className={`text-[13px] font-medium ${quorumReached ? 'text-[#4ade80]' : 'text-[#8b8d90]'}`}>
                {hasVotedCount}/{session.totalMembers} membres
              </span>
            </div>
            <div className="h-2 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${session.totalMembers > 0 ? (hasVotedCount / session.totalMembers) * 100 : 0}%` }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className={`h-full rounded-full ${
                  quorumReached
                    ? 'bg-[#4ade80]'
                    : 'bg-[#5e6dd2]'
                }`}
              />
            </div>
            {quorumReached && (
              <p className="text-[12px] text-[#4ade80] font-medium mt-2 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                Quorum atteint !
              </p>
            )}
          </div>
        </motion.div>

        {/* Slots Section */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#f5a623]" strokeWidth={1.5} />
            <h2 className="text-[16px] font-semibold text-[#f7f8f8]">
              Créneaux proposés
            </h2>
          </div>
          <div className="space-y-3">
            {session.slots.map((slot) => (
              <motion.div key={slot.id} variants={itemVariants}>
                <SlotCard
                  slot={slot}
                  userVote={userVotes[slot.id]}
                  onVote={handleVote}
                  isWinning={winningSlot?.id === slot.id}
                  playersNeeded={session.playersNeeded}
                  totalMembers={session.totalMembers}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Confirm Winner CTA */}
        {canConfirm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-6"
          >
            <div className="p-5 rounded-xl bg-[rgba(74,222,128,0.08)] border border-[rgba(74,222,128,0.2)]">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[rgba(74,222,128,0.15)] flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 text-[#4ade80]" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-[#f7f8f8] mb-1">
                    Prêt à confirmer !
                  </h3>
                  <p className="text-[13px] text-[#8b8d90]">
                    Le quorum est atteint et vous avez assez de joueurs confirmés.
                  </p>
                </div>
              </div>
              <motion.button
                onClick={handleConfirmWinner}
                className="w-full h-12 rounded-xl bg-[#4ade80] text-[#0f2417] text-[14px] font-semibold flex items-center justify-center gap-2 hover:bg-[#5aea8e] transition-colors"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <CheckCircle className="w-5 h-5" strokeWidth={2} />
                Confirmer ce créneau
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Info Footer */}
        {!canConfirm && (
          <motion.div variants={itemVariants}>
            <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-center">
              <p className="text-[13px] text-[#8b8d90]">
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
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default VoteSessionScreen;
