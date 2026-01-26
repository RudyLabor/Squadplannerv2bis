import { motion } from 'motion/react';
import { Trophy, TrendingUp, TrendingDown, Award, AlertTriangle, CheckCircle2, XCircle, Clock, Flame } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: 'trophy' | 'flame' | 'award' | 'check';
  color: string;
  earned: boolean;
  progress?: number;
}

interface ReliabilityStats {
  score: number;
  trend: 'up' | 'down' | 'stable';
  totalSessions: number;
  attended: number;
  noShows: number;
  lastMinuteCancels: number;
  streak: number;
  avgResponseTime: string;
  badges: Badge[];
}

interface ReliabilityProfileProps {
  stats: ReliabilityStats;
  compact?: boolean;
  showBadges?: boolean;
}

export function ReliabilityProfile({ 
  stats, 
  compact = false,
  showBadges = true 
}: ReliabilityProfileProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 95) return 'Exemplaire';
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Très fiable';
    if (score >= 70) return 'Fiable';
    if (score >= 60) return 'Correct';
    return 'À améliorer';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4" strokeWidth={2} />;
      case 'down': return <TrendingDown className="w-4 h-4" strokeWidth={2} />;
      default: return <div className="w-4 h-1 rounded-full bg-current" />;
    }
  };

  const scoreColor = getScoreColor(stats.score);
  const attendanceRate = Math.round((stats.attended / stats.totalSessions) * 100);
  const noShowRate = Math.round((stats.noShows / stats.totalSessions) * 100);

  if (compact) {
    return (
      <div className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-xs text-[var(--fg-tertiary)] font-medium mb-1">
              Score de fiabilité
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-3xl font-bold text-[var(--${scoreColor}-600)]`}>
                {stats.score}
              </span>
              <span className={`text-sm font-medium text-[var(--${scoreColor}-600)]`}>
                {getScoreLabel(stats.score)}
              </span>
            </div>
          </div>
          <div className={`flex items-center gap-1 text-[var(--${scoreColor}-600)]`}>
            {getTrendIcon(stats.trend)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Score Card */}
      <div className={`bg-gradient-to-br from-[var(--${scoreColor}-50)] to-[var(--${scoreColor}-100)] rounded-3xl p-6 border-[0.5px] border-[var(--${scoreColor}-200)]`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className={`text-sm text-[var(--${scoreColor}-700)] font-semibold mb-2 flex items-center gap-2`}>
              <Trophy className="w-4 h-4" strokeWidth={2} />
              Score de Fiabilité
            </div>
            <div className="flex items-baseline gap-3">
              <span className={`text-5xl font-bold text-[var(--${scoreColor}-700)] tracking-tight`}>
                {stats.score}
              </span>
              <span className={`text-lg font-semibold text-[var(--${scoreColor}-600)]`}>
                {getScoreLabel(stats.score)}
              </span>
            </div>
          </div>
          
          <motion.div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--${scoreColor}-200)] text-[var(--${scoreColor}-700)]`}
            whileHover={{ scale: 1.05 }}
          >
            {getTrendIcon(stats.trend)}
            <span className="text-sm font-bold">
              {stats.trend === 'up' ? '+3' : stats.trend === 'down' ? '-2' : '0'}
            </span>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-white/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.score}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--${scoreColor}-500)] to-[var(--${scoreColor}-600)] rounded-full`}
          />
        </div>
      </div>

      {/* Streak Card */}
      {stats.streak > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[var(--warning-50)] to-[var(--warning-100)] rounded-2xl p-5 border-[0.5px] border-[var(--warning-200)]"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--warning-500)] flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold text-[var(--warning-700)] mb-0.5">
                {stats.streak} sessions d'affilée
              </div>
              <div className="text-xs text-[var(--warning-600)] font-medium">
                Continuez comme ça ! 🔥
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Attendance */}
        <div className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-[var(--success-500)] mb-2" strokeWidth={2} />
          <div className="text-2xl font-bold text-[var(--fg-primary)] mb-1">
            {attendanceRate}%
          </div>
          <div className="text-xs text-[var(--fg-tertiary)] font-medium">
            Présence
          </div>
          <div className="text-xs text-[var(--fg-tertiary)] mt-1">
            {stats.attended}/{stats.totalSessions} sessions
          </div>
        </div>

        {/* No-shows */}
        <div className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
          <XCircle className="w-5 h-5 text-[var(--error-500)] mb-2" strokeWidth={2} />
          <div className="text-2xl font-bold text-[var(--fg-primary)] mb-1">
            {noShowRate}%
          </div>
          <div className="text-xs text-[var(--fg-tertiary)] font-medium">
            No-shows
          </div>
          <div className="text-xs text-[var(--fg-tertiary)] mt-1">
            {stats.noShows} absences
          </div>
        </div>

        {/* Last minute cancels */}
        <div className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
          <AlertTriangle className="w-5 h-5 text-[var(--warning-500)] mb-2" strokeWidth={2} />
          <div className="text-2xl font-bold text-[var(--fg-primary)] mb-1">
            {stats.lastMinuteCancels}
          </div>
          <div className="text-xs text-[var(--fg-tertiary)] font-medium">
            Annulations tardives
          </div>
        </div>

        {/* Response time */}
        <div className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
          <Clock className="w-5 h-5 text-[var(--primary-500)] mb-2" strokeWidth={2} />
          <div className="text-2xl font-bold text-[var(--fg-primary)] mb-1">
            {stats.avgResponseTime}
          </div>
          <div className="text-xs text-[var(--fg-tertiary)] font-medium">
            Temps de réponse
          </div>
        </div>
      </div>

      {/* Badges */}
      {showBadges && stats.badges.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-[var(--primary-500)]" strokeWidth={2} />
            <h3 className="text-base font-semibold text-[var(--fg-primary)]">
              Badges
            </h3>
            <span className="text-xs text-[var(--fg-tertiary)] font-medium">
              {stats.badges.filter(b => b.earned).length}/{stats.badges.length}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {stats.badges.map((badge) => {
              const BadgeIcon = getBadgeIcon(badge.icon);
              
              return (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: badge.earned ? 1.05 : 1 }}
                  className={`
                    rounded-xl p-3 border-[0.5px] transition-all
                    ${badge.earned 
                      ? `bg-gradient-to-br ${badge.color} border-transparent shadow-sm` 
                      : 'bg-[var(--bg-tertiary)] border-[var(--border-subtle)] opacity-50'
                    }
                  `}
                >
                  <BadgeIcon 
                    className={`w-6 h-6 mb-2 ${badge.earned ? 'text-white' : 'text-[var(--fg-tertiary)]'}`}
                    strokeWidth={2}
                  />
                  <div className={`text-sm font-bold mb-1 ${badge.earned ? 'text-white' : 'text-[var(--fg-tertiary)]'}`}>
                    {badge.name}
                  </div>
                  <div className={`text-xs ${badge.earned ? 'text-white/80' : 'text-[var(--fg-tertiary)]'}`}>
                    {badge.description}
                  </div>
                  
                  {!badge.earned && badge.progress !== undefined && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-[var(--border-medium)] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[var(--primary-500)] rounded-full"
                          style={{ width: `${badge.progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-[var(--fg-tertiary)] mt-1">
                        {badge.progress}%
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Warning if score is low */}
      {stats.score < 70 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[var(--error-50)] rounded-2xl p-4 border-[0.5px] border-[var(--error-200)]"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[var(--error-600)] flex-shrink-0 mt-0.5" strokeWidth={2} />
            <div className="flex-1">
              <div className="text-sm font-semibold text-[var(--error-700)] mb-1">
                Attention à votre fiabilité
              </div>
              <div className="text-xs text-[var(--error-600)] leading-relaxed">
                Votre score est en baisse. Pensez à confirmer vos présences et à prévenir en cas d'absence.
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function getBadgeIcon(type: string) {
  switch (type) {
    case 'trophy': return Trophy;
    case 'flame': return Flame;
    case 'award': return Award;
    case 'check': return CheckCircle2;
    default: return Award;
  }
}

// Mock data generator
export function generateMockReliabilityStats(): ReliabilityStats {
  return {
    score: 94,
    trend: 'up',
    totalSessions: 47,
    attended: 44,
    noShows: 2,
    lastMinuteCancels: 1,
    streak: 8,
    avgResponseTime: '2h',
    badges: [
      {
        id: 'perfect-week',
        name: 'Semaine parfaite',
        description: '7 jours sans absence',
        icon: 'trophy',
        color: 'from-[var(--primary-500)] to-[var(--primary-600)]',
        earned: true,
      },
      {
        id: 'on-fire',
        name: 'En feu',
        description: '10 sessions d\'affilée',
        icon: 'flame',
        color: 'from-[var(--warning-500)] to-[var(--warning-600)]',
        earned: true,
        progress: 80,
      },
      {
        id: 'reliable',
        name: 'Ultra fiable',
        description: '95% de présence',
        icon: 'check',
        color: 'from-[var(--success-500)] to-[var(--success-600)]',
        earned: false,
        progress: 94,
      },
      {
        id: 'fast-responder',
        name: 'Réactif',
        description: 'Réponse < 1h',
        icon: 'award',
        color: 'from-[var(--secondary-500)] to-[var(--secondary-600)]',
        earned: true,
      },
    ],
  };
}
