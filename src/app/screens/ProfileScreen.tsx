/**
 * PROFILE SCREEN - LINEAR DESIGN SYSTEM
 * "Carte de fiabilité sociale" - Premium minimal design
 * Central question: "Puis-je compter sur cette personne?"
 */

import { useState, useEffect, useMemo } from "react";
import {
  Edit3,
  Users,
  Trophy,
  Award,
  BarChart3,
  Link2,
  Bell,
  Shield,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  Clock,
  Calendar,
  RefreshCw,
  CheckCircle2,
  Gamepad2,
  Flame,
  UserCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/app/contexts/AuthContext";
import { useSquads } from "@/app/contexts/SquadsContext";
import { useSessions } from "@/app/contexts/SessionsContext";
import { usersAPI } from "@/app/services/api";
import { OrangeDivider } from "@/design-system";

interface ProfileScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  onLogout: () => void;
  userEmail?: string;
  userName?: string;
  isPremium?: boolean;
}

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
// SECONDARY STAT - Compact version harmonized with StatCard style
// ============================================
function SecondaryStat({
  value,
  label,
  icon: Icon,
  accentColor = "#5e6dd2"
}: {
  value: string | number;
  label: string;
  icon?: any;
  accentColor?: string;
}) {
  return (
    <div className="text-center">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 transition-all duration-150"
        style={{ backgroundColor: `${accentColor}15` }}
      >
        {Icon && (
          <Icon
            className="w-5 h-5 transition-colors"
            style={{ color: accentColor }}
            strokeWidth={1.5}
          />
        )}
      </div>
      <p className="text-[18px] font-semibold text-[#f7f8f8] tabular-nums leading-none mb-0.5">
        {value}
      </p>
      <span className="text-[11px] text-[rgba(255,255,255,0.4)] uppercase tracking-wide">{label}</span>
    </div>
  );
}

// ============================================
// LIST ITEM - Interactive with colored icons
// ============================================
function ListItem({
  icon: Icon,
  title,
  subtitle,
  onClick,
  danger,
  iconColor = "text-[#5e6dd2]"
}: {
  icon: any;
  title: string;
  subtitle: string;
  onClick: () => void;
  danger?: boolean;
  iconColor?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-colors duration-100 group min-h-[56px] ${
        danger ? "hover:bg-[rgba(248,113,113,0.05)]" : "hover:bg-[rgba(255,255,255,0.03)]"
      }`}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.995 }}
      transition={{ duration: 0.1 }}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
        danger ? "bg-[rgba(248,113,113,0.1)]" : "bg-[rgba(255,255,255,0.04)] group-hover:bg-[rgba(255,255,255,0.06)]"
      }`}>
        <Icon className={`w-[18px] h-[18px] transition-colors ${
          danger ? "text-[#f87171]" : `${iconColor} opacity-70 group-hover:opacity-100`
        }`} strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0 text-left">
        <span className={`text-[14px] font-medium transition-colors block ${
          danger ? "text-[#f87171]" : "text-[#f7f8f8] group-hover:text-white"
        }`}>{title}</span>
        <p className="text-[13px] text-[#5e6063] group-hover:text-[#8b8d90] truncate transition-colors">{subtitle}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-[rgba(255,255,255,0.15)] group-hover:text-[rgba(255,255,255,0.3)] transition-colors" />
    </motion.button>
  );
}

// ============================================
// SECTION HEADER
// ============================================
function SectionHeader({ title }: { title: string }) {
  return (
    <h3 className="text-[11px] font-semibold text-[#5e6063] uppercase tracking-wider mb-3 px-0.5">
      {title}
    </h3>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export function ProfileScreen({
  onNavigate,
  showToast,
  onLogout,
}: ProfileScreenProps) {
  const { user, signOut, clearAllCache, loading: authLoading } = useAuth();
  const { squads } = useSquads();
  const { sessions } = useSessions();
  const [isLoading, setIsLoading] = useState(false);
  const [userStats, setUserStats] = useState<{
    totalSessions: number;
    sessionsAttended: number;
    totalSquads: number;
    achievementsUnlocked: number;
    totalPlayTime: number;
    currentStreak: number;
    friendsCount: number;
  } | null>(null);

  // Charger les stats utilisateur depuis l'API
  useEffect(() => {
    const loadStats = async () => {
      if (!user?.id) return;

      try {
        const { stats } = await usersAPI.getStats(user.id);
        setUserStats({
          totalSessions: stats.total_sessions || 0,
          sessionsAttended: stats.sessions_attended || 0,
          totalSquads: stats.totalSquads || 0,
          achievementsUnlocked: stats.achievementsUnlocked || 0,
          totalPlayTime: 0, // Calculé plus tard si disponible
          currentStreak: 0, // Calculé plus tard si disponible
          friendsCount: 0, // À implémenter
        });
      } catch (err) {
        console.warn('[Profile] Erreur chargement stats:', err);
        // Utiliser les données locales en fallback
      }
    };

    loadStats();
  }, [user?.id]);

  // Stats calculées dynamiquement à partir des données locales
  const computedStats = useMemo(() => {
    const totalSquadsLocal = squads?.length || 0;
    const completedSessions = sessions?.filter(s => s.status === 'completed').length || 0;

    return {
      totalSquads: userStats?.totalSquads || totalSquadsLocal,
      totalSessions: userStats?.totalSessions || completedSessions,
      sessionsAttended: userStats?.sessionsAttended || 0,
      achievementsUnlocked: userStats?.achievementsUnlocked || 0,
    };
  }, [squads, sessions, userStats]);

  const displayName = user?.display_name || user?.username || user?.email?.split("@")[0] || "Joueur";
  const displayEmail = user?.email || "";
  const reliability = user?.reliability_score || 100;
  const sessionsCount = computedStats.totalSessions;
  // Calculer la ponctualité basée sur le ratio sessions attendues/total
  const punctuality = computedStats.totalSessions > 0
    ? Math.round((computedStats.sessionsAttended / computedStats.totalSessions) * 100)
    : 100;

  const handleLogout = async () => {
    try {
      await signOut();
      onLogout?.();
    } catch (error) {
      showToast("Erreur lors de la déconnexion", "error");
    }
  };

  const handleClearCache = async () => {
    try {
      showToast("Nettoyage du cache en cours...", "info");
      await clearAllCache();
    } catch (error) {
      showToast("Erreur lors du nettoyage du cache", "error");
    }
  };

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#08090a] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#5e6dd2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090a] pb-24 md:pb-8">
      <motion.div
        className="max-w-3xl mx-auto px-4 md:px-6 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
          <h1 className="text-[24px] md:text-[26px] font-semibold text-[#f7f8f8]">Mon Profil</h1>
          <motion.button
            onClick={() => onNavigate("edit-profile")}
            className="flex items-center gap-2 h-10 px-4 rounded-xl bg-[#18191b] text-[#f7f8f8] text-[13px] font-medium hover:bg-[#1f2023] border border-[#27282b] hover:border-[#27282b] transition-all duration-100"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <Edit3 className="w-4 h-4" strokeWidth={1.5} />
            Modifier
          </motion.button>
        </motion.div>

        {/* ============================================ */}
        {/* IDENTITY BLOCK - Compact, serious */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 md:w-18 md:h-18 rounded-xl bg-[#1f2023] overflow-hidden border border-[#27282b]">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-[#8b8d90]">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-[18px] md:text-[20px] font-semibold text-[#f7f8f8] mb-1">{displayName}</h2>
              <p className="text-[13px] text-[#5e6063] truncate">{displayEmail}</p>
              <p className="text-[12px] text-[#8b8d90] mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                Membre depuis Janvier 2024
              </p>
            </div>
          </div>
        </motion.div>

        <OrangeDivider className="mb-6" />

        {/* ============================================ */}
        {/* FIABILITÉ HERO BLOCK - Central focus */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="p-5 md:p-6 rounded-2xl bg-[rgba(74,222,128,0.03)] border border-[rgba(74,222,128,0.1)]">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-[#4ade80]" strokeWidth={1.5} />
              <span className="text-[13px] font-medium text-[#8b8d90] uppercase tracking-wide">Score de Fiabilité</span>
            </div>

            {/* Big reliability score */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-[48px] md:text-[56px] font-bold text-[#4ade80] tabular-nums leading-none">
                {reliability}
              </span>
              <span className="text-[20px] font-medium text-[#4ade80]/60">%</span>
            </div>

            {/* Supporting metrics */}
            <div className="flex items-center gap-6 text-[13px]">
              <div className="flex items-center gap-1.5 text-[#8b8d90]">
                <Trophy className="w-4 h-4 text-[#f5a623]/70" strokeWidth={1.5} />
                <span className="tabular-nums">{sessionsCount}</span>
                <span className="text-[#5e6063]">sessions</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#8b8d90]">
                <Clock className="w-4 h-4 text-[#60a5fa]/70" strokeWidth={1.5} />
                <span className="tabular-nums">{punctuality}%</span>
                <span className="text-[#5e6063]">ponctualité</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* SECONDARY STATS - Smaller grid */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="p-4 md:p-5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
            <div className="grid grid-cols-4 gap-4">
              <SecondaryStat
                value={userStats?.totalPlayTime ? `${Math.round(userStats.totalPlayTime / 60)}h` : `${sessionsCount * 2}h`}
                label="Temps joué"
                icon={Clock}
                accentColor="#60a5fa"
              />
              <SecondaryStat
                value={`${userStats?.currentStreak || 0}j`}
                label="Streak"
                icon={Flame}
                accentColor="#f5a623"
              />
              <SecondaryStat
                value={computedStats.totalSquads}
                label="Squads"
                icon={Gamepad2}
                accentColor="#5e6dd2"
              />
              <SecondaryStat
                value={userStats?.friendsCount || 0}
                label="Amis"
                icon={Users}
                accentColor="#8b5cf6"
              />
            </div>
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* ÉVOLUTION CHART */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="p-5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-medium text-[#8b8d90] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#4ade80]/70" strokeWidth={1.5} />
                Évolution sur 7 semaines
              </h3>
              <span className="text-[11px] text-[#4ade80] font-medium px-2 py-0.5 rounded bg-[rgba(74,222,128,0.1)]">+5%</span>
            </div>
            <div className="flex items-end gap-1.5 h-14">
              {[75, 82, 78, 85, 88, 91, reliability].map((val, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-[#4ade80] rounded-t"
                  style={{ opacity: 0.3 + (i * 0.1) }}
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  transition={{ delay: i * 0.05, duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-[#5e6063] font-medium">
              <span>S-6</span><span>S-5</span><span>S-4</span><span>S-3</span><span>S-2</span><span>S-1</span><span>Actuel</span>
            </div>
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* BADGES - Compact, subtle */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-medium text-[#5e6063] uppercase tracking-wide">Badges</span>
              <motion.button
                onClick={() => onNavigate("badges")}
                className="text-[12px] text-[#5e6dd2] hover:text-[#8b93ff] transition-colors font-medium flex items-center gap-0.5"
                whileHover={{ x: 2 }}
              >
                18/45
                <ChevronRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
            <div className="flex items-center gap-2">
              {[
                { icon: "🏆", name: "Fiable" },
                { icon: "⚡", name: "Ponctuel" },
                { icon: "🎯", name: "Assidu" },
                { icon: "🔥", name: "En feu" },
                { icon: "⭐", name: "MVP" },
              ].map((badge, index) => (
                <div
                  key={index}
                  className="w-9 h-9 rounded-lg bg-[rgba(255,255,255,0.04)] flex items-center justify-center cursor-default hover:bg-[rgba(255,255,255,0.06)] transition-colors"
                  title={badge.name}
                >
                  <span className="text-base">{badge.icon}</span>
                </div>
              ))}
              <div className="w-9 h-9 rounded-lg bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-[11px] text-[#5e6063] font-medium">
                +13
              </div>
            </div>
          </div>
        </motion.div>

        <OrangeDivider className="mb-6" />

        {/* ============================================ */}
        {/* QUICK ACTIONS - Simplified */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              onClick={() => onNavigate("advanced-stats")}
              className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] text-left transition-all duration-100 group"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-9 h-9 rounded-lg bg-[rgba(96,165,250,0.1)] group-hover:bg-[rgba(96,165,250,0.15)] flex items-center justify-center mb-2.5 transition-colors">
                <BarChart3 className="w-4.5 h-4.5 text-[#60a5fa] group-hover:text-[#93c5fd] transition-colors" strokeWidth={1.5} />
              </div>
              <div className="text-[14px] font-medium text-[#f7f8f8] group-hover:text-white transition-colors">Statistiques</div>
              <div className="text-[12px] text-[#5e6063]">Analyses avancées</div>
            </motion.button>
            <motion.button
              onClick={() => onNavigate("friends")}
              className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] text-left transition-all duration-100 group"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-9 h-9 rounded-lg bg-[rgba(139,147,255,0.1)] group-hover:bg-[rgba(139,147,255,0.15)] flex items-center justify-center mb-2.5 transition-colors">
                <Users className="w-4.5 h-4.5 text-[#8b93ff] group-hover:text-[#a5abff] transition-colors" strokeWidth={1.5} />
              </div>
              <div className="text-[14px] font-medium text-[#f7f8f8] group-hover:text-white transition-colors">Amis</div>
              <div className="text-[12px] text-[#5e6063]">{userStats?.friendsCount || 0} contact{(userStats?.friendsCount || 0) !== 1 ? 's' : ''}</div>
            </motion.button>
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* SETTINGS - Clean list */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mb-6">
          <SectionHeader title="Paramètres" />
          <div className="rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] overflow-hidden divide-y divide-[rgba(255,255,255,0.06)]">
            <ListItem
              icon={Link2}
              title="Intégrations"
              subtitle="Discord, Calendar, API"
              onClick={() => onNavigate("integrations")}
              iconColor="text-[#5e6dd2]"
            />
            <ListItem
              icon={Bell}
              title="Notifications"
              subtitle="Alertes & rappels"
              onClick={() => onNavigate("notification-settings")}
              iconColor="text-[#f5a623]"
            />
            <ListItem
              icon={Shield}
              title="Confidentialité"
              subtitle="Sécurité & données"
              onClick={() => onNavigate("privacy")}
              iconColor="text-[#4ade80]"
            />
            <ListItem
              icon={Settings}
              title="Préférences"
              subtitle="Personnalisation"
              onClick={() => onNavigate("preferences")}
              iconColor="text-[#8b8d90]"
            />
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* MAINTENANCE & LOGOUT - Compact */}
        {/* ============================================ */}
        <motion.div variants={itemVariants}>
          <div className="flex gap-3">
            <motion.button
              onClick={handleClearCache}
              className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-[rgba(245,166,35,0.05)] border border-[rgba(245,166,35,0.15)] text-[13px] font-medium text-[#f5a623] hover:bg-[rgba(245,166,35,0.1)] hover:border-[rgba(245,166,35,0.25)] transition-all duration-100"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
              Vider le cache
            </motion.button>
            <motion.button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-[rgba(248,113,113,0.05)] border border-[rgba(248,113,113,0.15)] text-[13px] font-medium text-[#f87171] hover:bg-[rgba(248,113,113,0.1)] hover:border-[rgba(248,113,113,0.25)] transition-all duration-100"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
              Déconnexion
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ProfileScreen;
