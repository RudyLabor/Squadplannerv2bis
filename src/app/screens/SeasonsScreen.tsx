import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, TrendingUp, Award, Trophy, Clock, Target, ChevronRight, Sparkles, Gift, Star, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { communityAPI } from '@/utils/community-api';

interface SeasonsScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
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

interface PastSeason {
  name: string;
  rank: number;
  points: number;
  reward: string;
  rewardIcon: string;
}

interface CurrentSeasonData {
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  rank: number;
  daysLeft: number;
  points: number;
  challengesCompleted: number;
  rewardsUnlocked: number;
  rewards: { name: string; icon: typeof Award; unlocked: boolean }[];
}

export function SeasonsScreen({ onNavigate, showToast }: SeasonsScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSeason, setCurrentSeason] = useState<CurrentSeasonData | null>(null);
  const [pastSeasons, setPastSeasons] = useState<PastSeason[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [seasonData, userProgress, pastData] = await Promise.all([
        communityAPI.getCurrentSeason(),
        communityAPI.getUserSeasonProgress(),
        communityAPI.getPastSeasons(),
      ]);

      if (seasonData) {
        const endDate = new Date(seasonData.end_date);
        const now = new Date();
        const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

        const formatDate = (dateStr: string) => {
          const date = new Date(dateStr);
          const months = ['Janv', 'Fev', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec'];
          return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
        };

        const userPoints = userProgress?.points || 0;
        const progressPercent = Math.min(100, Math.round((userPoints / 5000) * 100));

        const rewards = [
          { name: 'Badge Exclusif', icon: Award, unlocked: progressPercent >= 25 },
          { name: 'Skin Avatar', icon: Star, unlocked: progressPercent >= 50 },
          { name: 'Titre Legendaire', icon: Trophy, unlocked: progressPercent >= 100 },
        ];

        setCurrentSeason({
          name: seasonData.name,
          startDate: formatDate(seasonData.start_date),
          endDate: formatDate(seasonData.end_date),
          progress: progressPercent,
          rank: userProgress?.rank || 0,
          daysLeft,
          points: userProgress?.points || 0,
          challengesCompleted: userProgress?.challenges_completed || 0,
          rewardsUnlocked: rewards.filter(r => r.unlocked).length,
          rewards,
        });
      }

      const formattedPastSeasons: PastSeason[] = pastData.map((s: any) => ({
        name: s.name,
        rank: s.finalRank || 0,
        points: s.totalPoints || 0,
        reward: s.rewardEarned || 'Participation',
        rewardIcon: s.finalRank === 1 ? '1' : s.finalRank <= 3 ? '2' : '3',
      }));
      setPastSeasons(formattedPastSeasons);
    } catch (error) {
      console.error('Error loading seasons:', error);
      showToast?.('Erreur de chargement', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090a] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
          <span className="text-[#8a8f98] text-sm">Chargement...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#08090a] pb-24 md:pb-8"
    >
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <motion.button
              onClick={() => onNavigate?.('home')}
              className="w-10 h-10 rounded-xl bg-[#1a1a1a]/60 border border-[#2a2a2a] flex items-center justify-center hover:bg-[#2a2a2a]/60 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-[#8a8f98]" strokeWidth={1.5} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-[#f5f5f5] tracking-tight">
                Saisons
              </h1>
              <p className="text-sm text-[#8a8f98]">
                Progression trimestrielle
              </p>
            </div>
            <motion.button
              onClick={loadData}
              disabled={isLoading}
              className="w-10 h-10 rounded-xl bg-[#1a1a1a]/60 border border-[#2a2a2a] flex items-center justify-center hover:bg-[#2a2a2a]/60 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-4 h-4 text-[#8a8f98] ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#60a5fa]" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Current Season Card */}
          {currentSeason && (
            <motion.div
              variants={itemVariants}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-[#1a1a1a]/40 to-[#1a1a1a]/60 border border-blue-500/20 p-6 mb-6"
            >
              {/* Subtle glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-[#60a5fa]" />
                      <span className="text-xs font-medium text-[#60a5fa] uppercase tracking-wider">
                        Saison en cours
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#f5f5f5] tracking-tight mb-2">
                      {currentSeason.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[#8a8f98] text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{currentSeason.startDate} - {currentSeason.endDate}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center px-4 py-3 bg-[#1a1a1a]/60 border border-[#2a2a2a] rounded-xl">
                    <div className="text-2xl font-bold text-[#f5f5f5]">#{currentSeason.rank}</div>
                    <div className="text-xs text-[#8a8f98]">Rang actuel</div>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="bg-[#1a1a1a]/40 border border-[#2a2a2a] rounded-xl p-4 mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-2 text-sm font-medium text-[#f5f5f5]">
                      <TrendingUp className="w-4 h-4 text-[#60a5fa]" />
                      Progression
                    </span>
                    <span className="text-xs font-medium text-[#8a8f98] bg-[#2a2a2a]/60 px-2 py-1 rounded-lg">
                      {currentSeason.daysLeft} jours restants
                    </span>
                  </div>
                  <div className="h-2 bg-[#2a2a2a] rounded-full overflow-hidden mb-2">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#60a5fa] to-blue-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${currentSeason.progress}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="text-right text-sm text-[#8a8f98]">
                    {currentSeason.progress}% complete
                  </div>
                </div>

                {/* Season Rewards */}
                <div className="grid grid-cols-3 gap-3">
                  {currentSeason.rewards.map((reward, index) => {
                    const Icon = reward.icon;
                    return (
                      <motion.div
                        key={index}
                        className={`flex flex-col items-center p-3 rounded-xl border transition-all ${
                          reward.unlocked
                            ? 'bg-blue-500/10 border-blue-500/30'
                            : 'bg-[#1a1a1a]/40 border-[#2a2a2a] opacity-50'
                        }`}
                        whileHover={reward.unlocked ? { scale: 1.02 } : {}}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                          reward.unlocked ? 'bg-blue-500/20' : 'bg-[#2a2a2a]/60'
                        }`}>
                          <Icon className={`w-5 h-5 ${reward.unlocked ? 'text-[#60a5fa]' : 'text-[#5a5a5a]'}`} strokeWidth={1.5} />
                        </div>
                        <span className={`text-xs text-center font-medium ${reward.unlocked ? 'text-[#f5f5f5]' : 'text-[#5a5a5a]'}`}>
                          {reward.name}
                        </span>
                        {reward.unlocked && (
                          <span className="text-xs text-[#60a5fa] mt-1">Debloque</span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Row */}
          {currentSeason && (
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-6">
              <motion.div
                className="p-4 rounded-xl bg-[#1a1a1a]/40 border border-[#2a2a2a] hover:border-emerald-500/30 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
                  <Trophy className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
                </div>
                <div className="text-lg font-bold text-[#f5f5f5]">{currentSeason.points.toLocaleString()}</div>
                <div className="text-xs text-[#8a8f98]">Points</div>
              </motion.div>

              <motion.div
                className="p-4 rounded-xl bg-[#1a1a1a]/40 border border-[#2a2a2a] hover:border-amber-500/30 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3">
                  <Target className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
                </div>
                <div className="text-lg font-bold text-[#f5f5f5]">{currentSeason.challengesCompleted}</div>
                <div className="text-xs text-[#8a8f98]">Defis</div>
              </motion.div>

              <motion.div
                className="p-4 rounded-xl bg-[#1a1a1a]/40 border border-[#2a2a2a] hover:border-rose-500/30 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-9 h-9 rounded-lg bg-rose-500/10 flex items-center justify-center mb-3">
                  <Gift className="w-4 h-4 text-rose-400" strokeWidth={1.5} />
                </div>
                <div className="text-lg font-bold text-[#f5f5f5]">{currentSeason.rewardsUnlocked}</div>
                <div className="text-xs text-[#8a8f98]">Recompenses</div>
              </motion.div>
            </motion.div>
          )}

          {/* Past Seasons */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#1a1a1a]/60 border border-[#2a2a2a] flex items-center justify-center">
                <Clock className="w-4 h-4 text-[#8a8f98]" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold text-[#f5f5f5]">
                Saisons precedentes
              </h3>
            </div>

            <div className="space-y-3">
              {pastSeasons.length > 0 ? (
                pastSeasons.map((season, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="p-4 rounded-xl bg-[#1a1a1a]/40 border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#2a2a2a]/60 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-[#8a8f98]" strokeWidth={1.5} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-[#f5f5f5]">{season.name}</h4>
                          <span className="px-2 py-0.5 bg-blue-500/10 text-[#60a5fa] text-xs font-semibold rounded-lg border border-blue-500/20">
                            #{season.rank}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-[#8a8f98]">
                          <span>{season.points.toLocaleString()} points</span>
                          <span className="w-1 h-1 rounded-full bg-[#3a3a3a]" />
                          <span>{season.reward}</span>
                        </div>
                      </div>

                      <motion.button
                        className="w-9 h-9 rounded-lg bg-[#2a2a2a]/40 flex items-center justify-center hover:bg-[#3a3a3a]/40 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ChevronRight className="w-4 h-4 text-[#8a8f98]" strokeWidth={1.5} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-6 rounded-xl bg-[#1a1a1a]/40 border border-[#2a2a2a] text-center">
                  <Calendar className="w-10 h-10 text-[#5a5a5a] mx-auto mb-3" strokeWidth={1.5} />
                  <p className="text-[#8a8f98] text-sm">Aucune saison precedente</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Info Banner */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-xl bg-[#1a1a1a]/40 border border-[#2a2a2a] p-5"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Gift className="w-5 h-5 text-amber-400" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-[#f5f5f5] mb-1">
                  Recompenses de fin de saison
                </div>
                <div className="text-sm text-[#8a8f98] leading-relaxed">
                  Monte dans le classement pour debloquer des recompenses exclusives :
                  badges, titres, skins et bien plus encore !
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default SeasonsScreen;
