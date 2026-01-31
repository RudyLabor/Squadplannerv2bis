import { ArrowLeft, Mail, Smartphone, Save, Bell, BellOff, AlertCircle, Zap, Clock, Users, Settings, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/app/contexts/UserContext';
import { pushNotifications } from '@/utils/push-notifications';

interface NotificationSettingsScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

// Linear-style animations - subtle and fast
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.01 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }
  }
};

// Linear-style Toggle Switch
interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
}

function LinearToggle({ enabled, onToggle }: ToggleSwitchProps) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0 ${
        enabled
          ? 'bg-[#5e6dd2]'
          : 'bg-[#26282d]'
      }`}
    >
      <motion.div
        className={`absolute top-0.5 w-5 h-5 rounded-full shadow-sm ${
          enabled ? 'bg-white' : 'bg-[#6b6f76]'
        }`}
        animate={{ x: enabled ? 22 : 2 }}
        transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      />
    </button>
  );
}

// Section Header Component
interface SectionHeaderProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle?: string;
}

function SectionHeader({ icon, iconBg, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </div>
      <div>
        <h2 className="text-[14px] font-medium text-[#f7f8f8]">{title}</h2>
        {subtitle && <p className="text-[12px] text-[#5e6063]">{subtitle}</p>}
      </div>
    </div>
  );
}

// Setting Row Component
interface SettingRowProps {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

function SettingRow({ icon, iconColor, title, description, enabled, onToggle }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between py-3 group">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-150 group-hover:scale-105"
          style={{ backgroundColor: `${iconColor}15` }}
        >
          <div style={{ color: iconColor }}>{icon}</div>
        </div>
        <div className="min-w-0">
          <div className="text-[14px] font-medium text-[#f7f8f8] truncate">{title}</div>
          <div className="text-[12px] text-[#5e6063] truncate">{description}</div>
        </div>
      </div>
      <LinearToggle enabled={enabled} onToggle={onToggle} />
    </div>
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
  const [saving, setSaving] = useState(false);

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
        showToast('Notifications push activees !', 'success');
      } else if (permission === 'denied') {
        showToast('Permission refusee. Verifiez les parametres de votre navigateur.', 'error');
      } else {
        showToast('Permission refusee', 'info');
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
      showToast('Notifications push desactivees', 'info');
    } catch (error) {
      console.error('[Notification Settings] Disable push error:', error);
      showToast('Erreur lors de la desactivation', 'error');
    }
  };

  const handleTestPush = async () => {
    try {
      await pushNotifications.sendTestNotification();
      showToast('Notification de test envoyee !', 'success');
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
      setSaving(true);
      await updateUserProfile({
        notificationSettings: settings
      });
      showToast('Preferences sauvegardees', 'success');
      setTimeout(() => onNavigate('profile'), 500);
    } catch (error) {
      showToast('Erreur lors de la sauvegarde', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 bg-[#08090a]">
      <div className="px-4 md:px-6 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header - Linear style */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
            <motion.button
              onClick={() => onNavigate('profile')}
              className="w-9 h-9 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)] transition-all duration-150"
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-[18px] md:text-[20px] font-semibold text-[#f7f8f8] tracking-[-0.02em]">
                Notifications
              </h1>
              <p className="text-[13px] text-[#5e6063] mt-0.5">
                Gerez vos rappels et alertes
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[rgba(94,109,210,0.1)] flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#5e6dd2]" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Push Status Card */}
          <AnimatePresence mode="wait">
            {pushSupported ? (
              <motion.div
                key="push-supported"
                variants={itemVariants}
                className="rounded-xl p-5 mb-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                        pushEnabled ? 'bg-[rgba(74,222,128,0.1)]' : 'bg-[rgba(94,109,210,0.1)]'
                      }`}
                    >
                      {pushEnabled ? (
                        <Bell className="w-5 h-5 text-[#4ade80]" strokeWidth={1.5} />
                      ) : (
                        <BellOff className="w-5 h-5 text-[#5e6dd2]" strokeWidth={1.5} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-[14px] font-medium text-[#f7f8f8]">
                        {pushEnabled ? 'Push actives' : 'Notifications Push'}
                      </h3>
                      <p className="text-[12px] text-[#5e6063] mt-0.5">
                        {checkingPush ? 'Verification...' : pushEnabled ? 'Vous recevrez des alertes' : 'Activez pour recevoir des alertes'}
                      </p>
                    </div>
                  </div>
                  {pushEnabled && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-full flex items-center gap-1 bg-[rgba(74,222,128,0.1)] text-[#4ade80]"
                    >
                      <Check className="w-3 h-3" />
                      Actif
                    </motion.span>
                  )}
                </div>

                <div className="flex gap-2">
                  {pushEnabled ? (
                    <>
                      <button
                        onClick={handleTestPush}
                        className="flex-1 h-10 rounded-lg text-[13px] font-medium transition-all duration-150 hover:bg-[rgba(255,255,255,0.06)] active:scale-[0.98] flex items-center justify-center gap-2 bg-[rgba(255,255,255,0.03)] text-[#8b8d90] border border-[rgba(255,255,255,0.06)]"
                      >
                        <Bell className="w-4 h-4" />
                        Tester
                      </button>
                      <button
                        onClick={handleDisablePush}
                        className="flex-1 h-10 rounded-lg text-[13px] font-medium transition-all duration-150 hover:bg-[rgba(248,113,113,0.12)] active:scale-[0.98] flex items-center justify-center gap-2 bg-[rgba(248,113,113,0.08)] text-[#f87171] border border-[rgba(248,113,113,0.15)]"
                      >
                        <BellOff className="w-4 h-4" />
                        Desactiver
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEnablePush}
                      disabled={checkingPush}
                      className="w-full h-11 rounded-lg text-[14px] font-medium transition-all duration-150 hover:bg-[#6a79db] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 bg-[#5e6dd2] text-white shadow-[0_0_0_1px_rgba(94,109,210,0.5)]"
                    >
                      {checkingPush ? (
                        <>
                          <motion.div
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          />
                          Verification...
                        </>
                      ) : (
                        <>
                          <Bell className="w-4 h-4" />
                          Activer les notifications Push
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="push-not-supported"
                variants={itemVariants}
                className="rounded-xl p-5 mb-6 bg-[rgba(245,166,35,0.08)] border border-[rgba(245,166,35,0.15)]"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-[rgba(245,166,35,0.1)]">
                    <AlertCircle className="w-5 h-5 text-[#f5a623]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-medium text-[#f5a623] mb-1">
                      Push non disponibles
                    </h3>
                    <p className="text-[13px] text-[#8b8d90] leading-relaxed">
                      Votre navigateur ne supporte pas les notifications push ou elles sont desactivees.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Push Notifications Section */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl p-5 mb-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]"
          >
            <SectionHeader
              icon={<Smartphone className="w-4 h-4 text-[#5e6dd2]" strokeWidth={1.5} />}
              iconBg="rgba(94, 109, 210, 0.1)"
              title="Notifications Push"
              subtitle="Rappels sur votre appareil"
            />

            <div className="divide-y divide-[rgba(255,255,255,0.04)]">
              <SettingRow
                icon={<Clock className="w-4 h-4" strokeWidth={1.5} />}
                iconColor="#ff9f0a"
                title="Rappel J-1 (24h)"
                description="Alerte la veille de la session"
                enabled={settings.pushReminder24h}
                onToggle={() => handleToggle('pushReminder24h')}
              />

              <SettingRow
                icon={<Zap className="w-4 h-4" strokeWidth={1.5} />}
                iconColor="#ff453a"
                title="Rappel H-1 (1h)"
                description="Dernier rappel avant le debut"
                enabled={settings.pushReminder1h}
                onToggle={() => handleToggle('pushReminder1h')}
              />

              <SettingRow
                icon={<Users className="w-4 h-4" strokeWidth={1.5} />}
                iconColor="#5e6ad2"
                title="Smart Nudges"
                description="Alertes 'Il manque un joueur !'"
                enabled={settings.smartNudges}
                onToggle={() => handleToggle('smartNudges')}
              />
            </div>
          </motion.div>

          {/* Email Section */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl p-5 mb-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]"
          >
            <SectionHeader
              icon={<Mail className="w-4 h-4 text-[#8b93ff]" strokeWidth={1.5} />}
              iconBg="rgba(139, 147, 255, 0.1)"
              title="Email"
              subtitle="Recapitulatifs par email"
            />

            <SettingRow
              icon={<Mail className="w-4 h-4" strokeWidth={1.5} />}
              iconColor="#30d158"
              title="Recapitulatif Session"
              description="Details envoyes 24h avant"
              enabled={settings.emailReminder24h}
              onToggle={() => handleToggle('emailReminder24h')}
            />
          </motion.div>

          {/* Save Button */}
          <motion.button
            variants={itemVariants}
            onClick={handleSave}
            disabled={saving}
            className="w-full h-11 rounded-lg text-[14px] font-medium transition-all duration-150 hover:bg-[#6a79db] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 bg-[#5e6dd2] text-white shadow-[0_0_0_1px_rgba(94,109,210,0.5)]"
            whileTap={{ scale: 0.98 }}
          >
            {saving ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" strokeWidth={1.5} />
                Enregistrer les preferences
              </>
            )}
          </motion.button>

          {/* Bottom Spacer for mobile nav */}
          <div className="h-6" />
        </motion.div>
      </div>
    </div>
  );
}

export default NotificationSettingsScreen;
