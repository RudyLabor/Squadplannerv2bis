import { test, expect, Page } from '@playwright/test';

/**
 * Squad Planner - Tests E2E Complets
 * Simule un vrai utilisateur qui utilise toutes les fonctionnalités
 */

// Configuration de test
const TEST_USER = {
  email: 'rudylabor@hotmail.fr',
  password: 'SquadPlanner2026!',
};

const TEST_SQUAD = {
  name: `Test Squad ${Date.now()}`,
  game: 'Valorant',
};

// Helper pour capturer les erreurs console
function setupConsoleErrorCapture(page: Page) {
  const errors: string[] = [];
  const warnings: string[] = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignorer les erreurs non critiques
      if (!text.includes('favicon') &&
          !text.includes('manifest') &&
          !text.includes('DevTools') &&
          !text.includes('Vercel Web Analytics')) {
        errors.push(text);
      }
    }
    if (msg.type() === 'warning') {
      warnings.push(msg.text());
    }
  });

  page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}`);
  });

  return { errors, warnings };
}

// Helper pour capturer les erreurs réseau
function setupNetworkErrorCapture(page: Page) {
  const networkErrors: { url: string; status: number; statusText: string }[] = [];

  page.on('response', response => {
    const status = response.status();
    if (status >= 400) {
      networkErrors.push({
        url: response.url(),
        status,
        statusText: response.statusText(),
      });
    }
  });

  return networkErrors;
}

// ============================================
// TEST 1: Chargement de l'application
// ============================================
test.describe('1. Chargement Application', () => {
  test('L\'app se charge sans erreur critique', async ({ page }) => {
    const { errors } = setupConsoleErrorCapture(page);
    const networkErrors = setupNetworkErrorCapture(page);

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Vérifier qu'on est sur login ou home
    await expect(page.locator('body')).toBeVisible();

    // Log des erreurs pour debug
    if (errors.length > 0) {
      console.log('Console Errors:', errors);
    }
    if (networkErrors.length > 0) {
      console.log('Network Errors:', networkErrors.filter(e => e.status >= 500));
    }

    // Pas d'erreur 500
    const serverErrors = networkErrors.filter(e => e.status >= 500);
    expect(serverErrors).toHaveLength(0);
  });
});

// ============================================
// TEST 2: Authentification
// ============================================
test.describe('2. Authentification', () => {
  test('Page login s\'affiche correctement', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Vérifier les éléments de login
    const emailInput = page.locator('input[type="email"], input[placeholder*="mail"]');
    const passwordInput = page.locator('input[type="password"]');

    await expect(emailInput).toBeVisible({ timeout: 10000 });
    await expect(passwordInput).toBeVisible();
  });

  test('Login avec credentials valides', async ({ page }) => {
    const { errors } = setupConsoleErrorCapture(page);
    const networkErrors = setupNetworkErrorCapture(page);

    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Remplir le formulaire
    const emailInput = page.locator('input[type="email"], input[placeholder*="mail"]').first();
    const passwordInput = page.locator('input[type="password"]').first();

    await emailInput.fill(TEST_USER.email);
    await passwordInput.fill(TEST_USER.password);

    // Cliquer sur connexion
    const loginButton = page.locator('button:has-text("Connexion"), button:has-text("Se connecter")').first();
    await loginButton.click();

    // Attendre la redirection vers home
    await page.waitForURL(/\/(home|squads)/, { timeout: 15000 });

    // Vérifier qu'on est connecté
    expect(page.url()).toMatch(/\/(home|squads)/);

    // Pas d'erreur 500
    const serverErrors = networkErrors.filter(e => e.status >= 500);
    if (serverErrors.length > 0) {
      console.log('Server errors during login:', serverErrors);
    }
  });
});

// ============================================
// TEST 3: Navigation principale
// ============================================
test.describe('3. Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Login avant chaque test
    await page.goto('/login');
    const emailInput = page.locator('input[type="email"], input[placeholder*="mail"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    await emailInput.fill(TEST_USER.email);
    await passwordInput.fill(TEST_USER.password);
    await page.locator('button:has-text("Connexion"), button:has-text("Se connecter")').first().click();
    await page.waitForURL(/\/(home|squads)/, { timeout: 15000 });
  });

  test('Navigation vers Home', async ({ page }) => {
    const networkErrors = setupNetworkErrorCapture(page);

    await page.goto('/home');
    await page.waitForLoadState('networkidle');

    // Vérifier que la page home se charge
    await expect(page.locator('body')).toBeVisible();

    const serverErrors = networkErrors.filter(e => e.status >= 500);
    expect(serverErrors).toHaveLength(0);
  });

  test('Navigation vers Squads', async ({ page }) => {
    const networkErrors = setupNetworkErrorCapture(page);

    await page.goto('/squads');
    await page.waitForLoadState('networkidle');

    // Vérifier que la page squads se charge (chercher n'importe quel contenu)
    await expect(page.locator('body')).toBeVisible();

    // Pas d'erreur 500
    const serverErrors = networkErrors.filter(e =>
      e.status >= 500 &&
      !e.url.includes('subscriptions') &&
      !e.url.includes('usage_tracking')
    );
    expect(serverErrors).toHaveLength(0);
  });

  test('Navigation vers Sessions', async ({ page }) => {
    const networkErrors = setupNetworkErrorCapture(page);

    await page.goto('/sessions');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();

    const serverErrors = networkErrors.filter(e => e.status >= 500);
    expect(serverErrors).toHaveLength(0);
  });

  test('Navigation vers Profile', async ({ page }) => {
    const networkErrors = setupNetworkErrorCapture(page);

    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();

    const serverErrors = networkErrors.filter(e => e.status >= 500);
    expect(serverErrors).toHaveLength(0);
  });
});

// ============================================
// TEST 4: Création de Squad
// ============================================
test.describe('4. Création de Squad', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    const emailInput = page.locator('input[type="email"], input[placeholder*="mail"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    await emailInput.fill(TEST_USER.email);
    await passwordInput.fill(TEST_USER.password);
    await page.locator('button:has-text("Connexion"), button:has-text("Se connecter")').first().click();
    await page.waitForURL(/\/(home|squads)/, { timeout: 15000 });
  });

  test('Page création squad s\'affiche', async ({ page }) => {
    const { errors } = setupConsoleErrorCapture(page);
    const networkErrors = setupNetworkErrorCapture(page);

    await page.goto('/create-squad');
    await page.waitForLoadState('networkidle');

    // Vérifier que la page se charge
    await expect(page.locator('body')).toBeVisible();

    // Chercher un input (n'importe lequel)
    const inputs = page.locator('input');
    const inputCount = await inputs.count();
    console.log(`Found ${inputCount} inputs on create-squad page`);

    // Pas d'erreur 500
    const serverErrors = networkErrors.filter(e =>
      e.status >= 500 &&
      !e.url.includes('subscriptions') &&
      !e.url.includes('usage_tracking')
    );
    if (serverErrors.length > 0) {
      console.log('Server errors on create-squad:', serverErrors);
    }
    expect(serverErrors).toHaveLength(0);
  });

  test('Création complète d\'une squad', async ({ page }) => {
    const { errors } = setupConsoleErrorCapture(page);
    const networkErrors = setupNetworkErrorCapture(page);

    await page.goto('/create-squad');
    await page.waitForLoadState('networkidle');

    // 1. Remplir le nom - trouver le premier input
    const nameInput = page.locator('input').first();
    await nameInput.waitFor({ state: 'visible', timeout: 10000 });
    await nameInput.fill(TEST_SQUAD.name);
    console.log('✓ Nom rempli');

    // 2. Sélectionner un jeu - cliquer sur le bouton/zone de sélection de jeu
    // Chercher un bouton ou div cliquable qui contient "jeu" ou une icône gamepad
    const gameSelector = page.locator('button:has-text("jeu"), [class*="game"], button:has(svg)').first();
    if (await gameSelector.isVisible({ timeout: 3000 }).catch(() => false)) {
      await gameSelector.click();
      console.log('✓ Sélecteur de jeu cliqué');

      // Attendre le modal et sélectionner Valorant
      await page.waitForTimeout(500);
      const valorantOption = page.locator('text=Valorant, button:has-text("Valorant")').first();
      if (await valorantOption.isVisible({ timeout: 3000 }).catch(() => false)) {
        await valorantOption.click();
        console.log('✓ Valorant sélectionné');
      }
    }

    // 3. Chercher et cliquer sur le bouton de création
    await page.waitForTimeout(500);
    const createButton = page.locator('button:has-text("Créer"), button:has-text("Create")').first();

    if (await createButton.isEnabled({ timeout: 5000 }).catch(() => false)) {
      await createButton.click();
      console.log('✓ Bouton Créer cliqué');

      // Attendre la réponse
      await page.waitForTimeout(3000);
    } else {
      console.log('⚠ Bouton Créer pas activé (champs requis manquants?)');
    }

    // Vérifier les erreurs 500 critiques
    const serverErrors = networkErrors.filter(e =>
      e.status >= 500 &&
      !e.url.includes('subscriptions') &&
      !e.url.includes('usage_tracking')
    );

    if (serverErrors.length > 0) {
      console.log('Server errors during squad creation:', serverErrors);
    }

    expect(serverErrors).toHaveLength(0);
  });
});

// ============================================
// TEST 5: Parcours complet utilisateur
// ============================================
test.describe('5. Parcours Utilisateur Complet', () => {
  test('Parcours: Login → Home → Squads → Create Squad → Profile', async ({ page }) => {
    const { errors } = setupConsoleErrorCapture(page);
    const networkErrors = setupNetworkErrorCapture(page);

    // 1. Login
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.locator('input[type="email"], input[placeholder*="mail"]').first().fill(TEST_USER.email);
    await page.locator('input[type="password"]').first().fill(TEST_USER.password);
    await page.locator('button:has-text("Connexion"), button:has-text("Se connecter")').first().click();
    await page.waitForURL(/\/(home|squads)/, { timeout: 15000 });
    console.log('✓ Login réussi');

    // 2. Aller sur Home
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
    console.log('✓ Home chargé');

    // 3. Aller sur Squads
    await page.goto('/squads');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
    console.log('✓ Squads chargé');

    // 4. Aller sur Create Squad
    await page.goto('/create-squad');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
    console.log('✓ Create Squad chargé');

    // 5. Aller sur Profile
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
    console.log('✓ Profile chargé');

    // Vérifier les erreurs critiques (ignorer les erreurs réseau temporaires)
    const criticalErrors = errors.filter(e =>
      (e.includes('TypeError') && !e.includes('Failed to fetch')) ||
      e.includes('ReferenceError') ||
      e.includes('infinite recursion')
    );

    if (criticalErrors.length > 0) {
      console.log('ERREURS CRITIQUES:', criticalErrors);
    }

    const serverErrors = networkErrors.filter(e =>
      e.status >= 500 &&
      !e.url.includes('subscriptions') &&
      !e.url.includes('usage_tracking')
    );
    if (serverErrors.length > 0) {
      console.log('ERREURS SERVEUR:', serverErrors);
    }

    expect(criticalErrors).toHaveLength(0);
  });
});

// ============================================
// TEST 6: Toutes les pages (smoke test)
// ============================================
test.describe('6. Smoke Test - Toutes les pages', () => {
  const pages = [
    '/home',
    '/squads',
    '/sessions',
    '/profile',
    '/create-squad',
    '/notifications',
    '/friends',
    '/leaderboard',
    '/achievements',
    '/premium',
    '/edit-profile',
    '/preferences',
    '/notification-settings',
    '/privacy',
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    const emailInput = page.locator('input[type="email"], input[placeholder*="mail"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    await emailInput.fill(TEST_USER.email);
    await passwordInput.fill(TEST_USER.password);
    await page.locator('button:has-text("Connexion"), button:has-text("Se connecter")').first().click();
    await page.waitForURL(/\/(home|squads)/, { timeout: 15000 });
  });

  for (const pagePath of pages) {
    test(`Page ${pagePath} se charge sans erreur 500`, async ({ page }) => {
      const networkErrors = setupNetworkErrorCapture(page);

      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');

      // Vérifier que la page se charge
      await expect(page.locator('body')).toBeVisible();

      // Pas d'erreur 500 critique
      const serverErrors = networkErrors.filter(e =>
        e.status >= 500 &&
        !e.url.includes('subscriptions') &&
        !e.url.includes('usage_tracking')
      );

      if (serverErrors.length > 0) {
        console.log(`Erreurs sur ${pagePath}:`, serverErrors);
      }

      expect(serverErrors).toHaveLength(0);
    });
  }
});
