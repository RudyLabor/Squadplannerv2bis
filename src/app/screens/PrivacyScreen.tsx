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
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 28 }
  }
};

interface PrivacyToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

// Linear-style toggle switch
function LinearToggle({ enabled, onToggle }: PrivacyToggleProps) {
  return (
    <motion.button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-all duration-200 ${
        enabled
          ? 'bg-[#5e6ad2]'
          : 'bg-[#26282d]'
      }`}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`absolute top-0.5 w-5 h-5 rounded-full shadow-sm ${
          enabled ? 'bg-white' : 'bg-[#6b6f76]'
        }`}
        animate={{ x: enabled ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
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
    showToast('Parametre enregistre', 'success');
  };

  const privacySettings = [
    {
      key: 'profileVisible' as const,
      icon: Eye,
      title: 'Profil public',
      description: 'Votre profil est visible par tous les joueurs',
    },
    {
      key: 'showStats' as const,
      icon: Shield,
      title: 'Statistiques visibles',
      description: 'Afficher vos stats et score de fiabilite',
    },
    {
      key: 'allowInvites' as const,
      icon: Users,
      title: 'Invitations de squads',
      description: 'Recevoir des invitations de nouvelles squads',
    },
    {
      key: 'showOnlineStatus' as const,
      icon: Globe,
      title: 'Statut en ligne',
      description: 'Afficher quand vous etes actif',
    },
    {
      key: 'shareActivity' as const,
      icon: Lock,
      title: 'Partager l\'activite',
      description: 'Partager vos sessions avec vos contacts',
    },
  ];

  return (
    <div className="min-h-screen pb-24 pt-safe bg-[#08090a]">
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <motion.button
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 rounded-lg bg-[#1a1b1e] border border-[#26282d] flex items-center justify-center hover:bg-[#26282d] transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-5 h-5 text-[#f5f5f5]" strokeWidth={1.5} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-[#f5f5f5] tracking-tight">
                Confidentialite
              </h1>
              <p className="text-sm text-[#6b6f76] mt-0.5">
                Controlez vos donnees et votre visibilite
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#5e6ad2]/10 border border-[#5e6ad2]/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#5e6ad2]" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Privacy Settings Section */}
          <motion.div variants={itemVariants} className="mb-4">
            <h2 className="text-xs font-medium text-[#6b6f76] uppercase tracking-wider mb-3 px-1">
              Parametres de confidentialite
            </h2>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-[#1a1b1e] rounded-xl border border-[#26282d] overflow-hidden"
          >
            {privacySettings.map((setting, index) => {
              const Icon = setting.icon;
              const isEnabled = settings[setting.key];
              const isLast = index === privacySettings.length - 1;

              return (
                <div
                  key={setting.key}
                  className={`flex items-center justify-between p-4 ${
                    !isLast ? 'border-b border-[#26282d]' : ''
                  } hover:bg-[#26282d]/30 transition-colors`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isEnabled
                        ? 'bg-[#5e6ad2]/10 text-[#5e6ad2]'
                        : 'bg-[#26282d] text-[#6b6f76]'
                    }`}>
                      <Icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium ${
                        isEnabled ? 'text-[#f5f5f5]' : 'text-[#8b8f96]'
                      }`}>
                        {setting.title}
                      </div>
                      <div className="text-xs text-[#6b6f76] mt-0.5 truncate">
                        {setting.description}
                      </div>
                    </div>
                  </div>

                  <LinearToggle
                    enabled={isEnabled}
                    onToggle={() => toggleSetting(setting.key)}
                  />
                </div>
              );
            })}
          </motion.div>

          {/* Info Card */}
          <motion.div variants={itemVariants} className="mt-6">
            <h2 className="text-xs font-medium text-[#6b6f76] uppercase tracking-wider mb-3 px-1">
              A propos
            </h2>
            <div className="bg-[#1a1b1e] rounded-xl border border-[#26282d] p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#5e6ad2]/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-[18px] h-[18px] text-[#5e6ad2]" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-[#f5f5f5]">
                    Vos donnees sont protegees
                  </h3>
                  <p className="text-xs text-[#6b6f76] mt-1 leading-relaxed">
                    Squad Planner ne partage jamais vos donnees personnelles avec des tiers.
                    Vous controlez entierement votre visibilite.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* GDPR Compliance Badge */}
          <motion.div variants={itemVariants} className="mt-4">
            <div className="bg-[#1a1b1e] rounded-xl border border-[#26282d] p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#26a969]/10 flex items-center justify-center">
                  <CheckCircle2 className="w-[18px] h-[18px] text-[#26a969]" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#f5f5f5]">
                    Conforme RGPD
                  </p>
                  <p className="text-xs text-[#6b6f76] mt-0.5">
                    Vos donnees sont stockees en Europe
                  </p>
                </div>
                <div className="px-2 py-1 bg-[#26a969]/10 rounded-md">
                  <span className="text-[10px] font-medium text-[#26a969] uppercase tracking-wider">
                    Certifie
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Data Management Section */}
          <motion.div variants={itemVariants} className="mt-6">
            <h2 className="text-xs font-medium text-[#6b6f76] uppercase tracking-wider mb-3 px-1">
              Gestion des donnees
            </h2>
            <div className="bg-[#1a1b1e] rounded-xl border border-[#26282d] overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 hover:bg-[#26282d]/30 transition-colors border-b border-[#26282d]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#26282d] flex items-center justify-center">
                    <svg className="w-[18px] h-[18px] text-[#6b6f76]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </div>
                  <span className="text-sm text-[#f5f5f5]">Exporter mes donnees</span>
                </div>
                <svg className="w-4 h-4 text-[#6b6f76]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-[#26282d]/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#f04438]/10 flex items-center justify-center">
                    <svg className="w-[18px] h-[18px] text-[#f04438]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </div>
                  <span className="text-sm text-[#f04438]">Supprimer mon compte</span>
                </div>
                <svg className="w-4 h-4 text-[#6b6f76]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default PrivacyScreen;
