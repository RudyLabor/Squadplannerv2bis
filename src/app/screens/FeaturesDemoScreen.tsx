import { ArrowLeft, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface FeaturesDemoScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function FeaturesDemoScreen({ onNavigate }: FeaturesDemoScreenProps) {
  const features = [
    'Créer des squads illimitées',
    'Proposer des sessions de jeu',
    'Système RSVP avec notifications',
    'Suivi de fiabilité des joueurs',
    'Support multi-jeux',
    'Gestion des fuseaux horaires',
  ];

  return (
    <div className="min-h-screen pb-24 pt-safe">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={() => onNavigate('home')}
            className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
          </button>
          <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
            Fonctionnalités
          </h1>
        </div>

        {/* Features List */}
        <div className="space-y-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-5 flex items-center gap-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200"
              whileHover={{ y: -2 }}
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--primary-50)] flex items-center justify-center">
                <Check className="w-5 h-5 text-[var(--primary-500)]" strokeWidth={2.5} />
              </div>
              <span className="text-sm text-[var(--fg-primary)] font-semibold">
                {feature}
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
export default FeaturesDemoScreen;
