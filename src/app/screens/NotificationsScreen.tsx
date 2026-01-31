/**
 * NOTIFICATIONS SCREEN - LINEAR DESIGN SYSTEM
 * Premium, Dark, Minimal - Notifications list
 */

import { ArrowLeft, Bell, Calendar, Trophy, AlertCircle, CheckCircle2, Clock, BellRing, Settings, Check, Inbox } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationsAPI } from '@/utils/api';
import { useUser } from '@/app/contexts/UserContext';

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

// Linear-style animations (same as ProfileScreen)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.02 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }
  }
};

// Linear-style notification colors
const notificationTypeConfig: Record<string, { icon: React.ElementType; bgColor: string; iconColor: string; accentColor: string }> = {
  session_confirmed: { icon: CheckCircle2, bgColor: 'rgba(74,222,128,0.1)', iconColor: 'text-[#4ade80]', accentColor: 'bg-[#4ade80]' },
  reminder_24h: { icon: Calendar, bgColor: 'rgba(245,166,35,0.1)', iconColor: 'text-[#f5a623]', accentColor: 'bg-[#f5a623]' },
  reminder_1h: { icon: Clock, bgColor: 'rgba(248,113,113,0.1)', iconColor: 'text-[#f87171]', accentColor: 'bg-[#f87171]' },
  new_vote: { icon: Bell, bgColor: 'rgba(94,109,210,0.1)', iconColor: 'text-[#5e6dd2]', accentColor: 'bg-[#5e6dd2]' },
  badge_unlocked: { icon: Trophy, bgColor: 'rgba(245,166,35,0.1)', iconColor: 'text-[#f5a623]', accentColor: 'bg-[#f5a623]' },
  no_show: { icon: AlertCircle, bgColor: 'rgba(248,113,113,0.1)', iconColor: 'text-[#f87171]', accentColor: 'bg-[#f87171]' },
  default: { icon: Bell, bgColor: 'rgba(139,141,144,0.1)', iconColor: 'text-[#8b8d90]', accentColor: 'bg-[#8b8d90]' }
};

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: () => void;
  index: number;
}

function NotificationCard({ notification, onMarkAsRead, index }: NotificationCardProps) {
  const config = notificationTypeConfig[notification.type] || notificationTypeConfig.default;
  const Icon = config.icon;

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "A l'instant";
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return `Il y a ${diffDays}j`;
  };

  return (
    <motion.div
      variants={itemVariants}
      custom={index}
      layout
      className={`relative overflow-hidden rounded-xl ${
        notification.read
          ? 'bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]'
          : 'bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]'
      } transition-all duration-100 group`}
      whileHover={{ y: -1 }}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <motion.div
          className={`absolute left-0 top-0 bottom-0 w-0.5 ${config.accentColor}`}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.1 + index * 0.02, duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }}
        />
      )}

      <div className="p-4 pl-5">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
            style={{ backgroundColor: config.bgColor }}
          >
            <Icon className={`w-5 h-5 ${config.iconColor}`} strokeWidth={1.5} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className={`text-[13px] font-medium ${
                notification.read ? 'text-[#8b8d90]' : 'text-[#f7f8f8]'
              }`}>
                {notification.title}
              </h3>
              <span className="text-[11px] text-[#5e6063] whitespace-nowrap">
                {getTimeAgo(notification.createdAt)}
              </span>
            </div>
            <p className={`text-[12px] leading-relaxed mb-2 ${
              notification.read ? 'text-[#5e6063]' : 'text-[#8b8d90]'
            }`}>
              {notification.message}
            </p>

            {/* Actions */}
            {!notification.read && (
              <motion.button
                onClick={onMarkAsRead}
                className={`text-[11px] font-medium ${config.iconColor} hover:opacity-80 transition-opacity flex items-center gap-1`}
                whileHover={{ x: 2 }}
              >
                <Check className={`w-3 h-3 ${config.iconColor}`} strokeWidth={2} />
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
    if (!userProfile?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await notificationsAPI.getNotifications();
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
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    showToast('Notification marquee comme lue', 'success');
  };

  const handleMarkAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    showToast('Toutes les notifications marquees comme lues', 'success');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090a] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#5e6dd2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090a] pb-24 md:pb-8">
      <motion.div
        className="max-w-3xl mx-auto px-4 md:px-6 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header - Linear style (same as ProfileScreen) */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => onNavigate('home')}
              className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.06)] transition-all"
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>
            <div>
              <h1 className="text-[24px] md:text-[26px] font-semibold text-[#f7f8f8]">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <p className="text-[13px] text-[#5e6dd2] font-medium">
                  {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => onNavigate('notification-settings')}
              className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.06)] transition-all"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>
            <div className="w-11 h-11 rounded-xl bg-[rgba(94,109,210,0.1)] flex items-center justify-center relative">
              <BellRing className="w-5 h-5 text-[#5e6dd2]" strokeWidth={1.5} />
              {unreadCount > 0 && (
                <motion.div
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#f87171] flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <span className="text-[10px] font-bold text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Mark All as Read */}
        {unreadCount > 1 && (
          <motion.div variants={itemVariants} className="mb-4">
            <motion.button
              onClick={handleMarkAllAsRead}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#8b8d90] text-[13px] font-medium hover:bg-[rgba(255,255,255,0.06)] hover:text-[#f7f8f8] transition-all"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />
              Tout marquer comme lu
            </motion.button>
          </motion.div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {notifications.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }}
              className="p-6 md:p-8 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]"
            >
              <div className="text-center max-w-[280px] mx-auto">
                <div className="w-14 h-14 rounded-xl bg-[rgba(94,109,210,0.1)] flex items-center justify-center mx-auto mb-4">
                  <Inbox className="w-7 h-7 text-[#5e6dd2]" strokeWidth={1.5} />
                </div>
                <h3 className="text-[15px] font-semibold text-[#f7f8f8] mb-2">
                  Aucune notification
                </h3>
                <p className="text-[13px] text-[#8b8d90] leading-relaxed mb-4">
                  Tu recevras des notifications pour tes sessions et badges
                </p>
                <motion.button
                  onClick={() => onNavigate('notification-settings')}
                  className="text-[12px] font-medium text-[#5e6dd2] hover:text-[#8b93ff] transition-colors flex items-center gap-1 mx-auto"
                  whileHover={{ x: 2 }}
                >
                  Configurer les notifications
                  <ArrowLeft className="w-3 h-3 rotate-180" strokeWidth={2} />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="notifications"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              {notifications.map((notification, index) => (
                <NotificationCard
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
            <motion.button
              onClick={() => onNavigate('notification-settings')}
              className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-[rgba(94,109,210,0.08)] border border-[rgba(94,109,210,0.2)] text-[#8b93ff] text-[14px] font-medium hover:bg-[rgba(94,109,210,0.12)] transition-all"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <Settings className="w-4 h-4" strokeWidth={1.5} />
              Gerer les preferences
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default NotificationsScreen;
