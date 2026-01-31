import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Users, TrendingUp, ChevronRight, Sparkles, Crown, Target, Zap, RefreshCw, Award, Medal } from 'lucide-react';
import { motion } from 'framer-motion';
import { communityAPI, LEAGUE_TIERS, type League } from '@/utils/community-api';

interface LeaguesScreenProps {
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

interface UserLeagueInfo {
  currentLeague: typeof LEAGUE_TIERS[keyof typeof LEAGUE_TIERS] & { tier: string };
  points: number;
  rank: number;
  progress: number;
  pointsThisWeek: number;
  sessionsPlayed: number;
}

// Couleur principale pour Leagues = violet #5e6dd2
const LEAGUES_COLOR = '#5e6dd2';

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

  const getLeagueTierInfo = (index: number) => {
    const tiers = [
      { name: 'Diamant', icon: Crown, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
      { name: 'Platine', icon: Award, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
      { name: 'Or', icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
      { name: 'Argent', icon: Medal, color: 'text-gray-300', bg: 'bg-gray-500/10', border: 'border-gray-500/20' },
      { name: 'Bronze', icon: Target, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
    ];
    return tiers[index % tiers.length];
  };

  // Skeleton Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090a] pb-24 md:pb-8">
        <div className="px-4 py-6 max-w-2xl mx-auto">
          {/* Header skeleton */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
            <div className="flex-1">
              <div className="h-6 w-24 bg-white/5 rounded-lg animate-pulse mb-2" />
              <div className="h-4 w-40 bg-white/5 rounded-lg animate-pulse" />
            </div>
          </div>
          {/* Card skeleton */}
          <div className="h-48 rounded-2xl bg-white/5 animate-pulse mb-6" />
          {/* List skeleton */}
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>
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
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
            <motion.button
              onClick={() => onNavigate?.('home')}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-[#8a8f98]" />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-white tracking-tight">Ligues</h1>
              <p className="text-sm text-[#8a8f98]">Compétition entre squads</p>
            </div>
            <motion.button
              onClick={loadData}
              disabled={isLoading}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-4 h-4 text-[#8a8f98] ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${LEAGUES_COLOR}20` }}
            >
              <Trophy className="w-5 h-5" style={{ color: LEAGUES_COLOR }} />
            </div>
          </motion.div>

          {/* Current League Card */}
          {userInfo && (
            <motion.div
              variants={itemVariants}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 mb-6"
            >
              {/* Subtle gradient overlay */}
              <div
                className="absolute inset-0 opacity-10"
                style={{ background: `linear-gradient(135deg, ${LEAGUES_COLOR}40 0%, transparent 60%)` }}
              />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4" style={{ color: LEAGUES_COLOR }} />
                      <span className="text-xs font-medium text-[#8a8f98] uppercase tracking-wider">Ta ligue actuelle</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{userInfo.currentLeague.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-[#8a8f98]">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        {leagues[0]?.participant_count || 156} joueurs
                      </span>
                      <span className="text-white/20">|</span>
                      <span className="font-medium" style={{ color: LEAGUES_COLOR }}>{userInfo.points} pts</span>
                    </div>
                  </div>
                  <div
                    className="px-4 py-2 rounded-xl border border-white/10"
                    style={{ backgroundColor: `${LEAGUES_COLOR}15` }}
                  >
                    <div className="text-2xl font-bold" style={{ color: LEAGUES_COLOR }}>#{userInfo.rank}</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-3 text-sm">
                    <span className="flex items-center gap-2 text-[#8a8f98]">
                      <TrendingUp className="w-4 h-4" style={{ color: LEAGUES_COLOR }} />
                      Progression de saison
                    </span>
                    <span className="font-semibold text-white">{userInfo.progress}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: LEAGUES_COLOR }}
                      initial={{ width: 0 }}
                      animate={{ width: `${userInfo.progress}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Row */}
          {userInfo && (
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-6">
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-xs text-[#8a8f98] uppercase tracking-wider">Cette semaine</span>
                </div>
                <div className="text-2xl font-bold text-white">+{userInfo.pointsThisWeek}</div>
                <div className="text-sm text-[#8a8f98]">points gagnés</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-violet-400" />
                  </div>
                  <span className="text-xs text-[#8a8f98] uppercase tracking-wider">Sessions</span>
                </div>
                <div className="text-2xl font-bold text-white">{userInfo.sessionsPlayed}</div>
                <div className="text-sm text-[#8a8f98]">sessions jouées</div>
              </div>
            </motion.div>
          )}

          {/* All Leagues Section */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-4 h-4" style={{ color: LEAGUES_COLOR }} />
              <h3 className="text-sm font-medium text-[#8a8f98] uppercase tracking-wider">
                Toutes les ligues
              </h3>
              <span className="text-xs text-[#8a8f98] bg-white/5 px-2 py-0.5 rounded-full">
                {leagues.length}
              </span>
            </div>

            <div className="space-y-2">
              {leagues.map((league, index) => {
                const tierInfo = getLeagueTierInfo(index);
                const Icon = tierInfo.icon;

                return (
                  <motion.div
                    key={league.id}
                    variants={itemVariants}
                    onClick={() => onNavigate?.('leaderboard')}
                    className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:bg-white/[0.04] hover:border-white/20 transition-all cursor-pointer"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${tierInfo.bg} border ${tierInfo.border} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${tierInfo.color}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white">{league.name}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${tierInfo.bg} ${tierInfo.color}`}>
                            {tierInfo.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#8a8f98]">
                          <Users className="w-3.5 h-3.5" />
                          <span>{league.participant_count || league.team_count || 0} participants</span>
                          {league.description && (
                            <>
                              <span className="text-white/20">|</span>
                              <span className="truncate">{league.description}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1.5 rounded-lg ${tierInfo.bg} border ${tierInfo.border}`}>
                          <span className={`text-sm font-bold ${tierInfo.color}`}>#{index + 1}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-[#8a8f98] group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Empty State */}
          {leagues.length === 0 && !isLoading && (
            <motion.div
              variants={itemVariants}
              className="text-center py-12"
            >
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${LEAGUES_COLOR}15` }}
              >
                <Trophy className="w-8 h-8" style={{ color: LEAGUES_COLOR }} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Aucune ligue disponible</h3>
              <p className="text-sm text-[#8a8f98] max-w-xs mx-auto">
                Les ligues seront bientôt disponibles. Reste connecté !
              </p>
            </motion.div>
          )}

          {/* CTA Button */}
          <motion.button
            variants={itemVariants}
            onClick={() => onNavigate?.('leaderboard')}
            className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{ backgroundColor: LEAGUES_COLOR }}
            whileHover={{ scale: 1.02 }}
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
