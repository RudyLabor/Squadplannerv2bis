/**
 * 📋 SQUAD DETAIL SCREEN - Premium UI Design
 * Design System v2 - Mobile-first with Framer Motion
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
  Sparkles,
  ChevronRight,
  Gamepad2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSquads } from "@/app/contexts/SquadsContext";
import { useSessions } from "@/app/contexts/SessionsContext";

interface SquadDetailScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  data?: { squadId?: string };
}

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

const gameGradients: Record<string, string> = {
  'Valorant': 'from-red-500 to-pink-500',
  'League of Legends': 'from-blue-500 to-cyan-500',
  'LoL': 'from-blue-500 to-cyan-500',
  'CS2': 'from-amber-500 to-orange-500',
  'Apex Legends': 'from-red-600 to-orange-500',
  'Overwatch 2': 'from-orange-500 to-amber-400',
  'default': 'from-indigo-500 to-purple-500'
};

const getGameGradient = (game: string) => {
  return gameGradients[game] || gameGradients.default;
};

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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4 shadow-lg"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Users className="w-8 h-8 text-white" />
          </motion.div>
          <p className="text-gray-500 font-medium">Chargement...</p>
        </motion.div>
      </div>
    );
  }

  if (!squad) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          className="text-center px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Squad non trouvée</h3>
          <p className="text-gray-500 mb-4">Cette squad n'existe pas ou a été supprimée</p>
          <motion.button
            onClick={() => onNavigate("squads")}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Retour aux squads
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const members = Array.isArray(squad.members) ? squad.members : [];
  const nextSession = sessions[0];
  const gradient = getGameGradient(squad.game || '');

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
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

      <div className="relative z-10 px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
            <motion.button
              onClick={() => onNavigate("squads")}
              className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-800">{squad.name}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <Gamepad2 className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500 font-medium">{squad.game}</span>
              </div>
            </div>
            <motion.button
              onClick={handleShareSquad}
              className="w-11 h-11 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {linkCopied ? (
                <Check className="w-5 h-5 text-emerald-500" />
              ) : (
                <Share2 className="w-5 h-5 text-gray-600" />
              )}
            </motion.button>
            <motion.button
              onClick={() => onNavigate("squad-settings", { squadId: squad.id })}
              className="w-11 h-11 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </motion.button>
          </motion.div>

          {/* Next Session Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-lg mb-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-500" />
                Prochaine session
              </h2>
              {nextSession && (
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-xs font-semibold">
                  À venir
                </span>
              )}
            </div>

            {nextSession ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}
                    whileHover={{ rotate: 5 }}
                  >
                    <Gamepad2 className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{nextSession.title || 'Session'}</div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(nextSession.scheduled_date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                        })} à {nextSession.scheduled_time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {nextSession.rsvps?.filter((r: any) => r.response === 'yes').length || 0}/{nextSession.required_players || 5}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => handleRSVP(nextSession.id, "yes")}
                    className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-md flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Check className="w-5 h-5" />
                    Je suis dispo
                  </motion.button>
                  <motion.button
                    onClick={() => handleRSVP(nextSession.id, "no")}
                    className="px-5 h-12 text-red-500 bg-red-50 hover:bg-red-100 font-semibold rounded-xl transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Indispo
                  </motion.button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-7 h-7 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm font-medium">Aucune session planifiée</p>
                <motion.button
                  onClick={() => onNavigate("propose-session", { squadId: squad.id })}
                  className="mt-3 text-indigo-600 font-semibold text-sm"
                  whileHover={{ x: 3 }}
                >
                  Proposer une session →
                </motion.button>
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-4">
            <motion.button
              onClick={() => onNavigate("propose-session", { squadId: squad.id })}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg text-left"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-3 shadow-md">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-800 text-sm">Proposer session</span>
            </motion.button>
            <motion.button
              onClick={() => onNavigate("squad-chat", { squadId: squad.id })}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg text-left"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-3 shadow-md">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-800 text-sm">Chat squad</span>
            </motion.button>
          </motion.div>

          {/* Invite Link Card */}
          <motion.div
            variants={itemVariants}
            className={`bg-gradient-to-r ${gradient} rounded-2xl p-5 mb-6 shadow-xl relative overflow-hidden`}
          >
            <motion.div
              className="absolute top-2 right-2 w-20 h-20 bg-white/10 rounded-full blur-2xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Link className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-sm">Lien d'invitation</h3>
                <p className="text-xs text-white/80">Partage ce code pour inviter des amis</p>
              </div>
            </div>
            <div className="flex items-center gap-2 relative z-10">
              <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30">
                <code className="text-sm font-mono font-bold text-white tracking-wider">
                  {squad.invite_code || squad.id?.slice(0, 8).toUpperCase()}
                </code>
              </div>
              <motion.button
                onClick={handleShareSquad}
                className="h-12 px-5 bg-white text-gray-800 font-semibold rounded-xl flex items-center gap-2 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {linkCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    Copié
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copier
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Members */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-lg mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                Membres
              </h2>
              <span className="text-sm text-gray-500 font-medium">{members.length} membres</span>
            </div>

            <div className="space-y-3">
              {members.slice(0, 5).map((member: any, index: number) => (
                <motion.div
                  key={member.userId || index}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                    {(member.name || `M${index + 1}`).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800 text-sm">
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
                </motion.div>
              ))}
            </div>

            {members.length > 5 && (
              <motion.button
                className="w-full mt-4 text-sm text-indigo-600 font-semibold flex items-center justify-center gap-1"
                whileHover={{ x: 3 }}
              >
                Voir tous les membres ({members.length})
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            )}
          </motion.div>

          {/* Invite Button */}
          <motion.button
            variants={itemVariants}
            onClick={() => onNavigate("invite-member", { squadId: squad.id })}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl font-semibold flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/30"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <UserPlus className="w-5 h-5" />
            Inviter un membre
            <Sparkles className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default SquadDetailScreen;
