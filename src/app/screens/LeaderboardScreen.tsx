import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Medal, TrendingUp, Star, Crown, Award, Target, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { mockPlayers } from '@/data/mockData';
import { statsAPI } from '@/utils/api';
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

export function LeaderboardScreen({ onNavigate, showToast, useMockData = false }: LeaderboardScreenProps) {
  const { userProfile } = useUser();
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('global');
  const [period, setPeriod] = useState<Period>('month');
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (useMockData) {
      setPlayers(mockPlayers);
      setLoading(false);
    } else {
      loadLeaderboard();
    }
  }, [useMockData, activeTab, period]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      // Use mock data since statsAPI doesn't have getLeaderboard method
      // In production, this would call a real leaderboard endpoint
      const mockLeaderboardData: Player[] = [
        { rank: 1, userId: 'user-1', name: 'ProGamer42', avatar: '', reliabilityScore: 98, totalSessions: 156, isPremium: true },
        { rank: 2, userId: 'user-2', name: 'NightOwl', avatar: '', reliabilityScore: 96, totalSessions: 142, isPremium: true },
        { rank: 3, userId: 'user-3', name: 'TeamPlayer', avatar: '', reliabilityScore: 95, totalSessions: 138, isPremium: false },
        { rank: 4, userId: 'user-4', name: 'QuickShot', avatar: '', reliabilityScore: 94, totalSessions: 125, isPremium: false },
        { rank: 5, userId: 'user-5', name: 'StratMaster', avatar: '', reliabilityScore: 92, totalSessions: 118, isPremium: true },
      ];
      
      // Mark current user
      const playersWithCurrentUser = mockLeaderboardData.map((player) => ({
        ...player,
        isCurrentUser: player.userId === userProfile?.id,
      }));
      
      setPlayers(playersWithCurrentUser);
      setLoading(false);
    } catch (error: any) {
      console.error('Error loading leaderboard:', error);
      showToast(error.message || 'Erreur lors du chargement du classement', 'error');
      setPlayers([]);
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

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: Crown, color: 'text-[var(--primary-500)]', bg: 'bg-[var(--primary-50)]' };
    if (rank === 2) return { icon: Medal, color: 'text-[var(--secondary-400)]', bg: 'bg-[var(--secondary-50)]' };
    if (rank === 3) return { icon: Medal, color: 'text-[var(--primary-300)]', bg: 'bg-[var(--primary-50)]' };
    return null;
  };

  return (
    <div className="min-h-screen pb-24 pt-safe">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
              Classements
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] font-medium mt-1">
              Les meilleurs joueurs du moment
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white shadow-lg shadow-[var(--primary-500)]/20'
                    : 'text-[var(--fg-secondary)] hover:text-[var(--fg-primary)]'
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={2} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 mb-6">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                period === p.key
                  ? 'bg-[var(--primary-50)] text-[var(--primary-500)] border-[0.5px] border-[var(--primary-200)]'
                  : 'bg-white text-[var(--fg-secondary)] border-[0.5px] border-[var(--border-subtle)] hover:border-[var(--border-medium)]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Leaderboard List */}
        <div className="space-y-3">
          {players.map((player, index) => {
            const rankBadge = getRankBadge(player.rank);
            
            return (
              <motion.div
                key={player.rank}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl p-4 border-[0.5px] transition-all duration-200 ${
                  player.isCurrentUser
                    ? 'border-[var(--primary-500)] shadow-md ring-2 ring-[var(--primary-100)]'
                    : 'border-[var(--border-subtle)] shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-12 text-center">
                    {rankBadge ? (
                      <div className={`w-10 h-10 rounded-xl ${rankBadge.bg} flex items-center justify-center mx-auto`}>
                        <rankBadge.icon className={`w-5 h-5 ${rankBadge.color}`} strokeWidth={2} />
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-[var(--fg-secondary)]">
                        {player.rank}
                      </div>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {player.name[0]}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className={`text-sm font-semibold truncate ${
                        player.isCurrentUser ? 'text-[var(--primary-500)]' : 'text-[var(--fg-primary)]'
                      }`}>
                        {player.name}
                      </div>
                      {player.isCurrentUser && (
                        <span className="px-2 py-0.5 bg-[var(--primary-500)] text-white text-xs font-bold rounded-md">
                          TOI
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[var(--fg-tertiary)] font-medium mt-0.5">
                      {player.totalSessions} sessions jouées
                    </div>
                  </div>

                  {/* Score (Reliability) */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[var(--fg-primary)]">
                        {player.reliabilityScore}%
                      </div>
                      <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                        fiabilité
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Your Position (if not in top) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-gradient-to-br from-[var(--primary-50)] to-[var(--secondary-50)] rounded-2xl p-5 border-[0.5px] border-[var(--primary-100)]"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                Ta position actuelle
              </div>
              <div className="text-xs text-[var(--fg-secondary)] font-medium">
                Tu as progressé de 3 places cette semaine ! 🔥
              </div>
            </div>
            <div className="text-3xl font-bold text-[var(--primary-500)]">
              #4
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
export default LeaderboardScreen;
