import { ArrowLeft, Trophy, Users, Calendar, CheckCircle, UserPlus, Star, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface ActivityFeedScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

type ActivityType = 'all' | 'sessions' | 'achievements' | 'social';
type Activity = {
  id: string;
  type: 'session_created' | 'session_completed' | 'achievement_unlocked' | 'squad_joined' | 'friend_added' | 'level_up';
  user: string;
  content: string;
  timestamp: string;
  icon: any;
  color: string;
  bg: string;
};

export function ActivityFeedScreen({ onNavigate, showToast }: ActivityFeedScreenProps) {
  const [activeFilter, setActiveFilter] = useState<ActivityType>('all');

  const activities: Activity[] = [
    {
      id: '1',
      type: 'achievement_unlocked',
      user: 'MaxGaming',
      content: 'a débloqué le trophée "Fiabilité Parfaite"',
      timestamp: 'Il y a 5 minutes',
      icon: Trophy,
      color: 'text-[var(--primary-500)]',
      bg: 'bg-[var(--primary-50)]',
    },
    {
      id: '2',
      type: 'session_created',
      user: 'NightOwl',
      content: 'a créé une session "Ranked Valorant"',
      timestamp: 'Il y a 15 minutes',
      icon: Calendar,
      color: 'text-[var(--secondary-500)]',
      bg: 'bg-[var(--secondary-50)]',
    },
    {
      id: '3',
      type: 'squad_joined',
      user: 'ProPlayer',
      content: 'a rejoint la squad "Warriors"',
      timestamp: 'Il y a 1 heure',
      icon: Users,
      color: 'text-[var(--primary-500)]',
      bg: 'bg-[var(--primary-50)]',
    },
    {
      id: '4',
      type: 'session_completed',
      user: 'ShadowKing',
      content: 'a complété la session "LoL Draft"',
      timestamp: 'Il y a 2 heures',
      icon: CheckCircle,
      color: 'text-[var(--success-500)]',
      bg: 'bg-[var(--success-50)]',
    },
    {
      id: '5',
      type: 'level_up',
      user: 'DragonSlayer',
      content: 'est maintenant niveau 25',
      timestamp: 'Il y a 3 heures',
      icon: TrendingUp,
      color: 'text-[var(--primary-500)]',
      bg: 'bg-[var(--primary-50)]',
    },
    {
      id: '6',
      type: 'friend_added',
      user: 'IceQueen',
      content: 'et ThunderBolt sont maintenant amis',
      timestamp: 'Il y a 4 heures',
      icon: UserPlus,
      color: 'text-[var(--secondary-500)]',
      bg: 'bg-[var(--secondary-50)]',
    },
    {
      id: '7',
      type: 'achievement_unlocked',
      user: 'PhoenixRise',
      content: 'a débloqué "Leader de Squad"',
      timestamp: 'Il y a 5 heures',
      icon: Trophy,
      color: 'text-[var(--primary-500)]',
      bg: 'bg-[var(--primary-50)]',
    },
    {
      id: '8',
      type: 'session_created',
      user: 'Toi',
      content: 'as proposé une session "CS2 Casual"',
      timestamp: 'Il y a 1 jour',
      icon: Calendar,
      color: 'text-[var(--secondary-500)]',
      bg: 'bg-[var(--secondary-50)]',
    },
  ];

  const filters: { key: ActivityType; label: string; icon: any }[] = [
    { key: 'all', label: 'Tout', icon: Star },
    { key: 'sessions', label: 'Sessions', icon: Calendar },
    { key: 'achievements', label: 'Trophées', icon: Trophy },
    { key: 'social', label: 'Social', icon: Users },
  ];

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
          <div>
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
              Activité
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] font-medium mt-1">
              Ce qui se passe dans ta communauté
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeFilter === filter.key
                    ? 'bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white shadow-lg shadow-[var(--primary-500)]/20'
                    : 'bg-white text-[var(--fg-secondary)] border-[0.5px] border-[var(--border-subtle)] hover:border-[var(--border-medium)]'
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={2} />
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Activity Feed */}
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl ${activity.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${activity.color}`} strokeWidth={2} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[var(--fg-primary)] mb-1">
                      <span className="font-semibold">{activity.user}</span>
                      {' '}
                      <span className="text-[var(--fg-secondary)]">{activity.content}</span>
                    </div>
                    <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                      {activity.timestamp}
                    </div>
                  </div>

                  {/* User Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {activity.user[0]}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Load More */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => showToast('Chargement...', 'info')}
          className="w-full mt-6 h-12 rounded-xl bg-white border-[0.5px] border-[var(--border-subtle)] text-[var(--fg-secondary)] font-semibold text-sm hover:border-[var(--border-medium)] hover:shadow-sm transition-all"
        >
          Voir plus d'activités
        </motion.button>

        {/* Empty State (si besoin) */}
        {activities.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 rounded-2xl bg-[var(--primary-50)] flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-[var(--primary-500)]" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-2">
              Aucune activité récente
            </h3>
            <p className="text-sm text-[var(--fg-tertiary)] font-medium">
              L'activité de tes amis apparaîtra ici
            </p>
          </motion.div>
        )}

      </div>
    </div>
  );
}

export default ActivityFeedScreen;