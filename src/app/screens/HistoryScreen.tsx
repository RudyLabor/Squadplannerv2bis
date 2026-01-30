import { ArrowLeft, Clock, TrendingUp, BarChart3, Calendar, Users, Trophy, Flame, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface HistoryScreenProps {
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

interface PremiumStatCardProps {
  icon: React.ElementType;
  value: string | number;
  label: string;
  gradient: string;
  delay: number;
}

function PremiumStatCard({ icon: Icon, value, label, gradient, delay }: PremiumStatCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      custom={delay}
      className="relative overflow-hidden rounded-2xl p-4"
      whileHover={{ scale: 1.03, y: -2 }}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

      {/* Glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/20" />

      {/* Decorative blur */}
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full blur-2xl" />

      <div className="relative z-10">
        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
          <Icon className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
        <div className="text-xs text-white/80 font-medium">{label}</div>
      </div>
    </motion.div>
  );
}

interface SessionHistoryCardProps {
  session: {
    date: string;
    game: string;
    duration: string;
    participants: number;
    result: string;
  };
  index: number;
}

const gameColors: Record<string, string> = {
  'Valorant': 'from-red-500 to-pink-500',
  'CS2': 'from-amber-500 to-orange-500',
  'League of Legends': 'from-blue-500 to-cyan-500',
  'default': 'from-indigo-500 to-purple-500'
};

function SessionHistoryCard({ session, index }: SessionHistoryCardProps) {
  const gradient = gameColors[session.game] || gameColors['default'];

  return (
    <motion.div
      variants={itemVariants}
      custom={index}
      className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-md hover:shadow-lg transition-all"
      whileHover={{ scale: 1.01, x: 4 }}
    >
      {/* Left accent */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${gradient}`} />

      <div className="p-4 pl-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}>
              <Calendar className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm">{session.game}</h4>
              <p className="text-xs text-gray-500">{session.date}</p>
            </div>
          </div>
          <motion.span
            className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-xs font-semibold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
          >
            {session.result}
          </motion.span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium">{session.duration}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <div className="flex items-center gap-1.5 text-gray-600">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium">{session.participants} joueurs</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function HistoryScreen({ onNavigate }: HistoryScreenProps) {
  const stats = { totalSessions: 245, totalHours: 782, attendance: 94, streak: 18 };
  const recentSessions = [
    { date: '23 Jan 2026', game: 'Valorant', duration: '3h', participants: 5, result: 'Complété' },
    { date: '21 Jan 2026', game: 'CS2', duration: '2h30', participants: 4, result: 'Complété' },
    { date: '19 Jan 2026', game: 'Valorant', duration: '4h', participants: 5, result: 'Complété' },
    { date: '17 Jan 2026', game: 'League of Legends', duration: '2h', participants: 5, result: 'Complété' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden pb-20">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-20 bg-gradient-to-b from-indigo-50/95 to-transparent backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4 max-w-2xl mx-auto">
          <motion.button
            onClick={() => onNavigate?.('squad-detail')}
            className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
          </motion.button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Historique
          </h1>
          <div className="w-12" />
        </div>
      </div>

      <div className="relative z-10 px-4 py-2 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center py-6 mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-xl shadow-indigo-500/30">
              <Clock className="w-10 h-10 text-white" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Historique Long Terme
            </h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Toutes vos sessions depuis la création de votre compte
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-8">
            <PremiumStatCard
              icon={Calendar}
              value={stats.totalSessions}
              label="Sessions jouées"
              gradient="from-indigo-500 to-purple-500"
              delay={0}
            />
            <PremiumStatCard
              icon={Clock}
              value={`${stats.totalHours}h`}
              label="Temps de jeu"
              gradient="from-cyan-500 to-blue-500"
              delay={1}
            />
            <PremiumStatCard
              icon={TrendingUp}
              value={`${stats.attendance}%`}
              label="Taux de présence"
              gradient="from-emerald-500 to-teal-500"
              delay={2}
            />
            <PremiumStatCard
              icon={Flame}
              value={stats.streak}
              label="Streak actuel"
              gradient="from-amber-500 to-orange-500"
              delay={3}
            />
          </motion.div>

          {/* Recent Sessions */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Sessions récentes
              </h3>
              <motion.button
                className="text-sm font-semibold text-indigo-600 flex items-center gap-1"
                whileHover={{ x: 3 }}
              >
                Voir tout
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="space-y-3">
              {recentSessions.map((session, i) => (
                <SessionHistoryCard key={i} session={session} index={i} />
              ))}
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={itemVariants} className="mt-8">
            <motion.button
              onClick={() => onNavigate?.('advanced-stats')}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="w-5 h-5" />
              Voir toutes les statistiques
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Bottom Info Card */}
          <motion.div
            variants={itemVariants}
            className="mt-6 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Analyse détaillée disponible</p>
                <p className="text-xs text-gray-500">Consultez vos statistiques avancées pour des insights personnalisés</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default HistoryScreen;
