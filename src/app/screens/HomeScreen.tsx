/**
 * 🏠 HOME SCREEN - Refonte UI Premium
 * Design System v3 - Animations + Glassmorphism
 * Niveau Top 5 Mondial
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Sparkles,
  ChevronRight,
  Play,
  Star,
  Crown,
} from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useSquads } from "@/app/contexts/SquadsContext";
import { useSessions } from "@/app/contexts/SessionsContext";
import { getCountdownString, getRelativeTimeString, isSessionSoon } from "@/utils/dateUtils";
import { SmartSuggestionsWidget } from "@/app/components/SmartSuggestionsWidget";

interface HomeScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

// Animation variants
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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.05, type: "spring", stiffness: 300, damping: 24 }
  })
};

// Premium Stat Card Component
function PremiumStatCard({
  icon: Icon,
  value,
  label,
  gradient,
  delay = 0
}: {
  icon: any;
  value: string | number;
  label: string;
  gradient: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 24 }}
      whileHover={{ scale: 1.05, y: -2 }}
      className="relative p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg shadow-black/5 overflow-hidden group"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
      <div className="relative z-10">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-2 shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </motion.div>
  );
}

// Premium Feature Card Component
function PremiumFeatureCard({
  icon: Icon,
  title,
  subtitle,
  gradient,
  onClick,
  index = 0,
  badge
}: {
  icon: any;
  title: string;
  subtitle: string;
  gradient: string;
  onClick: () => void;
  index?: number;
  badge?: string;
}) {
  return (
    <motion.button
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
      className="relative p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg shadow-black/5 text-left overflow-hidden group"
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-all duration-300`} />

      {/* Badge */}
      {badge && (
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500 text-[10px] font-bold text-white z-20">
          {badge}
        </div>
      )}

      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="font-semibold text-gray-900 group-hover:text-white transition-colors">{title}</h3>
        <p className="text-xs text-gray-500 group-hover:text-white/70 transition-colors">{subtitle}</p>
      </div>

      <ChevronRight className="absolute right-3 bottom-3 w-4 h-4 text-gray-300 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
    </motion.button>
  );
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => onNavigate('session-detail', { sessionId: session.id })}
      className={`relative overflow-hidden rounded-3xl p-5 mb-6 cursor-pointer ${
        isSoon
          ? 'bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500'
          : 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800'
      }`}
    >
      {/* Animated glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
      />

      {/* Badge */}
      <div className="absolute top-4 right-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1.5 ${
            isSoon ? 'bg-white/20' : 'bg-amber-500/20'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isSoon ? 'bg-white' : 'bg-amber-400'} animate-pulse`} />
          <span className={`text-xs font-bold ${isSoon ? 'text-white' : 'text-amber-400'}`}>
            {isSoon ? 'BIENTÔT' : 'À VENIR'}
          </span>
        </motion.div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <motion.div
            animate={isSoon ? { rotate: [0, -10, 10, 0] } : {}}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            className={`p-3 rounded-2xl ${isSoon ? 'bg-white/20' : 'bg-amber-500/20'}`}
          >
            {isSoon ? (
              <Zap className="w-6 h-6 text-white" />
            ) : (
              <Timer className="w-6 h-6 text-amber-400" />
            )}
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-medium mb-1 ${isSoon ? 'text-white/70' : 'text-gray-400'}`}>
              Prochaine session
            </p>
            <h3 className="font-bold text-lg text-white truncate">{session.title}</h3>
            <p className={`text-sm ${isSoon ? 'text-white/60' : 'text-gray-500'}`}>
              {session.squad_name} • {session.game || 'Gaming'}
            </p>
          </div>
        </div>

        {/* Countdown */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {timeString.split(':').map((part, index) => (
              <div key={index} className="flex items-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`px-3 py-2 rounded-xl ${isSoon ? 'bg-white/20' : 'bg-white/5'} backdrop-blur-sm`}
                >
                  <span className="font-mono font-bold text-2xl text-white">{part}</span>
                </motion.div>
                {index < 2 && (
                  <span className="font-mono text-2xl text-white/40 mx-1">:</span>
                )}
              </div>
            ))}
          </div>
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center gap-2 text-white/70"
          >
            <span className="text-sm">{relativeTime}</span>
            <Play className="w-5 h-5 fill-current" />
          </motion.div>
        </div>

        {/* Progress bar */}
        {isSoon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4"
          >
            <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-white/60"
                animate={{ width: ['0%', '100%'] }}
                transition={{ duration: 10, repeat: Infinity }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { user } = useAuth();
  const { squads, loading: squadsLoading, refreshSquads } = useSquads();
  const { sessions, getSquadSessions } = useSessions();

  const [transformedSquads, setTransformedSquads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextSession, setNextSession] = useState<NextSession | null>(null);

  // Initial load
  useEffect(() => {
    if (user) {
      refreshSquads();
    }
  }, [user]);

  // Load next session
  useEffect(() => {
    const loadNextSession = async () => {
      if (!squads || squads.length === 0) {
        setNextSession(null);
        return;
      }

      try {
        const allUpcomingSessions: NextSession[] = [];
        const now = new Date();

        for (const squad of squads) {
          try {
            await getSquadSessions(squad.id, 'upcoming');
          } catch (err) {
            console.log(`Error fetching sessions for squad ${squad.name}:`, err);
          }
        }

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

        allUpcomingSessions.sort((a, b) => {
          const dateA = new Date(`${a.scheduled_date}T${a.scheduled_time}`);
          const dateB = new Date(`${b.scheduled_date}T${b.scheduled_time}`);
          return dateA.getTime() - dateB.getTime();
        });

        setNextSession(allUpcomingSessions[0] || null);
      } catch (error) {
        console.error('Error loading next session:', error);
        setNextSession(null);
      }
    };

    loadNextSession();
  }, [squads, sessions]);

  // Transform squads
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-500 font-medium">Chargement...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 pb-32">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-pink-400/10 rounded-full blur-2xl" />
      </div>

      <motion.div
        className="relative px-4 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header - Premium style */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <motion.div
                className="flex items-center gap-2 mb-1"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="text-3xl"
                >
                  👋
                </motion.span>
                <span className="text-sm text-gray-500">Salut,</span>
              </motion.div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                {user?.display_name || user?.username || 'Gamer'}
              </h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate("premium")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold shadow-lg shadow-amber-500/30"
            >
              <Crown className="w-4 h-4" />
              <span>PRO</span>
            </motion.button>
          </div>
          <p className="text-gray-500">
            Fini le "on verra". Place aux sessions qui comptent.
          </p>
        </motion.div>

        {/* Stats Row - Premium cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-6">
          <PremiumStatCard
            icon={Calendar}
            value={sessions?.length || 0}
            label="Sessions"
            gradient="from-blue-500 to-cyan-500"
            delay={0.1}
          />
          <PremiumStatCard
            icon={Users}
            value={transformedSquads.length > 0 ? transformedSquads.length * 4 : 0}
            label="Joueurs"
            gradient="from-purple-500 to-pink-500"
            delay={0.15}
          />
          <PremiumStatCard
            icon={TrendingUp}
            value={`${user?.reliability_score || 0}%`}
            label="Fiabilité"
            gradient="from-amber-500 to-orange-500"
            delay={0.2}
          />
        </motion.div>

        {/* Next Session Countdown */}
        <AnimatePresence>
          {nextSession && (
            <NextSessionCountdown session={nextSession} onNavigate={onNavigate} />
          )}
        </AnimatePresence>

        {/* Smart Suggestions Widget */}
        <motion.div variants={itemVariants}>
          <SmartSuggestionsWidget onNavigate={onNavigate} maxSuggestions={2} />
        </motion.div>

        {/* Quick Actions - Premium buttons */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-4">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate("create-squad")}
            className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-lg shadow-amber-500/30"
          >
            <Plus className="w-5 h-5" />
            Créer Squad
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate("join-squad")}
            className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 font-bold shadow-lg shadow-black/5"
          >
            <Users className="w-5 h-5" />
            Rejoindre
          </motion.button>
        </motion.div>
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.01, y: -1 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onNavigate("propose-session")}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold shadow-lg mb-8"
        >
          <Clock className="w-5 h-5" />
          Proposer une Session
          <Sparkles className="w-4 h-4 text-amber-400" />
        </motion.button>

        {/* Intelligence & Outils Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              Intelligence & Outils
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <PremiumFeatureCard
              icon={Brain}
              title="Intelligence IA"
              subtitle="Suggestions optimales"
              gradient="from-purple-500 to-indigo-600"
              onClick={() => onNavigate("intelligence")}
              index={0}
              badge="IA"
            />
            <PremiumFeatureCard
              icon={BarChart3}
              title="Récap Hebdo"
              subtitle="Vos statistiques"
              gradient="from-teal-500 to-emerald-600"
              onClick={() => onNavigate("weekly-recap")}
              index={1}
            />
            <PremiumFeatureCard
              icon={Repeat}
              title="Rituels"
              subtitle="Sessions auto"
              gradient="from-blue-500 to-cyan-600"
              onClick={() => onNavigate("recurring-session")}
              index={2}
            />
            <PremiumFeatureCard
              icon={HeartPulse}
              title="Cohésion"
              subtitle="Santé squad"
              gradient="from-pink-500 to-rose-600"
              onClick={() => onNavigate("squad-health")}
              index={3}
            />
          </div>
        </motion.div>

        {/* Social & Compétition Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Social & Compétition
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <PremiumFeatureCard
              icon={Trophy}
              title="Classements"
              subtitle="Top joueurs"
              gradient="from-amber-500 to-orange-600"
              onClick={() => onNavigate("leaderboard")}
              index={4}
            />
            <PremiumFeatureCard
              icon={Swords}
              title="Tournois"
              subtitle="Compétitions"
              gradient="from-red-500 to-pink-600"
              onClick={() => onNavigate("tournaments")}
              index={5}
            />
            <PremiumFeatureCard
              icon={Target}
              title="Défis"
              subtitle="Hebdomadaires"
              gradient="from-orange-500 to-amber-600"
              onClick={() => onNavigate("challenges")}
              index={6}
            />
            <PremiumFeatureCard
              icon={Users}
              title="Découvrir"
              subtitle="Squads publiques"
              gradient="from-violet-500 to-purple-600"
              onClick={() => onNavigate("discover-squads")}
              index={7}
            />
          </div>
        </motion.div>

        {/* Communauté & B2B Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-500" />
              Communauté & B2B
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <PremiumFeatureCard
              icon={Users}
              title="Multi-Squads"
              subtitle="Gérez plusieurs squads"
              gradient="from-slate-700 to-slate-900"
              onClick={() => onNavigate("squads")}
              index={8}
            />
            <PremiumFeatureCard
              icon={Trophy}
              title="Ligues"
              subtitle="Compétition interne"
              gradient="from-emerald-500 to-teal-600"
              onClick={() => onNavigate("leagues")}
              index={9}
            />
            <PremiumFeatureCard
              icon={Calendar}
              title="Saisons"
              subtitle="Progression trimestrielle"
              gradient="from-indigo-500 to-blue-600"
              onClick={() => onNavigate("seasons")}
              index={10}
            />
            <PremiumFeatureCard
              icon={Building2}
              title="Mode B2B"
              subtitle="Équipes esport"
              gradient="from-cyan-500 to-teal-600"
              onClick={() => onNavigate("esport-team")}
              index={11}
              badge="PRO"
            />
          </div>
        </motion.div>

        {/* My Squads Section */}
        {transformedSquads.length > 0 && (
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Mes Squads</h2>
              <motion.button
                whileHover={{ x: 5 }}
                onClick={() => onNavigate("squads")}
                className="flex items-center gap-1 text-amber-500 text-sm font-semibold"
              >
                Voir tout
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {transformedSquads.slice(0, 4).map((squad, index) => (
                <motion.button
                  key={squad.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onNavigate("squad-detail", { squadId: squad.id })}
                  className="relative p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg shadow-black/5 text-left overflow-hidden"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl shadow-lg">
                      🎮
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">{squad.name}</h3>
                      <p className="text-xs text-gray-500">{squad.game || 'Gaming'}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      <Users className="w-3 h-3 inline mr-1" />
                      {squad.membersCount} membres
                    </span>
                    <div className="flex items-center gap-1 text-emerald-500">
                      <Star className="w-3 h-3 fill-current" />
                      {squad.reliability_score || 85}%
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty state if no squads */}
        {transformedSquads.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="relative p-8 rounded-3xl bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm border border-white/50 shadow-xl text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5" />
            <div className="relative z-10">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/30"
              >
                <Users className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Aucune squad encore
              </h3>
              <p className="text-gray-500 mb-6 max-w-xs mx-auto">
                Créez votre première squad ou rejoignez-en une existante pour commencer l'aventure
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate("create-squad")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-lg shadow-amber-500/30"
              >
                <Plus className="w-5 h-5" />
                Créer ma première squad
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default HomeScreen;
