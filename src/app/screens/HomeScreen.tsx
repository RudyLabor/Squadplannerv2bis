/**
 * 🏠 HOME SCREEN - Aligné sur maquette Figma
 * Design System v2 - Mobile-first
 */

import { useState, useEffect } from "react";
import {
  Plus,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  Brain,
  BarChart3,
  Repeat,
  HeartPulse,
  Trophy,
  Target,
  Swords,
  Building2,
  Gamepad2,
} from "lucide-react";
import { sessionsAPI, squadsAPI } from "@/utils/api";
import { useAuth } from "@/app/contexts/AuthContext";
import { useSquads } from "@/app/contexts/SquadsContext";
import { useSessions } from "@/app/contexts/SessionsContext";
import {
  PageHeader,
  StatCard,
  StatsRow,
  ActionButton,
  SectionHeader,
  FeatureCard,
  SquadCard,
} from "@/app/components/ui/DesignSystem";

interface HomeScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

export function HomeScreen({ onNavigate, showToast }: HomeScreenProps) {
  const { user } = useAuth();
  const { squads, loading: squadsLoading, refreshSquads } = useSquads();
  const { sessions, getSquadSessions, loading: sessionsLoading } = useSessions();
  
  const [transformedSquads, setTransformedSquads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load
  useEffect(() => {
    if (user) {
      refreshSquads();
    }
  }, [user]);

  // Transform squads whenever they change
  useEffect(() => {
    if (squads) {
      const transformed = squads.map((squad: any) => ({
        ...squad,
        membersCount: squad.total_members || 0,
        nextSessionText: squad.next_session_date ? "Prochainement" : null,
      }));
      setTransformedSquads(transformed);
      setIsLoading(false);
    }
  }, [squads]);

  // Loading state
  if (squadsLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Squad Planner</h1>
          <p className="text-gray-500 text-sm">
            Fini le "on verra". Place aux sessions qui comptent.
          </p>
        </div>

        {/* Stats Row */}
        <StatsRow>
          <StatCard
            icon={Calendar}
            value={0}
            label="Sessions"
            iconColor="text-gray-400"
          />
          <StatCard
            icon={Users}
            value={transformedSquads.length > 0 ? `${transformedSquads.length * 4}` : "0"}
            label="Joueurs"
            iconColor="text-gray-400"
          />
          <StatCard
            icon={TrendingUp}
            value={`${user?.reliability_score || 0}%`}
            label="Fiabilité"
            iconColor="text-amber-500"
          />
        </StatsRow>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <ActionButton
            variant="primary"
            icon={Plus}
            onClick={() => onNavigate("create-squad")}
          >
            Créer Squad
          </ActionButton>
          <ActionButton
            variant="secondary"
            icon={Users}
            onClick={() => onNavigate("join-squad")}
          >
            Rejoindre Squad
          </ActionButton>
        </div>
        <ActionButton
          variant="secondary"
          icon={Clock}
          onClick={() => onNavigate("propose-session")}
          className="w-full mb-3"
        >
          Proposer Session
        </ActionButton>

        {/* Intelligence & Outils */}
        <SectionHeader title="Intelligence & Outils" />
        <div className="grid grid-cols-2 gap-3 mb-3">
          <FeatureCard
            icon={Brain}
            title="Intelligence IA"
            subtitle="Suggestions optimales"
            color="amber"
            onClick={() => onNavigate("intelligence")}
          />
          <FeatureCard
            icon={BarChart3}
            title="Récap Hebdo"
            subtitle="Vos statistiques"
            color="teal"
            onClick={() => onNavigate("weekly-recap")}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-8">
          <FeatureCard
            icon={Repeat}
            title="Rituels"
            subtitle="Sessions auto"
            color="white"
            onClick={() => onNavigate("recurring-session")}
          />
          <FeatureCard
            icon={HeartPulse}
            title="Cohésion"
            subtitle="Santé squad"
            color="white"
            onClick={() => onNavigate("squad-health")}
          />
        </div>

        {/* Social & Compétition */}
        <SectionHeader title="Social & Compétition" />
        <div className="grid grid-cols-2 gap-3 mb-3">
          <FeatureCard
            icon={Trophy}
            title="Classements"
            subtitle="Top joueurs"
            color="purple"
            onClick={() => onNavigate("leaderboard")}
          />
          <FeatureCard
            icon={Swords}
            title="Tournois"
            subtitle="Compétitions"
            color="amber"
            onClick={() => onNavigate("tournaments")}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-8">
          <FeatureCard
            icon={Target}
            title="Défis"
            subtitle="Hebdomadaires"
            color="white"
            onClick={() => onNavigate("challenges")}
          />
          <FeatureCard
            icon={Users}
            title="Découvrir"
            subtitle="Squads publiques"
            color="white"
            onClick={() => onNavigate("discover-squads")}
          />
        </div>

        {/* Communauté & B2B */}
        <SectionHeader title="Communauté & B2B" />
        <div className="grid grid-cols-2 gap-3 mb-3">
          <FeatureCard
            icon={Users}
            title="Multi-Squads"
            subtitle="Gérez plusieurs squads"
            color="white"
            onClick={() => onNavigate("squads")}
          />
          <FeatureCard
            icon={Trophy}
            title="Ligues"
            subtitle="Compétition interne"
            color="white"
            onClick={() => onNavigate("leagues")}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-8">
          <FeatureCard
            icon={Calendar}
            title="Saisons"
            subtitle="Progression trimestrielle"
            color="white"
            onClick={() => onNavigate("seasons")}
          />
          <FeatureCard
            icon={Building2}
            title="Mode B2B"
            subtitle="Équipes esport"
            color="teal"
            onClick={() => onNavigate("esport-team")}
          />
        </div>

        {/* Mes Squads */}
        {transformedSquads.length > 0 && (
          <>
            <SectionHeader
              title="Mes Squads"
              action={
                <button
                  onClick={() => onNavigate("squads")}
                  className="text-amber-500 text-sm font-medium flex items-center gap-1"
                >
                  Voir tout
                  <ArrowRight className="w-4 h-4" />
                </button>
              }
            />
            <div className="grid grid-cols-2 gap-3">
              {transformedSquads.slice(0, 4).map((squad) => (
                <SquadCard
                  key={squad.id}
                  name={squad.name}
                  game={squad.game}
                  gameImage={
                    squad.avatar_url ||
                    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=200&fit=crop"
                  }
                  members={squad.membersCount}
                  reliability={squad.reliability_score || 85}
                  nextSession={squad.nextSessionText}
                  sessionsCount={0}
                  onClick={() =>
                    onNavigate("squad-detail", { squadId: squad.id })
                  }
                />
              ))}
            </div>
          </>
        )}

        {/* Empty state if no squads */}
        {transformedSquads.length === 0 && (
          <div className="bg-white rounded-2xl p-6 text-center border border-gray-100">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Aucune squad encore
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Créez votre première squad ou rejoignez-en une existante
            </p>
            <ActionButton
              variant="primary"
              icon={Plus}
              onClick={() => onNavigate("create-squad")}
              className="mx-auto"
            >
              Créer ma première squad
            </ActionButton>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
