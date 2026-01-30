import { ArrowLeft, Bell, Calendar, Trophy, AlertCircle, CheckCircle2, Sparkles, BellRing, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationsAPI } from '@/utils/api';
import { useUser } from '@/app/contexts/UserContext';
import { Button, SkeletonPage, IconButton } from '@/design-system';

interface NotificationsScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

interface Notification {
  id: string;
  userId: string;
  type: 'session_confirmed' | 'reminder_24h' | 'reminder_1h' | 'new_vote' | 'badge_unlocked' | 'no_show';
  title: string;
  message: string;
  metadata?: {
    sessionId?: string;
    squadId?: string;
    badgeId?: string;
  };
  read: boolean;
  createdAt: string;
  readAt?: string;
}

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

const notificationTypeConfig: Record<string, { icon: React.ElementType; gradient: string; color: string }> = {
  session_confirmed: { icon: CheckCircle2, gradient: 'from-emerald-500 to-teal-500', color: 'text-emerald-500' },
  reminder_24h: { icon: Calendar, gradient: 'from-amber-500 to-orange-500', color: 'text-amber-500' },
  reminder_1h: { icon: Clock, gradient: 'from-red-500 to-pink-500', color: 'text-red-500' },
  new_vote: { icon: Bell, gradient: 'from-[var(--color-primary-500)] to-purple-500', color: 'text-[var(--color-primary-500)]' },
  badge_unlocked: { icon: Trophy, gradient: 'from-yellow-500 to-amber-500', color: 'text-yellow-500' },
  no_show: { icon: AlertCircle, gradient: 'from-red-500 to-rose-500', color: 'text-red-500' },
  default: { icon: Bell, gradient: 'from-[var(--fg-tertiary)] to-[var(--fg-secondary)]', color: 'text-[var(--fg-tertiary)]' }
};

interface PremiumNotificationCardProps {
  notification: Notification;
  onMarkAsRead: () => void;
  index: number;
}

function PremiumNotificationCard({ notification, onMarkAsRead, index }: PremiumNotificationCardProps) {
  const config = notificationTypeConfig[notification.type] || notificationTypeConfig.default;
  const Icon = config.icon;

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return `Il y a ${diffDays}j`;
  };

  return (
    <motion.div
      variants={itemVariants}
      custom={index}
      layout
      className={`relative overflow-hidden rounded-2xl ${
        notification.read
          ? 'bg-[var(--bg-elevated)]/60'
          : 'bg-[var(--bg-elevated)]/90'
      } backdrop-blur-sm border ${
        notification.read
          ? 'border-[var(--border-subtle)]/30'
          : 'border-[var(--border-subtle)]/50 shadow-lg'
      } transition-all duration-300`}
      whileHover={{ scale: 1.01, y: -2 }}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <motion.div
          className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${config.gradient}`}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.2 + index * 0.05 }}
        />
      )}

      <div className="p-4 pl-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <motion.div
            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              notification.read
                ? 'bg-[var(--bg-subtle)]'
                : `bg-gradient-to-br ${config.gradient} shadow-md`
            }`}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Icon className={`w-6 h-6 ${notification.read ? config.color : 'text-white'}`} strokeWidth={2} />
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className={`text-sm font-semibold ${
                notification.read ? 'text-[var(--fg-secondary)]' : 'text-[var(--fg-primary)]'
              }`}>
                {notification.title}
              </h3>
              <span className="text-xs text-[var(--fg-tertiary)] whitespace-nowrap font-medium">
                {getTimeAgo(notification.createdAt)}
              </span>
            </div>
            <p className={`text-xs leading-relaxed mb-3 ${
              notification.read ? 'text-[var(--fg-tertiary)]' : 'text-[var(--fg-secondary)]'
            }`}>
              {notification.message}
            </p>

            {/* Actions */}
            {!notification.read && (
              <motion.button
                onClick={onMarkAsRead}
                className={`text-xs font-semibold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent hover:opacity-80 transition-opacity flex items-center gap-1`}
                whileHover={{ x: 3 }}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${config.color}`} />
                Marquer comme lue
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function NotificationsScreen({ onNavigate, showToast }: NotificationsScreenProps) {
  const { userProfile } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, [userProfile?.id]);

  const loadNotifications = async () => {
    if (!userProfile?.id) return;

    setLoading(true);
    try {
      const response = await notificationsAPI.getNotifications();
      // Transform API response to our Notification interface
      const notifs = (response.notifications || []).map((n: any) => ({
        id: n.id || crypto.randomUUID(),
        userId: n.user_id || userProfile.id,
        type: n.type || 'new_vote',
        title: n.title || 'Notification',
        message: n.message || n.body || '',
        metadata: n.metadata || {},
        read: n.read || false,
        createdAt: n.created_at || new Date().toISOString(),
        readAt: n.read_at,
      }));
      setNotifications(notifs);
      setUnreadCount(notifs.filter((n: Notification) => !n.read).length);
    } catch (error: any) {
      console.error('Load notifications error:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    // Local state update (API doesn't support markAsRead yet)
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    showToast('Notification marquée comme lue', 'success');
  };

  const handleMarkAllAsRead = async () => {
    // Local state update
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    showToast('Toutes les notifications marquées comme lues', 'success');
  };

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-[var(--color-primary-50)] via-purple-50 to-pink-50 relative overflow-hidden">
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
            <IconButton
              icon={<ArrowLeft className="w-5 h-5" strokeWidth={2} />}
              onClick={() => onNavigate('home')}
              variant="ghost"
              aria-label="Retour a l'accueil"
              className="w-12 h-12 rounded-2xl bg-[var(--bg-elevated)]/80 backdrop-blur-sm border border-[var(--border-subtle)] shadow-lg hover:shadow-xl transition-all"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[var(--color-primary-600)] to-purple-600 bg-clip-text text-transparent">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <p className="text-sm text-[var(--color-primary-500)] mt-0.5 font-semibold">
                  {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                </p>
              )}
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary-500)] to-purple-600 flex items-center justify-center shadow-lg relative"
              whileHover={{ scale: 1.05 }}
            >
              <BellRing className="w-6 h-6 text-white" strokeWidth={2} />
              {unreadCount > 0 && (
                <motion.div
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <span className="text-[10px] font-bold text-white">{unreadCount}</span>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Mark All as Read */}
          {unreadCount > 1 && (
            <motion.div variants={itemVariants} className="mb-4">
              <Button
                variant="secondary"
                size="md"
                onClick={handleMarkAllAsRead}
                icon={<CheckCircle2 className="w-4 h-4" />}
                fullWidth
                className="bg-[var(--bg-elevated)]/60 backdrop-blur-sm border-[var(--border-subtle)] text-[var(--color-primary-600)]"
              >
                Tout marquer comme lu
              </Button>
            </motion.div>
          )}

          {/* Content */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SkeletonPage />
              </motion.div>
            ) : notifications.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--color-primary-500)] to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[var(--color-primary-500)]/30">
                  <Bell className="w-12 h-12 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-[var(--fg-primary)] mb-2">
                  Aucune notification
                </h3>
                <p className="text-[var(--fg-secondary)] text-sm max-w-xs mx-auto">
                  Vous recevrez des notifications pour vos sessions et badges
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="notifications"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {notifications.map((notification, index) => (
                  <PremiumNotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={() => handleMarkAsRead(notification.id)}
                    index={index}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Settings Link */}
          {notifications.length > 0 && (
            <motion.div variants={itemVariants} className="mt-6">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => onNavigate('notification-settings')}
                icon={<Sparkles className="w-4 h-4" />}
                fullWidth
                className="bg-gradient-to-r from-[var(--color-primary-500)]/10 to-purple-500/10 border border-[var(--color-primary-200)]/50 text-[var(--color-primary-600)]"
              >
                Gérer les préférences de notifications
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default NotificationsScreen;
