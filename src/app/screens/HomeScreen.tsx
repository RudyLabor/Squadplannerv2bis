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
  Brain,
  BarChart3,
  Repeat,
  HeartPulse,
  Trophy,
  Target,
  Swords,
  Building2,
  Zap,
  Timer,
} from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useSquads } from "@/app/contexts/SquadsContext";
import { useSessions } from "@/app/contexts/SessionsContext";
import {
  StatCard,
  StatsRow,
  ActionButton,
  SectionHeader,
  FeatureCard,
  SquadCard,
} from "@/app/components/ui/DesignSystem";
import { getCountdownString, getRelativeTimeString, isSessionSoon } from "@/utils/dateUtils";

interface HomeScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

// Next Session Countdown Widget Component
interface NextSession {
  id: string;
  title: string;
  squad_name: string;
  scheduled_date: string;
  scheduled_time: string;
  game?: string;
}

function NextSessionCountdown({
  session,
  onNavigate
}: {
  session: NextSession;
  onNavigate: (screen: string, data?: any) => void;
}) {
  const [timeString, setTimeString] = useState('');
  const [relativeTime, setRelativeTime] = useState('');
  const [isSoon, setIsSoon] = useState(false);

  // Combine date and time for countdown
  const targetDate = new Date(`${session.scheduled_date}T${session.scheduled_time}`);

  useEffect(() => {
    const updateCountdown = () => {
      setTimeString(getCountdownString(targetDate));
      setRelativeTime(getRelativeTimeString(targetDate));
      setIsSoon(isSessionSoon(targetDate));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [session]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-4 mb-6 cursor-pointer transition-all hover:scale-[1.02] ${
        isSoon
          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
          : 'bg-white border border-gray-200'
      }`}
      onClick={() => onNavigate('session-detail', { sessionId: session.id })}
    >
      {/* Badge "Bientôt" */}
      {isSoon && (
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Bientôt</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`p-2 rounded-xl ${isSoon ? 'bg-white/20' : 'bg-amber-100'}`}>
          {isSoon ? (
            <Zap className={`w-5 h-5 ${isSoon ? 'text-white' : 'text-amber-600'}`} />
          ) : (
            <Timer className="w-5 h-5 text-amber-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-medium ${isSoon ? 'text-white/80' : 'text-gray-500'}`}>
            Prochaine session
          </p>
          <h3 className={`font-semibold truncate ${isSoon ? 'text-white' : 'text-gray-900'}`}>
            {session.title}
          </h3>
          <p className={`text-xs ${isSoon ? 'text-white/70' : 'text-gray-400'}`}>
            {session.squad_name} • {session.game || 'Gaming'}
          </p>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {timeString.split(':').map((part, index) => (
            <div key={index} className="flex items-center gap-1">
              <span className={`font-mono font-bold text-2xl ${isSoon ? 'text-white' : 'text-gray-900'}`}>
                {part}
              </span>
              {index < 2 && (
                <span className={`font-mono text-2xl ${isSoon ? 'text-white/60' : 'text-gray-400'}`}>:</span>
              )}
            </div>
          ))}
        </div>
        <div className={`text-right ${isSoon ? 'text-white/80' : 'text-gray-500'}`}>
          <p className="text-sm font-medium">{relativeTime}</p>
          <p className="text-xs">Cliquez pour voir</p>
        </div>
      </div>

      {/* Progress bar for sessions < 2h */}
      {isSoon && (
        <div className="mt-3">
          <div className="h-1 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full rounded-full bg-white/60 animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      )}
    </div>
  );
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { user } = useAuth();
  const { squads, loading: squadsLoading, refreshSquads } = useSquads();
  const { sessions, getSquadSessions } = useSessions();

  const [transformedSquads, setTransformedSquads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextSession, setNextSession] = useState<NextSession | null>(null);
  const [loadingNextSession, setLoadingNextSession] = useState(false);

  // Initial load
  useEffect(() => {
    if (user) {
      refreshSquads();
    }
  }, [user]);

  // Load next session from all squads
  useEffect(() => {
    const loadNextSession = async () => {
      if (!squads || squads.length === 0) {
        setNextSession(null);
        return;
      }

      setLoadingNextSession(true);
      try {
        const allUpcomingSessions: NextSession[] = [];
        const now = new Date();

        // Fetch upcoming sessions from each squad
        for (const squad of squads) {
          try {
            await getSquadSessions(squad.id, 'upcoming');
            // Sessions are now in context, filter upcoming ones
          } catch (err) {
            console.log(`Error fetching sessions for squad ${squad.name}:`, err);
          }
        }

        // Use sessions from context (already loaded)
        if (sessions && sessions.length > 0) {
          sessions.forEach((session: any) => {
            const sessionDateTime = new Date(`${session.scheduled_date}T${session.scheduled_time}`);
            if (sessionDateTime > now) {
              const squad = squads.find((s: any) => s.id === session.squad_id);
              allUpcomingSessions.push({
                id: session.id,
                title: session.title,
                squad_name: squad?.name || 'Squad',
                scheduled_date: session.scheduled_date,
                scheduled_time: session.scheduled_time,
                game: squad?.game,
              });
            }
          });
        }

        // Sort by date and get the earliest
        allUpcomingSessions.sort((a, b) => {
          const dateA = new Date(`${a.scheduled_date}T${a.scheduled_time}`);
          const dateB = new Date(`${b.scheduled_date}T${b.scheduled_time}`);
          return dateA.getTime() - dateB.getTime();
        });

        setNextSession(allUpcomingSessions[0] || null);
      } catch (error) {
        console.error('Error loading next session:', error);
        setNextSession(null);
      } finally {
        setLoadingNextSession(false);
      }
    };

    loadNextSession();
  }, [squads, sessions]);

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
            value={sessions?.length || 0}
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

        {/* Next Session Countdown */}
        {nextSession && (
          <NextSessionCountdown session={nextSession} onNavigate={onNavigate} />
        )}

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
// Force redeploy 1769627273
