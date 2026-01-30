/**
 * HOME SCREEN - LINEAR DESIGN SYSTEM v2
 * Full polish: Premium spacing, typography, micro-interactions
 * Inspired by Linear.app - World-class design
 */

import { useState, useEffect, useRef, useCallback } from "react";
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
  Search,
  Command,
  Sparkles,
  Zap,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useSquads } from "@/app/contexts/SquadsContext";
import { useSessions } from "@/app/contexts/SessionsContext";
import { getCountdownString, isSessionSoon } from "@/utils/dateUtils";

interface HomeScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  onCommandOpen?: () => void;
}

// ============================================
// ANIMATIONS - Linear-like smooth motion
// ============================================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }
  }
};

const heroVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }
  }
};

// ============================================
// COMMAND PALETTE TRIGGER - Linear search style
// Per analysis: more visible bg, border on hover
// ============================================
function CommandPaletteTrigger({ onClick }: { onClick?: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full flex items-center gap-3 h-10 md:h-11 px-4 rounded-lg bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.12)] focus:border-[rgba(94,109,210,0.5)] focus:ring-2 focus:ring-[rgba(94,109,210,0.15)] transition-all duration-150 group"
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
    >
      <Search className="w-[14px] h-[14px] text-[#5e6063] group-hover:text-[#8b8d90] transition-colors flex-shrink-0" strokeWidth={1.5} />
      <span className="flex-1 text-left text-[14px] text-[rgba(255,255,255,0.35)] group-hover:text-[rgba(255,255,255,0.5)] transition-colors">
        Chercher sessions, joueurs, squads...
      </span>
      <div className="flex items-center gap-1 px-2 py-1 rounded bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] group-hover:bg-[rgba(255,255,255,0.1)] transition-colors">
        <Command className="w-3 h-3 text-[#5e6063]" strokeWidth={2} />
        <span className="text-[11px] text-[#5e6063] font-mono font-medium">K</span>
      </div>
    </motion.button>
  );
}

// ============================================
// STAT CARD - Per analysis: more transparent bg, colored icons
// ============================================
function StatCard({
  icon: Icon,
  value,
  label,
  trend,
  progress,
  accentColor = "#5e6dd2"
}: {
  icon: any;
  value: string | number;
  label: string;
  trend?: { value: number; positive: boolean };
  progress?: number;
  accentColor?: string;
}) {
  return (
    <motion.div
      className="relative p-4 md:p-5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] transition-all duration-200 group cursor-default overflow-hidden"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
    >
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          {/* Colored icon background - per analysis */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150"
            style={{ backgroundColor: `${accentColor}15` }}
          >
            <Icon
              className="w-5 h-5 transition-colors"
              style={{ color: accentColor }}
              strokeWidth={1.5}
            />
          </div>
          {trend && (
            <span className={`text-[12px] font-semibold ${
              trend.positive ? 'text-[#4ade80]' : 'text-[#f87171]'
            }`}>
              {trend.positive ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>

        <p className="text-[28px] md:text-[32px] font-semibold text-[#f7f8f8] tabular-nums leading-none tracking-tight mb-0.5">
          {value}
        </p>
        <span className="text-[12px] md:text-[13px] text-[rgba(255,255,255,0.4)] uppercase tracking-wide">{label}</span>

        {/* Progress bar indicator */}
        {progress !== undefined && (
          <div className="mt-3 h-[3px] rounded-full bg-[rgba(255,255,255,0.1)] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: accentColor }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// TOOL CARD - Large icons, premium hover
// ============================================
function ToolCard({
  icon: Icon,
  title,
  description,
  onClick,
  badge,
  accentColor = "#5e6dd2"
}: {
  icon: any;
  title: string;
  description: string;
  onClick: () => void;
  badge?: string;
  accentColor?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="relative w-full p-5 md:p-6 rounded-2xl bg-[#101012] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] text-left transition-all duration-200 group overflow-hidden"
      whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{ backgroundColor: `${accentColor}15` }}
          >
            <Icon
              className="w-6 h-6 md:w-7 md:h-7 transition-colors"
              style={{ color: accentColor }}
              strokeWidth={1.5}
            />
          </div>
          {badge && (
            <span
              className="px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-wide"
              style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
            >
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-[16px] md:text-[17px] font-semibold text-[#f7f8f8] group-hover:text-white mb-1.5 transition-colors">
          {title}
        </h3>
        <p className="text-[13px] md:text-[14px] text-[#5e6063] group-hover:text-[#8b8d90] leading-relaxed transition-colors">
          {description}
        </p>

        <div className="mt-4 flex items-center gap-1.5 text-[13px] font-medium" style={{ color: accentColor }}>
          <span>Explorer</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.button>
  );
}

// ============================================
// QUICK ACTION CARD - Compact, actionable
// ============================================
function QuickActionCard({
  icon: Icon,
  title,
  subtitle,
  onClick,
  variant = "default"
}: {
  icon: any;
  title: string;
  subtitle: string;
  onClick: () => void;
  variant?: "default" | "primary";
}) {
  const isPrimary = variant === "primary";

  return (
    <motion.button
      onClick={onClick}
      className={`relative w-full p-4 md:p-5 rounded-xl text-left transition-all duration-200 group overflow-hidden ${
        isPrimary
          ? "bg-gradient-to-br from-[#5e6dd2] to-[#4f5cb8] border border-[#6a79db]/30"
          : "bg-[#101012] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)]"
      }`}
      whileHover={{ y: -2, boxShadow: isPrimary ? "0 12px 32px rgba(94,109,210,0.3)" : "0 8px 24px rgba(0,0,0,0.4)" }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative flex items-center gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
          isPrimary
            ? "bg-white/20"
            : "bg-[#1f2023] group-hover:bg-[#27282b]"
        }`}>
          <Icon className={`w-5 h-5 ${isPrimary ? "text-white" : "text-[#8b8d90]"}`} strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`text-[14px] md:text-[15px] font-semibold mb-0.5 ${isPrimary ? "text-white" : "text-[#f7f8f8]"}`}>
            {title}
          </h4>
          <p className={`text-[12px] md:text-[13px] truncate ${isPrimary ? "text-white/70" : "text-[#5e6063]"}`}>
            {subtitle}
          </p>
        </div>
        <ChevronRight className={`w-5 h-5 ${isPrimary ? "text-white/60" : "text-[#27282b] group-hover:text-[#5e6063]"} transition-colors`} />
      </div>
    </motion.button>
  );
}

// ============================================
// NEXT SESSION INTERFACE
// ============================================
interface NextSession {
  id: string;
  title: string;
  squad_name: string;
  scheduled_date: string;
  scheduled_time: string;
}

// ============================================
// HERO SESSION BLOCK - Premium countdown
// ============================================
function HeroSessionBlock({
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

  // Empty state - Premium illustration
  if (!session) {
    return (
      <motion.div
        variants={heroVariants}
        className="relative p-8 md:p-10 rounded-3xl bg-gradient-to-b from-[#18191b] to-[#101012] border border-[rgba(255,255,255,0.08)] overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#5e6dd2]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#8b5cf6]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative text-center py-6 md:py-8">
          {/* Animated illustration */}
          <motion.div
            className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-[#27282b] to-[#1f2023] flex items-center justify-center mx-auto mb-8 border border-[rgba(255,255,255,0.05)]"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Calendar className="w-10 h-10 md:w-12 md:h-12 text-[#5e6063]" strokeWidth={1.2} />
          </motion.div>

          <h2 className="text-[22px] md:text-[26px] font-bold text-[#f7f8f8] mb-3">
            Aucune session prévue
          </h2>
          <p className="text-[15px] md:text-[16px] text-[#8b8d90] mb-8 max-w-[320px] mx-auto leading-relaxed">
            C'est le moment parfait pour planifier ta prochaine session avec ta squad
          </p>

          <motion.button
            onClick={onPlanSession}
            className="inline-flex items-center justify-center gap-3 h-14 md:h-16 px-8 md:px-10 rounded-2xl bg-[#5e6dd2] text-white text-[16px] md:text-[17px] font-semibold shadow-lg shadow-[#5e6dd2]/25 hover:bg-[#6a79db] hover:shadow-xl hover:shadow-[#5e6dd2]/30 transition-all duration-200"
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
            Planifier une session
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Session exists - Premium countdown
  return (
    <motion.button
      onClick={() => onNavigate('session-detail', { sessionId: session.id })}
      className="relative w-full p-6 md:p-8 rounded-3xl bg-gradient-to-b from-[#18191b] to-[#101012] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] text-left overflow-hidden transition-all duration-200 group"
      variants={heroVariants}
      whileHover={{ y: -4, boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}
      whileTap={{ scale: 0.995 }}
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${isSoon ? 'from-[#f5a623]/5' : 'from-[#5e6dd2]/5'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />

      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-colors ${
              isSoon ? 'bg-[#f5a623]/15' : 'bg-[#27282b] group-hover:bg-[#363739]'
            }`}>
              <Timer className={`w-7 h-7 md:w-8 md:h-8 ${isSoon ? 'text-[#f5a623]' : 'text-[#8b8d90]'}`} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[12px] md:text-[13px] text-[#8b8d90] uppercase tracking-wider font-medium mb-1">Prochaine session</p>
              <h3 className="text-[18px] md:text-[20px] font-bold text-[#f7f8f8]">{session.title}</h3>
            </div>
          </div>
          {isSoon && (
            <motion.span
              className="px-3 py-1.5 text-[11px] font-bold rounded-lg bg-[#f5a623]/15 text-[#f5a623] uppercase tracking-wide"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Bientôt
            </motion.span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {timeString.split(':').map((part, index) => (
              <div key={index} className="flex items-center">
                <span className={`px-4 md:px-5 py-3 rounded-xl font-mono text-[24px] md:text-[28px] font-bold tabular-nums ${
                  isSoon ? 'bg-[#f5a623]/10 text-[#f5a623]' : 'bg-[#27282b] text-[#f7f8f8] group-hover:bg-[#363739]'
                } transition-colors`}>
                  {part}
                </span>
                {index < 2 && <span className="text-[#363739] mx-2 text-2xl font-medium">:</span>}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[14px] text-[#8b8d90] font-medium">{session.squad_name}</span>
            <ChevronRight className="w-5 h-5 text-[#363739] group-hover:text-[#5e6063] group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ============================================
// SQUAD CARD - Enhanced with gradient border
// ============================================
function SquadCard({ squad, onClick }: { squad: any; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="relative p-5 md:p-6 rounded-2xl bg-[#101012] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] text-left transition-all duration-200 group overflow-hidden"
      whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,0,0,0.4)" }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#1f2023] group-hover:bg-[#27282b] flex items-center justify-center transition-colors">
            <Gamepad2 className="w-6 h-6 md:w-7 md:h-7 text-[#5e6063] group-hover:text-[#8b8d90] transition-colors" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] md:text-[16px] font-semibold text-[#f7f8f8] group-hover:text-white truncate transition-colors">
              {squad.name}
            </h3>
            <p className="text-[13px] text-[#5e6063] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
              {squad.membersCount} membres
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-16 rounded-full bg-[#1f2023] overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-[#4ade80]"
                initial={{ width: 0 }}
                animate={{ width: `${squad.reliability_score || 85}%` }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
            </div>
            <span className="text-[13px] text-[#4ade80] font-semibold tabular-nums">
              {squad.reliability_score || 85}%
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#27282b] group-hover:text-[#5e6063] group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </motion.button>
  );
}

// ============================================
// SKELETON COMPONENTS - Premium loading state
// ============================================
function SkeletonPulse({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-[#27282b] ${className}`} />
  );
}

function HomeScreenSkeleton() {
  return (
    <div className="min-h-screen bg-[#08090a] pb-28 md:pb-10">
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-8 md:py-10">
        {/* Header skeleton */}
        <div className="mb-10 md:mb-12">
          <SkeletonPulse className="h-4 w-24 rounded mb-3" />
          <SkeletonPulse className="h-12 w-64 rounded-xl mb-3" />
          <SkeletonPulse className="h-5 w-40 rounded" />
        </div>

        {/* Search skeleton */}
        <SkeletonPulse className="h-12 md:h-14 w-full rounded-xl mb-10 md:mb-12" />

        {/* Stats skeleton */}
        <div className="grid grid-cols-3 gap-4 md:gap-5 mb-10 md:mb-14">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 md:p-6 rounded-2xl bg-[#18191b] border border-[#27282b]">
              <SkeletonPulse className="w-10 h-10 rounded-xl mb-4" />
              <SkeletonPulse className="h-8 w-16 rounded-lg mb-2" />
              <SkeletonPulse className="h-4 w-20 rounded" />
            </div>
          ))}
        </div>

        {/* Hero session skeleton */}
        <div className="p-8 md:p-10 rounded-3xl bg-[#18191b] border border-[#27282b] mb-10 md:mb-14">
          <div className="text-center py-6">
            <SkeletonPulse className="w-20 h-20 rounded-3xl mx-auto mb-6" />
            <SkeletonPulse className="h-7 w-56 rounded-lg mx-auto mb-3" />
            <SkeletonPulse className="h-5 w-72 max-w-full rounded mx-auto mb-6" />
            <SkeletonPulse className="h-14 w-56 rounded-2xl mx-auto" />
          </div>
        </div>

        {/* Quick actions skeleton */}
        <div className="mb-10 md:mb-14">
          <SkeletonPulse className="h-4 w-32 rounded mb-5" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <SkeletonPulse className="h-20 rounded-xl" />
            <SkeletonPulse className="h-20 rounded-xl" />
          </div>
        </div>

        {/* Tools skeleton */}
        <div className="mb-10">
          <SkeletonPulse className="h-4 w-20 rounded mb-5" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-5 md:p-6 rounded-2xl bg-[#18191b] border border-[#27282b]">
                <SkeletonPulse className="w-12 h-12 rounded-xl mb-4" />
                <SkeletonPulse className="h-5 w-28 rounded mb-2" />
                <SkeletonPulse className="h-4 w-40 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Loading indicator */}
        <div className="flex items-center justify-center gap-3 py-4">
          <div className="w-5 h-5 border-2 border-[#5e6dd2] border-t-transparent rounded-full animate-spin" />
          <span className="text-[14px] text-[#8b8d90]">Chargement...</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SECTION HEADER - Per analysis: smaller, muted, lowercase
// ============================================
function SectionHeader({
  title,
  action,
  onAction
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-[11px] font-medium text-[rgba(255,255,255,0.35)] uppercase tracking-[0.05em]">
        {title}
      </h2>
      {action && onAction && (
        <motion.button
          onClick={onAction}
          className="text-[13px] text-[#5e6dd2] hover:text-[#8b93ff] transition-colors font-medium flex items-center gap-1"
          whileHover={{ x: 2 }}
        >
          {action}
          <ChevronRight className="w-3.5 h-3.5" />
        </motion.button>
      )}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export function HomeScreen({ onNavigate, onCommandOpen }: HomeScreenProps) {
  const { user } = useAuth();
  const { squads, loading: squadsLoading, refreshSquads } = useSquads();
  const { sessions, getSquadSessions } = useSessions();

  const [transformedSquads, setTransformedSquads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [nextSession, setNextSession] = useState<NextSession | null>(null);

  const sessionsLoadedRef = useRef(false);
  const loadingSessionsRef = useRef(false);

  useEffect(() => {
    if (user) refreshSquads();
  }, [user]);

  const loadNextSession = useCallback(async () => {
    if (!squads || squads.length === 0 || loadingSessionsRef.current) {
      if (!squads || squads.length === 0) setNextSession(null);
      return;
    }

    if (sessionsLoadedRef.current) {
      processSessionsForNextSession(sessions);
      return;
    }

    loadingSessionsRef.current = true;

    try {
      for (const squad of squads) {
        try {
          await getSquadSessions(squad.id, 'upcoming');
        } catch (err) {
          console.warn('[Home] Erreur chargement sessions squad:', squad.id);
        }
      }
      sessionsLoadedRef.current = true;
    } catch (error) {
      console.error('[Home] Erreur loadNextSession:', error);
      setNextSession(null);
    } finally {
      loadingSessionsRef.current = false;
    }
  }, [squads, getSquadSessions]);

  const processSessionsForNextSession = useCallback((sessionsData: any[]) => {
    if (!sessionsData || sessionsData.length === 0 || !squads) {
      setNextSession(null);
      return;
    }

    const allUpcomingSessions: NextSession[] = [];
    const now = new Date();

    sessionsData.forEach((session: any) => {
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

    allUpcomingSessions.sort((a, b) => {
      const dateA = new Date(`${a.scheduled_date}T${a.scheduled_time}`);
      const dateB = new Date(`${b.scheduled_date}T${b.scheduled_time}`);
      return dateA.getTime() - dateB.getTime();
    });

    setNextSession(allUpcomingSessions[0] || null);
  }, [squads]);

  useEffect(() => {
    if (squads && squads.length > 0 && !sessionsLoadedRef.current) {
      loadNextSession();
    } else if (!squads || squads.length === 0) {
      setNextSession(null);
    }
  }, [squads, loadNextSession]);

  useEffect(() => {
    if (sessionsLoadedRef.current && sessions) {
      processSessionsForNextSession(sessions);
    }
  }, [sessions, processSessionsForNextSession]);

  // Transformer les squads et arrêter le loading
  // Important: on arrête le loading même si squads est un tableau vide (= pas de squads)
  useEffect(() => {
    // squadsLoading false signifie que le contexte a fini son travail
    if (!squadsLoading) {
      if (squads) {
        const transformed = squads.map((squad: any) => ({
          ...squad,
          membersCount: squad.total_members || 0,
        }));
        setTransformedSquads(transformed);
      } else {
        // Pas de squads mais chargement terminé
        setTransformedSquads([]);
      }
      // Arrêter le loading dans tous les cas
      setIsLoading(false);
    }
  }, [squads, squadsLoading]);

  // Timeout de sécurité - augmenté à 15s pour les connexions lentes
  // Ne se déclenche que si on est TOUJOURS en loading après 15s
  useEffect(() => {
    // Ne pas démarrer le timeout si déjà chargé
    if (!isLoading && !squadsLoading) return;

    const timeout = setTimeout(() => {
      // Double vérification avant d'afficher l'erreur
      if (isLoading || squadsLoading) {
        console.warn('[Home] Timeout de chargement atteint (15s)');
        setLoadingError('Le chargement prend trop de temps. Vérifie ta connexion.');
        setIsLoading(false);
      }
    }, 15000);

    return () => clearTimeout(timeout);
  }, [isLoading, squadsLoading]);

  const handleRetry = () => {
    setLoadingError(null);
    setIsLoading(true);
    sessionsLoadedRef.current = false;
    loadingSessionsRef.current = false;
    refreshSquads();
  };

  // Error state
  if (loadingError) {
    return (
      <div className="min-h-screen bg-[#08090a] flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-3xl bg-[#18191b] border border-[#27282b] flex items-center justify-center mx-auto mb-6">
            <Target className="w-8 h-8 text-[#5e6063]" />
          </div>
          <h2 className="text-[20px] font-bold text-[#f7f8f8] mb-3">Oups !</h2>
          <p className="text-[15px] text-[#8b8d90] mb-8 leading-relaxed">{loadingError}</p>
          <motion.button
            onClick={handleRetry}
            className="h-12 px-8 rounded-xl bg-[#5e6dd2] text-white text-[15px] font-semibold hover:bg-[#6a79db] transition-colors"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Réessayer
          </motion.button>
        </div>
      </div>
    );
  }

  // Loading state - Premium skeleton
  if (squadsLoading || isLoading) {
    return <HomeScreenSkeleton />;
  }

  const displayName = user?.display_name || user?.username || 'Gamer';
  const reliabilityScore = user?.reliability_score || 100;
  const totalPlayers = transformedSquads.reduce((acc, s) => acc + (s.membersCount || 0), 0);

  return (
    <div className="min-h-screen pb-28 md:pb-10 relative overflow-hidden" style={{ backgroundColor: '#F5F3F0' }}>
      {/* Lumière ambiante orange top-left */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: '-20%',
          left: '-10%',
          width: '60%',
          height: '60%',
          background: 'radial-gradient(circle at center, rgba(239, 156, 30, 0.15) 0%, rgba(239, 156, 30, 0.08) 30%, rgba(239, 156, 30, 0.03) 50%, transparent 70%)',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />

      {/* Quadrillage orange subtil */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(239, 156, 30, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 156, 30, 0.03) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          zIndex: 1,
        }}
      />

      {/* Contenu principal */}
      <div className="relative z-10">
        <motion.div
          className="max-w-4xl mx-auto px-5 md:px-8 py-8 md:py-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
        {/* ============================================ */}
        {/* HERO HEADER - Per analysis: 56px title, subtle subtitle */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mb-8 md:mb-10">
          <p className="text-[14px] text-[rgba(255,255,255,0.5)] font-medium mb-1">Bienvenue,</p>
          <h1 className="text-[48px] md:text-[56px] font-medium text-white leading-[1.1] tracking-[-0.02em] mb-2">
            {displayName}
          </h1>
          <p className="text-[16px] text-[rgba(255,255,255,0.5)] flex items-center gap-2">
            {nextSession ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#4ade80]" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                Une session t'attend
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-[#f5a623]" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                Prêt à jouer ?
              </>
            )}
          </p>
        </motion.div>

        {/* ============================================ */}
        {/* COMMAND PALETTE TRIGGER */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mb-10 md:mb-12">
          <CommandPaletteTrigger onClick={onCommandOpen} />
        </motion.div>

        {/* ============================================ */}
        {/* STATS - Premium cards */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mb-10 md:mb-14">
          <div className="grid grid-cols-3 gap-4 md:gap-5">
            <StatCard
              icon={Calendar}
              value={sessions?.length || 0}
              label="Sessions"
              trend={{ value: 12, positive: true }}
              accentColor="#5e6dd2"
            />
            <StatCard
              icon={Users}
              value={totalPlayers}
              label="Joueurs"
              accentColor="#8b5cf6"
            />
            <StatCard
              icon={TrendingUp}
              value={`${reliabilityScore}%`}
              label="Fiabilité"
              progress={reliabilityScore}
              accentColor="#4ade80"
            />
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* HERO SESSION BLOCK */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mb-10 md:mb-14">
          <HeroSessionBlock
            session={nextSession}
            onNavigate={onNavigate}
            onPlanSession={() => onNavigate("propose-session")}
          />
        </motion.div>

        {/* ============================================ */}
        {/* QUICK ACTIONS */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mb-10 md:mb-14">
          <SectionHeader title="Actions rapides" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <QuickActionCard
              icon={Plus}
              title="Créer une session"
              subtitle="Planifie un moment de jeu"
              onClick={() => onNavigate("propose-session")}
              variant="primary"
            />
            <QuickActionCard
              icon={Users}
              title="Rejoindre une squad"
              subtitle="Découvre des joueurs"
              onClick={() => onNavigate("discover-squads")}
            />
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* TOOLS - Premium cards grid */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mb-10 md:mb-14">
          <SectionHeader title="Outils" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            <ToolCard
              icon={Brain}
              title="Intelligence"
              description="Optimise tes créneaux avec l'IA"
              onClick={() => onNavigate("intelligence")}
              badge="IA"
              accentColor="#8b5cf6"
            />
            <ToolCard
              icon={BarChart3}
              title="Statistiques"
              description="Analyse ta régularité"
              onClick={() => onNavigate("advanced-stats")}
              accentColor="#5e6dd2"
            />
            <ToolCard
              icon={Repeat}
              title="Récurrence"
              description="Planifie tes rituels"
              onClick={() => onNavigate("recurring-session")}
              accentColor="#4ade80"
            />
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* SOCIAL - Compact list */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mb-10 md:mb-14">
          <SectionHeader title="Social" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            <ToolCard
              icon={Trophy}
              title="Classements"
              description="Compare-toi aux meilleurs"
              onClick={() => onNavigate("leaderboard")}
              accentColor="#f5a623"
            />
            <ToolCard
              icon={Target}
              title="Défis"
              description="Relève les challenges"
              onClick={() => onNavigate("challenges")}
              accentColor="#f87171"
            />
            <ToolCard
              icon={Building2}
              title="Organisation"
              description="Gère ta structure"
              onClick={() => onNavigate("organization")}
              badge="PRO"
              accentColor="#5e6dd2"
            />
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* SQUADS */}
        {/* ============================================ */}
        <motion.div variants={itemVariants}>
          <SectionHeader
            title="Mes Squads"
            action={transformedSquads.length > 0 ? "Voir tout" : undefined}
            onAction={() => onNavigate("squads")}
          />

          {transformedSquads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {transformedSquads.slice(0, 4).map((squad) => (
                <SquadCard
                  key={squad.id}
                  squad={squad}
                  onClick={() => onNavigate("squad-detail", { squadId: squad.id })}
                />
              ))}
            </div>
          ) : (
            <motion.div
              className="p-8 md:p-12 rounded-3xl bg-gradient-to-b from-[#18191b] to-[#101012] border border-[rgba(255,255,255,0.06)] text-center"
              whileHover={{ borderColor: "rgba(255,255,255,0.1)" }}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-[#1f2023] flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 md:w-10 md:h-10 text-[#5e6063]" strokeWidth={1.2} />
              </div>
              <h3 className="text-[18px] md:text-[20px] font-bold text-[#f7f8f8] mb-2">Pas encore de squad</h3>
              <p className="text-[14px] md:text-[15px] text-[#8b8d90] mb-8 max-w-[300px] mx-auto leading-relaxed">
                Crée ou rejoins une squad pour organiser tes sessions de jeu
              </p>
              <motion.button
                onClick={() => onNavigate("create-squad")}
                className="inline-flex items-center gap-2.5 h-12 px-7 rounded-xl bg-[#5e6dd2] text-white text-[15px] font-semibold shadow-lg shadow-[#5e6dd2]/20 hover:bg-[#6a79db] transition-colors"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-5 h-5" strokeWidth={2} />
                Créer une squad
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
      </div>{/* Fin du contenu z-10 */}
    </div>
  );
}

export default HomeScreen;
