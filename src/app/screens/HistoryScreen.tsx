/**
 * HISTORY SCREEN - LINEAR DESIGN SYSTEM
 * Premium, Dark, Minimal - Session history
 */

import { ArrowLeft, Clock, TrendingUp, Calendar, Users, Trophy, Flame, ChevronRight, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface HistoryScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

// Linear-style animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.15,
      when: "beforeChildren",
      staggerChildren: 0.05
    }
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

interface StatCardProps {
  icon: React.ElementType;
  value: string | number;
  label: string;
  accentColor: string;
}

function StatCard({ icon: Icon, value, label, accentColor }: StatCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="relative p-4 md:p-5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] transition-all duration-200 group cursor-default overflow-hidden"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
    >
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150"
            style={{ backgroundColor: `${accentColor}15` }}
          >
            <Icon className="w-5 h-5 transition-colors" style={{ color: accentColor }} strokeWidth={1.5} />
          </div>
        </div>
        <p className="text-[28px] md:text-[32px] font-semibold text-[#f7f8f8] tabular-nums leading-none tracking-tight mb-0.5">{value}</p>
        <span className="text-[12px] md:text-[13px] text-[rgba(255,255,255,0.4)] uppercase tracking-wide">{label}</span>
      </div>
    </motion.div>
  );
}

interface SessionCardProps {
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
  'Valorant': '#f87171',
  'CS2': '#f5a623',
  'League of Legends': '#60a5fa',
  'default': '#5e6dd2'
};

function SessionCard({ session, index }: SessionCardProps) {
  const accentColor = gameColors[session.game] || gameColors['default'];

  return (
    <motion.div
      variants={itemVariants}
      custom={index}
      className="relative bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] transition-all"
      whileHover={{ x: 2 }}
    >
      {/* Left accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5"
        style={{ backgroundColor: accentColor }}
      />

      <div className="p-4 pl-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${accentColor}15` }}
            >
              <Calendar className="w-5 h-5" style={{ color: accentColor }} strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="font-medium text-[#f7f8f8] text-[13px]">{session.game}</h4>
              <p className="text-[11px] text-[#5e6063]">{session.date}</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[rgba(74,222,128,0.1)] text-[#4ade80] text-[11px] font-medium">
            {session.result}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[#8b8d90]">
            <Clock className="w-3.5 h-3.5 text-[#5e6063]" strokeWidth={1.5} />
            <span className="text-[11px]">{session.duration}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-[#3a3b40]" />
          <div className="flex items-center gap-1.5 text-[#8b8d90]">
            <Users className="w-3.5 h-3.5 text-[#5e6063]" strokeWidth={1.5} />
            <span className="text-[11px]">{session.participants} joueurs</span>
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
    <div className="min-h-screen pb-24 md:pb-8 bg-[#08090a]">
      <div className="px-4 md:px-6 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header - Linear style */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <motion.button
              onClick={() => onNavigate?.('home')}
              className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.06)] transition-all"
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-[22px] md:text-[24px] font-semibold text-[#f7f8f8]">
                Historique
              </h1>
              <p className="text-[13px] text-[#5e6063]">
                Toutes vos sessions passées
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[rgba(245,166,35,0.1)] flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#f5a623]" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-8">
            <StatCard
              icon={Calendar}
              value={stats.totalSessions}
              label="Sessions jouées"
              accentColor="#5e6dd2"
            />
            <StatCard
              icon={Clock}
              value={`${stats.totalHours}h`}
              label="Temps de jeu"
              accentColor="#60a5fa"
            />
            <StatCard
              icon={TrendingUp}
              value={`${stats.attendance}%`}
              label="Taux de présence"
              accentColor="#4ade80"
            />
            <StatCard
              icon={Flame}
              value={stats.streak}
              label="Streak actuel"
              accentColor="#f5a623"
            />
          </motion.div>

          {/* Recent Sessions */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-medium text-[#f7f8f8] flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#f5a623]" strokeWidth={1.5} />
                Sessions récentes
              </h3>
              <motion.button
                className="text-[12px] font-medium text-[#5e6dd2] flex items-center gap-1 hover:text-[#8b93ff] transition-colors"
                whileHover={{ x: 2 }}
              >
                Voir tout
                <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </motion.button>
            </div>

            <div className="space-y-2">
              {recentSessions.map((session, i) => (
                <SessionCard key={i} session={session} index={i} />
              ))}
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={itemVariants} className="mt-8">
            <motion.button
              onClick={() => onNavigate?.('advanced-stats')}
              className="w-full h-12 rounded-xl bg-[#5e6dd2] hover:bg-[#6a79db] text-white text-[14px] font-medium shadow-lg shadow-[#5e6dd2]/20 flex items-center justify-center gap-2 transition-colors"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <BarChart3 className="w-4 h-4" strokeWidth={1.5} />
              Voir toutes les statistiques
              <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            </motion.button>
          </motion.div>

          {/* Bottom Info Card */}
          <motion.div
            variants={itemVariants}
            className="mt-6 p-4 rounded-xl bg-[rgba(94,109,210,0.08)] border border-[rgba(94,109,210,0.2)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[rgba(94,109,210,0.15)] flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-[18px] h-[18px] text-[#8b93ff]" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-medium text-[#f7f8f8]">Analyse détaillée disponible</p>
                <p className="text-[12px] text-[#8b8d90]">Consultez vos statistiques avancées pour des insights personnalisés</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default HistoryScreen;
