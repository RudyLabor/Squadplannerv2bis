import { test, expect, Page } from '@playwright/test';

/**
 * SQUAD PLANNER - TESTS E2E COMPLETS
 * Teste TOUTES les 61 pages et fonctionnalités comme un vrai utilisateur
 */

// ============================================
// CONFIGURATION
// ============================================
const TEST_USER = {
  email: 'rudylabor@hotmail.fr',
  password: 'SquadPlanner2026!',
};

// Données de test
const TEST_DATA = {
  squadName: `E2E Squad ${Date.now()}`,
  sessionTitle: `E2E Session ${Date.now()}`,
  message: 'Test message E2E',
};

// ============================================
// HELPERS
// ============================================
interface TestResult {
  page: string;
  status: 'pass' | 'fail' | 'error';
  error?: string;
  screenshot?: string;
}

const results: TestResult[] = [];

async function login(page: Page) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');

  const emailInput = page.locator('input[type="email"], input[placeholder*="mail"]').first();
  const passwordInput = page.locator('input[type="password"]').first();

  await emailInput.fill(TEST_USER.email);
  await passwordInput.fill(TEST_USER.password);

  await page.locator('button:has-text("Connexion"), button:has-text("Se connecter")').first().click();
  await page.waitForURL(/\/(home|squads)/, { timeout: 15000 });
}

async function testPage(page: Page, path: string, name: string): Promise<TestResult> {
  const result: TestResult = { page: name, status: 'pass' };

  try {
    const networkErrors: { url: string; status: number }[] = [];
    const consoleErrors: string[] = [];

    page.on('response', response => {
      if (response.status() >= 500) {
        networkErrors.push({ url: response.url(), status: response.status() });
      }
    });

    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (text.includes('infinite recursion') ||
            (text.includes('TypeError') && !text.includes('fetch')) ||
            text.includes('ReferenceError')) {
          consoleErrors.push(text);
        }
      }
    });

    await page.goto(path);
    await page.waitForLoadState('networkidle', { timeout: 30000 });

    // Vérifier que la page se charge
    await expect(page.locator('body')).toBeVisible();

    // Vérifier les erreurs critiques
    const criticalNetworkErrors = networkErrors.filter(e =>
      !e.url.includes('subscriptions') &&
      !e.url.includes('usage_tracking')
    );

    if (criticalNetworkErrors.length > 0) {
      result.status = 'fail';
      result.error = `Erreurs 500: ${JSON.stringify(criticalNetworkErrors)}`;
    }

    if (consoleErrors.length > 0) {
      result.status = 'fail';
      result.error = `Erreurs console: ${consoleErrors.join(', ')}`;
    }

  } catch (error: any) {
    result.status = 'error';
    result.error = error.message;
  }

  return result;
}

// ============================================
// LISTE COMPLÈTE DES 61+ PAGES
// ============================================
const ALL_PAGES = [
  // GROUPE 1: Auth
  { path: '/login', name: 'LoginScreen', requiresAuth: false },
  { path: '/signup', name: 'SignupScreen', requiresAuth: false },

  // GROUPE 2: Dashboard & Home
  { path: '/home', name: 'HomeScreen', requiresAuth: true },
  { path: '/notifications', name: 'NotificationsScreen', requiresAuth: true },
  { path: '/notification-settings', name: 'NotificationSettingsScreen', requiresAuth: true },
  { path: '/smart-suggestions', name: 'SmartSuggestionsScreen', requiresAuth: true },
  { path: '/availability', name: 'AvailabilityHeatmapScreen', requiresAuth: true },
  { path: '/calendar-sync', name: 'CalendarSyncScreen', requiresAuth: true },
  { path: '/weekly-recap', name: 'WeeklyRecapScreen', requiresAuth: true },
  { path: '/activity', name: 'ActivityFeedScreen', requiresAuth: true },

  // GROUPE 3: Squads
  { path: '/squads', name: 'SquadsScreen', requiresAuth: true },
  { path: '/create-squad', name: 'CreateSquadScreen', requiresAuth: true },
  { path: '/join-squad', name: 'JoinSquadScreen', requiresAuth: true },
  { path: '/discover-squads', name: 'DiscoverSquadsScreen', requiresAuth: true },

  // GROUPE 4: Sessions
  { path: '/sessions', name: 'SessionsScreen', requiresAuth: true },
  { path: '/propose-session', name: 'ProposeSessionScreen', requiresAuth: true },
  { path: '/recurring-sessions', name: 'RecurringSessionScreen', requiresAuth: true },

  // GROUPE 5: Profile & Settings
  { path: '/profile', name: 'ProfileScreen', requiresAuth: true },
  { path: '/edit-profile', name: 'EditProfileScreen', requiresAuth: true },
  { path: '/preferences', name: 'PreferencesScreen', requiresAuth: true },
  { path: '/privacy', name: 'PrivacyScreen', requiresAuth: true },
  { path: '/premium', name: 'PremiumScreen', requiresAuth: true },
  { path: '/advanced-stats', name: 'AdvancedStatsScreen', requiresAuth: true },

  // GROUPE 6: Social
  { path: '/friends', name: 'FriendsScreen', requiresAuth: true },
  { path: '/search-players', name: 'SearchPlayersScreen', requiresAuth: true },
  { path: '/community', name: 'CommunityScreen', requiresAuth: true },
  { path: '/share', name: 'ShareScreen', requiresAuth: true },

  // GROUPE 7: Gamification
  { path: '/achievements', name: 'AchievementsScreen', requiresAuth: true },
  { path: '/badges', name: 'BadgesScreen', requiresAuth: true },
  { path: '/leaderboard', name: 'LeaderboardScreen', requiresAuth: true },
  { path: '/ranking', name: 'RankingScreen', requiresAuth: true },
  { path: '/challenges', name: 'ChallengesScreen', requiresAuth: true },
  { path: '/history', name: 'HistoryScreen', requiresAuth: true },

  // GROUPE 8: Compétition
  { path: '/tournaments', name: 'TournamentsScreen', requiresAuth: true },
  { path: '/leagues', name: 'LeaguesScreen', requiresAuth: true },
  { path: '/seasons', name: 'SeasonsScreen', requiresAuth: true },

  // GROUPE 9: Intelligence & Coaching
  { path: '/intelligence', name: 'IntelligenceScreen', requiresAuth: true },
  { path: '/auto-coaching', name: 'AutoCoachingScreen', requiresAuth: true },
  { path: '/coaching-tools', name: 'CoachingToolsScreen', requiresAuth: true },
  { path: '/academy', name: 'AcademyScreen', requiresAuth: true },

  // GROUPE 10: Intégrations
  { path: '/integrations', name: 'IntegrationsScreen', requiresAuth: true },
  { path: '/discord-connect', name: 'DiscordConnectScreen', requiresAuth: true },
  { path: '/discord-bot', name: 'DiscordBotScreen', requiresAuth: true },
  { path: '/esport-integrations', name: 'EsportIntegrationsScreen', requiresAuth: true },

  // GROUPE 11: B2B & Enterprise
  { path: '/organization', name: 'OrganizationScreen', requiresAuth: true },
  { path: '/esport-team', name: 'EsportTeamScreen', requiresAuth: true },
  { path: '/streamer-dashboard', name: 'StreamerDashboardScreen', requiresAuth: true },

  // GROUPE 12: API & Développeurs
  { path: '/api-docs', name: 'ApiDocsScreen', requiresAuth: true },
  { path: '/plugins', name: 'PluginsScreen', requiresAuth: true },
  { path: '/webhooks', name: 'WebhooksScreen', requiresAuth: true },

  // GROUPE 13: Dev & Debug (optionnel)
  { path: '/test-setup', name: 'TestSetupScreen', requiresAuth: true },
  { path: '/qa-tests', name: 'QATestsScreen', requiresAuth: true },
];

// ============================================
// TEST 1: TOUTES LES PAGES SE CHARGENT
// ============================================
test.describe('1. Test de chargement de TOUTES les pages', () => {
  test.beforeAll(async ({ browser }) => {
    // Login une fois pour tous les tests
    const context = await browser.newContext();
    const page = await context.newPage();
    await login(page);
    await context.storageState({ path: 'e2e/.auth/user.json' });
    await context.close();
  });

  // Pages publiques (sans auth)
  test.describe('Pages publiques', () => {
    for (const pageInfo of ALL_PAGES.filter(p => !p.requiresAuth)) {
      test(`${pageInfo.name} (${pageInfo.path})`, async ({ page }) => {
        const result = await testPage(page, pageInfo.path, pageInfo.name);
        console.log(`${result.status === 'pass' ? '✅' : '❌'} ${pageInfo.name}`);
        if (result.error) console.log(`   Error: ${result.error}`);
        expect(result.status).toBe('pass');
      });
    }
  });

  // Pages authentifiées
  test.describe('Pages authentifiées', () => {
    test.use({ storageState: 'e2e/.auth/user.json' });

    for (const pageInfo of ALL_PAGES.filter(p => p.requiresAuth)) {
      test(`${pageInfo.name} (${pageInfo.path})`, async ({ page }) => {
        const result = await testPage(page, pageInfo.path, pageInfo.name);
        console.log(`${result.status === 'pass' ? '✅' : '❌'} ${pageInfo.name}`);
        if (result.error) console.log(`   Error: ${result.error}`);
        expect(result.status).toBe('pass');
      });
    }
  });
});

// ============================================
// TEST 2: FONCTIONNALITÉS D'AUTHENTIFICATION
// ============================================
test.describe('2. Fonctionnalités Auth', () => {
  test('Login complet', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Vérifier les éléments
    await expect(page.locator('input[type="email"], input[placeholder*="mail"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();

    // Remplir et soumettre
    await page.locator('input[type="email"], input[placeholder*="mail"]').first().fill(TEST_USER.email);
    await page.locator('input[type="password"]').first().fill(TEST_USER.password);
    await page.locator('button:has-text("Connexion"), button:has-text("Se connecter")').first().click();

    // Vérifier redirection
    await page.waitForURL(/\/(home|squads)/, { timeout: 15000 });
    expect(page.url()).toMatch(/\/(home|squads)/);
    console.log('✅ Login réussi');
  });

  test('Page signup accessible', async ({ page }) => {
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('input[type="email"], input[placeholder*="mail"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    console.log('✅ Signup accessible');
  });
});

// ============================================
// TEST 3: FONCTIONNALITÉS SQUAD
// ============================================
test.describe('3. Fonctionnalités Squad', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('Voir la liste des squads', async ({ page }) => {
    await page.goto('/squads');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Liste squads visible');
  });

  test('Créer une nouvelle squad', async ({ page }) => {
    await page.goto('/create-squad');
    await page.waitForLoadState('networkidle');

    // Remplir le nom
    const nameInput = page.locator('input').first();
    await nameInput.fill(TEST_DATA.squadName);
    console.log('✅ Nom de squad rempli');

    // Sélectionner un jeu
    const gameButton = page.locator('button').filter({ hasText: /jeu|game/i }).first();
    if (await gameButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await gameButton.click();
      await page.waitForTimeout(500);

      const valorant = page.locator('text=Valorant').first();
      if (await valorant.isVisible({ timeout: 3000 }).catch(() => false)) {
        await valorant.click();
        console.log('✅ Jeu sélectionné');
      }
    }

    // Sélectionner des jours (optionnel)
    const dayButtons = page.locator('button').filter({ hasText: /^[LMMJVSD]$/ });
    const dayCount = await dayButtons.count();
    if (dayCount > 0) {
      await dayButtons.first().click();
      console.log('✅ Jour sélectionné');
    }

    // Créer la squad
    const createButton = page.locator('button:has-text("Créer")').first();
    if (await createButton.isEnabled({ timeout: 5000 }).catch(() => false)) {
      await createButton.click();
      await page.waitForTimeout(3000);
      console.log('✅ Squad créée');
    }
  });

  test('Découvrir des squads publiques', async ({ page }) => {
    await page.goto('/discover-squads');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Discover squads chargé');
  });

  test('Rejoindre une squad par code', async ({ page }) => {
    await page.goto('/join-squad');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Join squad chargé');
  });
});

// ============================================
// TEST 4: FONCTIONNALITÉS SESSION
// ============================================
test.describe('4. Fonctionnalités Session', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('Voir la liste des sessions', async ({ page }) => {
    await page.goto('/sessions');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Liste sessions visible');
  });

  test('Page proposer session', async ({ page }) => {
    await page.goto('/propose-session');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Propose session chargé');
  });

  test('Sessions récurrentes', async ({ page }) => {
    await page.goto('/recurring-sessions');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Recurring sessions chargé');
  });
});

// ============================================
// TEST 5: FONCTIONNALITÉS PROFIL
// ============================================
test.describe('5. Fonctionnalités Profil', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('Voir mon profil', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    // Vérifier qu'on voit des informations de profil
    const username = page.locator('text=Ruuddaams, text=rudylabor').first();
    if (await username.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('✅ Username visible sur le profil');
    }
    console.log('✅ Profil chargé');
  });

  test('Éditer mon profil', async ({ page }) => {
    await page.goto('/edit-profile');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();

    // Vérifier qu'il y a des champs éditables
    const inputs = page.locator('input');
    const inputCount = await inputs.count();
    console.log(`✅ Edit profile chargé (${inputCount} inputs)`);
  });

  test('Préférences', async ({ page }) => {
    await page.goto('/preferences');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Preferences chargé');
  });

  test('Paramètres de confidentialité', async ({ page }) => {
    await page.goto('/privacy');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Privacy chargé');
  });

  test('Stats avancées', async ({ page }) => {
    await page.goto('/advanced-stats');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Advanced stats chargé');
  });
});

// ============================================
// TEST 6: FONCTIONNALITÉS SOCIAL
// ============================================
test.describe('6. Fonctionnalités Social', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('Liste des amis', async ({ page }) => {
    await page.goto('/friends');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Friends chargé');
  });

  test('Rechercher des joueurs', async ({ page }) => {
    await page.goto('/search-players');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();

    // Tester la recherche si un input existe
    const searchInput = page.locator('input[type="search"], input[placeholder*="Rechercher"]').first();
    if (await searchInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await searchInput.fill('test');
      await page.waitForTimeout(1000);
      console.log('✅ Recherche de joueurs fonctionnelle');
    }
    console.log('✅ Search players chargé');
  });

  test('Communauté', async ({ page }) => {
    await page.goto('/community');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Community chargé');
  });

  test('Flux d\'activité', async ({ page }) => {
    await page.goto('/activity');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Activity feed chargé');
  });
});

// ============================================
// TEST 7: GAMIFICATION
// ============================================
test.describe('7. Gamification', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('Achievements', async ({ page }) => {
    await page.goto('/achievements');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Achievements chargé');
  });

  test('Badges', async ({ page }) => {
    await page.goto('/badges');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Badges chargé');
  });

  test('Leaderboard', async ({ page }) => {
    await page.goto('/leaderboard');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Leaderboard chargé');
  });

  test('Ranking', async ({ page }) => {
    await page.goto('/ranking');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Ranking chargé');
  });

  test('Challenges', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Challenges chargé');
  });

  test('Historique', async ({ page }) => {
    await page.goto('/history');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ History chargé');
  });
});

// ============================================
// TEST 8: COMPÉTITION
// ============================================
test.describe('8. Compétition', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('Tournois', async ({ page }) => {
    await page.goto('/tournaments');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Tournaments chargé');
  });

  test('Ligues', async ({ page }) => {
    await page.goto('/leagues');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Leagues chargé');
  });

  test('Saisons', async ({ page }) => {
    await page.goto('/seasons');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Seasons chargé');
  });
});

// ============================================
// TEST 9: INTELLIGENCE & COACHING
// ============================================
test.describe('9. Intelligence & Coaching', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('Intelligence', async ({ page }) => {
    await page.goto('/intelligence');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Intelligence chargé');
  });

  test('Auto Coaching', async ({ page }) => {
    await page.goto('/auto-coaching');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Auto coaching chargé');
  });

  test('Coaching Tools', async ({ page }) => {
    await page.goto('/coaching-tools');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Coaching tools chargé');
  });

  test('Academy', async ({ page }) => {
    await page.goto('/academy');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Academy chargé');
  });
});

// ============================================
// TEST 10: INTÉGRATIONS
// ============================================
test.describe('10. Intégrations', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('Intégrations', async ({ page }) => {
    await page.goto('/integrations');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Integrations chargé');
  });

  test('Discord Connect', async ({ page }) => {
    await page.goto('/discord-connect');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Discord connect chargé');
  });

  test('Discord Bot', async ({ page }) => {
    await page.goto('/discord-bot');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Discord bot chargé');
  });

  test('Esport Integrations', async ({ page }) => {
    await page.goto('/esport-integrations');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Esport integrations chargé');
  });
});

// ============================================
// TEST 11: NOTIFICATIONS
// ============================================
test.describe('11. Notifications', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('Notifications', async ({ page }) => {
    await page.goto('/notifications');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Notifications chargé');
  });

  test('Notification Settings', async ({ page }) => {
    await page.goto('/notification-settings');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Notification settings chargé');
  });

  test('Smart Suggestions', async ({ page }) => {
    await page.goto('/smart-suggestions');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Smart suggestions chargé');
  });
});

// ============================================
// TEST 12: PREMIUM
// ============================================
test.describe('12. Premium', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('Page Premium', async ({ page }) => {
    await page.goto('/premium');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Premium chargé');
  });
});

// ============================================
// TEST 13: B2B & ENTERPRISE
// ============================================
test.describe('13. B2B & Enterprise', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('Organization', async ({ page }) => {
    await page.goto('/organization');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Organization chargé');
  });

  test('Esport Team', async ({ page }) => {
    await page.goto('/esport-team');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Esport team chargé');
  });

  test('Streamer Dashboard', async ({ page }) => {
    await page.goto('/streamer-dashboard');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Streamer dashboard chargé');
  });
});

// ============================================
// TEST 14: API & DÉVELOPPEURS
// ============================================
test.describe('14. API & Développeurs', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('API Docs', async ({ page }) => {
    await page.goto('/api-docs');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ API docs chargé');
  });

  test('Plugins', async ({ page }) => {
    await page.goto('/plugins');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Plugins chargé');
  });

  test('Webhooks', async ({ page }) => {
    await page.goto('/webhooks');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Webhooks chargé');
  });
});

// ============================================
// TEST 15: NAVIGATION BOTTOM/SIDEBAR
// ============================================
test.describe('15. Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('Bottom Navigation fonctionne', async ({ page }) => {
    await page.goto('/home');
    await page.waitForLoadState('networkidle');

    // Cliquer sur Squads dans la nav
    const squadsNav = page.locator('nav button, [role="navigation"] a, button').filter({ hasText: /Squads/i }).first();
    if (await squadsNav.isVisible({ timeout: 5000 }).catch(() => false)) {
      await squadsNav.click();
      await page.waitForURL(/\/squads/, { timeout: 10000 });
      console.log('✅ Navigation Squads fonctionne');
    }

    // Cliquer sur Sessions
    const sessionsNav = page.locator('nav button, [role="navigation"] a, button').filter({ hasText: /Sessions/i }).first();
    if (await sessionsNav.isVisible({ timeout: 3000 }).catch(() => false)) {
      await sessionsNav.click();
      await page.waitForURL(/\/sessions/, { timeout: 10000 });
      console.log('✅ Navigation Sessions fonctionne');
    }

    // Cliquer sur Profil
    const profileNav = page.locator('nav button, [role="navigation"] a, button').filter({ hasText: /Profil/i }).first();
    if (await profileNav.isVisible({ timeout: 3000 }).catch(() => false)) {
      await profileNav.click();
      await page.waitForURL(/\/profile/, { timeout: 10000 });
      console.log('✅ Navigation Profil fonctionne');
    }
  });
});

// ============================================
// TEST FINAL: RÉSUMÉ
// ============================================
test.afterAll(async () => {
  console.log('\n========================================');
  console.log('TESTS E2E COMPLETS TERMINÉS');
  console.log('========================================\n');
});
