import { ArrowLeft, Crown, TrendingUp, Users, Target, Star, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface LeadershipAnalysisScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function LeadershipAnalysisScreen({ onNavigate, showToast }: LeadershipAnalysisScreenProps) {
  const leaders = [
    {
      name: 'MaxGamer',
      avatar: '👑',
      leadershipScore: 96,
      qualities: ['Organisateur', 'Motivateur', 'Décideur'],
      stats: {
        sessionsOrganized: 45,
        participationRate: 98,
        teamSatisfaction: 94,
      },
      trend: '+12%',
    },
    {
      name: 'SaraPlays',
      avatar: '🎮',
      leadershipScore: 88,
      qualities: ['Support', 'Médiateur', 'Communicateur'],
      stats: {
        sessionsOrganized: 28,
        participationRate: 95,
        teamSatisfaction: 91,
      },
      trend: '+8%',
    },
  ];

  const potentialLeaders = [
    { name: 'ProGamer42', avatar: '⚡', score: 72, potential: 'Élevé', reason: 'Forte implication récente' },
    { name: 'SkillMaster', avatar: '🔥', score: 68, potential: 'Moyen', reason: 'Bonne communication' },
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
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">Analyse Leadership</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--warning-500)] to-[var(--warning-600)] mb-4 shadow-lg">
            <Crown className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Leaders Naturels
          </h2>
          <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto">
            IA détection des profils de leadership dans votre squad
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3 px-1">
            Leaders actifs ({leaders.length})
          </h3>
          <div className="space-y-4">
            {leaders.map((leader, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="bg-gradient-to-br from-[var(--warning-50)] to-[var(--warning-100)] rounded-2xl p-5 border-[0.5px] border-[var(--warning-200)] shadow-sm"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--warning-500)] to-[var(--warning-600)] flex items-center justify-center text-2xl shadow-md">
                    {leader.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-[var(--text-primary)]">{leader.name}</h4>
                      <span className="px-2 py-1 bg-white text-[var(--warning-700)] text-xs font-bold rounded-lg">
                        {leader.leadershipScore}/100
                      </span>
                      <span className="text-xs text-[var(--success-600)] font-semibold flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {leader.trend}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {leader.qualities.map((quality, idx) => (
                        <span key={idx} className="px-2 py-1 bg-white text-[var(--warning-700)] text-xs font-medium rounded-lg">
                          {quality}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 bg-white/60 rounded-xl p-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-[var(--warning-700)]">{leader.stats.sessionsOrganized}</div>
                    <div className="text-xs text-[var(--text-tertiary)]">Sessions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-[var(--warning-700)]">{leader.stats.participationRate}%</div>
                    <div className="text-xs text-[var(--text-tertiary)]">Présence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-[var(--warning-700)]">{leader.stats.teamSatisfaction}%</div>
                    <div className="text-xs text-[var(--text-tertiary)]">Satisfaction</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3 px-1">
            Potentiels leaders
          </h3>
          <div className="space-y-3">
            {potentialLeaders.map((player, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-medium)] shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] flex items-center justify-center text-xl">
                    {player.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-[var(--text-primary)] text-sm">{player.name}</h4>
                      <span className="px-2 py-0.5 bg-[var(--secondary-50)] text-[var(--secondary-700)] text-xs font-medium rounded-lg">
                        {player.potential}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mb-1">{player.reason}</p>
                    <div className="text-xs text-[var(--text-tertiary)]">Score: {player.score}/100</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-[var(--primary-50)] to-[var(--secondary-50)] rounded-2xl p-5 text-center"
        >
          <Award className="w-10 h-10 text-[var(--primary-600)] mx-auto mb-3" strokeWidth={2} />
          <h3 className="font-semibold text-[var(--text-primary)] mb-2">Développez vos leaders</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Accédez à des outils de coaching pour développer les compétences de leadership
          </p>
          <button
            onClick={() => onNavigate?.('coaching-tools')}
            className="px-5 py-2.5 bg-[var(--primary-600)] text-white rounded-xl text-sm font-medium hover:bg-[var(--primary-700)] transition-colors"
          >
            Voir les outils de coaching
          </button>
        </motion.div>
      </div>
    </div>
  );
}
