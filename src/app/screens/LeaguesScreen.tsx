import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Users, TrendingUp, ChevronRight, Sparkles, Crown, Target, Zap, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { communityAPI, LEAGUE_TIERS, type League } from '@/utils/community-api';
import { Card, Button, SkeletonPage } from '@/design-system';

interface LeaguesScreenProps {
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

interface UserLeagueInfo {
  currentLeague: typeof LEAGUE_TIERS[keyof typeof LEAGUE_TIERS] & { tier: string };
  points: number;
  rank: number;
  progress: number;
  pointsThisWeek: number;
  sessionsPlayed: number;
}

export function LeaguesScreen({ onNavigate, showToast }: LeaguesScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [userInfo, setUserInfo] = useState<UserLeagueInfo | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [leaguesData, userLeagueInfo] = await Promise.all([
        communityAPI.getLeagues('active'),
        communityAPI.getUserLeagueInfo(),
      ]);
      setLeagues(leaguesData);
      setUserInfo(userLeagueInfo);
    } catch (error) {
      console.error('Error loading leagues:', error);
      showToast?.('Erreur de chargement', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getLeagueGradient = (index: number) => {
    const gradients = [
      { gradient: 'from-blue-400 to-cyan-500', shadow: 'shadow-blue-400/30' },
      { gradient: 'from-cyan-400 to-teal-500', shadow: 'shadow-cyan-400/30' },
      { gradient: 'from-amber-400 to-yellow-500', shadow: 'shadow-amber-400/30' },
      { gradient: 'from-gray-300 to-gray-400', shadow: 'shadow-gray-400/30' },
      { gradient: 'from-orange-400 to-amber-600', shadow: 'shadow-orange-400/30' },
    ];
    return gradients[index % gradients.length];
  };

  const getLeagueIcon = (index: number) => {
    const icons = [Crown, Trophy, Target, Trophy, Target];
    return icons[index % icons.length];
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
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-yellow-400/20 rounded-full blur-3xl" />
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
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Ligues
              </h1>
              <p className="text-sm text-[var(--fg-secondary)] font-medium mt-0.5">
                Competition entre squads
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
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Trophy className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center py-6 mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-500 mb-4 shadow-xl shadow-amber-500/30">
              <Trophy className="w-10 h-10 text-white" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg-primary)] mb-2">
              Ligues Internes
            </h2>
            <p className="text-sm text-[var(--fg-secondary)] max-w-md mx-auto">
              Competition entre squads de votre communaute
            </p>
          </motion.div>

          {/* Current League Highlight */}
          {userInfo && (
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <Card className={`relative overflow-hidden p-6 mb-6 bg-gradient-to-br ${userInfo.currentLeague.color} border-0 shadow-xl`}>
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-white/80 text-sm font-semibold mb-1 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Ta ligue actuelle
                      </div>
                      <h3 className="text-2xl font-bold tracking-tight text-white mb-1">{userInfo.currentLeague.name}</h3>
                      <div className="flex items-center gap-3 text-white/90 text-sm font-medium">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {leagues[0]?.participant_count || 156} joueurs
                        </span>
                        <span>•</span>
                        <span>{userInfo.points} pts</span>
                      </div>
                    </div>
                    <motion.div
                      className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-white text-2xl font-bold tracking-tight">#{userInfo.rank}</div>
                    </motion.div>
                  </div>

                  {/* Progress Bar */}
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2 text-white text-sm font-semibold">
                      <span className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Progression de saison
                      </span>
                      <span>{userInfo.progress}%</span>
                    </div>
                    <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-white rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${userInfo.progress}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* All Leagues */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                <Crown className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold tracking-tight text-[var(--fg-primary)]">
                Toutes les ligues
              </h3>
            </div>
            <div className="space-y-3">
              {leagues.map((league, index) => {
                const { gradient, shadow } = getLeagueGradient(index);
                const Icon = getLeagueIcon(index);
                return (
                  <motion.div
                    key={league.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="p-4 hover:shadow-xl transition-all duration-300" interactive>
                      <div className="flex items-center gap-4">
                        <motion.div
                          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ${shadow}`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                        </motion.div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold tracking-tight text-[var(--fg-primary)] mb-1">{league.name}</h4>
                          <div className="flex items-center gap-3 text-sm text-[var(--fg-secondary)] font-medium">
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              {league.participant_count || league.team_count || 0}
                            </span>
                            <span>•</span>
                            <span>{league.description || 'Active'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className={`px-3 py-1.5 rounded-xl bg-gradient-to-r ${gradient} text-white text-sm font-bold shadow-md`}>
                            #{index + 1}
                          </div>
                          <motion.button
                            onClick={() => onNavigate?.('leaderboard')}
                            className="w-10 h-10 rounded-xl bg-[var(--bg-base)] flex items-center justify-center hover:bg-[var(--bg-elevated)] transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <ChevronRight className="w-5 h-5 text-[var(--fg-secondary)]" strokeWidth={2} />
                          </motion.button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Stats Cards */}
          {userInfo && (
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-6">
              <motion.div whileHover={{ scale: 1.02 }}>
                <Card className="p-4 bg-gradient-to-br from-emerald-500 to-teal-500 border-0 shadow-lg shadow-emerald-500/30">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                    <TrendingUp className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                  <div className="text-2xl font-bold tracking-tight text-white mb-0.5">+{userInfo.pointsThisWeek}</div>
                  <div className="text-sm text-white/80 font-medium">Points cette semaine</div>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }}>
                <Card className="p-4 bg-gradient-to-br from-purple-500 to-violet-500 border-0 shadow-lg shadow-purple-500/30">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                    <Zap className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                  <div className="text-2xl font-bold tracking-tight text-white mb-0.5">{userInfo.sessionsPlayed}</div>
                  <div className="text-sm text-white/80 font-medium">Sessions jouees</div>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {/* CTA */}
          <motion.button
            variants={itemVariants}
            onClick={() => onNavigate?.('leaderboard')}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Trophy className="w-5 h-5" />
            Voir le classement complet
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default LeaguesScreen;
