import { ArrowLeft, TrendingUp, Clock, Users, Target, Award, Calendar, Zap, Crown } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/app/components/ui/Button';

interface AdvancedStatsScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function AdvancedStatsScreen({ onNavigate, showToast }: AdvancedStatsScreenProps) {
  const isPremium = false; // TODO: Get from context

  const stats = {
    totalSessions: 47,
    attendance: 94,
    avgDuration: '2.5h',
    totalHours: 117.5,
    bestDay: 'Mardi',
    bestTime: '21:00',
    streak: 8,
    favoriteGame: 'Valorant',
  };

  const weeklyData = [
    { day: 'Lun', sessions: 2, attendance: 100 },
    { day: 'Mar', sessions: 8, attendance: 96 },
    { day: 'Mer', sessions: 3, attendance: 88 },
    { day: 'Jeu', sessions: 6, attendance: 82 },
    { day: 'Ven', sessions: 4, attendance: 90 },
    { day: 'Sam', sessions: 5, attendance: 94 },
    { day: 'Dim', sessions: 1, attendance: 100 },
  ];

  const topPerformers = [
    { name: 'RudyFourcade', reliability: 98, sessions: 47, rank: 1 },
    { name: 'KANA', reliability: 94, sessions: 45, rank: 2 },
    { name: 'Maxence', reliability: 91, sessions: 43, rank: 3 },
    { name: 'HunterAce', reliability: 76, sessions: 38, rank: 4 },
  ];

  if (!isPremium) {
    return (
      <div className="min-h-screen pb-24 pt-safe">
        <div className="px-4 py-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => onNavigate('profile')}
              className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
            </button>
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
              Stats Avancées
            </h1>
          </div>

          {/* Premium Upsell */}
          <div className="bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] rounded-3xl p-8 text-white text-center">
            <div className="w-20 h-20 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center">
              <Crown className="w-10 h-10" strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Fonctionnalité Premium</h2>
            <p className="text-base opacity-90 mb-6 leading-relaxed">
              Débloquez des analyses détaillées : performances par jour, membres les plus fiables, streaks, et bien plus.
            </p>
            <Button
              variant="primary"
              onClick={() => onNavigate('premium')}
              className="w-full h-14 bg-white text-[var(--primary-500)] hover:bg-white/90 rounded-2xl shadow-xl font-bold"
            >
              <Crown className="w-6 h-6" strokeWidth={2} />
              Passer Premium
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-safe">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => onNavigate('profile')}
            className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-[var(--primary-500)]" strokeWidth={2} />
              Stats Avancées
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] font-medium flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-[var(--primary-500)]" strokeWidth={2} />
              Premium
            </p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { icon: Calendar, label: 'Sessions', value: stats.totalSessions, color: 'primary' },
            { icon: Target, label: 'Présence', value: `${stats.attendance}%`, color: 'success' },
            { icon: Clock, label: 'Durée moy.', value: stats.avgDuration, color: 'secondary' },
            { icon: Zap, label: 'Total heures', value: `${stats.totalHours}h`, color: 'warning' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm"
            >
              <stat.icon className={`w-5 h-5 text-[var(--${stat.color}-500)] mb-2`} strokeWidth={2} />
              <div className="text-2xl font-bold text-[var(--fg-primary)] mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Best Times */}
        <div className="bg-white rounded-2xl p-5 mb-6 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
          <h3 className="text-base font-semibold text-[var(--fg-primary)] mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-[var(--primary-500)]" strokeWidth={2} />
            Vos meilleurs créneaux
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--primary-50)] rounded-xl p-3 border-[0.5px] border-[var(--primary-200)]">
              <div className="text-xs text-[var(--primary-700)] font-medium mb-1">Meilleur jour</div>
              <div className="text-lg font-bold text-[var(--primary-600)]">{stats.bestDay}</div>
              <div className="text-xs text-[var(--primary-600)] mt-1">96% présence</div>
            </div>
            <div className="bg-[var(--secondary-50)] rounded-xl p-3 border-[0.5px] border-[var(--secondary-200)]">
              <div className="text-xs text-[var(--secondary-700)] font-medium mb-1">Meilleure heure</div>
              <div className="text-lg font-bold text-[var(--secondary-600)]">{stats.bestTime}</div>
              <div className="text-xs text-[var(--secondary-600)] mt-1">8 sessions</div>
            </div>
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="bg-white rounded-2xl p-5 mb-6 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
          <h3 className="text-base font-semibold text-[var(--fg-primary)] mb-4">
            Répartition hebdomadaire
          </h3>
          <div className="flex items-end justify-between gap-2 h-40">
            {weeklyData.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="flex-1 w-full flex flex-col justify-end">
                  <div
                    className="w-full bg-gradient-to-t from-[var(--primary-500)] to-[var(--primary-300)] rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                    style={{ height: `${(day.sessions / 8) * 100}%`, minHeight: '8px' }}
                    title={`${day.sessions} sessions • ${day.attendance}% présence`}
                  />
                </div>
                <div className="text-xs text-[var(--fg-tertiary)] font-semibold">
                  {day.day}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Streak */}
        <div className="bg-gradient-to-r from-[var(--warning-50)] to-[var(--warning-100)] rounded-2xl p-5 mb-6 border-[0.5px] border-[var(--warning-200)]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[var(--warning-500)] flex items-center justify-center text-white text-2xl font-bold">
              🔥
            </div>
            <div className="flex-1">
              <div className="text-3xl font-bold text-[var(--fg-primary)] mb-1">
                {stats.streak} sessions
              </div>
              <div className="text-sm text-[var(--fg-secondary)] font-medium">
                Streak actuel • Continue comme ça !
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-2xl p-5 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
          <h3 className="text-base font-semibold text-[var(--fg-primary)] mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-[var(--primary-500)]" strokeWidth={2} />
            Classement fiabilité
          </h3>
          <div className="space-y-3">
            {topPerformers.map((player, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 bg-[var(--bg-base)] rounded-xl"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                  player.rank === 1
                    ? 'bg-[#FFD700] text-white'
                    : player.rank === 2
                    ? 'bg-[#C0C0C0] text-white'
                    : player.rank === 3
                    ? 'bg-[#CD7F32] text-white'
                    : 'bg-[var(--bg-subtle)] text-[var(--fg-tertiary)]'
                }`}>
                  {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : player.rank}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-[var(--fg-primary)]">
                    {player.name}
                  </div>
                  <div className="text-xs text-[var(--fg-tertiary)]">
                    {player.sessions} sessions
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-[var(--primary-500)]">
                    {player.reliability}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
export default AdvancedStatsScreen;
