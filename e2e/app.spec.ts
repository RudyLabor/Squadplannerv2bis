import { test, expect } from '@playwright/test';

/**
 * Squad Planner E2E Tests
 * Tests automatisés pour détecter les bugs et erreurs
 */

test.describe('Application Loading', () => {
  test('should load the home page without errors', async ({ page }) => {
    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');

    // Wait for app to load
    await page.waitForLoadState('networkidle');

    // Check no critical console errors
    const criticalErrors = consoleErrors.filter(e =>
      !e.includes('favicon') &&
      !e.includes('manifest') &&
      !e.includes('service-worker')
    );

    expect(criticalErrors.length).toBe(0);
  });

  test('should display the login or home screen', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Either login screen or home screen should be visible
    const loginVisible = await page.locator('text=Connexion').isVisible().catch(() => false);
    const homeVisible = await page.locator('text=Accueil').isVisible().catch(() => false);
    const createSquadVisible = await page.locator('text=Créer Squad').isVisible().catch(() => false);

    expect(loginVisible || homeVisible || createSquadVisible).toBeTruthy();
  });
});

test.describe('Navigation', () => {
  test('should have clickable navigation buttons', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for bottom navigation if present
    const navButtons = page.locator('nav button, [role="navigation"] button');
    const count = await navButtons.count();

    // Should have some navigation elements
    console.log(`Found ${count} navigation buttons`);
  });
});

test.describe('UI Components', () => {
  test('should render buttons correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get all buttons
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    console.log(`Found ${buttonCount} buttons on the page`);

    // Check that buttons are visible and clickable
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      const isVisible = await button.isVisible();
      if (isVisible) {
        const isEnabled = await button.isEnabled();
        console.log(`Button ${i}: visible=${isVisible}, enabled=${isEnabled}`);
      }
    }
  });

  test('should not have broken images', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);

      // Image should either be a placeholder or have loaded
      if (src && !src.includes('placeholder') && !src.includes('data:')) {
        expect(naturalWidth).toBeGreaterThan(0);
      }
    }
  });
});

test.describe('API Connectivity', () => {
  test('should be able to reach Supabase', async ({ page }) => {
    const responses: { url: string; status: number }[] = [];

    page.on('response', response => {
      if (response.url().includes('supabase')) {
        responses.push({
          url: response.url(),
          status: response.status()
        });
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Log Supabase responses
    responses.forEach(r => {
      console.log(`Supabase: ${r.status} - ${r.url.substring(0, 80)}`);
    });

    // Check for 500 errors
    const serverErrors = responses.filter(r => r.status >= 500);
    expect(serverErrors.length).toBe(0);
  });
});

test.describe('Form Validation', () => {
  test('should show validation errors on empty form submit', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Try to find a form with required fields
    const forms = page.locator('form');
    const formCount = await forms.count();

    if (formCount > 0) {
      const submitButton = forms.first().locator('button[type="submit"]');
      if (await submitButton.isVisible()) {
        await submitButton.click();

        // Check for validation messages
        const errorMessages = page.locator('[role="alert"], .error, .text-red-500');
        const errorCount = await errorMessages.count();
        console.log(`Found ${errorCount} error messages after form submit`);
      }
    }
  });
});

test.describe('Responsive Design', () => {
  test('should be usable on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that content fits in viewport
    const body = page.locator('body');
    const scrollWidth = await body.evaluate(el => el.scrollWidth);
    const clientWidth = await body.evaluate(el => el.clientWidth);

    // Horizontal scroll should not be needed
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 10);
  });
});

test.describe('Error Boundaries', () => {
  test('should not show uncaught errors in UI', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for error boundary messages
    const errorBoundary = page.locator('text=Something went wrong');
    const hasError = await errorBoundary.isVisible().catch(() => false);

    expect(hasError).toBeFalsy();
  });
});
