/**
 * PROFILE SCREEN - Premium UI v2.0
 * Framer Motion + Glassmorphism + Gradients
 */

import { useState } from "react";
import {
  Edit3,
  Users,
  Trophy,
  Award,
  Medal,
  BarChart3,
  Link2,
  Bell,
  Shield,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  Clock,
  Star,
  RefreshCw,
  Crown,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/app/contexts/AuthContext";

interface ProfileScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  onLogout: () => void;
  userEmail?: string;
  userName?: string;
  isPremium?: boolean;
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

interface PremiumStatCardProps {
  icon: React.ElementType;
  value: string | number;
  label: string;
  gradient: string;
}

function PremiumStatCard({ icon: Icon, value, label, gradient }: PremiumStatCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="relative overflow-hidden rounded-2xl p-4"
      whileHover={{ scale: 1.03, y: -2 }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/20" />
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full blur-2xl" />

      <div className="relative z-10">
        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
          <Icon className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-xs text-white/80 font-medium">{label}</div>
      </div>
    </motion.div>
  );
}

interface QuickActionCardProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  onClick: () => void;
  gradient?: string;
  badge?: string;
}

function QuickActionCard({ icon: Icon, title, subtitle, onClick, gradient, badge }: QuickActionCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all ${
        gradient
          ? ''
          : 'bg-white/80 backdrop-blur-sm border border-white/50 shadow-md'
      }`}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {gradient && (
        <>
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10" />
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full blur-2xl" />
        </>
      )}
      <div className="relative z-10">
        {badge && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute -top-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
              gradient ? 'bg-white/30 text-white' : 'bg-amber-500 text-white'
            }`}
          >
            {badge}
          </motion.span>
        )}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
          gradient ? 'bg-white/20 backdrop-blur-sm' : 'bg-gray-100'
        }`}>
          <Icon className={`w-5 h-5 ${gradient ? 'text-white' : 'text-gray-600'}`} strokeWidth={2} />
        </div>
        <div className={`font-semibold text-sm ${gradient ? 'text-white' : 'text-gray-800'}`}>
          {title}
        </div>
        <div className={`text-xs ${gradient ? 'text-white/80' : 'text-gray-500'}`}>
          {subtitle}
        </div>
      </div>
    </motion.button>
  );
}

interface SettingsListItemProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  onClick: () => void;
  iconColor?: string;
  danger?: boolean;
}

function SettingsListItem({ icon: Icon, title, subtitle, onClick, iconColor = 'text-gray-600', danger }: SettingsListItemProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 text-left transition-colors ${
        danger ? 'hover:bg-red-50' : 'hover:bg-gray-50/50'
      }`}
      whileHover={{ x: 4 }}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        danger ? 'bg-red-100' : 'bg-gray-100'
      }`}>
        <Icon className={`w-5 h-5 ${danger ? 'text-red-500' : iconColor}`} strokeWidth={2} />
      </div>
      <div className="flex-1">
        <div className={`font-medium text-sm ${danger ? 'text-red-600' : 'text-gray-800'}`}>
          {title}
        </div>
        <div className="text-xs text-gray-500">{subtitle}</div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-300" />
    </motion.button>
  );
}

export function ProfileScreen({
  onNavigate,
  showToast,
  onLogout,
}: ProfileScreenProps) {
  const { user, signOut, clearAllCache, loading: authLoading } = useAuth();
  const [isLoading] = useState(false);

  const displayName = user?.display_name || user?.username || user?.email?.split("@")[0] || "Joueur";
  const displayEmail = user?.email || "";
  const reliability = user?.reliability_score || 0;

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
              <Users className="w-6 h-6 text-indigo-500" />
            </div>
          </div>
          <p className="text-gray-500 font-medium">Chargement du profil...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
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

      <div className="relative z-10 px-4 py-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Mon Profil
            </h1>
            <motion.button
              onClick={() => onNavigate("edit-profile")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-md text-gray-700 font-medium text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Edit3 className="w-4 h-4" />
              <span>Modifier</span>
            </motion.button>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 mb-6 shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

            <div className="relative z-10 flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm overflow-hidden border-2 border-white/30">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <motion.div
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <span className="text-xs font-bold text-white">47</span>
                </motion.div>
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-1">{displayName}</h2>
                <p className="text-white/80 text-sm font-medium mb-1">
                  Shotcaller • Niveau 47
                </p>
                <p className="text-white/60 text-xs">{displayEmail}</p>
              </div>

              <motion.div
                className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Crown className="w-6 h-6 text-amber-300" />
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-6">
            <PremiumStatCard
              icon={TrendingUp}
              value={`${reliability}%`}
              label="Fiabilité"
              gradient="from-emerald-500 to-teal-500"
            />
            <PremiumStatCard
              icon={Clock}
              value="384"
              label="Heures jouées"
              gradient="from-blue-500 to-cyan-500"
            />
            <PremiumStatCard
              icon={Star}
              value="23"
              label="MVP"
              gradient="from-amber-500 to-orange-500"
            />
            <PremiumStatCard
              icon={Zap}
              value="156"
              label="Sessions"
              gradient="from-purple-500 to-pink-500"
            />
          </motion.div>

          {/* Premium & Stats Pro */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-8">
            <QuickActionCard
              icon={Crown}
              title="Premium"
              subtitle="IA + Stats + Export"
              gradient="from-amber-500 to-orange-500"
              badge="ACTIF"
              onClick={() => onNavigate("premium")}
            />
            <QuickActionCard
              icon={BarChart3}
              title="Stats Pro"
              subtitle="Analyses détaillées"
              onClick={() => onNavigate("advanced-stats")}
            />
          </motion.div>

          {/* Social & Competition */}
          <motion.div variants={itemVariants}>
            <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Social & Compétition
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <QuickActionCard
                icon={Users}
                title="Mes Amis"
                subtitle="47 contacts"
                onClick={() => onNavigate("friends")}
              />
              <QuickActionCard
                icon={Trophy}
                title="Trophées"
                subtitle="18/45 débloqués"
                onClick={() => onNavigate("achievements")}
              />
              <QuickActionCard
                icon={Award}
                title="Badges"
                subtitle="8 débloqués"
                onClick={() => onNavigate("badges")}
              />
              <QuickActionCard
                icon={Medal}
                title="Mon Rang"
                subtitle="Gold II"
                onClick={() => onNavigate("ranking")}
              />
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants}>
            <h3 className="text-base font-semibold text-gray-800 mb-3">
              Activité récente
            </h3>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-md overflow-hidden mb-6">
              <div className="p-4 border-b border-gray-100/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">
                      Récompense MVP
                    </div>
                    <div className="text-xs text-gray-500">
                      Valorant Ranked • Il y a 2 heures
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">
                      Session terminée
                    </div>
                    <div className="text-xs text-gray-500">
                      CS2 Compétitif • Hier
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Settings */}
          <motion.div variants={itemVariants}>
            <h3 className="text-base font-semibold text-gray-800 mb-3">
              Paramètres
            </h3>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-md overflow-hidden mb-6">
              <SettingsListItem
                icon={Link2}
                title="Intégrations"
                subtitle="Discord, Calendar, API"
                iconColor="text-indigo-500"
                onClick={() => onNavigate("integrations")}
              />
              <div className="border-t border-gray-100/50" />
              <SettingsListItem
                icon={Bell}
                title="Notifications"
                subtitle="Alertes & rappels"
                iconColor="text-amber-500"
                onClick={() => onNavigate("notification-settings")}
              />
              <div className="border-t border-gray-100/50" />
              <SettingsListItem
                icon={Shield}
                title="Confidentialité"
                subtitle="Sécurité & données"
                iconColor="text-emerald-500"
                onClick={() => onNavigate("privacy")}
              />
              <div className="border-t border-gray-100/50" />
              <SettingsListItem
                icon={Settings}
                title="Préférences"
                subtitle="Personnalisation"
                iconColor="text-purple-500"
                onClick={() => onNavigate("preferences")}
              />
            </div>
          </motion.div>

          {/* Maintenance */}
          <motion.div variants={itemVariants}>
            <h3 className="text-base font-semibold text-gray-800 mb-3">
              Maintenance
            </h3>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-md overflow-hidden mb-6">
              <motion.button
                onClick={handleClearCache}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-amber-50/50 transition-colors"
                whileHover={{ x: 4 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                  <RefreshCw className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-amber-700 text-sm">Vider le cache</div>
                  <div className="text-xs text-gray-500">Résout les problèmes de connexion</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </motion.button>
            </div>
          </motion.div>

          {/* Logout */}
          <motion.div variants={itemVariants}>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-md overflow-hidden">
              <SettingsListItem
                icon={LogOut}
                title="Déconnexion"
                subtitle="Se déconnecter de l'application"
                onClick={handleLogout}
                danger
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default ProfileScreen;
