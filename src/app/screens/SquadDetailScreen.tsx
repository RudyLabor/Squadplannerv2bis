/**
 * SQUAD DETAIL SCREEN - LINEAR DESIGN SYSTEM
 * Premium, Dark, Minimal - Squad overview
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
  ChevronRight,
  Gamepad2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSquads } from "@/app/contexts/SquadsContext";
import { useSessions } from "@/app/contexts/SessionsContext";

interface SquadDetailScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  data?: { squadId?: string };
}

// Linear-style animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }
  }
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
      text: `${squad?.name} t'invite a rejoindre son squad sur Squad Planner.`,
      url: inviteLink,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        showToast("Lien partage", "success");
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
      showToast("Lien copie", "success");
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      showToast("Impossible de copier le lien", "error");
    }
  };

  const handleRSVP = async (sessionId: string, response: "yes" | "no") => {
    try {
      await rsvpToSession(sessionId, response);
      showToast(
        response === "yes" ? "Participation confirmee" : "Absence notee",
        "success"
      );
    } catch (err: any) {
      showToast("Erreur lors de l'RSVP", "error");
    }
  };

  // Loading state
  if (squadLoading || sessionsLoading) {
    return (
      <div className="min-h-screen bg-[#0e0f11] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#5e6ad2]/30 border-t-[#5e6ad2] rounded-full animate-spin" />
      </div>
    );
  }

  if (!squad) {
    return (
      <div className="min-h-screen bg-[#0e0f11] flex items-center justify-center">
        <motion.div
          className="text-center px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#141518] border border-[#1e2024] flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-[#4a4b50]" strokeWidth={1.5} />
          </div>
          <h3 className="text-[16px] font-semibold text-[#ececed] mb-2">Squad non trouvee</h3>
          <p className="text-[13px] text-[#6f7177] mb-6">Cette squad n'existe pas ou a ete supprimee</p>
          <motion.button
            onClick={() => onNavigate("squads")}
            className="px-5 py-2.5 rounded-lg bg-[#5e6ad2] text-white text-[14px] font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Retour aux squads
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const members = Array.isArray(squad.members) ? squad.members : [];
  const nextSession = sessions[0];

  return (
    <div className="min-h-screen pb-24 bg-[#0e0f11]">
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
            <motion.button
              onClick={() => onNavigate("squads")}
              className="w-10 h-10 rounded-xl bg-[#141518] border border-[#1e2024] flex items-center justify-center text-[#8b8d93] hover:text-[#ececed] hover:bg-[#1a1b1f] transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-[18px] font-semibold text-[#ececed] tracking-tight">{squad.name}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <Gamepad2 className="w-4 h-4 text-[#6f7177]" strokeWidth={1.5} />
                <span className="text-[13px] text-[#6f7177]">{squad.game}</span>
              </div>
            </div>
            <motion.button
              onClick={handleShareSquad}
              className="w-10 h-10 rounded-xl bg-[#141518] border border-[#1e2024] flex items-center justify-center text-[#8b8d93] hover:text-[#ececed] transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {linkCopied ? <Check className="w-5 h-5 text-[#4ade80]" /> : <Share2 className="w-5 h-5" strokeWidth={1.5} />}
            </motion.button>
            <motion.button
              onClick={() => onNavigate("squad-settings", { squadId: squad.id })}
              className="w-10 h-10 rounded-xl bg-[#141518] border border-[#1e2024] flex items-center justify-center text-[#8b8d93] hover:text-[#ececed] transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Settings className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>
          </motion.div>

          {/* Next Session Card */}
          <motion.div variants={itemVariants} className="mb-4">
            <div className="p-5 rounded-xl bg-[#141518] border border-[#1e2024]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[14px] font-semibold text-[#ececed] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#5e6ad2]" strokeWidth={1.5} />
                  Prochaine session
                </h2>
                {nextSession && (
                  <span className="px-2 py-1 rounded-md bg-[#4ade80]/10 text-[#4ade80] text-[11px] font-medium">
                    A venir
                  </span>
                )}
              </div>

              {nextSession ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-lg bg-[#5e6ad2] flex items-center justify-center">
                      <Gamepad2 className="w-5 h-5 text-white" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <div className="text-[14px] font-medium text-[#ececed]">{nextSession.title || 'Session'}</div>
                      <div className="flex items-center gap-3 text-[12px] text-[#6f7177] mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                          {new Date(nextSession.scheduled_date).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                          })} a {nextSession.scheduled_time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
                          {nextSession.rsvps?.filter((r: any) => r.response === 'yes').length || 0}/{nextSession.required_players || 5}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => handleRSVP(nextSession.id, "yes")}
                      className="flex-1 h-10 flex items-center justify-center gap-2 rounded-lg bg-[#4ade80] text-[#0e0f11] text-[13px] font-semibold"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Check className="w-4 h-4" strokeWidth={2} />
                      Dispo
                    </motion.button>
                    <motion.button
                      onClick={() => handleRSVP(nextSession.id, "no")}
                      className="px-4 h-10 flex items-center justify-center rounded-lg bg-[#1e2024] text-[#8b8d93] text-[13px] font-medium hover:bg-[#26282d] transition-colors"
                      whileTap={{ scale: 0.98 }}
                    >
                      Indispo
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-xl bg-[#1e2024] flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-[#4a4b50]" strokeWidth={1.5} />
                  </div>
                  <p className="text-[13px] text-[#6f7177] mb-3">Aucune session planifiee</p>
                  <motion.button
                    onClick={() => onNavigate("propose-session", { squadId: squad.id })}
                    className="text-[13px] text-[#5e6ad2] font-medium flex items-center gap-1 mx-auto"
                    whileHover={{ x: 2 }}
                  >
                    Proposer une session
                    <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-4">
            <motion.button
              onClick={() => onNavigate("propose-session", { squadId: squad.id })}
              className="p-4 rounded-xl bg-[#141518] border border-[#1e2024] text-left hover:bg-[#1a1b1f] transition-all"
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="w-10 h-10 rounded-lg bg-[#5e6ad2] flex items-center justify-center mb-3">
                <Plus className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <span className="text-[13px] font-medium text-[#ececed]">Proposer session</span>
            </motion.button>
            <motion.button
              onClick={() => onNavigate("squad-chat", { squadId: squad.id })}
              className="p-4 rounded-xl bg-[#141518] border border-[#1e2024] text-left hover:bg-[#1a1b1f] transition-all"
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="w-10 h-10 rounded-lg bg-[#4ade80] flex items-center justify-center mb-3">
                <MessageCircle className="w-5 h-5 text-[#0e0f11]" strokeWidth={1.5} />
              </div>
              <span className="text-[13px] font-medium text-[#ececed]">Chat squad</span>
            </motion.button>
          </motion.div>

          {/* Invite Link Card */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl p-5 mb-6 bg-gradient-to-br from-[#5e6ad2] to-[#4f5bc7] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-11 h-11 rounded-lg bg-white/20 flex items-center justify-center">
                <Link className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-[14px] font-semibold text-white">Lien d'invitation</h3>
                <p className="text-[12px] text-white/70">Partage ce code</p>
              </div>
            </div>
            <div className="flex items-center gap-2 relative z-10">
              <div className="flex-1 bg-white/20 rounded-lg px-4 py-3">
                <code className="text-[14px] font-mono font-bold text-white tracking-wider">
                  {squad.invite_code || squad.id?.slice(0, 8).toUpperCase()}
                </code>
              </div>
              <motion.button
                onClick={handleShareSquad}
                className="h-11 px-4 flex items-center gap-2 rounded-lg bg-white text-[#5e6ad2] text-[13px] font-semibold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {linkCopied ? (
                  <>
                    <Check className="w-4 h-4" strokeWidth={2} />
                    Copie
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" strokeWidth={1.5} />
                    Copier
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Members */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="p-5 rounded-xl bg-[#141518] border border-[#1e2024]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[14px] font-semibold text-[#ececed] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#5e6ad2]" strokeWidth={1.5} />
                  Membres
                </h2>
                <span className="text-[12px] text-[#6f7177]">{members.length} membres</span>
              </div>

              <div className="space-y-3">
                {members.slice(0, 5).map((member: any, index: number) => {
                  const reliability = member.reliability_score || Math.floor(70 + Math.random() * 30);
                  const getReliabilityColor = (score: number) => {
                    if (score >= 90) return 'text-[#4ade80] bg-[#4ade80]/10';
                    if (score >= 75) return 'text-[#5e6ad2] bg-[#5e6ad2]/10';
                    if (score >= 60) return 'text-[#f5a623] bg-[#f5a623]/10';
                    return 'text-[#f87171] bg-[#f87171]/10';
                  };
                  return (
                    <motion.div
                      key={member.userId || index}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#5e6ad2] to-[#4f5bc7] flex items-center justify-center text-white font-semibold text-[13px]">
                        {(member.name || `M${index + 1}`).charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-medium text-[#ececed]">
                            {member.name || `Membre ${index + 1}`}
                          </span>
                          {member.role === "owner" && (
                            <Crown className="w-4 h-4 text-[#f5a623]" strokeWidth={1.5} />
                          )}
                          {member.role === "admin" && (
                            <Shield className="w-4 h-4 text-[#5e6ad2]" strokeWidth={1.5} />
                          )}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-md text-[11px] font-semibold ${getReliabilityColor(reliability)}`}>
                        {reliability}%
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {members.length > 5 && (
                <motion.button
                  className="w-full mt-4 py-2 text-[13px] text-[#5e6ad2] font-medium flex items-center justify-center gap-1"
                  whileHover={{ x: 2 }}
                >
                  Voir tous les membres ({members.length})
                  <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Invite Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              onClick={() => onNavigate("invite-member", { squadId: squad.id })}
              className="w-full h-12 flex items-center justify-center gap-2.5 rounded-xl bg-[#5e6ad2] text-white text-[14px] font-semibold shadow-lg shadow-[#5e6ad2]/20"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <UserPlus className="w-5 h-5" strokeWidth={1.5} />
              Inviter un membre
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default SquadDetailScreen;
