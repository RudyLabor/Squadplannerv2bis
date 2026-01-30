import { chromium, Browser, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:5173';
const SCREENSHOT_DIR = './test-results/screenshots';

// All 68 screens from the app
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

async function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function login(page: Page) {
  console.log('🔐 Logging in with test account...');
  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState('networkidle');

  // Fill login form
  await page.fill('input[type="email"]', 'test@squadplanner.com');
  await page.fill('input[type="password"]', 'Test123!');

  // Click login button
  await page.click('button[type="submit"]');

  // Wait for navigation to home
  await page.waitForURL('**/', { timeout: 10000 }).catch(() => {
    console.log('⚠️ Login might have failed, continuing anyway...');
  });

  await page.waitForTimeout(2000);
  console.log('✅ Login completed');
}

async function captureScreen(page: Page, screen: typeof SCREENS[0]) {
  const screenshotPath = path.join(SCREENSHOT_DIR, `${screen.name}.png`);

  try {
    console.log(`📸 Capturing: ${screen.name} (${screen.path})`);

    await page.goto(`${BASE_URL}${screen.path}`, {
      waitUntil: 'networkidle',
      timeout: 15000
    });

    // Wait for animations to settle
    await page.waitForTimeout(1500);

    // Take screenshot
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });

    console.log(`✅ Saved: ${screenshotPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed: ${screen.name} - ${error}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Squad Planner Screenshot Capture\n');
  console.log(`📁 Output directory: ${SCREENSHOT_DIR}`);
  console.log(`🎯 Total screens to capture: ${SCREENS.length}\n`);

  ensureDirectoryExists(SCREENSHOT_DIR);

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  let successCount = 0;
  let failCount = 0;

  // Capture public screens first
  console.log('\n📋 PHASE 1: Capturing public screens...\n');
  for (const screen of SCREENS.filter(s => !s.needsAuth)) {
    const success = await captureScreen(page, screen);
    if (success) successCount++;
    else failCount++;
  }

  // Login then capture authenticated screens
  console.log('\n📋 PHASE 2: Logging in and capturing authenticated screens...\n');
  await login(page);

  for (const screen of SCREENS.filter(s => s.needsAuth)) {
    const success = await captureScreen(page, screen);
    if (success) successCount++;
    else failCount++;
  }

  await browser.close();

  console.log('\n' + '='.repeat(50));
  console.log('📊 CAPTURE SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Success: ${successCount}/${SCREENS.length}`);
  console.log(`❌ Failed: ${failCount}/${SCREENS.length}`);
  console.log(`📁 Screenshots saved to: ${SCREENSHOT_DIR}`);
  console.log('='.repeat(50));
}

main().catch(console.error);
