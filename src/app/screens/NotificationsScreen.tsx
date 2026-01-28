import { ArrowLeft, Bell, Calendar, Trophy, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
      const response = await notificationsAPI.getUserNotifications();
      setNotifications(response.notifications || []);
      setUnreadCount(response.unreadCount || 0);
    } catch (error: any) {
      console.error('Load notifications error:', error);
      // Fallback to empty if no notifications yet
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      showToast('Notification marquée comme lue', 'success');
    } catch (error: any) {
      console.error('Mark as read error:', error);
      showToast(error.message || 'Erreur', 'error');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'session_confirmed':
        return <CheckCircle2 className="w-5 h-5 text-[var(--success-500)]" strokeWidth={2} />;
      case 'reminder_24h':
      case 'reminder_1h':
        return <Calendar className="w-5 h-5 text-[var(--warning-500)]" strokeWidth={2} />;
      case 'new_vote':
        return <Bell className="w-5 h-5 text-[var(--primary-500)]" strokeWidth={2} />;
      case 'badge_unlocked':
        return <Trophy className="w-5 h-5 text-[var(--warning-500)]" strokeWidth={2} />;
      case 'no_show':
        return <AlertCircle className="w-5 h-5 text-[var(--error-500)]" strokeWidth={2} />;
      default:
        return <Bell className="w-5 h-5 text-[var(--fg-tertiary)]" strokeWidth={2} />;
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return `Il y a ${diffDays}j`;
  };

  return (
    <div className="min-h-screen pb-24 pt-safe bg-[var(--bg-base)]">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="w-10 h-10 rounded-xl bg-white border-[0.5px] border-[var(--border-medium)] hover:border-[var(--border-strong)] flex items-center justify-center shadow-sm transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-secondary)]" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="text-sm text-[var(--primary-500)] mt-1 font-semibold">
                {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 text-[var(--fg-tertiary)]">
              <div className="w-5 h-5 border-2 border-[var(--primary-500)] border-t-transparent rounded-full animate-spin"></div>
              <span>Chargement...</span>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border-[0.5px] border-[var(--border-subtle)] shadow-sm text-center">
            <Bell className="w-12 h-12 text-[var(--fg-tertiary)] mx-auto mb-4" strokeWidth={1.5} />
            <p className="text-sm text-[var(--fg-secondary)] mb-2">
              Aucune notification
            </p>
            <p className="text-xs text-[var(--fg-tertiary)]">
              Vous recevrez des notifications pour vos sessions et badges
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl p-4 border-[0.5px] ${
                  notification.read 
                    ? 'border-[var(--border-subtle)]' 
                    : 'border-[var(--primary-200)] bg-gradient-to-br from-[var(--primary-50)] to-white'
                } shadow-sm hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    notification.read ? 'bg-[var(--bg-subtle)]' : 'bg-white'
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`text-sm font-semibold ${
                        notification.read ? 'text-[var(--fg-secondary)]' : 'text-[var(--fg-primary)]'
                      }`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-[var(--fg-tertiary)] whitespace-nowrap">
                        {getTimeAgo(notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--fg-tertiary)] mb-3">
                      {notification.message}
                    </p>

                    {/* Actions */}
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-xs font-semibold text-[var(--primary-500)] hover:text-[var(--primary-600)] transition-colors"
                      >
                        Marquer comme lue
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsScreen;
