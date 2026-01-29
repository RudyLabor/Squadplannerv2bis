import { ArrowLeft, Eye, Shield, Users, Lock, Globe, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface PrivacyScreenProps {
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

interface PrivacyToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

function PremiumToggle({ enabled, onToggle }: PrivacyToggleProps) {
  return (
    <motion.button
      onClick={onToggle}
      className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
        enabled
          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30'
          : 'bg-gray-200'
      }`}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`absolute top-1 w-6 h-6 rounded-full shadow-md flex items-center justify-center ${
          enabled ? 'bg-white' : 'bg-white'
        }`}
        animate={{ x: enabled ? 28 : 4 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {enabled && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" strokeWidth={2.5} />
          </motion.div>
        )}
      </motion.div>
    </motion.button>
  );
}

export function PrivacyScreen({ onNavigate, showToast }: PrivacyScreenProps) {
  const [settings, setSettings] = useState({
    profileVisible: true,
    showStats: true,
    allowInvites: true,
    showOnlineStatus: true,
    shareActivity: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    showToast('Paramètre enregistré', 'success');
  };

  const privacySettings = [
    {
      key: 'profileVisible' as const,
      icon: Eye,
      title: 'Profil public',
      description: 'Votre profil est visible par tous les joueurs',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      key: 'showStats' as const,
      icon: Shield,
      title: 'Statistiques visibles',
      description: 'Afficher vos stats et score de fiabilité',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      key: 'allowInvites' as const,
      icon: Users,
      title: 'Invitations de squads',
      description: 'Recevoir des invitations de nouvelles squads',
      gradient: 'from-blue-500 to-indigo-500',
    },
    {
      key: 'showOnlineStatus' as const,
      icon: Globe,
      title: 'Statut en ligne',
      description: 'Afficher quand vous êtes actif',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      key: 'shareActivity' as const,
      icon: Lock,
      title: 'Partager l\'activité',
      description: 'Partager vos sessions avec vos contacts',
      gradient: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
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
                Confidentialité
              </h1>
              <p className="text-sm text-gray-500 font-medium mt-0.5">
                Contrôlez vos données et votre visibilité
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Shield className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Privacy Settings */}
          <div className="space-y-3">
            {privacySettings.map((setting, index) => {
              const Icon = setting.icon;
              const isEnabled = settings[setting.key];

              return (
                <motion.div
                  key={setting.key}
                  variants={itemVariants}
                  custom={index}
                  className={`bg-white/80 backdrop-blur-sm rounded-2xl p-5 border shadow-lg hover:shadow-xl transition-all duration-300 ${
                    isEnabled ? 'border-indigo-200/50' : 'border-white/50'
                  }`}
                  whileHover={{ scale: 1.01, y: -2 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <motion.div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isEnabled
                            ? `bg-gradient-to-br ${setting.gradient} shadow-lg`
                            : 'bg-gray-100'
                        }`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Icon
                          className={`w-6 h-6 ${isEnabled ? 'text-white' : 'text-gray-400'}`}
                          strokeWidth={2}
                        />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-semibold mb-1 ${
                          isEnabled ? 'text-gray-800' : 'text-gray-500'
                        }`}>
                          {setting.title}
                        </div>
                        <div className={`text-xs font-medium ${
                          isEnabled ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {setting.description}
                        </div>
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <PremiumToggle
                      enabled={isEnabled}
                      onToggle={() => toggleSetting(setting.key)}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Info Card */}
          <motion.div
            variants={itemVariants}
            className="mt-6"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-lg">
              <div className="flex items-start gap-4">
                <motion.div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Sparkles className="w-6 h-6 text-white" strokeWidth={2} />
                </motion.div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-1">
                    Vos données sont protégées
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Squad Planner ne partage jamais vos données personnelles avec des tiers.
                    Vous contrôlez entièrement votre visibilité.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* GDPR Compliance Badge */}
          <motion.div
            variants={itemVariants}
            className="mt-4"
          >
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl p-4 border border-emerald-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-emerald-800">
                    Conforme RGPD
                  </p>
                  <p className="text-[10px] text-emerald-600 mt-0.5">
                    Vos données sont stockées en Europe
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default PrivacyScreen;
