/**
 * 👤 PROFILE SCREEN - Aligné sur maquette Figma
 * Design System v2 - Mobile-first
 */

import { useState, useEffect } from "react";
import {
  Edit3,
  Users,
  Trophy,
  Award,
  Medal,
  Crown,
  BarChart3,
  Link2,
  Bell,
  Shield,
  Settings,
  Palette,
  Image,
  LogOut,
  ChevronRight,
  TrendingUp,
  Clock,
  Star,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { Avatar, ListItem, FeatureCard, Badge } from "@/app/components/ui/DesignSystem";

interface ProfileScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  onLogout: () => void;
  userEmail?: string;
  userName?: string;
  isPremium?: boolean;
}

export function ProfileScreen({
  onNavigate,
  showToast,
  onLogout,
}: ProfileScreenProps) {
  const { user, signOut, clearAllCache, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

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
      // La page sera rechargée automatiquement par clearAllCache
    } catch (error) {
      showToast("Erreur lors du nettoyage du cache", "error");
    }
  };

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold text-gray-900">Mon Profil</h1>
          <button
            onClick={() => onNavigate("edit-profile")}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span className="text-sm">Modifier</span>
          </button>
        </div>

        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-6">
          <Avatar
            src={user?.avatar_url}
            name={displayName}
            level={47} // Keep hardcoded level for now or use user meta
            size="xl"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-900">{displayName}</h2>
            <p className="text-sm text-gray-500">
              Shotcaller • Niveau 47
            </p>
            <p className="text-xs text-gray-400">{displayEmail}</p>
          </div>
        </div>

        {/* Stats Grid 2x2 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <TrendingUp className="w-5 h-5 text-gray-400 mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {reliability}%
            </div>
            <div className="text-xs text-gray-500">Fiabilité</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <Clock className="w-5 h-5 text-gray-400 mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              0
            </div>
            <div className="text-xs text-gray-500">Sessions</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <Star className="w-5 h-5 text-amber-500 mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              23
            </div>
            <div className="text-xs text-gray-500">MVP</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <Clock className="w-5 h-5 text-gray-400 mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              384
            </div>
            <div className="text-xs text-gray-500">Heures jouées</div>
          </div>
        </div>

        {/* Premium & Stats Pro Cards */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <FeatureCard
            icon={Crown}
            title="Premium"
            subtitle="IA + Stats + Export"
            color="amber"
            badge="ACTIF"
            onClick={() => onNavigate("premium")}
          />
          <FeatureCard
            icon={BarChart3}
            title="Stats Pro"
            subtitle="Analyses détaillées"
            color="white"
            onClick={() => onNavigate("advanced-stats")}
          />
        </div>

        {/* Social & Compétition */}
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Social & Compétition
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <button
            onClick={() => onNavigate("friends")}
            className="bg-white rounded-2xl p-4 text-left border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <Users className="w-5 h-5 text-gray-400 mb-2" />
            <div className="font-medium text-gray-900 text-sm">Mes Amis</div>
            <div className="text-xs text-gray-500">47 contacts</div>
          </button>
          <button
            onClick={() => onNavigate("achievements")}
            className="bg-white rounded-2xl p-4 text-left border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <Trophy className="w-5 h-5 text-amber-500 mb-2" />
            <div className="font-medium text-gray-900 text-sm">Trophées</div>
            <div className="text-xs text-gray-500">18/45 débloqués</div>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            onClick={() => onNavigate("badges")}
            className="bg-white rounded-2xl p-4 text-left border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <Award className="w-5 h-5 text-gray-400 mb-2" />
            <div className="font-medium text-gray-900 text-sm">Badges</div>
            <div className="text-xs text-gray-500">8 débloqués</div>
          </button>
          <button
            onClick={() => onNavigate("ranking")}
            className="bg-white rounded-2xl p-4 text-left border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <Medal className="w-5 h-5 text-gray-400 mb-2" />
            <div className="font-medium text-gray-900 text-sm">Mon Rang</div>
            <div className="text-xs text-gray-500">Gold II</div>
          </button>
        </div>

        {/* Activité récente */}
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Activité récente
        </h3>
        <div className="bg-white rounded-2xl border border-gray-100 mb-8 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">
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
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">
                  Session terminée
                </div>
                <div className="text-xs text-gray-500">
                  CS2 Compétitif • Hier
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Paramètres */}
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Paramètres
        </h3>
        <div className="bg-white rounded-2xl border border-gray-100 mb-8 overflow-hidden">
          <ListItem
            icon={Link2}
            title="Intégrations"
            subtitle="Discord, Calendar, API"
            onClick={() => onNavigate("integrations")}
          />
          <div className="border-t border-gray-100" />
          <ListItem
            icon={Bell}
            title="Notifications"
            subtitle="Alertes & rappels"
            onClick={() => onNavigate("notification-settings")}
          />
          <div className="border-t border-gray-100" />
          <ListItem
            icon={Shield}
            title="Confidentialité"
            subtitle="Sécurité & données"
            onClick={() => onNavigate("privacy")}
          />
          <div className="border-t border-gray-100" />
          <ListItem
            icon={Settings}
            title="Préférences"
            subtitle="Personnalisation"
            onClick={() => onNavigate("preferences")}
          />
          <div className="border-t border-gray-100" />
          <ListItem
            icon={Palette}
            title="Design System"
            subtitle="Documentation complète"
            onClick={() => onNavigate("design-doc")}
          />
          <div className="border-t border-gray-100" />
          <ListItem
            icon={Image}
            title="Galerie Screenshots"
            subtitle="Téléchargez les 61 écrans"
            onClick={() => onNavigate("screenshot-gallery")}
          />
        </div>

        {/* Maintenance & Déconnexion */}
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Maintenance
        </h3>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
          <button
            onClick={handleClearCache}
            className="w-full flex items-center gap-3 p-4 text-left hover:bg-amber-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-amber-700 text-sm">Vider le cache</div>
              <div className="text-xs text-gray-500">Résout les problèmes de connexion</div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Déconnexion
        </h3>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 text-left hover:bg-red-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-red-600 text-sm">Déconnexion</div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileScreen;
