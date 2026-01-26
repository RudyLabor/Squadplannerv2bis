/**
 * 📸 Script de Génération Automatique de Screenshots - SQUAD PLANNER
 * 
 * Ce script ouvre chaque écran de l'app et génère un screenshot
 * 
 * ⚠️ PRÉREQUIS :
 * 1. L'app DOIT tourner sur http://localhost:5173
 * 2. Puppeteer doit être installé: npm install --save-dev puppeteer
 * 
 * 🚀 USAGE:
 * Terminal 1: npm run dev
 * Terminal 2: node scripts/generate-screenshots.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Liste COMPLÈTE des 61 écrans avec leurs screen names exacts de App.tsx
const screens = [
  // ========== AUTH (3) ==========
  { name: 'Login', screen: 'login', category: '01-Auth' },
  { name: 'Signup', screen: 'signup', category: '01-Auth' },
  { name: 'Splash', screen: 'home', category: '01-Auth' }, // Splash apparaît au démarrage
  
  // ========== MAIN (4) ==========
  { name: 'Home', screen: 'home', category: '02-Main' },
  { name: 'Squads', screen: 'squads', category: '02-Main' },
  { name: 'Sessions', screen: 'sessions', category: '02-Main' },
  { name: 'Profile', screen: 'profile', category: '02-Main' },
  
  // ========== SQUADS (8) ==========
  { name: 'Create Squad', screen: 'create-squad', category: '03-Squads' },
  { name: 'Squad Detail', screen: 'squad-detail', category: '03-Squads' },
  { name: 'Squad Management', screen: 'squad-management', category: '03-Squads' },
  { name: 'Squad Chat', screen: 'squad-chat', category: '03-Squads' },
  { name: 'Squad Health', screen: 'squad-health', category: '03-Squads' },
  { name: 'Squad Composition', screen: 'squad-composition', category: '03-Squads' },
  { name: 'Join Squad', screen: 'join-squad', category: '03-Squads' },
  { name: 'Discover Squads', screen: 'discover-squads', category: '03-Squads' },
  
  // ========== SESSIONS (5) ==========
  { name: 'Propose Session', screen: 'propose-session', category: '04-Sessions' },
  { name: 'Vote Session', screen: 'vote-session', category: '04-Sessions' },
  { name: 'Recurring Session', screen: 'recurring-session', category: '04-Sessions' },
  { name: 'Check In', screen: 'check-in', category: '04-Sessions' },
  { name: 'History', screen: 'history', category: '04-Sessions' },
  
  // ========== PROFILE (4) ==========
  { name: 'Edit Profile', screen: 'edit-profile', category: '05-Profile' },
  { name: 'Public Profile', screen: 'public-profile', category: '05-Profile' },
  { name: 'Preferences', screen: 'preferences', category: '05-Profile' },
  { name: 'Privacy', screen: 'privacy', category: '05-Profile' },
  
  // ========== SOCIAL (4) ==========
  { name: 'Friends', screen: 'friends', category: '06-Social' },
  { name: 'Search Players', screen: 'search-players', category: '06-Social' },
  { name: 'Community', screen: 'community', category: '06-Social' },
  { name: 'Activity Feed', screen: 'activity-feed', category: '06-Social' },
  
  // ========== STATS (4) ==========
  { name: 'Advanced Stats', screen: 'advanced-stats', category: '07-Stats' },
  { name: 'Availability Heatmap', screen: 'availability-heatmap', category: '07-Stats' },
  { name: 'Leadership Analysis', screen: 'leadership-analysis', category: '07-Stats' },
  { name: 'Weekly Recap', screen: 'weekly-recap', category: '07-Stats' },
  
  // ========== GAMIFICATION (8) ==========
  { name: 'Achievements', screen: 'achievements', category: '08-Gamification' },
  { name: 'Badges', screen: 'badges', category: '08-Gamification' },
  { name: 'Leaderboard', screen: 'leaderboard', category: '08-Gamification' },
  { name: 'Ranking', screen: 'ranking', category: '08-Gamification' },
  { name: 'Challenges', screen: 'challenges', category: '08-Gamification' },
  { name: 'Seasons', screen: 'seasons', category: '08-Gamification' },
  { name: 'Tournaments', screen: 'tournaments', category: '08-Gamification' },
  { name: 'Leagues', screen: 'leagues', category: '08-Gamification' },
  
  // ========== ADVANCED (5) ==========
  { name: 'Smart Suggestions', screen: 'smart-suggestions', category: '09-Advanced' },
  { name: 'Intelligence', screen: 'intelligence', category: '09-Advanced' },
  { name: 'Auto Coaching', screen: 'auto-coaching', category: '09-Advanced' },
  { name: 'Coaching Tools', screen: 'coaching-tools', category: '09-Advanced' },
  { name: 'Academy', screen: 'academy', category: '09-Advanced' },
  
  // ========== INTEGRATIONS (5) ==========
  { name: 'Integrations', screen: 'integrations', category: '10-Integrations' },
  { name: 'Calendar Sync', screen: 'calendar-sync', category: '10-Integrations' },
  { name: 'Discord Bot', screen: 'discord-bot', category: '10-Integrations' },
  { name: 'Webhooks', screen: 'webhooks', category: '10-Integrations' },
  { name: 'Plugins', screen: 'plugins', category: '10-Integrations' },
  
  // ========== ESPORT (4) ==========
  { name: 'Esport Team', screen: 'esport-team', category: '11-Esport' },
  { name: 'Esport Integrations', screen: 'esport-integrations', category: '11-Esport' },
  { name: 'Streamer Dashboard', screen: 'streamer-dashboard', category: '11-Esport' },
  { name: 'Organization', screen: 'organization', category: '11-Esport' },
  
  // ========== SETTINGS (4) ==========
  { name: 'Notifications', screen: 'notifications', category: '12-Settings' },
  { name: 'Notification Settings', screen: 'notification-settings', category: '12-Settings' },
  { name: 'Premium', screen: 'premium', category: '12-Settings' },
  { name: 'Share', screen: 'share', category: '12-Settings' },
  
  // ========== DOCUMENTATION (5) ==========
  { name: 'Design Doc', screen: 'design-doc', category: '13-Documentation' },
  { name: 'API Docs', screen: 'api-docs', category: '13-Documentation' },
  { name: 'Features Demo', screen: 'features-demo', category: '13-Documentation' },
  { name: 'QA Tests', screen: 'qa-tests', category: '13-Documentation' },
  { name: 'Test Setup', screen: 'test-setup', category: '13-Documentation' },
];

const BASE_URL = 'http://localhost:5173';
const OUTPUT_DIR = path.join(__dirname, '../screenshots');

// Créer le dossier de sortie
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateScreenshots() {
  console.log('🎨 Squad Planner - Générateur de Screenshots');
  console.log('━'.repeat(60));
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  console.log(`📱 Total: ${screens.length} écrans`);
  console.log('━'.repeat(60));
  console.log('');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: {
      width: 375,      // iPhone X width
      height: 812,     // iPhone X height
      deviceScaleFactor: 2, // Retina
    },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  const page = await browser.newPage();
  
  // Simuler un iPhone
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1');
  
  // Grouper par catégorie
  const byCategory = screens.reduce((acc, screen) => {
    if (!acc[screen.category]) {
      acc[screen.category] = [];
    }
    acc[screen.category].push(screen);
    return acc;
  }, {});
  
  let count = 0;
  const total = screens.length;
  const errors = [];
  
  // Authentification bypass - Injecte le state directement
  console.log('🔐 Configuration de l\'authentification...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  
  // Inject auth bypass
  await page.evaluate(() => {
    localStorage.setItem('bypass_auth', 'true');
    localStorage.setItem('bypass_email', 'demo@squadplanner.app');
  });
  
  console.log('✅ Bypass activé\n');
  
  for (const [category, categoryScreens] of Object.entries(byCategory)) {
    console.log(`\n📁 ${category} (${categoryScreens.length} écrans)`);
    console.log('─'.repeat(60));
    
    // Créer dossier par catégorie
    const categoryDir = path.join(OUTPUT_DIR, category);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }
    
    for (const screen of categoryScreens) {
      try {
        count++;
        process.stdout.write(`  [${count}/${total}] ${screen.name.padEnd(30)} `);
        
        // Construire l'URL avec le hash navigation
        const url = `${BASE_URL}/#${screen.screen}`;
        
        // Naviguer vers la page
        await page.goto(url, {
          waitUntil: 'networkidle2',
          timeout: 15000,
        });
        
        // Attendre que le contenu soit chargé (les animations)
        await page.waitForTimeout(3000);
        
        // Attendre l'élément principal pour s'assurer que la page est rendue
        try {
          await page.waitForSelector('body', { timeout: 5000 });
        } catch (e) {
          // Continue anyway
        }
        
        // Générer le nom de fichier
        const filename = `${screen.name.replace(/\s+/g, '-').toLowerCase()}.png`;
        const filepath = path.join(categoryDir, filename);
        
        // Prendre le screenshot (pleine hauteur mais avec limite raisonnable)
        await page.screenshot({
          path: filepath,
          fullPage: false, // Pas de fullPage pour éviter les énormes images
          clip: {
            x: 0,
            y: 0,
            width: 375,
            height: 812,
          }
        });
        
        console.log(`✅`);
      } catch (error) {
        console.log(`❌ ${error.message.substring(0, 40)}`);
        errors.push({ screen: screen.name, error: error.message });
      }
    }
  }
  
  await browser.close();
  
  console.log('\n');
  console.log('━'.repeat(60));
  console.log(`✨ Terminé ! ${count}/${total} screenshots générés`);
  console.log(`📂 Dossier: ${OUTPUT_DIR}`);
  
  if (errors.length > 0) {
    console.log(`\n⚠️  ${errors.length} erreurs:`);
    errors.forEach(e => {
      console.log(`   - ${e.screen}: ${e.error.substring(0, 60)}`);
    });
  }
  
  console.log('━'.repeat(60));
  
  // Générer l'index HTML
  generateIndexHTML();
}

// Générer aussi un index HTML pour visualiser tous les screenshots
function generateIndexHTML() {
  const byCategory = screens.reduce((acc, screen) => {
    if (!acc[screen.category]) {
      acc[screen.category] = [];
    }
    acc[screen.category].push(screen);
    return acc;
  }, {});
  
  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Squad Planner - Galerie Screenshots</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFace, sans-serif;
      background: #F5F3F0;
      padding: 40px 20px;
    }
    
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    
    h1 {
      font-size: 48px;
      font-weight: 700;
      color: #1F2937;
      margin-bottom: 16px;
      background: linear-gradient(135deg, #F59E0B 0%, #14B8A6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .subtitle {
      font-size: 18px;
      color: #6B7280;
      margin-bottom: 48px;
    }
    
    .category {
      margin-bottom: 64px;
    }
    
    .category-title {
      font-size: 24px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 24px;
      padding-left: 16px;
      border-left: 4px solid #F59E0B;
    }
    
    .screens-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 32px;
    }
    
    .screen-card {
      background: #FDFCFB;
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      transition: all 0.3s ease;
    }
    
    .screen-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
    }
    
    .screen-name {
      font-size: 16px;
      font-weight: 600;
      color: #1F2937;
      margin-bottom: 12px;
    }
    
    .screen-image {
      width: 100%;
      height: auto;
      border-radius: 12px;
      border: 2px solid #E5E7EB;
      cursor: pointer;
    }
    
    .screen-image:hover {
      border-color: #F59E0B;
    }
    
    .stats {
      display: flex;
      gap: 32px;
      margin-bottom: 48px;
      padding: 24px;
      background: #FDFCFB;
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }
    
    .stat {
      flex: 1;
      text-align: center;
    }
    
    .stat-value {
      font-size: 48px;
      font-weight: 700;
      color: #F59E0B;
    }
    
    .stat-label {
      font-size: 14px;
      color: #6B7280;
      margin-top: 8px;
    }
    
    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      z-index: 1000;
      justify-content: center;
      align-items: center;
      padding: 40px;
    }
    
    .modal.active {
      display: flex;
    }
    
    .modal-image {
      max-width: 90%;
      max-height: 90%;
      border-radius: 16px;
    }
    
    .modal-close {
      position: absolute;
      top: 20px;
      right: 40px;
      font-size: 48px;
      color: white;
      cursor: pointer;
      font-weight: 300;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📱 Squad Planner - Galerie Screenshots</h1>
    <p class="subtitle">Tous les écrans de l'application • Version v4.0 Warm Premium</p>
    
    <div class="stats">
      <div class="stat">
        <div class="stat-value">${screens.length}</div>
        <div class="stat-label">Écrans Total</div>
      </div>
      <div class="stat">
        <div class="stat-value">${Object.keys(byCategory).length}</div>
        <div class="stat-label">Catégories</div>
      </div>
      <div class="stat">
        <div class="stat-value">100%</div>
        <div class="stat-label">Complété</div>
      </div>
    </div>
    
    ${Object.entries(byCategory).map(([category, categoryScreens]) => `
      <div class="category">
        <h2 class="category-title">${category} (${categoryScreens.length})</h2>
        <div class="screens-grid">
          ${categoryScreens.map(screen => {
            const filename = screen.name.replace(/\s+/g, '-').toLowerCase();
            return `
              <div class="screen-card">
                <div class="screen-name">${screen.name}</div>
                <img 
                  src="./${category}/${filename}.png" 
                  alt="${screen.name}" 
                  class="screen-image"
                  onclick="openModal(this.src)"
                />
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `).join('')}
  </div>
  
  <div class="modal" id="modal" onclick="closeModal()">
    <span class="modal-close">&times;</span>
    <img src="" alt="" class="modal-image" id="modal-image">
  </div>
  
  <script>
    function openModal(src) {
      document.getElementById('modal').classList.add('active');
      document.getElementById('modal-image').src = src;
    }
    
    function closeModal() {
      document.getElementById('modal').classList.remove('active');
    }
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    });
  </script>
</body>
</html>
  `;
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), html);
  console.log(`\n📄 Index HTML généré: ${OUTPUT_DIR}/index.html`);
}

// Exécuter
(async () => {
  try {
    await generateScreenshots();
    console.log('\n🎉 Tous les screenshots sont prêts !');
    console.log(`📂 Ouvre ${OUTPUT_DIR}/index.html dans ton navigateur pour les visualiser`);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
})();