import { ArrowLeft, Trophy, TrendingUp, Award, Target, Zap, Crown } from 'lucide-react';
import { motion } from 'motion/react';

interface RankingScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

type RankTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'legend';

interface RankData {
  tier: RankTier;
  name: string;
  color: string;
  bg: string;
  minPoints: number;
}

export function RankingScreen({ onNavigate, showToast }: RankingScreenProps) {
  const currentPoints = 2543;
  const currentRank: RankTier = 'platinum';

  const ranks: RankData[] = [
    { tier: 'bronze', name: 'Bronze', color: 'text-[#CD7F32]', bg: 'from-[#CD7F32] to-[#B87333]', minPoints: 0 },
    { tier: 'silver', name: 'Argent', color: 'text-[#C0C0C0]', bg: 'from-[#C0C0C0] to-[#A8A8A8]', minPoints: 500 },
    { tier: 'gold', name: 'Or', color: 'text-[#FFD700]', bg: 'from-[#FFD700] to-[#FFC700]', minPoints: 1000 },
    { tier: 'platinum', name: 'Platine', color: 'text-[var(--secondary-500)]', bg: 'from-[var(--secondary-500)] to-[var(--secondary-600)]', minPoints: 2000 },
    { tier: 'diamond', name: 'Diamant', color: 'text-[#B9F2FF]', bg: 'from-[#B9F2FF] to-[#00BFFF]', minPoints: 3500 },
    { tier: 'master', name: 'Maître', color: 'text-[#9B59B6]', bg: 'from-[#9B59B6] to-[#8E44AD]', minPoints: 5000 },
    { tier: 'legend', name: 'Légende', color: 'text-[var(--primary-500)]', bg: 'from-[var(--primary-500)] to-[var(--primary-600)]', minPoints: 7500 },
  ];

  const currentRankIndex = ranks.findIndex(r => r.tier === currentRank);
  const currentRankData = ranks[currentRankIndex];
  const nextRankData = ranks[currentRankIndex + 1];
  
  const pointsToNextRank = nextRankData ? nextRankData.minPoints - currentPoints : 0;
  const progressToNextRank = nextRankData && (nextRankData.minPoints - currentRankData.minPoints) > 0
    ? ((currentPoints - currentRankData.minPoints) / (nextRankData.minPoints - currentRankData.minPoints)) * 100
    : 100;

  const perks = [
    { icon: Trophy, label: 'Badge exclusif', unlocked: true },
    { icon: Crown, label: 'Titre premium', unlocked: true },
    { icon: Zap, label: 'Boost XP +10%', unlocked: currentRankIndex >= 3 },
    { icon: Award, label: 'Emote spécial', unlocked: currentRankIndex >= 4 },
    { icon: Target, label: 'Accès tournois VIP', unlocked: currentRankIndex >= 5 },
  ];

  return (
    <div className="min-h-screen pb-24 pt-safe">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => onNavigate('profile')}
            className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
              Mon Rang
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] font-medium mt-1">
              Système de classement compétitif
            </p>
          </div>
        </div>

        {/* Current Rank Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-br ${currentRankData.bg} rounded-2xl p-6 mb-8 shadow-lg`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-white/90 text-sm font-semibold mb-2">
                Ton rang actuel
              </div>
              <h2 className="text-4xl font-bold text-white mb-2">
                {currentRankData.name}
              </h2>
              <div className="text-white/90 text-lg font-semibold">
                {currentPoints.toLocaleString()} points
              </div>
            </div>
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" strokeWidth={2} />
            </div>
          </div>

          {/* Progress to Next Rank */}
          {nextRankData && (
            <div>
              <div className="flex items-center justify-between mb-2 text-white/90 text-sm font-medium">
                <span>Progression vers {nextRankData.name}</span>
                <span>{pointsToNextRank} pts restants</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNextRank}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Rank Perks */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-4">
            Avantages de ton rang
          </h3>
          <div className="space-y-3">
            {perks.map((perk, index) => {
              const Icon = perk.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-xl p-4 border-[0.5px] transition-all ${
                    perk.unlocked
                      ? 'border-[var(--success-200)] shadow-sm'
                      : 'border-[var(--border-subtle)] opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      perk.unlocked ? 'bg-[var(--success-50)]' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        perk.unlocked ? 'text-[var(--success-500)]' : 'text-gray-400'
                      }`} strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-semibold ${
                        perk.unlocked ? 'text-[var(--fg-primary)]' : 'text-[var(--fg-tertiary)]'
                      }`}>
                        {perk.label}
                      </div>
                    </div>
                    <div className={`text-xs font-bold ${
                      perk.unlocked ? 'text-[var(--success-500)]' : 'text-[var(--fg-tertiary)]'
                    }`}>
                      {perk.unlocked ? '✓ Débloqué' : '🔒 Verrouillé'}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* All Ranks */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-4">
            Tous les rangs
          </h3>
          <div className="space-y-3">
            {ranks.map((rank, index) => {
              const isCurrent = rank.tier === currentRank;
              const isUnlocked = currentPoints >= rank.minPoints;
              
              return (
                <motion.div
                  key={rank.tier}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-2xl p-4 border-[0.5px] transition-all ${
                    isCurrent
                      ? 'border-[var(--primary-500)] ring-2 ring-[var(--primary-100)] shadow-md'
                      : isUnlocked
                      ? 'border-[var(--border-subtle)] shadow-sm'
                      : 'border-[var(--border-subtle)] opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank Icon */}
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${rank.bg} flex items-center justify-center flex-shrink-0 ${
                      !isUnlocked && 'grayscale opacity-50'
                    }`}>
                      <Trophy className="w-7 h-7 text-white" strokeWidth={2} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`text-lg font-bold ${isUnlocked ? rank.color : 'text-gray-400'}`}>
                          {rank.name}
                        </div>
                        {isCurrent && (
                          <span className="px-2 py-0.5 bg-gradient-to-r from-[var(--primary-500)]/10 to-[var(--primary-600)]/10 border border-[var(--primary-500)]/20 text-[var(--primary-600)] text-xs font-bold rounded-md">
                            ACTUEL
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-[var(--fg-tertiary)] font-medium">
                        {rank.minPoints.toLocaleString()}+ points
                      </div>
                    </div>

                    {/* Status */}
                    {isUnlocked ? (
                      <div className="w-8 h-8 rounded-full bg-[var(--success-50)] flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-5 h-5 text-[var(--success-500)]" strokeWidth={2} />
                      </div>
                    ) : (
                      <div className="text-sm text-[var(--fg-tertiary)] font-semibold flex-shrink-0">
                        🔒
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-[var(--primary-50)] to-[var(--secondary-50)] rounded-2xl p-5 border-[0.5px] border-[var(--primary-100)]"
        >
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-[var(--primary-500)] flex-shrink-0 mt-0.5" strokeWidth={2} />
            <div>
              <div className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                Comment gagner des points ?
              </div>
              <div className="text-xs text-[var(--fg-secondary)] font-medium leading-relaxed">
                • Participe aux sessions (+50 pts)
                <br />
                • Maintiens un score de fiabilité élevé (+20 pts/semaine)
                <br />
                • Organise des sessions (+30 pts)
                <br />
                • Complète des défis (50-200 pts)
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
export default RankingScreen;
