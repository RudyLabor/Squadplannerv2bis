import React, { useState, useRef, Suspense } from 'react';
import { motion } from 'motion/react';
import { Download, ChevronLeft, ChevronRight, Grid3x3, X } from 'lucide-react';
import * as domtoimage from 'dom-to-image-more';
import { Button } from '@/app/components/ui/Button';
import { Card } from '@/app/components/ui/Card';
import { SplashScreen } from '@/app/components/SplashScreen';
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

interface ScreenshotGalleryScreenProps {
  onNavigate?: (screen: string) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

// Static version of SplashScreen for screenshots (no animations, no auto-hide)
function SplashScreenStatic() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-base)] relative">
      {/* Background gradient */}
      <div className="gradient-mesh opacity-40" style={{ position: 'absolute', inset: 0 }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo minimaliste */}
        <div className="w-12 h-12 rounded-full bg-[var(--primary-500)]" />

        {/* Brand name */}
        <div className="text-center">
          <h1 className="text-3xl font-normal text-[var(--fg-primary)] mb-2">
            Squad Planner
          </h1>
          <p className="text-sm text-[var(--fg-tertiary)]">
            Organize • Play • Win
          </p>
        </div>

        {/* Progress bar at 60% */}
        <div className="w-48">
          <div className="h-1 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--primary-500)]"
              style={{ width: '60%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ScreenshotGalleryScreen({ onNavigate, showToast }: ScreenshotGalleryScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('grid');
  const [isCapturing, setIsCapturing] = useState(false);
  const screenRef = useRef<HTMLDivElement>(null);

  // All screens organized by categories (same as DesignDocScreen)
  const screensByCategory = [
    {
      name: '🔐 Authentification',
      color: 'from-blue-500 to-blue-600',
      screens: [
        { name: 'Splash', route: '/', component: SplashScreenStatic },
        { name: 'Login', route: '/login', component: LoginScreen },
        { name: 'Signup', route: '/signup', component: SignupScreen },
      ]
    },
    {
      name: '🏠 Navigation principale',
      color: 'from-amber-500 to-amber-600',
      screens: [
        { name: 'Home', route: '/home', component: HomeScreen },
        { name: 'Squads', route: '/squads', component: SquadsScreen },
        { name: 'Sessions', route: '/sessions', component: SessionsScreen },
        { name: 'Profile', route: '/profile', component: ProfileScreen },
      ]
    },
    {
      name: '👥 Gestion des Squads',
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
      name: '📅 Sessions',
      color: 'from-teal-500 to-teal-600',
      screens: [
        { name: 'Propose Session', route: '/propose-session', component: ProposeSessionScreen },
        { name: 'Vote Session', route: '/vote-session', component: VoteSessionScreen },
        { name: 'Recurring Session', route: '/recurring-session', component: RecurringSessionScreen },
        { name: 'Check-in', route: '/check-in', component: CheckInScreen },
      ]
    },
    {
      name: '👤 Profil & Stats',
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
      name: '🤝 Social',
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
      name: '🏆 Compétition',
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
      name: '🎓 Académie & Coaching',
      color: 'from-indigo-500 to-indigo-600',
      screens: [
        { name: 'Academy', route: '/academy', component: AcademyScreen },
        { name: 'Auto Coaching', route: '/auto-coaching', component: AutoCoachingScreen },
        { name: 'Coaching Tools', route: '/coaching-tools', component: CoachingToolsScreen },
        { name: 'Leadership Analysis', route: '/leadership-analysis', component: LeadershipAnalysisScreen },
      ]
    },
    {
      name: '🔗 Intégrations',
      color: 'from-cyan-500 to-cyan-600',
      screens: [
        { name: 'Integrations', route: '/integrations', component: IntegrationsScreen },
        { name: 'Calendar Sync', route: '/calendar-sync', component: CalendarSyncScreen },
        { name: 'Discord Bot', route: '/discord-bot', component: DiscordBotScreen },
        { name: 'Esport Integrations', route: '/esport-integrations', component: EsportIntegrationsScreen },
      ]
    },
    {
      name: '🤖 Intelligence & IA',
      color: 'from-violet-500 to-violet-600',
      screens: [
        { name: 'Intelligence', route: '/intelligence', component: IntelligenceScreen },
        { name: 'Smart Suggestions', route: '/smart-suggestions', component: SmartSuggestionsScreen },
        { name: 'Availability Heatmap', route: '/availability-heatmap', component: AvailabilityHeatmapScreen },
      ]
    },
    {
      name: '🏢 Pro & Business',
      color: 'from-slate-500 to-slate-600',
      screens: [
        { name: 'Esport Team', route: '/esport-team', component: EsportTeamScreen },
        { name: 'Organization', route: '/organization', component: OrganizationScreen },
        { name: 'Streamer Dashboard', route: '/streamer-dashboard', component: StreamerDashboardScreen },
      ]
    },
    {
      name: '⚙️ Paramètres & Préférences',
      color: 'from-gray-500 to-gray-600',
      screens: [
        { name: 'Preferences', route: '/preferences', component: PreferencesScreen },
        { name: 'Notifications', route: '/notifications', component: NotificationsScreen },
        { name: 'Notification Settings', route: '/notification-settings', component: NotificationSettingsScreen },
        { name: 'Privacy', route: '/privacy', component: PrivacyScreen },
      ]
    },
    {
      name: '🔧 Développeurs & Avancé',
      color: 'from-orange-500 to-orange-600',
      screens: [
        { name: 'API Docs', route: '/api-docs', component: ApiDocsScreen },
        { name: 'Plugins', route: '/plugins', component: PluginsScreen },
        { name: 'Features Demo', route: '/features-demo', component: FeaturesDemoScreen },
        { name: 'Test Setup', route: '/test-setup', component: TestSetupScreen },
        { name: 'QA Tests', route: '/qa-tests', component: QATestsScreen },
      ]
    },
    {
      name: '✨ Autres',
      color: 'from-rose-500 to-rose-600',
      screens: [
        { name: 'Premium', route: '/premium', component: PremiumScreen },
        { name: 'Share', route: '/share', component: ShareScreen },
        { name: 'Weekly Recap', route: '/weekly-recap', component: WeeklyRecapScreen },
      ]
    },
  ];

  // Flatten all screens for navigation
  const allScreens = screensByCategory.flatMap(category => category.screens);
  const currentScreen = allScreens[currentIndex];

  const handleDownload = async () => {
    if (!screenRef.current) return;

    setIsCapturing(true);
    showToast?.('Génération du screenshot...', 'info');

    try {
      const node = screenRef.current;
      if (!node) return;

      // Wait for rendering to complete - shorter delay since we removed animated Splash
      await new Promise(resolve => setTimeout(resolve, 500));

      // Hide scrollbars during capture
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

      // Get all scrollable elements and store their scroll positions
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
      
      // Remove overflow and scroll to capture full content
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
          
          // Temporarily disable overflow-y and expand to full height
          element.style.overflowY = 'visible';
          element.style.overflowX = 'hidden'; // Keep horizontal overflow hidden
          element.style.maxHeight = 'none';
          if (element.scrollHeight > element.clientHeight) {
            element.style.height = `${element.scrollHeight}px`;
          }
        }
      });

      // Get the actual content height (but keep width at 390px)
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

      // Restore original scroll states
      scrollStates.forEach(({ element, scrollTop, scrollLeft, overflow, overflowX, overflowY, height, maxHeight }) => {
        (element as HTMLElement).style.overflow = overflow;
        (element as HTMLElement).style.overflowX = overflowX;
        (element as HTMLElement).style.overflowY = overflowY;
        (element as HTMLElement).style.height = height;
        (element as HTMLElement).style.maxHeight = maxHeight;
        element.scrollTop = scrollTop;
        element.scrollLeft = scrollLeft;
      });

      // Remove the scrollbar hiding stylesheet
      const hiddenStyleSheet = document.getElementById('screenshot-hide-scrollbars');
      if (hiddenStyleSheet) {
        hiddenStyleSheet.remove();
      }

      // Convert to blob and download
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
    <div className="min-h-screen bg-[#F5F3F0] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#F59E0B] to-[#14B8A6] text-white py-8 px-4 relative z-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Galerie Screenshots</h1>
          <p className="text-white/90">
            {allScreens.length} écrans • Mode {viewMode === 'grid' ? 'Grille' : 'Capture'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[rgba(120,113,108,0.1)] py-3 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex items-center gap-2 min-w-[100px]">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="w-4 h-4 mr-2" />
              Grille
            </Button>
          </div>

          {/* Center - Navigation (only in single mode) */}
          <div className="flex items-center gap-2 min-w-[180px] justify-center">
            {viewMode === 'single' && (
              <>
                <Button variant="outline" size="sm" onClick={goToPrevious}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium px-4 whitespace-nowrap">
                  {currentIndex + 1} / {allScreens.length}
                </span>
                <Button variant="outline" size="sm" onClick={goToNext}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {/* Right side - Download button (only in single mode) */}
          <div className="flex items-center gap-2 min-w-[180px] justify-end">
            {viewMode === 'single' && (
              <Button
                onClick={handleDownload}
                disabled={isCapturing}
                size="sm"
                className="bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                {isCapturing ? 'Capture...' : 'Télécharger PNG'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {viewMode === 'grid' ? (
          /* Grid View with Categories */
          <div className="space-y-12">
            {screensByCategory.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                {/* Category Header */}
                <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${category.color} text-white px-4 py-2 rounded-full text-sm font-bold mb-6`}>
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
                      <Card
                        key={screen.route}
                        className="p-4 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                        onClick={() => {
                          setCurrentIndex(globalIndex);
                          setViewMode('single');
                        }}
                      >
                        <div className="aspect-[9/16] bg-[#F5F3F0] rounded-lg mb-3 border border-[rgba(120,113,108,0.1)] flex items-center justify-center text-[rgba(28,25,23,0.3)] text-xs">
                          {screen.name}
                        </div>
                        <h3 className="font-medium text-sm truncate">{screen.name}</h3>
                        <p className="text-xs text-[rgba(28,25,23,0.5)] truncate">{screen.route}</p>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Single Screen View */
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-md mx-auto"
          >
            <Card className="p-6 mb-6">
              <h2 className="text-2xl font-bold mb-2">{currentScreen.name}</h2>
              <p className="text-[rgba(28,25,23,0.6)] text-sm">{currentScreen.route}</p>
            </Card>

            {/* Screen Preview */}
            <div className="relative">
              {/* Visual mockup frame - not captured */}
              <div className="w-[406px] h-[860px] mx-auto bg-black rounded-3xl shadow-2xl p-2">
                {/* Actual screen content - this is what gets captured at 390x844 */}
                <div
                  ref={screenRef}
                  className="w-[390px] h-[844px] bg-[#F5F3F0] rounded-2xl overflow-hidden"
                >
                  <Suspense
                    fallback={
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                          <p className="text-[rgba(28,25,23,0.6)]">Chargement...</p>
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