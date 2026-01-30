/**
 * SESSIONS SCREEN - LINEAR DESIGN SYSTEM
 * Premium minimal design matching HomeScreen
 */

import { useState, useEffect } from "react";
import { Plus, Calendar, Clock, Users, Check, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sessionsAPI } from "@/utils/api";
import { useAuth } from "@/app/contexts/AuthContext";
import { SessionDetailModal } from "@/app/components/SessionDetailModal";
import { OrangeDivider } from "@/design-system";

interface SessionsScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

type FilterType = "all" | "today" | "upcoming";

// Animations - Linear style (same as HomeScreen)
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

// ============================================
// STAT CARD - Visually recessed
// ============================================
function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <motion.div
      className="p-4 rounded-xl bg-[#111214] border border-[#1a1b1f] hover:border-[#26282d] hover:bg-[#141518] transition-all duration-100 group cursor-default"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.1 }}
    >
      <p className="text-[24px] md:text-[28px] font-semibold text-[#ececed] tabular-nums leading-none mb-1">
        {value}
      </p>
      <span className="text-[12px] md:text-[13px] text-[#4a4b50] block">{label}</span>
    </motion.div>
  );
}

// ============================================
// FILTER TAB
// ============================================
function FilterTab({
  label,
  active,
  onClick
}: {
  label: string;
  active: boolean;
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-100 ${
        active
          ? "bg-[#5e6ad2] text-white shadow-lg shadow-[#5e6ad2]/20"
          : "bg-[#111214] text-[#6f7177] border border-[#1a1b1f] hover:border-[#26282d] hover:text-[#ececed]"
      }`}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      {label}
    </motion.button>
  );
}

// ============================================
// SESSION CARD
// ============================================
function SessionCard({
  session,
  onRSVP,
  onOpenDetail
}: {
  session: any;
  onRSVP: (sessionId: string, response: "yes" | "no") => void;
  onOpenDetail: (sessionId: string) => void;
}) {
  const date = new Date(session.date);
  const formattedDate = date.toLocaleDateString("fr-FR", {
    weekday: 'short',
    day: "numeric",
    month: "short",
  });
  const formattedTime = date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const confirmed = session.confirmedCount || 0;
  const total = session.totalSlots || 5;
  const isComplete = confirmed >= total;
  const userRSVP = session.userRSVP;

  return (
    <motion.button
      onClick={() => onOpenDetail(session.id)}
      className="w-full p-4 md:p-5 rounded-xl bg-[#111214] border border-[#1a1b1f] hover:bg-[#141518] hover:border-[#26282d] text-left transition-all duration-100 group"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.995 }}
      transition={{ duration: 0.1 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-medium text-[#ececed] group-hover:text-white mb-1 truncate transition-colors">
            {session.title || session.name || "Session"}
          </h3>
          <p className="text-[13px] text-[#4a4b50] group-hover:text-[#6f7177] truncate transition-colors">
            {session.squadName} • {session.game}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-[#26282d] group-hover:text-[#4a4b50] mt-1 flex-shrink-0 transition-colors" />
      </div>

      {/* Date & Time */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5 text-[13px] text-[#6f7177]">
          <Calendar className="w-4 h-4 text-[#4a4b50]" strokeWidth={1.5} />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[13px] text-[#6f7177]">
          <Clock className="w-4 h-4 text-[#4a4b50]" strokeWidth={1.5} />
          <span>{formattedTime}</span>
        </div>
      </div>

      {/* Status & Actions */}
      <div className="flex items-center gap-2">
        {/* Participants */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-medium ${
          isComplete
            ? "bg-[#4ade80]/10 text-[#4ade80]"
            : "bg-[#1a1b1f] text-[#6f7177]"
        }`}>
          <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
          {confirmed}/{total}
        </div>

        {isComplete && (
          <span className="px-2 py-1 text-[10px] font-medium rounded-lg bg-[#4ade80]/10 text-[#4ade80] uppercase">
            Complet
          </span>
        )}

        {userRSVP === "yes" && (
          <span className="px-2 py-1 text-[10px] font-medium rounded-lg bg-[#4ade80]/10 text-[#4ade80] uppercase flex items-center gap-1">
            <Check className="w-3 h-3" />
            Confirmé
          </span>
        )}

        {!userRSVP && !isComplete && (
          <div className="flex gap-1.5 ml-auto">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onRSVP(session.id, "yes");
              }}
              className="w-8 h-8 rounded-lg bg-[#4ade80]/10 text-[#4ade80] flex items-center justify-center hover:bg-[#4ade80]/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Check className="w-4 h-4" strokeWidth={2} />
            </motion.button>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onRSVP(session.id, "no");
              }}
              className="w-8 h-8 rounded-lg bg-[#1a1b1f] text-[#6f7177] flex items-center justify-center hover:bg-[#1e2024] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </motion.button>
          </div>
        )}
      </div>
    </motion.button>
  );
}

// ============================================
// EMPTY STATE - Premium, action-oriented
// ============================================
function EmptyState({ onNavigate }: { onNavigate: (screen: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }}
      className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-[#131416] to-[#111214] border border-[#1a1b1f]"
    >
      <div className="text-center max-w-[320px] mx-auto">
        {/* Icon - Neutral, professional */}
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#1a1b1f] flex items-center justify-center mx-auto mb-5">
          <Calendar className="w-6 h-6 md:w-7 md:h-7 text-[#3a3b40]" strokeWidth={1.5} />
        </div>

        {/* Micro-copy - Factual, serious */}
        <h3 className="text-[15px] md:text-[16px] font-semibold text-[#ececed] mb-2">
          Aucune session planifiée
        </h3>
        <p className="text-[13px] md:text-[14px] text-[#6f7177] mb-6 leading-relaxed">
          Propose une session pour créer un engagement réel.
        </p>

        {/* Primary CTA - Clear, prominent */}
        <motion.button
          onClick={() => onNavigate("propose-session")}
          className="inline-flex items-center justify-center gap-2.5 w-full h-12 rounded-xl bg-[#5e6ad2] text-white text-[14px] font-semibold hover:bg-[#6872d9] shadow-lg shadow-[#5e6ad2]/20 transition-colors"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" strokeWidth={2} />
          Proposer une session
        </motion.button>
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export function SessionsScreen({ onNavigate, showToast }: SessionsScreenProps) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      loadSessions();
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [authLoading, isAuthenticated]);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const { sessions: userSessions } = await sessionsAPI.getSessions();
      setSessions(userSessions || []);
    } catch (error) {
      console.error("Load sessions error:", error);
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRSVP = async (sessionId: string, response: "yes" | "no") => {
    try {
      await sessionsAPI.rsvp(sessionId, response);
      showToast(response === "yes" ? "Participation confirmée" : "Absence notée", "success");
      loadSessions();
    } catch (error) {
      showToast("Erreur lors de la réponse", "error");
    }
  };

  // Filter sessions
  const filteredSessions = sessions.filter((session) => {
    const sessionDate = new Date(session.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (filter) {
      case "today":
        return sessionDate >= today && sessionDate < tomorrow;
      case "upcoming":
        return sessionDate >= today;
      default:
        return true;
    }
  });

  // Stats
  const todayCount = sessions.filter((s) => {
    const d = new Date(s.date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }).length;

  const confirmedCount = sessions.filter((s) => s.userRSVP === "yes").length;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0e0f11] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#5e6ad2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0f11] pb-24 md:pb-8">
      {/* Session Detail Modal */}
      {selectedSessionId && (
        <SessionDetailModal
          sessionId={selectedSessionId}
          isOpen={!!selectedSessionId}
          onClose={() => setSelectedSessionId(null)}
          onRSVP={() => loadSessions()}
          showToast={showToast}
          onNavigate={onNavigate}
        />
      )}

      <motion.div
        className="max-w-3xl mx-auto px-4 md:px-6 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-[24px] md:text-[26px] font-semibold text-[#ececed]">
              Mes Sessions
            </h1>
            <motion.button
              onClick={() => onNavigate("propose-session")}
              className="w-11 h-11 rounded-xl bg-[#5e6ad2] text-white flex items-center justify-center hover:bg-[#6872d9] shadow-lg shadow-[#5e6ad2]/20 transition-colors"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" strokeWidth={2} />
            </motion.button>
          </div>
          <p className="text-[13px] text-[#6f7177]">
            {sessions.length > 0
              ? `${sessions.length} session${sessions.length > 1 ? 's' : ''} à venir`
              : 'Planifie tes moments de jeu'
            }
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="grid grid-cols-3 gap-3">
            <StatCard value={sessions.length} label="Total" />
            <StatCard value={todayCount} label="Aujourd'hui" />
            <StatCard value={confirmedCount} label="Confirmées" />
          </div>
          <OrangeDivider className="mt-6" />
        </motion.div>

        {/* Filter Tabs */}
        <motion.div variants={itemVariants} className="flex gap-2 mb-6">
          <FilterTab label="Toutes" active={filter === "all"} onClick={() => setFilter("all")} />
          <FilterTab label="Aujourd'hui" active={filter === "today"} onClick={() => setFilter("today")} />
          <FilterTab label="À venir" active={filter === "upcoming"} onClick={() => setFilter("upcoming")} />
        </motion.div>

        {/* Sessions List */}
        <AnimatePresence mode="wait">
          {filteredSessions.length > 0 ? (
            <motion.div
              key="sessions-list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {filteredSessions.map((session) => (
                <motion.div key={session.id} variants={itemVariants}>
                  <SessionCard
                    session={session}
                    onRSVP={handleRSVP}
                    onOpenDetail={setSelectedSessionId}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <EmptyState onNavigate={onNavigate} />
          )}
        </AnimatePresence>

        {/* Fixed CTA Button */}
        {sessions.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="mt-8"
          >
            <motion.button
              onClick={() => onNavigate("propose-session")}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-[#141518] text-[#8b8d93] text-[14px] font-medium hover:bg-[#1a1b1f] hover:text-[#ececed] border border-[#1e2024] hover:border-[#26282d] transition-all duration-100"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-[18px] h-[18px]" strokeWidth={1.5} />
              Proposer une nouvelle session
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default SessionsScreen;
