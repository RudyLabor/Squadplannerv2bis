import { ArrowLeft, Building2, Users, TrendingUp, BarChart3, Settings } from 'lucide-react';
import { motion } from 'motion/react';

interface OrganizationScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function OrganizationScreen({ onNavigate, showToast }: OrganizationScreenProps) {
  const org = { name: 'Rocket Esports', teams: 5, totalPlayers: 38, avgActivity: 92 };
  const teams = [
    { name: 'Valorant Main', members: 7, activity: 96, status: 'Actif' },
    { name: 'CS2 Pro', members: 6, activity: 94, status: 'Actif' },
    { name: 'Apex Squad', members: 5, activity: 88, status: 'Actif' },
    { name: 'Academy', members: 12, activity: 85, status: 'Formation' },
    { name: 'Content Team', members: 8, activity: 90, status: 'Actif' },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20">
      <div className="sticky top-0 z-10 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={() => onNavigate?.('home')} className="p-2 hover:bg-[var(--background-elevated)] rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" strokeWidth={2} />
          </button>
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">Organisation</h1>
          <button onClick={() => showToast?.('Paramètres', 'info')} className="p-2 hover:bg-[var(--background-elevated)] rounded-xl transition-colors">
            <Settings className="w-5 h-5 text-[var(--text-tertiary)]" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--error-500)] to-[var(--warning-500)] mb-4 shadow-lg">
            <Building2 className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{org.name}</h2>
          <p className="text-[var(--text-secondary)] text-sm">Organisation Esport B2B</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-[var(--error-50)] to-[var(--warning-50)] rounded-2xl p-5 border-[0.5px] border-[var(--border-medium)]">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--error-600)]">{org.teams}</div>
              <div className="text-xs text-[var(--text-tertiary)]">Équipes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--error-600)]">{org.totalPlayers}</div>
              <div className="text-xs text-[var(--text-tertiary)]">Joueurs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--success-600)]">{org.avgActivity}%</div>
              <div className="text-xs text-[var(--text-tertiary)]">Activité</div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3 px-1">
            Équipes ({teams.length})
          </h3>
          <div className="space-y-3">
            {teams.map((team, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }} className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-medium)] shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)]">{team.name}</h4>
                    <p className="text-xs text-[var(--text-secondary)]">{team.members} membres • {team.status}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${team.activity >= 90 ? 'bg-[var(--success-50)] text-[var(--success-700)]' : 'bg-[var(--warning-50)] text-[var(--warning-700)]'}`}>
                    {team.activity}%
                  </span>
                </div>
                <button onClick={() => onNavigate?.('esport-team')} className="w-full py-2 bg-[var(--background)] text-[var(--text-primary)] rounded-lg text-sm font-medium hover:bg-[var(--background-elevated)] transition-colors">
                  Gérer l'équipe
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="grid grid-cols-2 gap-3">
          <button onClick={() => onNavigate?.('advanced-stats')} className="flex flex-col items-center gap-2 py-4 bg-white rounded-xl border-[0.5px] border-[var(--border-medium)] hover:bg-[var(--background-elevated)] transition-colors">
            <BarChart3 className="w-6 h-6 text-[var(--primary-500)]" strokeWidth={2} />
            <span className="text-sm font-medium text-[var(--text-primary)]">Analytics</span>
          </button>
          <button onClick={() => onNavigate?.('academy')} className="flex flex-col items-center gap-2 py-4 bg-white rounded-xl border-[0.5px] border-[var(--border-medium)] hover:bg-[var(--background-elevated)] transition-colors">
            <Users className="w-6 h-6 text-[var(--secondary-500)]" strokeWidth={2} />
            <span className="text-sm font-medium text-[var(--text-primary)]">Académie</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default OrganizationScreen;
