import { ArrowLeft, Crown, Check, Sparkles, TrendingUp, Calendar, Download, Zap, Shield, Users } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/app/components/ui/Button';

interface PremiumScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function PremiumScreen({ onNavigate, showToast }: PremiumScreenProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [isPremium, setIsPremium] = useState(false);

  const features = [
    {
      icon: Sparkles,
      title: 'Suggestions IA',
      desc: 'Créneaux optimaux basés sur votre historique',
      free: false,
    },
    {
      icon: TrendingUp,
      title: 'Stats avancées',
      desc: 'Analyse détaillée de vos performances',
      free: false,
    },
    {
      icon: Calendar,
      title: 'Historique illimité',
      desc: 'Accès à toutes vos sessions passées',
      free: false,
    },
    {
      icon: Download,
      title: 'Export calendrier',
      desc: 'Sync Google, Apple, Outlook',
      free: false,
    },
    {
      icon: Zap,
      title: 'Bot Discord avancé',
      desc: 'Automatisation complète Discord',
      free: false,
    },
    {
      icon: Shield,
      title: 'Rôles personnalisés',
      desc: 'Coach, Manager, Capitaine, etc.',
      free: false,
    },
    {
      icon: Users,
      title: 'Squads illimitées',
      desc: 'Créez autant de squads que vous voulez',
      free: true,
    },
  ];

  const handleUpgrade = () => {
    showToast('🎉 Bienvenue dans Premium !', 'success');
    setIsPremium(true);
    setTimeout(() => {
      onNavigate('profile');
    }, 1500);
  };

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-b from-[var(--primary-50)] to-[var(--bg-base)]">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => onNavigate('profile')}
            className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight flex items-center gap-2">
              <Crown className="w-6 h-6 text-[var(--primary-500)]" strokeWidth={2} />
              Squad Planner Premium
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] font-medium">
              Débloquez tout le potentiel de votre squad
            </p>
          </div>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] rounded-3xl p-8 mb-6 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Crown className="w-8 h-8" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Premium</h2>
              <p className="text-sm opacity-90">Pour les squads sérieuses</p>
            </div>
          </div>
          <p className="text-base opacity-90 leading-relaxed">
            Intelligence artificielle, stats avancées, automatisation complète.
            Tout ce dont vous avez besoin pour organiser vos sessions comme des pros.
          </p>
        </div>

        {/* Pricing Toggle */}
        <div className="bg-white rounded-2xl p-2 mb-6 border-[0.5px] border-[var(--border-medium)] shadow-sm flex gap-2">
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`flex-1 h-12 rounded-xl font-semibold text-sm transition-all duration-200 ${
              selectedPlan === 'monthly'
                ? 'bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white shadow-lg shadow-[var(--primary-500)]/20'
                : 'text-[var(--fg-tertiary)]'
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setSelectedPlan('yearly')}
            className={`flex-1 h-12 rounded-xl font-semibold text-sm transition-all duration-200 relative ${
              selectedPlan === 'yearly'
                ? 'bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white shadow-lg shadow-[var(--primary-500)]/20'
                : 'text-[var(--fg-tertiary)]'
            }`}
          >
            Annuel
            <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-[var(--success-500)] text-white text-xs rounded-full font-bold">
              -40%
            </span>
          </button>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl p-6 mb-6 border-[0.5px] border-[var(--border-subtle)] shadow-md">
          <div className="text-center mb-6">
            <div className="flex items-end justify-center gap-2 mb-2">
              <span className="text-5xl font-bold text-[var(--fg-primary)]">
                {selectedPlan === 'monthly' ? '4,99' : '2,99'}
              </span>
              <span className="text-xl text-[var(--fg-tertiary)] font-semibold mb-2">
                €/mois
              </span>
            </div>
            {selectedPlan === 'yearly' && (
              <p className="text-sm text-[var(--success-600)] font-semibold">
                Soit 35,88 € / an (au lieu de 59,88 €)
              </p>
            )}
          </div>

          <Button
            variant="primary"
            onClick={handleUpgrade}
            className="w-full h-14 bg-gradient-to-r from-[var(--primary-500)] to-[var(--secondary-500)] hover:from-[var(--primary-600)] hover:to-[var(--secondary-600)] text-white rounded-2xl shadow-lg font-bold text-base"
          >
            <Crown className="w-6 h-6" strokeWidth={2} />
            Passer Premium
          </Button>

          <p className="text-xs text-[var(--fg-tertiary)] text-center mt-3">
            Annulation possible à tout moment • 7 jours d'essai gratuit
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-4">
            Tout ce qui est inclus
          </h3>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                feature.free
                  ? 'bg-[var(--bg-subtle)]'
                  : 'bg-gradient-to-br from-[var(--primary-100)] to-[var(--secondary-100)]'
              }`}>
                <feature.icon className={`w-6 h-6 ${
                  feature.free ? 'text-[var(--fg-tertiary)]' : 'text-[var(--primary-500)]'
                }`} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-[var(--fg-primary)]">
                    {feature.title}
                  </h4>
                  {!feature.free && (
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[var(--primary-500)]/10 to-[var(--primary-600)]/10 border border-[var(--primary-500)]/20 text-xs font-bold text-[var(--primary-600)]">
                      PRO
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--fg-tertiary)]">
                  {feature.desc}
                </p>
              </div>
              <Check className="w-5 h-5 text-[var(--success-500)]" strokeWidth={2.5} />
            </motion.div>
          ))}
        </div>

        {/* Premium Tools Access */}
        <div className="bg-gradient-to-br from-[var(--primary-50)] to-[var(--secondary-50)] rounded-2xl p-6 mb-6 border-[0.5px] border-[var(--primary-200)]">
          <h3 className="text-base font-bold text-[var(--fg-primary)] mb-4">
            Outils Premium
          </h3>
          <div className="space-y-3">
            <Button
              variant="ghost"
              onClick={() => onNavigate('advanced-stats')}
              className="w-full h-12 bg-white hover:bg-[var(--bg-muted)] border-[0.5px] border-[var(--border-medium)] rounded-xl font-semibold justify-start"
            >
              <TrendingUp className="w-5 h-5 text-[var(--primary-500)]" strokeWidth={2} />
              Stats Avancées
            </Button>
            <Button
              variant="ghost"
              onClick={() => onNavigate('coaching-tools')}
              className="w-full h-12 bg-white hover:bg-[var(--bg-muted)] border-[0.5px] border-[var(--border-medium)] rounded-xl font-semibold justify-start"
            >
              <Crown className="w-5 h-5 text-[var(--warning-500)]" strokeWidth={2} />
              Coaching Tools
            </Button>
            <Button
              variant="ghost"
              onClick={() => onNavigate('calendar-sync')}
              className="w-full h-12 bg-white hover:bg-[var(--bg-muted)] border-[0.5px] border-[var(--border-medium)] rounded-xl font-semibold justify-start"
            >
              <Calendar className="w-5 h-5 text-[var(--secondary-500)]" strokeWidth={2} />
              Export Calendrier
            </Button>
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-[var(--bg-subtle)] rounded-2xl p-5 border-[0.5px] border-[var(--border-medium)]">
          <h3 className="text-sm font-semibold text-[var(--fg-primary)] mb-3 text-center">
            Ce que disent nos utilisateurs Premium
          </h3>
          <div className="space-y-3">
            <div className="bg-white rounded-xl p-4">
              <p className="text-sm text-[var(--fg-secondary)] mb-2 italic">
                "Les suggestions IA sont incroyables. On a doublé notre fréquence de jeu !"
              </p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[var(--primary-500)]" />
                <span className="text-xs font-semibold text-[var(--fg-tertiary)]">
                  RudyFourcade • Fragsters
                </span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4">
              <p className="text-sm text-[var(--fg-secondary)] mb-2 italic">
                "Export calendrier = game changer. Plus aucune excuse de no-show."
              </p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[var(--secondary-500)]" />
                <span className="text-xs font-semibold text-[var(--fg-tertiary)]">
                  KANA • Apex Legends Squad
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
export default PremiumScreen;
