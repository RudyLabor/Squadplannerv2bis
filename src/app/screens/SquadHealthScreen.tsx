import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Heart, Users, TrendingUp, AlertCircle, Clock, Sparkles, Activity, Shield, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
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
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 28 }
  }
};

export function SquadHealthScreen({ onNavigate, showToast, squadId: propSquadId }: SquadHealthScreenProps) {
  const { squadId: urlSquadId } = useParams<{ squadId: string }>();
  const squadId = propSquadId || urlSquadId;
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
        showToast('Fonctionnalite "Retirer membre" a venir', 'info');
        break;
      case 'invite':
        onNavigate('join-squad', { squadId: squad.id });
        break;
      case 'schedule':
        onNavigate('propose-session');
        break;
      default:
        showToast('Action detectee', 'info');
    }
  };

  const timeline = [
    {
      id: '1',
      date: 'Il y a 2 jours',
      event: '3 membres ont confirme leur presence',
      type: 'success',
      icon: TrendingUp,
    },
    {
      id: '2',
      date: 'Il y a 5 jours',
      event: 'HunterAce n\'a pas repondu a 3 sessions',
      type: 'warning',
      icon: AlertCircle,
    },
    {
      id: '3',
      date: 'Il y a 1 semaine',
      event: 'Meilleur taux de presence : 96%',
      type: 'success',
      icon: TrendingUp,
    },
    {
      id: '4',
      date: 'Il y a 2 semaines',
      event: 'Session annulee (manque de joueurs)',
      type: 'error',
      icon: AlertCircle,
    },
  ];

  // Afficher un loader pendant le chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090a] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-10 h-10 border-2 border-[#5e6dd2] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#8b8d90] text-sm">Chargement...</p>
        </motion.div>
      </div>
    );
  }

  // Utiliser les métriques calculées ou des valeurs par défaut
  const metrics = cohesionMetrics || generateMockCohesionMetrics();

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-[rgba(34,197,94,0.1)]',
          border: 'border-[rgba(34,197,94,0.2)]',
          icon: 'text-[#22c55e]',
          text: 'text-[#22c55e]'
        };
      case 'warning':
        return {
          bg: 'bg-[rgba(245,158,11,0.1)]',
          border: 'border-[rgba(245,158,11,0.2)]',
          icon: 'text-[#f59e0b]',
          text: 'text-[#f59e0b]'
        };
      case 'error':
        return {
          bg: 'bg-[rgba(239,68,68,0.1)]',
          border: 'border-[rgba(239,68,68,0.2)]',
          icon: 'text-[#ef4444]',
          text: 'text-[#ef4444]'
        };
      default:
        return {
          bg: 'bg-[rgba(255,255,255,0.02)]',
          border: 'border-[rgba(255,255,255,0.06)]',
          icon: 'text-[#8b8d90]',
          text: 'text-[#f7f8f8]'
        };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#22c55e]';
    if (score >= 60) return 'text-[#f59e0b]';
    return 'text-[#ef4444]';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-[rgba(34,197,94,0.15)]';
    if (score >= 60) return 'bg-[rgba(245,158,11,0.15)]';
    return 'bg-[rgba(239,68,68,0.15)]';
  };

  return (
    <div className="min-h-screen bg-[#08090a] pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
            <motion.button
              onClick={() => onNavigate('squad-detail')}
              className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-[#f7f8f8]" strokeWidth={1.5} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-[#f7f8f8] flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#ef4444]" strokeWidth={1.5} fill="currentColor" />
                Sante de la Squad
              </h1>
              <p className="text-sm text-[#8b8d90]">
                {squad.name}
              </p>
            </div>
            <motion.div
              className="w-10 h-10 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <Activity className="w-5 h-5 text-[#ef4444]" strokeWidth={1.5} />
            </motion.div>
          </motion.div>

          {/* Squad Info Card */}
          <motion.div
            variants={itemVariants}
            className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 mb-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.1)]">
                <img
                  src={squad.avatar}
                  alt={squad.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-[#f7f8f8] mb-1">{squad.name}</h2>
                <div className="flex items-center gap-2 text-sm text-[#8b8d90]">
                  <Users className="w-4 h-4" strokeWidth={1.5} />
                  <span>{members.length} membres</span>
                  <span className="text-[#5e6063]">•</span>
                  <span>{squad.game}</span>
                </div>
              </div>
              <div className={`px-3 py-1.5 rounded-lg ${getScoreBg(metrics.score)}`}>
                <span className={`text-lg font-bold ${getScoreColor(metrics.score)}`}>
                  {metrics.score}%
                </span>
              </div>
            </div>

            <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.04)] rounded-lg p-3">
              <div className="text-xs text-[#5e6063] mb-1 font-medium uppercase tracking-wider">Diagnostic</div>
              <div className="text-sm font-medium text-[#f7f8f8]">
                {metrics.score >= 80
                  ? 'Votre squad est en excellente sante'
                  : metrics.score >= 60
                  ? 'Quelques points d\'attention a surveiller'
                  : 'Action requise pour stabiliser la squad'
                }
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#22c55e] mb-1">{metrics.attendance}%</div>
              <div className="text-xs text-[#5e6063]">Presence</div>
            </div>
            <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#5e6dd2] mb-1">{metrics.engagement}%</div>
              <div className="text-xs text-[#5e6063]">Engagement</div>
            </div>
            <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#f59e0b] mb-1">{metrics.consistency}%</div>
              <div className="text-xs text-[#5e6063]">Regularite</div>
            </div>
          </motion.div>

          {/* Cohesion Section */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-[#ef4444]" strokeWidth={1.5} />
              <h3 className="text-sm font-medium text-[#f7f8f8]">
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
              <Shield className="w-4 h-4 text-[#22c55e]" strokeWidth={1.5} />
              <h3 className="text-sm font-medium text-[#f7f8f8]">
                Votre contribution
              </h3>
            </div>
            <ReliabilityProfile stats={userReliability} />
          </motion.div>

          {/* Timeline */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-[#5e6dd2]" strokeWidth={1.5} />
              <h3 className="text-sm font-medium text-[#f7f8f8]">
                Historique recent
              </h3>
            </div>
            <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
              <div className="space-y-3">
                {timeline.map((item, index) => {
                  const styles = getTypeStyles(item.type);
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <motion.div
                        className={`w-9 h-9 rounded-lg ${styles.bg} border ${styles.border} flex items-center justify-center flex-shrink-0`}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Icon className={`w-4 h-4 ${styles.icon}`} strokeWidth={1.5} />
                      </motion.div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="text-sm text-[#f7f8f8] mb-0.5">
                          {item.event}
                        </div>
                        <div className="text-xs text-[#5e6063]">
                          {item.date}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Action CTA */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onNavigate('intelligence')}
            className="w-full bg-[#5e6dd2] hover:bg-[#6a79db] rounded-xl p-4 text-white transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.15)] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold">
                    Recommandations IA
                  </div>
                  <div className="text-xs text-white/70">
                    Optimisez votre planning
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/60" strokeWidth={1.5} />
            </div>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default SquadHealthScreen;
