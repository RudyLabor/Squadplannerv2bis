// @ts-nocheck
import { ArrowLeft, Repeat, Calendar, Clock, Users, Bell, CheckCircle2, Settings, Trash2, Plus, Zap, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { recurringSessionsAPI, squadsAPI } from '@/utils/api';

interface RecurringSessionScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

interface RecurringSession {
  id: string;
  title: string;
  squad: string;
  squad_id: string;
  game: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  duration: string;
  playersNeeded: number;
  autoLock: boolean;
  notifyBefore: string;
  isActive: boolean;
  nextSession: string;
  stats: {
    totalGenerated: number;
    avgAttendance: number;
    successRate: number;
  };
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

export function RecurringSessionScreen({ onNavigate, showToast }: RecurringSessionScreenProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [recurringSessions, setRecurringSessions] = useState<RecurringSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecurringSessions();
  }, []);

  const loadRecurringSessions = async () => {
    setLoading(true);
    try {
      // First get user's squads to fetch recurring sessions
      const { squads } = await squadsAPI.getAll();
      const allSessions: RecurringSession[] = [];

      // Load recurring sessions for each squad
      for (const squad of squads || []) {
        try {
          const { recurringSessions: sessions } = await recurringSessionsAPI.getAll(squad.id);
          const mappedSessions = (sessions || []).map((s: any) => ({
            id: s.id,
            title: s.title || 'Session sans titre',
            squad: squad.name,
            squad_id: squad.id,
            game: squad.game || 'Multi-jeux',
            frequency: s.frequency || 'weekly',
            dayOfWeek: s.day_of_week,
            dayOfMonth: s.day_of_month,
            time: s.scheduled_time || '20:00',
            duration: s.duration || '2h',
            playersNeeded: s.players_needed || 5,
            autoLock: s.auto_lock || false,
            notifyBefore: s.notify_before || '24h',
            isActive: s.is_active !== false,
            nextSession: formatNextSession(s.day_of_week, s.scheduled_time),
            stats: {
              totalGenerated: s.total_generated || 0,
              avgAttendance: s.avg_attendance || 0,
              successRate: s.success_rate || 0,
            },
          }));
          allSessions.push(...mappedSessions);
        } catch (e) {
          // Squad may not have recurring sessions table
        }
      }

      setRecurringSessions(allSessions);
    } catch (error) {
      console.error('Error loading recurring sessions:', error);
      setRecurringSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatNextSession = (dayOfWeek?: number, time?: string) => {
    if (dayOfWeek === undefined) return 'À planifier';
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const today = new Date();
    const todayDay = today.getDay();
    let daysUntil = dayOfWeek - todayDay;
    if (daysUntil <= 0) daysUntil += 7;
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysUntil);
    const formattedDate = nextDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    return `${days[dayOfWeek]} ${formattedDate}, ${time || '20:00'}`;
  };

  const handleToggleActive = async (sessionId: string) => {
    const session = recurringSessions.find(s => s.id === sessionId);
    if (!session) return;

    try {
      await recurringSessionsAPI.update(sessionId, { is_active: !session.isActive });
      showToast('Statut modifié avec succès', 'success');
      loadRecurringSessions();
    } catch (error) {
      showToast('Erreur lors de la modification', 'error');
    }
  };

  const handleDelete = async (sessionId: string) => {
    try {
      await recurringSessionsAPI.update(sessionId, { is_active: false });
      showToast('Session récurrente désactivée', 'info');
      loadRecurringSessions();
    } catch (error) {
      showToast('Erreur lors de la suppression', 'error');
    }
  };

  const handleEdit = (sessionId: string) => {
    showToast('Édition à venir', 'info');
  };

  const handleCreate = () => {
    setShowCreateForm(true);
    showToast('Création à venir', 'info');
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Tous les jours';
      case 'weekly': return 'Chaque semaine';
      case 'biweekly': return 'Toutes les 2 semaines';
      case 'monthly': return 'Chaque mois';
      default: return frequency;
    }
  };

  const getDayLabel = (dayOfWeek?: number) => {
    if (dayOfWeek === undefined) return '';
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return days[dayOfWeek];
  };

  const getSuccessColor = (rate: number) => {
    if (rate >= 90) return { gradient: 'from-[var(--color-success-500)] to-teal-500', text: 'text-[var(--color-success-600)]', bg: 'bg-[var(--color-success-100)]' };
    if (rate >= 70) return { gradient: 'from-[var(--color-warning-500)] to-orange-500', text: 'text-[var(--color-warning-600)]', bg: 'bg-[var(--color-warning-100)]' };
    return { gradient: 'from-[var(--color-error-500)] to-orange-500', text: 'text-[var(--color-error-600)]', bg: 'bg-[var(--color-error-100)]' };
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 bg-[#08090a]">
      <motion.div
        className="max-w-2xl mx-auto px-4 md:px-6 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header - Linear style */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
          <motion.button
            onClick={() => onNavigate('sessions')}
            className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#8b8d90] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#f7f8f8] transition-all"
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-[24px] md:text-[28px] font-semibold text-[#f7f8f8]">
              Sessions Récurrentes
            </h1>
            <p className="text-[13px] text-[#5e6063]">
              Automatisez vos rituels de jeu
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[rgba(94,109,210,0.1)] flex items-center justify-center">
            <Repeat className="w-5 h-5 text-[#8b93ff]" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Info Banner - Linear style */}
        <motion.div
          variants={itemVariants}
          className="rounded-xl bg-[rgba(245,166,35,0.05)] border border-[rgba(245,166,35,0.15)] p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[rgba(245,166,35,0.15)] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-[#f5a623]" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-[#f7f8f8] mb-1">Créez vos rituels</h3>
              <p className="text-[13px] text-[#8b8d90]">
                Planifiez automatiquement vos sessions hebdomadaires ou mensuelles.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Create Button - Linear style */}
        <motion.button
          variants={itemVariants}
          onClick={handleCreate}
          className="w-full h-12 rounded-xl bg-[#5e6dd2] text-white text-[14px] font-semibold flex items-center justify-center gap-2 hover:bg-[#6a79db] shadow-lg shadow-[#5e6dd2]/20 transition-all mb-6"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" strokeWidth={2} />
          Créer une session récurrente
        </motion.button>

        {/* Sessions List - Linear style */}
        <div className="space-y-3">
          {recurringSessions.map((session, index) => (
            <motion.div
              key={session.id}
              variants={itemVariants}
              className={`rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] p-4 hover:bg-[rgba(255,255,255,0.04)] transition-colors ${
                !session.isActive && 'opacity-60'
              }`}
              whileHover={{ y: -2 }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[15px] font-semibold text-[#f7f8f8]">
                      {session.title}
                    </h3>
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-md uppercase ${
                      session.isActive
                        ? 'bg-[rgba(74,222,128,0.15)] text-[#4ade80]'
                        : 'bg-[rgba(255,255,255,0.08)] text-[#8b8d90]'
                    }`}>
                      {session.isActive ? 'Active' : 'Pause'}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#5e6063]">
                    {session.squad} - {session.game}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <motion.button
                    onClick={() => handleEdit(session.id)}
                    className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] flex items-center justify-center transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Settings className="w-4 h-4 text-[#8b8d90]" strokeWidth={1.5} />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(session.id)}
                    className="w-8 h-8 rounded-lg bg-[rgba(248,113,113,0.1)] hover:bg-[rgba(248,113,113,0.15)] flex items-center justify-center transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="w-4 h-4 text-[#f87171]" strokeWidth={1.5} />
                  </motion.button>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#f5a623]" strokeWidth={1.5} />
                  <span className="text-[12px] text-[#8b8d90]">
                    {getFrequencyLabel(session.frequency)}
                    {session.dayOfWeek !== undefined && (
                      <span className="text-[#f7f8f8] ml-1">{getDayLabel(session.dayOfWeek)}</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#60a5fa]" strokeWidth={1.5} />
                  <span className="text-[12px] text-[#f7f8f8]">{session.time} ({session.duration})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#4ade80]" strokeWidth={1.5} />
                  <span className="text-[12px] text-[#8b8d90]">{session.playersNeeded} joueurs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-[#8b93ff]" strokeWidth={1.5} />
                  <span className="text-[12px] text-[#8b8d90]">Rappel {session.notifyBefore}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] mb-3">
                <div className="text-center">
                  <p className="text-[16px] font-semibold text-[#f7f8f8] tabular-nums">{session.stats.totalGenerated}</p>
                  <p className="text-[10px] text-[#5e6063] uppercase">Sessions</p>
                </div>
                <div className="text-center">
                  <p className="text-[16px] font-semibold text-[#4ade80] tabular-nums">{session.stats.avgAttendance}%</p>
                  <p className="text-[10px] text-[#5e6063] uppercase">Présence</p>
                </div>
                <div className="text-center">
                  <p className={`text-[16px] font-semibold tabular-nums ${
                    session.stats.successRate >= 90 ? 'text-[#4ade80]' :
                    session.stats.successRate >= 70 ? 'text-[#f5a623]' :
                    'text-[#f87171]'
                  }`}>{session.stats.successRate}%</p>
                  <p className="text-[10px] text-[#5e6063] uppercase">Succès</p>
                </div>
              </div>

              {/* Next Session */}
              {session.isActive && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[rgba(94,109,210,0.08)] border border-[rgba(94,109,210,0.15)] mb-3">
                  <Zap className="w-4 h-4 text-[#8b93ff]" strokeWidth={1.5} />
                  <span className="text-[12px] text-[#8b93ff]">
                    Prochaine : <span className="font-semibold text-[#f7f8f8]">{session.nextSession}</span>
                  </span>
                </div>
              )}

              {/* Toggle Active Button */}
              <motion.button
                onClick={() => handleToggleActive(session.id)}
                className={`w-full h-10 rounded-lg text-[13px] font-medium flex items-center justify-center gap-2 transition-colors ${
                  session.isActive
                    ? 'bg-[rgba(255,255,255,0.04)] text-[#8b8d90] hover:bg-[rgba(255,255,255,0.08)]'
                    : 'bg-[rgba(74,222,128,0.1)] text-[#4ade80] hover:bg-[rgba(74,222,128,0.15)]'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                {!session.isActive && <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />}
                {session.isActive ? "Mettre en pause" : "Réactiver"}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Empty State - Linear style */}
        {recurringSessions.length === 0 && (
          <motion.div variants={itemVariants} className="text-center py-12 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
            <div className="w-16 h-16 rounded-xl bg-[rgba(94,109,210,0.1)] flex items-center justify-center mx-auto mb-4">
              <Repeat className="w-8 h-8 text-[#8b93ff]" strokeWidth={1.5} />
            </div>
            <h3 className="text-[16px] font-semibold text-[#f7f8f8] mb-2">
              Aucune session récurrente
            </h3>
            <p className="text-[13px] text-[#8b8d90] mb-6 max-w-xs mx-auto">
              Créez votre première session récurrente pour automatiser votre planning
            </p>
            <motion.button
              onClick={handleCreate}
              className="px-6 py-3 bg-[#5e6dd2] hover:bg-[#6a79db] text-white rounded-xl font-medium transition-colors inline-flex items-center gap-2"
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-5 h-5" strokeWidth={2} />
              Créer une session récurrente
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default RecurringSessionScreen;
