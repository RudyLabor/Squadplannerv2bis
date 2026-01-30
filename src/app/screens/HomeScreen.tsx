/**
 * HOME SCREEN - LINEAR DESIGN SYSTEM
 * Balanced version - comfortable sizing with Linear aesthetics
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  Brain,
  BarChart3,
  Repeat,
  Trophy,
  Target,
  Building2,
  Timer,
  ChevronRight,
  Gamepad2,
  Lightbulb,
  X,
} from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useSquads } from "@/app/contexts/SquadsContext";
import { useSessions } from "@/app/contexts/SessionsContext";
import { getCountdownString, isSessionSoon } from "@/utils/dateUtils";
import { OrangeDivider } from "@/design-system";

interface HomeScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

// Animations - Linear-like smooth motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.02 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }
  }
};

// Hero section animation (slightly slower for emphasis)
const heroVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }
  }
};

// ============================================
// STAT CARD - Visually recessed, secondary hierarchy
// ============================================
function StatCard({
  icon: Icon,
  value,
  label,
  trend
}: {
  icon: any;
  value: string | number;
  label: string;
  trend?: { value: number; positive: boolean };
}) {
  return (
    <motion.div
      className="p-4 md:p-5 rounded-xl bg-[#111214] border border-[#1a1b1f] hover:border-[#26282d] hover:bg-[#141518] transition-all duration-100 group cursor-default"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.1 }}
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-[#1a1b1f] group-hover:bg-[#1e2024] flex items-center justify-center transition-colors">
          <Icon className="w-4 h-4 md:w-[18px] md:h-[18px] text-[#4a4b50] group-hover:text-[#6f7177] transition-colors" strokeWidth={1.5} />
        </div>
        {trend && (
          <span className={`text-[10px] font-medium ${trend.positive ? 'text-[#4ade80]/80' : 'text-[#f87171]/80'}`}>
            {trend.positive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <p className="text-[24px] md:text-[28px] font-semibold text-[#ececed] tabular-nums leading-none">
        {value}
      </p>
      <span className="text-[12px] md:text-[13px] text-[#4a4b50] mt-1 block">{label}</span>
    </motion.div>
  );
}

// ============================================
// LIST ITEM - Interactive with subtle feedback
// ============================================
function ListItem({
  icon: Icon,
  title,
  subtitle,
  onClick,
  badge
}: {
  icon: any;
  title: string;
  subtitle: string;
  onClick: () => void;
  badge?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full flex items-center gap-3 md:gap-4 p-3 md:p-3.5 rounded-xl hover:bg-[#141518] active:bg-[#1a1b1f] transition-colors duration-100 group min-h-[56px] md:min-h-[60px]"
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.995 }}
      transition={{ duration: 0.1 }}
    >
      <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-[#111214] group-hover:bg-[#1e2024] flex items-center justify-center flex-shrink-0 transition-colors">
        <Icon className="w-[18px] h-[18px] md:w-5 md:h-5 text-[#4a4b50] group-hover:text-[#6f7177] transition-colors" strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-medium text-[#ececed] group-hover:text-white transition-colors">{title}</span>
          {badge && (
            <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-[#5e6ad2]/10 text-[#7c85e0] uppercase tracking-wide">
              {badge}
            </span>
          )}
        </div>
        <p className="text-[13px] text-[#4a4b50] group-hover:text-[#6f7177] truncate transition-colors">{subtitle}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-[#26282d] group-hover:text-[#4a4b50] group-hover:translate-x-0.5 transition-all" />
    </motion.button>
  );
}

// ============================================
// NEXT SESSION
// ============================================
interface NextSession {
  id: string;
  title: string;
  squad_name: string;
  scheduled_date: string;
  scheduled_time: string;
}

// ============================================
// HERO BLOCK - Central emotional element
// ============================================
function HeroBlock({
  session,
  onNavigate,
  onPlanSession
}: {
  session: NextSession | null;
  onNavigate: (screen: string, data?: any) => void;
  onPlanSession: () => void;
}) {
  const [timeString, setTimeString] = useState('');
  const [isSoon, setIsSoon] = useState(false);

  const targetDate = session ? new Date(`${session.scheduled_date}T${session.scheduled_time}`) : null;

  useEffect(() => {
    if (!targetDate) return;
    const updateCountdown = () => {
      setTimeString(getCountdownString(targetDate));
      setIsSoon(isSessionSoon(targetDate));
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [session]);

  // Empty state - No upcoming session
  if (!session) {
    return (
      <motion.div
        variants={heroVariants}
        className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-b from-[#161719] to-[#131416] border border-[#1e2024] shadow-lg shadow-black/20 overflow-hidden"
      >
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#5e6ad2]/[0.03] to-transparent pointer-events-none" />

        <div className="relative text-center py-4">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#1e2024] flex items-center justify-center mx-auto mb-5">
            <Calendar className="w-7 h-7 md:w-8 md:h-8 text-[#4a4b50]" strokeWidth={1.5} />
          </div>

          <h2 className="text-[17px] md:text-[18px] font-semibold text-[#ececed] mb-2">
            Aucune session prévue
          </h2>
          <p className="text-[14px] text-[#6f7177] mb-6 max-w-[280px] mx-auto">
            C'est le moment d'en planifier une avec ta squad
          </p>

          {/* Primary CTA - Large and prominent */}
          <motion.button
            onClick={onPlanSession}
            className="inline-flex items-center justify-center gap-2.5 w-full max-w-[280px] h-12 md:h-[52px] rounded-xl bg-[#5e6ad2] text-white text-[15px] font-semibold shadow-lg shadow-[#5e6ad2]/20 hover:bg-[#6872d9] active:scale-[0.98] transition-all duration-100"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" strokeWidth={2} />
            Planifier une session
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Session exists - Show countdown hero
  return (
    <motion.button
      onClick={() => onNavigate('session-detail', { sessionId: session.id })}
      className="relative w-full p-6 md:p-7 rounded-2xl bg-gradient-to-b from-[#161719] to-[#131416] border border-[#1e2024] hover:border-[#26282d] text-left shadow-lg shadow-black/20 overflow-hidden transition-all duration-150 group"
      variants={heroVariants}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.995 }}
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#5e6ad2]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="relative">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isSoon ? 'bg-[#f5a623]/15' : 'bg-[#1e2024] group-hover:bg-[#26282d]'}`}>
              <Timer className={`w-5 h-5 ${isSoon ? 'text-[#f5a623]' : 'text-[#6f7177]'}`} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[11px] text-[#6f7177] uppercase tracking-wider mb-0.5">Prochaine session</p>
              <h3 className="text-[16px] md:text-[17px] font-semibold text-[#ececed]">{session.title}</h3>
            </div>
          </div>
          {isSoon && (
            <span className="px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-[#f5a623]/15 text-[#f5a623] uppercase tracking-wide">
              Bientôt
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {timeString.split(':').map((part, index) => (
              <div key={index} className="flex items-center">
                <span className={`px-3.5 py-2 rounded-lg font-mono text-[20px] md:text-[22px] font-bold tabular-nums ${
                  isSoon ? 'bg-[#f5a623]/10 text-[#f5a623]' : 'bg-[#1e2024] text-[#ececed] group-hover:bg-[#26282d]'
                } transition-colors`}>
                  {part}
                </span>
                {index < 2 && <span className="text-[#2a2b30] mx-1.5 text-lg font-medium">:</span>}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[#6f7177]">{session.squad_name}</span>
            <ChevronRight className="w-4 h-4 text-[#2a2b30] group-hover:text-[#4a4b50] transition-colors" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ============================================
// SQUAD CARD - Subtle hover lift
// ============================================
function SquadCard({ squad, onClick }: { squad: any; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="p-4 md:p-5 rounded-xl bg-[#111214] border border-[#1a1b1f] hover:bg-[#141518] hover:border-[#26282d] text-left transition-all duration-100 group min-h-[100px]"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.1 }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-[#1a1b1f] group-hover:bg-[#1e2024] flex items-center justify-center transition-colors">
          <Gamepad2 className="w-5 h-5 text-[#4a4b50] group-hover:text-[#6f7177] transition-colors" strokeWidth={1.5} />
        </div>
        <h3 className="text-[14px] md:text-[15px] font-medium text-[#ececed] group-hover:text-white truncate flex-1 transition-colors">{squad.name}</h3>
      </div>
      <div className="flex items-center justify-between text-[13px]">
        <span className="text-[#4a4b50] group-hover:text-[#6f7177] flex items-center gap-1.5 transition-colors">
          <Users className="w-4 h-4" strokeWidth={1.5} />
          {squad.membersCount} membres
        </span>
        <span className="text-[#4ade80]/80 font-semibold tabular-nums">{squad.reliability_score || 85}%</span>
      </div>
    </motion.button>
  );
}

// ============================================
// SECTION - Clear hierarchy, subtle accent
// ============================================
function Section({
  title,
  action,
  onAction,
  children,
  accent
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className="flex items-center gap-2">
          {accent && <span className="w-1 h-3.5 rounded-full bg-gradient-to-b from-[#f5a623] to-[#f5a623]/20" />}
          <h2 className="text-[11px] md:text-[12px] font-semibold text-[#4a4b50] uppercase tracking-wider">{title}</h2>
        </div>
        {action && onAction && (
          <motion.button
            onClick={onAction}
            className="text-[13px] text-[#5e6ad2] hover:text-[#7c85e0] transition-colors font-medium"
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
          >
            {action}
          </motion.button>
        )}
      </div>
      {children}
    </div>
  );
}

// ============================================
// TIP BANNER - Subtle, non-intrusive
// ============================================
function TipBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.15 }}
      className="mb-6 p-3.5 md:p-4 rounded-xl bg-[#111214] border border-[#1a1b1f]"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-[#5e6ad2]/10 flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-4 h-4 text-[#5e6ad2]/80" strokeWidth={1.5} />
        </div>
        <p className="text-[13px] text-[#6f7177] flex-1">
          Appuie sur <kbd className="px-1.5 py-0.5 mx-1 rounded bg-[#1e2024] text-[#8b8d93] text-[11px] font-mono border border-[#26282d]">⌘K</kbd>
          pour les commandes rapides
        </p>
        <motion.button
          onClick={onDismiss}
          className="text-[#3a3b40] hover:text-[#6f7177] transition-colors p-1.5 -mr-1 rounded-lg hover:bg-[#1a1b1f]"
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ============================================
// EMPTY STATE - Actionable micro-copy
// ============================================
function EmptyState({ onNavigate }: { onNavigate: (screen: string) => void }) {
  return (
    <div className="py-10 md:py-12 text-center rounded-xl bg-[#111214] border border-[#1a1b1f]">
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#1a1b1f] flex items-center justify-center mx-auto mb-5">
        <Users className="w-7 h-7 md:w-8 md:h-8 text-[#3a3b40]" strokeWidth={1.5} />
      </div>
      <h3 className="text-[16px] font-semibold text-[#ececed] mb-2">Pas encore de squad</h3>
      <p className="text-[14px] text-[#6f7177] mb-6 max-w-[260px] mx-auto leading-relaxed">
        Crée ou rejoins une squad pour organiser tes sessions de jeu
      </p>
      <motion.button
        onClick={() => onNavigate("create-squad")}
        className="inline-flex items-center gap-2.5 h-11 px-6 rounded-xl bg-[#5e6ad2] text-white text-[14px] font-semibold hover:bg-[#6872d9] shadow-lg shadow-[#5e6ad2]/15 transition-colors"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        <Plus className="w-5 h-5" strokeWidth={2} />
        Créer une squad
      </motion.button>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { user } = useAuth();
  const { squads, loading: squadsLoading, refreshSquads } = useSquads();
  const { sessions, getSquadSessions } = useSessions();

  const [transformedSquads, setTransformedSquads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextSession, setNextSession] = useState<NextSession | null>(null);
  const [showTip, setShowTip] = useState(true);

  useEffect(() => {
    if (user) refreshSquads();
  }, [user]);

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
          } catch (err) {}
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
        setNextSession(null);
      }
    };

    loadNextSession();
  }, [squads, sessions]);

  useEffect(() => {
    if (squads) {
      const transformed = squads.map((squad: any) => ({
        ...squad,
        membersCount: squad.total_members || 0,
      }));
      setTransformedSquads(transformed);
      setIsLoading(false);
    }
  }, [squads]);

  useEffect(() => {
    const tipCount = parseInt(localStorage.getItem('tipDismissed') || '0');
    if (tipCount >= 3) setShowTip(false);
  }, []);

  const handleDismissTip = () => {
    const count = parseInt(localStorage.getItem('tipDismissed') || '0');
    localStorage.setItem('tipDismissed', String(count + 1));
    setShowTip(false);
  };

  if (squadsLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#0e0f11] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#5e6ad2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0f11] pb-24 md:pb-8">

      <motion.div
        className="max-w-3xl mx-auto px-4 md:px-6 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header - Nom dominant, sous-titre orienté action */}
        <motion.div variants={itemVariants} className="mb-6">
          <p className="text-[13px] text-[#4a4b50] mb-1">Bienvenue,</p>
          <h1 className="text-[24px] md:text-[26px] font-semibold text-[#ececed] mb-1">
            {user?.display_name || user?.username || 'Gamer'}
          </h1>
          <p className="text-[13px] text-[#6f7177] flex items-center gap-2">
            {nextSession ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                Une session t'attend
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#f5a623] animate-pulse" />
                Prêt à jouer ?
              </>
            )}
          </p>
        </motion.div>

        {/* Tip Banner */}
        <AnimatePresence>
          {showTip && (
            <motion.div variants={itemVariants}>
              <TipBanner onDismiss={handleDismissTip} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="grid grid-cols-3 gap-4">
            <StatCard icon={Calendar} value={sessions?.length || 0} label="Sessions" trend={{ value: 12, positive: true }} />
            <StatCard icon={Users} value={transformedSquads.reduce((acc, s) => acc + (s.membersCount || 0), 0)} label="Joueurs" />
            <StatCard icon={TrendingUp} value={`${user?.reliability_score || 100}%`} label="Fiabilité" />
          </div>
          {/* Subtle orange accent line */}
          <OrangeDivider className="mt-6" />
        </motion.div>

        {/* HERO BLOCK - Central emotional element */}
        <motion.div variants={itemVariants} className="mb-8">
          <HeroBlock
            session={nextSession}
            onNavigate={onNavigate}
            onPlanSession={() => onNavigate("propose-session")}
          />
        </motion.div>

        {/* Secondary Actions - Discret mais toujours visible */}
        <motion.div variants={itemVariants} className="flex gap-3 mb-8">
          {/* Secondary CTA - Rejoindre une squad */}
          <motion.button
            onClick={() => onNavigate("discover-squads")}
            className="flex items-center justify-center gap-2 flex-1 h-11 md:h-12 rounded-xl bg-[#141518] text-[#8b8d93] text-[14px] font-medium hover:bg-[#1a1b1f] hover:text-[#ececed] border border-[#1e2024] hover:border-[#26282d] transition-all duration-100"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <Users className="w-[18px] h-[18px]" strokeWidth={1.5} />
            Rejoindre une squad
          </motion.button>
          {/* Tertiary CTA - Créer squad */}
          <motion.button
            onClick={() => onNavigate("create-squad")}
            className="flex items-center justify-center gap-2 h-11 md:h-12 px-5 rounded-xl bg-transparent text-[#6f7177] text-[14px] font-medium hover:bg-[#141518] hover:text-[#8b8d93] border border-transparent hover:border-[#1e2024] transition-all duration-100"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-[18px] h-[18px]" strokeWidth={1.5} />
            Créer
          </motion.button>
        </motion.div>

        {/* Tools - Actionable micro-copy */}
        <motion.div variants={itemVariants}>
          <Section title="Outils">
            <div className="space-y-0.5">
              <ListItem icon={Brain} title="Intelligence" subtitle="Optimise tes créneaux de jeu" onClick={() => onNavigate("intelligence")} badge="IA" />
              <ListItem icon={BarChart3} title="Statistiques" subtitle="Analyse ta régularité et ta fiabilité" onClick={() => onNavigate("advanced-stats")} />
              <ListItem icon={Repeat} title="Sessions récurrentes" subtitle="Planifie tes rituels de jeu" onClick={() => onNavigate("recurring-session")} />
            </div>
          </Section>
        </motion.div>

        {/* Social - Engagement subtil */}
        <motion.div variants={itemVariants}>
          <Section title="Social">
            <div className="space-y-0.5">
              <ListItem icon={Trophy} title="Classements" subtitle="Compare-toi aux meilleurs" onClick={() => onNavigate("leaderboard")} />
              <ListItem icon={Target} title="Défis" subtitle="Relève les challenges de la semaine" onClick={() => onNavigate("challenges")} />
              <ListItem icon={Building2} title="Organisation" subtitle="Gère ta structure esport" onClick={() => onNavigate("organization")} badge="PRO" />
            </div>
          </Section>
        </motion.div>

        {/* Squads */}
        <motion.div variants={itemVariants}>
          {transformedSquads.length > 0 ? (
            <Section title="Mes Squads" action="Voir tout →" onAction={() => onNavigate("squads")}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {transformedSquads.slice(0, 4).map((squad) => (
                  <SquadCard
                    key={squad.id}
                    squad={squad}
                    onClick={() => onNavigate("squad-detail", { squadId: squad.id })}
                  />
                ))}
              </div>
            </Section>
          ) : (
            <Section title="Mes Squads">
              <EmptyState onNavigate={onNavigate} />
            </Section>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default HomeScreen;
