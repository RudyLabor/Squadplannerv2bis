import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, TrendingUp, Award, Trophy, Clock, Target, ChevronRight, Sparkles, Gift, Star, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { communityAPI, type Season } from '@/utils/community-api';
import { Card, Button, SkeletonPage } from '@/design-system';

interface SeasonsScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
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
        // Calculate days left
        const endDate = new Date(seasonData.end_date);
        const now = new Date();
        const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

        // Format dates
        const formatDate = (dateStr: string) => {
          const date = new Date(dateStr);
          const months = ['Janv', 'Fev', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec'];
          return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
        };

        // Calculate progress based on points (e.g., target of 5000 points per season)
        const userPoints = userProgress?.points || 0;
        const progressPercent = Math.min(100, Math.round((userPoints / 5000) * 100));

        // Calculate rewards unlocked based on progress
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

      // Format past seasons
      const formattedPastSeasons: PastSeason[] = pastData.map((s: any) => ({
        name: s.name,
        rank: s.finalRank || 0,
        points: s.totalPoints || 0,
        reward: s.rewardEarned || 'Participation',
        rewardIcon: s.finalRank === 1 ? '🏆' : s.finalRank <= 3 ? '🥈' : '🎖️',
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
    return <SkeletonPage />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.35 }}
      className="min-h-screen pb-24 pt-safe bg-[var(--bg-base)] relative overflow-hidden"
    >
      {/* Background decorations - Static for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-3xl" />
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
              onClick={() => onNavigate?.('home')}
              className="w-12 h-12 rounded-2xl bg-[var(--bg-elevated)] backdrop-blur-sm border border-[var(--border-subtle)] flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-[var(--fg-secondary)]" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Saisons
              </h1>
              <p className="text-sm text-[var(--fg-secondary)] font-medium mt-0.5">
                Progression trimestrielle
              </p>
            </div>
            <motion.button
              onClick={loadData}
              disabled={isLoading}
              className="w-10 h-10 rounded-xl bg-[var(--bg-elevated)] backdrop-blur-sm border border-[var(--border-subtle)] flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-4 h-4 text-[var(--fg-secondary)] ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Calendar className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center py-6 mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-xl shadow-indigo-500/30">
              <Calendar className="w-10 h-10 text-white" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg-primary)] mb-2">
              Saisons Competitives
            </h2>
            <p className="text-sm text-[var(--fg-secondary)] max-w-md mx-auto">
              Progression trimestrielle avec recompenses exclusives
            </p>
          </motion.div>

          {/* Current Season Card */}
          {currentSeason && (
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="relative overflow-hidden p-6 mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 border-0 shadow-xl shadow-indigo-500/30">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-white/80 text-sm font-semibold mb-1 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Saison en cours
                      </div>
                      <h3 className="text-3xl font-bold tracking-tight text-white mb-1">{currentSeason.name}</h3>
                      <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                        <Clock className="w-4 h-4" />
                        <span>{currentSeason.startDate} - {currentSeason.endDate}</span>
                      </div>
                    </div>
                    <motion.div
                      className="flex flex-col items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-white text-2xl font-bold tracking-tight">#{currentSeason.rank}</div>
                      <div className="text-white/80 text-sm font-medium">Rang actuel</div>
                    </motion.div>
                  </div>

                  {/* Progress Section */}
                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-3 text-white text-sm font-semibold">
                      <span className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Progression de la saison
                      </span>
                      <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">
                        {currentSeason.daysLeft} jours restants
                      </span>
                    </div>
                    <div className="h-4 bg-white/20 rounded-full overflow-hidden mb-2">
                      <motion.div
                        className="h-full bg-white rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${currentSeason.progress}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                      />
                    </div>
                    <div className="text-center text-white/90 text-sm font-medium">
                      {currentSeason.progress}% complete
                    </div>
                  </div>

                  {/* Season Rewards */}
                  <div className="flex items-center justify-between gap-2">
                    {currentSeason.rewards.map((reward, index) => {
                      const Icon = reward.icon;
                      return (
                        <motion.div
                          key={index}
                          className={`flex-1 flex flex-col items-center p-3 rounded-xl ${
                            reward.unlocked
                              ? 'bg-white/20 backdrop-blur-sm'
                              : 'bg-white/10 opacity-60'
                          }`}
                          whileHover={reward.unlocked ? { scale: 1.05 } : {}}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                            reward.unlocked ? 'bg-white/30' : 'bg-white/10'
                          }`}>
                            <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                          </div>
                          <span className="text-sm text-white/90 font-medium text-center">{reward.name}</span>
                          {reward.unlocked && (
                            <span className="text-sm text-white/70 font-medium mt-1">Debloque</span>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Stats Row */}
          {currentSeason && (
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-6">
              <motion.div whileHover={{ scale: 1.02 }}>
                <Card className="p-4 bg-gradient-to-br from-emerald-500 to-teal-500 border-0 shadow-lg shadow-emerald-500/30">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-2">
                    <Trophy className="w-4 h-4 text-white" strokeWidth={2} />
                  </div>
                  <div className="text-xl font-bold tracking-tight text-white">{currentSeason.points.toLocaleString()}</div>
                  <div className="text-sm text-white/80 font-medium">Points</div>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }}>
                <Card className="p-4 bg-gradient-to-br from-amber-500 to-orange-500 border-0 shadow-lg shadow-amber-500/30">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-2">
                    <Target className="w-4 h-4 text-white" strokeWidth={2} />
                  </div>
                  <div className="text-xl font-bold tracking-tight text-white">{currentSeason.challengesCompleted}</div>
                  <div className="text-sm text-white/80 font-medium">Defis</div>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }}>
                <Card className="p-4 bg-gradient-to-br from-rose-500 to-pink-500 border-0 shadow-lg shadow-rose-500/30">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-2">
                    <Gift className="w-4 h-4 text-white" strokeWidth={2} />
                  </div>
                  <div className="text-xl font-bold tracking-tight text-white">{currentSeason.rewardsUnlocked}</div>
                  <div className="text-sm text-white/80 font-medium">Recompenses</div>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {/* Past Seasons */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-md">
                <Clock className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold tracking-tight text-[var(--fg-primary)]">
                Saisons precedentes
              </h3>
            </div>
            <div className="space-y-3">
              {pastSeasons.map((season, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="p-4 hover:shadow-xl transition-all duration-300" interactive>
                    <div className="flex items-center gap-4">
                      {/* Season Icon */}
                      <motion.div
                        className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Calendar className="w-7 h-7 text-white" strokeWidth={2} />
                      </motion.div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold tracking-tight text-[var(--fg-primary)]">{season.name}</h4>
                          <span className="px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold rounded-lg">
                            #{season.rank}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-[var(--fg-secondary)] font-medium">
                          <span>{season.points.toLocaleString()} points</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <span>{season.rewardIcon}</span>
                            {season.reward}
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <motion.button
                        className="w-10 h-10 rounded-xl bg-[var(--bg-base)] flex items-center justify-center hover:bg-[var(--bg-elevated)] transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ChevronRight className="w-5 h-5 text-[var(--fg-secondary)]" strokeWidth={2} />
                      </motion.button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Info Banner */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="relative overflow-hidden p-5 bg-gradient-to-br from-amber-500 to-orange-500 border-0 shadow-xl">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

              <div className="relative z-10 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <Gift className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <div className="text-base font-bold tracking-tight text-white mb-1">
                    Recompenses de fin de saison
                  </div>
                  <div className="text-sm text-white/90 font-medium leading-relaxed">
                    Monte dans le classement pour debloquer des recompenses exclusives :
                    badges, titres, skins et bien plus encore !
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default SeasonsScreen;
