/**
 * SQUAD MANAGEMENT SCREEN - LINEAR DESIGN SYSTEM
 * Premium, Dark, Minimal - AI Squad Optimization
 */

import { ArrowLeft, GitBranch, GitMerge, Users, TrendingUp, Brain, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SquadManagementScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

// Linear-style animations
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
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }
  }
};

export function SquadManagementScreen({ onNavigate, showToast }: SquadManagementScreenProps) {
  const squads = [
    { name: 'Squad Alpha', members: 6, activity: 'high' },
    { name: 'Squad Beta', members: 8, activity: 'medium' },
    { name: 'Squad Gamma', members: 4, activity: 'low' },
  ];

  const recommendations = [
    {
      type: 'split',
      title: 'Diviser Squad Beta',
      reason: 'Trop de membres (8), creer deux squads de 4',
      impact: '+30% engagement',
      icon: GitBranch,
    },
    {
      type: 'merge',
      title: 'Fusionner Squad Gamma',
      reason: 'Activite faible, fusionner avec Squad Alpha',
      impact: '+15% fiabilite',
      icon: GitMerge,
    },
  ];

  const getActivityStyle = (activity: string) => {
    switch (activity) {
      case 'high':
        return { color: 'text-[#4ade80]', bg: 'bg-[#4ade80]/10', label: 'Elevee' };
      case 'medium':
        return { color: 'text-[#f5a623]', bg: 'bg-[#f5a623]/10', label: 'Moyenne' };
      case 'low':
        return { color: 'text-[#f87171]', bg: 'bg-[#f87171]/10', label: 'Faible' };
      default:
        return { color: 'text-[#6f7177]', bg: 'bg-[#1e2024]', label: 'Inconnue' };
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-[#0e0f11]">
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
            <motion.button
              onClick={() => onNavigate?.('intelligence')}
              className="w-10 h-10 rounded-xl bg-[#141518] border border-[#1e2024] flex items-center justify-center text-[#8b8d93] hover:text-[#ececed] hover:bg-[#1a1b1f] transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-[20px] font-semibold text-[#ececed] tracking-tight">
                Gestion Squads
              </h1>
              <p className="text-[13px] text-[#6f7177] mt-0.5">
                Optimisation IA
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#5e6ad2] flex items-center justify-center">
              <Users className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center py-8 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5e6ad2] to-[#4f5bc7] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#5e6ad2]/20">
              <Brain className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
            <h2 className="text-[18px] font-semibold text-[#ececed] mb-2">Split & Merge</h2>
            <p className="text-[13px] text-[#6f7177] max-w-sm mx-auto">
              Optimisez la structure de vos squads avec l'IA
            </p>
          </motion.div>

          {/* Squads List */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-[#5e6ad2]" strokeWidth={1.5} />
              <h3 className="text-[13px] font-semibold text-[#ececed] uppercase tracking-wide">
                Vos squads ({squads.length})
              </h3>
            </div>
            <div className="space-y-3">
              {squads.map((squad, index) => {
                const activityStyle = getActivityStyle(squad.activity);
                return (
                  <motion.div
                    key={index}
                    className="p-4 rounded-xl bg-[#141518] border border-[#1e2024] hover:bg-[#1a1b1f] transition-all"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#5e6ad2] flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" strokeWidth={1.5} />
                        </div>
                        <div>
                          <h4 className="text-[14px] font-medium text-[#ececed]">{squad.name}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[12px] text-[#6f7177]">
                              {squad.members} membres
                            </span>
                            <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium ${activityStyle.bg} ${activityStyle.color}`}>
                              {activityStyle.label}
                            </span>
                          </div>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => onNavigate?.('squad-detail')}
                        className="px-3 py-1.5 rounded-lg bg-[#1e2024] text-[#8b8d93] text-[12px] font-medium hover:bg-[#26282d] hover:text-[#ececed] transition-all"
                        whileTap={{ scale: 0.95 }}
                      >
                        Voir
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* AI Recommendations */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-4 h-4 text-[#f5a623]" strokeWidth={1.5} />
              <h3 className="text-[13px] font-semibold text-[#ececed] uppercase tracking-wide">
                Recommandations IA
              </h3>
            </div>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  className="p-5 rounded-xl bg-[#141518] border border-[#1e2024]"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#5e6ad2] flex items-center justify-center flex-shrink-0">
                      <rec.icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[14px] font-medium text-[#ececed] mb-1">{rec.title}</h4>
                      <p className="text-[13px] text-[#6f7177] mb-2">{rec.reason}</p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#4ade80]" strokeWidth={1.5} />
                        <span className="px-2 py-0.5 bg-[#4ade80]/10 text-[#4ade80] text-[11px] font-semibold rounded">
                          {rec.impact}
                        </span>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => showToast?.('Recommandation appliquee', 'success')}
                    className="w-full h-10 flex items-center justify-center gap-2 rounded-lg bg-[#1e2024] text-[#ececed] text-[13px] font-medium hover:bg-[#26282d] transition-all"
                    whileTap={{ scale: 0.98 }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#4ade80]" strokeWidth={1.5} />
                    Appliquer
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Info Banner */}
          <motion.div
            variants={itemVariants}
            className="mt-8 p-5 rounded-xl bg-gradient-to-br from-[#5e6ad2] to-[#4f5bc7] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-white mb-1">
                  IA Squad Optimizer
                </h3>
                <p className="text-[13px] text-white/80 leading-relaxed">
                  Recommandations basees sur l'analyse des patterns d'activite et l'engagement des membres.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default SquadManagementScreen;
