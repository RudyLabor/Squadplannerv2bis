import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, TrendingUp, Award, Target, Zap, Crown, Sparkles, CheckCircle, Lock, Loader2, RefreshCw, Medal, Star, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { communityAPI } from '@/utils/community-api';

interface RankingScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

type RankTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'legend';

interface RankData {
  tier: RankTier;
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  minPoints: number;
  icon: React.ElementType;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 28 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 400, damping: 28 }
  }
};

export function RankingScreen({ onNavigate, showToast }: RankingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [currentRank, setCurrentRank] = useState<RankTier>('bronze');

  const ranks: RankData[] = [
    { tier: 'bronze', name: 'Bronze', color: '#cd7f32', bgColor: 'bg-[#cd7f32]/10', borderColor: 'border-[#cd7f32]/30', minPoints: 0, icon: Medal },
    { tier: 'silver', name: 'Argent', color: '#c0c0c0', bgColor: 'bg-[#c0c0c0]/10', borderColor: 'border-[#c0c0c0]/30', minPoints: 500, icon: Medal },
    { tier: 'gold', name: 'Or', color: '#ffd700', bgColor: 'bg-[#ffd700]/10', borderColor: 'border-[#ffd700]/30', minPoints: 1000, icon: Trophy },
    { tier: 'platinum', name: 'Platine', color: '#00d4aa', bgColor: 'bg-[#00d4aa]/10', borderColor: 'border-[#00d4aa]/30', minPoints: 2000, icon: Star },
    { tier: 'diamond', name: 'Diamant', color: '#00bfff', bgColor: 'bg-[#00bfff]/10', borderColor: 'border-[#00bfff]/30', minPoints: 3500, icon: Sparkles },
    { tier: 'master', name: 'Maître', color: '#a855f7', bgColor: 'bg-[#a855f7]/10', borderColor: 'border-[#a855f7]/30', minPoints: 5000, icon: Crown },
    { tier: 'legend', name: 'Légende', color: '#f43f5e', bgColor: 'bg-[#f43f5e]/10', borderColor: 'border-[#f43f5e]/30', minPoints: 7500, icon: Flame },
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

  // Podium colors for top 3
  const podiumColors = ['#ffd700', '#c0c0c0', '#cd7f32']; // Gold, Silver, Bronze

  return (
    <div className="min-h-screen pb-24 md:pb-8 pt-safe bg-[#08090a]">
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
            <motion.button
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center hover:bg-[#222] hover:border-[#3a3a3a] transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-[#8a8a8a]" strokeWidth={1.5} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-white">
                Mon Rang
              </h1>
              <p className="text-sm text-[#6a6a6a]">
                Système de classement compétitif
              </p>
            </div>
            <motion.button
              onClick={loadData}
              disabled={isLoading}
              className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center hover:bg-[#222] hover:border-[#3a3a3a] transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-4 h-4 text-[#6a6a6a] ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${currentRankData?.color || '#f5a623'}20` }}
              whileHover={{ scale: 1.05 }}
            >
              <Trophy className="w-5 h-5" style={{ color: '#f5a623' }} strokeWidth={1.5} />
            </motion.div>
          </motion.div>

          {/* Loading State */}
          {isLoading ? (
            <motion.div
              variants={scaleIn}
              className="flex items-center justify-center py-20"
            >
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-[#f5a623]/10 flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-6 h-6 text-[#f5a623] animate-spin" />
                </div>
                <p className="text-[#6a6a6a] text-sm">Chargement...</p>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Current Rank Card - Podium Style */}
              {currentRankData && (
                <motion.div
                  variants={scaleIn}
                  className="relative overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#111]/80 p-6 mb-6"
                >
                  {/* Gradient overlay based on rank */}
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{ background: `radial-gradient(circle at top right, ${currentRankData.color}, transparent 70%)` }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="text-[#6a6a6a] text-xs font-medium mb-2 flex items-center gap-2 uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5" style={{ color: currentRankData.color }} />
                          Ton rang actuel
                        </div>
                        <h2
                          className="text-3xl font-bold mb-1"
                          style={{ color: currentRankData.color }}
                        >
                          {currentRankData.name}
                        </h2>
                        <div className="text-white text-lg font-semibold">
                          {currentPoints.toLocaleString()} <span className="text-[#6a6a6a] text-sm font-normal">points</span>
                        </div>
                      </div>

                      {/* Podium Badge */}
                      <motion.div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center relative"
                        style={{ backgroundColor: `${currentRankData.color}15`, border: `1px solid ${currentRankData.color}30` }}
                        whileHover={{ scale: 1.05, rotate: 5 }}
                      >
                        {(() => {
                          const RankIcon = currentRankData.icon;
                          return <RankIcon className="w-10 h-10" style={{ color: currentRankData.color }} strokeWidth={1.5} />;
                        })()}
                      </motion.div>
                    </div>

                    {/* Progress to Next Rank */}
                    {nextRankData && (
                      <div className="bg-[#0a0a0a] rounded-xl p-4 border border-[#1a1a1a]">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[#8a8a8a] text-sm font-medium flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" style={{ color: nextRankData.color }} />
                            Vers {nextRankData.name}
                          </span>
                          <span
                            className="text-xs font-medium px-2.5 py-1 rounded-lg"
                            style={{ backgroundColor: `${nextRankData.color}15`, color: nextRankData.color }}
                          >
                            {pointsToNextRank} pts restants
                          </span>
                        </div>
                        <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: currentRankData.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${progressToNextRank}%` }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                          />
                        </div>
                        <div className="text-center text-[#6a6a6a] text-xs mt-2">
                          {Math.round(progressToNextRank)}% complété
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Rank Perks */}
              <motion.div variants={itemVariants} className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: '#10b98115' }}
                  >
                    <Award className="w-4.5 h-4.5" style={{ color: '#10b981' }} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    Avantages de ton rang
                  </h3>
                </div>
                <div className="space-y-2">
                  {perks.map((perk, index) => {
                    const Icon = perk.icon;
                    return (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className={`rounded-xl p-3.5 border transition-all duration-200 ${
                          perk.unlocked
                            ? 'bg-[#111]/60 border-[#2a2a2a] hover:border-[#3a3a3a]'
                            : 'bg-[#0a0a0a]/40 border-[#1a1a1a] opacity-50'
                        }`}
                        whileHover={perk.unlocked ? { x: 4 } : {}}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: perk.unlocked ? '#10b98115' : '#1a1a1a',
                            }}
                          >
                            <Icon
                              className="w-5 h-5"
                              style={{ color: perk.unlocked ? '#10b981' : '#4a4a4a' }}
                              strokeWidth={1.5}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium ${
                              perk.unlocked ? 'text-white' : 'text-[#4a4a4a]'
                            }`}>
                              {perk.label}
                            </div>
                            <div className={`text-xs ${
                              perk.unlocked ? 'text-[#6a6a6a]' : 'text-[#3a3a3a]'
                            }`}>
                              {perk.description}
                            </div>
                          </div>
                          {perk.unlocked ? (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#10b981]/10 rounded-lg">
                              <CheckCircle className="w-3.5 h-3.5 text-[#10b981]" strokeWidth={2} />
                              <span className="text-xs font-medium text-[#10b981]">Actif</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1a1a1a] rounded-lg">
                              <Lock className="w-3.5 h-3.5 text-[#4a4a4a]" strokeWidth={2} />
                              <span className="text-xs font-medium text-[#4a4a4a]">Bloqué</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* All Ranks - Podium Style */}
              <motion.div variants={itemVariants} className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: '#f5a62315' }}
                  >
                    <Crown className="w-4.5 h-4.5" style={{ color: '#f5a623' }} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    Tous les rangs
                  </h3>
                </div>
                <div className="space-y-2">
                  {ranks.map((rank, index) => {
                    const isCurrent = rank.tier === currentRank;
                    const isUnlocked = currentPoints >= rank.minPoints;
                    const RankIcon = rank.icon;

                    return (
                      <motion.div
                        key={rank.tier}
                        variants={itemVariants}
                        className={`rounded-xl p-3.5 border transition-all duration-200 ${
                          isCurrent
                            ? 'bg-[#111]/80 border-[#f5a623]/30'
                            : isUnlocked
                            ? 'bg-[#111]/60 border-[#2a2a2a] hover:border-[#3a3a3a]'
                            : 'bg-[#0a0a0a]/40 border-[#1a1a1a] opacity-40'
                        }`}
                        whileHover={isUnlocked ? { x: 4 } : {}}
                        style={isCurrent ? { boxShadow: `0 0 20px ${rank.color}10` } : {}}
                      >
                        <div className="flex items-center gap-3">
                          {/* Rank Icon */}
                          <motion.div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              !isUnlocked && 'grayscale'
                            }`}
                            style={{
                              backgroundColor: `${rank.color}15`,
                              border: `1px solid ${rank.color}30`
                            }}
                            whileHover={isUnlocked ? { scale: 1.1, rotate: 5 } : {}}
                          >
                            <RankIcon
                              className="w-6 h-6"
                              style={{ color: isUnlocked ? rank.color : '#4a4a4a' }}
                              strokeWidth={1.5}
                            />
                          </motion.div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span
                                className={`text-sm font-semibold ${isUnlocked ? '' : 'text-[#4a4a4a]'}`}
                                style={isUnlocked ? { color: rank.color } : {}}
                              >
                                {rank.name}
                              </span>
                              {isCurrent && (
                                <span
                                  className="px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wide"
                                  style={{ backgroundColor: '#f5a62320', color: '#f5a623' }}
                                >
                                  Actuel
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-[#6a6a6a]">
                              {rank.minPoints.toLocaleString()}+ points requis
                            </div>
                          </div>

                          {/* Status */}
                          {isUnlocked ? (
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${rank.color}15` }}
                            >
                              <CheckCircle className="w-4 h-4" style={{ color: rank.color }} strokeWidth={2} />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                              <Lock className="w-4 h-4 text-[#3a3a3a]" strokeWidth={2} />
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
                className="rounded-xl border border-[#2a2a2a] bg-[#111]/60 p-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#3b82f615' }}
                  >
                    <Target className="w-4.5 h-4.5" style={{ color: '#3b82f6' }} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white mb-2">
                      Comment gagner des points ?
                    </div>
                    <div className="space-y-1.5">
                      {[
                        { text: 'Participe aux sessions', pts: '+50 pts' },
                        { text: 'Score de fiabilité élevé', pts: '+20 pts/sem' },
                        { text: 'Organise des sessions', pts: '+30 pts' },
                        { text: 'Complète des défis', pts: '50-200 pts' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="text-[#8a8a8a] flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-[#3b82f6]" />
                            {item.text}
                          </span>
                          <span className="text-[#3b82f6] font-medium">{item.pts}</span>
                        </div>
                      ))}
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
