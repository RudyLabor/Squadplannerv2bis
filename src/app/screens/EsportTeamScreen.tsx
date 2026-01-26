import { ArrowLeft, Trophy, Users, Target, BarChart3, Shield } from 'lucide-react';
import { motion } from 'motion/react';

interface EsportTeamScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function EsportTeamScreen({ onNavigate, showToast }: EsportTeamScreenProps) {
  const team = { name: 'Team Rocket', game: 'Valorant', rank: 'Radiant', members: 7, upcomingMatches: 3 };
  const roster = [
    { name: 'MaxPro', role: 'IGL', rank: 'Radiant', availability: 98 },
    { name: 'SkillGod', role: 'Duelist', rank: 'Immortal 3', availability: 95 },
    { name: 'SupportKing', role: 'Support', rank: 'Immortal 2', availability: 92 },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20">
      <div className="sticky top-0 z-10 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={() => onNavigate?.('home')} className="p-2 hover:bg-[var(--background-elevated)] rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" strokeWidth={2} />
          </button>
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">Équipe Esport</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--error-500)] to-[var(--error-600)] mb-4 shadow-lg">
            <Trophy className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{team.name}</h2>
          <p className="text-[var(--text-secondary)] text-sm">{team.game} • {team.rank}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-[var(--error-50)] to-[var(--warning-50)] rounded-2xl p-5 border-[0.5px] border-[var(--border-medium)]">
          <Shield className="w-8 h-8 text-[var(--error-600)] mb-3" strokeWidth={2} />
          <h3 className="font-semibold text-[var(--text-primary)] mb-1">Mode B2B Activé</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-3">
            Gestion professionnelle d'équipe esport avec analytics avancées
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/60 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-[var(--error-600)]">{team.members}</div>
              <div className="text-xs text-[var(--text-tertiary)]">Joueurs</div>
            </div>
            <div className="bg-white/60 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-[var(--error-600)]">{team.upcomingMatches}</div>
              <div className="text-xs text-[var(--text-tertiary)]">Matchs</div>
            </div>
            <div className="bg-white/60 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-[var(--success-600)]">95%</div>
              <div className="text-xs text-[var(--text-tertiary)]">Dispo</div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3 px-1">
            Roster ({roster.length})
          </h3>
          <div className="space-y-2">
            {roster.map((player, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-medium)] shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)] text-sm">{player.name}</h4>
                    <p className="text-xs text-[var(--text-secondary)]">{player.role} • {player.rank}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-[var(--success-600)]">{player.availability}%</div>
                    <div className="text-xs text-[var(--text-tertiary)]">Dispo</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => onNavigate?.('sessions')} className="py-3 bg-[var(--primary-600)] text-white rounded-xl font-medium hover:bg-[var(--primary-700)] transition-colors">
            Scrims
          </button>
          <button onClick={() => onNavigate?.('tournaments')} className="py-3 bg-white text-[var(--text-primary)] border-[0.5px] border-[var(--border-medium)] rounded-xl font-medium hover:bg-[var(--background-elevated)] transition-colors">
            Tournois
          </button>
        </div>
      </div>
    </div>
  );
}

export default EsportTeamScreen;