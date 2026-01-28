import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Users, TrendingUp, AlertCircle, Clock, Loader2 } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Analyse de la cohésion en cours...</p>
        </div>
      </div>
    );
  }

  // Utiliser les métriques calculées ou des valeurs par défaut
  const metrics = cohesionMetrics || generateMockCohesionMetrics();

  return (
    <div className="min-h-screen pb-24 pt-safe">
      <div className="px-4 py-8 max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => onNavigate('squad-detail')}
            className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight flex items-center gap-2">
              <Heart className="w-6 h-6 text-[var(--error-500)]" strokeWidth={2} fill="var(--error-500)" />
              Santé de la Squad
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] font-medium">
              {squad.name}
            </p>
          </div>
        </div>

        {/* Squad Info Card */}
        <div className="bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] rounded-3xl p-6 mb-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-white/30">
              <img 
                src={squad.avatar} 
                alt={squad.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">{squad.name}</h2>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4" strokeWidth={2} />
                <span>{members.length} membres</span>
                <span>•</span>
                <span>{squad.game}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="text-xs opacity-80 mb-1">Diagnostic rapide</div>
            <div className="text-sm font-semibold">
              {metrics.score >= 80
                ? '✅ Votre squad est en excellente santé'
                : metrics.score >= 60
                ? '⚠️ Quelques points d\'attention'
                : '🚨 Action requise pour stabiliser la squad'
              }
            </div>
          </div>
        </div>

        {/* Cohesion Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 px-1 flex items-center gap-2">
            <Heart className="w-5 h-5 text-[var(--primary-500)]" strokeWidth={2} />
            Cohésion & Dynamique de groupe
          </h2>
          <SquadCohesion
            squadId={squad.id}
            squadName={squad.name}
            members={members as any}
            metrics={metrics}
            onActionClick={handleActionClick}
          />
        </div>

        {/* Your Reliability */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 px-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[var(--success-500)]" strokeWidth={2} />
            Votre contribution
          </h2>
          <ReliabilityProfile stats={userReliability} />
        </div>

        {/* Timeline */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 px-1 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--primary-500)]" strokeWidth={2} />
            Historique récent
          </h2>
          <div className="bg-white rounded-2xl p-5 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
            <div className="space-y-4">
              {timeline.map((item, index) => {
                const getColorByType = (type: string) => {
                  switch (type) {
                    case 'success': return 'success';
                    case 'warning': return 'warning';
                    case 'error': return 'error';
                    default: return 'primary';
                  }
                };

                const color = getColorByType(item.type);
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-[var(--${color}-50)] flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 text-[var(--${color}-600)]`} strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="text-sm font-semibold text-[var(--fg-primary)] mb-0.5">
                        {item.event}
                      </div>
                      <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                        {item.date}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action CTA */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('intelligence')}
          className="w-full bg-gradient-to-r from-[var(--primary-500)] to-[var(--secondary-500)] rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 text-left">
              <div className="text-base font-bold mb-1">
                Voir les recommandations IA
              </div>
              <div className="text-sm opacity-90">
                Découvrez comment optimiser votre planning
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" strokeWidth={2} />
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
export default SquadHealthScreen;
