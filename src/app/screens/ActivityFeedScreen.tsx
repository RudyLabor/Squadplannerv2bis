import { ArrowLeft, Trophy, Users, Calendar, CheckCircle, UserPlus, Star, Zap, TrendingUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Card, Badge } from '@/design-system';

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
  gradient: string;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export function ActivityFeedScreen({ onNavigate, showToast }: ActivityFeedScreenProps) {
  const [activeFilter, setActiveFilter] = useState<ActivityType>('all');

  const activities: Activity[] = [
    {
      id: '1',
      type: 'achievement_unlocked',
      user: 'MaxGaming',
      content: 'a debloque le trophee "Fiabilite Parfaite"',
      timestamp: 'Il y a 5 minutes',
      icon: Trophy,
      gradient: 'from-[var(--color-warning-500)] to-yellow-500',
    },
    {
      id: '2',
      type: 'session_created',
      user: 'NightOwl',
      content: 'a cree une session "Ranked Valorant"',
      timestamp: 'Il y a 15 minutes',
      icon: Calendar,
      gradient: 'from-[var(--color-primary-500)] to-purple-500',
    },
    {
      id: '3',
      type: 'squad_joined',
      user: 'ProPlayer',
      content: 'a rejoint la squad "Warriors"',
      timestamp: 'Il y a 1 heure',
      icon: Users,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      id: '4',
      type: 'session_completed',
      user: 'ShadowKing',
      content: 'a complete la session "LoL Draft"',
      timestamp: 'Il y a 2 heures',
      icon: CheckCircle,
      gradient: 'from-[var(--color-success-500)] to-teal-500',
    },
    {
      id: '5',
      type: 'level_up',
      user: 'DragonSlayer',
      content: 'est maintenant niveau 25',
      timestamp: 'Il y a 3 heures',
      icon: TrendingUp,
      gradient: 'from-orange-500 to-[var(--color-error-500)]',
    },
    {
      id: '6',
      type: 'friend_added',
      user: 'IceQueen',
      content: 'et ThunderBolt sont maintenant amis',
      timestamp: 'Il y a 4 heures',
      icon: UserPlus,
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      id: '7',
      type: 'achievement_unlocked',
      user: 'PhoenixRise',
      content: 'a debloque "Leader de Squad"',
      timestamp: 'Il y a 5 heures',
      icon: Trophy,
      gradient: 'from-[var(--color-warning-500)] to-yellow-500',
    },
    {
      id: '8',
      type: 'session_created',
      user: 'Toi',
      content: 'as propose une session "CS2 Casual"',
      timestamp: 'Il y a 1 jour',
      icon: Calendar,
      gradient: 'from-[var(--color-primary-500)] to-purple-500',
    },
  ];

  const filters: { key: ActivityType; label: string; icon: any }[] = [
    { key: 'all', label: 'Tout', icon: Star },
    { key: 'sessions', label: 'Sessions', icon: Calendar },
    { key: 'achievements', label: 'Trophees', icon: Trophy },
    { key: 'social', label: 'Social', icon: Users },
  ];

  const filteredActivities = activities.filter(activity => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'sessions') return ['session_created', 'session_completed'].includes(activity.type);
    if (activeFilter === 'achievements') return ['achievement_unlocked', 'level_up'].includes(activity.type);
    if (activeFilter === 'social') return ['squad_joined', 'friend_added'].includes(activity.type);
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.35 }}
      className="min-h-screen pb-24 pt-safe bg-[var(--bg-base)] relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[var(--color-primary-400)]/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
            <motion.button
              onClick={() => onNavigate('home')}
              className="w-12 h-12 rounded-2xl bg-[var(--bg-elevated)] backdrop-blur-sm border border-[var(--border-subtle)] flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-[var(--fg-secondary)]" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[var(--color-primary-600)] to-purple-600 bg-clip-text text-transparent">
                Activite
              </h1>
              <p className="text-sm text-[var(--fg-secondary)] font-medium mt-0.5">
                Ce qui se passe dans ta communaute
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary-500)] to-purple-600 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Zap className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Filters */}
          <motion.div variants={itemVariants} className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
            {filters.map((filter) => {
              const Icon = filter.icon;
              return (
                <motion.button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeFilter === filter.key
                      ? 'bg-gradient-to-r from-[var(--color-primary-500)] to-purple-500 text-white shadow-lg shadow-[var(--color-primary-500)]/30'
                      : 'bg-[var(--bg-elevated)] backdrop-blur-sm text-[var(--fg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--color-primary-200)]'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-4 h-4" strokeWidth={2} />
                  {filter.label}
                </motion.button>
              );
            })}
          </motion.div>

          {/* Activity Feed */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {filteredActivities.map((activity, index) => {
                const Icon = activity.icon;

                return (
                  <motion.div
                    key={activity.id}
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="p-4 hover:shadow-xl transition-all duration-300" interactive>
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <motion.div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activity.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                        </motion.div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-[var(--fg-primary)] mb-1">
                            <span className="font-bold tracking-tight">{activity.user}</span>
                            {' '}
                            <span className="text-[var(--fg-secondary)]">{activity.content}</span>
                          </div>
                          <div className="text-sm text-[var(--fg-tertiary)] font-medium">
                            {activity.timestamp}
                          </div>
                        </div>

                        {/* User Avatar */}
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary-500)] via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
                          {activity.user[0]}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Load More */}
          <motion.button
            variants={itemVariants}
            onClick={() => showToast('Chargement...', 'info')}
            className="w-full mt-6 h-12 rounded-xl bg-[var(--bg-elevated)] backdrop-blur-sm border border-[var(--border-subtle)] text-[var(--fg-secondary)] font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Sparkles className="w-4 h-4" strokeWidth={2} />
            Voir plus d'activites
          </motion.button>

          {/* Empty State */}
          {filteredActivities.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--color-primary-500)] to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[var(--color-primary-500)]/30">
                <Zap className="w-10 h-10 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-[var(--fg-primary)] mb-2">
                Aucune activite recente
              </h3>
              <p className="text-sm text-[var(--fg-secondary)] max-w-xs mx-auto">
                L'activite de tes amis apparaitra ici
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ActivityFeedScreen;
