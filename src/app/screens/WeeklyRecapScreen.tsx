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
      'Meilleure semaine du mois',
      'Aucune session annulee',
      'Streak de 8 jours maintenu',
      '+5% de taux de presence',
    ],
  };

  const previousWeeks = [
    { period: '13-19 Janvier', sessionsCompleted: 10, avgAttendance: 89 },
    { period: '6-12 Janvier', sessionsCompleted: 9, avgAttendance: 87 },
    { period: '30 Dec - 5 Jan', sessionsCompleted: 8, avgAttendance: 91 },
  ];

  const topPlayers = [
    { name: 'RudyFourcade', sessions: 11, attendance: 100, points: 550 },
    { name: 'KANA', sessions: 10, attendance: 95, points: 520 },
    { name: 'Maxence', sessions: 9, attendance: 90, points: 485 },
  ];

  const handleShare = () => {
    showToast('Recap partage avec votre squad !', 'success');
  };

  const completionRate = Math.round((currentWeek.sessionsCompleted / currentWeek.sessionsPlanned) * 100);

  return (
    <div className="min-h-screen pb-24 md:pb-8 pt-safe bg-[#08090a]">
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
            <motion.button
              onClick={() => onNavigate('home')}
              className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-[#8b8d90]" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-[#f7f8f8]">
                Recap Hebdo
              </h1>
              <p className="text-sm text-[#5e6063]">
                {currentWeek.period}
              </p>
            </div>
            <motion.button
              onClick={handleShare}
              className="w-10 h-10 rounded-xl bg-[#5e6dd2] flex items-center justify-center hover:bg-[#6a79db] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-5 h-5 text-white" strokeWidth={2} />
            </motion.button>
          </motion.div>

          {/* Hero Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-[#5e6dd2] to-[#8b5cf6] rounded-2xl p-5 mb-6 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-3xl" />

            <div className="relative">
              <div className="flex items-start justify-between mb-5">
                <div className="flex-1">
                  <div className="text-white/70 text-xs font-medium mb-1.5">Cette semaine</div>
                  <h2 className="text-lg font-bold text-white mb-1.5">
                    {currentWeek.highlights[0]}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-white/80">
                    <Trophy className="w-3.5 h-3.5" strokeWidth={2} />
                    <span>Niveau exceptionnel</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-white mb-0.5">
                    <CountUp end={currentWeek.sessionsCompleted} duration={1.5} />
                  </div>
                  <div className="text-xs text-white/70">Sessions</div>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-white mb-0.5">
                    <CountUp end={currentWeek.totalHours} decimals={1} duration={1.5} />h
                  </div>
                  <div className="text-xs text-white/70">Jouees</div>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-white mb-0.5">
                    <CountUp end={currentWeek.avgAttendance} duration={1.5} />%
                  </div>
                  <div className="text-xs text-white/70">Presence</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Highlights */}
          <motion.div
            variants={itemVariants}
            className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-5 mb-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 text-amber-400" strokeWidth={2} fill="currentColor" />
              <h3 className="text-sm font-semibold text-[#f7f8f8]">
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
                  className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)]"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <span className="text-sm text-emerald-400">
                    {highlight}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-4">
            {/* Completion Rate */}
            <motion.div
              className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-3">
                <Target className="w-5 h-5 text-emerald-400" strokeWidth={2} />
              </div>
              <div className="text-2xl font-bold text-[#f7f8f8] mb-1">
                <CountUp end={completionRate} duration={1.5} />%
              </div>
              <div className="text-xs text-[#8b8d90] mb-0.5">
                Taux de completion
              </div>
              <div className="text-xs text-[#5e6063]">
                {currentWeek.sessionsCompleted}/{currentWeek.sessionsPlanned} sessions
              </div>
            </motion.div>

            {/* Streak */}
            <motion.div
              className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center mb-3">
                <Flame className="w-5 h-5 text-amber-400" strokeWidth={2} />
              </div>
              <div className="text-2xl font-bold text-[#f7f8f8] mb-1">
                <CountUp end={currentWeek.streakDays} duration={1.5} />
              </div>
              <div className="text-xs text-[#8b8d90] mb-0.5">
                Jours de streak
              </div>
              <div className="text-xs text-emerald-400 font-medium">
                En progression
              </div>
            </motion.div>

            {/* Best Day */}
            <motion.div
              className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-xl bg-[#5e6dd2]/20 flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5 text-[#5e6dd2]" strokeWidth={2} />
              </div>
              <div className="text-xl font-bold text-[#f7f8f8] mb-1">
                {currentWeek.bestDay}
              </div>
              <div className="text-xs text-[#8b8d90]">
                Meilleur jour
              </div>
            </motion.div>

            {/* Best Squad */}
            <motion.div
              className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-pink-400" strokeWidth={2} />
              </div>
              <div className="text-sm font-bold text-[#f7f8f8] mb-1 truncate">
                {currentWeek.bestSquad}
              </div>
              <div className="text-xs text-[#8b8d90]">
                Squad la plus active
              </div>
            </motion.div>
          </motion.div>

          {/* Improvements */}
          <motion.div
            variants={itemVariants}
            className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-5 mb-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-400" strokeWidth={2} />
              <h3 className="text-sm font-semibold text-[#f7f8f8]">
                Evolutions vs semaine derniere
              </h3>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Taux de presence', value: currentWeek.improvements.attendance, icon: Target, color: 'emerald' },
                { label: 'Temps de reponse', value: currentWeek.improvements.response, icon: Clock, color: 'blue' },
                { label: 'Ponctualite', value: currentWeek.improvements.punctuality, icon: Zap, color: 'amber' },
              ].map((item, index) => {
                const isPositive = item.value > 0;
                const Icon = item.icon;
                const colorClasses = {
                  emerald: 'bg-emerald-500/20 text-emerald-400',
                  blue: 'bg-blue-500/20 text-blue-400',
                  amber: 'bg-amber-500/20 text-amber-400',
                };

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-[rgba(255,255,255,0.02)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorClasses[item.color as keyof typeof colorClasses]}`}>
                        <Icon className="w-4 h-4" strokeWidth={2} />
                      </div>
                      <span className="text-sm text-[#8b8d90]">
                        {item.label}
                      </span>
                    </div>
                    <div className={`
                      flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-medium
                      ${isPositive
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'
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
            className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-5 mb-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-amber-400" strokeWidth={2} />
              <h3 className="text-sm font-semibold text-[#f7f8f8]">
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
                      ? 'bg-amber-500/10 border border-amber-500/20'
                      : 'bg-[rgba(255,255,255,0.02)]'
                    }
                  `}
                >
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
                    ${index === 0
                      ? 'bg-amber-500 text-white'
                      : index === 1
                      ? 'bg-[#5e6063] text-[#f7f8f8]'
                      : 'bg-[#3a3d41] text-[#8b8d90]'
                    }
                  `}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#f7f8f8]">
                      {player.name}
                    </div>
                    <div className="text-xs text-[#5e6063]">
                      {player.sessions} sessions - {player.attendance}% presence
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-[#5e6dd2]">
                      {player.points}
                    </div>
                    <div className="text-xs text-[#5e6063]">
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
            className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-5 mb-6"
          >
            <h3 className="text-sm font-semibold text-[#f7f8f8] mb-4">
              Semaines precedentes
            </h3>
            <div className="space-y-2">
              {previousWeeks.map((week, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-[rgba(255,255,255,0.02)]"
                >
                  <div>
                    <div className="text-sm text-[#8b8d90]">
                      {week.period}
                    </div>
                    <div className="text-xs text-[#5e6063]">
                      {week.sessionsCompleted} sessions
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-medium text-[#f7f8f8]">
                      {week.avgAttendance}%
                    </div>
                    <div className="text-xs text-[#5e6063]">
                      presence
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
              className="py-3.5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-[#8b8d90] font-medium flex items-center justify-center gap-2 hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <TrendingUp className="w-4 h-4" strokeWidth={2} />
              Stats completes
            </motion.button>
            <motion.button
              onClick={() => onNavigate('propose-session')}
              className="py-3.5 rounded-xl bg-[#5e6dd2] hover:bg-[#6a79db] text-white font-medium flex items-center justify-center gap-2 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="w-4 h-4" strokeWidth={2} />
              Creer une session
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default WeeklyRecapScreen;
