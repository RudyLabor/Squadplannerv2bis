import { ArrowLeft, Calendar, TrendingUp, Trophy, Clock, Users, Zap, Award, Star, Target, Share2, Sparkles, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

interface WeeklyRecapScreenProps {
  onNavigate: (screen: string, data?: any) => void;
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

interface WeekStats {
  period: string;
  sessionsPlanned: number;
  sessionsCompleted: number;
  totalHours: number;
  avgAttendance: number;
  bestDay: string;
  bestSquad: string;
  mvpPlayer: string;
  streakDays: number;
  improvements: {
    attendance: number;
    response: number;
    punctuality: number;
  };
  highlights: string[];
}

export function WeeklyRecapScreen({ onNavigate, showToast }: WeeklyRecapScreenProps) {
  const currentWeek: WeekStats = {
    period: '20-26 Janvier 2026',
    sessionsPlanned: 12,
    sessionsCompleted: 11,
    totalHours: 28.5,
    avgAttendance: 94,
    bestDay: 'Mardi',
    bestSquad: 'Les Tryharders',
    mvpPlayer: 'RudyFourcade',
    streakDays: 8,
    improvements: {
      attendance: +5,
      response: +12,
      punctuality: +3,
    },
    highlights: [
      'Meilleure semaine du mois 🔥',
      'Aucune session annulée',
      'Streak de 8 jours maintenu',
      '+5% de taux de présence',
    ],
  };

  const previousWeeks = [
    { period: '13-19 Janvier', sessionsCompleted: 10, avgAttendance: 89 },
    { period: '6-12 Janvier', sessionsCompleted: 9, avgAttendance: 87 },
    { period: '30 Déc - 5 Jan', sessionsCompleted: 8, avgAttendance: 91 },
  ];

  const topPlayers = [
    { name: 'RudyFourcade', sessions: 11, attendance: 100, points: 550 },
    { name: 'KANA', sessions: 10, attendance: 95, points: 520 },
    { name: 'Maxence', sessions: 9, attendance: 90, points: 485 },
  ];

  const handleShare = () => {
    showToast('Récap partagé avec votre squad !', 'success');
  };

  const completionRate = Math.round((currentWeek.sessionsCompleted / currentWeek.sessionsPlanned) * 100);

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-emerald-400/15 to-teal-400/15 rounded-full blur-3xl" />
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
              className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                Récap Hebdo
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                {currentWeek.period}
              </p>
            </div>
            <motion.button
              onClick={handleShare}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-5 h-5 text-white" strokeWidth={2} />
            </motion.button>
          </motion.div>

          {/* Hero Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-6 mb-6 text-white overflow-hidden relative shadow-2xl shadow-indigo-500/30"
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />

            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />

            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="text-white/70 text-sm font-medium mb-2">Cette semaine</div>
                  <h2 className="text-2xl font-black mb-2">
                    {currentWeek.highlights[0]}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-white/80 font-medium">
                    <Trophy className="w-4 h-4" strokeWidth={2} />
                    <span>Niveau exceptionnel</span>
                  </div>
                </div>
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Trophy className="w-8 h-8" strokeWidth={2} />
                </motion.div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
                  <div className="text-2xl font-black mb-0.5">
                    <CountUp end={currentWeek.sessionsCompleted} duration={1.5} />
                  </div>
                  <div className="text-xs text-white/70 font-medium">Sessions</div>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
                  <div className="text-2xl font-black mb-0.5">
                    <CountUp end={currentWeek.totalHours} decimals={1} duration={1.5} />h
                  </div>
                  <div className="text-xs text-white/70 font-medium">Jouées</div>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
                  <div className="text-2xl font-black mb-0.5">
                    <CountUp end={currentWeek.avgAttendance} duration={1.5} />%
                  </div>
                  <div className="text-xs text-white/70 font-medium">Présence</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Highlights */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-white/50 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-amber-500" strokeWidth={2} fill="currentColor" />
              <h3 className="text-base font-bold text-gray-800">
                Points forts
              </h3>
            </div>
            <div className="space-y-2">
              {currentWeek.highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <span className="text-sm font-semibold text-emerald-700">
                    {highlight}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-6">
            {/* Completion Rate */}
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-3 shadow-md">
                <Target className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div className="text-2xl font-black text-gray-800 mb-1">
                <CountUp end={completionRate} duration={1.5} />%
              </div>
              <div className="text-xs text-gray-500 font-semibold mb-1">
                Taux de complétion
              </div>
              <div className="text-xs text-gray-400 font-medium">
                {currentWeek.sessionsCompleted}/{currentWeek.sessionsPlanned} sessions
              </div>
            </motion.div>

            {/* Streak */}
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-3 shadow-md">
                <Flame className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div className="text-2xl font-black text-gray-800 mb-1">
                <CountUp end={currentWeek.streakDays} duration={1.5} />
              </div>
              <div className="text-xs text-gray-500 font-semibold mb-1">
                Jours de streak
              </div>
              <div className="text-xs text-emerald-600 font-bold">
                🔥 En progression
              </div>
            </motion.div>

            {/* Best Day */}
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-3 shadow-md">
                <Calendar className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div className="text-2xl font-black text-gray-800 mb-1">
                {currentWeek.bestDay}
              </div>
              <div className="text-xs text-gray-500 font-semibold">
                Meilleur jour
              </div>
            </motion.div>

            {/* Best Squad */}
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-3 shadow-md">
                <Users className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div className="text-base font-black text-gray-800 mb-1 truncate">
                {currentWeek.bestSquad}
              </div>
              <div className="text-xs text-gray-500 font-semibold">
                Squad la plus active
              </div>
            </motion.div>
          </motion.div>

          {/* Improvements */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-white/50 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-500" strokeWidth={2} />
              <h3 className="text-base font-bold text-gray-800">
                Évolutions vs semaine dernière
              </h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Taux de présence', value: currentWeek.improvements.attendance, icon: Target, gradient: 'from-emerald-500 to-teal-500' },
                { label: 'Temps de réponse', value: currentWeek.improvements.response, icon: Clock, gradient: 'from-blue-500 to-cyan-500' },
                { label: 'Ponctualité', value: currentWeek.improvements.punctuality, icon: Zap, gradient: 'from-amber-500 to-orange-500' },
              ].map((item, index) => {
                const isPositive = item.value > 0;
                const Icon = item.icon;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-sm`}>
                        <Icon className="w-4 h-4 text-white" strokeWidth={2} />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {item.label}
                      </span>
                    </div>
                    <div className={`
                      flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-sm
                      ${isPositive
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                      }
                    `}>
                      <TrendingUp className={`w-3.5 h-3.5 ${!isPositive && 'rotate-180'}`} strokeWidth={2.5} />
                      <span>
                        {isPositive ? '+' : ''}{item.value}%
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Top Players */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-white/50 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-amber-500" strokeWidth={2} />
              <h3 className="text-base font-bold text-gray-800">
                Top joueurs de la semaine
              </h3>
            </div>
            <div className="space-y-2">
              {topPlayers.map((player, index) => (
                <motion.div
                  key={player.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl
                    ${index === 0
                      ? 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50'
                      : 'bg-gray-50/80'
                    }
                  `}
                >
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm
                    ${index === 0
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white'
                      : index === 1
                      ? 'bg-gray-300 text-gray-700'
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-800">
                      {player.name}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      {player.sessions} sessions • {player.attendance}% présence
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-black text-indigo-600">
                      {player.points}
                    </div>
                    <div className="text-xs text-gray-400 font-medium">
                      points
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Previous Weeks */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-white/50 shadow-lg"
          >
            <h3 className="text-base font-bold text-gray-800 mb-4">
              Semaines précédentes
            </h3>
            <div className="space-y-2">
              {previousWeeks.map((week, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80"
                >
                  <div>
                    <div className="text-sm font-semibold text-gray-700">
                      {week.period}
                    </div>
                    <div className="text-xs text-gray-400 font-medium">
                      {week.sessionsCompleted} sessions
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-gray-700">
                      {week.avgAttendance}%
                    </div>
                    <div className="text-xs text-gray-400 font-medium">
                      présence
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
            <motion.button
              onClick={() => onNavigate('advanced-stats')}
              className="py-4 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 text-gray-700 font-semibold shadow-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <TrendingUp className="w-4 h-4" strokeWidth={2} />
              Stats complètes
            </motion.button>
            <motion.button
              onClick={() => onNavigate('propose-session')}
              className="py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="w-4 h-4" strokeWidth={2} />
              Créer une session
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default WeeklyRecapScreen;
