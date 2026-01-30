import { ArrowLeft, Globe, Clock, Timer, Palette, Zap, Sparkles, Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface PreferencesScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
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

interface PremiumOptionCardProps {
  selected: boolean;
  onClick: () => void;
  icon?: string;
  label: string;
  sublabel?: string;
  gradient: string;
}

function PremiumOptionCard({ selected, onClick, icon, label, sublabel, gradient }: PremiumOptionCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative p-4 rounded-2xl border transition-all duration-300 overflow-hidden ${
        selected
          ? 'border-white/50 shadow-lg'
          : 'bg-white/80 backdrop-blur-sm border-white/30 shadow-sm hover:shadow-md hover:border-white/50'
      }`}
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {selected && (
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      <div className="relative z-10">
        {icon && <div className="text-2xl mb-2">{icon}</div>}
        <div className={`text-sm font-semibold ${
          selected ? 'text-white' : 'text-gray-700'
        }`}>
          {label}
        </div>
        {sublabel && (
          <div className={`text-xs mt-1 ${
            selected ? 'text-white/80' : 'text-gray-500'
          }`}>
            {sublabel}
          </div>
        )}
      </div>
      {selected && (
        <motion.div
          className="absolute top-2 right-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
        >
          <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </motion.div>
      )}
    </motion.button>
  );
}

interface PreferenceSectionProps {
  icon: React.ElementType;
  title: string;
  iconGradient: string;
  children: React.ReactNode;
}

function PreferenceSection({ icon: Icon, title, iconGradient, children }: PreferenceSectionProps) {
  return (
    <motion.div variants={itemVariants} className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${iconGradient} flex items-center justify-center shadow-md`}>
          <Icon className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
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
    theme: 'dark',
    animations: true,
  });

  const languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
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
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <motion.button
              onClick={() => onNavigate('profile')}
              className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Préférences
              </h1>
              <p className="text-sm text-gray-500 font-medium mt-0.5">
                Personnalisez votre expérience
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
              <Settings2 className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
          </motion.div>

          {/* Language Selection */}
          <PreferenceSection icon={Globe} title="Langue de l'application" iconGradient="from-blue-500 to-cyan-500">
            <div className="grid grid-cols-3 gap-3">
              {languages.map((lang) => (
                <PremiumOptionCard
                  key={lang.code}
                  selected={preferences.language === lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  icon={lang.flag}
                  label={lang.label}
                  gradient="from-blue-500 to-cyan-500"
                />
              ))}
            </div>
          </PreferenceSection>

          {/* Timezone Selection */}
          <PreferenceSection icon={Clock} title="Fuseau horaire" iconGradient="from-amber-500 to-orange-500">
            <div className="grid grid-cols-2 gap-3">
              {timezones.map((tz) => (
                <PremiumOptionCard
                  key={tz.value}
                  selected={preferences.timezone === tz.value}
                  onClick={() => handleTimezoneChange(tz.value)}
                  label={tz.label}
                  sublabel={tz.sublabel}
                  gradient="from-amber-500 to-orange-500"
                />
              ))}
            </div>
          </PreferenceSection>

          {/* Default Duration */}
          <PreferenceSection icon={Timer} title="Durée de session par défaut" iconGradient="from-emerald-500 to-teal-500">
            <div className="grid grid-cols-5 gap-2">
              {durations.map((duration) => (
                <PremiumOptionCard
                  key={duration.value}
                  selected={preferences.defaultDuration === duration.value}
                  onClick={() => handleDurationChange(duration.value)}
                  label={duration.label}
                  gradient="from-emerald-500 to-teal-500"
                />
              ))}
            </div>
          </PreferenceSection>

          {/* Animations Toggle */}
          <motion.div variants={itemVariants} className="mb-8">
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-lg"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-md">
                    <Zap className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-800 font-semibold">
                      Animations
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      Effets visuels et transitions fluides
                    </div>
                  </div>
                </div>

                {/* Premium Toggle Switch */}
                <button
                  onClick={toggleAnimations}
                  className={`relative w-14 h-8 rounded-full transition-all duration-300 flex-shrink-0 ${
                    preferences.animations
                      ? 'bg-gradient-to-r from-violet-500 to-purple-500 shadow-lg shadow-purple-500/30'
                      : 'bg-gray-300'
                  }`}
                >
                  <motion.div
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
                    animate={{ x: preferences.animations ? 28 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    {preferences.animations && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Sparkles className="w-3 h-3 text-purple-500" />
                      </motion.div>
                    )}
                  </motion.div>
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* Info Card */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <div className="text-base font-semibold text-white mb-1">
                  Personnalisation complète
                </div>
                <div className="text-sm text-white/80 leading-relaxed">
                  Vos préférences sont synchronisées sur tous vos appareils.
                  Changez-les à tout moment selon vos besoins.
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
