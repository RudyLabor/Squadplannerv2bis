import { ArrowLeft, Users, TrendingUp, AlertTriangle, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface SquadCompositionScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function SquadCompositionScreen({ onNavigate, showToast }: SquadCompositionScreenProps) {
  const currentComposition = [
    { name: 'MaxGamer', role: 'Leader', reliability: 98, synergy: 95, avatar: '👑' },
    { name: 'SaraPlays', role: 'Support', reliability: 92, synergy: 88, avatar: '🎮' },
    { name: 'NoobMaster', role: 'Member', reliability: 65, synergy: 45, avatar: '🎯' },
    { name: 'ProGamer42', role: 'Member', reliability: 88, synergy: 78, avatar: '⚡' },
  ];

  const recommendations = [
    {
      type: 'replace',
      title: 'Remplacer un membre peu fiable',
      description: 'NoobMaster a 35% de no-shows. Remplacez-le pour améliorer la cohésion.',
      impact: '+25% fiabilité',
      severity: 'high',
      icon: AlertTriangle,
      color: 'error',
    },
    {
      type: 'prediction',
      title: 'Prédiction de no-show',
      description: 'IA détecte 72% de risque d\'absence de ProGamer42 pour les sessions du jeudi.',
      impact: 'Risque élevé',
      severity: 'high',
      icon: AlertTriangle,
      color: 'warning',
    },
    {
      type: 'add',
      title: 'Ajouter un membre',
      description: 'Votre squad serait plus efficace avec 5-6 membres actifs.',
      impact: '+15% régularité',
      severity: 'medium',
      icon: Users,
      color: 'warning',
    },
    {
      type: 'optimize',
      title: 'Optimiser les rôles',
      description: 'La répartition des rôles pourrait être améliorée pour plus de synergie.',
      impact: '+10% performance',
      severity: 'low',
      icon: TrendingUp,
      color: 'secondary',
    },
  ];

  const suggestedPlayers = [
    {
      name: 'EliteGamer',
      reliability: 96,
      matchScore: 92,
      commonGames: ['Valorant', 'CS2'],
      avatar: '🌟',
      timezone: 'UTC+1',
    },
    {
      name: 'SkillMaster',
      reliability: 94,
      matchScore: 88,
      commonGames: ['Valorant'],
      avatar: '🔥',
      timezone: 'UTC+1',
    },
    {
      name: 'TeamPlayer99',
      reliability: 91,
      matchScore: 85,
      commonGames: ['Valorant', 'Apex'],
      avatar: '💎',
      timezone: 'UTC+2',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => onNavigate?.('intelligence')}
            className="p-2 hover:bg-[var(--background-elevated)] rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" strokeWidth={2} />
          </button>
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">Composition Optimale</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] mb-4 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            IA de Composition
          </h2>
          <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto">
            Analysez et optimisez la composition de votre squad
          </p>
        </motion.div>

        {/* Squad Health Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[var(--success-50)] to-[var(--secondary-50)] rounded-2xl p-6 border-[0.5px] border-[var(--border-medium)] text-center"
        >
          <div className="text-5xl font-bold text-[var(--success-700)] mb-2">
            78/100
          </div>
          <div className="text-sm text-[var(--text-secondary)] mb-4">
            Score de composition globale
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-[var(--success-700)]">
            <TrendingUp className="w-4 h-4" strokeWidth={2} />
            <span>+12 points possibles avec optimisation</span>
          </div>
        </motion.div>

        {/* Current Composition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3 px-1">
            Composition actuelle
          </h3>
          <div className="space-y-2">
            {currentComposition.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-medium)] shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] flex items-center justify-center text-lg shadow-sm">
                    {member.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-semibold text-[var(--text-primary)] text-sm">
                        {member.name}
                      </h4>
                      <span className="px-2 py-0.5 bg-[var(--background)] text-[var(--text-tertiary)] text-xs rounded-lg">
                        {member.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-[var(--text-tertiary)]">Fiabilité:</span>
                        <span className={`font-semibold ${member.reliability >= 90 ? 'text-[var(--success-600)]' : member.reliability >= 70 ? 'text-[var(--warning-600)]' : 'text-[var(--error-600)]'}`}>
                          {member.reliability}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[var(--text-tertiary)]">Synergie:</span>
                        <span className={`font-semibold ${member.synergy >= 80 ? 'text-[var(--success-600)]' : member.synergy >= 60 ? 'text-[var(--warning-600)]' : 'text-[var(--error-600)]'}`}>
                          {member.synergy}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3 px-1">
            Recommandations IA
          </h3>
          <div className="space-y-3">
            {recommendations.map((rec, index) => {
              const colorMap = {
                error: 'from-[var(--error-50)] to-[var(--error-100)] border-[var(--error-200)]',
                warning: 'from-[var(--warning-50)] to-[var(--warning-100)] border-[var(--warning-200)]',
                secondary: 'from-[var(--secondary-50)] to-[var(--secondary-100)] border-[var(--secondary-200)]',
              };
              const iconColorMap = {
                error: 'text-[var(--error-600)]',
                warning: 'text-[var(--warning-600)]',
                secondary: 'text-[var(--secondary-600)]',
              };

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className={`bg-gradient-to-br ${colorMap[rec.color as keyof typeof colorMap]} rounded-2xl p-4 border-[0.5px]`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <rec.icon
                      className={`w-5 h-5 ${iconColorMap[rec.color as keyof typeof iconColorMap]} flex-shrink-0 mt-0.5`}
                      strokeWidth={2}
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-[var(--text-primary)] text-sm mb-1">
                        {rec.title}
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)] mb-2">
                        {rec.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-white/60 text-[var(--text-primary)] text-xs font-medium rounded-lg">
                          {rec.impact}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast?.('Recommandation appliquée !', 'success')}
                    className="w-full py-2 bg-white text-[var(--text-primary)] rounded-xl text-sm font-medium hover:bg-white/90 transition-colors shadow-sm"
                  >
                    Appliquer cette recommandation
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Suggested Players */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3 px-1">
            Joueurs suggérés
          </h3>
          <div className="space-y-3">
            {suggestedPlayers.map((player, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.05 }}
                className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-medium)] shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] flex items-center justify-center text-xl shadow-sm">
                    {player.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-[var(--text-primary)] text-sm">
                        {player.name}
                      </h4>
                      <span className="px-2 py-0.5 bg-[var(--success-50)] text-[var(--success-700)] text-xs font-medium rounded-lg">
                        {player.matchScore}% match
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                      <span>Fiabilité: {player.reliability}%</span>
                      <span>•</span>
                      <span>{player.timezone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {player.commonGames.map((game, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-[var(--primary-50)] text-[var(--primary-700)] text-xs rounded-lg"
                    >
                      {game}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => showToast?.(`Invitation envoyée à ${player.name}`, 'success')}
                    className="flex-1 py-2 bg-[var(--primary-600)] text-white rounded-xl text-sm font-medium hover:bg-[var(--primary-700)] transition-colors"
                  >
                    Inviter
                  </button>
                  <button
                    onClick={() => onNavigate?.('public-profile', { userId: player.name })}
                    className="px-3 py-2 bg-[var(--background)] text-[var(--text-primary)] rounded-xl text-sm font-medium hover:bg-[var(--background-elevated)] transition-colors"
                  >
                    Profil
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center py-6"
        >
          <button
            onClick={() => onNavigate?.('search-players')}
            className="px-6 py-3 bg-white text-[var(--text-primary)] rounded-xl font-medium border-[0.5px] border-[var(--border-medium)] hover:bg-[var(--background-elevated)] transition-colors shadow-sm"
          >
            Rechercher plus de joueurs
          </button>
        </motion.div>
      </div>
    </div>
  );
}