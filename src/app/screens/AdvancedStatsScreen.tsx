/**
 * ADVANCED STATS SCREEN - LINEAR DARK DESIGN
 * Premium analytics dashboard with Linear-inspired aesthetics
 */

import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Clock, Users, Target, Award, Calendar, Zap, Crown, BarChart3, RefreshCw, Activity, Flame, Star, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { advancedStatsAPI, type AdvancedUserStats, type WeeklyData, type TopPerformer } from '@/utils/b2b-api';

interface AdvancedStatsScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

// Linear-style smooth animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
  }
};

// Linear color palette
const COLORS = {
  bg: '#08090a',
  surface: 'rgba(255,255,255,0.02)',
  surfaceHover: 'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.06)',
  borderHover: 'rgba(255,255,255,0.1)',
  text: '#f7f8f8',
  textMuted: '#8b8d90',
  textDim: '#5e6063',
  purple: '#8b5cf6',
  purpleGlow: 'rgba(139,92,246,0.15)',
  blue: '#3b82f6',
  blueGlow: 'rgba(59,130,246,0.15)',
  green: '#10b981',
  greenGlow: 'rgba(16,185,129,0.15)',
  amber: '#f59e0b',
  amberGlow: 'rgba(245,158,11,0.15)',
  pink: '#ec4899',
  pinkGlow: 'rgba(236,72,153,0.15)',
  cyan: '#06b6d4',
  cyanGlow: 'rgba(6,182,212,0.15)',
};

export function AdvancedStatsScreen({ onNavigate, showToast }: AdvancedStatsScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AdvancedUserStats | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const isPremium = true;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsData, weekly, performers] = await Promise.all([
        advancedStatsAPI.getUserStats(),
        advancedStatsAPI.getWeeklyData(),
        advancedStatsAPI.getTopPerformers(5),
      ]);
      setStats(statsData);
      setWeeklyData(weekly);
      setTopPerformers(performers);
    } catch (error) {
      console.error('Error loading advanced stats:', error);
      showToast('Erreur de chargement', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Premium upsell for non-premium users
  if (!isPremium) {
    return (
      <div className="min-h-screen pb-24 md:pb-8" style={{ backgroundColor: COLORS.bg }}>
        <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
              <motion.button
                onClick={() => onNavigate('profile')}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                style={{
                  backgroundColor: COLORS.surface,
                  border: `1px solid ${COLORS.border}`,
                  color: COLORS.textMuted
                }}
                whileHover={{ x: -2, backgroundColor: COLORS.surfaceHover }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
              </motion.button>
              <h1 className="text-[22px] font-semibold" style={{ color: COLORS.text }}>
                Stats Avancees
              </h1>
            </motion.div>

            {/* Premium Upsell Card */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl p-8 text-center relative overflow-hidden"
              style={{
                backgroundColor: COLORS.amberGlow,
                border: `1px solid rgba(245,158,11,0.3)`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-orange-500/5" />
              <div className="relative">
                <div
                  className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(245,158,11,0.2)' }}
                >
                  <Crown className="w-8 h-8" style={{ color: COLORS.amber }} strokeWidth={1.5} />
                </div>
                <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
                  Fonctionnalite Premium
                </h2>
                <p className="text-sm mb-6 max-w-sm mx-auto leading-relaxed" style={{ color: COLORS.textMuted }}>
                  Debloquez des analyses detaillees : performances par jour, membres les plus fiables, streaks, et bien plus.
                </p>
                <motion.button
                  onClick={() => onNavigate('premium')}
                  className="w-full max-w-xs h-12 font-semibold rounded-xl flex items-center justify-center gap-2 mx-auto"
                  style={{ backgroundColor: COLORS.amber, color: COLORS.bg }}
                  whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(245,158,11,0.3)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Crown className="w-5 h-5" strokeWidth={2} />
                  Passer Premium
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.bg }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 border-2 rounded-full animate-spin"
            style={{ borderColor: COLORS.purple, borderTopColor: 'transparent' }}
          />
          <span className="text-sm" style={{ color: COLORS.textMuted }}>Chargement des stats...</span>
        </div>
      </div>
    );
  }

  const maxSessions = Math.max(...weeklyData.map(d => d.sessions), 1);

  return (
    <div className="min-h-screen pb-24 md:pb-8" style={{ backgroundColor: COLORS.bg }}>
      <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <motion.button
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              style={{
                backgroundColor: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                color: COLORS.textMuted
              }}
              whileHover={{ x: -2, backgroundColor: COLORS.surfaceHover, color: COLORS.text }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>

            <div className="flex-1">
              <h1 className="text-[22px] md:text-2xl font-semibold" style={{ color: COLORS.text }}>
                Stats Avancees
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Crown className="w-3.5 h-3.5" style={{ color: COLORS.amber }} />
                <span className="text-xs font-medium" style={{ color: COLORS.amber }}>Premium</span>
              </div>
            </div>

            <motion.button
              onClick={loadData}
              disabled={isLoading}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              style={{
                backgroundColor: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                color: COLORS.textMuted
              }}
              whileHover={{ y: -1, backgroundColor: COLORS.surfaceHover }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} strokeWidth={1.5} />
            </motion.button>

            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: COLORS.purpleGlow }}
            >
              <BarChart3 className="w-5 h-5" style={{ color: COLORS.purple }} strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Main Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              {
                icon: Calendar,
                label: 'Sessions',
                value: stats?.totalSessions || 0,
                color: COLORS.purple,
                glow: COLORS.purpleGlow,
                suffix: ''
              },
              {
                icon: Target,
                label: 'Presence',
                value: stats?.attendance || 0,
                color: COLORS.green,
                glow: COLORS.greenGlow,
                suffix: '%'
              },
              {
                icon: Clock,
                label: 'Duree moy.',
                value: stats?.avgDuration || '0h',
                color: COLORS.blue,
                glow: COLORS.blueGlow,
                suffix: ''
              },
              {
                icon: Zap,
                label: 'Total heures',
                value: stats?.totalHours || 0,
                color: COLORS.amber,
                glow: COLORS.amberGlow,
                suffix: 'h'
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="p-4 rounded-xl transition-all cursor-default"
                style={{
                  backgroundColor: COLORS.surface,
                  border: `1px solid ${COLORS.border}`
                }}
                whileHover={{
                  y: -2,
                  backgroundColor: COLORS.surfaceHover,
                  borderColor: COLORS.borderHover
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: stat.glow }}
                >
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} strokeWidth={1.5} />
                </div>
                <div className="text-2xl font-semibold tabular-nums" style={{ color: COLORS.text }}>
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-xs mt-1" style={{ color: COLORS.textDim }}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Weekly Activity Chart */}
          <motion.div
            variants={itemVariants}
            className="p-5 rounded-xl mb-6"
            style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: COLORS.text }}>
                <Activity className="w-4 h-4" style={{ color: COLORS.purple }} strokeWidth={1.5} />
                Activite hebdomadaire
              </h3>
              <span className="text-xs" style={{ color: COLORS.textDim }}>30 derniers jours</span>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end justify-between gap-2 h-36 mb-3">
              {weeklyData.map((day, index) => {
                const height = maxSessions > 0 ? (day.sessions / maxSessions) * 100 : 10;
                const isHighest = day.sessions === maxSessions && day.sessions > 0;

                return (
                  <motion.div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-2"
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ delay: index * 0.05 + 0.2, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <div className="w-full flex flex-col justify-end h-28">
                      <motion.div
                        className="w-full rounded-t-lg relative overflow-hidden"
                        style={{
                          height: `${Math.max(height, 8)}%`,
                          backgroundColor: isHighest ? COLORS.purple : 'rgba(139,92,246,0.4)',
                        }}
                        whileHover={{
                          backgroundColor: COLORS.purple,
                          boxShadow: `0 0 20px ${COLORS.purpleGlow}`
                        }}
                      >
                        {isHighest && (
                          <div
                            className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20"
                          />
                        )}
                      </motion.div>
                    </div>
                    <div className="text-[11px] font-medium" style={{ color: COLORS.textDim }}>
                      {day.day}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 pt-3" style={{ borderTop: `1px solid ${COLORS.border}` }}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.purple }} />
                <span className="text-xs" style={{ color: COLORS.textMuted }}>Sessions</span>
              </div>
            </div>
          </motion.div>

          {/* Best Performance Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-6">
            <div
              className="p-4 rounded-xl relative overflow-hidden"
              style={{
                backgroundColor: COLORS.purpleGlow,
                border: `1px solid rgba(139,92,246,0.2)`
              }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(139,92,246,0.2)' }} />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4" style={{ color: COLORS.purple }} strokeWidth={1.5} />
                  <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: COLORS.purple }}>
                    Meilleur jour
                  </span>
                </div>
                <div className="text-xl font-semibold" style={{ color: COLORS.text }}>
                  {stats?.bestDay || 'N/A'}
                </div>
                <div className="text-xs mt-1" style={{ color: COLORS.textMuted }}>96% presence</div>
              </div>
            </div>

            <div
              className="p-4 rounded-xl relative overflow-hidden"
              style={{
                backgroundColor: COLORS.greenGlow,
                border: `1px solid rgba(16,185,129,0.2)`
              }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(16,185,129,0.2)' }} />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4" style={{ color: COLORS.green }} strokeWidth={1.5} />
                  <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: COLORS.green }}>
                    Meilleure heure
                  </span>
                </div>
                <div className="text-xl font-semibold" style={{ color: COLORS.text }}>
                  {stats?.bestTime || 'N/A'}
                </div>
                <div className="text-xs mt-1" style={{ color: COLORS.textMuted }}>8 sessions</div>
              </div>
            </div>
          </motion.div>

          {/* Streak Card */}
          <motion.div
            variants={itemVariants}
            className="p-5 rounded-xl mb-6 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${COLORS.amberGlow} 0%, rgba(249,115,22,0.08) 100%)`,
              border: `1px solid rgba(245,158,11,0.25)`
            }}
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(245,158,11,0.15)' }} />
            <div className="flex items-center gap-5 relative">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(245,158,11,0.2)' }}
              >
                <Flame className="w-8 h-8" style={{ color: COLORS.amber }} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <div className="text-3xl font-bold" style={{ color: COLORS.text }}>
                  {stats?.streak || 0}
                  <span className="text-lg font-semibold ml-2" style={{ color: COLORS.textMuted }}>sessions</span>
                </div>
                <div className="text-sm mt-1" style={{ color: COLORS.amber }}>
                  Streak actuel - Continue comme ca !
                </div>
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-3xl"
              >
                🔥
              </motion.div>
            </div>
          </motion.div>

          {/* Favorite Game */}
          <motion.div
            variants={itemVariants}
            className="p-4 rounded-xl mb-6 flex items-center gap-4"
            style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: COLORS.pinkGlow }}
            >
              <TrendingUp className="w-5 h-5" style={{ color: COLORS.pink }} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textDim }}>
                Jeu favori
              </div>
              <div className="text-lg font-semibold" style={{ color: COLORS.text }}>
                {stats?.favoriteGame || 'Valorant'}
              </div>
            </div>
            <ChevronRight className="w-5 h-5" style={{ color: COLORS.textDim }} />
          </motion.div>

          {/* Top Performers Leaderboard */}
          <motion.div
            variants={itemVariants}
            className="p-5 rounded-xl"
            style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: COLORS.text }}>
                <Users className="w-4 h-4" style={{ color: COLORS.cyan }} strokeWidth={1.5} />
                Classement fiabilite
              </h3>
              <span className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: COLORS.cyanGlow, color: COLORS.cyan }}>
                Top 5
              </span>
            </div>

            <div className="space-y-2">
              {topPerformers.length === 0 ? (
                <div className="text-center py-8" style={{ color: COLORS.textMuted }}>
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucun membre dans vos squads</p>
                </div>
              ) : (
                topPerformers.map((player, index) => (
                  <motion.div
                    key={player.id}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      border: `1px solid ${COLORS.border}`
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 + 0.3, duration: 0.3 }}
                    whileHover={{
                      y: -1,
                      backgroundColor: COLORS.surfaceHover,
                      borderColor: COLORS.borderHover
                    }}
                  >
                    {/* Rank Badge */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-sm"
                      style={{
                        backgroundColor: player.rank === 1
                          ? 'rgba(245,158,11,0.15)'
                          : player.rank === 2
                          ? 'rgba(192,192,192,0.15)'
                          : player.rank === 3
                          ? 'rgba(205,127,50,0.15)'
                          : 'rgba(255,255,255,0.04)',
                        color: player.rank === 1
                          ? '#f5a623'
                          : player.rank === 2
                          ? '#c0c0c0'
                          : player.rank === 3
                          ? '#cd7f32'
                          : COLORS.textDim
                      }}
                    >
                      {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : player.rank}
                    </div>

                    {/* Avatar */}
                    {player.avatarUrl ? (
                      <img
                        src={player.avatarUrl}
                        alt={player.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium"
                        style={{ backgroundColor: COLORS.purpleGlow, color: COLORS.purple }}
                      >
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate" style={{ color: COLORS.text }}>
                        {player.name}
                      </div>
                      <div className="text-xs" style={{ color: COLORS.textDim }}>
                        {player.sessions} sessions
                      </div>
                    </div>

                    {/* Reliability Score */}
                    <div className="text-right">
                      <div
                        className="text-base font-semibold tabular-nums"
                        style={{
                          color: player.reliability >= 90
                            ? COLORS.green
                            : player.reliability >= 75
                            ? COLORS.purple
                            : COLORS.textMuted
                        }}
                      >
                        {player.reliability}%
                      </div>
                      <div className="text-[10px] uppercase tracking-wider" style={{ color: COLORS.textDim }}>
                        fiabilite
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Footer Spacing */}
          <div className="h-4" />
        </motion.div>
      </div>
    </div>
  );
}

export default AdvancedStatsScreen;
