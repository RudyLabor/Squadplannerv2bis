import { ArrowLeft, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface HistoryScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function HistoryScreen({ onNavigate, showToast }: HistoryScreenProps) {
  const stats = { totalSessions: 245, totalHours: 782, attendance: 94, streak: 18 };
  const recentSessions = [
    { date: '23 Jan 2026', game: 'Valorant', duration: '3h', participants: 5, result: '✅ Complété' },
    { date: '21 Jan 2026', game: 'CS2', duration: '2h30', participants: 4, result: '✅ Complété' },
    { date: '19 Jan 2026', game: 'Valorant', duration: '4h', participants: 5, result: '✅ Complété' },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20">
      <div className="sticky top-0 z-10 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={() => onNavigate?.('squad-detail')} className="p-2 hover:bg-[var(--background-elevated)] rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" strokeWidth={2} />
          </button>
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">Historique</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--secondary-500)] to-[var(--secondary-600)] mb-4 shadow-lg">
            <Clock className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Historique Long Terme</h2>
          <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto">
            Toutes vos sessions depuis la création
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-medium)] text-center shadow-sm">
            <div className="text-2xl font-bold text-[var(--primary-600)] mb-1">{stats.totalSessions}</div>
            <div className="text-xs text-[var(--text-tertiary)]">Sessions</div>
          </div>
          <div className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-medium)] text-center shadow-sm">
            <div className="text-2xl font-bold text-[var(--secondary-600)] mb-1">{stats.totalHours}h</div>
            <div className="text-xs text-[var(--text-tertiary)]">Temps de jeu</div>
          </div>
          <div className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-medium)] text-center shadow-sm">
            <div className="text-2xl font-bold text-[var(--success-600)] mb-1">{stats.attendance}%</div>
            <div className="text-xs text-[var(--text-tertiary)]">Présence</div>
          </div>
          <div className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-medium)] text-center shadow-sm">
            <div className="text-2xl font-bold text-[var(--warning-600)] mb-1">{stats.streak}</div>
            <div className="text-xs text-[var(--text-tertiary)]">Streak jours</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3 px-1">
            Sessions récentes
          </h3>
          <div className="space-y-2">
            {recentSessions.map((session, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-medium)] shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)] text-sm">{session.game}</h4>
                    <p className="text-xs text-[var(--text-tertiary)]">{session.date}</p>
                  </div>
                  <span className="text-xs text-[var(--success-600)]">{session.result}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                  <span>{session.duration}</span>
                  <span>•</span>
                  <span>{session.participants} joueurs</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
          <button onClick={() => onNavigate?.('advanced-stats')} className="px-6 py-3 bg-white text-[var(--text-primary)] rounded-xl font-medium border-[0.5px] border-[var(--border-medium)] hover:bg-[var(--background-elevated)] transition-colors shadow-sm">
            Voir toutes les statistiques
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default HistoryScreen;
