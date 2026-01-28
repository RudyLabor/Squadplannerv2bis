import { ArrowLeft, GitBranch, GitMerge, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SquadManagementScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function SquadManagementScreen({ onNavigate, showToast }: SquadManagementScreenProps) {
  const squads = [
    { name: 'Squad Alpha', members: 6, activity: 'Élevée', color: 'primary' },
    { name: 'Squad Beta', members: 8, activity: 'Moyenne', color: 'secondary' },
    { name: 'Squad Gamma', members: 4, activity: 'Faible', color: 'warning' },
  ];

  const recommendations = [
    {
      type: 'split',
      title: 'Diviser Squad Beta',
      reason: 'Trop de membres (8), créer deux squads de 4',
      impact: '+30% engagement',
      icon: GitBranch,
    },
    {
      type: 'merge',
      title: 'Fusionner Squad Gamma',
      reason: 'Activité faible, fusionner avec Squad Alpha',
      impact: '+15% fiabilité',
      icon: GitMerge,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20">
      <div className="sticky top-0 z-10 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => onNavigate?.('intelligence')}
            className="p-2 hover:bg-[var(--background-elevated)] rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" strokeWidth={2} />
          </button>
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">Gestion Squads</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] mb-4 shadow-lg">
            <Users className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Split & Merge</h2>
          <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto">
            Optimisez la structure de vos squads avec l'IA
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3 px-1">
            Vos squads ({squads.length})
          </h3>
          <div className="space-y-3">
            {squads.map((squad, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-medium)] shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)]">{squad.name}</h4>
                    <p className="text-sm text-[var(--text-secondary)]">{squad.members} membres • Activité {squad.activity}</p>
                  </div>
                  <button onClick={() => onNavigate?.('squad-detail')} className="px-3 py-1.5 bg-[var(--background)] rounded-lg text-xs font-medium hover:bg-[var(--background-elevated)] transition-colors">
                    Voir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3 px-1">
            Recommandations IA
          </h3>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-gradient-to-br from-[var(--warning-50)] to-[var(--warning-100)] rounded-2xl p-4 border-[0.5px] border-[var(--warning-200)]">
                <div className="flex items-start gap-3 mb-3">
                  <rec.icon className="w-5 h-5 text-[var(--warning-600)] flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-1">{rec.title}</h4>
                    <p className="text-sm text-[var(--text-secondary)] mb-2">{rec.reason}</p>
                    <span className="px-2 py-1 bg-white text-[var(--warning-700)] text-xs font-medium rounded-lg">
                      {rec.impact}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => showToast?.('Recommandation appliquée !', 'success')}
                  className="w-full py-2 bg-white text-[var(--text-primary)] rounded-xl text-sm font-medium hover:bg-white/90 transition-colors shadow-sm"
                >
                  Appliquer
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default SquadManagementScreen;
