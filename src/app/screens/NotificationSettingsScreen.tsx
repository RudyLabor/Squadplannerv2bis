import { ArrowLeft, Bell, Clock, Users, MessageSquare, Trophy, Calendar, Settings, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/app/components/ui/Button';
import { useAuth } from '@/app/contexts/AuthContext';
import { notificationsAPI, type NotificationSettings as NotificationSettingsType } from '@/utils/notificationsAPI';

interface NotificationSettingsScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  useMockData?: boolean;
}

export function NotificationSettingsScreen({ onNavigate, showToast, useMockData = false }: NotificationSettingsScreenProps) {
  const { getAccessToken } = useAuth();
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load notification settings from backend
  useEffect(() => {
    // If useMockData is true, use mock data instead
    if (useMockData) {
      setNotificationSettings({
        sessionReminder: true,
        squadInvite: true,
        newMessage: true,
        achievementUnlocked: true,
        friendRequest: true,
        sessionStarting: true,
        weeklyRecap: false,
        pushEnabled: true,
        emailEnabled: false,
      });
      setLoading(false);
      return;
    }
    
    loadSettings();
  }, [useMockData]);

  const loadSettings = async () => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      setLoading(false);
      return;
    }

    try {
      const data = await notificationsAPI.getNotificationSettings(accessToken);
      setNotificationSettings(data);
    } catch (error: any) {
      console.error('Error loading notification settings:', error);
      showToast('Erreur lors du chargement des paramètres', 'error');
      // Set defaults on error
      setNotificationSettings({
        sessionReminder: true,
        squadInvite: true,
        newMessage: true,
        achievementUnlocked: true,
        friendRequest: true,
        sessionStarting: true,
        weeklyRecap: false,
        pushEnabled: true,
        emailEnabled: false,
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle notification setting
  const toggleNotification = (key: string) => {
    if (!notificationSettings) return;
    
    setNotificationSettings(prev => ({
      ...prev!,
      [key]: !prev![key as keyof NotificationSettingsType],
    }));
  };

  const handleSave = async () => {
    const accessToken = await getAccessToken();
    if (!accessToken || !notificationSettings) return;

    setSaving(true);
    
    try {
      await notificationsAPI.saveNotificationSettings(accessToken, notificationSettings);
      showToast('Préférences de notifications sauvegardées !', 'success');
      setTimeout(() => onNavigate('profile'), 500);
    } catch (error: any) {
      console.error('Error saving notification settings:', error);
      showToast('Erreur lors de la sauvegarde', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-24 pt-safe flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[var(--primary-500)] animate-spin mx-auto mb-4" strokeWidth={2} />
          <p className="text-sm text-[var(--fg-tertiary)] font-medium">Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  if (!notificationSettings) {
    return (
      <div className="min-h-screen pb-24 pt-safe flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-[var(--fg-tertiary)] font-medium">Erreur de chargement</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 pt-safe">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={() => onNavigate('profile')}
            className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
              Notifications
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] font-medium mt-1">
              Gérer tes alertes et rappels
            </p>
          </div>
        </div>

        {/* Push & Email Global */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 tracking-tight">
            🔔 Paramètres globaux
          </h2>
          
          <div className="bg-gradient-to-br from-[var(--primary-50)] to-[var(--secondary-50)] rounded-2xl p-5 space-y-4 border-[0.5px] border-[var(--primary-200)]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-[var(--fg-primary)] mb-1">
                  Notifications Push
                </div>
                <div className="text-xs text-[var(--fg-tertiary)]">
                  Reçois les alertes importantes en temps réel
                </div>
              </div>
              <button
                onClick={() => toggleNotification('pushEnabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationSettings.pushEnabled ? 'bg-[var(--primary-500)]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationSettings.pushEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-[var(--fg-primary)] mb-1">
                  Notifications Email
                </div>
                <div className="text-xs text-[var(--fg-tertiary)]">
                  Résumés hebdomadaires et actualités
                </div>
              </div>
              <button
                onClick={() => toggleNotification('emailEnabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationSettings.emailEnabled ? 'bg-[var(--primary-500)]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationSettings.emailEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Notification Types */}
        <div className="space-y-8">
          
          {/* Sessions */}
          <div>
            <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 tracking-tight">
              🎮 Sessions
            </h2>
            <div className="space-y-3">
              {/* Session Reminder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--primary-50)] flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[var(--primary-500)]" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[var(--fg-primary)]">
                        Rappel de session
                      </div>
                      <div className="text-xs text-[var(--fg-tertiary)]">
                        30 min avant le début
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleNotification('sessionReminder')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notificationSettings.sessionReminder ? 'bg-[var(--primary-500)]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.sessionReminder ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </motion.div>

              {/* Session Starting */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--error-50)] flex items-center justify-center">
                      <Bell className="w-5 h-5 text-[var(--error-500)]" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[var(--fg-primary)]">
                        Session qui démarre
                      </div>
                      <div className="text-xs text-[var(--fg-tertiary)]">
                        Alerte 5 min avant
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleNotification('sessionStarting')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notificationSettings.sessionStarting ? 'bg-[var(--primary-500)]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.sessionStarting ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 tracking-tight">
              👥 Social
            </h2>
            <div className="space-y-3">
              {/* Squad Invite */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--secondary-50)] flex items-center justify-center">
                      <Users className="w-5 h-5 text-[var(--secondary-500)]" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[var(--fg-primary)]">
                        Invitation squad
                      </div>
                      <div className="text-xs text-[var(--fg-tertiary)]">
                        Nouvelles invitations
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleNotification('squadInvite')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notificationSettings.squadInvite ? 'bg-[var(--primary-500)]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.squadInvite ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </motion.div>

              {/* New Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--info-50)] flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-[var(--info-500)]" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[var(--fg-primary)]">
                        Nouveaux messages
                      </div>
                      <div className="text-xs text-[var(--fg-tertiary)]">
                        Messages squad & DM
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleNotification('newMessage')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notificationSettings.newMessage ? 'bg-[var(--primary-500)]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.newMessage ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </motion.div>

              {/* Friend Request */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--success-50)] flex items-center justify-center">
                      <Users className="w-5 h-5 text-[var(--success-500)]" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[var(--fg-primary)]">
                        Demande d'ami
                      </div>
                      <div className="text-xs text-[var(--fg-tertiary)]">
                        Nouvelles connexions
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleNotification('friendRequest')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notificationSettings.friendRequest ? 'bg-[var(--primary-500)]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.friendRequest ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Achievements & Stats */}
          <div>
            <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 tracking-tight">
              🏆 Récompenses & Stats
            </h2>
            <div className="space-y-3">
              {/* Achievement Unlocked */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--warning-50)] flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-[var(--warning-500)]" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[var(--fg-primary)]">
                        Trophées débloqués
                      </div>
                      <div className="text-xs text-[var(--fg-tertiary)]">
                        Badges et récompenses
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleNotification('achievementUnlocked')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notificationSettings.achievementUnlocked ? 'bg-[var(--primary-500)]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.achievementUnlocked ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </motion.div>

              {/* Weekly Recap */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--primary-50)] flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-[var(--primary-500)]" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[var(--fg-primary)]">
                        Récap hebdomadaire
                      </div>
                      <div className="text-xs text-[var(--fg-tertiary)]">
                        Chaque lundi matin
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleNotification('weeklyRecap')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notificationSettings.weeklyRecap ? 'bg-[var(--primary-500)]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.weeklyRecap ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

        </div>

        {/* Save Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe bg-gradient-to-t from-[var(--bg-base)] via-[var(--bg-base)] to-transparent">
          <div className="max-w-2xl mx-auto">
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={saving}
              className="w-full h-14 bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] hover:from-[var(--primary-600)] hover:to-[var(--primary-700)] text-white rounded-2xl shadow-lg shadow-[var(--primary-500)]/20 hover:shadow-xl hover:shadow-[var(--primary-500)]/30 font-semibold transition-all duration-200 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />
                  Sauvegarde en cours...
                </>
              ) : (
                <>
                  <Bell className="w-5 h-5" strokeWidth={2} />
                  Sauvegarder les préférences
                </>
              )}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}