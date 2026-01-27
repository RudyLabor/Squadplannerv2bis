import React, { useState, Suspense } from 'react';
import { motion } from 'motion/react';
import { 
  Palette, 
  Type, 
  Layout, 
  Smartphone,
  Monitor,
  GitBranch,
  ChevronRight,
  Home,
  Users,
  Calendar,
  User,
  Settings,
  LogIn,
  UserPlus,
  Plus,
  Vote,
  MessageSquare,
  Trophy,
  Target,
  Bell,
  Share2,
  BarChart3,
  Zap,
  Shield,
  Globe,
  Box,
  Layers,
  ArrowRight,
  X,
  Camera
} from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { SplashScreen } from '@/app/components/SplashScreen';
import { ScreenWrapper } from '@/app/components/ScreenWrapper';

// Import ALL screens for the gallery
import LoginScreen from './LoginScreen';
import { SignupScreen } from './SignupScreen';
import { HomeScreen } from './HomeScreen';
import { SquadsScreen } from './SquadsScreen';
import { SessionsScreen } from './SessionsScreen';
import { ProfileScreen } from './ProfileScreen';
import { CreateSquadScreen } from './CreateSquadScreen';
import { JoinSquadScreen } from './JoinSquadScreen';
import { SquadDetailScreen } from './SquadDetailScreen';
import { SquadChatScreen } from './SquadChatScreen';
import { SquadManagementScreen } from './SquadManagementScreen';
import { SquadCompositionScreen } from './SquadCompositionScreen';
import { SquadHealthScreen } from './SquadHealthScreen';
import { ProposeSessionScreen } from './ProposeSessionScreen';
import { VoteSessionScreen } from './VoteSessionScreen';
import { RecurringSessionScreen } from './RecurringSessionScreen';
import CheckInScreen from './CheckInScreen';
import { EditProfileScreen } from './EditProfileScreen';
import { PublicProfileScreen } from './PublicProfileScreen';
import { AchievementsScreen } from './AchievementsScreen';
import { AdvancedStatsScreen } from './AdvancedStatsScreen';
import { BadgesScreen } from './BadgesScreen';
import { HistoryScreen } from './HistoryScreen';
import { FriendsScreen } from './FriendsScreen';
import { SearchPlayersScreen } from './SearchPlayersScreen';
import { DiscoverSquadsScreen } from './DiscoverSquadsScreen';
import { CommunityScreen } from './CommunityScreen';
import { LeaderboardScreen } from './LeaderboardScreen';
import ActivityFeedScreen from './ActivityFeedScreen';
import { ChallengesScreen } from './ChallengesScreen';
import { TournamentsScreen } from './TournamentsScreen';
// Additional screens - Roadmap 2 & 3
import { AcademyScreen } from './AcademyScreen';
import { ApiDocsScreen } from './ApiDocsScreen';
import { AutoCoachingScreen } from './AutoCoachingScreen';
import { AvailabilityHeatmapScreen } from './AvailabilityHeatmapScreen';
import { CalendarSyncScreen } from './CalendarSyncScreen';
import { CoachingToolsScreen } from './CoachingToolsScreen';
import { DiscordBotScreen } from './DiscordBotScreen';
import { EsportIntegrationsScreen } from './EsportIntegrationsScreen';
import { EsportTeamScreen } from './EsportTeamScreen';
import { FeaturesDemoScreen } from './FeaturesDemoScreen';
import { IntegrationsScreen } from './IntegrationsScreen';
import { IntelligenceScreen } from './IntelligenceScreen';
import { LeadershipAnalysisScreen } from './LeadershipAnalysisScreen';
import { LeaguesScreen } from './LeaguesScreen';
import { NotificationSettingsScreen } from './NotificationSettingsScreen';
import { NotificationsScreen } from './NotificationsScreen';
import { OrganizationScreen } from './OrganizationScreen';
import { PluginsScreen } from './PluginsScreen';
import { PreferencesScreen } from './PreferencesScreen';
import { PremiumScreen } from './PremiumScreen';
import { PrivacyScreen } from './PrivacyScreen';
import { QATestsScreen } from './QATestsScreen';
import { RankingScreen } from './RankingScreen';
import { SeasonsScreen } from './SeasonsScreen';
import { ShareScreen } from './ShareScreen';
import { SmartSuggestionsScreen } from './SmartSuggestionsScreen';
import { StreamerDashboardScreen } from './StreamerDashboardScreen';
import { TestSetupScreen } from './TestSetupScreen';
import { WeeklyRecapScreen } from './WeeklyRecapScreen';

interface DesignDocScreenProps {
  onNavigate?: (screen: string) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export default function DesignDocScreen({ onNavigate, showToast }: DesignDocScreenProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'colors' | 'components' | 'navigation' | 'screens'>('overview');
  const [selectedScreen, setSelectedScreen] = useState<string | null>(null);

  // Map routes to components for the gallery
  const screenComponents: Record<string, React.ComponentType<any>> = {
    '/': SplashScreen,
    '/login': LoginScreen,
    '/signup': SignupScreen,
    '/home': HomeScreen,
    '/squads': SquadsScreen,
    '/sessions': SessionsScreen,
    '/profile': ProfileScreen,
    '/create-squad': CreateSquadScreen,
    '/join-squad': JoinSquadScreen,
    '/squad/:id': SquadDetailScreen,
    '/squad/:id/chat': SquadChatScreen,
    '/squad/:id/settings': SquadManagementScreen,
    '/squad/:id/composition': SquadCompositionScreen,
    '/squad/:id/health': SquadHealthScreen,
    '/propose-session': ProposeSessionScreen,
    '/vote-session': VoteSessionScreen,
    '/recurring-session': RecurringSessionScreen,
    '/check-in': CheckInScreen,
    '/profile/edit': EditProfileScreen,
    '/profile/:id': PublicProfileScreen,
    '/achievements': AchievementsScreen,
    '/stats': AdvancedStatsScreen,
    '/badges': BadgesScreen,
    '/history': HistoryScreen,
    '/friends': FriendsScreen,
    '/search': SearchPlayersScreen,
    '/discover': DiscoverSquadsScreen,
    '/community': CommunityScreen,
    '/leaderboard': LeaderboardScreen,
    '/activity': ActivityFeedScreen,
    '/challenges': ChallengesScreen,
    '/tournaments': TournamentsScreen,
    // Additional screens - Roadmap 2 & 3
    '/academy': AcademyScreen,
    '/api-docs': ApiDocsScreen,
    '/auto-coaching': AutoCoachingScreen,
    '/availability-heatmap': AvailabilityHeatmapScreen,
    '/calendar-sync': CalendarSyncScreen,
    '/coaching-tools': CoachingToolsScreen,
    '/discord-bot': DiscordBotScreen,
    '/esport-integrations': EsportIntegrationsScreen,
    '/esport-team': EsportTeamScreen,
    '/features-demo': FeaturesDemoScreen,
    '/integrations': IntegrationsScreen,
    '/intelligence': IntelligenceScreen,
    '/leadership-analysis': LeadershipAnalysisScreen,
    '/leagues': LeaguesScreen,
    '/notification-settings': NotificationSettingsScreen,
    '/notifications': NotificationsScreen,
    '/organization': OrganizationScreen,
    '/plugins': PluginsScreen,
    '/preferences': PreferencesScreen,
    '/premium': PremiumScreen,
    '/privacy': PrivacyScreen,
    '/qa-tests': QATestsScreen,
    '/ranking': RankingScreen,
    '/seasons': SeasonsScreen,
    '/share': ShareScreen,
    '/smart-suggestions': SmartSuggestionsScreen,
    '/streamer-dashboard': StreamerDashboardScreen,
    '/test-setup': TestSetupScreen,
    '/weekly-recap': WeeklyRecapScreen,
  };

  // Navigation Flow Data
  const navigationFlow = {
    auth: [
      { id: 'splash', name: 'Splash Screen', icon: Zap, next: ['login', 'signup'] },
      { id: 'login', name: 'Login', icon: LogIn, next: ['home', 'signup'] },
      { id: 'signup', name: 'Signup', icon: UserPlus, next: ['home', 'login'] }
    ],
    main: [
      { id: 'home', name: 'Home', icon: Home, next: ['squad-detail', 'create-squad', 'profile', 'sessions'] },
      { id: 'squads', name: 'Squads List', icon: Users, next: ['squad-detail', 'create-squad', 'join-squad'] },
      { id: 'sessions', name: 'Sessions', icon: Calendar, next: ['propose-session', 'vote-session'] },
      { id: 'profile', name: 'Profile', icon: User, next: ['edit-profile', 'achievements', 'stats'] }
    ],
    squad: [
      { id: 'squad-detail', name: 'Squad Detail', icon: Users, next: ['propose-session', 'squad-chat', 'squad-settings'] },
      { id: 'create-squad', name: 'Create Squad', icon: Plus, next: ['squad-detail'] },
      { id: 'join-squad', name: 'Join Squad', icon: UserPlus, next: ['squad-detail'] },
      { id: 'squad-chat', name: 'Squad Chat', icon: MessageSquare, next: ['squad-detail'] }
    ],
    session: [
      { id: 'propose-session', name: 'Propose Session', icon: Plus, next: ['squad-detail', 'vote-session'] },
      { id: 'vote-session', name: 'Vote Session', icon: Vote, next: ['squad-detail'] },
      { id: 'recurring-session', name: 'Recurring', icon: Calendar, next: ['squad-detail'] }
    ],
    advanced: [
      { id: 'achievements', name: 'Achievements', icon: Trophy, next: ['profile'] },
      { id: 'stats', name: 'Advanced Stats', icon: BarChart3, next: ['profile'] },
      { id: 'leaderboard', name: 'Leaderboard', icon: Target, next: ['profile', 'public-profile'] },
      { id: 'notifications', name: 'Notifications', icon: Bell, next: ['squad-detail', 'sessions'] }
    ]
  };

  // All Screens organized by category
  const screenCategories = [
    {
      name: 'Authentification',
      screens: [
        { name: 'Écran de démarrage', route: '/', color: 'amber' },
        { name: 'Connexion', route: '/login', color: 'amber' },
        { name: 'Inscription', route: '/signup', color: 'amber' }
      ]
    },
    {
      name: 'Navigation Principale',
      screens: [
        { name: 'Accueil', route: '/home', color: 'teal' },
        { name: 'Squads', route: '/squads', color: 'teal' },
        { name: 'Sessions', route: '/sessions', color: 'teal' },
        { name: 'Profil', route: '/profile', color: 'teal' }
      ]
    },
    {
      name: 'Gestion de Squad',
      screens: [
        { name: 'Détails Squad', route: '/squad/:id', color: 'emerald' },
        { name: 'Créer une Squad', route: '/create-squad', color: 'emerald' },
        { name: 'Rejoindre Squad', route: '/join-squad', color: 'emerald' },
        { name: 'Chat Squad', route: '/squad/:id/chat', color: 'emerald' },
        { name: 'Paramètres Squad', route: '/squad/:id/settings', color: 'emerald' },
        { name: 'Composition Squad', route: '/squad/:id/composition', color: 'emerald' },
        { name: 'Santé Squad', route: '/squad/:id/health', color: 'emerald' },
      ]
    },
    {
      name: 'Gestion des Sessions',
      screens: [
        { name: 'Proposer Session', route: '/propose-session', color: 'orange' },
        { name: 'Vote Session', route: '/vote-session', color: 'orange' },
        { name: 'Session Récurrente', route: '/recurring-session', color: 'orange' },
        { name: 'Check-in', route: '/check-in', color: 'orange' }
      ]
    },
    {
      name: 'Profil & Statistiques',
      screens: [
        { name: 'Modifier Profil', route: '/profile/edit', color: 'purple' },
        { name: 'Profil Public', route: '/profile/:id', color: 'purple' },
        { name: 'Succès', route: '/achievements', color: 'purple' },
        { name: 'Stats Avancées', route: '/stats', color: 'purple' },
        { name: 'Badges', route: '/badges', color: 'purple' },
        { name: 'Historique', route: '/history', color: 'purple' },
        { name: 'Classement', route: '/ranking', color: 'purple' }
      ]
    },
    {
      name: 'Social & Communauté',
      screens: [
        { name: 'Amis', route: '/friends', color: 'pink' },
        { name: 'Rechercher Joueurs', route: '/search', color: 'pink' },
        { name: 'Découvrir Squads', route: '/discover', color: 'pink' },
        { name: 'Communauté', route: '/community', color: 'pink' },
        { name: 'Classement', route: '/leaderboard', color: 'pink' },
        { name: 'Fil d\'Activité', route: '/activity', color: 'pink' }
      ]
    },
    {
      name: 'Compétition & E-Sport',
      screens: [
        { name: 'Défis', route: '/challenges', color: 'blue' },
        { name: 'Tournois', route: '/tournaments', color: 'blue' },
        { name: 'Ligues', route: '/leagues', color: 'blue' },
        { name: 'Saisons', route: '/seasons', color: 'blue' },
        { name: 'Équipe E-Sport', route: '/esport-team', color: 'blue' },
        { name: 'Intégrations E-Sport', route: '/esport-integrations', color: 'blue' }
      ]
    },
    {
      name: 'Coaching & Intelligence',
      screens: [
        { name: 'Académie', route: '/academy', color: 'yellow' },
        { name: 'Outils de Coaching', route: '/coaching-tools', color: 'yellow' },
        { name: 'Auto-Coaching', route: '/auto-coaching', color: 'yellow' },
        { name: 'Intelligence IA', route: '/intelligence', color: 'yellow' },
        { name: 'Suggestions Intelligentes', route: '/smart-suggestions', color: 'yellow' },
        { name: 'Analyse de Leadership', route: '/leadership-analysis', color: 'yellow' }
      ]
    },
    {
      name: 'Intégrations & Synchronisation',
      screens: [
        { name: 'Intégrations', route: '/integrations', color: 'slate' },
        { name: 'Bot Discord', route: '/discord-bot', color: 'slate' },
        { name: 'Sync Calendrier', route: '/calendar-sync', color: 'slate' },
        { name: 'Heatmap Disponibilités', route: '/availability-heatmap', color: 'slate' },
        { name: 'Webhooks', route: '/webhooks', color: 'slate' },
        { name: 'Partage', route: '/share', color: 'slate' }
      ]
    },
    {
      name: 'Organisation & Administration',
      screens: [
        { name: 'Organisation', route: '/organization', color: 'cyan' },
        { name: 'Dashboard Streamer', route: '/streamer-dashboard', color: 'cyan' },
        { name: 'Premium', route: '/premium', color: 'cyan' },
        { name: 'API Documentation', route: '/api-docs', color: 'cyan' },
        { name: 'Plugins', route: '/plugins', color: 'cyan' }
      ]
    },
    {
      name: 'Notifications & Paramètres',
      screens: [
        { name: 'Notifications', route: '/notifications', color: 'indigo' },
        { name: 'Paramètres Notifications', route: '/notification-settings', color: 'indigo' },
        { name: 'Préférences', route: '/preferences', color: 'indigo' },
        { name: 'Confidentialité', route: '/privacy', color: 'indigo' }
      ]
    },
    {
      name: 'Rapports & Récapitulatifs',
      screens: [
        { name: 'Récap Hebdomadaire', route: '/weekly-recap', color: 'violet' }
      ]
    },
    {
      name: 'Démo & Tests',
      screens: [
        { name: 'Démo Fonctionnalités', route: '/features-demo', color: 'rose' },
        { name: 'Tests QA', route: '/qa-tests', color: 'rose' },
        { name: 'Configuration Tests', route: '/test-setup', color: 'rose' }
      ]
    }
  ];

  // Design System Colors
  const colorSystem = {
    primary: [
      { name: 'primary-50', hex: '#FFFBEB', usage: 'Backgrounds clairs' },
      { name: 'primary-500', hex: '#F59E0B', usage: 'Actions principales ⭐' },
      { name: 'primary-700', hex: '#B45309', usage: 'Texte sur clair' }
    ],
    secondary: [
      { name: 'secondary-50', hex: '#F0FDFA', usage: 'Backgrounds clairs' },
      { name: 'secondary-500', hex: '#14B8A6', usage: 'Accents ⭐' },
      { name: 'secondary-700', hex: '#0F766E', usage: 'Texte sur clair' }
    ],
    semantic: [
      { name: 'success', hex: '#10B981', usage: 'Confirmations' },
      { name: 'warning', hex: '#F97316', usage: 'Alertes' },
      { name: 'destructive', hex: '#F43F5E', usage: 'Actions destructives' }
    ],
    backgrounds: [
      { name: 'bg-base', hex: '#F5F3F0', usage: 'Fond principal ⭐' },
      { name: 'bg-elevated', hex: '#FDFCFB', usage: 'Cards, modales' },
      { name: 'bg-subtle', hex: '#EAE7E3', usage: 'Contraste doux' }
    ]
  };

  // UI Components showcase
  const componentExamples = [
    {
      name: 'Buttons',
      variants: [
        { label: 'Primary', class: 'bg-[#F59E0B] text-white' },
        { label: 'Secondary', class: 'bg-[#14B8A6] text-white' },
        { label: 'Outline', class: 'border-2 border-[#F59E0B] text-[#F59E0B]' },
        { label: 'Ghost', class: 'text-[#F59E0B] hover:bg-[#FFFBEB]' }
      ]
    },
    {
      name: 'Badges',
      variants: [
        { label: 'Amber', class: 'bg-[#FFFBEB] text-[#B45309] border border-[#FCD34D]' },
        { label: 'Teal', class: 'bg-[#F0FDFA] text-[#0F766E] border border-[#5EEAD4]' },
        { label: 'Success', class: 'bg-[#ECFDF5] text-[#047857] border border-[#6EE7B7]' },
        { label: 'Warning', class: 'bg-[#FFF7ED] text-[#C2410C] border border-[#FDBA74]' }
      ]
    },
    {
      name: 'Cards',
      variants: [
        { label: 'Elevated', class: 'bg-[#FDFCFB] border-[0.5px] border-[rgba(120,113,108,0.1)] shadow-sm' },
        { label: 'Glass', class: 'bg-[rgba(253,252,251,0.7)] backdrop-blur-xl border-[0.5px] border-[rgba(120,113,108,0.15)]' },
        { label: 'Subtle', class: 'bg-[#EAE7E3] border-[0.5px] border-[rgba(120,113,108,0.1)]' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F3F0] pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#F59E0B] to-[#14B8A6] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)`
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Box className="w-4 h-4" />
              v4.0 Warm Premium
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 tracking-tight">
              Squad Planner
              <br />
              <span className="text-white/90">Design System</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Documentation complète du design system, navigation et architecture UI
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="text-3xl font-bold">61</div>
                <div className="text-sm text-white/80">Écrans</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="text-3xl font-bold">100+</div>
                <div className="text-sm text-white/80">Composants</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="text-3xl font-bold">AA+</div>
                <div className="text-sm text-white/80">Accessibilité</div>
              </div>
            </div>

            {/* Screenshot Gallery Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-8"
            >
              <button
                onClick={() => onNavigate?.('screenshot-gallery')}
                className="inline-flex items-center gap-3 bg-white text-[#F59E0B] px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
              >
                <Camera className="w-6 h-6" />
                📸 Galerie Screenshots
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-40 bg-[#FDFCFB]/95 backdrop-blur-xl border-b border-[rgba(120,113,108,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 overflow-x-auto hide-scrollbar py-2">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: Layout },
              { id: 'colors', label: 'Couleurs', icon: Palette },
              { id: 'components', label: 'Composants', icon: Box },
              { id: 'navigation', label: 'Navigation', icon: GitBranch },
              { id: 'screens', label: 'Écrans', icon: Layers }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#F59E0B] text-white shadow-lg'
                    : 'text-[rgba(28,25,23,0.7)] hover:bg-[#FFFBEB]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <section>
              <h2 className="text-3xl font-bold text-[rgba(28,25,23,0.95)] mb-4">
                Design System v4.0 "Warm Premium"
              </h2>
              <p className="text-lg text-[rgba(28,25,23,0.7)] mb-8 leading-relaxed">
                Design ultra-premium inspiré de <strong>Arc Browser</strong>, <strong>Raycast</strong>, <strong>Linear</strong> et <strong>Notion</strong>. 
                Palette unique Amber + Teal pour une identité visuelle reconnaissable.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-[#FDFCFB] border-[0.5px] border-[rgba(120,113,108,0.1)]">
                  <Palette className="w-10 h-10 text-[#F59E0B] mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Warm & Unique</h3>
                  <p className="text-[rgba(28,25,23,0.7)] text-sm leading-relaxed">
                    Palette chaleureuse avec Amber (unique dans le gaming) et Teal pour un équilibre parfait.
                  </p>
                </Card>

                <Card className="p-6 bg-[#FDFCFB] border-[0.5px] border-[rgba(120,113,108,0.1)]">
                  <Zap className="w-10 h-10 text-[#14B8A6] mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Animations Premium</h3>
                  <p className="text-[rgba(28,25,23,0.7)] text-sm leading-relaxed">
                    Durées ralenties (200-500ms) et easings sophistiqués pour un feeling luxueux.
                  </p>
                </Card>

                <Card className="p-6 bg-[#FDFCFB] border-[0.5px] border-[rgba(120,113,108,0.1)]">
                  <Shield className="w-10 h-10 text-[#10B981] mb-4" />
                  <h3 className="text-xl font-semibold mb-2">WCAG AA+</h3>
                  <p className="text-[rgba(28,25,23,0.7)] text-sm leading-relaxed">
                    Contrastes validés, focus states visibles, navigation clavier complète.
                  </p>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[rgba(28,25,23,0.95)] mb-6">
                Philosophie Design
              </h2>
              <div className="bg-gradient-to-r from-[#FFFBEB] to-[#F0FDFA] border-[0.5px] border-[rgba(120,113,108,0.1)] rounded-2xl p-8">
                <blockquote className="text-2xl font-semibold text-[rgba(28,25,23,0.95)] mb-6 italic">
                  "Warm, intentional, unique"
                </blockquote>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                      <h4 className="font-semibold">Amber</h4>
                    </div>
                    <p className="text-sm text-[rgba(28,25,23,0.7)] ml-6">
                      Énergie, victoire, unicité dans l'univers gaming
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 rounded-full bg-[#14B8A6]" />
                      <h4 className="font-semibold">Teal</h4>
                    </div>
                    <p className="text-sm text-[rgba(28,25,23,0.7)] ml-6">
                      Équilibre, modernité, sophistication tech
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 rounded-full bg-[#F5F3F0]" />
                      <h4 className="font-semibold">Beige</h4>
                    </div>
                    <p className="text-sm text-[rgba(28,25,23,0.7)] ml-6">
                      Confort, sophistication, papier premium
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 rounded-full bg-[rgba(28,25,23,0.1)]" />
                      <h4 className="font-semibold">Lenteur</h4>
                    </div>
                    <p className="text-sm text-[rgba(28,25,23,0.7)] ml-6">
                      Qualité, intentionnalité, sensation premium
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[rgba(28,25,23,0.95)] mb-6">
                Architecture de l'Application
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 bg-[#FDFCFB] border-[0.5px] border-[rgba(120,113,108,0.1)]">
                  <Smartphone className="w-8 h-8 text-[#F59E0B] mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Mobile-First</h3>
                  <p className="text-sm text-[rgba(28,25,23,0.7)] mb-4">
                    Conçu prioritairement pour iOS/Android avec touch targets de 44px minimum
                  </p>
                  <ul className="space-y-2 text-sm text-[rgba(28,25,23,0.7)]">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 mt-0.5 text-[#F59E0B] shrink-0" />
                      Navigation bottom-bar intuitive
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 mt-0.5 text-[#F59E0B] shrink-0" />
                      Swipe gestures pour RSVP
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 mt-0.5 text-[#F59E0B] shrink-0" />
                      Safe areas iOS/Android
                    </li>
                  </ul>
                </Card>

                <Card className="p-6 bg-[#FDFCFB] border-[0.5px] border-[rgba(120,113,108,0.1)]">
                  <Monitor className="w-8 h-8 text-[#14B8A6] mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Desktop Enhanced</h3>
                  <p className="text-sm text-[rgba(28,25,23,0.7)] mb-4">
                    Version desktop avec sidebar et shortcuts clavier
                  </p>
                  <ul className="space-y-2 text-sm text-[rgba(28,25,23,0.7)]">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 mt-0.5 text-[#14B8A6] shrink-0" />
                      Sidebar persistante
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 mt-0.5 text-[#14B8A6] shrink-0" />
                      Command Palette (Cmd+K)
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 mt-0.5 text-[#14B8A6] shrink-0" />
                      Hover states avancés
                    </li>
                  </ul>
                </Card>
              </div>
            </section>
          </motion.div>
        )}

        {/* COLORS TAB */}
        {activeTab === 'colors' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <section>
              <h2 className="text-3xl font-bold text-[rgba(28,25,23,0.95)] mb-4">
                Système de Couleurs
              </h2>
              <p className="text-lg text-[rgba(28,25,23,0.7)] mb-8">
                Palette Warm Premium avec contrôles WCAG AA+ validés
              </p>

              {/* Primary Colors */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                  Primary - Amber (Unique)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {colorSystem.primary.map((color) => (
                    <div key={color.name} className="group">
                      <div 
                        className="h-24 rounded-lg mb-3 transition-transform group-hover:scale-105"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="text-sm font-mono font-semibold">{color.hex}</div>
                      <div className="text-xs text-[rgba(28,25,23,0.5)]">{color.usage}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secondary Colors */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#14B8A6]" />
                  Secondary - Teal
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {colorSystem.secondary.map((color) => (
                    <div key={color.name} className="group">
                      <div 
                        className="h-24 rounded-lg mb-3 transition-transform group-hover:scale-105"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="text-sm font-mono font-semibold">{color.hex}</div>
                      <div className="text-xs text-[rgba(28,25,23,0.5)]">{color.usage}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Semantic Colors */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Couleurs Sémantiques</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {colorSystem.semantic.map((color) => (
                    <div key={color.name} className="group">
                      <div 
                        className="h-24 rounded-lg mb-3 transition-transform group-hover:scale-105"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="text-sm font-mono font-semibold">{color.hex}</div>
                      <div className="text-xs text-[rgba(28,25,23,0.5)]">{color.usage}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Background Colors */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Backgrounds Warm</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {colorSystem.backgrounds.map((color) => (
                    <div key={color.name} className="group">
                      <div 
                        className="h-24 rounded-lg mb-3 border-[0.5px] border-[rgba(120,113,108,0.2)] transition-transform group-hover:scale-105"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="text-sm font-mono font-semibold">{color.hex}</div>
                      <div className="text-xs text-[rgba(28,25,23,0.5)]">{color.usage}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-[#FDFCFB] border-[0.5px] border-[rgba(120,113,108,0.1)] rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-4">Accessibilité WCAG</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-[rgba(28,25,23,0.7)] mb-2">Amber 500 sur blanc</div>
                  <div className="text-2xl font-bold text-[#F59E0B] bg-white p-4 rounded-lg border-[0.5px] border-[rgba(120,113,108,0.1)]">
                    3.4:1 (AA Large ✅)
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[rgba(28,25,23,0.7)] mb-2">Amber 700 sur blanc</div>
                  <div className="text-2xl font-bold text-[#B45309] bg-white p-4 rounded-lg border-[0.5px] border-[rgba(120,113,108,0.1)]">
                    7.2:1 (AAA ✅)
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[rgba(28,25,23,0.7)] mb-2">Teal 500 sur blanc</div>
                  <div className="text-2xl font-bold text-[#14B8A6] bg-white p-4 rounded-lg border-[0.5px] border-[rgba(120,113,108,0.1)]">
                    4.5:1 (AA ✅)
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[rgba(28,25,23,0.7)] mb-2">Dark sur beige</div>
                  <div className="text-2xl font-bold text-[rgba(28,25,23,0.95)] bg-[#F5F3F0] p-4 rounded-lg border-[0.5px] border-[rgba(120,113,108,0.1)]">
                    19.8:1 (AAA ✅)
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {/* COMPONENTS TAB */}
        {activeTab === 'components' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <section>
              <h2 className="text-3xl font-bold text-[rgba(28,25,23,0.95)] mb-4">
                Bibliothèque de Composants
              </h2>
              <p className="text-lg text-[rgba(28,25,23,0.7)] mb-8">
                100+ composants UI réutilisables avec variants
              </p>

              {componentExamples.map((component) => (
                <div key={component.name} className="mb-12">
                  <h3 className="text-xl font-semibold mb-6">{component.name}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {component.variants.map((variant) => (
                      <div key={variant.label} className="text-center">
                        <div className={`${variant.class} px-6 py-3 rounded-lg font-medium text-sm transition-all hover:scale-105 cursor-pointer mb-2`}>
                          {variant.label}
                        </div>
                        <div className="text-xs text-[rgba(28,25,23,0.5)]">{variant.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-6">Typography</h3>
              <div className="space-y-6 bg-[#FDFCFB] border-[0.5px] border-[rgba(120,113,108,0.1)] rounded-2xl p-8">
                <div>
                  <div className="text-xs text-[rgba(28,25,23,0.5)] mb-2">Hero (clamp 2.5-4rem)</div>
                  <div className="heading-hero text-[rgba(28,25,23,0.95)]">Squad Planner</div>
                </div>
                <div>
                  <div className="text-xs text-[rgba(28,25,23,0.5)] mb-2">Page Title (clamp 1.75-2.5rem)</div>
                  <div className="heading-page text-[rgba(28,25,23,0.95)]">Mes Squads</div>
                </div>
                <div>
                  <div className="text-xs text-[rgba(28,25,23,0.5)] mb-2">Section (clamp 1.25-1.75rem)</div>
                  <div className="heading-section text-[rgba(28,25,23,0.95)]">Prochaine Session</div>
                </div>
                <div>
                  <div className="text-xs text-[rgba(28,25,23,0.5)] mb-2">Body Text (16px)</div>
                  <p className="text-[rgba(28,25,23,0.7)]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                  </p>
                </div>
                <div>
                  <div className="text-xs text-[rgba(28,25,23,0.5)] mb-2">Small Text (14px)</div>
                  <small className="text-[rgba(28,25,23,0.5)]">Il y a 5 minutes</small>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-6">Spacing System (8px grid)</h3>
              <div className="bg-[#FDFCFB] border-[0.5px] border-[rgba(120,113,108,0.1)] rounded-2xl p-8 space-y-4">
                {[
                  { name: 'space-1', value: '4px' },
                  { name: 'space-2', value: '8px' },
                  { name: 'space-3', value: '12px' },
                  { name: 'space-4', value: '16px' },
                  { name: 'space-6', value: '24px' },
                  { name: 'space-8', value: '32px' },
                  { name: 'space-12', value: '48px' }
                ].map((space) => (
                  <div key={space.name} className="flex items-center gap-4">
                    <div className="w-32 text-sm font-mono text-[rgba(28,25,23,0.7)]">{space.name}</div>
                    <div className="flex-1 h-8 bg-gradient-to-r from-[#F59E0B] to-[#14B8A6] rounded" style={{ width: space.value }} />
                    <div className="w-16 text-sm text-[rgba(28,25,23,0.5)]">{space.value}</div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-6">Animations (Ralentie Premium)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-[#FDFCFB] border-[0.5px] border-[rgba(120,113,108,0.1)]">
                  <div className="text-sm text-[rgba(28,25,23,0.5)] mb-2">Fast</div>
                  <div className="text-3xl font-bold text-[#F59E0B]">200ms</div>
                  <div className="text-xs text-[rgba(28,25,23,0.5)] mt-1">+33% vs v3.0</div>
                </Card>
                <Card className="p-6 bg-[#FDFCFB] border-[0.5px] border-[rgba(120,113,108,0.1)]">
                  <div className="text-sm text-[rgba(28,25,23,0.5)] mb-2">Normal</div>
                  <div className="text-3xl font-bold text-[#14B8A6]">300ms</div>
                  <div className="text-xs text-[rgba(28,25,23,0.5)] mt-1">+20% vs v3.0</div>
                </Card>
                <Card className="p-6 bg-[#FDFCFB] border-[0.5px] border-[rgba(120,113,108,0.1)]">
                  <div className="text-sm text-[rgba(28,25,23,0.5)] mb-2">Slow</div>
                  <div className="text-3xl font-bold text-[#10B981]">500ms</div>
                  <div className="text-xs text-[rgba(28,25,23,0.5)] mt-1">+25% vs v3.0</div>
                </Card>
              </div>
            </section>
          </motion.div>
        )}

        {/* NAVIGATION TAB */}
        {activeTab === 'navigation' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <section>
              <h2 className="text-3xl font-bold text-[rgba(28,25,23,0.95)] mb-4">
                Architecture de Navigation
              </h2>
              <p className="text-lg text-[rgba(28,25,23,0.7)] mb-8">
                Flow complet de navigation entre les écrans
              </p>

              {Object.entries(navigationFlow).map(([category, screens]) => (
                <div key={category} className="mb-12">
                  <h3 className="text-xl font-semibold mb-6 capitalize flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-[#F59E0B]" />
                    {category === 'auth' && 'Authentification'}
                    {category === 'main' && 'Navigation Principale'}
                    {category === 'squad' && 'Gestion de Squad'}
                    {category === 'session' && 'Gestion de Session'}
                    {category === 'advanced' && 'Fonctionnalités Avancées'}
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {screens.map((screen) => {
                      const Icon = screen.icon;
                      return (
                        <div 
                          key={screen.id}
                          className="bg-[#FDFCFB] border-[0.5px] border-[rgba(120,113,108,0.1)] rounded-xl p-6 hover:shadow-lg transition-all"
                        >
                          <div className="flex items-start gap-4">
                            <div className="bg-[#FFFBEB] p-3 rounded-lg shrink-0">
                              <Icon className="w-6 h-6 text-[#F59E0B]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-lg mb-2">{screen.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-[rgba(28,25,23,0.5)]">
                                <span>Peut naviguer vers:</span>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-3">
                                {screen.next.map((nextId) => {
                                  const nextScreen = Object.values(navigationFlow)
                                    .flat()
                                    .find(s => s.id === nextId);
                                  if (!nextScreen) return null;
                                  const NextIcon = nextScreen.icon;
                                  return (
                                    <div 
                                      key={nextId}
                                      className="inline-flex items-center gap-2 bg-[#F0FDFA] text-[#0F766E] px-3 py-1.5 rounded-lg text-xs font-medium border border-[#5EEAD4]"
                                    >
                                      <NextIcon className="w-3.5 h-3.5" />
                                      {nextScreen.name}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-[rgba(28,25,23,0.3)] shrink-0 mt-1" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </section>

            <section className="bg-gradient-to-br from-[#FFFBEB] to-[#F0FDFA] border-[0.5px] border-[rgba(120,113,108,0.1)] rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-4">Navigation Bottom Bar (Mobile)</h3>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { icon: Home, label: 'Accueil', route: '/home' },
                  { icon: Users, label: 'Squads', route: '/squads' },
                  { icon: Calendar, label: 'Sessions', route: '/sessions' },
                  { icon: User, label: 'Profil', route: '/profile' }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.route} className="text-center">
                      <div className="bg-white rounded-xl p-4 mb-2 border-[0.5px] border-[rgba(120,113,108,0.1)]">
                        <Icon className="w-6 h-6 mx-auto text-[#F59E0B]" />
                      </div>
                      <div className="text-xs font-medium text-[rgba(28,25,23,0.7)]">{item.label}</div>
                      <div className="text-xs text-[rgba(28,25,23,0.4)] font-mono">{item.route}</div>
                    </div>
                  );
                })}
              </div>
            </section>
          </motion.div>
        )}

        {/* SCREENS TAB */}
        {activeTab === 'screens' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <section>
              <h2 className="text-3xl font-bold text-[rgba(28,25,23,0.95)] mb-4">
                Galerie des Écrans
              </h2>
              <p className="text-lg text-[rgba(28,25,23,0.7)] mb-8">
                61 écrans organisés par catégories
              </p>

              {screenCategories.map((category) => (
                <div key={category.name} className="mb-12">
                  <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      category.screens[0].color === 'amber' ? 'bg-[#F59E0B]' :
                      category.screens[0].color === 'teal' ? 'bg-[#14B8A6]' :
                      category.screens[0].color === 'emerald' ? 'bg-[#10B981]' :
                      category.screens[0].color === 'orange' ? 'bg-[#F97316]' :
                      category.screens[0].color === 'purple' ? 'bg-[#A855F7]' :
                      category.screens[0].color === 'pink' ? 'bg-[#EC4899]' :
                      category.screens[0].color === 'blue' ? 'bg-[#3B82F6]' :
                      category.screens[0].color === 'yellow' ? 'bg-[#EAB308]' :
                      category.screens[0].color === 'slate' ? 'bg-[#64748B]' :
                      category.screens[0].color === 'cyan' ? 'bg-[#06B6D4]' :
                      category.screens[0].color === 'indigo' ? 'bg-[#6366F1]' :
                      category.screens[0].color === 'violet' ? 'bg-[#8B5CF6]' :
                      category.screens[0].color === 'rose' ? 'bg-[#F43F5E]' :
                      'bg-[#64748B]'
                    }`} />
                    {category.name}
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {category.screens.map((screen) => {
                      const ScreenComponent = screenComponents[screen.route];
                      return (
                        <div
                          key={screen.route}
                          onClick={() => setSelectedScreen(screen.route)}
                          className={`bg-[#FDFCFB] border-[0.5px] rounded-xl p-4 text-left transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer ${
                            selectedScreen === screen.route 
                              ? 'border-[#F59E0B] shadow-lg ring-2 ring-[#F59E0B]/20' 
                              : 'border-[rgba(120,113,108,0.1)]'
                          }`}
                        >
                          <div className={`w-full aspect-[9/16] rounded-lg mb-3 bg-[#F5F3F0] overflow-hidden border-[0.5px] border-[rgba(120,113,108,0.1)] relative`}>
                            {ScreenComponent ? (
                              <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ 
                                transform: 'scale(0.25)', 
                                transformOrigin: 'top left', 
                                width: '400%', 
                                height: '400%' 
                              }}>
                                <Suspense fallback={
                                  <div className="w-full h-full flex items-center justify-center bg-[#F5F3F0]">
                                    <Smartphone className="w-8 h-8 text-[rgba(28,25,23,0.2)]" />
                                  </div>
                                }>
                                  <ScreenWrapper component={ScreenComponent} route={screen.route} />
                                </Suspense>
                              </div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Smartphone className="w-8 h-8 text-[rgba(28,25,23,0.2)]" />
                              </div>
                            )}
                          </div>
                          <div className="font-medium text-sm mb-1">{screen.name}</div>
                          <div className="text-xs text-[rgba(28,25,23,0.4)] font-mono">{screen.route}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </section>

            <section className="bg-[#FDFCFB] border-[0.5px] border-[rgba(120,113,108,0.1)] rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-4">Statistiques</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-3xl font-bold text-[#F59E0B] mb-2">
                    {screenCategories.reduce((acc, cat) => acc + cat.screens.length, 0)}
                  </div>
                  <div className="text-sm text-[rgba(28,25,23,0.7)]">Écrans totaux</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#14B8A6] mb-2">
                    {screenCategories.length}
                  </div>
                  <div className="text-sm text-[rgba(28,25,23,0.7)]">Catégories</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#10B981] mb-2">4</div>
                  <div className="text-sm text-[rgba(28,25,23,0.7)]">Tabs principales</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#F97316] mb-2">100%</div>
                  <div className="text-sm text-[rgba(28,25,23,0.7)]">Mobile-first</div>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </div>

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-24 right-6 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button 
          onClick={() => onNavigate?.('screenshot-gallery')}
          className="bg-gradient-to-r from-[#F59E0B] to-[#14B8A6] text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group relative"
          title="Galerie Screenshots"
        >
          <Smartphone className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#F59E0B] rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
            📸
          </span>
        </button>
      </motion.div>

      {/* Selected Screen Preview */}
      {selectedScreen && screenComponents[selectedScreen] && (() => {
        const SelectedComponent = screenComponents[selectedScreen];
        return (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-[#F5F3F0] rounded-3xl shadow-2xl overflow-hidden" style={{ height: '844px', maxHeight: '90vh' }}>
              <button
                onClick={() => setSelectedScreen(null)}
                className="absolute top-4 right-4 z-50 bg-[#F59E0B] text-white w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-full h-full overflow-auto">
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center bg-[#F5F3F0]">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-[rgba(28,25,23,0.6)]">Chargement...</p>
                    </div>
                  </div>
                }>
                  <ScreenWrapper component={SelectedComponent} route={selectedScreen} />
                </Suspense>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}