import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Medal, TrendingUp, Star, Crown, Target, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/app/contexts/UserContext';
import { Card, SkeletonPage, Button, Badge } from '@/design-system';

interface LeaderboardScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  useMockData?: boolean;
}

type LeaderboardTab = 'global' | 'game' | 'squads';
type Period = 'week' | 'month' | 'all';

interface Player {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  reliabilityScore: number;
  totalSessions: number;
  isPremium?: boolean;
  isCurrentUser?: boolean;
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

export function LeaderboardScreen({ onNavigate, showToast, useMockData = false }: LeaderboardScreenProps) {
  const { userProfile } = useUser();
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('global');
  const [period, setPeriod] = useState<Period>('month');
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [useMockData, activeTab, period]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockLeaderboardData: Player[] = [
        { rank: 1, userId: 'user-1', name: 'ProGamer42', avatar: '', reliabilityScore: 98, totalSessions: 156, isPremium: true },
        { rank: 2, userId: 'user-2', name: 'NightOwl', avatar: '', reliabilityScore: 96, totalSessions: 142, isPremium: true },
        { rank: 3, userId: 'user-3', name: 'TeamPlayer', avatar: '', reliabilityScore: 95, totalSessions: 138, isPremium: false },
        { rank: 4, userId: 'user-4', name: 'QuickShot', avatar: '', reliabilityScore: 94, totalSessions: 125, isPremium: false },
        { rank: 5, userId: 'user-5', name: 'StratMaster', avatar: '', reliabilityScore: 92, totalSessions: 118, isPremium: true },
        { rank: 6, userId: 'user-6', name: 'PhantomX', avatar: '', reliabilityScore: 91, totalSessions: 112, isPremium: false },
        { rank: 7, userId: 'user-7', name: 'ShadowBlade', avatar: '', reliabilityScore: 90, totalSessions: 105, isPremium: false },
      ];

      const playersWithCurrentUser = mockLeaderboardData.map((player) => ({
        ...player,
        isCurrentUser: player.userId === userProfile?.id,
      }));

      setPlayers(playersWithCurrentUser);
    } catch (error: any) {
      console.error('Error loading leaderboard:', error);
      showToast(error.message || 'Erreur lors du chargement du classement', 'error');
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  const tabs: { key: LeaderboardTab; label: string; icon: any }[] = [
    { key: 'global', label: 'Global', icon: Trophy },
    { key: 'game', label: 'Par jeu', icon: Target },
    { key: 'squads', label: 'Squads', icon: Zap },
  ];

  const periods: { key: Period; label: string }[] = [
    { key: 'week', label: 'Semaine' },
    { key: 'month', label: 'Mois' },
    { key: 'all', label: 'All-time' },
  ];

  const getRankStyle = (rank: number) => {
    if (rank === 1) return { icon: Crown, gradient: 'from-[var(--color-warning-500)] to-yellow-500', shadow: 'shadow-[var(--color-warning-500)]/30' };
    if (rank === 2) return { icon: Medal, gradient: 'from-[var(--fg-tertiary)] to-[var(--fg-secondary)]', shadow: 'shadow-[var(--fg-tertiary)]/30' };
    if (rank === 3) return { icon: Medal, gradient: 'from-orange-400 to-[var(--color-warning-500)]', shadow: 'shadow-orange-400/30' };
    return null;
  };

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-[var(--color-primary-50)] via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations - Static for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[var(--color-warning-400)]/20 to-yellow-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-[var(--color-primary-400)]/20 to-purple-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
            <motion.button
              onClick={() => onNavigate('home')}
              className="w-12 h-12 rounded-2xl bg-[var(--bg-elevated)]/80 backdrop-blur-sm border border-[var(--border-subtle)]/50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-[var(--fg-secondary)]" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[var(--color-warning-600)] to-orange-600 bg-clip-text text-transparent">
                Classements
              </h1>
              <p className="text-sm text-[var(--fg-secondary)] font-medium mt-0.5">
                Les meilleurs joueurs du moment
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-warning-500)] to-orange-500 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Trophy className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={itemVariants}>
            <Card className="p-1.5 mb-4">
              <div className="flex gap-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                        activeTab === tab.key
                          ? 'bg-gradient-to-r from-[var(--color-warning-500)] to-orange-500 text-white shadow-lg shadow-[var(--color-warning-500)]/30'
                          : 'text-[var(--fg-secondary)] hover:text-[var(--fg-primary)]'
                      }`}
                      whileHover={{ scale: activeTab === tab.key ? 1 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="w-4 h-4" strokeWidth={2} />
                      {tab.label}
                    </motion.button>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Period Selector */}
          <motion.div variants={itemVariants} className="flex gap-2 mb-6">
            {periods.map((p) => (
              <motion.button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  period === p.key
                    ? 'bg-[var(--color-warning-100)] text-[var(--color-warning-700)] border border-[var(--color-warning-200)]'
                    : 'bg-[var(--bg-elevated)]/80 backdrop-blur-sm text-[var(--fg-secondary)] border border-[var(--border-subtle)]/50 hover:border-[var(--color-warning-200)]'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {p.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Leaderboard List */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-[var(--color-warning-200)]"
                    style={{ borderTopColor: 'transparent' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-[var(--color-warning-500)]" />
                  </div>
                </div>
                <p className="text-[var(--fg-secondary)] font-medium">Chargement...</p>
              </motion.div>
            ) : (
              <motion.div
                key="leaderboard"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {players.map((player, index) => {
                  const rankStyle = getRankStyle(player.rank);

                  return (
                    <motion.div
                      key={player.rank}
                      variants={itemVariants}
                      custom={index}
                    >
                      <Card
                        className={`p-4 transition-all duration-300 ${
                          player.isCurrentUser
                            ? 'border-[var(--color-warning-300)] ring-2 ring-[var(--color-warning-100)]'
                            : ''
                        }`}
                        interactive
                      >
                        <div className="flex items-center gap-4">
                          {/* Rank */}
                          <div className="flex-shrink-0 w-12 text-center">
                            {rankStyle ? (
                              <motion.div
                                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${rankStyle.gradient} flex items-center justify-center mx-auto shadow-lg ${rankStyle.shadow}`}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                              >
                                <rankStyle.icon className="w-5 h-5 text-white" strokeWidth={2} />
                              </motion.div>
                            ) : (
                              <div className="text-2xl font-bold text-[var(--fg-tertiary)]">
                                {player.rank}
                              </div>
                            )}
                          </div>

                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary-500)] via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
                            {player.name[0]}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className={`text-sm font-bold truncate ${
                                player.isCurrentUser ? 'text-[var(--color-warning-600)]' : 'text-[var(--fg-primary)]'
                              }`}>
                                {player.name}
                              </div>
                              {player.isPremium && (
                                <Star className="w-3.5 h-3.5 text-[var(--color-warning-500)] fill-[var(--color-warning-500)]" />
                              )}
                              {player.isCurrentUser && (
                                <span className="px-2 py-0.5 bg-gradient-to-r from-[var(--color-warning-500)] to-orange-500 text-white text-[10px] font-bold rounded-full">
                                  TOI
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-[var(--fg-tertiary)] font-medium mt-0.5">
                              {player.totalSessions} sessions jouées
                            </div>
                          </div>

                          {/* Score */}
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="text-right">
                              <div className="text-2xl font-bold bg-gradient-to-r from-[var(--color-warning-600)] to-orange-600 bg-clip-text text-transparent">
                                {player.reliabilityScore}%
                              </div>
                              <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                                fiabilité
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Your Position */}
          <motion.div
            variants={itemVariants}
            className="mt-6"
          >
            <div className="bg-gradient-to-r from-[var(--color-warning-500)] to-orange-500 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white/90 mb-1">
                    Ta position actuelle
                  </div>
                  <div className="flex items-center gap-2 text-white text-sm">
                    <TrendingUp className="w-4 h-4" strokeWidth={2} />
                    <span>Tu as progressé de 3 places cette semaine !</span>
                  </div>
                </div>
                <div className="text-4xl font-bold text-white">
                  #4
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default LeaderboardScreen;
