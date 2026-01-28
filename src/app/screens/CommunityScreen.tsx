import { ArrowLeft, Globe, Users, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface CommunityScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function CommunityScreen({ onNavigate, showToast }: CommunityScreenProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] pb-20">
      <div className="sticky top-0 z-10 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={() => onNavigate?.('home')} className="p-2 hover:bg-[var(--background-elevated)] rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" strokeWidth={2} />
          </button>
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">Communauté</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] mb-4 shadow-lg">
            <Globe className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Multi-Squads</h2>
          <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto">
            Gérez plusieurs squads dans une communauté unifiée
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-[var(--primary-50)] to-[var(--secondary-50)] rounded-2xl p-5 text-center">
          <Users className="w-10 h-10 text-[var(--primary-600)] mx-auto mb-3" strokeWidth={2} />
          <div className="text-3xl font-bold text-[var(--primary-700)] mb-1">3</div>
          <div className="text-sm text-[var(--text-secondary)]">Squads actives</div>
        </motion.div>

        <div className="space-y-3">
          {['Squad Alpha', 'Squad Beta', 'Squad Gamma'].map((name, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.05 }} className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-medium)] shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-[var(--text-primary)]">{name}</h4>
                  <p className="text-sm text-[var(--text-secondary)]">6 membres • Actif</p>
                </div>
                <button onClick={() => onNavigate?.('squad-detail')} className="px-3 py-1.5 bg-[var(--primary-600)] text-white rounded-lg text-xs font-medium hover:bg-[var(--primary-700)] transition-colors">
                  Ouvrir
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-center">
          <button onClick={() => showToast?.('Accès réservé Premium', 'info')} className="px-6 py-3 bg-[var(--primary-600)] text-white rounded-xl font-medium hover:bg-[var(--primary-700)] transition-colors">
            Créer une nouvelle squad
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default CommunityScreen;
