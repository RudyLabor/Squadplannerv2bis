// 🔔 SQUAD PLANNER - Système de Rappels Push (T-24h, T-1h)

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, Clock, Zap, Check, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { EMOJIS } from '@/constants/emojis';

export interface PushNotification {
  id: string;
  sessionId: string;
  sessionName: string;
  squadName: string;
  gameImage: string;
  type: '24h' | '1h' | 'starting';
  scheduledTime: Date;
  sent: boolean;
  title: string;
  message: string;
}

interface PushNotificationsManagerProps {
  sessionId?: string;
  onToggle?: (enabled: boolean) => void;
}

// 🎯 HOOK pour gérer les notifications push
export function usePushNotifications() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      setIsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    setIsEnabled(result === 'granted');
    return result === 'granted';
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (isEnabled && permission === 'granted') {
      new Notification(title, {
        icon: '/icon-512.png',
        badge: '/icon-192.png',
        ...options,
      });
    }
  };

  return {
    isEnabled,
    permission,
    requestPermission,
    sendNotification,
  };
}

// 🔔 COMPOSANT: Gestionnaire de Notifications Push
export function PushNotificationsManager({ sessionId, onToggle }: PushNotificationsManagerProps) {
  const { isEnabled, permission, requestPermission } = usePushNotifications();
  const [reminders, setReminders] = useState({
    t24h: true,
    t1h: true,
    starting: true,
  });

  const handleToggleNotifications = async () => {
    if (!isEnabled) {
      const granted = await requestPermission();
      if (granted && onToggle) {
        onToggle(true);
      }
    } else {
      if (onToggle) {
        onToggle(false);
      }
    }
  };

  const toggleReminder = (type: 't24h' | 't1h' | 'starting') => {
    setReminders(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const getReminderIcon = (type: 't24h' | 't1h' | 'starting') => {
    switch (type) {
      case 't24h':
        return EMOJIS.time.calendar;
      case 't1h':
        return EMOJIS.time.alarm;
      case 'starting':
        return EMOJIS.gaming.zap;
    }
  };

  const getReminderTitle = (type: 't24h' | 't1h' | 'starting') => {
    switch (type) {
      case 't24h':
        return 'Rappel 24h avant';
      case 't1h':
        return 'Rappel 1h avant';
      case 'starting':
        return 'Session qui démarre';
    }
  };

  return (
    <Card variant="glass-3" className="space-y-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] flex items-center justify-center">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="heading-small">Notifications Push</h3>
            <p className="text-sm text-[var(--fg-secondary)] font-body">
              Rappels automatiques pour ne rien manquer
            </p>
          </div>
        </div>

        <motion.button
          onClick={handleToggleNotifications}
          className={`relative w-14 h-8 rounded-full transition-colors ${
            isEnabled ? 'bg-green-500' : 'bg-[var(--bg-tertiary)]'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg"
            animate={{ x: isEnabled ? 30 : 4 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </motion.button>
      </div>

      {/* Permission Alert */}
      {permission === 'denied' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/20"
        >
          <div className="flex items-start gap-3">
            <BellOff className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-400 mb-1">
                Notifications bloquées
              </p>
              <p className="text-xs text-red-300 font-body">
                Active les notifications dans les paramètres de ton navigateur pour recevoir des rappels.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Reminders Settings */}
      {isEnabled && permission === 'granted' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <p className="text-sm font-semibold text-[var(--fg-secondary)] mb-2">
            Choisir les rappels :
          </p>

          {/* T-24h Reminder */}
          <motion.div
            className={`p-4 rounded-xl cursor-pointer transition-all ${
              reminders.t24h
                ? 'bg-[var(--primary-500)]/10 border border-[var(--primary-500)]/30'
                : 'bg-[var(--bg-tertiary)] border border-transparent'
            }`}
            onClick={() => toggleReminder('t24h')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                reminders.t24h ? 'bg-[var(--primary-500)]' : 'bg-[var(--bg-secondary)]'
              }`}>
                <span className="text-xl">{getReminderIcon('t24h')}</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{getReminderTitle('t24h')}</p>
                <p className="text-xs text-[var(--fg-tertiary)] font-body">
                  Notification 24h avant la session
                </p>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                reminders.t24h ? 'bg-green-500' : 'bg-[var(--bg-secondary)]'
              }`}>
                {reminders.t24h && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
          </motion.div>

          {/* T-1h Reminder */}
          <motion.div
            className={`p-4 rounded-xl cursor-pointer transition-all ${
              reminders.t1h
                ? 'bg-yellow-500/10 border border-yellow-500/30'
                : 'bg-[var(--bg-tertiary)] border border-transparent'
            }`}
            onClick={() => toggleReminder('t1h')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                reminders.t1h ? 'bg-yellow-500' : 'bg-[var(--bg-secondary)]'
              }`}>
                <span className="text-xl">{getReminderIcon('t1h')}</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{getReminderTitle('t1h')}</p>
                <p className="text-xs text-[var(--fg-tertiary)] font-body">
                  Notification 1h avant le début
                </p>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                reminders.t1h ? 'bg-green-500' : 'bg-[var(--bg-secondary)]'
              }`}>
                {reminders.t1h && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
          </motion.div>

          {/* Starting Reminder */}
          <motion.div
            className={`p-4 rounded-xl cursor-pointer transition-all ${
              reminders.starting
                ? 'bg-green-500/10 border border-green-500/30'
                : 'bg-[var(--bg-tertiary)] border border-transparent'
            }`}
            onClick={() => toggleReminder('starting')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                reminders.starting ? 'bg-green-500' : 'bg-[var(--bg-secondary)]'
              }`}>
                <span className="text-xl">{getReminderIcon('starting')}</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{getReminderTitle('starting')}</p>
                <p className="text-xs text-[var(--fg-tertiary)] font-body">
                  Notification au démarrage de la session
                </p>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                reminders.starting ? 'bg-green-500' : 'bg-[var(--bg-secondary)]'
              }`}>
                {reminders.starting && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Call to Action */}
      {!isEnabled && permission !== 'denied' && (
        <Button
          variant="primary"
          fullWidth
          onClick={handleToggleNotifications}
          className="shadow-glow-primary"
        >
          <Bell className="w-4 h-4 mr-2" />
          Activer les notifications
        </Button>
      )}
    </Card>
  );
}

// 🎯 COMPOSANT: Notification Toast Inline
export function NotificationToast({
  notification,
  onDismiss,
}: {
  notification: PushNotification;
  onDismiss: () => void;
}) {
  const getNotificationColor = (type: string) => {
    switch (type) {
      case '24h':
        return 'from-blue-500 to-blue-600';
      case '1h':
        return 'from-yellow-500 to-yellow-600';
      case 'starting':
        return 'from-green-500 to-green-600';
      default:
        return 'from-[var(--primary-500)] to-[var(--secondary-500)]';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className="relative overflow-hidden rounded-2xl shadow-2xl max-w-md"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${getNotificationColor(notification.type)} opacity-10`} />
      
      <div className="relative glass-4 backdrop-blur-xl p-4 border border-white/10">
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getNotificationColor(notification.type)} flex items-center justify-center flex-shrink-0`}>
            <Bell className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm mb-1">
              {notification.title}
            </h4>
            <p className="text-xs text-[var(--fg-secondary)] font-body">
              {notification.message}
            </p>
          </div>

          <button
            onClick={onDismiss}
            className="flex-shrink-0 w-6 h-6 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}