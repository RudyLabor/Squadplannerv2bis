import { ArrowLeft, Eye, Shield, Users, Lock, Globe, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface PrivacyScreenProps {
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

interface PrivacyToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

// Linear-style toggle switch
function LinearToggle({ enabled, onToggle }: PrivacyToggleProps) {
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
                Confidentialite
              </h1>
              <p className="text-[13px] text-[#5e6063] mt-0.5">
                Controlez vos donnees et votre visibilite
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[rgba(94,109,210,0.1)] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#5e6dd2]" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Privacy Settings Section */}
          <motion.div variants={itemVariants} className="mb-4">
            <h2 className="text-[11px] font-semibold text-[#5e6063] uppercase tracking-[0.5px] mb-3 px-1">
              Parametres de confidentialite
            </h2>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-[rgba(255,255,255,0.02)] rounded-xl border border-[rgba(255,255,255,0.04)] overflow-hidden"
          >
            {privacySettings.map((setting, index) => {
              const Icon = setting.icon;
              const isEnabled = settings[setting.key];
              const isLast = index === privacySettings.length - 1;

              return (
                <div
                  key={setting.key}
                  className={`flex items-center justify-between p-4 ${
                    !isLast ? 'border-b border-[rgba(255,255,255,0.04)]' : ''
                  } hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-150`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isEnabled
                        ? 'bg-[rgba(94,109,210,0.1)] text-[#5e6dd2]'
                        : 'bg-[rgba(255,255,255,0.03)] text-[#5e6063]'
                    }`}>
                      <Icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[14px] font-medium ${
                        isEnabled ? 'text-[#f7f8f8]' : 'text-[#8b8d90]'
                      }`}>
                        {setting.title}
                      </div>
                      <div className="text-[12px] text-[#5e6063] mt-0.5 truncate">
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
            <h2 className="text-[11px] font-semibold text-[#5e6063] uppercase tracking-[0.5px] mb-3 px-1">
              A propos
            </h2>
            <div className="bg-[rgba(255,255,255,0.02)] rounded-xl border border-[rgba(255,255,255,0.04)] p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[rgba(94,109,210,0.1)] flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-[18px] h-[18px] text-[#5e6dd2]" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-[14px] font-medium text-[#f7f8f8]">
                    Vos donnees sont protegees
                  </h3>
                  <p className="text-[12px] text-[#5e6063] mt-1 leading-relaxed">
                    Squad Planner ne partage jamais vos donnees personnelles avec des tiers.
                    Vous controlez entierement votre visibilite.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* GDPR Compliance Badge */}
          <motion.div variants={itemVariants} className="mt-4">
            <div className="bg-[rgba(255,255,255,0.02)] rounded-xl border border-[rgba(255,255,255,0.04)] p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[rgba(74,222,128,0.1)] flex items-center justify-center">
                  <CheckCircle2 className="w-[18px] h-[18px] text-[#4ade80]" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-[#f7f8f8]">
                    Conforme RGPD
                  </p>
                  <p className="text-[12px] text-[#5e6063] mt-0.5">
                    Vos donnees sont stockees en Europe
                  </p>
                </div>
                <div className="px-2 py-1 bg-[rgba(74,222,128,0.1)] rounded-md">
                  <span className="text-[10px] font-semibold text-[#4ade80] uppercase tracking-[0.5px]">
                    Certifie
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Data Management Section */}
          <motion.div variants={itemVariants} className="mt-6">
            <h2 className="text-[11px] font-semibold text-[#5e6063] uppercase tracking-[0.5px] mb-3 px-1">
              Gestion des donnees
            </h2>
            <div className="bg-[rgba(255,255,255,0.02)] rounded-xl border border-[rgba(255,255,255,0.04)] overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-150 border-b border-[rgba(255,255,255,0.04)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[rgba(255,255,255,0.03)] flex items-center justify-center">
                    <svg className="w-[18px] h-[18px] text-[#5e6063]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </div>
                  <span className="text-[14px] text-[#f7f8f8]">Exporter mes donnees</span>
                </div>
                <svg className="w-4 h-4 text-[#5e6063]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-[rgba(248,113,113,0.04)] transition-colors duration-150">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[rgba(248,113,113,0.08)] flex items-center justify-center">
                    <svg className="w-[18px] h-[18px] text-[#f87171]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </div>
                  <span className="text-[14px] text-[#f87171]">Supprimer mon compte</span>
                </div>
                <svg className="w-4 h-4 text-[#5e6063]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
