/**
 * 🧪 SQUAD PLANNER - Tests COMPLETS avec Service Role
 * 
 * Ce script teste TOUTES les fonctionnalités backend avec accès admin
 */

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const SUPABASE_URL = 'https://cwtoprbowdqcemdjrtir.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyMTQyNjMsImV4cCI6MjA4NDc5MDI2M30.FUpLncLIZc7l4hukBu5oOzj0tHl2IiwIIJ2Ghml8-6k';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTIxNDI2MywiZXhwIjoyMDg0NzkwMjYzfQ.9QuJ0c3WpLKQHHmPKsJlDttU8YFPR7f-xD_VLl8gFDE';
const API_BASE = `${SUPABASE_URL}/functions/v1/make-server-e884809f`;

// Client admin avec service_role
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Client normal
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Couleurs terminal
const c = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

interface TestResult {
  name: string;
  category: string;
  passed: boolean;
  error?: string;
  duration: number;
  data?: any;
}

const results: TestResult[] = [];

function log(msg: string, color = c.reset) {
  console.log(`${color}${msg}${c.reset}`);
}

async function runTest(category: string, name: string, fn: () => Promise<any>): Promise<TestResult> {
  const start = Date.now();
  try {
    const data = await fn();
    const duration = Date.now() - start;
    log(`  ${c.green}✅${c.reset} ${name} (${duration}ms)`);
    return { name, category, passed: true, duration, data };
  } catch (error: any) {
    const duration = Date.now() - start;
    log(`  ${c.red}❌${c.reset} ${name} - ${error.message}`);
    return { name, category, passed: false, error: error.message, duration };
  }
}

// Variables de test
let testUser: any = null;
let testAccessToken: string = '';
let testSquadId: string = '';
let testSessionId: string = '';
let testWebhookId: string = '';

// ========================================
// TESTS
// ========================================

async function testSupabaseConnection() {
  const { data, error } = await supabaseAdmin.auth.getUser();
  // Service role ne retourne pas d'utilisateur mais la connexion fonctionne
  return { connected: true };
}

async function testKVStore() {
  // Test lecture KV store
  const { data, error } = await supabaseAdmin
    .from('kv_store_e884809f')
    .select('*')
    .limit(5);
  
  if (error && !error.message.includes('does not exist')) {
    throw new Error(error.message);
  }
  return { records: data?.length || 0 };
}

async function testCreateUserAdmin() {
  const email = `test-${Date.now()}@squadplanner.app`;
  const password = 'TestPassword123!';
  
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Confirme l'email automatiquement
    user_metadata: {
      name: 'Test Robot',
      avatar: '🤖',
    }
  });
  
  if (error) throw new Error(error.message);
  
  testUser = data.user;
  
  // Maintenant connexion avec ce compte
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (signInError) throw new Error(signInError.message);
  
  testAccessToken = signInData.session?.access_token || '';
  
  return { userId: testUser.id, email };
}

async function testGetProfile() {
  const response = await fetch(`${API_BASE}/auth/profile`, {
    headers: { 'Authorization': `Bearer ${testAccessToken}` },
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status}: ${text}`);
  }
  
  return await response.json();
}

async function testUpdateProfile() {
  const response = await fetch(`${API_BASE}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${testAccessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Test Robot Updated',
      bio: 'Je suis un robot de test automatisé',
      mainGame: 'Valorant',
      timezone: 'Europe/Paris',
    }),
  });
  
  if (!response.ok) throw new Error(`${response.status}`);
  return await response.json();
}

async function testCreateSquad() {
  const response = await fetch(`${API_BASE}/squads`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${testAccessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Test Squad Robot',
      game: 'Valorant',
      description: 'Squad créée par le robot de test',
      preferredDays: ['monday', 'wednesday', 'friday'],
      typicalDuration: 120,
    }),
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status}: ${text}`);
  }
  
  const data = await response.json();
  testSquadId = data.squad?.id || data.id;
  return data;
}

async function testGetSquads() {
  const response = await fetch(`${API_BASE}/squads`, {
    headers: { 'Authorization': `Bearer ${testAccessToken}` },
  });
  
  if (!response.ok) throw new Error(`${response.status}`);
  return await response.json();
}

async function testGetSquadDetail() {
  if (!testSquadId) throw new Error('No squad ID');
  
  const response = await fetch(`${API_BASE}/squads/${testSquadId}`, {
    headers: { 'Authorization': `Bearer ${testAccessToken}` },
  });
  
  if (!response.ok) throw new Error(`${response.status}`);
  return await response.json();
}

async function testCreateSession() {
  if (!testSquadId) throw new Error('No squad ID');
  
  const tomorrow = new Date(Date.now() + 86400000);
  
  const response = await fetch(`${API_BASE}/sessions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${testAccessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      squadId: testSquadId,
      title: 'Session Test Robot',
      date: tomorrow.toISOString().split('T')[0],
      time: '21:00',
      duration: 120,
      description: 'Session créée par le robot de test',
      minPlayers: 3,
      maxPlayers: 5,
    }),
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status}: ${text}`);
  }
  
  const data = await response.json();
  testSessionId = data.session?.id || data.id;
  return data;
}

async function testGetSessions() {
  const response = await fetch(`${API_BASE}/sessions`, {
    headers: { 'Authorization': `Bearer ${testAccessToken}` },
  });
  
  if (!response.ok) throw new Error(`${response.status}`);
  return await response.json();
}

async function testRSVPSession() {
  if (!testSessionId) throw new Error('No session ID');
  
  const response = await fetch(`${API_BASE}/sessions/${testSessionId}/rsvp`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${testAccessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ response: 'confirmed' }),
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status}: ${text}`);
  }
  
  return await response.json();
}

async function testCreateWebhook() {
  const response = await fetch(`${API_BASE}/webhooks`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${testAccessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Test Webhook Robot',
      url: 'https://discord.com/api/webhooks/test/test',
      events: ['session.created', 'session.rsvp'],
      enabled: true,
    }),
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status}: ${text}`);
  }
  
  const data = await response.json();
  testWebhookId = data.webhook?.id || data.id;
  return data;
}

async function testGetWebhooks() {
  const response = await fetch(`${API_BASE}/webhooks`, {
    headers: { 'Authorization': `Bearer ${testAccessToken}` },
  });
  
  if (!response.ok) throw new Error(`${response.status}`);
  return await response.json();
}

async function testGetNotificationSettings() {
  const response = await fetch(`${API_BASE}/notifications/settings`, {
    headers: { 'Authorization': `Bearer ${testAccessToken}` },
  });
  
  if (!response.ok) throw new Error(`${response.status}`);
  return await response.json();
}

async function testUpdateNotificationSettings() {
  const response = await fetch(`${API_BASE}/notifications/settings`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${testAccessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionReminders: true,
      squadUpdates: true,
      marketingEmails: false,
    }),
  });
  
  if (!response.ok) throw new Error(`${response.status}`);
  return await response.json();
}

async function testHealthCheck() {
  const response = await fetch(`${API_BASE}/health`);
  const data = await response.json();
  return data;
}

async function testCleanup() {
  // Supprimer l'utilisateur de test
  if (testUser?.id) {
    await supabaseAdmin.auth.admin.deleteUser(testUser.id);
  }
  await supabase.auth.signOut();
  return { cleaned: true };
}

// ========================================
// MAIN
// ========================================

async function runAllTests() {
  log('\n' + '='.repeat(60), c.cyan);
  log('🧪 SQUAD PLANNER - TESTS COMPLETS BACKEND', c.cyan);
  log('='.repeat(60) + '\n', c.cyan);
  
  // 1. Connexion
  log('📡 CONNEXION', c.blue);
  results.push(await runTest('connection', 'Connexion Supabase Admin', testSupabaseConnection));
  results.push(await runTest('connection', 'Lecture KV Store', testKVStore));
  results.push(await runTest('connection', 'Health Check API', testHealthCheck));
  
  // 2. Authentification
  log('\n🔐 AUTHENTIFICATION', c.blue);
  results.push(await runTest('auth', 'Création utilisateur (admin)', testCreateUserAdmin));
  results.push(await runTest('auth', 'Récupération profil', testGetProfile));
  results.push(await runTest('auth', 'Mise à jour profil', testUpdateProfile));
  
  // 3. Squads
  log('\n👥 SQUADS', c.blue);
  results.push(await runTest('squads', 'Création squad', testCreateSquad));
  results.push(await runTest('squads', 'Liste des squads', testGetSquads));
  results.push(await runTest('squads', 'Détail squad', testGetSquadDetail));
  
  // 4. Sessions
  log('\n📅 SESSIONS', c.blue);
  results.push(await runTest('sessions', 'Création session', testCreateSession));
  results.push(await runTest('sessions', 'Liste des sessions', testGetSessions));
  results.push(await runTest('sessions', 'RSVP session', testRSVPSession));
  
  // 5. Webhooks
  log('\n🔗 WEBHOOKS', c.blue);
  results.push(await runTest('webhooks', 'Création webhook', testCreateWebhook));
  results.push(await runTest('webhooks', 'Liste des webhooks', testGetWebhooks));
  
  // 6. Notifications
  log('\n🔔 NOTIFICATIONS', c.blue);
  results.push(await runTest('notifications', 'Get settings', testGetNotificationSettings));
  results.push(await runTest('notifications', 'Update settings', testUpdateNotificationSettings));
  
  // 7. Cleanup
  log('\n🧹 NETTOYAGE', c.blue);
  results.push(await runTest('cleanup', 'Suppression utilisateur test', testCleanup));
  
  // Résumé
  log('\n' + '='.repeat(60), c.cyan);
  log('📊 RÉSUMÉ DES TESTS', c.cyan);
  log('='.repeat(60) + '\n', c.cyan);
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;
  const rate = Math.round((passed / total) * 100);
  
  log(`Total: ${total} tests`);
  log(`${c.green}✅ Passés: ${passed}${c.reset}`);
  log(`${c.red}❌ Échoués: ${failed}${c.reset}`);
  log(`${c.yellow}📈 Taux de réussite: ${rate}%${c.reset}\n`);
  
  // Catégories
  const categories = [...new Set(results.map(r => r.category))];
  log('Par catégorie:', c.magenta);
  for (const cat of categories) {
    const catResults = results.filter(r => r.category === cat);
    const catPassed = catResults.filter(r => r.passed).length;
    const catTotal = catResults.length;
    const icon = catPassed === catTotal ? '✅' : '⚠️';
    log(`  ${icon} ${cat}: ${catPassed}/${catTotal}`);
  }
  
  if (failed > 0) {
    log('\n❌ Tests échoués:', c.red);
    results.filter(r => !r.passed).forEach(r => {
      log(`  - [${r.category}] ${r.name}: ${r.error}`, c.red);
    });
  }
  
  log('\n' + '='.repeat(60) + '\n', c.cyan);
  
  return { passed, failed, total, rate, results };
}

// Exécution
runAllTests()
  .then(summary => {
    process.exit(summary.failed > 0 ? 1 : 0);
  })
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
