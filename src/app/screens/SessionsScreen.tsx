/**
 * 📅 SESSIONS SCREEN - Aligné sur maquette Figma
 * Design System v2 - Mobile-first
 */

import { useState, useEffect } from "react";
import { Plus, Calendar, Clock, Users, Check, X } from "lucide-react";
import { sessionsAPI } from "@/utils/api";
import { useAuth } from "@/app/contexts/AuthContext";
import { PageHeader, ActionButton, Badge } from "@/app/components/ui/DesignSystem";
import { SessionDetailModal } from "@/app/components/SessionDetailModal";

interface SessionsScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

type FilterType = "all" | "today" | "upcoming";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Chargement des sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Session Detail Modal avec RSVP système complet */}
      {selectedSessionId && (
        <SessionDetailModal
          sessionId={selectedSessionId}
          isOpen={!!selectedSessionId}
          onClose={() => setSelectedSessionId(null)}
          onRSVP={() => {
            loadSessions(); // Refresh list after RSVP
          }}
          showToast={showToast}
          onNavigate={onNavigate}
        />
      )}

      <div className="px-4 py-6">
        {/* Header */}
        <PageHeader
          title="Mes sessions"
          subtitle={`${sessions.length} sessions à venir`}
        />

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "all", label: "Toutes" },
            { key: "today", label: "Aujourd'hui" },
            { key: "upcoming", label: "À venir" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as FilterType)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === tab.key
                  ? "bg-amber-500 text-white"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sessions List */}
        {Object.keys(groupedSessions).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(groupedSessions).map(([time, timeSessions]) => (
              <div key={time}>
                {(timeSessions as any[]).map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    time={time}
                    onRSVP={handleRSVP}
                    onOpenDetail={setSelectedSessionId}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Aucune session</h3>
            <p className="text-sm text-gray-500 mb-4">
              Proposez une session ou rejoignez une squad
            </p>
          </div>
        )}

        {/* Fixed CTA Button */}
        <div className="fixed bottom-24 left-4 right-4 max-w-md mx-auto">
          <ActionButton
            variant="primary"
            icon={Plus}
            onClick={() => onNavigate("propose-session")}
            className="w-full shadow-lg"
          >
            Proposer une session
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

// Session Card Component
interface SessionCardProps {
  session: any;
  time: string;
  onRSVP: (sessionId: string, response: "yes" | "no" | "maybe") => void;
  onOpenDetail: (sessionId: string) => void;
}

function SessionCard({ session, time, onRSVP, onOpenDetail }: SessionCardProps) {
  const date = new Date(session.date);
  const formattedDate = date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
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
    <div className="flex gap-4 mb-6">
      {/* Time indicator */}
      <div className="w-12 text-sm text-gray-400 font-medium pt-1">{time}</div>

      {/* Card */}
      <div
        className="flex-1 bg-white rounded-2xl p-4 border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => onOpenDetail(session.id)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              {session.title || session.name || "Session"}
            </h3>
            <p className="text-sm text-gray-500">
              {session.squadName} • {session.game}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
            <img
              src={session.gameImage || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop"}
              alt={session.game}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Date & Time */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {formattedTime}
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-sm ${
            isComplete ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
          }`}>
            <Users className="w-4 h-4" />
            {confirmed}/{total}
          </div>

          {isComplete && (
            <Badge variant="success">Complet</Badge>
          )}

          {userRSVP === "yes" && (
            <Badge variant="success">Confirmé</Badge>
          )}

          {!userRSVP && !isComplete && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRSVP(session.id, "yes");
                }}
                className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-200 transition-colors"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRSVP(session.id, "no");
                }}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SessionsScreen;
