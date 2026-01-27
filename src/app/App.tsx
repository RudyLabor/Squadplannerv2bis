import { Suspense, lazy, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAnimationConfig } from '@/utils/device';
import { TranslationProvider } from '@/i18n/useTranslation';
import { AuthProvider } from '@/app/contexts/AuthContext';
import { UserProvider } from '@/app/contexts/UserContext';

// Debug utility
import { debugAuth } from '@/utils/auth-debug';

// Components
import { Logo } from '@/app/components/Logo';
import { BottomNav } from '@/app/components/BottomNav';
import { DesktopSidebar } from '@/app/components/DesktopSidebar';
import { DesktopHeader } from '@/app/components/DesktopHeader';
import { CommandPalette } from '@/app/components/CommandPalette';
import { ToastContainer, useToast } from '@/app/components/ui/Toast';
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
  console.log('🔍 Debug utility loaded. Run debugAuth() in console to diagnose auth issues.');
}

// Lazy load screens for better performance
const LoginScreen = lazy(() => import('@/app/screens/LoginScreen'));
const SignupScreen = lazy(() => import('@/app/screens/SignupScreen'));
const HomeScreen = lazy(() => import('@/app/screens/HomeScreen'));
const SquadsScreen = lazy(() => import('@/app/screens/SquadsScreen'));
const SquadDetailScreen = lazy(() => import('@/app/screens/SquadDetailScreen'));
const SessionsScreen = lazy(() => import('@/app/screens/SessionsScreen'));
const ProfileScreen = lazy(() => import('@/app/screens/ProfileScreen'));
const EditProfileScreen = lazy(() => import('@/app/screens/EditProfileScreen'));
const ProposeSessionScreen = lazy(() => import('@/app/screens/ProposeSessionScreen'));
const CreateSquadScreen = lazy(() => import('@/app/screens/CreateSquadScreen'));
const FeaturesDemoScreen = lazy(() => import('@/app/screens/FeaturesDemoScreen'));
const IntegrationsScreen = lazy(() => import('@/app/screens/IntegrationsScreen'));
const JoinSquadScreen = lazy(() => import('@/app/screens/JoinSquadScreen'));
const VoteSessionScreen = lazy(() => import('@/app/screens/VoteSessionScreen'));
const CheckInScreen = lazy(() => import('@/app/screens/CheckInScreen'));
const SquadChatScreen = lazy(() => import('@/app/screens/SquadChatScreen'));
const DiscordBotScreen = lazy(() => import('@/app/screens/DiscordBotScreen'));
const CoachingToolsScreen = lazy(() => import('@/app/screens/CoachingToolsScreen'));
const NotificationSettingsScreen = lazy(() => import('@/app/screens/NotificationSettingsScreen'));
const SmartSuggestionsScreen = lazy(() => import('@/app/screens/SmartSuggestionsScreen'));
const NotificationsScreen = lazy(() => import('@/app/screens/NotificationsScreen'));
const AvailabilityHeatmapScreen = lazy(() => import('@/app/screens/AvailabilityHeatmapScreen'));
const TestSetupScreen = lazy(() => import('@/app/screens/TestSetupScreen'));
const QATestsScreen = lazy(() => import('@/app/screens/QATestsScreen'));
const PremiumScreen = lazy(() => import('@/app/screens/PremiumScreen'));
const AdvancedStatsScreen = lazy(() => import('@/app/screens/AdvancedStatsScreen'));
const CalendarSyncScreen = lazy(() => import('@/app/screens/CalendarSyncScreen'));
const IntelligenceScreen = lazy(() => import('@/app/screens/IntelligenceScreen'));
const SquadHealthScreen = lazy(() => import('@/app/screens/SquadHealthScreen'));
const RecurringSessionScreen = lazy(() => import('@/app/screens/RecurringSessionScreen'));
const WeeklyRecapScreen = lazy(() => import('@/app/screens/WeeklyRecapScreen'));
const PrivacyScreen = lazy(() => import('@/app/screens/PrivacyScreen'));
const PreferencesScreen = lazy(() => import('@/app/screens/PreferencesScreen'));
const DiscordConnectScreen = lazy(() => import('@/app/screens/DiscordConnectScreen'));

// ROADMAP #2 - Social + Compétition
const LeaderboardScreen = lazy(() => import('@/app/screens/LeaderboardScreen'));
const AchievementsScreen = lazy(() => import('@/app/screens/AchievementsScreen'));
const FriendsScreen = lazy(() => import('@/app/screens/FriendsScreen'));
const ActivityFeedScreen = lazy(() => import('@/app/screens/ActivityFeedScreen'));
const PublicProfileScreen = lazy(() => import('@/app/screens/PublicProfileScreen'));
const BadgesScreen = lazy(() => import('@/app/screens/BadgesScreen'));
const TournamentsScreen = lazy(() => import('@/app/screens/TournamentsScreen'));
const SearchPlayersScreen = lazy(() => import('@/app/screens/SearchPlayersScreen'));
const DiscoverSquadsScreen = lazy(() => import('@/app/screens/DiscoverSquadsScreen'));
const ChallengesScreen = lazy(() => import('@/app/screens/ChallengesScreen'));
const RankingScreen = lazy(() => import('@/app/screens/RankingScreen'));
const ShareScreen = lazy(() => import('@/app/screens/ShareScreen'));

// ROADMAP #3 - Écosystème + IA + Communauté + B2B
const ApiDocsScreen = lazy(() => import('@/app/screens/ApiDocsScreen'));
const PluginsScreen = lazy(() => import('@/app/screens/PluginsScreen'));
const WebhooksScreen = lazy(() => import('@/app/screens/WebhooksScreen'));
const EsportIntegrationsScreen = lazy(() => import('@/app/screens/EsportIntegrationsScreen'));
const SquadCompositionScreen = lazy(() => import('@/app/screens/SquadCompositionScreen'));
const LeadershipAnalysisScreen = lazy(() => import('@/app/screens/LeadershipAnalysisScreen'));
const SquadManagementScreen = lazy(() => import('@/app/screens/SquadManagementScreen'));
const CommunityScreen = lazy(() => import('@/app/screens/CommunityScreen'));
const LeaguesScreen = lazy(() => import('@/app/screens/LeaguesScreen'));
const SeasonsScreen = lazy(() => import('@/app/screens/SeasonsScreen'));
const HistoryScreen = lazy(() => import('@/app/screens/HistoryScreen'));
const AutoCoachingScreen = lazy(() => import('@/app/screens/AutoCoachingScreen'));
const EsportTeamScreen = lazy(() => import('@/app/screens/EsportTeamScreen'));
const AcademyScreen = lazy(() => import('@/app/screens/AcademyScreen'));
const StreamerDashboardScreen = lazy(() => import('@/app/screens/StreamerDashboardScreen'));
const OrganizationScreen = lazy(() => import('@/app/screens/OrganizationScreen'));

// Design Documentation
const DesignDocScreen = lazy(() => import('@/app/screens/DesignDocScreen'));
const ScreenshotGalleryScreen = lazy(() => import('@/app/screens/ScreenshotGalleryScreen'));

// Loading fallback
function ScreenLoader() {
  return (
    <div className="min-h-screen pb-24 px-4 pt-safe space-y-4">
      <div className="py-6">
        <Skeleton className="w-[200px] h-8 mb-2" />
        <Skeleton className="w-[150px] h-5" />
      </div>
      <Skeleton className="w-full h-[200px]" />
      <Skeleton className="w-full h-[150px]" />
      <Skeleton className="w-full h-[150px]" />
    </div>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentScreen, setCurrentScreen] = useState<{ name: string; data?: any }>({ name: 'login' });
  const [showSplash, setShowSplash] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [isPremium, setIsPremium] = useState(false);

  const { isOpen: isCommandOpen, open: openCommand, close: closeCommand } = useCommandPalette();
  const { toasts, showToast, closeToast } = useToast();
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();
  const { user, isAuthenticated, signOut, isLoading: authLoading } = useAuth();
  const { userProfile } = useUser(); // ✨ Get user profile for premium status
  
  // ⚠️ IMPORTANT: ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURN
  const animConfig = useAnimationConfig();

  // Handle OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    const error = params.get('error');

    if (success) {
      showToast(`${success === 'google' ? 'Google Calendar' : success.charAt(0).toUpperCase() + success.slice(1)} connecté avec succès !`, 'success');
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
      // Navigate to integrations if not already there
      if (currentScreen.name !== 'integrations') {
        setCurrentScreen({ name: 'integrations' });
      }
    } else if (error) {
      let errorMessage = 'Erreur lors de la connexion';
      switch (error) {
        case 'missing_params':
          errorMessage = 'Paramètres OAuth manquants';
          break;
        case 'invalid_state':
          errorMessage = 'Session OAuth invalide';
          break;
        case 'token_exchange_failed':
          errorMessage = 'Échec de l\'échange de token';
          break;
        case 'user_info_failed':
          errorMessage = 'Impossible de récupérer les informations utilisateur';
          break;
        case 'server_error':
          errorMessage = 'Erreur serveur';
          break;
      }
      showToast(errorMessage, 'error');
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Sync authentication state with navigation
  useEffect(() => {
    console.log('🔄 Auth sync - Loading:', authLoading, 'Authenticated:', isAuthenticated, 'Screen:', currentScreen.name);
    
    if (!authLoading) {
      if (isAuthenticated && user) {
        console.log('✅ User authenticated:', user.id);
        // User is authenticated, redirect to home if on login/signup
        if (currentScreen.name === 'login' || currentScreen.name === 'signup') {
          console.log('📍 Redirecting to home from', currentScreen.name);
          setCurrentScreen({ name: 'home' });
          setActiveTab('home');
        }
        // Update user info
        setUserEmail(user.email || '');
        setUserName(user.email?.split('@')[0] || '');
        setIsPremium(userProfile?.isPremium || false); // ✨ Get premium from backend
      } else {
        console.log('⚠️ User not authenticated');
        // User is not authenticated, redirect to login
        if (currentScreen.name !== 'login' && currentScreen.name !== 'signup') {
          console.log('📍 Redirecting to login from', currentScreen.name);
          setCurrentScreen({ name: 'login' });
        }
      }
    }
  }, [isAuthenticated, user, authLoading, currentScreen.name, userProfile]);
  
  // 🔒 Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center">
          <Logo className="w-16 h-16 mx-auto mb-4" />
          <div className="text-[var(--fg-secondary)] text-sm">Chargement...</div>
        </div>
      </div>
    );
  }

  const handleLogin = (email: string, premium: boolean) => {
    setUserEmail(email);
    setUserName(email.split('@')[0]);
    setIsPremium(premium);
    // Don't need to manually set authentication - AuthContext handles it
  };

  const handleSignup = (email: string, name: string, premium: boolean) => {
    setUserEmail(email);
    setUserName(name);
    setIsPremium(premium);
    // Don't need to manually set authentication - AuthContext handles it
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUserEmail('');
      setUserName('');
      setIsPremium(false);
      setCurrentScreen({ name: 'login' });
      showToast('Déconnexion réussie', 'success');
    } catch (error: any) {
      showToast('Erreur lors de la déconnexion', 'error');
    }
  };

  const handleNavigate = (screen: string, data?: any) => {
    setCurrentScreen({ name: screen, data });
    if (['home', 'squads', 'sessions', 'profile'].includes(screen)) {
      setActiveTab(screen);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentScreen({ name: tab });
  };

  const showMainNav = ['home', 'squads', 'sessions', 'profile'].includes(currentScreen.name);

  return (
    <div className="relative min-h-screen">
      {/* Splash Screen - Hide on login/signup */}
      <AnimatePresence>
        {showSplash && currentScreen.name !== 'login' && currentScreen.name !== 'signup' && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      <div className="min-h-screen text-[var(--fg-primary)] relative overflow-x-hidden bg-[var(--bg-base)]">
        {/* FOND PREMIUM - Texture grille subtile partout */}
        <div 
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `
              radial-gradient(at 0% 0%, rgba(245, 158, 11, 0.12) 0px, transparent 50%),
              radial-gradient(at 100% 100%, rgba(20, 184, 166, 0.10) 0px, transparent 50%),
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(120, 113, 108, 0.04) 2px,
                rgba(120, 113, 108, 0.04) 4px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(120, 113, 108, 0.04) 2px,
                rgba(120, 113, 108, 0.04) 4px
              )
            `,
          }}
        />

        {/* Ambient background effects - ULTRA SUBTIL */}
        <div className="fixed inset-0 gradient-mesh pointer-events-none opacity-30" />

        {/* Subtle glow cursor effect - Desktop only */}
        {isDesktop && (
          <div className="fixed inset-0 pointer-events-none z-50">
            <div className="absolute inset-0" id="cursor-glow" />
          </div>
        )}

        {/* Desktop Sidebar - Only show when authenticated and on desktop */}
        {isDesktop && isAuthenticated && showMainNav && (
          <DesktopSidebar
            activeTab={activeTab}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            userName={userName}
            isPremium={isPremium}
          />
        )}

        {/* Desktop Header - Only show when authenticated and on desktop */}
        {isDesktop && isAuthenticated && showMainNav && (
          <DesktopHeader onCommandOpen={openCommand} />
        )}

        {/* Header with Logo - Top Left - ÉPURÉ - Hide on desktop when sidebar is shown */}
        {!(isDesktop && isAuthenticated && showMainNav) && (
          <motion.div
            className="fixed top-6 left-4 z-[var(--z-sticky)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Logo variant="header" onNavigate={handleNavigate} />
          </motion.div>
        )}

        {/* Language Switcher - Top Right - Only show when not desktop with header */}
        {!(isDesktop && isAuthenticated && showMainNav) && (
          <div className="fixed top-4 right-4 z-[var(--z-sticky)]">
            <LanguageSwitcher />
          </div>
        )}

        {/* Main Container - Responsive with sidebar offset on desktop */}
        <div className={`
          ${isMobile ? 'max-w-md mx-auto' : ''}
          ${isDesktop && isAuthenticated && showMainNav ? 'ml-72 pt-16' : ''}
          ${isDesktop && !(isAuthenticated && showMainNav) ? 'max-w-6xl mx-auto' : ''}
          min-h-screen relative
        `}>
          {/* Status Bar Spacer - Mobile only */}
          {isMobile && <div className="h-11" />}

          {/* Desktop Content Padding */}
          <div className={isDesktop && isAuthenticated && showMainNav ? 'p-8' : ''}>
            {/* Screen Content with transitions - OPTIMIZED FOR MOBILE */}
            <Suspense fallback={<ScreenLoader />}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentScreen.name}
                  initial={{ opacity: 0, y: animConfig.complexEnabled ? 4 : 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: animConfig.complexEnabled ? -4 : 0 }}
                  transition={animConfig.pageTransition}
                  style={{ willChange: 'opacity, transform' }}
                >
                  {currentScreen.name === 'home' && <HomeScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'squads' && <SquadsScreen onNavigate={handleNavigate} />}
                  {currentScreen.name === 'squad-detail' && <SquadDetailScreen onNavigate={handleNavigate} showToast={showToast} data={currentScreen.data} />}
                  {currentScreen.name === 'sessions' && <SessionsScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'profile' && <ProfileScreen onNavigate={handleNavigate} showToast={showToast} onLogout={handleLogout} userEmail={userEmail} userName={userName} isPremium={isPremium} />}
                  {currentScreen.name === 'edit-profile' && <EditProfileScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'propose-session' && <ProposeSessionScreen onNavigate={handleNavigate} showToast={showToast} data={currentScreen.data} />}
                  {currentScreen.name === 'create-session' && <ProposeSessionScreen onNavigate={handleNavigate} showToast={showToast} data={currentScreen.data} />}
                  {currentScreen.name === 'create-squad' && <CreateSquadScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'features-demo' && <FeaturesDemoScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'integrations' && <IntegrationsScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'join-squad' && <JoinSquadScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'vote-session' && <VoteSessionScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'check-in' && <CheckInScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'squad-chat' && <SquadChatScreen onNavigate={handleNavigate} showToast={showToast} data={currentScreen.data} />}
                  {currentScreen.name === 'discord-bot' && <DiscordBotScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'discord-connect' && <DiscordConnectScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'coaching-tools' && <CoachingToolsScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'login' && <LoginScreen onNavigate={handleNavigate} showToast={showToast} onLogin={handleLogin} />}
                  {currentScreen.name === 'signup' && <SignupScreen onNavigate={handleNavigate} showToast={showToast} onSignup={handleSignup} />}
                  {currentScreen.name === 'notification-settings' && <NotificationSettingsScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'smart-suggestions' && <SmartSuggestionsScreen onNavigate={handleNavigate} showToast={showToast} data={currentScreen.data} />}
                  {currentScreen.name === 'notifications' && <NotificationsScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'availability-heatmap' && <AvailabilityHeatmapScreen onNavigate={handleNavigate} showToast={showToast} data={currentScreen.data} />}
                  {currentScreen.name === 'test-setup' && <TestSetupScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'qa-tests' && <QATestsScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'premium' && <PremiumScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'advanced-stats' && <AdvancedStatsScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'calendar-sync' && <CalendarSyncScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'intelligence' && <IntelligenceScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'squad-health' && <SquadHealthScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'recurring-session' && <RecurringSessionScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'weekly-recap' && <WeeklyRecapScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'privacy' && <PrivacyScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'preferences' && <PreferencesScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'leaderboard' && <LeaderboardScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'achievements' && <AchievementsScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'friends' && <FriendsScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'activity-feed' && <ActivityFeedScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'public-profile' && <PublicProfileScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'badges' && <BadgesScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'tournaments' && <TournamentsScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'search-players' && <SearchPlayersScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'discover-squads' && <DiscoverSquadsScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'challenges' && <ChallengesScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'ranking' && <RankingScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'share' && <ShareScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'api-docs' && <ApiDocsScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'plugins' && <PluginsScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'webhooks' && <WebhooksScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'esport-integrations' && <EsportIntegrationsScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'squad-composition' && <SquadCompositionScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'leadership-analysis' && <LeadershipAnalysisScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'squad-management' && <SquadManagementScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'community' && <CommunityScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'leagues' && <LeaguesScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'seasons' && <SeasonsScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'history' && <HistoryScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'auto-coaching' && <AutoCoachingScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'esport-team' && <EsportTeamScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'academy' && <AcademyScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'streamer-dashboard' && <StreamerDashboardScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'organization' && <OrganizationScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'design-doc' && <DesignDocScreen onNavigate={handleNavigate} showToast={showToast} />}
                  {currentScreen.name === 'screenshot-gallery' && <ScreenshotGalleryScreen onNavigate={handleNavigate} showToast={showToast} />}
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </div>

          {/* Bottom Navigation */}
          {showMainNav && isMobile && (
            <BottomNav
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onCommandOpen={openCommand}
              isMobile={isMobile}
            />
          )}
        </div>

        {/* Command Palette - Global */}
        <CommandPalette
          isOpen={isCommandOpen}
          onClose={closeCommand}
          onNavigate={handleNavigate}
        />

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onClose={closeToast} />

        {/* Performance Debug Panel - Global */}
        <PerformanceDebugPanel />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <TranslationProvider>
      <AuthProvider>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </AuthProvider>
    </TranslationProvider>
  );
}