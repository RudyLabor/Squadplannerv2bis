import { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimationConfig } from '@/utils/device';
import { TranslationProvider } from '@/i18n/useTranslation';
import { AuthProvider } from '@/app/contexts/AuthContext';
import { UserProvider } from '@/app/contexts/UserContext';
import { SquadsProvider } from '@/app/contexts/SquadsContext';
import { SessionsProvider } from '@/app/contexts/SessionsContext';
import { NotificationsProvider } from '@/app/contexts/NotificationsContext';
import { MessagesProvider } from '@/app/contexts/MessagesContext';
import { FriendsProvider } from '@/app/contexts/FriendsContext';
import { SubscriptionProvider } from '@/app/contexts/SubscriptionContext';
import { ToastProvider, useToast } from '@/app/components/Toast';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import { ThemeProvider } from '@/design-system';

// Debug utility
import { debugAuth } from '@/utils/auth-debug';

// Components
import { Logo } from '@/app/components/Logo';
import { BottomNav } from '@/app/components/BottomNav';
import { DesktopSidebar } from '@/app/components/DesktopSidebar';
import { DesktopHeader } from '@/app/components/DesktopHeader';
import { CommandPalette } from '@/app/components/CommandPalette';
import { SplashScreen } from '@/app/components/SplashScreen';
import { LanguageSwitcher } from '@/app/components/LanguageSwitcher';
import { Skeleton } from '@/app/components/ui/skeleton';
import { PerformanceDebugPanel } from '@/app/components/PerformanceDebugPanel';

// Hooks
import { useCommandPalette } from '@/app/hooks/useCommandPalette';
import { useIsMobile } from '@/app/hooks/useIsMobile';
import { useIsDesktop } from '@/app/hooks/useIsDesktop';
import { useAuth } from '@/app/contexts/AuthContext';
import { useUser } from '@/app/contexts/UserContext';

// Make debug utility available globally
if (typeof window !== 'undefined') {
  (window as any).debugAuth = debugAuth;
}

// Lazy load screens
const LoginScreen = lazy(() => import('@/app/screens/LoginScreen')) as any;
const SignupScreen = lazy(() => import('@/app/screens/SignupScreen')) as any;
const HomeScreen = lazy(() => import('@/app/screens/HomeScreen')) as any;
const SquadsScreen = lazy(() => import('@/app/screens/SquadsScreen')) as any;
const SquadDetailScreen = lazy(() => import('@/app/screens/SquadDetailScreen')) as any;
const SessionsScreen = lazy(() => import('@/app/screens/SessionsScreen')) as any;
const ProfileScreen = lazy(() => import('@/app/screens/ProfileScreen')) as any;
const EditProfileScreen = lazy(() => import('@/app/screens/EditProfileScreen')) as any;
const ProposeSessionScreen = lazy(() => import('@/app/screens/ProposeSessionScreen')) as any;
const CreateSquadScreen = lazy(() => import('@/app/screens/CreateSquadScreen')) as any;
const IntegrationsScreen = lazy(() => import('@/app/screens/IntegrationsScreen')) as any;
const JoinSquadScreen = lazy(() => import('@/app/screens/JoinSquadScreen')) as any;
const JoinViaLinkScreen = lazy(() => import('@/app/screens/JoinViaLinkScreen')) as any;
const VoteSessionScreen = lazy(() => import('@/app/screens/VoteSessionScreen')) as any;
const CheckInScreen = lazy(() => import('@/app/screens/CheckInScreen')) as any;
const SquadChatScreen = lazy(() => import('@/app/screens/SquadChatScreen')) as any;
const DiscordBotScreen = lazy(() => import('@/app/screens/DiscordBotScreen')) as any;
const CoachingToolsScreen = lazy(() => import('@/app/screens/CoachingToolsScreen')) as any;
const NotificationSettingsScreen = lazy(() => import('@/app/screens/NotificationSettingsScreen')) as any;
const SmartSuggestionsScreen = lazy(() => import('@/app/screens/SmartSuggestionsScreen')) as any;
const NotificationsScreen = lazy(() => import('@/app/screens/NotificationsScreen')) as any;
const AvailabilityHeatmapScreen = lazy(() => import('@/app/screens/AvailabilityHeatmapScreen')) as any;
const TestSetupScreen = lazy(() => import('@/app/screens/TestSetupScreen')) as any;
const QATestsScreen = lazy(() => import('@/app/screens/QATestsScreen')) as any;
const PremiumScreen = lazy(() => import('@/app/screens/PremiumScreen')) as any;
const PremiumSuccessScreen = lazy(() => import('@/app/screens/PremiumSuccessScreen')) as any;
const AdvancedStatsScreen = lazy(() => import('@/app/screens/AdvancedStatsScreen')) as any;
const CalendarSyncScreen = lazy(() => import('@/app/screens/CalendarSyncScreen')) as any;
const IntelligenceScreen = lazy(() => import('@/app/screens/IntelligenceScreen')) as any;
const SquadHealthScreen = lazy(() => import('@/app/screens/SquadHealthScreen')) as any;
const RecurringSessionScreen = lazy(() => import('@/app/screens/RecurringSessionScreen')) as any;
const WeeklyRecapScreen = lazy(() => import('@/app/screens/WeeklyRecapScreen')) as any;
const PrivacyScreen = lazy(() => import('@/app/screens/PrivacyScreen')) as any;
const PreferencesScreen = lazy(() => import('@/app/screens/PreferencesScreen')) as any;
const DiscordConnectScreen = lazy(() => import('@/app/screens/DiscordConnectScreen')) as any;
const LeaderboardScreen = lazy(() => import('@/app/screens/LeaderboardScreen')) as any;
const AchievementsScreen = lazy(() => import('@/app/screens/AchievementsScreen')) as any;
const FriendsScreen = lazy(() => import('@/app/screens/FriendsScreen')) as any;
const ActivityFeedScreen = lazy(() => import('@/app/screens/ActivityFeedScreen')) as any;
const PublicProfileScreen = lazy(() => import('@/app/screens/PublicProfileScreen')) as any;
const BadgesScreen = lazy(() => import('@/app/screens/BadgesScreen')) as any;
const TournamentsScreen = lazy(() => import('@/app/screens/TournamentsScreen')) as any;
const SearchPlayersScreen = lazy(() => import('@/app/screens/SearchPlayersScreen')) as any;
const DiscoverSquadsScreen = lazy(() => import('@/app/screens/DiscoverSquadsScreen')) as any;
const ChallengesScreen = lazy(() => import('@/app/screens/ChallengesScreen')) as any;
const RankingScreen = lazy(() => import('@/app/screens/RankingScreen')) as any;
const ShareScreen = lazy(() => import('@/app/screens/ShareScreen')) as any;
const ApiDocsScreen = lazy(() => import('@/app/screens/ApiDocsScreen')) as any;
const PluginsScreen = lazy(() => import('@/app/screens/PluginsScreen')) as any;
const WebhooksScreen = lazy(() => import('@/app/screens/WebhooksScreen')) as any;
const EsportIntegrationsScreen = lazy(() => import('@/app/screens/EsportIntegrationsScreen')) as any;
const SquadCompositionScreen = lazy(() => import('@/app/screens/SquadCompositionScreen')) as any;
const LeadershipAnalysisScreen = lazy(() => import('@/app/screens/LeadershipAnalysisScreen')) as any;
const SquadManagementScreen = lazy(() => import('@/app/screens/SquadManagementScreen')) as any;
const CommunityScreen = lazy(() => import('@/app/screens/CommunityScreen')) as any;
const LeaguesScreen = lazy(() => import('@/app/screens/LeaguesScreen')) as any;
const SeasonsScreen = lazy(() => import('@/app/screens/SeasonsScreen')) as any;
const HistoryScreen = lazy(() => import('@/app/screens/HistoryScreen')) as any;
const AutoCoachingScreen = lazy(() => import('@/app/screens/AutoCoachingScreen')) as any;
const EsportTeamScreen = lazy(() => import('@/app/screens/EsportTeamScreen')) as any;
const AcademyScreen = lazy(() => import('@/app/screens/AcademyScreen')) as any;
const StreamerDashboardScreen = lazy(() => import('@/app/screens/StreamerDashboardScreen')) as any;
const OrganizationScreen = lazy(() => import('@/app/screens/OrganizationScreen')) as any;
const ScreenshotGalleryScreen = lazy(() => import('@/app/screens/ScreenshotGalleryScreen')) as any;
const OAuthCallbackScreen = lazy(() => import('@/app/screens/OAuthCallbackScreen')) as any;
const InviteMemberScreen = lazy(() => import('@/app/screens/InviteMemberScreen')) as any;
const RSVPScreen = lazy(() => import('@/app/screens/RSVPScreen')) as any;

// Minimal loader for instant perceived performance
function ScreenLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#08090a]">
      <div className="w-6 h-6 border-2 border-[#5e6dd2]/30 border-t-[#5e6dd2] rounded-full animate-spin" />
    </div>
  );
}

// Prefetch common routes on app load for instant navigation
const prefetchRoutes = () => {
  // Prefetch main navigation routes
  const routes = [
    () => import('@/app/screens/HomeScreen'),
    () => import('@/app/screens/SquadsScreen'),
    () => import('@/app/screens/SessionsScreen'),
    () => import('@/app/screens/ProfileScreen'),
  ];
  // Start prefetching after initial load
  setTimeout(() => {
    routes.forEach(route => route().catch(() => {}));
  }, 1000);
};

// Login screen re-enabled - must match AuthContext and ProtectedRoute
const BYPASS_AUTH = false;

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, signOut, loading: authLoading, authError, clearAllCache } = useAuth();
  const { userProfile } = useUser();
  const { showToast } = useToast();
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();
  const animConfig = useAnimationConfig();
  const { isOpen: isCommandOpen, open: openCommand, close: closeCommand } = useCommandPalette();

  const [showSplash, setShowSplash] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [isPremium, setIsPremium] = useState(false);

  // Derived states
  const activeTab = location.pathname.split('/')[1] || 'home';
  const isAuthPage = ['/login', '/signup', '/'].includes(location.pathname);
  const showMainNav = ['/home', '/squads', '/sessions', '/profile'].some(path => location.pathname.startsWith(path));

  // Shim to keep existing screens working
  const handleNavigate = (screen: string, data?: any) => {
    if (screen === 'squad-detail') {
      navigate(`/squads/${data?.squadId || ''}`);
    } else if (screen === 'squad-chat') {
      navigate(`/chat/${data?.squadId || ''}`);
    } else if (screen === 'invite-member') {
      navigate(`/invite-member/${data?.squadId || ''}`);
    } else {
      navigate(`/${screen}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUserEmail('');
      setUserName('');
      setIsPremium(false);
      navigate('/login');
      showToast('Déconnexion réussie', 'success');
    } catch (error: any) {
      showToast('Erreur lors de la déconnexion', 'error');
    }
  };

  useEffect(() => {
    // Skip auth redirect when bypass is enabled
    if (BYPASS_AUTH) {
      if (isAuthPage) navigate('/home');
      return;
    }

    if (!authLoading) {
      if (isAuthenticated && user) {
        if (isAuthPage) navigate('/home');
        setUserEmail(user.email || '');
        setUserName(user.email?.split('@')[0] || '');
        setIsPremium(userProfile?.isPremium || false);
      } else if (!isAuthPage) {
        navigate('/login');
      }
    }
  }, [isAuthenticated, user, authLoading, location.pathname, userProfile]);

  // Prefetch routes on first auth complete
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      prefetchRoutes();
    }
  }, [authLoading, isAuthenticated]);

  // État de loading pour les boutons d'erreur
  const [retryLoading, setRetryLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleRetryAuth = () => {
    setRetryLoading(true);
    // Petit délai pour montrer le loading
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  const handleResetAuth = async () => {
    setResetLoading(true);
    try {
      // Timeout de sécurité - si clearAllCache prend trop de temps, on force le redirect
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );

      await Promise.race([clearAllCache(), timeout]);

      // Redirect vers login après le nettoyage
      window.location.href = '/login';
    } catch (error) {
      console.error('[App] Erreur reset:', error);
      // Même en cas d'erreur, on redirige vers login
      window.location.href = '/login';
    } finally {
      // Note: Ce finally ne sera probablement jamais atteint car on fait un redirect
      // Mais on le garde au cas où le redirect échoue
      setResetLoading(false);
    }
  };

  // Écran d'erreur d'authentification
  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08090a] p-4">
        <div className="text-center max-w-md">
          <Logo variant="icon" size="lg" className="mb-6 mx-auto opacity-50" />
          <div className="bg-[#e5534b]/10 border border-[#e5534b]/30 rounded-xl p-4 mb-6">
            <p className="text-[#f87171] text-sm">{authError}</p>
          </div>
          <p className="text-[#8b8d90] text-sm mb-6">
            Cela peut arriver si votre session a expiré ou si le serveur est temporairement indisponible.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleRetryAuth}
              disabled={retryLoading || resetLoading}
              className="w-full px-4 py-3 bg-[#5e6dd2] hover:bg-[#6a79db] disabled:opacity-50 text-white rounded-xl font-medium transition-all duration-150 flex items-center justify-center gap-2"
            >
              {retryLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Chargement...
                </>
              ) : (
                'Réessayer'
              )}
            </button>
            <button
              onClick={handleResetAuth}
              disabled={retryLoading || resetLoading}
              className="w-full px-4 py-3 bg-[#18191b] hover:bg-[#1f2023] disabled:opacity-50 text-[#8b8d90] border border-[#27282b] rounded-xl font-medium transition-all duration-150 flex items-center justify-center gap-2"
            >
              {resetLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#8b8d90]/30 border-t-[#8b8d90] rounded-full animate-spin" />
                  Réinitialisation...
                </>
              ) : (
                'Réinitialiser et se reconnecter'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08090a]">
        <div className="text-center flex flex-col items-center">
          <Logo variant="icon" size="lg" className="mb-4 animate-pulse" />
          <div className="w-6 h-6 border-2 border-[#5e6dd2]/30 border-t-[#5e6dd2] rounded-full animate-spin" />
          <p className="text-[#5e6063] text-xs mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <AnimatePresence>
        {showSplash && !isAuthPage && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      <div className="min-h-screen text-[#f7f8f8] relative overflow-x-hidden bg-[#08090a]">

        {isDesktop && isAuthenticated && showMainNav && (
          <DesktopSidebar
            activeTab={activeTab}
            onLogout={handleLogout}
            userName={userName}
            isPremium={isPremium}
          />
        )}

        {isDesktop && isAuthenticated && showMainNav && (
          <DesktopHeader onCommandOpen={openCommand} />
        )}

        {/* Logo only on auth pages, not on mobile authenticated screens */}
        {!(isDesktop && isAuthenticated && showMainNav) && isAuthPage && (
          <motion.div
            className="fixed top-6 left-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Logo variant="header" size="sm" />
          </motion.div>
        )}

        {/* Language switcher only on auth pages */}
        {isAuthPage && (
          <div className="fixed top-4 right-4 z-50">
            <LanguageSwitcher />
          </div>
        )}

        <div className={`
          min-h-screen relative bg-[#08090a]
          ${isDesktop && isAuthenticated && showMainNav
            ? 'ml-[260px] pt-14'
            : ''}
        `}>

          <div>
            <Suspense fallback={<ScreenLoader />}>
              {/* Fast transitions - no blocking exit animations */}
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
              >
                <Routes>
                    <Route path="/" element={<LoginScreen onNavigate={handleNavigate} showToast={showToast} />} />
                    <Route path="/login" element={<LoginScreen onNavigate={handleNavigate} showToast={showToast} />} />
                    <Route path="/signup" element={<SignupScreen onNavigate={handleNavigate} showToast={showToast} />} />

                    <Route path="/home" element={<ProtectedRoute><HomeScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/squads" element={<ProtectedRoute><SquadsScreen onNavigate={handleNavigate} /></ProtectedRoute>} />
                    <Route path="/squads/:squadId" element={<ProtectedRoute><SquadDetailScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/sessions" element={<ProtectedRoute><SessionsScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><ProfileScreen onNavigate={handleNavigate} showToast={showToast} onLogout={handleLogout} userEmail={userEmail} userName={userName} isPremium={isPremium} /></ProtectedRoute>} />
                    <Route path="/edit-profile" element={<ProtectedRoute><EditProfileScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/propose-session" element={<ProtectedRoute><ProposeSessionScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/create-squad" element={<ProtectedRoute><CreateSquadScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/integrations" element={<ProtectedRoute><IntegrationsScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/join-squad" element={<ProtectedRoute><JoinSquadScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/join/:code" element={<ProtectedRoute><JoinViaLinkScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/invite-member/:squadId" element={<ProtectedRoute><InviteMemberScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />

                    {/* Hub 2: Squads - Additional Routes */}
                    <Route path="/chat/:squadId" element={<ProtectedRoute><SquadChatScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/squad-health/:squadId" element={<ProtectedRoute><SquadHealthScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/squad-composition/:squadId" element={<ProtectedRoute><SquadCompositionScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/leadership-analysis/:squadId" element={<ProtectedRoute><LeadershipAnalysisScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/squad-management/:squadId" element={<ProtectedRoute><SquadManagementScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/discover-squads" element={<ProtectedRoute><DiscoverSquadsScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/esport-team" element={<ProtectedRoute><EsportTeamScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />

                    {/* Hub 3: Sessions - Additional Routes */}
                    <Route path="/rsvp/:sessionId" element={<ProtectedRoute><RSVPScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/vote-session/:sessionId" element={<ProtectedRoute><VoteSessionScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/check-in/:sessionId" element={<ProtectedRoute><CheckInScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/recurring-sessions" element={<ProtectedRoute><RecurringSessionScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/auto-coaching" element={<ProtectedRoute><AutoCoachingScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/coaching-tools" element={<ProtectedRoute><CoachingToolsScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/academy" element={<ProtectedRoute><AcademyScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />

                    {/* Hub 1: Home & Dashboard - Additional Routes */}
                    <Route path="/notification-settings" element={<ProtectedRoute><NotificationSettingsScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/smart-suggestions" element={<ProtectedRoute><SmartSuggestionsScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/notifications" element={<ProtectedRoute><NotificationsScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/availability" element={<ProtectedRoute><AvailabilityHeatmapScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/calendar-sync" element={<ProtectedRoute><CalendarSyncScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/weekly-recap" element={<ProtectedRoute><WeeklyRecapScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/test-setup" element={<ProtectedRoute><TestSetupScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/qa-tests" element={<ProtectedRoute><QATestsScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />

                    {/* Hub 4: Profile & Ecosystem - Additional Routes */}
                    <Route path="/profile/:userId" element={<ProtectedRoute><PublicProfileScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/premium" element={<ProtectedRoute><PremiumScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/premium/success" element={<ProtectedRoute><PremiumSuccessScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/advanced-stats" element={<ProtectedRoute><AdvancedStatsScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/achievements" element={<ProtectedRoute><AchievementsScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/badges" element={<ProtectedRoute><BadgesScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/history" element={<ProtectedRoute><HistoryScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/preferences" element={<ProtectedRoute><PreferencesScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/privacy" element={<ProtectedRoute><PrivacyScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/discord-connect" element={<ProtectedRoute><DiscordConnectScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/discord-bot" element={<ProtectedRoute><DiscordBotScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />

                    {/* Community & B2B Routes */}
                    <Route path="/community" element={<ProtectedRoute><CommunityScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/activity" element={<ProtectedRoute><ActivityFeedScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/friends" element={<ProtectedRoute><FriendsScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/search-players" element={<ProtectedRoute><SearchPlayersScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/tournaments" element={<ProtectedRoute><TournamentsScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/leagues" element={<ProtectedRoute><LeaguesScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/seasons" element={<ProtectedRoute><SeasonsScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/ranking" element={<ProtectedRoute><RankingScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/challenges" element={<ProtectedRoute><ChallengesScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/share" element={<ProtectedRoute><ShareScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/streamer-dashboard" element={<ProtectedRoute><StreamerDashboardScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/organization" element={<ProtectedRoute><OrganizationScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/api-docs" element={<ProtectedRoute><ApiDocsScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/plugins" element={<ProtectedRoute><PluginsScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/webhooks" element={<ProtectedRoute><WebhooksScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/esport-integrations" element={<ProtectedRoute><EsportIntegrationsScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />
                    <Route path="/intelligence" element={<ProtectedRoute><IntelligenceScreen onNavigate={handleNavigate} showToast={showToast} /></ProtectedRoute>} />

                    {/* Screenshots Route */}
                    <Route path="/screenshots" element={<ScreenshotGalleryScreen onNavigate={handleNavigate} showToast={showToast} />} />

                    {/* OAuth Callback Route */}
                    <Route path="/oauth/callback" element={<OAuthCallbackScreen showToast={showToast} />} />

                    <Route path="*" element={<Navigate to="/home" replace />} />
                  </Routes>
                </motion.div>
            </Suspense>
          </div>

          {showMainNav && isMobile && (
            <BottomNav
              onCommandOpen={openCommand}
              isMobile={isMobile}
            />
          )}
        </div>

        <CommandPalette
          isOpen={isCommandOpen}
          onClose={closeCommand}
        />

        <PerformanceDebugPanel />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system">
        <TranslationProvider>
          <BrowserRouter>
            <AuthProvider>
              <UserProvider>
                <SubscriptionProvider>
                  <ToastProvider>
                    <SquadsProvider>
                    <SessionsProvider>
                      <NotificationsProvider>
                        <MessagesProvider>
                          <FriendsProvider>
                            <AppContent />
                          </FriendsProvider>
                        </MessagesProvider>
                      </NotificationsProvider>
                    </SessionsProvider>
                    </SquadsProvider>
                  </ToastProvider>
                </SubscriptionProvider>
              </UserProvider>
            </AuthProvider>
          </BrowserRouter>
        </TranslationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}