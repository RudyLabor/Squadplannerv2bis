import { ArrowLeft, Calendar, TrendingUp, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface SeasonsScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function SeasonsScreen({ onNavigate, showToast }: SeasonsScreenProps) {
  const currentSeason = { name: 'Saison 3', startDate: '1er Janv 2026', endDate: '31 Mars 2026', progress: 65, rank: 4 };
  const pastSeasons = [
    { name: 'Saison 2', rank: 2, points: 2850, reward: '🏆 Trophée Or' },
    { name: 'Saison 1', rank: 7, points: 1920, reward: '🥈 Médaille' },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20">
      <div className="sticky top-0 z-10 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={() => onNavigate?.('home')} className="p-2 hover:bg-[var(--background-elevated)] rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" strokeWidth={2} />
          </button>
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">Saisons</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] mb-4 shadow-lg">
            <Calendar className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Saisons Compétitives</h2>
          <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto">
            Progression trimestrielle avec récompenses
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold mb-1">{currentSeason.name}</h3>
              <p className="text-sm text-white/80">{currentSeason.startDate} - {currentSeason.endDate}</p>
            </div>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-bold">
              #{currentSeason.rank}
            </span>
          </div>
          <div className="bg-white/20 rounded-full h-3 mb-2 overflow-hidden">
            <div className="bg-white h-full rounded-full" style={{ width: `${currentSeason.progress}%` }} />
          </div>
          <p className="text-sm text-white/80">{currentSeason.progress}% complété</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3 px-1">
            Saisons précédentes
          </h3>
          <div className="space-y-3">
            {pastSeasons.map((season, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-medium)] shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-[var(--text-primary)]">{season.name}</h4>
                  <span className="px-2 py-1 bg-[var(--background)] text-[var(--text-primary)] text-xs font-semibold rounded-lg">
                    Rang #{season.rank}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">{season.points} points</span>
                  <span className="text-[var(--text-primary)]">{season.reward}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
