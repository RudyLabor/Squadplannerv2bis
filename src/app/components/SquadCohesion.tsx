import { motion } from 'framer-motion';
import { Users, TrendingUp, AlertCircle, CheckCircle2, Clock, Zap, Heart, UserX } from 'lucide-react';

interface SquadMember {
  id: string;
  name: string;
  avatar?: string;
  reliabilityScore: number;
  sessionsAttended: number;
  totalSessions: number;
  lastActive: string;
  status: 'active' | 'warning' | 'inactive';
}

interface CohesionMetrics {
  score: number; // 0-100
  stability: number; // 0-100
  avgAttendance: number; // 0-100
  activeMembers: number;
  inactiveMembers: number;
  avgReliability: number;
  trend: 'up' | 'down' | 'stable';
  recommendations: Recommendation[];
}

interface Recommendation {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  description: string;
  action?: string;
  actionType?: 'remove' | 'invite' | 'schedule';
}

interface SquadCohesionProps {
  squadId: string;
  squadName: string;
  members: SquadMember[];
  metrics: CohesionMetrics;
  onActionClick?: (action: string, data?: any) => void;
}

export function SquadCohesion({ 
  members, 
  metrics,
  onActionClick 
}: SquadCohesionProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellente';
    if (score >= 80) return 'Très bonne';
    if (score >= 70) return 'Bonne';
    if (score >= 60) return 'Correcte';
    return 'Fragile';
  };

  const getMemberStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'warning': return 'warning';
      case 'inactive': return 'error';
      default: return 'tertiary';
    }
  };

  const cohesionColor = getScoreColor(metrics.score);
  const stabilityColor = getScoreColor(metrics.stability);

  return (
    <div className="space-y-4">
      {/* Main Cohesion Score */}
      <div className={`bg-gradient-to-br from-[var(--${cohesionColor}-50)] to-[var(--${cohesionColor}-100)] rounded-3xl p-6 border-[0.5px] border-[var(--${cohesionColor}-200)]`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className={`text-sm text-[var(--${cohesionColor}-700)] font-semibold mb-2 flex items-center gap-2`}>
              <Heart className="w-4 h-4" strokeWidth={2} />
              Cohésion de Squad
            </div>
            <div className="flex items-baseline gap-3">
              <span className={`text-5xl font-bold text-[var(--${cohesionColor}-700)] tracking-tight`}>
                {metrics.score}
              </span>
              <span className={`text-lg font-semibold text-[var(--${cohesionColor}-600)]`}>
                {getScoreLabel(metrics.score)}
              </span>
            </div>
          </div>
          
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--${cohesionColor}-200)] text-[var(--${cohesionColor}-700)]`}>
            {metrics.trend === 'up' ? (
              <TrendingUp className="w-4 h-4" strokeWidth={2} />
            ) : metrics.trend === 'down' ? (
              <AlertCircle className="w-4 h-4" strokeWidth={2} />
            ) : (
              <div className="w-4 h-1 rounded-full bg-current" />
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="relative h-3 bg-white/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${metrics.score}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--${cohesionColor}-500)] to-[var(--${cohesionColor}-600)] rounded-full`}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
          <Zap className={`w-5 h-5 text-[var(--${stabilityColor}-500)] mb-2`} strokeWidth={2} />
          <div className="text-2xl font-bold text-[var(--fg-primary)] mb-1">
            {metrics.stability}%
          </div>
          <div className="text-xs text-[var(--fg-tertiary)] font-medium">
            Stabilité
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-[var(--success-500)] mb-2" strokeWidth={2} />
          <div className="text-2xl font-bold text-[var(--fg-primary)] mb-1">
            {metrics.avgAttendance}%
          </div>
          <div className="text-xs text-[var(--fg-tertiary)] font-medium">
            Présence moyenne
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
          <Users className="w-5 h-5 text-[var(--primary-500)] mb-2" strokeWidth={2} />
          <div className="text-2xl font-bold text-[var(--fg-primary)] mb-1">
            {metrics.activeMembers}/{members.length}
          </div>
          <div className="text-xs text-[var(--fg-tertiary)] font-medium">
            Membres actifs
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
          <div className="text-xs text-[var(--fg-tertiary)] font-medium">
            Fiabilité moyenne
          </div>
        </div>
      </div>

      {/* Members Status */}
      <div className="bg-white rounded-2xl p-5 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-[var(--fg-primary)] flex items-center gap-2">
            <Users className="w-5 h-5 text-[var(--primary-500)]" strokeWidth={2} />
            Membres ({members.length})
          </h3>
          {metrics.inactiveMembers > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--error-50)] border-[0.5px] border-[var(--error-200)]">
              <UserX className="w-3.5 h-3.5 text-[var(--error-600)]" strokeWidth={2} />
              <span className="text-xs font-semibold text-[var(--error-600)]">
                {metrics.inactiveMembers} inactif{metrics.inactiveMembers > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {members.map((member) => {
            const statusColor = getMemberStatusColor(member.status);
            const attendanceRate = Math.round((member.sessionsAttended / member.totalSessions) * 100);

            return (
              <motion.div
                key={member.id}
                whileHover={{ scale: 1.01 }}
                className={`
                  flex items-center gap-3 p-3 rounded-xl border-[0.5px] transition-all
                  ${member.status === 'inactive' 
                    ? 'bg-[var(--bg-tertiary)] border-[var(--border-medium)] opacity-60'
                    : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-medium)]'
                  }
                `}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-400)] to-[var(--primary-600)] flex items-center justify-center text-white font-bold text-sm">
                    {member.name[0]}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-md bg-[var(--${statusColor}-500)] border-2 border-white`} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="text-sm font-semibold text-[var(--fg-primary)] truncate">
                      {member.name}
                    </div>
                    <div className={`px-2 py-0.5 rounded-md bg-[var(--${statusColor}-100)] text-[var(--${statusColor}-700)] text-xs font-bold`}>
                      {member.reliabilityScore}%
                    </div>
                  </div>
                  <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                    {attendanceRate}% présence • {member.sessionsAttended}/{member.totalSessions} sessions
                  </div>
                </div>

                {/* Last active */}
                <div className="text-xs text-[var(--fg-tertiary)] font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" strokeWidth={2} />
                  {member.lastActive}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      {metrics.recommendations.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[var(--fg-secondary)] px-1">
            Recommandations
          </h3>
          
          {metrics.recommendations.map((rec) => {
            const getIconByType = () => {
              switch (rec.type) {
                case 'warning': return AlertCircle;
                case 'success': return CheckCircle2;
                default: return TrendingUp;
              }
            };

            const Icon = getIconByType();
            const colorMap = {
              warning: 'warning',
              error: 'error',
              success: 'success',
              info: 'primary',
            };
            const color = colorMap[rec.type] || 'primary';

            return (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`bg-[var(--${color}-50)] rounded-2xl p-4 border-[0.5px] border-[var(--${color}-200)]`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 text-[var(--${color}-600)] flex-shrink-0 mt-0.5`} strokeWidth={2} />
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-bold text-[var(--${color}-700)] mb-1`}>
                      {rec.title}
                    </div>
                    <div className={`text-xs text-[var(--${color}-600)] leading-relaxed mb-3`}>
                      {rec.description}
                    </div>
                    
                    {rec.action && (
                      <button
                        onClick={() => onActionClick?.(rec.actionType || 'info', rec)}
                        className={`
                          px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                          bg-[var(--${color}-600)] text-white
                          hover:bg-[var(--${color}-700)] hover:shadow-md
                        `}
                      >
                        {rec.action}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Mock data generators
export function generateMockCohesionMetrics(): CohesionMetrics {
  return {
    score: 87,
    stability: 82,
    avgAttendance: 89,
    activeMembers: 5,
    inactiveMembers: 1,
    avgReliability: 85,
    trend: 'up',
    recommendations: [
      {
        id: 'inactive-member',
        type: 'warning',
        title: 'Membre inactif détecté',
        description: 'HunterAce n\'a pas participé aux 5 dernières sessions. Peut-être faut-il le contacter ?',
        action: 'Voir le profil',
        actionType: 'remove',
      },
      {
        id: 'best-time',
        type: 'info',
        title: 'Créneau optimal identifié',
        description: 'Mardi 21h a 96% de taux de présence. Pensez à planifier vos sessions principales à ce moment.',
        action: 'Créer une session',
        actionType: 'schedule',
      },
    ],
  };
}

export function generateMockSquadMembers(): SquadMember[] {
  return [
    {
      id: '1',
      name: 'RudyFourcade',
      reliabilityScore: 98,
      sessionsAttended: 47,
      totalSessions: 48,
      lastActive: 'Aujourd\'hui',
      status: 'active',
    },
    {
      id: '2',
      name: 'KANA',
      reliabilityScore: 94,
      sessionsAttended: 42,
      totalSessions: 45,
      lastActive: 'Hier',
      status: 'active',
    },
    {
      id: '3',
      name: 'Maxence',
      reliabilityScore: 91,
      sessionsAttended: 39,
      totalSessions: 43,
      lastActive: 'Il y a 2j',
      status: 'active',
    },
    {
      id: '4',
      name: 'Yuno',
      reliabilityScore: 88,
      sessionsAttended: 35,
      totalSessions: 40,
      lastActive: 'Il y a 3j',
      status: 'warning',
    },
    {
      id: '5',
      name: 'Stérillium',
      reliabilityScore: 85,
      sessionsAttended: 32,
      totalSessions: 38,
      lastActive: 'Il y a 4j',
      status: 'warning',
    },
    {
      id: '6',
      name: 'HunterAce',
      reliabilityScore: 62,
      sessionsAttended: 23,
      totalSessions: 38,
      lastActive: 'Il y a 15j',
      status: 'inactive',
    },
  ];
}
