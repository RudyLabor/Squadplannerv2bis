import { ArrowLeft, Mail, Smartphone, Save } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { useUser } from '@/app/contexts/UserContext';

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
