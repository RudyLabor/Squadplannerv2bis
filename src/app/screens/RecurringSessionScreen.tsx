import { ArrowLeft, Repeat, Calendar, Clock, Users, Bell, CheckCircle2, Settings, Trash2, Plus, Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button, Card, Badge, IconButton } from '@/design-system';

interface RecurringSessionScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

interface RecurringSession {
  id: string;
  title: string;
  squad: string;
  game: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
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

  // Mock data
  const recurringSessions: RecurringSession[] = [
    {
      id: '1',
      title: 'Session Valorant Hebdo',
      squad: 'Les Tryharders',
      game: 'Valorant',
      frequency: 'weekly',
      dayOfWeek: 2, // Mardi
      time: '21:00',
      duration: '2h',
      playersNeeded: 5,
      autoLock: true,
      notifyBefore: '24h',
      isActive: true,
      nextSession: 'Mardi 27 Jan, 21:00',
      stats: {
        totalGenerated: 12,
        avgAttendance: 94,
        successRate: 100,
      },
    },
    {
      id: '2',
      title: 'Week-end Marathon',
      squad: 'Les Tryharders',
      game: 'League of Legends',
      frequency: 'weekly',
      dayOfWeek: 6, // Samedi
      time: '15:00',
      duration: '4h',
      playersNeeded: 5,
      autoLock: false,
      notifyBefore: '48h',
      isActive: true,
      nextSession: 'Samedi 1 Fév, 15:00',
      stats: {
        totalGenerated: 8,
        avgAttendance: 87,
        successRate: 88,
      },
    },
    {
      id: '3',
      title: 'Soirée détente',
      squad: 'Les Tryharders',
      game: 'Among Us',
      frequency: 'biweekly',
      time: '20:00',
      duration: '1.5h',
      playersNeeded: 4,
      autoLock: false,
      notifyBefore: '12h',
      isActive: false,
      nextSession: 'Vendredi 7 Fév, 20:00',
      stats: {
        totalGenerated: 6,
        avgAttendance: 76,
        successRate: 67,
      },
    },
  ];

  const handleToggleActive = (sessionId: string) => {
    showToast('Statut modifié avec succès', 'success');
  };

  const handleDelete = (sessionId: string) => {
    showToast('Session récurrente supprimée', 'info');
  };

  const handleEdit = (sessionId: string) => {
    showToast('Édition à venir', 'info');
  };

  const handleCreate = () => {
    setShowCreateForm(true);
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
    <div className="min-h-screen pb-24 pt-safe bg-[var(--bg-base)] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[var(--color-primary-400)]/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-success-400)]/15 to-teal-400/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.35 }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
              <IconButton
                aria-label="Retour"
                icon={<ArrowLeft className="w-5 h-5" strokeWidth={2} />}
                variant="secondary"
                size="lg"
                onClick={() => onNavigate('home')}
                className="rounded-2xl bg-[var(--bg-elevated)]/80 backdrop-blur-sm border-[var(--border-subtle)]/50 shadow-lg hover:shadow-xl"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[var(--color-primary-600)] to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                  Sessions Recurrentes
                </h1>
                <p className="text-sm text-[var(--fg-secondary)] font-medium">
                  Automatisez vos rituels de jeu
                </p>
              </div>
              <motion.div
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary-500)] to-purple-600 flex items-center justify-center shadow-lg shadow-[var(--color-primary-500)]/30"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <Repeat className="w-6 h-6 text-white" strokeWidth={2} />
              </motion.div>
            </motion.div>

          {/* Hero Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-[var(--color-primary-500)] to-purple-600 rounded-3xl p-6 mb-6 shadow-xl shadow-[var(--color-primary-500)]/30 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

            <div className="relative z-10 flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Repeat className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold tracking-tight text-white mb-2">Creez vos rituels</h2>
                <p className="text-sm text-white/90 leading-relaxed">
                  Planifiez automatiquement vos sessions hebdomadaires ou mensuelles.
                  Plus besoin de creer manuellement, tout est gere pour vous.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Create Button */}
          <motion.button
            variants={itemVariants}
            onClick={handleCreate}
            className="w-full bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-[var(--border-subtle)]/50 hover:border-[var(--color-primary-300)] hover:shadow-lg transition-all group"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary-100)] to-purple-100 group-hover:from-[var(--color-primary-500)] group-hover:to-purple-500 flex items-center justify-center transition-all shadow-md"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Plus className="w-6 h-6 text-[var(--color-primary-600)] group-hover:text-white transition-colors" strokeWidth={2} />
              </motion.div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold text-[var(--fg-primary)]">
                  Creer une session recurrente
                </p>
                <p className="text-xs text-[var(--fg-secondary)]">
                  Automatisez votre planning
                </p>
              </div>
              <Sparkles className="w-5 h-5 text-[var(--color-primary-400)] group-hover:text-[var(--color-primary-600)] transition-colors" />
            </div>
          </motion.button>

          {/* Sessions List */}
          <div className="space-y-4">
            {recurringSessions.map((session, index) => {
              const successColor = getSuccessColor(session.stats.successRate);

              return (
                <motion.div
                  key={session.id}
                  variants={itemVariants}
                  custom={index}
                  className={`bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl p-5 border border-[var(--border-subtle)]/50 shadow-lg hover:shadow-xl transition-all ${
                    !session.isActive && 'opacity-70'
                  }`}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-bold tracking-tight text-[var(--fg-primary)]">
                          {session.title}
                        </h3>
                        <Badge variant={session.isActive ? 'success' : 'gray'}>
                          {session.isActive ? 'Active' : 'Pause'}
                        </Badge>
                      </div>
                      <p className="text-xs text-[var(--fg-secondary)] font-medium">
                        {session.squad} - {session.game}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => handleEdit(session.id)}
                        className="w-9 h-9 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--bg-subtle)]/80 flex items-center justify-center transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Settings className="w-4 h-4 text-[var(--fg-secondary)]" strokeWidth={2} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(session.id)}
                        className="w-9 h-9 rounded-lg bg-[var(--color-error-50)] hover:bg-[var(--color-error-100)] flex items-center justify-center transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-4 h-4 text-[var(--color-error-600)]" strokeWidth={2} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[var(--color-primary-500)]" strokeWidth={2} />
                      <div className="text-xs">
                        <span className="text-[var(--fg-secondary)]">
                          {getFrequencyLabel(session.frequency)}
                        </span>
                        {session.dayOfWeek !== undefined && (
                          <span className="font-bold text-[var(--fg-primary)] ml-1">
                            - {getDayLabel(session.dayOfWeek)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-500" strokeWidth={2} />
                      <span className="text-xs text-[var(--fg-primary)] font-semibold">
                        {session.time} ({session.duration})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[var(--color-warning-500)]" strokeWidth={2} />
                      <span className="text-xs text-[var(--fg-primary)] font-semibold">
                        {session.playersNeeded} joueurs
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[var(--color-success-500)]" strokeWidth={2} />
                      <span className="text-xs text-[var(--fg-primary)] font-semibold">
                        Rappel {session.notifyBefore} avant
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="bg-gradient-to-br from-[var(--bg-subtle)] to-slate-50 rounded-xl p-3 mb-4 border border-[var(--border-subtle)]">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-lg font-bold text-[var(--fg-primary)]">
                          {session.stats.totalGenerated}
                        </p>
                        <p className="text-xs text-[var(--fg-secondary)] font-medium">
                          Sessions
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-[var(--color-success-600)]">
                          {session.stats.avgAttendance}%
                        </p>
                        <p className="text-xs text-[var(--fg-secondary)] font-medium">
                          Presence
                        </p>
                      </div>
                      <div>
                        <p className={`text-lg font-bold ${successColor.text}`}>
                          {session.stats.successRate}%
                        </p>
                        <p className="text-xs text-[var(--fg-secondary)] font-medium">
                          Succes
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Next Session */}
                  {session.isActive && (
                    <div className="bg-gradient-to-br from-[var(--color-primary-50)] to-purple-50 rounded-xl p-3 border border-[var(--color-primary-200)] mb-4">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[var(--color-primary-600)]" strokeWidth={2} />
                        <div className="flex-1">
                          <span className="text-xs text-[var(--color-primary-600)] font-medium">
                            Prochaine session :
                          </span>
                          <span className="text-xs text-[var(--color-primary-700)] font-bold ml-1">
                            {session.nextSession}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Toggle Active Button */}
                  <div className="pt-4 border-t border-[var(--border-subtle)]">
                    <Button
                      variant={session.isActive ? "secondary" : "primary"}
                      fullWidth
                      onClick={() => handleToggleActive(session.id)}
                      icon={!session.isActive ? <CheckCircle2 className="w-4 h-4" strokeWidth={2} /> : undefined}
                    >
                      {session.isActive ? "Mettre en pause" : "Reactiver"}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Empty State */}
          {recurringSessions.length === 0 && (
            <motion.div variants={itemVariants}>
              <Card variant="elevated" padding="xl" className="text-center bg-[var(--bg-elevated)]/80 backdrop-blur-sm border-[var(--border-subtle)]/50 shadow-lg">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--color-primary-500)] to-purple-600 mx-auto mb-4 flex items-center justify-center shadow-xl shadow-[var(--color-primary-500)]/30">
                  <Repeat className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold tracking-tight text-[var(--fg-primary)] mb-2">
                  Aucune session recurrente
                </h3>
                <p className="text-sm text-[var(--fg-secondary)] mb-6 max-w-xs mx-auto leading-relaxed">
                  Creez votre premiere session recurrente pour automatiser votre planning
                </p>
                <Button
                  variant="primary"
                  onClick={handleCreate}
                  icon={<Plus className="w-5 h-5" strokeWidth={2} />}
                  className="mx-auto"
                >
                  Creer une session recurrente
                </Button>
              </Card>
            </motion.div>
          )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default RecurringSessionScreen;
