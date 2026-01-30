import { useState, useRef, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Download, ChevronLeft, ChevronRight, Grid3x3, Camera, Sparkles, Image } from 'lucide-react';
import * as domtoimage from 'dom-to-image-more';
import { ScreenWrapper } from '@/app/components/ScreenWrapper';

// Import all screens
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
import { AcademyScreen } from './AcademyScreen';
import { ApiDocsScreen } from './ApiDocsScreen';
import { AutoCoachingScreen } from './AutoCoachingScreen';
import { AvailabilityHeatmapScreen } from './AvailabilityHeatmapScreen';
import { CalendarSyncScreen } from './CalendarSyncScreen';
import { CoachingToolsScreen } from './CoachingToolsScreen';
import { DiscordBotScreen } from './DiscordBotScreen';
import { EsportIntegrationsScreen } from './EsportIntegrationsScreen';
import { EsportTeamScreen } from './EsportTeamScreen';
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

interface ScreenshotGalleryScreenProps {
  onNavigate?: (screen: string) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
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

// Static version of SplashScreen for screenshots (no animations, no auto-hide)
function SplashScreenStatic() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo minimaliste */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/30" />

        {/* Brand name */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Squad Planner
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Organize • Play • Win
          </p>
        </div>

        {/* Progress bar at 60% */}
        <div className="w-48">
          <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
              style={{ width: '60%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ScreenshotGalleryScreen({ showToast }: ScreenshotGalleryScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('grid');
  const [isCapturing, setIsCapturing] = useState(false);
  const screenRef = useRef<HTMLDivElement>(null);

  // All screens organized by categories
  const screensByCategory = [
    {
      name: 'Authentification',
      color: 'from-blue-500 to-blue-600',
      screens: [
        { name: 'Splash', route: '/', component: SplashScreenStatic },
        { name: 'Login', route: '/login', component: LoginScreen },
        { name: 'Signup', route: '/signup', component: SignupScreen },
      ]
    },
    {
      name: 'Navigation principale',
      color: 'from-amber-500 to-amber-600',
      screens: [
        { name: 'Home', route: '/home', component: HomeScreen },
        { name: 'Squads', route: '/squads', component: SquadsScreen },
        { name: 'Sessions', route: '/sessions', component: SessionsScreen },
        { name: 'Profile', route: '/profile', component: ProfileScreen },
      ]
    },
    {
      name: 'Gestion des Squads',
      color: 'from-purple-500 to-purple-600',
      screens: [
        { name: 'Create Squad', route: '/create-squad', component: CreateSquadScreen },
        { name: 'Join Squad', route: '/join-squad', component: JoinSquadScreen },
        { name: 'Squad Detail', route: '/squad/:id', component: SquadDetailScreen },
        { name: 'Squad Chat', route: '/squad/:id/chat', component: SquadChatScreen },
        { name: 'Squad Settings', route: '/squad/:id/settings', component: SquadManagementScreen },
        { name: 'Squad Composition', route: '/squad/:id/composition', component: SquadCompositionScreen },
        { name: 'Squad Health', route: '/squad/:id/health', component: SquadHealthScreen },
      ]
    },
    {
      name: 'Sessions',
      color: 'from-teal-500 to-teal-600',
      screens: [
        { name: 'Propose Session', route: '/propose-session', component: ProposeSessionScreen },
        { name: 'Vote Session', route: '/vote-session', component: VoteSessionScreen },
        { name: 'Recurring Session', route: '/recurring-session', component: RecurringSessionScreen },
        { name: 'Check-in', route: '/check-in', component: CheckInScreen },
      ]
    },
    {
      name: 'Profil & Stats',
      color: 'from-pink-500 to-pink-600',
      screens: [
        { name: 'Edit Profile', route: '/profile/edit', component: EditProfileScreen },
        { name: 'Public Profile', route: '/profile/:id', component: PublicProfileScreen },
        { name: 'Achievements', route: '/achievements', component: AchievementsScreen },
        { name: 'Advanced Stats', route: '/stats', component: AdvancedStatsScreen },
        { name: 'Badges', route: '/badges', component: BadgesScreen },
        { name: 'History', route: '/history', component: HistoryScreen },
      ]
    },
    {
      name: 'Social',
      color: 'from-green-500 to-green-600',
      screens: [
        { name: 'Friends', route: '/friends', component: FriendsScreen },
        { name: 'Search Players', route: '/search', component: SearchPlayersScreen },
        { name: 'Discover Squads', route: '/discover', component: DiscoverSquadsScreen },
        { name: 'Community', route: '/community', component: CommunityScreen },
        { name: 'Activity Feed', route: '/activity', component: ActivityFeedScreen },
      ]
    },
    {
      name: 'Compétition',
      color: 'from-yellow-500 to-yellow-600',
      screens: [
        { name: 'Leaderboard', route: '/leaderboard', component: LeaderboardScreen },
        { name: 'Challenges', route: '/challenges', component: ChallengesScreen },
        { name: 'Tournaments', route: '/tournaments', component: TournamentsScreen },
        { name: 'Ranking', route: '/ranking', component: RankingScreen },
        { name: 'Leagues', route: '/leagues', component: LeaguesScreen },
        { name: 'Seasons', route: '/seasons', component: SeasonsScreen },
      ]
    },
    {
      name: 'Académie & Coaching',
      color: 'from-indigo-500 to-indigo-600',
      screens: [
        { name: 'Academy', route: '/academy', component: AcademyScreen },
        { name: 'Auto Coaching', route: '/auto-coaching', component: AutoCoachingScreen },
        { name: 'Coaching Tools', route: '/coaching-tools', component: CoachingToolsScreen },
        { name: 'Leadership Analysis', route: '/leadership-analysis', component: LeadershipAnalysisScreen },
      ]
    },
    {
      name: 'Intégrations',
      color: 'from-cyan-500 to-cyan-600',
      screens: [
        { name: 'Integrations', route: '/integrations', component: IntegrationsScreen },
        { name: 'Calendar Sync', route: '/calendar-sync', component: CalendarSyncScreen },
        { name: 'Discord Bot', route: '/discord-bot', component: DiscordBotScreen },
        { name: 'Esport Integrations', route: '/esport-integrations', component: EsportIntegrationsScreen },
      ]
    },
    {
      name: 'Intelligence & IA',
      color: 'from-violet-500 to-violet-600',
      screens: [
        { name: 'Intelligence', route: '/intelligence', component: IntelligenceScreen },
        { name: 'Smart Suggestions', route: '/smart-suggestions', component: SmartSuggestionsScreen },
        { name: 'Availability Heatmap', route: '/availability-heatmap', component: AvailabilityHeatmapScreen },
      ]
    },
    {
      name: 'Pro & Business',
      color: 'from-slate-500 to-slate-600',
      screens: [
        { name: 'Esport Team', route: '/esport-team', component: EsportTeamScreen },
        { name: 'Organization', route: '/organization', component: OrganizationScreen },
        { name: 'Streamer Dashboard', route: '/streamer-dashboard', component: StreamerDashboardScreen },
      ]
    },
    {
      name: 'Paramètres & Préférences',
      color: 'from-gray-500 to-gray-600',
      screens: [
        { name: 'Preferences', route: '/preferences', component: PreferencesScreen },
        { name: 'Notifications', route: '/notifications', component: NotificationsScreen },
        { name: 'Notification Settings', route: '/notification-settings', component: NotificationSettingsScreen },
        { name: 'Privacy', route: '/privacy', component: PrivacyScreen },
      ]
    },
    {
      name: 'Développeurs & Avancé',
      color: 'from-orange-500 to-orange-600',
      screens: [
        { name: 'API Docs', route: '/api-docs', component: ApiDocsScreen },
        { name: 'Plugins', route: '/plugins', component: PluginsScreen },
        { name: 'Test Setup', route: '/test-setup', component: TestSetupScreen },
        { name: 'QA Tests', route: '/qa-tests', component: QATestsScreen },
      ]
    },
    {
      name: 'Autres',
      color: 'from-rose-500 to-rose-600',
      screens: [
        { name: 'Premium', route: '/premium', component: PremiumScreen },
        { name: 'Share', route: '/share', component: ShareScreen },
        { name: 'Weekly Recap', route: '/weekly-recap', component: WeeklyRecapScreen },
      ]
    },
  ];

  // Flatten all screens for navigation
  const allScreens: any[] = screensByCategory.flatMap(category => (category as any).screens);
  const currentScreen = allScreens[currentIndex] as any;

  const handleDownload = async () => {
    if (!screenRef.current) return;

    setIsCapturing(true);
    showToast?.('Génération du screenshot...', 'info');

    try {
      const node = screenRef.current;
      if (!node) return;

      await new Promise(resolve => setTimeout(resolve, 500));

      const styleSheet = document.createElement('style');
      styleSheet.id = 'screenshot-hide-scrollbars';
      styleSheet.textContent = `
        * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        *::-webkit-scrollbar {
          display: none !important;
        }
        [data-screenshot-hide] {
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `;
      document.head.appendChild(styleSheet);

      const scrollableElements = node.querySelectorAll('*');
      const scrollStates: Array<{
        element: Element;
        scrollTop: number;
        scrollLeft: number;
        overflow: string;
        overflowX: string;
        overflowY: string;
        height: string;
        maxHeight: string;
      }> = [];

      scrollableElements.forEach((el) => {
        const element = el as HTMLElement;
        const computedStyle = window.getComputedStyle(element);
        const hasScrollY = computedStyle.overflowY === 'auto' ||
                          computedStyle.overflowY === 'scroll' ||
                          element.scrollHeight > element.clientHeight;

        if (hasScrollY || element.scrollTop > 0) {
          scrollStates.push({
            element: element,
            scrollTop: element.scrollTop,
            scrollLeft: element.scrollLeft,
            overflow: element.style.overflow,
            overflowX: element.style.overflowX,
            overflowY: element.style.overflowY,
            height: element.style.height,
            maxHeight: element.style.maxHeight,
          });

          element.style.overflowY = 'visible';
          element.style.overflowX = 'hidden';
          element.style.maxHeight = 'none';
          if (element.scrollHeight > element.clientHeight) {
            element.style.height = `${element.scrollHeight}px`;
          }
        }
      });

      const contentHeight = Math.max(node.scrollHeight, 844);

      const dataUrl = await domtoimage.toPng(node, {
        width: 390,
        height: contentHeight,
        quality: 1,
        style: {
          backgroundColor: '#F5F3F0',
          transform: 'scale(1)',
          overflow: 'hidden',
        },
      });

      scrollStates.forEach(({ element, scrollTop, scrollLeft, overflow, overflowX, overflowY, height, maxHeight }) => {
        (element as HTMLElement).style.overflow = overflow;
        (element as HTMLElement).style.overflowX = overflowX;
        (element as HTMLElement).style.overflowY = overflowY;
        (element as HTMLElement).style.height = height;
        (element as HTMLElement).style.maxHeight = maxHeight;
        element.scrollTop = scrollTop;
        element.scrollLeft = scrollLeft;
      });

      const hiddenStyleSheet = document.getElementById('screenshot-hide-scrollbars');
      if (hiddenStyleSheet) {
        hiddenStyleSheet.remove();
      }

      const blob = await fetch(dataUrl).then(res => res.blob());
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const fileName = `${currentScreen.name.toLowerCase().replace(/\s+/g, '-')}-screenshot.png`;
      link.download = fileName;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      showToast?.(`Screenshot "${currentScreen.name}" téléchargé !`, 'success');
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      showToast?.('Erreur lors de la capture', 'error');
    } finally {
      setIsCapturing(false);
    }
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allScreens.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + allScreens.length) % allScreens.length);
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <motion.div
        className="relative z-20 bg-gradient-to-br from-emerald-500 to-teal-600 text-white py-8 px-4 shadow-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Camera className="w-8 h-8 text-white" strokeWidth={2} />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold">Galerie Screenshots</h1>
            <p className="text-white/90 font-medium">
              {allScreens.length} écrans • Mode {viewMode === 'grid' ? 'Grille' : 'Capture'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/50 py-3 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex items-center gap-2 min-w-[100px]">
            <motion.button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Grid3x3 className="w-4 h-4" />
              Grille
            </motion.button>
          </div>

          {/* Center - Navigation (only in single mode) */}
          <div className="flex items-center gap-2 min-w-[180px] justify-center">
            {viewMode === 'single' && (
              <>
                <motion.button
                  onClick={goToPrevious}
                  className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:shadow-md transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </motion.button>
                <span className="text-sm font-bold text-gray-700 px-4 whitespace-nowrap">
                  {currentIndex + 1} / {allScreens.length}
                </span>
                <motion.button
                  onClick={goToNext}
                  className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:shadow-md transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </motion.button>
              </>
            )}
          </div>

          {/* Right side - Download button (only in single mode) */}
          <div className="flex items-center gap-2 min-w-[180px] justify-end">
            {viewMode === 'single' && (
              <motion.button
                onClick={handleDownload}
                disabled={isCapturing}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-amber-500/30 hover:shadow-xl transition-all disabled:opacity-50"
                whileHover={{ scale: isCapturing ? 1 : 1.02 }}
                whileTap={{ scale: isCapturing ? 1 : 0.98 }}
              >
                <Download className="w-4 h-4" />
                {isCapturing ? 'Capture...' : 'Télécharger PNG'}
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {viewMode === 'grid' ? (
          /* Grid View with Categories */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            {screensByCategory.map((category, categoryIndex) => (
              <motion.div key={categoryIndex} variants={itemVariants}>
                {/* Category Header */}
                <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${category.color} text-white px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-lg`}>
                  {category.name}
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {category.screens.length}
                  </span>
                </div>

                {/* Screens Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {category.screens.map((screen) => {
                    const globalIndex = allScreens.findIndex(s => s.route === screen.route);
                    return (
                      <motion.div
                        key={screen.route}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                        onClick={() => {
                          setCurrentIndex(globalIndex);
                          setViewMode('single');
                        }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="aspect-[9/16] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-3 border border-gray-200 flex items-center justify-center">
                          <Image className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
                        </div>
                        <h3 className="font-bold text-sm text-gray-800 truncate">{screen.name}</h3>
                        <p className="text-xs text-gray-500 truncate font-medium">{screen.route}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Single Screen View */
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-md mx-auto"
          >
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/50 shadow-lg"
              variants={itemVariants}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                  <Sparkles className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{currentScreen.name}</h2>
                  <p className="text-sm text-gray-500 font-medium">{currentScreen.route}</p>
                </div>
              </div>
            </motion.div>

            {/* Screen Preview */}
            <div className="relative">
              {/* Visual mockup frame - not captured */}
              <div className="w-[406px] h-[860px] mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3rem] shadow-2xl p-2">
                {/* Actual screen content - this is what gets captured at 390x844 */}
                <div
                  ref={screenRef}
                  className="w-[390px] h-[844px] bg-gray-100 rounded-[2.5rem] overflow-hidden"
                >
                  <Suspense
                    fallback={
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                        <div className="text-center">
                          <motion.div
                            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto mb-4 flex items-center justify-center shadow-lg"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="w-8 h-8 text-white" strokeWidth={2} />
                          </motion.div>
                          <p className="text-gray-500 font-medium">Chargement...</p>
                        </div>
                      </div>
                    }
                  >
                    <div className="w-full h-full overflow-x-hidden">
                      <ScreenWrapper component={currentScreen.component} route={currentScreen.route} />
                    </div>
                  </Suspense>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
