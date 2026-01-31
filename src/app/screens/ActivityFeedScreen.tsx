import { ArrowLeft, Trophy, Users, Calendar, CheckCircle, UserPlus, Star, Zap, TrendingUp, Sparkles, Bell, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  iconColor: string;
  iconBg: string;
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
      content: 'a débloqué le trophée "Fiabilité Parfaite"',
      timestamp: 'Il y a 5 minutes',
      icon: Trophy,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/10',
    },
    {
      id: '2',
      type: 'session_created',
      user: 'NightOwl',
      content: 'a créé une session "Ranked Valorant"',
      timestamp: 'Il y a 15 minutes',
      icon: Calendar,
      iconColor: 'text-[#5e6dd2]',
      iconBg: 'bg-[#5e6dd2]/10',
    },
    {
      id: '3',
      type: 'squad_joined',
      user: 'ProPlayer',
      content: 'a rejoint la squad "Warriors"',
      timestamp: 'Il y a 1 heure',
      icon: Users,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/10',
    },
    {
      id: '4',
      type: 'session_completed',
      user: 'ShadowKing',
      content: 'a complété la session "LoL Draft"',
      timestamp: 'Il y a 2 heures',
      icon: CheckCircle,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10',
    },
    {
      id: '5',
      type: 'level_up',
      user: 'DragonSlayer',
      content: 'est maintenant niveau 25',
      timestamp: 'Il y a 3 heures',
      icon: TrendingUp,
      iconColor: 'text-orange-400',
      iconBg: 'bg-orange-500/10',
    },
    {
      id: '6',
      type: 'friend_added',
      user: 'IceQueen',
      content: 'et ThunderBolt sont maintenant amis',
      timestamp: 'Il y a 4 heures',
      icon: UserPlus,
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-500/10',
    },
    {
      id: '7',
      type: 'achievement_unlocked',
      user: 'PhoenixRise',
      content: 'a débloqué "Leader de Squad"',
      timestamp: 'Il y a 5 heures',
      icon: Trophy,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/10',
    },
    {
      id: '8',
      type: 'session_created',
      user: 'Toi',
      content: 'as proposé une session "CS2 Casual"',
      timestamp: 'Il y a 1 jour',
      icon: Calendar,
      iconColor: 'text-[#5e6dd2]',
      iconBg: 'bg-[#5e6dd2]/10',
    },
  ];

  const filters: { key: ActivityType; label: string; icon: any }[] = [
    { key: 'all', label: 'Tout', icon: Star },
    { key: 'sessions', label: 'Sessions', icon: Calendar },
    { key: 'achievements', label: 'Trophées', icon: Trophy },
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#08090a] pb-24 md:pb-8"
    >
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <motion.button
              onClick={() => onNavigate('home')}
              className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-[#8b8d90]" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-[#f7f8f8] tracking-tight">
                Activité
              </h1>
              <p className="text-sm text-[#8b8d90] mt-0.5">
                Ce qui se passe dans ta communauté
              </p>
            </div>
            <motion.button
              className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.05)] transition-colors relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-5 h-5 text-[#8b8d90]" strokeWidth={2} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#5e6dd2] rounded-full border-2 border-[#08090a]" />
            </motion.button>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 text-center">
              <div className="text-2xl font-semibold text-[#f7f8f8]">24</div>
              <div className="text-xs text-[#5e6063] mt-1">Aujourd'hui</div>
            </div>
            <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 text-center">
              <div className="text-2xl font-semibold text-[#f7f8f8]">156</div>
              <div className="text-xs text-[#5e6063] mt-1">Cette semaine</div>
            </div>
            <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 text-center">
              <div className="text-2xl font-semibold text-[#f7f8f8]">12</div>
              <div className="text-xs text-[#5e6063] mt-1">Non lues</div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div variants={itemVariants} className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
            {filters.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeFilter === filter.key;
              return (
                <motion.button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#5e6dd2] text-white'
                      : 'bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-[#8b8d90] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#f7f8f8]'
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

          {/* Section Title */}
          <motion.div variants={itemVariants} className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-[#5e6063] uppercase tracking-wider">
              Fil d'activité
            </h2>
            <button className="text-sm text-[#5e6dd2] hover:text-[#6a79db] font-medium transition-colors">
              Tout marquer comme lu
            </button>
          </motion.div>

          {/* Activity Feed */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              {filteredActivities.map((activity, index) => {
                const Icon = activity.icon;

                return (
                  <motion.div
                    key={activity.id}
                    variants={itemVariants}
                    custom={index}
                    className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 hover:bg-[rgba(255,255,255,0.04)] transition-all cursor-pointer group"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-lg ${activity.iconBg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${activity.iconColor}`} strokeWidth={2} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-[#f7f8f8]">
                          <span className="font-semibold">{activity.user}</span>
                          {' '}
                          <span className="text-[#8b8d90]">{activity.content}</span>
                        </div>
                        <div className="text-xs text-[#5e6063] mt-1">
                          {activity.timestamp}
                        </div>
                      </div>

                      {/* User Avatar */}
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5e6dd2] to-purple-600 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                        {activity.user[0]}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Load More */}
          <motion.button
            variants={itemVariants}
            onClick={() => showToast('Chargement...', 'info')}
            className="w-full mt-6 h-11 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-[#8b8d90] font-medium text-sm hover:bg-[rgba(255,255,255,0.05)] hover:text-[#f7f8f8] transition-all flex items-center justify-center gap-2"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Sparkles className="w-4 h-4" strokeWidth={2} />
            Voir plus d'activités
          </motion.button>

          {/* Empty State */}
          {filteredActivities.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-[#5e6063]" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-[#f7f8f8] mb-2">
                Aucune activité récente
              </h3>
              <p className="text-sm text-[#5e6063] max-w-xs mx-auto">
                L'activité de tes amis apparaîtra ici
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ActivityFeedScreen;
