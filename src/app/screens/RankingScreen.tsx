import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, TrendingUp, Award, Target, Zap, Crown, Sparkles, CheckCircle, Lock, Loader2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { communityAPI, LEAGUE_TIERS } from '@/utils/community-api';

interface RankingScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

type RankTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'legend';

interface RankData {
  tier: RankTier;
  name: string;
  gradient: string;
  shadow: string;
  minPoints: number;
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

export function RankingScreen({ onNavigate, showToast }: RankingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [currentRank, setCurrentRank] = useState<RankTier>('bronze');

  const ranks: RankData[] = [
    { tier: 'bronze', name: 'Bronze', gradient: 'from-amber-600 to-amber-700', shadow: 'shadow-amber-600/30', minPoints: 0 },
    { tier: 'silver', name: 'Argent', gradient: 'from-gray-400 to-gray-500', shadow: 'shadow-gray-400/30', minPoints: 500 },
    { tier: 'gold', name: 'Or', gradient: 'from-amber-400 to-yellow-500', shadow: 'shadow-amber-400/30', minPoints: 1000 },
    { tier: 'platinum', name: 'Platine', gradient: 'from-cyan-400 to-teal-500', shadow: 'shadow-cyan-400/30', minPoints: 2000 },
    { tier: 'diamond', name: 'Diamant', gradient: 'from-blue-400 to-cyan-400', shadow: 'shadow-blue-400/30', minPoints: 3500 },
    { tier: 'master', name: 'Maître', gradient: 'from-purple-500 to-violet-600', shadow: 'shadow-purple-500/30', minPoints: 5000 },
    { tier: 'legend', name: 'Légende', gradient: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-500/30', minPoints: 7500 },
  ];

  const currentRankIndex = ranks.findIndex(r => r.tier === currentRank);
  const currentRankData = ranks[currentRankIndex];
  const nextRankData = ranks[currentRankIndex + 1];

  const pointsToNextRank = nextRankData ? nextRankData.minPoints - currentPoints : 0;
  const progressToNextRank = nextRankData && (nextRankData.minPoints - currentRankData.minPoints) > 0
    ? ((currentPoints - currentRankData.minPoints) / (nextRankData.minPoints - currentRankData.minPoints)) * 100
    : 100;

  const perks = [
    { icon: Trophy, label: 'Badge exclusif', description: 'Affiche ton rang', unlocked: true },
    { icon: Crown, label: 'Titre premium', description: 'Visible par tous', unlocked: true },
    { icon: Zap, label: 'Boost XP +10%', description: 'Progresse plus vite', unlocked: currentRankIndex >= 3 },
    { icon: Award, label: 'Emote spécial', description: 'Réactions uniques', unlocked: currentRankIndex >= 4 },
    { icon: Target, label: 'Accès tournois VIP', description: 'Tournois exclusifs', unlocked: currentRankIndex >= 5 },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const userLeagueInfo = await communityAPI.getUserLeagueInfo();
      setCurrentPoints(userLeagueInfo.points);

      // Determine rank tier based on points
      const tier = ranks.reduce((acc, rank) => {
        if (userLeagueInfo.points >= rank.minPoints) return rank.tier;
        return acc;
      }, 'bronze' as RankTier);
      setCurrentRank(tier);
    } catch (error) {
      console.error('Error loading rank:', error);
      showToast?.('Erreur de chargement', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations - Static for performance (no infinite animations) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 w-64 h-64 bg-gradient-to-br from-amber-400/10 to-yellow-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <motion.button
              onClick={() => onNavigate('profile')}
              className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Mon Rang
              </h1>
              <p className="text-sm text-gray-500 font-medium mt-0.5">
                Système de classement compétitif
              </p>
            </div>
            <motion.button
              onClick={loadData}
              disabled={isLoading}
              className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-4 h-4 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
            <motion.div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentRankData?.gradient || 'from-amber-600 to-amber-700'} flex items-center justify-center shadow-lg ${currentRankData?.shadow || 'shadow-amber-600/30'}`}
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Trophy className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Chargement...</p>
              </div>
            </div>
          ) : (
            <>
          {/* Current Rank Card */}
          {currentRankData && (
          <motion.div
            variants={itemVariants}
            className={`relative overflow-hidden bg-gradient-to-br ${currentRankData.gradient} rounded-3xl p-6 mb-8 shadow-xl ${currentRankData.shadow}`}
            whileHover={{ scale: 1.01 }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-white/80 text-sm font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Ton rang actuel
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-2">
                    {currentRankData.name}
                  </h2>
                  <div className="text-white/90 text-xl font-bold">
                    {currentPoints.toLocaleString()} points
                  </div>
                </div>
                <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <Trophy className="w-12 h-12 text-white" strokeWidth={1.5} />
                </div>
              </div>

              {/* Progress to Next Rank */}
              {nextRankData && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3 text-white text-sm font-semibold">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Vers {nextRankData.name}
                    </span>
                    <span className="bg-white/20 px-3 py-1 rounded-lg text-xs">
                      {pointsToNextRank} pts restants
                    </span>
                  </div>
                  <div className="h-4 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressToNextRank}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="text-center text-white/80 text-xs font-medium mt-2">
                    {Math.round(progressToNextRank)}% complété
                  </div>
                </div>
              )}
            </div>
          </motion.div>
          )}

          {/* Rank Perks */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                <Award className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                Avantages de ton rang
              </h3>
            </div>
            <div className="space-y-3">
              {perks.map((perk, index) => {
                const Icon = perk.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className={`bg-white/80 backdrop-blur-sm rounded-2xl p-4 border transition-all duration-300 ${
                      perk.unlocked
                        ? 'border-emerald-200 shadow-lg hover:shadow-xl'
                        : 'border-white/50 opacity-60'
                    }`}
                    whileHover={perk.unlocked ? { scale: 1.01, y: -2 } : {}}
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                          perk.unlocked
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                            : 'bg-gray-200'
                        }`}
                        whileHover={perk.unlocked ? { scale: 1.1, rotate: 5 } : {}}
                      >
                        <Icon className={`w-6 h-6 ${perk.unlocked ? 'text-white' : 'text-gray-400'}`} strokeWidth={2} />
                      </motion.div>
                      <div className="flex-1">
                        <div className={`text-sm font-bold ${
                          perk.unlocked ? 'text-gray-800' : 'text-gray-400'
                        }`}>
                          {perk.label}
                        </div>
                        <div className={`text-xs font-medium ${
                          perk.unlocked ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {perk.description}
                        </div>
                      </div>
                      {perk.unlocked ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 rounded-xl">
                          <CheckCircle className="w-4 h-4 text-emerald-600" strokeWidth={2} />
                          <span className="text-xs font-bold text-emerald-600">Débloqué</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-xl">
                          <Lock className="w-4 h-4 text-gray-400" strokeWidth={2} />
                          <span className="text-xs font-bold text-gray-400">Verrouillé</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* All Ranks */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                <Crown className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                Tous les rangs
              </h3>
            </div>
            <div className="space-y-3">
              {ranks.map((rank, index) => {
                const isCurrent = rank.tier === currentRank;
                const isUnlocked = currentPoints >= rank.minPoints;

                return (
                  <motion.div
                    key={rank.tier}
                    variants={itemVariants}
                    className={`bg-white/80 backdrop-blur-sm rounded-2xl p-4 border transition-all duration-300 ${
                      isCurrent
                        ? 'border-cyan-300 shadow-xl ring-2 ring-cyan-100'
                        : isUnlocked
                        ? 'border-white/50 shadow-lg hover:shadow-xl'
                        : 'border-white/30 opacity-50'
                    }`}
                    whileHover={isUnlocked ? { scale: 1.01, y: -2 } : {}}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank Icon */}
                      <motion.div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${rank.gradient} flex items-center justify-center flex-shrink-0 shadow-lg ${rank.shadow} ${
                          !isUnlocked && 'grayscale opacity-50'
                        }`}
                        whileHover={isUnlocked ? { scale: 1.1, rotate: 5 } : {}}
                      >
                        <Trophy className="w-7 h-7 text-white" strokeWidth={2} />
                      </motion.div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`text-lg font-bold ${isUnlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                            {rank.name}
                          </div>
                          {isCurrent && (
                            <span className="px-2.5 py-1 bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-bold rounded-lg shadow-md">
                              ACTUEL
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 font-medium">
                          {rank.minPoints.toLocaleString()}+ points
                        </div>
                      </div>

                      {/* Status */}
                      {isUnlocked ? (
                        <motion.div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${rank.gradient} flex items-center justify-center flex-shrink-0 shadow-md ${rank.shadow}`}
                          whileHover={{ scale: 1.1 }}
                        >
                          <TrendingUp className="w-5 h-5 text-white" strokeWidth={2} />
                        </motion.div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Lock className="w-5 h-5 text-gray-400" strokeWidth={2} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Info Banner */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 shadow-xl"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <div className="text-base font-bold text-white mb-2">
                  Comment gagner des points ?
                </div>
                <div className="text-sm text-white/90 font-medium leading-relaxed space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                    <span>Participe aux sessions (+50 pts)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                    <span>Maintiens un score de fiabilité élevé (+20 pts/semaine)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                    <span>Organise des sessions (+30 pts)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                    <span>Complète des défis (50-200 pts)</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default RankingScreen;
