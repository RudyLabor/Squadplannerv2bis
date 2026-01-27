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
  Crown,
} from "lucide-react";
import { sessionsAPI, squadsAPI } from "@/utils/api";
import { useAuth } from "@/app/contexts/AuthContext";
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
  const { isAuthenticated } = useAuth();
  const [squads, setSquads] = useState<any[]>([]);
  const [sessionsCount, setSessionsCount] = useState(0);
  const [userReliability, setUserReliability] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load data
  useEffect(() => {
    if (isAuthenticated) {
      loadHomeData();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadHomeData = async () => {
    setIsLoading(true);
    try {
      const { authAPI } = await import("@/utils/api");

      const [sessionsResponse, squadsResponse, profileResponse] =
        await Promise.all([
          sessionsAPI.getSessions().catch(() => ({ sessions: [] })),
          squadsAPI.getSquads().catch(() => ({ squads: [] })),
          authAPI.getProfile().catch(() => ({ user: null })),
        ]);

      // Transform squads for display
      const transformedSquads = (squadsResponse.squads || []).map(
        (squad: any) => ({
          ...squad,
          membersCount: Array.isArray(squad.members)
            ? squad.members.length
            : squad.members || 0,
          nextSessionText:
            squad.nextSession && typeof squad.nextSession === "object"
              ? "Prochainement"
              : squad.nextSession || null,
        })
      );

      setSquads(transformedSquads);
      setSessionsCount(sessionsResponse.sessions?.length || 0);

      const user = profileResponse.user || profileResponse;
      const stats = user?.stats || {};
      setUserReliability(stats.reliabilityScore || 0);
    } catch (error) {
      console.log("Chargement des données:", error);
      setSquads([]);
      setSessionsCount(0);
      setUserReliability(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
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
            value={sessionsCount}
            label="Sessions"
            iconColor="text-gray-400"
          />
          <StatCard
            icon={Users}
            value={squads.length > 0 ? `${squads.length * 4}` : "0"}
            label="Joueurs"
            iconColor="text-gray-400"
          />
          <StatCard
            icon={TrendingUp}
            value={`${userReliability}%`}
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
          className="w-full mb-8"
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
        {squads.length > 0 && (
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
              {squads.slice(0, 4).map((squad) => (
                <SquadCard
                  key={squad.id}
                  name={squad.name}
                  game={squad.game}
                  gameImage={
                    squad.gameImage ||
                    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=200&fit=crop"
                  }
                  members={squad.membersCount}
                  reliability={squad.reliabilityScore || 85}
                  nextSession={squad.nextSessionText}
                  sessionsCount={squad.activeSessions || 0}
                  onClick={() =>
                    onNavigate("squad-detail", { squadId: squad.id })
                  }
                />
              ))}
            </div>
          </>
        )}

        {/* Empty state if no squads */}
        {squads.length === 0 && (
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
