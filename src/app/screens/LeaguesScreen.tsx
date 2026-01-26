import { ArrowLeft, Trophy, Medal, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface LeaguesScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function LeaguesScreen({ onNavigate, showToast }: LeaguesScreenProps) {
  const leagues = [
    { name: 'Ligue Diamant', rank: 1, points: 2450, color: 'from-[var(--primary-500)] to-[var(--primary-600)]', icon: '💎' },
    { name: 'Ligue Platine', rank: 5, points: 1890, color: 'from-[var(--secondary-500)] to-[var(--secondary-600)]', icon: '🥈' },
    { name: 'Ligue Or', rank: 12, points: 1420, color: 'from-[var(--warning-500)] to-[var(--warning-600)]', icon: '🥇' },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20">
      <div className="sticky top-0 z-10 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={() => onNavigate?.('home')} className="p-2 hover:bg-[var(--background-elevated)] rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" strokeWidth={2} />
          </button>
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">Ligues</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--warning-500)] to-[var(--warning-600)] mb-4 shadow-lg">
            <Trophy className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Ligues Internes</h2>
          <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto">
            Compétition entre squads de votre communauté
          </p>
        </motion.div>

        <div className="space-y-3">
          {leagues.map((league, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className={`bg-gradient-to-br ${league.color} rounded-2xl p-5 text-white shadow-lg`}>
              <div className="flex items-center gap-4">
                <div className="text-4xl">{league.icon}</div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-1">{league.name}</h4>
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <span>Rang #{league.rank}</span>
                    <span>•</span>
                    <span>{league.points} pts</span>
                  </div>
                </div>
                <button onClick={() => onNavigate?.('leaderboard')} className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-medium hover:bg-white/30 transition-colors">
                  Voir
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
