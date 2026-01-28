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
import { ToastProvider, useToast } from '@/app/components/Toast';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';

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
const DesignDocScreen = lazy(() => import('@/app/screens/DesignDocScreen')) as any;
const ScreenshotGalleryScreen = lazy(() => import('@/app/screens/ScreenshotGalleryScreen')) as any;
const OAuthCallbackScreen = lazy(() => import('@/app/screens/OAuthCallbackScreen')) as any;
const InviteMemberScreen = lazy(() => import('@/app/screens/InviteMemberScreen')) as any;

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

// TEMPORARY: Bypass auth for development - must match AuthContext and ProtectedRoute
const BYPASS_AUTH = true;

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, signOut, loading: authLoading } = useAuth();
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center">
          <Logo className="w-16 h-16 mx-auto mb-4" variant="full" />
          <div className="text-[var(--fg-secondary)] text-sm">Chargement...</div>
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

      <div className="min-h-screen text-[var(--fg-primary)] relative overflow-x-hidden bg-[var(--bg-base)]">
        {/* FOND PREMIUM */}
        <div 
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `
              radial-gradient(at 0% 0%, rgba(245, 158, 11, 0.12) 0px, transparent 50%),
              radial-gradient(at 100% 100%, rgba(20, 184, 166, 0.10) 0px, transparent 50%),
              repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(120, 113, 108, 0.04) 2px, rgba(120, 113, 108, 0.04) 4px),
              repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(120, 113, 108, 0.04) 2px, rgba(120, 113, 108, 0.04) 4px)
            `,
          }}
        />

        <div className="fixed inset-0 gradient-mesh pointer-events-none opacity-30" />

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

        {!(isDesktop && isAuthenticated && showMainNav) && (
          <motion.div
            className="fixed top-6 left-4 z-[var(--z-sticky)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Logo variant="header" />
          </motion.div>
        )}

        {!(isDesktop && isAuthenticated && showMainNav) && (
          <div className="fixed top-4 right-4 z-[var(--z-sticky)]">
            <LanguageSwitcher />
          </div>
        )}

        <div className={`
          min-h-screen relative mx-auto
          ${isDesktop && isAuthenticated && showMainNav 
            ? 'ml-72 pt-16 max-w-5xl px-6' 
            : 'max-w-md px-4'}
        `}>
          {isMobile && <div className="h-11" />}

          <div className={isDesktop && isAuthenticated && showMainNav ? 'px-6' : ''}>
            <Suspense fallback={<ScreenLoader />}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: animConfig.complexEnabled ? 4 : 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: animConfig.complexEnabled ? -4 : 0 }}
                  transition={animConfig.pageTransition}
                  style={{ willChange: 'opacity, transform' }}
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

                    {/* Design & Development Routes */}
                    <Route path="/design-doc" element={<DesignDocScreen onNavigate={handleNavigate} showToast={showToast} />} />
                    <Route path="/screenshots" element={<ScreenshotGalleryScreen onNavigate={handleNavigate} showToast={showToast} />} />

                    {/* OAuth Callback Route */}
                    <Route path="/oauth/callback" element={<OAuthCallbackScreen showToast={showToast} />} />

                    <Route path="*" element={<Navigate to="/home" replace />} />
                  </Routes>
                </motion.div>
              </AnimatePresence>
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
      <TranslationProvider>
        <BrowserRouter>
          <AuthProvider>
            <UserProvider>
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
            </UserProvider>
          </AuthProvider>
        </BrowserRouter>
      </TranslationProvider>
    </ErrorBoundary>
  );
}