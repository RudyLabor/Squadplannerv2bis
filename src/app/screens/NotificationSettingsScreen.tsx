import { ArrowLeft, Mail, Smartphone, Save, Bell, BellOff, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { useUser } from '@/app/contexts/UserContext';
import { pushNotifications } from '@/utils/push-notifications';

interface NotificationSettingsScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
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
      // Save directly to user profile in Supabase via Context
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
    <div className="min-h-screen pb-24 pt-safe bg-[var(--bg-base)]">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
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
              Gérez vos rappels et alertes
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">

          {/* Web Push Status Section */}
          {pushSupported ? (
            <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${pushEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {pushEnabled ? (
                      <Bell className="w-5 h-5 text-green-600" strokeWidth={2} />
                    ) : (
                      <BellOff className="w-5 h-5 text-gray-500" strokeWidth={2} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--fg-primary)]">
                      {pushEnabled ? 'Notifications Push Activées' : 'Notifications Push'}
                    </h3>
                    <p className="text-xs text-[var(--fg-tertiary)] mt-0.5">
                      {checkingPush ? 'Vérification...' : pushEnabled ? 'Vous recevrez des notifications' : 'Activez pour recevoir des alertes'}
                    </p>
                  </div>
                </div>
                {pushEnabled && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    Actif
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                {pushEnabled ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTestPush}
                      className="flex-1"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Test
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDisablePush}
                      className="flex-1"
                    >
                      <BellOff className="w-4 h-4 mr-2" />
                      Désactiver
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleEnablePush}
                    className="w-full"
                    disabled={checkingPush}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    {checkingPush ? 'Vérification...' : 'Activer les Notifications Push'}
                  </Button>
                )}
              </div>
            </section>
          ) : (
            <section className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
                <div>
                  <h3 className="text-sm font-semibold text-yellow-900 mb-1">
                    Notifications Push non disponibles
                  </h3>
                  <p className="text-xs text-yellow-700">
                    Votre navigateur ne supporte pas les notifications push ou elles sont désactivées dans les paramètres système.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Push Section */}
          <section className="bg-white rounded-2xl p-6 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-[var(--primary-100)] flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-[var(--primary-600)]" strokeWidth={2} />
              </div>
              <h2 className="text-lg font-semibold text-[var(--fg-primary)]">Notifications Push</h2>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-[var(--fg-primary)]">Rappel J-1 (24h)</div>
                  <div className="text-xs text-[var(--fg-tertiary)]">Recevoir une alerte la veille de la session</div>
                </div>
                <div 
                  onClick={() => handleToggle('pushReminder24h')}
                  className={`w-12 h-7 rounded-full transition-colors cursor-pointer relative ${settings.pushReminder24h ? 'bg-[var(--primary-500)]' : 'bg-gray-200'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-1 transition-transform ${settings.pushReminder24h ? 'left-6' : 'left-1'}`} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-[var(--fg-primary)]">Rappel H-1 (1h)</div>
                  <div className="text-xs text-[var(--fg-tertiary)]">Dernier rappel avant le début</div>
                </div>
                <div 
                  onClick={() => handleToggle('pushReminder1h')}
                  className={`w-12 h-7 rounded-full transition-colors cursor-pointer relative ${settings.pushReminder1h ? 'bg-[var(--primary-500)]' : 'bg-gray-200'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-1 transition-transform ${settings.pushReminder1h ? 'left-6' : 'left-1'}`} />
                </div>
              </div>

               <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-[var(--fg-primary)]">Smart Nudges</div>
                  <div className="text-xs text-[var(--fg-tertiary)]">Alertes "Il manque un joueur !"</div>
                </div>
                <div 
                  onClick={() => handleToggle('smartNudges')}
                  className={`w-12 h-7 rounded-full transition-colors cursor-pointer relative ${settings.smartNudges ? 'bg-[var(--primary-500)]' : 'bg-gray-200'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-1 transition-transform ${settings.smartNudges ? 'left-6' : 'left-1'}`} />
                </div>
              </div>
            </div>
          </section>

          {/* Email Section */}
          <section className="bg-white rounded-2xl p-6 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-[var(--secondary-100)] flex items-center justify-center">
                <Mail className="w-5 h-5 text-[var(--secondary-600)]" strokeWidth={2} />
              </div>
              <h2 className="text-lg font-semibold text-[var(--fg-primary)]">Email</h2>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-[var(--fg-primary)]">Récapitulatif Session</div>
                  <div className="text-xs text-[var(--fg-tertiary)]">Détails envoyés 24h avant</div>
                </div>
                <div 
                  onClick={() => handleToggle('emailReminder24h')}
                  className={`w-12 h-7 rounded-full transition-colors cursor-pointer relative ${settings.emailReminder24h ? 'bg-[var(--primary-500)]' : 'bg-gray-200'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-1 transition-transform ${settings.emailReminder24h ? 'left-6' : 'left-1'}`} />
                </div>
              </div>
            </div>
          </section>

          <Button 
            variant="default" 
            onClick={handleSave}
            className="w-full h-12 text-base font-semibold shadow-lg"
          >
            <Save className="w-5 h-5 mr-2" />
            Enregistrer les préférences
          </Button>

        </div>
      </div>
    </div>
  );
}
export default NotificationSettingsScreen;
