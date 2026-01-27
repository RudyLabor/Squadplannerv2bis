import { ArrowLeft, Calendar, TrendingUp, Trophy, Clock, Users, Zap, Award, Star, Target, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/app/components/ui/button';
import CountUp from 'react-countup';

interface WeeklyRecapScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

interface WeekStats {
  period: string;
  sessionsPlanned: number;
  sessionsCompleted: number;
  totalHours: number;
  avgAttendance: number;
  bestDay: string;
  bestSquad: string;
  mvpPlayer: string;
  streakDays: number;
  improvements: {
    attendance: number;
    response: number;
    punctuality: number;
  };
  highlights: string[];
}

export function WeeklyRecapScreen({ onNavigate, showToast }: WeeklyRecapScreenProps) {
  // Mock data - en production cela viendrait du backend
  const currentWeek: WeekStats = {
    period: '20-26 Janvier 2026',
    sessionsPlanned: 12,
    sessionsCompleted: 11,
    totalHours: 28.5,
    avgAttendance: 94,
    bestDay: 'Mardi',
    bestSquad: 'Les Tryharders',
    mvpPlayer: 'RudyFourcade',
    streakDays: 8,
    improvements: {
      attendance: +5,
      response: +12,
      punctuality: +3,
    },
    highlights: [
      'Meilleure semaine du mois 🔥',
      'Aucune session annulée',
      'Streak de 8 jours maintenu',
      '+5% de taux de présence',
    ],
  };

  const previousWeeks = [
    {
      period: '13-19 Janvier',
      sessionsCompleted: 10,
      avgAttendance: 89,
    },
    {
      period: '6-12 Janvier',
      sessionsCompleted: 9,
      avgAttendance: 87,
    },
    {
      period: '30 Déc - 5 Jan',
      sessionsCompleted: 8,
      avgAttendance: 91,
    },
  ];

  const topPlayers = [
    { name: 'RudyFourcade', sessions: 11, attendance: 100, points: 550 },
    { name: 'KANA', sessions: 10, attendance: 95, points: 520 },
    { name: 'Maxence', sessions: 9, attendance: 90, points: 485 },
  ];

  const handleShare = () => {
    showToast('Récap partagé avec votre squad !', 'success');
  };

  const completionRate = Math.round((currentWeek.sessionsCompleted / currentWeek.sessionsPlanned) * 100);

  return (
    <div className="min-h-screen pb-24 pt-safe">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[var(--primary-500)]" strokeWidth={2} />
              Récap Hebdo
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] font-medium">
              {currentWeek.period}
            </p>
          </div>
          <button
            onClick={handleShare}
            className="w-12 h-12 rounded-2xl bg-[var(--primary-50)] border-[0.5px] border-[var(--primary-200)] flex items-center justify-center hover:bg-[var(--primary-100)] transition-all"
          >
            <Share2 className="w-5 h-5 text-[var(--primary-600)]" strokeWidth={2} />
          </button>
        </div>

        {/* Hero Card */}
        <div className="bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] rounded-3xl p-6 mb-6 text-white overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="text-sm opacity-80 mb-2">Cette semaine</div>
                <h2 className="text-3xl font-bold mb-1">
                  {currentWeek.highlights[0]}
                </h2>
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="w-4 h-4" strokeWidth={2} />
                  <span>Niveau exceptionnel</span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Trophy className="w-8 h-8" strokeWidth={2} />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="text-2xl font-bold mb-0.5">
                  <CountUp end={currentWeek.sessionsCompleted} duration={1.5} />
                </div>
                <div className="text-xs opacity-80">Sessions</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="text-2xl font-bold mb-0.5">
                  <CountUp end={currentWeek.totalHours} decimals={1} duration={1.5} />h
                </div>
                <div className="text-xs opacity-80">Jouées</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="text-2xl font-bold mb-0.5">
                  <CountUp end={currentWeek.avgAttendance} duration={1.5} />%
                </div>
                <div className="text-xs opacity-80">Présence</div>
              </div>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="bg-white rounded-2xl p-5 mb-6 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-[var(--warning-500)]" strokeWidth={2} fill="var(--warning-500)" />
            <h3 className="text-base font-semibold text-[var(--fg-primary)]">
              Points forts
            </h3>
          </div>
          <div className="space-y-2">
            {currentWeek.highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-[var(--success-50)] border-[0.5px] border-[var(--success-200)]"
              >
                <div className="w-6 h-6 rounded-lg bg-[var(--success-500)] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <span className="text-sm font-semibold text-[var(--success-700)]">
                  {highlight}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Completion Rate */}
          <div className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
            <Target className="w-5 h-5 text-[var(--success-500)] mb-2" strokeWidth={2} />
            <div className="text-2xl font-bold text-[var(--fg-primary)] mb-1">
              <CountUp end={completionRate} duration={1.5} />%
            </div>
            <div className="text-xs text-[var(--fg-tertiary)] font-medium mb-2">
              Taux de complétion
            </div>
            <div className="text-xs text-[var(--fg-tertiary)]">
              {currentWeek.sessionsCompleted}/{currentWeek.sessionsPlanned} sessions
            </div>
          </div>

          {/* Streak */}
          <div className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
            <Zap className="w-5 h-5 text-[var(--warning-500)] mb-2" strokeWidth={2} />
            <div className="text-2xl font-bold text-[var(--fg-primary)] mb-1">
              <CountUp end={currentWeek.streakDays} duration={1.5} />
            </div>
            <div className="text-xs text-[var(--fg-tertiary)] font-medium mb-2">
              Jours de streak
            </div>
            <div className="text-xs text-[var(--success-600)] font-semibold">
              🔥 En progression
            </div>
          </div>

          {/* Best Day */}
          <div className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
            <Calendar className="w-5 h-5 text-[var(--primary-500)] mb-2" strokeWidth={2} />
            <div className="text-2xl font-bold text-[var(--fg-primary)] mb-1">
              {currentWeek.bestDay}
            </div>
            <div className="text-xs text-[var(--fg-tertiary)] font-medium">
              Meilleur jour
            </div>
          </div>

          {/* Best Squad */}
          <div className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
            <Users className="w-5 h-5 text-[var(--secondary-500)] mb-2" strokeWidth={2} />
            <div className="text-base font-bold text-[var(--fg-primary)] mb-1 truncate">
              {currentWeek.bestSquad}
            </div>
            <div className="text-xs text-[var(--fg-tertiary)] font-medium">
              Squad la plus active
            </div>
          </div>
        </div>

        {/* Improvements */}
        <div className="bg-white rounded-2xl p-5 mb-6 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[var(--success-500)]" strokeWidth={2} />
            <h3 className="text-base font-semibold text-[var(--fg-primary)]">
              Évolutions vs semaine dernière
            </h3>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Taux de présence', value: currentWeek.improvements.attendance, icon: Target },
              { label: 'Temps de réponse', value: currentWeek.improvements.response, icon: Clock },
              { label: 'Ponctualité', value: currentWeek.improvements.punctuality, icon: Zap },
            ].map((item, index) => {
              const isPositive = item.value > 0;
              const Icon = item.icon;

              return (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-secondary)]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[var(--primary-50)] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[var(--primary-600)]" strokeWidth={2} />
                    </div>
                    <span className="text-sm font-semibold text-[var(--fg-primary)]">
                      {item.label}
                    </span>
                  </div>
                  <div className={`
                    flex items-center gap-1 px-2 py-1 rounded-lg
                    ${isPositive 
                      ? 'bg-[var(--success-50)] text-[var(--success-700)]' 
                      : 'bg-[var(--error-50)] text-[var(--error-700)]'
                    }
                  `}>
                    <TrendingUp className={`w-3.5 h-3.5 ${!isPositive && 'rotate-180'}`} strokeWidth={2} />
                    <span className="text-sm font-bold">
                      {isPositive ? '+' : ''}{item.value}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Players */}
        <div className="bg-white rounded-2xl p-5 mb-6 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-[var(--warning-500)]" strokeWidth={2} />
            <h3 className="text-base font-semibold text-[var(--fg-primary)]">
              Top joueurs de la semaine
            </h3>
          </div>
          <div className="space-y-2">
            {topPlayers.map((player, index) => (
              <motion.div
                key={player.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  flex items-center gap-3 p-3 rounded-xl
                  ${index === 0 
                    ? 'bg-gradient-to-r from-[var(--warning-50)] to-[var(--warning-100)] border-[0.5px] border-[var(--warning-200)]' 
                    : 'bg-[var(--bg-secondary)]'
                  }
                `}
              >
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
                  ${index === 0 
                    ? 'bg-[var(--warning-500)] text-white' 
                    : index === 1
                    ? 'bg-[var(--border-strong)] text-[var(--fg-primary)]'
                    : 'bg-[var(--border-medium)] text-[var(--fg-secondary)]'
                  }
                `}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-[var(--fg-primary)]">
                    {player.name}
                  </div>
                  <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                    {player.sessions} sessions • {player.attendance}% présence
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-[var(--primary-600)]">
                    {player.points}
                  </div>
                  <div className="text-xs text-[var(--fg-tertiary)]">
                    points
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Previous Weeks */}
        <div className="bg-white rounded-2xl p-5 mb-6 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
          <h3 className="text-base font-semibold text-[var(--fg-primary)] mb-4">
            Semaines précédentes
          </h3>
          <div className="space-y-2">
            {previousWeeks.map((week, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-secondary)]"
              >
                <div>
                  <div className="text-sm font-semibold text-[var(--fg-primary)]">
                    {week.period}
                  </div>
                  <div className="text-xs text-[var(--fg-tertiary)]">
                    {week.sessionsCompleted} sessions
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-[var(--fg-primary)]">
                    {week.avgAttendance}%
                  </div>
                  <div className="text-xs text-[var(--fg-tertiary)]">
                    présence
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            onClick={() => onNavigate('advanced-stats')}
            className="h-12"
          >
            <TrendingUp className="w-4 h-4" strokeWidth={2} />
            Stats complètes
          </Button>
          <Button
            variant="primary"
            onClick={() => onNavigate('propose-session')}
            className="h-12"
          >
            <Zap className="w-4 h-4" strokeWidth={2} />
            Créer une session
          </Button>
        </div>
      </div>
    </div>
  );
}
export default WeeklyRecapScreen;
