/**
 * SESSIONS SCREEN - Premium UI v2.0
 * Framer Motion + Glassmorphism + Gradients
 */

import { useState, useEffect } from "react";
import { Plus, Calendar, Clock, Users, Check, X, Sparkles, Zap, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sessionsAPI } from "@/utils/api";
import { useAuth } from "@/app/contexts/AuthContext";
import { SessionDetailModal } from "@/app/components/SessionDetailModal";

interface SessionsScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

type FilterType = "all" | "today" | "upcoming";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
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

const gameGradients: Record<string, string> = {
  'Valorant': 'from-red-500 to-pink-500',
  'League of Legends': 'from-blue-500 to-cyan-500',
  'CS2': 'from-amber-500 to-orange-500',
  'Overwatch 2': 'from-orange-500 to-red-500',
  'Apex Legends': 'from-red-600 to-yellow-500',
  'default': 'from-indigo-500 to-purple-500'
};

interface PremiumSessionCardProps {
  session: any;
  time: string;
  onRSVP: (sessionId: string, response: "yes" | "no" | "maybe") => void;
  onOpenDetail: (sessionId: string) => void;
  index: number;
}

function PremiumSessionCard({ session, time, onRSVP, onOpenDetail, index }: PremiumSessionCardProps) {
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
  const gradient = gameGradients[session.game] || gameGradients['default'];

  return (
    <motion.div
      variants={itemVariants}
      custom={index}
      className="flex gap-4 mb-4"
    >
      {/* Time indicator */}
      <div className="w-14 flex-shrink-0">
        <div className="text-sm font-bold text-gray-800">{time}</div>
        <div className="text-xs text-gray-400">{formattedDate}</div>
      </div>

      {/* Card */}
      <motion.div
        onClick={() => onOpenDetail(session.id)}
        className="flex-1 relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg cursor-pointer group"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Left accent */}
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${gradient}`} />

        <div className="p-4 pl-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">
                {session.title || session.name || "Session"}
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                {session.squadName} • {session.game}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br ${gradient} shadow-md`}>
              {session.gameImage ? (
                <img
                  src={session.gameImage}
                  alt={session.game}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{formattedTime}</span>
            </div>
          </div>

          {/* Status & Actions */}
          <div className="flex items-center gap-2">
            {/* Participants */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
              isComplete
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-100 text-gray-600"
            }`}>
              <Users className="w-4 h-4" />
              {confirmed}/{total}
            </div>

            {isComplete && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-semibold"
              >
                Complet
              </motion.span>
            )}

            {userRSVP === "yes" && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                Confirmé
              </motion.span>
            )}

            {!userRSVP && !isComplete && (
              <div className="flex gap-1.5 ml-auto">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRSVP(session.id, "yes");
                  }}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-md"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Check className="w-5 h-5" strokeWidth={2.5} />
                </motion.button>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRSVP(session.id, "no");
                  }}
                  className="w-9 h-9 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" strokeWidth={2.5} />
                </motion.button>
              </div>
            )}

            <ChevronRight className="w-5 h-5 text-gray-300 ml-auto group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

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

  const handleRSVP = async (sessionId: string, response: "yes" | "no" | "maybe") => {
    try {
      await sessionsAPI.rsvp(sessionId, response);
      showToast(response === "yes" ? "Participation confirmée !" : "Absence notée", "success");
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

  // Group by time
  const groupedSessions = filteredSessions.reduce((acc, session) => {
    const hour = new Date(session.date).getHours();
    const timeKey = `${hour}h`;
    if (!acc[timeKey]) acc[timeKey] = [];
    acc[timeKey].push(session);
    return acc;
  }, {} as Record<string, any[]>);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-16 h-16 mx-auto mb-4">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-indigo-200"
              style={{ borderTopColor: 'transparent' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-indigo-500" />
            </div>
          </div>
          <p className="text-gray-500 font-medium">Chargement des sessions...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

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

      <div className="relative z-10 px-4 py-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
              Mes Sessions
            </h1>
            <p className="text-gray-500 font-medium">
              {sessions.length} session{sessions.length > 1 ? 's' : ''} à venir
            </p>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div variants={itemVariants} className="flex gap-2 mb-6">
            {[
              { key: "all", label: "Toutes" },
              { key: "today", label: "Aujourd'hui" },
              { key: "upcoming", label: "À venir" },
            ].map((tab) => (
              <motion.button
                key={tab.key}
                onClick={() => setFilter(tab.key as FilterType)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  filter === tab.key
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30"
                    : "bg-white/80 backdrop-blur-sm text-gray-600 border border-white/50"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Sessions List */}
          <AnimatePresence mode="wait">
            {Object.keys(groupedSessions).length > 0 ? (
              <motion.div
                key="sessions-list"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {Object.entries(groupedSessions).map(([time, timeSessions], groupIndex) => (
                  <div key={time}>
                    {(timeSessions as any[]).map((session, sessionIndex) => (
                      <PremiumSessionCard
                        key={session.id}
                        session={session}
                        time={time}
                        onRSVP={handleRSVP}
                        onOpenDetail={setSelectedSessionId}
                        index={groupIndex * 10 + sessionIndex}
                      />
                    ))}
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12"
              >
                <motion.div
                  className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/30"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Calendar className="w-12 h-12 text-white" strokeWidth={1.5} />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Aucune session
                </h3>
                <p className="text-gray-500 mb-6 max-w-xs mx-auto">
                  Proposez une session ou rejoignez une squad
                </p>
                <motion.button
                  onClick={() => onNavigate("propose-session")}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/30 flex items-center gap-2 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles className="w-5 h-5" />
                  Proposer une session
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Fixed CTA Button */}
      {sessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-28 left-4 right-4 max-w-md mx-auto"
        >
          <motion.button
            onClick={() => onNavigate("propose-session")}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-6 h-6" strokeWidth={2.5} />
            Proposer une session
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

export default SessionsScreen;
