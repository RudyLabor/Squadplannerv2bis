import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Users, TrendingUp, AlertCircle, Clock, Loader2, Sparkles, Activity, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, SkeletonPage } from '@/design-system';
import { SquadCohesion, generateMockCohesionMetrics, generateMockSquadMembers } from '@/app/components/SquadCohesion';
import { ReliabilityProfile, generateMockReliabilityStats } from '@/app/components/ReliabilityProfile';
import { calculateSquadCohesion, CohesionResult, MemberStats } from '@/utils/cohesion-calculator';
import { useSquads } from '@/app/contexts/SquadsContext';

interface SquadHealthScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  squadId?: string;
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

export function SquadHealthScreen({ onNavigate, showToast, squadId }: SquadHealthScreenProps) {
  const { squads } = useSquads();

  const [isLoading, setIsLoading] = useState(true);
  const [cohesionMetrics, setCohesionMetrics] = useState<CohesionResult | null>(null);
  const [members, setMembers] = useState<MemberStats[]>([]);

  // Trouver le squad actuel
  const currentSquad = squads?.find((s: any) => s.id === squadId) || squads?.[0];

  const squad = {
    id: currentSquad?.id || squadId || 'squad-1',
    name: currentSquad?.name || 'Squad',
    game: currentSquad?.game || 'Gaming',
    avatar: currentSquad?.avatar_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
  };

  // Charger les données de cohésion
  useEffect(() => {
    const loadCohesionData = async () => {
      if (!squad.id || squad.id === 'squad-1') {
        // Utiliser les données mock si pas de squad réel
        setCohesionMetrics(generateMockCohesionMetrics());
        setMembers(generateMockSquadMembers() as MemberStats[]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { cohesion, members: memberStats } = await calculateSquadCohesion(squad.id);
        setCohesionMetrics(cohesion);
        setMembers(memberStats.length > 0 ? memberStats : generateMockSquadMembers() as MemberStats[]);
      } catch (error) {
        console.error('Error loading cohesion data:', error);
        // Fallback aux données mock
        setCohesionMetrics(generateMockCohesionMetrics());
        setMembers(generateMockSquadMembers() as MemberStats[]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCohesionData();
  }, [squad.id]);

  // Données de fiabilité de l'utilisateur
  const userReliability = generateMockReliabilityStats();

  const handleActionClick = (action: string, data?: any) => {
    switch (action) {
      case 'remove':
        showToast('Fonctionnalité "Retirer membre" à venir', 'info');
        break;
      case 'invite':
        onNavigate('join-squad', { squadId: squad.id });
        break;
      case 'schedule':
        onNavigate('propose-session');
        break;
      default:
        showToast('Action détectée', 'info');
    }
  };

  const timeline = [
    {
      id: '1',
      date: 'Il y a 2 jours',
      event: '3 membres ont confirmé leur présence',
      type: 'success',
      icon: TrendingUp,
    },
    {
      id: '2',
      date: 'Il y a 5 jours',
      event: 'HunterAce n\'a pas répondu à 3 sessions',
      type: 'warning',
      icon: AlertCircle,
    },
    {
      id: '3',
      date: 'Il y a 1 semaine',
      event: 'Meilleur taux de présence : 96%',
      type: 'success',
      icon: TrendingUp,
    },
    {
      id: '4',
      date: 'Il y a 2 semaines',
      event: 'Session annulée (manque de joueurs)',
      type: 'error',
      icon: AlertCircle,
    },
  ];

  // Afficher un loader pendant le chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary-50)] via-purple-50 to-pink-50">
        <SkeletonPage />
      </div>
    );
  }

  // Utiliser les métriques calculées ou des valeurs par défaut
  const metrics = cohesionMetrics || generateMockCohesionMetrics();

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return { bg: 'bg-[var(--color-success-100)]', icon: 'bg-[var(--color-success-500)]', text: 'text-[var(--color-success-700)]' };
      case 'warning':
        return { bg: 'bg-[var(--color-warning-100)]', icon: 'bg-[var(--color-warning-500)]', text: 'text-[var(--color-warning-700)]' };
      case 'error':
        return { bg: 'bg-[var(--color-error-100)]', icon: 'bg-[var(--color-error-500)]', text: 'text-[var(--color-error-700)]' };
      default:
        return { bg: 'bg-[var(--bg-subtle)]', icon: 'bg-[var(--fg-secondary)]', text: 'text-[var(--fg-primary)]' };
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-[var(--color-primary-50)] via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations - Static for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[var(--color-error-400)]/20 to-pink-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-[var(--color-primary-400)]/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-success-400)]/15 to-teal-400/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
            <motion.button
              onClick={() => onNavigate('squad-detail')}
              className="w-12 h-12 rounded-2xl bg-[var(--bg-elevated)]/80 backdrop-blur-sm border border-[var(--border-subtle)]/50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[var(--color-error-500)] to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
                <Heart className="w-6 h-6 text-[var(--color-error-500)]" strokeWidth={2} fill="currentColor" />
                Santé de la Squad
              </h1>
              <p className="text-sm text-[var(--fg-secondary)] font-medium">
                {squad.name}
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-error-500)] to-pink-600 flex items-center justify-center shadow-lg shadow-[var(--color-error-500)]/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Activity className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Squad Info Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-[var(--color-primary-500)] to-purple-600 rounded-3xl p-6 mb-6 text-white shadow-xl shadow-[var(--color-primary-500)]/30 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

            <div className="relative z-10 flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-white/30 shadow-lg">
                <img
                  src={squad.avatar}
                  alt={squad.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold tracking-tight mb-1">{squad.name}</h2>
                <div className="flex items-center gap-2 text-sm text-white/90">
                  <Users className="w-4 h-4" strokeWidth={2} />
                  <span>{members.length} membres</span>
                  <span>•</span>
                  <span>{squad.game}</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <div className="text-xs text-white/80 mb-1 font-medium">Diagnostic rapide</div>
              <div className="text-sm font-bold">
                {metrics.score >= 80
                  ? 'Votre squad est en excellente santé'
                  : metrics.score >= 60
                  ? 'Quelques points d\'attention'
                  : 'Action requise pour stabiliser la squad'
                }
              </div>
            </div>
          </motion.div>

          {/* Cohesion Section */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-[var(--color-error-500)]" strokeWidth={2} />
              <h3 className="text-sm font-bold tracking-tight text-[var(--fg-primary)]">
                Cohesion & Dynamique de groupe
              </h3>
            </div>
            <SquadCohesion
              squadId={squad.id}
              squadName={squad.name}
              members={members as any}
              metrics={metrics}
              onActionClick={handleActionClick}
            />
          </motion.div>

          {/* Your Reliability */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-[var(--color-success-500)]" strokeWidth={2} />
              <h3 className="text-sm font-bold tracking-tight text-[var(--fg-primary)]">
                Votre contribution
              </h3>
            </div>
            <ReliabilityProfile stats={userReliability} />
          </motion.div>

          {/* Timeline */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-[var(--color-primary-500)]" strokeWidth={2} />
              <h3 className="text-sm font-bold tracking-tight text-[var(--fg-primary)]">
                Historique recent
              </h3>
            </div>
            <Card variant="elevated" padding="lg" className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm border border-[var(--border-subtle)]/50">
              <div className="space-y-4">
                {timeline.map((item, index) => {
                  const styles = getTypeStyles(item.type);
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <motion.div
                        className={`w-10 h-10 rounded-xl ${styles.bg} flex items-center justify-center flex-shrink-0`}
                        whileHover={{ scale: 1.1 }}
                      >
                        <Icon className={`w-5 h-5 ${styles.text}`} strokeWidth={2} />
                      </motion.div>
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="text-sm font-semibold text-[var(--fg-primary)] mb-0.5">
                          {item.event}
                        </div>
                        <div className="text-xs text-[var(--fg-secondary)] font-medium">
                          {item.date}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Action CTA */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('intelligence')}
            className="w-full bg-gradient-to-r from-[var(--color-primary-500)] to-purple-600 rounded-2xl p-5 text-white shadow-xl shadow-[var(--color-primary-500)]/30 hover:shadow-2xl transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 text-left">
                <div className="text-base font-bold mb-1">
                  Voir les recommandations IA
                </div>
                <div className="text-sm text-white/90">
                  Découvrez comment optimiser votre planning
                </div>
              </div>
              <motion.div
                className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Sparkles className="w-6 h-6" strokeWidth={2} />
              </motion.div>
            </div>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
export default SquadHealthScreen;
