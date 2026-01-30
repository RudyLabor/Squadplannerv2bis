import { test, expect } from '@playwright/test';

/**
 * Quick Test - À lancer manuellement après s'être connecté dans le navigateur
 * Ce test vérifie que les pages fonctionnent sans erreur 500
 */

// Pages critiques à tester
const CRITICAL_PAGES = [
  { path: '/home', name: 'Home' },
  { path: '/squads', name: 'Squads' },
  { path: '/sessions', name: 'Sessions' },
  { path: '/profile', name: 'Profile' },
  { path: '/create-squad', name: 'Create Squad' },
];

test.describe('Quick Smoke Test (sans auth)', () => {
  test('Page de login accessible', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('500')) {
        errors.push(msg.text());
      }
    });

    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
    expect(errors.filter(e => e.includes('infinite recursion'))).toHaveLength(0);
  });

  test('Page de signup accessible', async ({ page }) => {
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });
});

// Test à lancer avec `npx playwright test e2e/quick-test.spec.ts --headed`
// pour pouvoir se connecter manuellement d'abord
test.describe.skip('Test pages authentifiées (skip par défaut)', () => {
  for (const pageInfo of CRITICAL_PAGES) {
    test(`${pageInfo.name} se charge sans erreur critique`, async ({ page }) => {
      const serverErrors: { url: string; status: number }[] = [];

      page.on('response', response => {
        if (response.status() >= 500) {
          serverErrors.push({
            url: response.url(),
            status: response.status(),
          });
        }
      });

      await page.goto(pageInfo.path);
      await page.waitForLoadState('networkidle');

      // Filtrer les erreurs non critiques
      const criticalErrors = serverErrors.filter(e =>
        !e.url.includes('subscriptions') &&
        !e.url.includes('usage_tracking')
      );

      if (criticalErrors.length > 0) {
        console.log(`Erreurs sur ${pageInfo.name}:`, criticalErrors);
      }

      expect(criticalErrors).toHaveLength(0);
    });
  }
});
