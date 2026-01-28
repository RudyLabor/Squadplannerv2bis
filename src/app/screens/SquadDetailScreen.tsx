/**
 * 📋 SQUAD DETAIL SCREEN - Aligné sur maquette Figma
 * Design System v2 - Mobile-first
 */

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Plus,
  MessageCircle,
  Settings,
  UserPlus,
  Crown,
  Shield,
  Share2,
  Copy,
  Check,
  Link,
} from "lucide-react";
import { useSquads } from "@/app/contexts/SquadsContext";
import { useSessions } from "@/app/contexts/SessionsContext";
import { ActionButton, Avatar, Badge } from "@/app/components/ui/DesignSystem";

interface SquadDetailScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  data?: { squadId?: string };
}

export function SquadDetailScreen({
  onNavigate,
  showToast,
  data,
}: SquadDetailScreenProps) {
  const { currentSquad: squad, getSquadById, loading: squadLoading } = useSquads();
  const { sessions, getSquadSessions, rsvpToSession, loading: sessionsLoading } = useSessions();
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (data?.squadId) {
      getSquadById(data.squadId);
      getSquadSessions(data.squadId, 'upcoming');
    }
  }, [data?.squadId]);

  const getInviteLink = () => {
    const code = squad?.invite_code || squad?.id?.slice(0, 8).toUpperCase();
    return `${window.location.origin}/join/${code}`;
  };

  const handleShareSquad = async () => {
    const inviteLink = getInviteLink();
    const shareData = {
      title: `Rejoins ${squad?.name} sur Squad Planner !`,
      text: `${squad?.name} t'invite à rejoindre son squad sur Squad Planner. Clique sur le lien pour nous rejoindre !`,
      url: inviteLink,
    };

    // Try native share first (mobile)
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        showToast("Lien partagé !", "success");
        return;
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(inviteLink);
      setLinkCopied(true);
      showToast("Lien copié dans le presse-papier !", "success");
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      showToast("Impossible de copier le lien", "error");
    }
  };

  const handleRSVP = async (sessionId: string, response: "yes" | "no") => {
    try {
      await rsvpToSession(sessionId, response);
      showToast(
        response === "yes" ? "Participation confirmée !" : "Absence notée",
        "success"
      );
    } catch (err: any) {
      showToast("Erreur lors de l'RSVP", "error");
    }
  };

  // Loading state
  if (squadLoading || sessionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!squad) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Squad non trouvée</p>
          <button
            onClick={() => onNavigate("squads")}
            className="mt-4 text-amber-500"
          >
            Retour aux squads
          </button>
        </div>
      </div>
    );
  }

  const members = Array.isArray(squad.members) ? squad.members : [];
  const nextSession = sessions[0];

  return (
    <div className="min-h-screen pb-24">
      <div className="px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => onNavigate("squads")}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{squad.name}</h1>
            <p className="text-sm text-gray-500">{squad.game}</p>
          </div>
          <button
            onClick={handleShareSquad}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            title="Partager le lien d'invitation"
          >
            {linkCopied ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Share2 className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <button
            onClick={() => onNavigate("squad-settings", { squadId: squad.id })}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Next Session Card */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Prochaine session</h2>
            <Calendar className="w-5 h-5 text-amber-500" />
          </div>

          {nextSession ? (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Clock className="w-4 h-4" />
                {new Date(nextSession.scheduled_date).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}{" "}
                à{" "}
                {nextSession.scheduled_time}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Users className="w-4 h-4" />
                {nextSession.rsvps?.filter((r: any) => r.response === 'yes').length || 0}/{nextSession.required_players || 5}{" "}
                confirmés
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRSVP(nextSession.id, "yes")}
                  className="flex-1 h-10 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-full transition-colors"
                >
                  Je suis dispo
                </button>
                <button
                  onClick={() => handleRSVP(nextSession.id, "no")}
                  className="px-4 h-10 text-red-500 hover:bg-red-50 font-medium rounded-full transition-colors"
                >
                  Indisponible
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">Aucune session planifiée</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() =>
              onNavigate("propose-session", { squadId: squad.id })
            }
            className="bg-white rounded-2xl p-4 border border-gray-100 text-left hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-5 h-5 text-amber-500 mb-2" />
            <span className="font-medium text-gray-900 text-sm">
              Proposer session
            </span>
          </button>
          <button
            onClick={() => onNavigate("squad-chat", { squadId: squad.id })}
            className="bg-white rounded-2xl p-4 border border-gray-100 text-left hover:bg-gray-50 transition-colors"
          >
            <MessageCircle className="w-5 h-5 text-teal-500 mb-2" />
            <span className="font-medium text-gray-900 text-sm">Chat squad</span>
          </button>
        </div>

        {/* Invite Link Card */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
              <Link className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm">Lien d'invitation</h3>
              <p className="text-xs text-gray-500">Partage ce code pour inviter des amis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white rounded-xl px-4 py-3 border border-amber-200">
              <code className="text-sm font-mono font-bold text-amber-600 tracking-wider">
                {squad.invite_code || squad.id?.slice(0, 8).toUpperCase()}
              </code>
            </div>
            <button
              onClick={handleShareSquad}
              className="h-12 px-4 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
            >
              {linkCopied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copié
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copier
                </>
              )}
            </button>
          </div>
        </div>

        {/* Members */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Membres</h2>
            <span className="text-sm text-gray-500">{members.length} membres</span>
          </div>

          <div className="space-y-3">
            {members.slice(0, 5).map((member: any, index: number) => (
              <div key={member.userId || index} className="flex items-center gap-3">
                <Avatar
                  name={member.name || `Membre ${index + 1}`}
                  size="sm"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 text-sm">
                      {member.name || `Membre ${index + 1}`}
                    </span>
                    {member.role === "owner" && (
                      <Crown className="w-4 h-4 text-amber-500" />
                    )}
                    {member.role === "admin" && (
                      <Shield className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {members.length > 5 && (
            <button className="w-full mt-4 text-sm text-amber-500 font-medium">
              Voir tous les membres ({members.length})
            </button>
          )}
        </div>

        {/* Invite Button */}
        <ActionButton
          variant="secondary"
          icon={UserPlus}
          onClick={() => onNavigate("invite-member", { squadId: squad.id })}
          className="w-full"
        >
          Inviter un membre
        </ActionButton>
      </div>
    </div>
  );
}

export default SquadDetailScreen;
