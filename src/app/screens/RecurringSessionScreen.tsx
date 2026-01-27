import { ArrowLeft, Repeat, Calendar, Clock, Users, Bell, CheckCircle2, Settings, Trash2, Plus, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Button } from '@/app/components/ui/Button';

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
    if (rate >= 90) return 'success';
    if (rate >= 70) return 'warning';
    return 'error';
  };

  return (
    <div className="min-h-screen pb-24 pt-safe">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight flex items-center gap-2">
              <Repeat className="w-6 h-6 text-[var(--primary-500)]" strokeWidth={2} />
              Sessions Récurrentes
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] font-medium">
              Automatisez vos rituels de jeu
            </p>
          </div>
        </div>

        {/* Hero Card */}
        <div className="bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] rounded-3xl p-6 mb-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Repeat className="w-7 h-7" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">Créez vos rituels</h2>
              <p className="text-sm opacity-90 leading-relaxed">
                Planifiez automatiquement vos sessions hebdomadaires ou mensuelles. 
                Plus besoin de créer manuellement, tout est géré pour vous.
              </p>
            </div>
          </div>
        </div>

        {/* Create Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreate}
          className="w-full bg-white rounded-2xl p-4 mb-6 border-[0.5px] border-[var(--border-medium)] hover:border-[var(--primary-300)] hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--primary-50)] group-hover:bg-[var(--primary-100)] flex items-center justify-center transition-colors">
              <Plus className="w-6 h-6 text-[var(--primary-600)]" strokeWidth={2} />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-bold text-[var(--fg-primary)]">
                Créer une session récurrente
              </div>
              <div className="text-xs text-[var(--fg-tertiary)]">
                Automatisez votre planning
              </div>
            </div>
          </div>
        </motion.button>

        {/* Sessions List */}
        <div className="space-y-4">
          {recurringSessions.map((session, index) => {
            const successColor = getSuccessColor(session.stats.successRate);

            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  bg-white rounded-2xl p-5 border-[0.5px] border-[var(--border-subtle)] shadow-sm
                  ${!session.isActive && 'opacity-60'}
                `}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-[var(--fg-primary)]">
                        {session.title}
                      </h3>
                      <div className={`
                        px-2 py-0.5 rounded-lg text-xs font-bold
                        ${session.isActive 
                          ? 'bg-[var(--success-50)] text-[var(--success-700)]' 
                          : 'bg-[var(--border-medium)] text-[var(--fg-tertiary)]'
                        }
                      `}>
                        {session.isActive ? 'Active' : 'Pause'}
                      </div>
                    </div>
                    <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                      {session.squad} • {session.game}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(session.id)}
                      className="w-9 h-9 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] flex items-center justify-center transition-colors"
                    >
                      <Settings className="w-4 h-4 text-[var(--fg-secondary)]" strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => handleDelete(session.id)}
                      className="w-9 h-9 rounded-lg bg-[var(--error-50)] hover:bg-[var(--error-100)] flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-[var(--error-600)]" strokeWidth={2} />
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[var(--primary-500)]" strokeWidth={2} />
                    <div className="text-xs">
                      <span className="text-[var(--fg-tertiary)]">
                        {getFrequencyLabel(session.frequency)}
                      </span>
                      {session.dayOfWeek !== undefined && (
                        <span className="font-semibold text-[var(--fg-secondary)] ml-1">
                          • {getDayLabel(session.dayOfWeek)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[var(--secondary-500)]" strokeWidth={2} />
                    <span className="text-xs text-[var(--fg-secondary)] font-semibold">
                      {session.time} ({session.duration})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[var(--warning-500)]" strokeWidth={2} />
                    <span className="text-xs text-[var(--fg-secondary)] font-semibold">
                      {session.playersNeeded} joueurs
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[var(--success-500)]" strokeWidth={2} />
                    <span className="text-xs text-[var(--fg-secondary)] font-semibold">
                      Rappel {session.notifyBefore} avant
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-[var(--bg-secondary)] rounded-xl p-3 mb-4">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-lg font-bold text-[var(--fg-primary)]">
                        {session.stats.totalGenerated}
                      </div>
                      <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                        Sessions
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-[var(--success-600)]">
                        {session.stats.avgAttendance}%
                      </div>
                      <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                        Présence
                      </div>
                    </div>
                    <div>
                      <div className={`text-lg font-bold text-[var(--${successColor}-600)]`}>
                        {session.stats.successRate}%
                      </div>
                      <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                        Succès
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Session */}
                {session.isActive && (
                  <div className="bg-[var(--primary-50)] rounded-xl p-3 border-[0.5px] border-[var(--primary-200)]">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[var(--primary-600)]" strokeWidth={2} />
                      <div className="flex-1">
                        <span className="text-xs text-[var(--primary-700)] font-medium">
                          Prochaine session :
                        </span>
                        <span className="text-xs text-[var(--primary-700)] font-bold ml-1">
                          {session.nextSession}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Toggle Active Button */}
                <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                  <Button
                    variant={session.isActive ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => handleToggleActive(session.id)}
                    className="w-full"
                  >
                    {session.isActive ? (
                      <>Mettre en pause</>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
                        Réactiver
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {recurringSessions.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border-[0.5px] border-[var(--border-subtle)]">
            <div className="w-20 h-20 rounded-full bg-[var(--primary-50)] mx-auto mb-4 flex items-center justify-center">
              <Repeat className="w-10 h-10 text-[var(--primary-500)]" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-bold text-[var(--fg-primary)] mb-2">
              Aucune session récurrente
            </h3>
            <p className="text-sm text-[var(--fg-tertiary)] mb-6 max-w-xs mx-auto leading-relaxed">
              Créez votre première session récurrente pour automatiser votre planning
            </p>
            <Button
              variant="primary"
              onClick={handleCreate}
              className="mx-auto"
            >
              <Plus className="w-5 h-5" strokeWidth={2} />
              Créer une session récurrente
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
export default RecurringSessionScreen;
