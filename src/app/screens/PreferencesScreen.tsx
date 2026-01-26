import { ArrowLeft, Globe, Clock, Gamepad2, Timer, Palette, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Button } from '@/app/components/ui/Button';

interface PreferencesScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function PreferencesScreen({ onNavigate, showToast }: PreferencesScreenProps) {
  const [preferences, setPreferences] = useState({
    language: 'fr',
    timezone: 'Europe/Paris',
    defaultDuration: 120,
    theme: 'dark',
    animations: true,
  });

  const languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ];

  const timezones = [
    { value: 'Europe/Paris', label: 'Paris (GMT+1)' },
    { value: 'Europe/London', label: 'Londres (GMT+0)' },
    { value: 'America/New_York', label: 'New York (GMT-5)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-8)' },
  ];

  const durations = [
    { value: 60, label: '1 heure' },
    { value: 90, label: '1h30' },
    { value: 120, label: '2 heures' },
    { value: 180, label: '3 heures' },
    { value: 240, label: '4 heures' },
  ];

  const handleLanguageChange = (code: string) => {
    setPreferences(prev => ({ ...prev, language: code }));
    showToast('Langue modifiée', 'success');
  };

  const handleTimezoneChange = (timezone: string) => {
    setPreferences(prev => ({ ...prev, timezone }));
    showToast('Fuseau horaire modifié', 'success');
  };

  const handleDurationChange = (duration: number) => {
    setPreferences(prev => ({ ...prev, defaultDuration: duration }));
    showToast('Durée par défaut modifiée', 'success');
  };

  const toggleAnimations = () => {
    setPreferences(prev => ({ ...prev, animations: !prev.animations }));
    showToast(preferences.animations ? 'Animations désactivées' : 'Animations activées', 'success');
  };

  return (
    <div className="min-h-screen pb-24 pt-safe">
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
              Préférences
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] font-medium mt-1">
              Personnalisez votre expérience
            </p>
          </div>
        </div>

        {/* Language Selection */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-[var(--fg-secondary)]" strokeWidth={2} />
            <h2 className="text-sm font-semibold text-[var(--fg-primary)]">
              Langue de l'application
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`p-4 rounded-2xl border-[0.5px] transition-all duration-200 ${
                  preferences.language === lang.code
                    ? 'bg-[var(--primary-50)] border-[var(--primary-500)] shadow-md'
                    : 'bg-white border-[var(--border-subtle)] shadow-sm hover:shadow-md'
                }`}
                whileHover={{ y: -2 }}
              >
                <div className="text-2xl mb-2">{lang.flag}</div>
                <div className={`text-xs font-semibold ${
                  preferences.language === lang.code
                    ? 'text-[var(--primary-500)]'
                    : 'text-[var(--fg-secondary)]'
                }`}>
                  {lang.label}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Timezone Selection */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-[var(--fg-secondary)]" strokeWidth={2} />
            <h2 className="text-sm font-semibold text-[var(--fg-primary)]">
              Fuseau horaire
            </h2>
          </div>
          <div className="space-y-2">
            {timezones.map((tz) => (
              <motion.button
                key={tz.value}
                onClick={() => handleTimezoneChange(tz.value)}
                className={`w-full p-4 rounded-2xl border-[0.5px] transition-all duration-200 text-left ${
                  preferences.timezone === tz.value
                    ? 'bg-[var(--primary-50)] border-[var(--primary-500)] shadow-md'
                    : 'bg-white border-[var(--border-subtle)] shadow-sm hover:shadow-md'
                }`}
                whileHover={{ y: -2 }}
              >
                <div className={`text-sm font-semibold ${
                  preferences.timezone === tz.value
                    ? 'text-[var(--primary-500)]'
                    : 'text-[var(--fg-primary)]'
                }`}>
                  {tz.label}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Default Session Duration */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Timer className="w-5 h-5 text-[var(--fg-secondary)]" strokeWidth={2} />
            <h2 className="text-sm font-semibold text-[var(--fg-primary)]">
              Durée de session par défaut
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {durations.map((duration) => (
              <motion.button
                key={duration.value}
                onClick={() => handleDurationChange(duration.value)}
                className={`p-4 rounded-2xl border-[0.5px] transition-all duration-200 ${
                  preferences.defaultDuration === duration.value
                    ? 'bg-[var(--secondary-50)] border-[var(--secondary-500)] shadow-md'
                    : 'bg-white border-[var(--border-subtle)] shadow-sm hover:shadow-md'
                }`}
                whileHover={{ y: -2 }}
              >
                <div className={`text-sm font-semibold ${
                  preferences.defaultDuration === duration.value
                    ? 'text-[var(--secondary-500)]'
                    : 'text-[var(--fg-secondary)]'
                }`}>
                  {duration.label}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Animations Toggle */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 border-[0.5px] border-[var(--border-subtle)] shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--primary-50)] flex items-center justify-center">
                  <Zap className="w-6 h-6 text-[var(--primary-500)]" strokeWidth={2} />
                </div>
                <div>
                  <div className="text-sm text-[var(--fg-primary)] mb-1 font-semibold">
                    Animations
                  </div>
                  <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                    Effets visuels et transitions
                  </div>
                </div>
              </div>
              
              {/* Toggle Switch */}
              <button
                onClick={toggleAnimations}
                className={`relative w-12 h-7 rounded-full transition-all duration-200 flex-shrink-0 ${
                  preferences.animations 
                    ? 'bg-[var(--primary-500)]' 
                    : 'bg-[var(--border-medium)]'
                }`}
              >
                <motion.div
                  className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
                  animate={{ x: preferences.animations ? 25 : 3 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[var(--primary-50)] to-[var(--secondary-50)] rounded-2xl p-5 border-[0.5px] border-[var(--primary-100)]"
        >
          <div className="flex items-start gap-3">
            <Palette className="w-5 h-5 text-[var(--primary-500)] flex-shrink-0 mt-0.5" strokeWidth={2} />
            <div>
              <div className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                Personnalisation complète
              </div>
              <div className="text-xs text-[var(--fg-secondary)] font-medium leading-relaxed">
                Vos préférences sont synchronisées sur tous vos appareils. 
                Changez-les à tout moment selon vos besoins.
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}