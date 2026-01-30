import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

// All screens to capture
const SCREENS = [
  // Auth screens (public)
  { path: '/login', name: '01-login', needsAuth: false },
  { path: '/signup', name: '02-signup', needsAuth: false },

  // Hub 1: Home & Dashboard
  { path: '/', name: '03-home', needsAuth: true },
  { path: '/notifications', name: '04-notifications', needsAuth: true },
  { path: '/notification-settings', name: '05-notification-settings', needsAuth: true },
  { path: '/availability', name: '06-availability-heatmap', needsAuth: true },

  // Hub 2: Squads
  { path: '/squads', name: '07-squads-list', needsAuth: true },
  { path: '/create-squad', name: '08-create-squad', needsAuth: true },
  { path: '/discover-squads', name: '09-discover-squads', needsAuth: true },
  { path: '/join-squad', name: '10-join-squad', needsAuth: true },

  // Hub 3: Sessions
  { path: '/sessions', name: '11-sessions-list', needsAuth: true },
  { path: '/propose-session', name: '12-propose-session', needsAuth: true },
  { path: '/recurring-sessions', name: '13-recurring-sessions', needsAuth: true },

  // Hub 4: Profile & Settings
  { path: '/profile', name: '14-profile', needsAuth: true },
  { path: '/edit-profile', name: '15-edit-profile', needsAuth: true },
  { path: '/premium', name: '16-premium', needsAuth: true },
  { path: '/advanced-stats', name: '17-advanced-stats', needsAuth: true },
  { path: '/badges', name: '18-badges', needsAuth: true },

  // Community
  { path: '/community', name: '19-community', needsAuth: true },
  { path: '/activity', name: '20-activity-feed', needsAuth: true },
  { path: '/friends', name: '21-friends', needsAuth: true },
  { path: '/leaderboard', name: '22-leaderboard', needsAuth: true },
  { path: '/ranking', name: '23-ranking', needsAuth: true },

  // Tournaments & Leagues
  { path: '/leagues', name: '24-leagues', needsAuth: true },
  { path: '/seasons', name: '25-seasons', needsAuth: true },

  // Intelligence & Coaching
  { path: '/intelligence', name: '26-intelligence', needsAuth: true },
  { path: '/auto-coaching', name: '27-auto-coaching', needsAuth: true },
  { path: '/coaching-tools', name: '28-coaching-tools', needsAuth: true },
  { path: '/academy', name: '29-academy', needsAuth: true },

  // Integrations & API
  { path: '/esport-integrations', name: '30-esport-integrations', needsAuth: true },
  { path: '/api-docs', name: '31-api-docs', needsAuth: true },
  { path: '/plugins', name: '32-plugins', needsAuth: true },
  { path: '/webhooks', name: '33-webhooks', needsAuth: true },

  // B2B & Organizations
  { path: '/organization', name: '34-organization', needsAuth: true },
  { path: '/streamer-dashboard', name: '35-streamer-dashboard', needsAuth: true },

  // Share & Social
  { path: '/share', name: '36-share', needsAuth: true },

  // Esport Team
  { path: '/esport-team', name: '37-esport-team', needsAuth: true },

  // QA & Testing
  { path: '/qa-tests', name: '38-qa-tests', needsAuth: true },
  { path: '/test-setup', name: '39-test-setup', needsAuth: true },
];

test.describe('Screenshot All Screens', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport for consistent screenshots
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  // Public screens
  for (const screen of SCREENS.filter(s => !s.needsAuth)) {
    test(`Capture ${screen.name}`, async ({ page }) => {
      await page.goto(`${BASE_URL}${screen.path}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: `./test-results/screenshots/${screen.name}.png`,
        fullPage: true
      });
    });
  }

  // Authenticated screens
  test.describe('Authenticated Screens', () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.goto(`${BASE_URL}/login`);
      await page.waitForLoadState('networkidle');

      // Fill credentials - Real user account
      await page.getByPlaceholder('votre@email.com').fill('rudylabor@hotmail.fr');
      await page.getByPlaceholder('Votre mot de passe').fill('SquadPlanner2026!');

      // Click the "Se connecter" button
      await page.getByRole('button', { name: 'Se connecter' }).click();

      // Wait for authentication and redirect to home
      await page.waitForURL('**/', { timeout: 20000 }).catch(() => {
        console.log('Login redirect timeout - checking if already on home');
      });
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
    });

    for (const screen of SCREENS.filter(s => s.needsAuth)) {
      test(`Capture ${screen.name}`, async ({ page }) => {
        await page.goto(`${BASE_URL}${screen.path}`);
        await page.waitForLoadState('networkidle');

        // Wait for content to load - wait until loading screen disappears
        // The loading screen shows "Squad" and "Planner" text centered
        await page.waitForTimeout(2000);

        // Wait for any loading indicators to disappear
        await page.waitForFunction(() => {
          const body = document.body.innerText;
          // If page only shows "Squad Planner" it's still loading
          const isLoading = body.trim() === 'Squad\nPlanner' ||
                           body.includes('Chargement') ||
                           body.includes('Loading');
          return !isLoading;
        }, { timeout: 15000 }).catch(() => {
          console.log(`Content might still be loading for ${screen.name}`);
        });

        // Extra wait for animations to settle
        await page.waitForTimeout(2000);

        await page.screenshot({
          path: `./test-results/screenshots/${screen.name}.png`,
          fullPage: true
        });
      });
    }
  });
});
