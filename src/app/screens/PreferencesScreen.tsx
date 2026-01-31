/**
 * PREFERENCES SCREEN - LINEAR DESIGN SYSTEM
 * Premium, Dark, Minimal - User preferences
 */

import { ArrowLeft, Globe, Clock, Timer, Zap, Settings2, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface PreferencesScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

// Linear-style animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.15,
      when: "beforeChildren",
      staggerChildren: 0.05
    }
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

interface OptionCardProps {
  selected: boolean;
  onClick: () => void;
  label: string;
  sublabel?: string;
  accentColor?: string;
}

function OptionCard({ selected, onClick, label, sublabel, accentColor = '#5e6dd2' }: OptionCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative p-4 rounded-xl border transition-all duration-150 text-left ${
        selected
          ? 'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.12)]'
          : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)]'
      }`}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Selected indicator */}
      {selected && (
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r-full"
          style={{ backgroundColor: accentColor }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <div className={`text-[13px] font-medium ${
            selected ? 'text-[#f7f8f8]' : 'text-[#8b8d90]'
          }`}>
            {label}
          </div>
          {sublabel && (
            <div className={`text-[11px] mt-0.5 ${
              selected ? 'text-[#8b8d90]' : 'text-[#5e6063]'
            }`}>
              {sublabel}
            </div>
          )}
        </div>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-5 h-5 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${accentColor}20` }}
          >
            <Check className="w-3 h-3" style={{ color: accentColor }} strokeWidth={2.5} />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}

interface PreferenceSectionProps {
  icon: React.ElementType;
  title: string;
  iconColor: string;
  children: React.ReactNode;
}

function PreferenceSection({ icon: Icon, title, iconColor, children }: PreferenceSectionProps) {
  return (
    <motion.div variants={itemVariants} className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${iconColor}15` }}
        >
          <Icon className="w-[18px] h-[18px]" style={{ color: iconColor }} strokeWidth={1.5} />
        </div>
        <h2 className="text-[14px] font-medium text-[#f7f8f8]">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

export function PreferencesScreen({ onNavigate, showToast }: PreferencesScreenProps) {
  const [preferences, setPreferences] = useState({
    language: 'fr',
    timezone: 'Europe/Paris',
    defaultDuration: 120,
    animations: true,
  });

  const languages = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
  ];

  const timezones = [
    { value: 'Europe/Paris', label: 'Paris', sublabel: 'GMT+1' },
    { value: 'Europe/London', label: 'Londres', sublabel: 'GMT+0' },
    { value: 'America/New_York', label: 'New York', sublabel: 'GMT-5' },
    { value: 'America/Los_Angeles', label: 'Los Angeles', sublabel: 'GMT-8' },
  ];

  const durations = [
    { value: 60, label: '1h' },
    { value: 90, label: '1h30' },
    { value: 120, label: '2h' },
    { value: 180, label: '3h' },
    { value: 240, label: '4h' },
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
                Preferences
              </h1>
              <p className="text-[13px] text-[#5e6063] mt-0.5">
                Personnalisez votre experience
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[rgba(94,109,210,0.1)] flex items-center justify-center">
              <Settings2 className="w-5 h-5 text-[#5e6dd2]" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Language Selection */}
          <PreferenceSection icon={Globe} title="Langue de l'application" iconColor="#60a5fa">
            <div className="grid grid-cols-3 gap-2">
              {languages.map((lang) => (
                <OptionCard
                  key={lang.code}
                  selected={preferences.language === lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  label={lang.label}
                  accentColor="#60a5fa"
                />
              ))}
            </div>
          </PreferenceSection>

          {/* Timezone Selection */}
          <PreferenceSection icon={Clock} title="Fuseau horaire" iconColor="#f5a623">
            <div className="grid grid-cols-2 gap-2">
              {timezones.map((tz) => (
                <OptionCard
                  key={tz.value}
                  selected={preferences.timezone === tz.value}
                  onClick={() => handleTimezoneChange(tz.value)}
                  label={tz.label}
                  sublabel={tz.sublabel}
                  accentColor="#f5a623"
                />
              ))}
            </div>
          </PreferenceSection>

          {/* Default Duration */}
          <PreferenceSection icon={Timer} title="Durée de session par défaut" iconColor="#4ade80">
            <div className="grid grid-cols-5 gap-2">
              {durations.map((duration) => (
                <OptionCard
                  key={duration.value}
                  selected={preferences.defaultDuration === duration.value}
                  onClick={() => handleDurationChange(duration.value)}
                  label={duration.label}
                  accentColor="#4ade80"
                />
              ))}
            </div>
          </PreferenceSection>

          {/* Animations Toggle */}
          <motion.div variants={itemVariants} className="mb-6">
            <motion.div
              className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4"
              whileHover={{ borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[rgba(139,147,255,0.1)] flex items-center justify-center">
                    <Zap className="w-[18px] h-[18px] text-[#8b93ff]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-[14px] text-[#f7f8f8] font-medium">
                      Animations
                    </div>
                    <div className="text-[12px] text-[#5e6063]">
                      Effets visuels et transitions fluides
                    </div>
                  </div>
                </div>

                {/* Linear-style Toggle Switch */}
                <button
                  onClick={toggleAnimations}
                  className={`relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0 ${
                    preferences.animations
                      ? 'bg-[#5e6dd2]'
                      : 'bg-[#26282d]'
                  }`}
                >
                  <motion.div
                    className={`absolute top-0.5 w-5 h-5 rounded-full shadow-sm ${
                      preferences.animations ? 'bg-white' : 'bg-[#6b6f76]'
                    }`}
                    animate={{ x: preferences.animations ? 22 : 2 }}
                    transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* Info Card */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl p-4 bg-[rgba(94,109,210,0.08)] border border-[rgba(94,109,210,0.2)]"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[rgba(94,109,210,0.15)] flex items-center justify-center flex-shrink-0">
                <Settings2 className="w-[18px] h-[18px] text-[#8b93ff]" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-medium text-[#f7f8f8] mb-1">
                  Synchronisation automatique
                </div>
                <div className="text-[12px] text-[#8b8d90] leading-relaxed">
                  Vos préférences sont synchronisées sur tous vos appareils.
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default PreferencesScreen;
