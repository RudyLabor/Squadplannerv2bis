import { ArrowLeft, Mail, Smartphone, Save, Bell, BellOff, AlertCircle, Sparkles, Zap, Clock, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/app/contexts/UserContext';
import { pushNotifications } from '@/utils/push-notifications';
import { Button, Card, IconButton } from '@/design-system';

interface NotificationSettingsScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
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

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
}

function PremiumToggleSwitch({ enabled, onToggle }: ToggleSwitchProps) {
  return (
    <motion.button
      onClick={onToggle}
      className={`relative w-14 h-8 rounded-full transition-all duration-300 flex-shrink-0 ${
        enabled
          ? 'bg-gradient-to-r from-[var(--color-primary-500)] to-purple-500 shadow-lg shadow-[var(--color-primary-500)]/30'
          : 'bg-[var(--fg-tertiary)]'
      }`}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute top-1 w-6 h-6 bg-[var(--bg-elevated)] rounded-full shadow-md flex items-center justify-center"
        animate={{ x: enabled ? 28 : 4 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {enabled && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Sparkles className="w-3 h-3 text-[var(--color-primary-500)]" />
          </motion.div>
        )}
      </motion.div>
    </motion.button>
  );
}

export function NotificationSettingsScreen({ onNavigate, showToast }: NotificationSettingsScreenProps) {
  const { userProfile, updateUserProfile } = useUser();
  const [settings, setSettings] = useState({
    pushReminder24h: userProfile?.notificationSettings?.pushReminder24h ?? true,
    pushReminder1h: userProfile?.notificationSettings?.pushReminder1h ?? true,
    emailReminder24h: userProfile?.notificationSettings?.emailReminder24h ?? false,
    smartNudges: userProfile?.notificationSettings?.smartNudges ?? true,
  });
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushSupported, setPushSupported] = useState(true);
  const [checkingPush, setCheckingPush] = useState(true);

  useEffect(() => {
    checkPushStatus();
  }, []);

  const checkPushStatus = async () => {
    try {
      setCheckingPush(true);
      const supported = pushNotifications.isSupported();
      setPushSupported(supported);

      if (supported) {
        const subscribed = await pushNotifications.isSubscribed();
        setPushEnabled(subscribed);
      }
    } catch (error) {
      console.error('[Notification Settings] Push status check error:', error);
    } finally {
      setCheckingPush(false);
    }
  };

  const handleEnablePush = async () => {
    try {
      const permission = await pushNotifications.requestPermission();

      if (permission === 'granted') {
        setPushEnabled(true);
        showToast('Notifications push activées !', 'success');
      } else if (permission === 'denied') {
        showToast('Permission refusée. Vérifiez les paramètres de votre navigateur.', 'error');
      } else {
        showToast('Permission refusée', 'info');
      }
    } catch (error: any) {
      console.error('[Notification Settings] Enable push error:', error);
      showToast(error.message || 'Erreur lors de l\'activation', 'error');
    }
  };

  const handleDisablePush = async () => {
    try {
      await pushNotifications.unsubscribe();
      setPushEnabled(false);
      showToast('Notifications push désactivées', 'info');
    } catch (error) {
      console.error('[Notification Settings] Disable push error:', error);
      showToast('Erreur lors de la désactivation', 'error');
    }
  };

  const handleTestPush = async () => {
    try {
      await pushNotifications.sendTestNotification();
      showToast('Notification de test envoyée !', 'success');
    } catch (error) {
      console.error('[Notification Settings] Test push error:', error);
      showToast('Erreur lors du test', 'error');
    }
  };

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    try {
      await updateUserProfile({
        notificationSettings: settings
      });
      showToast('Préférences sauvegardées sur votre profil', 'success');
      setTimeout(() => onNavigate('profile'), 500);
    } catch (error) {
      showToast('Erreur lors de la sauvegarde', 'error');
    }
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
              onClick={() => onNavigate('profile')}
              variant="ghost"
              aria-label="Retour au profil"
              className="w-12 h-12 rounded-2xl bg-[var(--bg-elevated)]/80 backdrop-blur-sm border border-[var(--border-subtle)] shadow-lg hover:shadow-xl transition-all"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[var(--color-primary-600)] to-purple-600 bg-clip-text text-transparent">
                Notifications
              </h1>
              <p className="text-sm text-[var(--fg-secondary)] font-medium">
                Gérez vos rappels et alertes
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary-500)] to-purple-500 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Bell className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Web Push Status Section */}
          <AnimatePresence mode="wait">
            {pushSupported ? (
              <motion.div
                key="push-supported"
                variants={itemVariants}
                className={`rounded-2xl p-6 mb-6 border shadow-lg ${
                  pushEnabled
                    ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200/50'
                    : 'bg-gradient-to-br from-[var(--color-primary-50)] to-purple-50 border-[var(--color-primary-200)]/50'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                        pushEnabled
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                          : 'bg-gradient-to-br from-[var(--color-primary-500)] to-purple-500'
                      }`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {pushEnabled ? (
                        <Bell className="w-6 h-6 text-white" strokeWidth={2} />
                      ) : (
                        <BellOff className="w-6 h-6 text-white" strokeWidth={2} />
                      )}
                    </motion.div>
                    <div>
                      <h3 className="text-base font-bold tracking-tight text-[var(--fg-primary)]">
                        {pushEnabled ? 'Notifications Push Activées' : 'Notifications Push'}
                      </h3>
                      <p className="text-sm text-[var(--fg-secondary)] font-medium">
                        {checkingPush ? 'Vérification...' : pushEnabled ? 'Vous recevrez des notifications' : 'Activez pour recevoir des alertes'}
                      </p>
                    </div>
                  </div>
                  {pushEnabled && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full"
                    >
                      Actif
                    </motion.span>
                  )}
                </div>

                <div className="flex gap-2">
                  {pushEnabled ? (
                    <>
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={handleTestPush}
                        icon={<Bell className="w-4 h-4" />}
                        className="flex-1"
                      >
                        Test
                      </Button>
                      <Button
                        variant="destructive"
                        size="md"
                        onClick={handleDisablePush}
                        icon={<BellOff className="w-4 h-4" />}
                        className="flex-1"
                      >
                        Désactiver
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleEnablePush}
                      disabled={checkingPush}
                      loading={checkingPush}
                      icon={<Bell className="w-4 h-4" />}
                      fullWidth
                      className="bg-gradient-to-r from-[var(--color-primary-500)] to-purple-500 shadow-lg shadow-[var(--color-primary-500)]/30"
                    >
                      {checkingPush ? 'Vérification...' : 'Activer les Notifications Push'}
                    </Button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="push-not-supported"
                variants={itemVariants}
                className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 mb-6 border border-amber-200/50 shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold tracking-tight text-amber-900 mb-1">
                      Notifications Push non disponibles
                    </h3>
                    <p className="text-sm text-amber-700 font-medium">
                      Votre navigateur ne supporte pas les notifications push ou elles sont désactivées dans les paramètres système.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Push Section */}
          <Card variant="elevated" padding="lg" className="mb-6 bg-[var(--bg-elevated)]/80 backdrop-blur-sm border-[var(--border-subtle)]">
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary-500)] to-purple-500 flex items-center justify-center shadow-md"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Smartphone className="w-6 h-6 text-white" strokeWidth={2} />
              </motion.div>
              <h2 className="text-lg font-bold tracking-tight text-[var(--fg-primary)]">Notifications Push</h2>
            </div>

            <div className="space-y-5">
              {/* 24h Reminder */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[var(--fg-primary)]">Rappel J-1 (24h)</div>
                    <div className="text-xs text-[var(--fg-secondary)] font-medium">Recevoir une alerte la veille</div>
                  </div>
                </div>
                <PremiumToggleSwitch
                  enabled={settings.pushReminder24h}
                  onToggle={() => handleToggle('pushReminder24h')}
                />
              </div>

              {/* 1h Reminder */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-red-600" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[var(--fg-primary)]">Rappel H-1 (1h)</div>
                    <div className="text-xs text-[var(--fg-secondary)] font-medium">Dernier rappel avant le début</div>
                  </div>
                </div>
                <PremiumToggleSwitch
                  enabled={settings.pushReminder1h}
                  onToggle={() => handleToggle('pushReminder1h')}
                />
              </div>

              {/* Smart Nudges */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-primary-100)] to-purple-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-[var(--color-primary-600)]" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[var(--fg-primary)]">Smart Nudges</div>
                    <div className="text-xs text-[var(--fg-secondary)] font-medium">Alertes "Il manque un joueur !"</div>
                  </div>
                </div>
                <PremiumToggleSwitch
                  enabled={settings.smartNudges}
                  onToggle={() => handleToggle('smartNudges')}
                />
              </div>
            </div>
          </Card>

          {/* Email Section */}
          <Card variant="elevated" padding="lg" className="mb-6 bg-[var(--bg-elevated)]/80 backdrop-blur-sm border-[var(--border-subtle)]">
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-md"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Mail className="w-6 h-6 text-white" strokeWidth={2} />
              </motion.div>
              <h2 className="text-lg font-bold tracking-tight text-[var(--fg-primary)]">Email</h2>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" strokeWidth={2} />
                </div>
                <div>
                  <div className="text-sm font-bold text-[var(--fg-primary)]">Récapitulatif Session</div>
                  <div className="text-xs text-[var(--fg-secondary)] font-medium">Détails envoyés 24h avant</div>
                </div>
              </div>
              <PremiumToggleSwitch
                enabled={settings.emailReminder24h}
                onToggle={() => handleToggle('emailReminder24h')}
              />
            </div>
          </Card>

          {/* Save Button */}
          <Button
            variant="primary"
            size="lg"
            onClick={handleSave}
            icon={<Save className="w-5 h-5" strokeWidth={2} />}
            fullWidth
            className="bg-gradient-to-r from-[var(--color-primary-500)] to-purple-500 shadow-xl shadow-[var(--color-primary-500)]/30 h-14 rounded-2xl font-bold"
          >
            Enregistrer les préférences
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

export default NotificationSettingsScreen;
