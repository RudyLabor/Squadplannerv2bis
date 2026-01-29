import { ArrowLeft, TrendingUp, Clock, Users, Target, Award, Calendar, Zap, Crown, Sparkles, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdvancedStatsScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
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
      <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
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
                onClick={() => onNavigate('profile')}
                className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
              </motion.button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Stats Avancées
              </h1>
            </motion.div>

            {/* Premium Upsell */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500 rounded-3xl p-8 text-white text-center shadow-xl shadow-amber-500/30 relative overflow-hidden"
            >
              <motion.div
                className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              <motion.div
                className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm mx-auto mb-6 flex items-center justify-center shadow-lg"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown className="w-12 h-12" strokeWidth={1.5} />
              </motion.div>
              <h2 className="text-3xl font-bold mb-3">Fonctionnalité Premium</h2>
              <p className="text-white/90 mb-8 max-w-sm mx-auto leading-relaxed">
                Débloquez des analyses détaillées : performances par jour, membres les plus fiables, streaks, et bien plus.
              </p>
              <motion.button
                onClick={() => onNavigate('premium')}
                className="w-full h-14 bg-white text-amber-600 font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Crown className="w-6 h-6" strokeWidth={2} />
                Passer Premium
                <Sparkles className="w-5 h-5" />
              </motion.button>
            </motion.div>

            {/* Preview Stats (blurred) */}
            <motion.div variants={itemVariants} className="mt-6 opacity-50 pointer-events-none">
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50">
                    <div className="w-8 h-8 rounded-xl bg-gray-200 mb-2" />
                    <div className="w-16 h-6 bg-gray-200 rounded-lg mb-1" />
                    <div className="w-12 h-4 bg-gray-100 rounded-lg" />
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
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
              onClick={() => onNavigate('profile')}
              className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-indigo-500" />
                Stats Avancées
              </h1>
              <p className="text-sm text-indigo-500 font-medium flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" />
                Premium
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <BarChart3 className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Overview Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: Calendar, label: 'Sessions', value: stats.totalSessions, gradient: 'from-indigo-500 to-purple-500' },
              { icon: Target, label: 'Présence', value: `${stats.attendance}%`, gradient: 'from-emerald-500 to-teal-500' },
              { icon: Clock, label: 'Durée moy.', value: stats.avgDuration, gradient: 'from-blue-500 to-cyan-500' },
              { icon: Zap, label: 'Total heures', value: `${stats.totalHours}h`, gradient: 'from-amber-500 to-orange-500' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg"
                whileHover={{ y: -2 }}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-md`}>
                  <stat.icon className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Best Times */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-white/50 shadow-lg"
          >
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-500" strokeWidth={2} />
              Vos meilleurs créneaux
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl p-4 border border-indigo-200/50"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-xs text-indigo-600 font-semibold mb-1">Meilleur jour</div>
                <div className="text-xl font-bold text-indigo-700">{stats.bestDay}</div>
                <div className="text-xs text-indigo-500 mt-1">96% présence</div>
              </motion.div>
              <motion.div
                className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl p-4 border border-emerald-200/50"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-xs text-emerald-600 font-semibold mb-1">Meilleure heure</div>
                <div className="text-xl font-bold text-emerald-700">{stats.bestTime}</div>
                <div className="text-xs text-emerald-500 mt-1">8 sessions</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Weekly Chart */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-white/50 shadow-lg"
          >
            <h3 className="text-base font-bold text-gray-800 mb-4">Répartition hebdomadaire</h3>
            <div className="flex items-end justify-between gap-2 h-40">
              {weeklyData.map((day, index) => (
                <motion.div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-2"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex-1 w-full flex flex-col justify-end">
                    <motion.div
                      className="w-full bg-gradient-to-t from-indigo-500 to-purple-400 rounded-t-lg"
                      style={{ height: `${(day.sessions / 8) * 100}%`, minHeight: '8px' }}
                      whileHover={{ scale: 1.1 }}
                      title={`${day.sessions} sessions • ${day.attendance}% présence`}
                    />
                  </div>
                  <div className="text-xs text-gray-500 font-semibold">{day.day}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Streak */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 rounded-2xl p-5 mb-6 shadow-xl relative overflow-hidden"
          >
            <motion.div
              className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="flex items-center gap-4 relative z-10">
              <motion.div
                className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔥
              </motion.div>
              <div className="flex-1">
                <div className="text-3xl font-bold text-white mb-1">{stats.streak} sessions</div>
                <div className="text-sm text-white/90 font-medium">Streak actuel • Continue comme ça !</div>
              </div>
            </div>
          </motion.div>

          {/* Top Performers */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-lg"
          >
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" strokeWidth={2} />
              Classement fiabilité
            </h3>
            <div className="space-y-3">
              {topPerformers.map((player, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    player.rank === 1
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                      : player.rank === 2
                      ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                      : player.rank === 3
                      ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : player.rank}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-800">{player.name}</div>
                    <div className="text-xs text-gray-500">{player.sessions} sessions</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {player.reliability}%
                    </div>
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
