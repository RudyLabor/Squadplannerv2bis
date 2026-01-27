import { ArrowLeft, Eye, EyeOff, Shield, Users, Lock, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';

interface PrivacyScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
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
      iconBg: 'var(--primary-50)',
      iconColor: 'var(--primary-500)',
    },
    {
      key: 'showStats' as const,
      icon: Shield,
      title: 'Statistiques visibles',
      description: 'Afficher vos stats et score de fiabilité',
      iconBg: 'var(--secondary-50)',
      iconColor: 'var(--secondary-500)',
    },
    {
      key: 'allowInvites' as const,
      icon: Users,
      title: 'Invitations de squads',
      description: 'Recevoir des invitations de nouvelles squads',
      iconBg: 'var(--primary-50)',
      iconColor: 'var(--primary-500)',
    },
    {
      key: 'showOnlineStatus' as const,
      icon: Globe,
      title: 'Statut en ligne',
      description: 'Afficher quand vous êtes actif',
      iconBg: 'var(--success-50)',
      iconColor: 'var(--success-500)',
    },
    {
      key: 'shareActivity' as const,
      icon: Lock,
      title: 'Partager l\'activité',
      description: 'Partager vos sessions avec vos contacts',
      iconBg: 'var(--error-50)',
      iconColor: 'var(--error-500)',
    },
  ];

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
              Confidentialité
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] font-medium mt-1">
              Contrôlez vos données et votre visibilité
            </p>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="space-y-3">
          {privacySettings.map((setting, index) => {
            const Icon = setting.icon;
            const isEnabled = settings[setting.key];
            
            return (
              <motion.div
                key={setting.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-5 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: setting.iconBg }}
                    >
                      <Icon 
                        className="w-6 h-6" 
                        strokeWidth={2} 
                        style={{ color: setting.iconColor }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[var(--fg-primary)] mb-1 font-semibold">
                        {setting.title}
                      </div>
                      <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                        {setting.description}
                      </div>
                    </div>
                  </div>
                  
                  {/* Toggle Switch */}
                  <button
                    onClick={() => toggleSetting(setting.key)}
                    className={`relative w-12 h-7 rounded-full transition-all duration-200 flex-shrink-0 ${
                      isEnabled 
                        ? 'bg-[var(--primary-500)]' 
                        : 'bg-[var(--border-medium)]'
                    }`}
                  >
                    <motion.div
                      className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
                      animate={{ x: isEnabled ? 25 : 3 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-gradient-to-br from-[var(--primary-50)] to-[var(--secondary-50)] rounded-2xl p-5 border-[0.5px] border-[var(--primary-100)]"
        >
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-[var(--primary-500)] flex-shrink-0 mt-0.5" strokeWidth={2} />
            <div>
              <div className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                Vos données sont protégées
              </div>
              <div className="text-xs text-[var(--fg-secondary)] font-medium leading-relaxed">
                Squad Planner ne partage jamais vos données personnelles avec des tiers. 
                Vous contrôlez entièrement votre visibilité.
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
export default PrivacyScreen;
