/**
 * PROFILE SCREEN - LINEAR DESIGN SYSTEM
 * "Carte de fiabilité sociale" - Premium minimal design
 * Central question: "Puis-je compter sur cette personne?"
 */

import { useState } from "react";
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
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/app/contexts/AuthContext";
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
// SECONDARY STAT - Smaller, recessed
// ============================================
function SecondaryStat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-[18px] font-semibold text-[#ececed] tabular-nums leading-none mb-0.5">
        {value}
      </p>
      <span className="text-[11px] text-[#4a4b50]">{label}</span>
    </div>
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
  danger
}: {
  icon: any;
  title: string;
  subtitle: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-colors duration-100 group min-h-[56px] ${
        danger ? "hover:bg-[#f87171]/5" : "hover:bg-[#141518]"
      }`}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.995 }}
      transition={{ duration: 0.1 }}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
        danger ? "bg-[#f87171]/10" : "bg-[#111214] group-hover:bg-[#1e2024]"
      }`}>
        <Icon className={`w-[18px] h-[18px] transition-colors ${
          danger ? "text-[#f87171]" : "text-[#4a4b50] group-hover:text-[#6f7177]"
        }`} strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0 text-left">
        <span className={`text-[14px] font-medium transition-colors block ${
          danger ? "text-[#f87171]" : "text-[#ececed] group-hover:text-white"
        }`}>{title}</span>
        <p className="text-[13px] text-[#4a4b50] group-hover:text-[#6f7177] truncate transition-colors">{subtitle}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-[#26282d] group-hover:text-[#4a4b50] transition-colors" />
    </motion.button>
  );
}

// ============================================
// SECTION HEADER
// ============================================
function SectionHeader({ title }: { title: string }) {
  return (
    <h3 className="text-[11px] font-semibold text-[#4a4b50] uppercase tracking-wider mb-3 px-0.5">
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
  const [isLoading] = useState(false);

  const displayName = user?.display_name || user?.username || user?.email?.split("@")[0] || "Joueur";
  const displayEmail = user?.email || "";
  const reliability = user?.reliability_score || 92;
  const sessionsCount = 156;
  const punctuality = 89;

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
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
          <h1 className="text-[24px] md:text-[26px] font-semibold text-[#ececed]">Mon Profil</h1>
          <motion.button
            onClick={() => onNavigate("edit-profile")}
            className="flex items-center gap-2 h-10 px-4 rounded-xl bg-[#141518] text-[#ececed] text-[13px] font-medium hover:bg-[#1a1b1f] border border-[#1e2024] hover:border-[#26282d] transition-all duration-100"
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
              <div className="w-16 h-16 md:w-18 md:h-18 rounded-xl bg-[#1a1b1f] overflow-hidden border border-[#26282d]">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-[#6f7177]">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-[18px] md:text-[20px] font-semibold text-[#ececed] mb-1">{displayName}</h2>
              <p className="text-[13px] text-[#4a4b50] truncate">{displayEmail}</p>
              <p className="text-[12px] text-[#6f7177] mt-1 flex items-center gap-1.5">
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
          <div className="p-5 md:p-6 rounded-2xl bg-[#111214] border border-[#1a1b1f]">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-[#4ade80]" strokeWidth={1.5} />
              <span className="text-[13px] font-medium text-[#6f7177] uppercase tracking-wide">Score de Fiabilité</span>
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
              <div className="flex items-center gap-1.5 text-[#6f7177]">
                <Trophy className="w-4 h-4 text-[#4a4b50]" strokeWidth={1.5} />
                <span className="tabular-nums">{sessionsCount}</span>
                <span className="text-[#4a4b50]">sessions</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#6f7177]">
                <Clock className="w-4 h-4 text-[#4a4b50]" strokeWidth={1.5} />
                <span className="tabular-nums">{punctuality}%</span>
                <span className="text-[#4a4b50]">ponctualité</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* SECONDARY STATS - Smaller grid */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="p-4 md:p-5 rounded-xl bg-[#111214] border border-[#1a1b1f]">
            <div className="grid grid-cols-4 gap-4">
              <SecondaryStat value="384h" label="Temps joué" />
              <SecondaryStat value="12j" label="Streak" />
              <SecondaryStat value="3" label="Squads" />
              <SecondaryStat value="47" label="Amis" />
            </div>
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* ÉVOLUTION CHART */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="p-5 rounded-xl bg-[#111214] border border-[#1a1b1f]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-medium text-[#6f7177] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#4a4b50]" strokeWidth={1.5} />
                Évolution sur 7 semaines
              </h3>
              <span className="text-[11px] text-[#4ade80] font-medium">+5%</span>
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
            <div className="flex justify-between mt-2 text-[10px] text-[#3a3b40] font-medium">
              <span>S-6</span><span>S-5</span><span>S-4</span><span>S-3</span><span>S-2</span><span>S-1</span><span>Actuel</span>
            </div>
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* BADGES - Compact, subtle */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="p-4 rounded-xl bg-[#111214] border border-[#1a1b1f]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-medium text-[#4a4b50] uppercase tracking-wide">Badges</span>
              <motion.button
                onClick={() => onNavigate("badges")}
                className="text-[12px] text-[#5e6ad2] hover:text-[#7c85e0] transition-colors font-medium flex items-center gap-0.5"
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
                  className="w-9 h-9 rounded-lg bg-[#1a1b1f] flex items-center justify-center cursor-default"
                  title={badge.name}
                >
                  <span className="text-base">{badge.icon}</span>
                </div>
              ))}
              <div className="w-9 h-9 rounded-lg bg-[#1a1b1f] flex items-center justify-center text-[11px] text-[#4a4b50] font-medium">
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
              className="p-4 rounded-xl bg-[#111214] border border-[#1a1b1f] hover:bg-[#141518] hover:border-[#26282d] text-left transition-all duration-100 group"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-9 h-9 rounded-lg bg-[#1a1b1f] group-hover:bg-[#1e2024] flex items-center justify-center mb-2.5 transition-colors">
                <BarChart3 className="w-4.5 h-4.5 text-[#4a4b50] group-hover:text-[#6f7177] transition-colors" strokeWidth={1.5} />
              </div>
              <div className="text-[14px] font-medium text-[#ececed] group-hover:text-white transition-colors">Statistiques</div>
              <div className="text-[12px] text-[#4a4b50]">Analyses avancées</div>
            </motion.button>
            <motion.button
              onClick={() => onNavigate("friends")}
              className="p-4 rounded-xl bg-[#111214] border border-[#1a1b1f] hover:bg-[#141518] hover:border-[#26282d] text-left transition-all duration-100 group"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-9 h-9 rounded-lg bg-[#1a1b1f] group-hover:bg-[#1e2024] flex items-center justify-center mb-2.5 transition-colors">
                <Users className="w-4.5 h-4.5 text-[#4a4b50] group-hover:text-[#6f7177] transition-colors" strokeWidth={1.5} />
              </div>
              <div className="text-[14px] font-medium text-[#ececed] group-hover:text-white transition-colors">Amis</div>
              <div className="text-[12px] text-[#4a4b50]">47 contacts</div>
            </motion.button>
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* SETTINGS - Clean list */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mb-6">
          <SectionHeader title="Paramètres" />
          <div className="rounded-xl bg-[#111214] border border-[#1a1b1f] overflow-hidden divide-y divide-[#1a1b1f]">
            <ListItem
              icon={Link2}
              title="Intégrations"
              subtitle="Discord, Calendar, API"
              onClick={() => onNavigate("integrations")}
            />
            <ListItem
              icon={Bell}
              title="Notifications"
              subtitle="Alertes & rappels"
              onClick={() => onNavigate("notification-settings")}
            />
            <ListItem
              icon={Shield}
              title="Confidentialité"
              subtitle="Sécurité & données"
              onClick={() => onNavigate("privacy")}
            />
            <ListItem
              icon={Settings}
              title="Préférences"
              subtitle="Personnalisation"
              onClick={() => onNavigate("preferences")}
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
              className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-[#111214] border border-[#1a1b1f] text-[13px] font-medium text-[#f5a623] hover:bg-[#141518] hover:border-[#26282d] transition-all duration-100"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
              Vider le cache
            </motion.button>
            <motion.button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-[#111214] border border-[#1a1b1f] text-[13px] font-medium text-[#f87171] hover:bg-[#f87171]/5 hover:border-[#f87171]/20 transition-all duration-100"
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
