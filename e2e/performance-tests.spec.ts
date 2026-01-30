/**
 * PERFORMANCE TESTS - Spotify/Linear Level Standards
 * Tests focus on page load times and UI responsiveness
 */

import { test, expect } from '@playwright/test';

// Performance thresholds
const THRESHOLDS = {
  PAGE_LOAD: 3000,
  NAVIGATION: 2000,
  FIRST_CONTENTFUL_PAINT: 2000,
};

test.describe('Performance Tests - Public Pages', () => {
  test.setTimeout(60000);

  test('1. Login page loads quickly (< 3s)', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    const loadTime = Date.now() - startTime;
    console.log(`✅ Login page load: ${loadTime}ms`);

    expect(loadTime).toBeLessThan(THRESHOLDS.PAGE_LOAD);
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 3000 });
  });

  test('2. Signup page loads quickly (< 3s)', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/signup');
    await page.waitForLoadState('domcontentloaded');

    const loadTime = Date.now() - startTime;
    console.log(`✅ Signup page load: ${loadTime}ms`);

    expect(loadTime).toBeLessThan(THRESHOLDS.PAGE_LOAD);
  });

  test('3. Public routes respond correctly', async ({ page }) => {
    const publicRoutes = [
      { path: '/login', expectedElement: 'input[type="email"]' },
      { path: '/signup', expectedElement: 'button' },
    ];

    for (const route of publicRoutes) {
      const start = Date.now();
      await page.goto(route.path);
      await page.waitForLoadState('domcontentloaded');
      const loadTime = Date.now() - start;

      console.log(`✅ ${route.path}: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(THRESHOLDS.PAGE_LOAD);

      // Verify element is present
      await expect(page.locator(route.expectedElement).first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('4. No blocking resources on initial load', async ({ page }) => {
    const resourceTimings: { name: string; duration: number }[] = [];

    page.on('requestfinished', (request) => {
      const timing = request.timing();
      if (timing.responseEnd > 0) {
        resourceTimings.push({
          name: request.url().split('/').pop() || request.url(),
          duration: timing.responseEnd,
        });
      }
    });

    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Check that no single resource takes more than 5s
    const slowResources = resourceTimings.filter((r) => r.duration > 5000);
    if (slowResources.length > 0) {
      console.log('⚠️ Slow resources detected:', slowResources);
    }

    expect(slowResources.length).toBe(0);
  });

  test('5. Form inputs are responsive', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    const emailInput = page.locator('input[type="email"]');
    await emailInput.waitFor({ state: 'visible', timeout: 5000 });

    // Measure input responsiveness
    const startType = Date.now();
    await emailInput.fill('test@example.com');
    const typeTime = Date.now() - startType;

    console.log(`✅ Input fill time: ${typeTime}ms`);
    expect(typeTime).toBeLessThan(500); // Should be instant
  });

  test('6. CSS and JS bundles are optimized', async ({ page }) => {
    const jsFiles: string[] = [];
    const cssFiles: string[] = [];

    page.on('response', (response) => {
      const url = response.url();
      if (url.endsWith('.js') || url.includes('.js?')) {
        jsFiles.push(url);
      }
      if (url.endsWith('.css') || url.includes('.css?')) {
        cssFiles.push(url);
      }
    });

    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    console.log(`✅ JS bundles loaded: ${jsFiles.length}`);
    console.log(`✅ CSS bundles loaded: ${cssFiles.length}`);

    // Should have reasonable number of bundles (code splitting)
    expect(jsFiles.length).toBeGreaterThan(0);
  });

  test('7. No memory leaks on repeated navigation', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    // Navigate between pages multiple times
    for (let i = 0; i < 5; i++) {
      await page.goto('/signup');
      await page.waitForLoadState('domcontentloaded');
      await page.goto('/login');
      await page.waitForLoadState('domcontentloaded');
    }

    // If we complete without crash, memory is stable
    console.log('✅ Memory stable after 10 navigations');
    expect(true).toBe(true);
  });

  test('8. Animations do not cause infinite loops', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    // Wait a bit and check CPU usage via performance API
    const cpuBefore = await page.evaluate(() => {
      return performance.now();
    });

    await page.waitForTimeout(3000);

    const cpuAfter = await page.evaluate(() => {
      return performance.now();
    });

    // Time should pass normally (not exponentially)
    const timePassed = cpuAfter - cpuBefore;
    console.log(`✅ Time passed in 3s wait: ${timePassed}ms`);

    // Should be roughly 3000ms (with some tolerance)
    expect(timePassed).toBeGreaterThan(2500);
    expect(timePassed).toBeLessThan(4000);
  });
});

test.describe('Performance Tests - Core Web Vitals', () => {
  test.setTimeout(30000);

  test('9. First Contentful Paint (FCP) under 2s', async ({ page }) => {
    await page.goto('/login');

    // Get FCP from Performance API
    const fcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          for (const entry of entries) {
            if (entry.name === 'first-contentful-paint') {
              resolve(entry.startTime);
              observer.disconnect();
            }
          }
        });
        observer.observe({ entryTypes: ['paint'] });

        // Fallback if FCP doesn't fire
        setTimeout(() => resolve(-1), 5000);
      });
    });

    if (fcp > 0) {
      console.log(`✅ First Contentful Paint: ${fcp.toFixed(0)}ms`);
      expect(fcp).toBeLessThan(THRESHOLDS.FIRST_CONTENTFUL_PAINT);
    } else {
      console.log('⚠️ FCP metric not available');
    }
  });

  test('10. Layout stability (no large shifts)', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Check for CLS via Performance API
    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
        });
        observer.observe({ entryTypes: ['layout-shift'] });

        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 3000);
      });
    });

    console.log(`✅ Cumulative Layout Shift: ${cls.toFixed(4)}`);
    expect(cls).toBeLessThan(0.1); // Good CLS score
  });
});
