import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Medal, TrendingUp, Star, Crown, Target, Zap, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/app/contexts/UserContext';

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

// Linear-style animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.15, when: "beforeChildren", staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.14, ease: [0.25, 0.1, 0.25, 1] } }
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
        { rank: 8, userId: 'user-8', name: 'GameMaster', avatar: '', reliabilityScore: 88, totalSessions: 98, isPremium: false },
        { rank: 9, userId: 'user-9', name: 'NinjaKiller', avatar: '', reliabilityScore: 86, totalSessions: 92, isPremium: true },
        { rank: 10, userId: 'user-10', name: 'VictoryLap', avatar: '', reliabilityScore: 85, totalSessions: 87, isPremium: false },
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
    { key: 'squads', label: 'Squads', icon: Users },
  ];

  const periods: { key: Period; label: string }[] = [
    { key: 'week', label: 'Semaine' },
    { key: 'month', label: 'Mois' },
    { key: 'all', label: 'All-time' },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return Crown;
    if (rank === 2 || rank === 3) return Medal;
    return null;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#f5a623'; // Gold
    if (rank === 2) return '#8b8d90'; // Silver
    if (rank === 3) return '#cd7f32'; // Bronze
    return '#5e6063';
  };

  const topThree = players.slice(0, 3);
  const restOfPlayers = players.slice(3);

  return (
    <div className="min-h-screen pb-24 md:pb-8 bg-[#08090a]">
      <div className="px-4 md:px-6 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <motion.button
              onClick={() => onNavigate('home')}
              className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-5 h-5 text-[#8b8d90]" strokeWidth={1.5} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-[#f7f8f8] tracking-tight">
                Classement
              </h1>
              <p className="text-sm text-[#5e6063] mt-0.5">
                Les meilleurs joueurs
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[rgba(245,166,35,0.1)] border border-[rgba(245,166,35,0.2)] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[#f5a623]" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg p-1 flex gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <motion.button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 px-4 py-2.5 rounded-md font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                      isActive
                        ? 'bg-[rgba(255,255,255,0.06)] text-[#f7f8f8]'
                        : 'text-[#5e6063] hover:text-[#8b8d90]'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                    {tab.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Period Selector */}
          <motion.div variants={itemVariants} className="flex gap-2 mb-8">
            {periods.map((p) => (
              <motion.button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  period === p.key
                    ? 'bg-[rgba(94,109,210,0.15)] text-[#5e6dd2] border border-[rgba(94,109,210,0.3)]'
                    : 'bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-[#5e6063] hover:text-[#8b8d90] hover:border-[rgba(255,255,255,0.1)]'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                {p.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <div className="relative w-12 h-12 mx-auto mb-4">
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[rgba(255,255,255,0.1)]"
                    style={{ borderTopColor: '#5e6dd2' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <p className="text-[#5e6063] text-sm">Chargement du classement...</p>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Podium - Top 3 */}
                <motion.div variants={itemVariants} className="mb-8">
                  <div className="flex items-end justify-center gap-3 px-4">
                    {/* 2nd Place */}
                    {topThree[1] && (
                      <motion.div
                        className="flex-1 max-w-[120px]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 text-center">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#8b8d90] to-[#5e6063] flex items-center justify-center text-white font-bold text-lg mx-auto mb-3 ring-2 ring-[rgba(139,141,144,0.3)]">
                            {topThree[1].name[0]}
                          </div>
                          <Medal className="w-5 h-5 text-[#8b8d90] mx-auto mb-2" strokeWidth={1.5} />
                          <p className="text-[#f7f8f8] font-medium text-sm truncate">{topThree[1].name}</p>
                          <p className="text-[#8b8d90] text-xs mt-1">{topThree[1].reliabilityScore}%</p>
                          <div className="mt-2 h-16 bg-gradient-to-t from-[rgba(139,141,144,0.1)] to-transparent rounded-t-lg" />
                        </div>
                      </motion.div>
                    )}

                    {/* 1st Place */}
                    {topThree[0] && (
                      <motion.div
                        className="flex-1 max-w-[140px]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                      >
                        <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(245,166,35,0.2)] rounded-xl p-4 text-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(245,166,35,0.05)] to-transparent" />
                          <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f5a623] to-[#f59e0b] flex items-center justify-center text-white font-bold text-xl mx-auto mb-3 ring-2 ring-[rgba(245,166,35,0.4)]">
                              {topThree[0].name[0]}
                            </div>
                            <Crown className="w-6 h-6 text-[#f5a623] mx-auto mb-2" strokeWidth={1.5} />
                            <p className="text-[#f7f8f8] font-semibold text-sm truncate">{topThree[0].name}</p>
                            {topThree[0].isPremium && (
                              <Star className="w-3.5 h-3.5 text-[#f5a623] fill-[#f5a623] inline-block ml-1" />
                            )}
                            <p className="text-[#f5a623] text-sm font-medium mt-1">{topThree[0].reliabilityScore}%</p>
                            <div className="mt-2 h-24 bg-gradient-to-t from-[rgba(245,166,35,0.1)] to-transparent rounded-t-lg" />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* 3rd Place */}
                    {topThree[2] && (
                      <motion.div
                        className="flex-1 max-w-[120px]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 text-center">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#cd7f32] to-[#a0522d] flex items-center justify-center text-white font-bold text-lg mx-auto mb-3 ring-2 ring-[rgba(205,127,50,0.3)]">
                            {topThree[2].name[0]}
                          </div>
                          <Medal className="w-5 h-5 text-[#cd7f32] mx-auto mb-2" strokeWidth={1.5} />
                          <p className="text-[#f7f8f8] font-medium text-sm truncate">{topThree[2].name}</p>
                          <p className="text-[#8b8d90] text-xs mt-1">{topThree[2].reliabilityScore}%</p>
                          <div className="mt-2 h-12 bg-gradient-to-t from-[rgba(205,127,50,0.1)] to-transparent rounded-t-lg" />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Rest of Leaderboard */}
                <motion.div variants={itemVariants}>
                  <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden">
                    {restOfPlayers.map((player, index) => (
                      <motion.div
                        key={player.userId}
                        variants={itemVariants}
                        className={`flex items-center gap-4 p-4 ${
                          index !== restOfPlayers.length - 1 ? 'border-b border-[rgba(255,255,255,0.06)]' : ''
                        } ${player.isCurrentUser ? 'bg-[rgba(94,109,210,0.05)]' : 'hover:bg-[rgba(255,255,255,0.02)]'} transition-colors`}
                      >
                        {/* Rank */}
                        <div className="w-8 text-center">
                          <span className="text-[#5e6063] font-medium text-sm">
                            {player.rank}
                          </span>
                        </div>

                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5e6dd2] to-[#4f5cbf] flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                          {player.name[0]}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium text-sm truncate ${
                              player.isCurrentUser ? 'text-[#5e6dd2]' : 'text-[#f7f8f8]'
                            }`}>
                              {player.name}
                            </span>
                            {player.isPremium && (
                              <Star className="w-3.5 h-3.5 text-[#f5a623] fill-[#f5a623] flex-shrink-0" />
                            )}
                            {player.isCurrentUser && (
                              <span className="px-2 py-0.5 bg-[rgba(94,109,210,0.2)] text-[#5e6dd2] text-[10px] font-semibold rounded-full flex-shrink-0">
                                TOI
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#5e6063] mt-0.5">
                            {player.totalSessions} sessions
                          </p>
                        </div>

                        {/* Score */}
                        <div className="text-right flex-shrink-0">
                          <span className="text-[#f7f8f8] font-semibold text-lg">
                            {player.reliabilityScore}%
                          </span>
                          <p className="text-[10px] text-[#5e6063] uppercase tracking-wide">
                            fiabilité
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Your Position Card */}
                <motion.div variants={itemVariants} className="mt-6">
                  <div className="bg-gradient-to-r from-[rgba(94,109,210,0.15)] to-[rgba(94,109,210,0.05)] border border-[rgba(94,109,210,0.2)] rounded-xl p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[#8b8d90] text-sm font-medium mb-1">
                          Ta position actuelle
                        </p>
                        <div className="flex items-center gap-2 text-[#4ade80]">
                          <TrendingUp className="w-4 h-4" strokeWidth={1.5} />
                          <span className="text-sm">+3 places cette semaine</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-bold text-[#f7f8f8]">#4</span>
                        <p className="text-xs text-[#5e6063] mt-0.5">sur 156 joueurs</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Stats Summary */}
                <motion.div variants={itemVariants} className="mt-4 grid grid-cols-3 gap-3">
                  <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 text-center">
                    <Zap className="w-5 h-5 text-[#f5a623] mx-auto mb-2" strokeWidth={1.5} />
                    <p className="text-lg font-semibold text-[#f7f8f8]">94%</p>
                    <p className="text-[10px] text-[#5e6063] uppercase tracking-wide mt-0.5">Fiabilité</p>
                  </div>
                  <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 text-center">
                    <Target className="w-5 h-5 text-[#5e6dd2] mx-auto mb-2" strokeWidth={1.5} />
                    <p className="text-lg font-semibold text-[#f7f8f8]">125</p>
                    <p className="text-[10px] text-[#5e6063] uppercase tracking-wide mt-0.5">Sessions</p>
                  </div>
                  <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 text-center">
                    <Users className="w-5 h-5 text-[#4ade80] mx-auto mb-2" strokeWidth={1.5} />
                    <p className="text-lg font-semibold text-[#f7f8f8]">3</p>
                    <p className="text-[10px] text-[#5e6063] uppercase tracking-wide mt-0.5">Squads</p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default LeaderboardScreen;
