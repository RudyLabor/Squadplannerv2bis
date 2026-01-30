/**
 * ADVANCED STATS SCREEN - LINEAR DESIGN SYSTEM
 * Premium, Dark, Minimal - Advanced statistics
 */

import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Clock, Users, Target, Award, Calendar, Zap, Crown, BarChart3, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { advancedStatsAPI, type AdvancedUserStats, type WeeklyData, type TopPerformer } from '@/utils/b2b-api';

interface AdvancedStatsScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

// Linear-style animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.02 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }
  }
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
                onClick={() => onNavigate('profile')}
                className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.06)] transition-all"
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
              </motion.button>
              <h1 className="text-[22px] font-semibold text-[#f7f8f8]">
                Stats Avancées
              </h1>
            </motion.div>

            {/* Premium Upsell */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl p-6 md:p-8 bg-[rgba(245,166,35,0.08)] border border-[rgba(245,166,35,0.2)] text-center"
            >
              <div className="w-16 h-16 rounded-xl bg-[rgba(245,166,35,0.15)] mx-auto mb-5 flex items-center justify-center">
                <Crown className="w-8 h-8 text-[#f5a623]" strokeWidth={1.5} />
              </div>
              <h2 className="text-[20px] font-semibold text-[#f7f8f8] mb-3">Fonctionnalité Premium</h2>
              <p className="text-[14px] text-[#8b8d90] mb-6 max-w-sm mx-auto leading-relaxed">
                Débloquez des analyses détaillées : performances par jour, membres les plus fiables, streaks, et bien plus.
              </p>
              <motion.button
                onClick={() => onNavigate('premium')}
                className="w-full h-12 bg-[#f5a623] text-[#08090a] font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-[#f5b43d] transition-colors"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Crown className="w-5 h-5" strokeWidth={2} />
                Passer Premium
              </motion.button>
            </motion.div>

            {/* Preview Stats (blurred) */}
            <motion.div variants={itemVariants} className="mt-6 opacity-30 pointer-events-none">
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
                    <div className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.06)] mb-2" />
                    <div className="w-16 h-6 bg-[rgba(255,255,255,0.06)] rounded-lg mb-1" />
                    <div className="w-12 h-4 bg-[rgba(255,255,255,0.04)] rounded-lg" />
                  </div>
                ))}
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
      <div className="min-h-screen bg-[#08090a] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#5e6dd2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8 bg-[#08090a]">
      <div className="px-4 md:px-6 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header - Linear style */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
            <motion.button
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.06)] transition-all"
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-[22px] md:text-[24px] font-semibold text-[#f7f8f8] flex items-center gap-2">
                Stats Avancées
              </h1>
              <p className="text-[13px] text-[#f5a623] font-medium flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" />
                Premium
              </p>
            </div>
            <motion.button
              onClick={loadData}
              disabled={isLoading}
              className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.06)] transition-all"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} strokeWidth={1.5} />
            </motion.button>
            <div className="w-11 h-11 rounded-xl bg-[rgba(94,109,210,0.1)] flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-[#5e6dd2]" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Overview Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: Calendar, label: 'Sessions', value: stats?.totalSessions || 0, iconColor: 'text-[#5e6dd2]', bgColor: 'rgba(94,109,210,0.1)' },
              { icon: Target, label: 'Présence', value: `${stats?.attendance || 0}%`, iconColor: 'text-[#4ade80]', bgColor: 'rgba(74,222,128,0.1)' },
              { icon: Clock, label: 'Durée moy.', value: stats?.avgDuration || '0h', iconColor: 'text-[#60a5fa]', bgColor: 'rgba(96,165,250,0.1)' },
              { icon: Zap, label: 'Total heures', value: `${stats?.totalHours || 0}h`, iconColor: 'text-[#f5a623]', bgColor: 'rgba(245,166,35,0.1)' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] transition-all"
                whileHover={{ y: -1 }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} strokeWidth={1.5} />
                </div>
                <div className="text-[22px] font-semibold text-[#f7f8f8] tabular-nums mb-0.5">{stat.value}</div>
                <div className="text-[12px] text-[#5e6063]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Best Times */}
          <motion.div
            variants={itemVariants}
            className="p-5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] mb-6"
          >
            <h3 className="text-[14px] font-semibold text-[#f7f8f8] mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#f5a623]" strokeWidth={1.5} />
              Vos meilleurs créneaux
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-[rgba(94,109,210,0.08)] border border-[rgba(94,109,210,0.15)]">
                <div className="text-[11px] text-[#8b93ff] font-medium mb-1 uppercase tracking-wider">Meilleur jour</div>
                <div className="text-[18px] font-semibold text-[#f7f8f8]">{stats?.bestDay || 'N/A'}</div>
                <div className="text-[11px] text-[#5e6063] mt-1">96% présence</div>
              </div>
              <div className="p-4 rounded-xl bg-[rgba(74,222,128,0.08)] border border-[rgba(74,222,128,0.15)]">
                <div className="text-[11px] text-[#4ade80] font-medium mb-1 uppercase tracking-wider">Meilleure heure</div>
                <div className="text-[18px] font-semibold text-[#f7f8f8]">{stats?.bestTime || 'N/A'}</div>
                <div className="text-[11px] text-[#5e6063] mt-1">8 sessions</div>
              </div>
            </div>
          </motion.div>

          {/* Weekly Chart */}
          <motion.div
            variants={itemVariants}
            className="p-5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] mb-6"
          >
            <h3 className="text-[14px] font-semibold text-[#f7f8f8] mb-4">Répartition hebdomadaire</h3>
            <div className="flex items-end justify-between gap-2 h-32">
              {weeklyData.map((day, index) => (
                <motion.div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-2"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <div className="flex-1 w-full flex flex-col justify-end">
                    <motion.div
                      className="w-full bg-[#5e6dd2] rounded-t-md"
                      style={{ height: `${Math.max((day.sessions / 8) * 100, 8)}%` }}
                      whileHover={{ backgroundColor: '#8b93ff' }}
                      title={`${day.sessions} sessions · ${day.attendance}% présence`}
                    />
                  </div>
                  <div className="text-[11px] text-[#5e6063] font-medium">{day.day}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Streak */}
          <motion.div
            variants={itemVariants}
            className="p-5 rounded-xl bg-[rgba(245,166,35,0.08)] border border-[rgba(245,166,35,0.2)] mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[rgba(245,166,35,0.15)] flex items-center justify-center text-2xl">
                🔥
              </div>
              <div className="flex-1">
                <div className="text-[24px] font-semibold text-[#f7f8f8] mb-0.5">{stats?.streak || 0} sessions</div>
                <div className="text-[13px] text-[#f5a623]">Streak actuel · Continue comme ça !</div>
              </div>
            </div>
          </motion.div>

          {/* Top Performers */}
          <motion.div
            variants={itemVariants}
            className="p-5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]"
          >
            <h3 className="text-[14px] font-semibold text-[#f7f8f8] mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#8b93ff]" strokeWidth={1.5} />
              Classement fiabilité
            </h3>
            <div className="space-y-2">
              {topPerformers.map((player, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.04)] transition-all"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }}
                  whileHover={{ y: -1 }}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-semibold text-[13px] ${
                    player.rank === 1
                      ? 'bg-[rgba(245,166,35,0.15)] text-[#f5a623]'
                      : player.rank === 2
                      ? 'bg-[rgba(192,192,192,0.15)] text-[#c0c0c0]'
                      : player.rank === 3
                      ? 'bg-[rgba(205,127,50,0.15)] text-[#cd7f32]'
                      : 'bg-[rgba(255,255,255,0.04)] text-[#5e6063]'
                  }`}>
                    {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : player.rank}
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-medium text-[#f7f8f8]">{player.name}</div>
                    <div className="text-[11px] text-[#5e6063]">{player.sessions} sessions</div>
                  </div>
                  <div className={`text-[15px] font-semibold tabular-nums ${
                    player.reliability >= 90 ? 'text-[#4ade80]' :
                    player.reliability >= 75 ? 'text-[#8b93ff]' :
                    'text-[#8b8d90]'
                  }`}>
                    {player.reliability}%
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default AdvancedStatsScreen;
