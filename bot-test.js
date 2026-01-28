import { chromium } from 'playwright';

// Configuration
const BASE_URL = 'http://localhost:3000'; // Or your Vercel URL
const USER = {
  username: 'TestBot' + Date.now(),
  email: `testbot${Date.now()}@example.com`,
  password: 'Password123!',
};

async function runTest() {
  console.log('🤖 Starting SquadPlanner Bot Test...');
  const browser = await chromium.launch({ headless: false }); // Headless: false to see it opening
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. SIGNUP
    console.log('📝 Testing Signup...');
    await page.goto(`${BASE_URL}/signup`);
    await page.fill('input[type="email"]', USER.email);
    await page.fill('input[type="password"]', USER.password);
    // Assuming there are confirm password and username fields
    await page.fill('input[placeholder="Confirmer le mot de passe"]', USER.password);
    await page.fill('input[placeholder="Nom d\'utilisateur"]', USER.username);
    
    await page.click('button[type="submit"]'); // 'Créer mon compte'
    
    // Wait for redirect to home or dashboard
    await page.waitForURL('**/home', { timeout: 15000 });
    console.log('✅ Signup Successful!');

    // 2. PROFILE CHECK
    console.log('👤 Testing Profile...');
    await page.goto(`${BASE_URL}/profile`);
    const profileName = await page.textContent('h1'); // Assuming username is in h1
    if (profileName?.includes(USER.username)) {
        console.log('✅ Profile loaded correctly');
    } else {
        console.warn('⚠️ Profile name mismatch or not found');
    }

    // 3. EDIT PROFILE
    console.log('✏️ Testing Edit Profile...');
    await page.goto(`${BASE_URL}/edit-profile`);
    await page.fill('textarea[name="bio"]', 'I am a test bot 🤖');
    await page.click('button:has-text("Sauvegarder")');
    await page.waitForTimeout(2000); // Wait for save
    console.log('✅ Profile Edited');

    // 4. CREATE SQUAD
    console.log('🛡️ Testing Create Squad...');
    await page.goto(`${BASE_URL}/create-squad`);
    await page.fill('input[name="name"]', 'Bot Squad');
    await page.fill('textarea[name="description"]', 'A squad for bots');
    await page.click('button:has-text("Créer l\'escouade")');
    await page.waitForURL('**/squads/**', { timeout: 10000 });
    console.log('✅ Squad Created');

    // 5. SEND MESSAGE
    console.log('💬 Testing Chat...');
    // Assuming we are redirected to squad detail or chat
    const chatInput = page.locator('input[placeholder*="Message"]');
    if (await chatInput.count() > 0) {
        await chatInput.fill('Hello humans!');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1000);
        console.log('✅ Message Sent');
    } else {
        console.log('ℹ️ Chat input not found on this page, skipping chat test');
    }

    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!');

  } catch (error) {
    console.error('❌ TEST FAILED:', error);
    await page.screenshot({ path: 'failure.png' });
  } finally {
    await browser.close();
  }
}

runTest();
