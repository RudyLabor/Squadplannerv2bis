/**
 * SQUAD DETAIL SCREEN - LINEAR DESIGN SYSTEM
 * Premium, Dark, Minimal - Squad overview
 */

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

export function SquadDetailScreen({
  onNavigate,
  showToast,
  data,
}: SquadDetailScreenProps) {
  // Utiliser useParams pour récupérer l'ID depuis l'URL (prioritaire sur data.squadId)
  const { squadId: urlSquadId } = useParams<{ squadId: string }>();
  const squadId = urlSquadId || data?.squadId;

  const { currentSquad, squads, getSquadById, setCurrentSquad, loading: squadLoading } = useSquads();
  const { sessions, getSquadSessions, rsvpToSession, loading: sessionsLoading } = useSessions();
  const [linkCopied, setLinkCopied] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Charger la squad depuis l'API ou le cache
  useEffect(() => {
    const loadSquad = async () => {
      if (!squadId) {
        setLoadError("ID de squad manquant");
        setLocalLoading(false);
        return;
      }

      setLocalLoading(true);
      setLoadError(null);

      try {
        // D'abord vérifier si elle existe dans le cache local
        const cachedSquad = squads.find(s => s.id === squadId);

        if (cachedSquad) {
          console.log('[SquadDetail] Squad trouvée dans le cache');
          setCurrentSquad(cachedSquad);
          setLocalLoading(false);
        } else {
          // Sinon, charger depuis l'API
          console.log('[SquadDetail] Chargement depuis l\'API pour:', squadId);
          const squad = await getSquadById(squadId);

          if (!squad) {
            setLoadError("Squad non trouvée ou vous n'avez pas accès");
          }
          setLocalLoading(false);
        }

        // Charger les sessions dans tous les cas
        getSquadSessions(squadId, 'upcoming');
      } catch (err: any) {
        console.error('[SquadDetail] Erreur chargement:', err);
        setLoadError(err.message || "Erreur lors du chargement de la squad");
        setLocalLoading(false);
      }
    };

    loadSquad();
  }, [squadId]);

  // Utiliser currentSquad pour l'affichage
  const squad = currentSquad;

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

  // Loading state - Linear style
  if (localLoading || squadLoading || sessionsLoading) {
    return (
      <div className="min-h-screen bg-[#08090a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-5 h-5 border-2 border-[#5e6dd2] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[13px] text-[#8b8d90]">Chargement de la squad...</p>
        </div>
      </div>
    );
  }

  // Erreur ou squad non trouvée
  if (loadError || !squad) {
    return (
      <div className="min-h-screen bg-[#08090a] flex items-center justify-center">
        <motion.div
          className="text-center px-8 max-w-sm"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="w-14 h-14 rounded-xl bg-[rgba(248,113,113,0.1)] border border-[rgba(248,113,113,0.2)] flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7 text-[#f87171]" strokeWidth={1.5} />
          </div>
          <h3 className="text-[15px] font-semibold text-[#f7f8f8] mb-2">
            {loadError ? "Erreur de chargement" : "Squad non trouvée"}
          </h3>
          <p className="text-[13px] text-[#8b8d90] mb-6">
            {loadError || "Cette squad n'existe pas ou a été supprimée"}
          </p>
          <div className="flex gap-3 justify-center">
            <motion.button
              onClick={() => {
                setLoadError(null);
                setLocalLoading(true);
                if (squadId) {
                  getSquadById(squadId).finally(() => setLocalLoading(false));
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#f7f8f8] text-[14px] font-medium hover:bg-[rgba(255,255,255,0.06)] transition-colors"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              Réessayer
            </motion.button>
            <motion.button
              onClick={() => onNavigate("squads")}
              className="px-5 py-2.5 rounded-xl bg-[#5e6dd2] text-white text-[14px] font-semibold hover:bg-[#6a79db] transition-colors"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              Retour aux squads
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  const members = Array.isArray(squad.members) ? squad.members : [];
  const nextSession = sessions[0];

  return (
    <div className="min-h-screen pb-24 md:pb-8 bg-[#08090a]">
      <div className="px-4 md:px-6 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header - Linear style */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
            <motion.button
              onClick={() => onNavigate("squads")}
              className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.06)] transition-all"
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-[18px] md:text-[20px] font-semibold text-[#f7f8f8] tracking-tight">{squad.name}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <Gamepad2 className="w-4 h-4 text-[#5e6dd2]" strokeWidth={1.5} />
                <span className="text-[13px] text-[#8b8d90]">{squad.game}</span>
              </div>
            </div>
            <motion.button
              onClick={handleShareSquad}
              className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.06)] transition-all"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              {linkCopied ? <Check className="w-5 h-5 text-[#4ade80]" /> : <Share2 className="w-5 h-5" strokeWidth={1.5} />}
            </motion.button>
            <motion.button
              onClick={() => onNavigate("squad-settings", { squadId: squad.id })}
              className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.06)] transition-all"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>
          </motion.div>

          {/* Next Session Card - Linear style */}
          <motion.div variants={itemVariants} className="mb-4">
            <div className="p-5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[14px] font-semibold text-[#f7f8f8] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#f5a623]" strokeWidth={1.5} />
                  Prochaine session
                </h2>
                {nextSession && (
                  <span className="px-2 py-1 rounded-md bg-[rgba(74,222,128,0.1)] text-[#4ade80] text-[11px] font-medium">
                    À venir
                  </span>
                )}
              </div>

              {nextSession ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[rgba(94,109,210,0.1)] flex items-center justify-center">
                      <Gamepad2 className="w-5 h-5 text-[#5e6dd2]" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <div className="text-[14px] font-medium text-[#f7f8f8]">{nextSession.title || 'Session'}</div>
                      <div className="flex items-center gap-3 text-[12px] text-[#8b8d90] mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#60a5fa]/70" strokeWidth={1.5} />
                          {new Date(nextSession.scheduled_date).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                          })} à {nextSession.scheduled_time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-[#8b93ff]/70" strokeWidth={1.5} />
                          {nextSession.rsvps?.filter((r: any) => r.response === 'yes').length || 0}/{nextSession.required_players || 5}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => handleRSVP(nextSession.id, "yes")}
                      className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl bg-[#4ade80] text-[#08090a] text-[13px] font-semibold hover:bg-[#5eeb96] transition-colors"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Check className="w-4 h-4" strokeWidth={2} />
                      Dispo
                    </motion.button>
                    <motion.button
                      onClick={() => handleRSVP(nextSession.id, "no")}
                      className="px-4 h-10 flex items-center justify-center rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#8b8d90] text-[13px] font-medium hover:bg-[rgba(255,255,255,0.06)] hover:text-[#f7f8f8] transition-all"
                      whileTap={{ scale: 0.98 }}
                    >
                      Indispo
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.04)] flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-[#5e6063]" strokeWidth={1.5} />
                  </div>
                  <p className="text-[13px] text-[#8b8d90] mb-3">Aucune session planifiée</p>
                  <motion.button
                    onClick={() => onNavigate("propose-session", { squadId: squad.id })}
                    className="text-[13px] text-[#5e6dd2] font-medium flex items-center gap-1 mx-auto hover:text-[#8b93ff] transition-colors"
                    whileHover={{ x: 2 }}
                  >
                    Proposer une session
                    <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions - Linear style */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-4">
            <motion.button
              onClick={() => onNavigate("propose-session", { squadId: squad.id })}
              className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-left hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] transition-all group"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-10 h-10 rounded-xl bg-[rgba(94,109,210,0.1)] group-hover:bg-[rgba(94,109,210,0.15)] flex items-center justify-center mb-3 transition-colors">
                <Plus className="w-5 h-5 text-[#5e6dd2] group-hover:text-[#8b93ff] transition-colors" strokeWidth={1.5} />
              </div>
              <span className="text-[13px] font-medium text-[#f7f8f8]">Proposer session</span>
            </motion.button>
            <motion.button
              onClick={() => onNavigate("squad-chat", { squadId: squad.id })}
              className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-left hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] transition-all group"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-10 h-10 rounded-xl bg-[rgba(74,222,128,0.1)] group-hover:bg-[rgba(74,222,128,0.15)] flex items-center justify-center mb-3 transition-colors">
                <MessageCircle className="w-5 h-5 text-[#4ade80] group-hover:text-[#5eeb96] transition-colors" strokeWidth={1.5} />
              </div>
              <span className="text-[13px] font-medium text-[#f7f8f8]">Chat squad</span>
            </motion.button>
          </motion.div>

          {/* Invite Link Card - Linear style */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl p-5 mb-6 bg-[rgba(94,109,210,0.08)] border border-[rgba(94,109,210,0.2)]"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-[rgba(94,109,210,0.15)] flex items-center justify-center">
                <Link className="w-5 h-5 text-[#8b93ff]" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-[14px] font-semibold text-[#f7f8f8]">Lien d'invitation</h3>
                <p className="text-[12px] text-[#8b8d90]">Partage ce code</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[rgba(255,255,255,0.06)] rounded-xl px-4 py-3 border border-[rgba(255,255,255,0.08)]">
                <code className="text-[14px] font-mono font-bold text-[#f7f8f8] tracking-wider">
                  {squad.invite_code || squad.id?.slice(0, 8).toUpperCase()}
                </code>
              </div>
              <motion.button
                onClick={handleShareSquad}
                className="h-11 px-4 flex items-center gap-2 rounded-xl bg-[#5e6dd2] text-white text-[13px] font-semibold hover:bg-[#6a79db] transition-colors"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {linkCopied ? (
                  <>
                    <Check className="w-4 h-4" strokeWidth={2} />
                    Copié
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

          {/* Members - Linear style */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="p-5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[14px] font-semibold text-[#f7f8f8] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#8b93ff]" strokeWidth={1.5} />
                  Membres
                </h2>
                <span className="text-[12px] text-[#5e6063]">{members.length} membres</span>
              </div>

              <div className="space-y-3">
                {members.slice(0, 5).map((member: any, index: number) => {
                  const reliability = member.reliability_score || Math.floor(70 + Math.random() * 30);
                  const getReliabilityColor = (score: number) => {
                    if (score >= 90) return 'text-[#4ade80] bg-[rgba(74,222,128,0.1)]';
                    if (score >= 75) return 'text-[#8b93ff] bg-[rgba(94,109,210,0.1)]';
                    if (score >= 60) return 'text-[#f5a623] bg-[rgba(245,166,35,0.1)]';
                    return 'text-[#f87171] bg-[rgba(248,113,113,0.1)]';
                  };
                  return (
                    <motion.div
                      key={member.userId || index}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <div className="w-10 h-10 rounded-xl bg-[rgba(94,109,210,0.15)] flex items-center justify-center text-[#8b93ff] font-semibold text-[13px]">
                        {(member.name || `M${index + 1}`).charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-medium text-[#f7f8f8]">
                            {member.name || `Membre ${index + 1}`}
                          </span>
                          {member.role === "owner" && (
                            <Crown className="w-4 h-4 text-[#f5a623]" strokeWidth={1.5} />
                          )}
                          {member.role === "admin" && (
                            <Shield className="w-4 h-4 text-[#5e6dd2]" strokeWidth={1.5} />
                          )}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-[11px] font-semibold ${getReliabilityColor(reliability)}`}>
                        {reliability}%
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {members.length > 5 && (
                <motion.button
                  className="w-full mt-4 py-2 text-[13px] text-[#5e6dd2] font-medium flex items-center justify-center gap-1 hover:text-[#8b93ff] transition-colors"
                  whileHover={{ x: 2 }}
                >
                  Voir tous les membres ({members.length})
                  <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Invite Button - Linear style */}
          <motion.div variants={itemVariants}>
            <motion.button
              onClick={() => onNavigate("invite-member", { squadId: squad.id })}
              className="w-full h-12 flex items-center justify-center gap-2.5 rounded-xl bg-[#5e6dd2] text-white text-[14px] font-semibold shadow-lg shadow-[#5e6dd2]/20 hover:bg-[#6a79db] transition-colors"
              whileHover={{ y: -2 }}
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
