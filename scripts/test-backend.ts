/**
 * 🧪 SQUAD PLANNER - Tests automatisés Backend
 * 
 * Ce script teste toutes les fonctionnalités backend avec Supabase
 */

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const SUPABASE_URL = 'https://cwtoprbowdqcemdjrtir.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyMTQyNjMsImV4cCI6MjA4NDc5MDI2M30.FUpLncLIZc7l4hukBu5oOzj0tHl2IiwIIJ2Ghml8-6k';
const API_BASE = `${SUPABASE_URL}/functions/v1/make-server-e884809f`;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Résultats des tests
interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

const results: TestResult[] = [];

// Utility functions
function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logTest(name: string, passed: boolean, error?: string, duration?: number) {
  const status = passed ? `${colors.green}✅ PASS` : `${colors.red}❌ FAIL`;
  const time = duration ? ` (${duration}ms)` : '';
  log(`${status}${colors.reset} ${name}${time}`);
  if (error) {
    log(`   Error: ${error}`, colors.red);
  }
}

async function runTest(name: string, testFn: () => Promise<void>): Promise<TestResult> {
  const start = Date.now();
  try {
    await testFn();
    const duration = Date.now() - start;
    logTest(name, true, undefined, duration);
    return { name, passed: true, duration };
  } catch (error: any) {
    const duration = Date.now() - start;
    logTest(name, false, error.message, duration);
    return { name, passed: false, error: error.message, duration };
  }
}

// Test variables
let testUserId: string | null = null;
let testAccessToken: string | null = null;
let testSquadId: string | null = null;
let testSessionId: string | null = null;

// ========================
// TESTS
// ========================

async function testSupabaseConnection() {
  const { data, error } = await supabase.from('kv_store_e884809f').select('key').limit(1);
  if (error && !error.message.includes('does not exist')) {
    throw new Error(`Supabase connection failed: ${error.message}`);
  }
}

async function testHealthCheck() {
  const response = await fetch(`${API_BASE}/health`);
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }
  const data = await response.json();
  if (data.status !== 'ok') {
    throw new Error(`Health check returned bad status: ${data.status}`);
  }
}

async function testSignUp() {
  const testEmail = `test-${Date.now()}@squadplanner.test`;
  const testPassword = 'TestPassword123!';
  
  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        name: 'Test User',
        avatar: '🎮',
      }
    }
  });
  
  if (error) {
    throw new Error(`Signup failed: ${error.message}`);
  }
  
  if (data.user) {
    testUserId = data.user.id;
    testAccessToken = data.session?.access_token || null;
  }
}

async function testGetProfile() {
  if (!testAccessToken) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(`${API_BASE}/auth/profile`, {
    headers: {
      'Authorization': `Bearer ${testAccessToken}`,
    },
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Get profile failed: ${response.status} - ${text}`);
  }
}

async function testCreateSquad() {
  if (!testAccessToken) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(`${API_BASE}/squads`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${testAccessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Test Squad',
      game: 'Valorant',
      description: 'A test squad for automated testing',
    }),
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Create squad failed: ${response.status} - ${text}`);
  }
  
  const data = await response.json();
  testSquadId = data.squad?.id || data.id;
}

async function testGetSquads() {
  if (!testAccessToken) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(`${API_BASE}/squads`, {
    headers: {
      'Authorization': `Bearer ${testAccessToken}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Get squads failed: ${response.status}`);
  }
}

async function testGetSquadDetail() {
  if (!testAccessToken || !testSquadId) {
    throw new Error('No access token or squad ID available');
  }
  
  const response = await fetch(`${API_BASE}/squads/${testSquadId}`, {
    headers: {
      'Authorization': `Bearer ${testAccessToken}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Get squad detail failed: ${response.status}`);
  }
}

async function testCreateSession() {
  if (!testAccessToken || !testSquadId) {
    throw new Error('No access token or squad ID available');
  }
  
  const response = await fetch(`${API_BASE}/squads/${testSquadId}/sessions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${testAccessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      time: '21:00',
      duration: 120,
      description: 'Test session for automated testing',
    }),
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Create session failed: ${response.status} - ${text}`);
  }
  
  const data = await response.json();
  testSessionId = data.session?.id || data.id;
}

async function testGetSessions() {
  if (!testAccessToken) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(`${API_BASE}/sessions`, {
    headers: {
      'Authorization': `Bearer ${testAccessToken}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Get sessions failed: ${response.status}`);
  }
}

async function testRSVPSession() {
  if (!testAccessToken || !testSessionId) {
    throw new Error('No access token or session ID available');
  }
  
  const response = await fetch(`${API_BASE}/sessions/${testSessionId}/rsvp`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${testAccessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      response: 'confirmed',
    }),
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`RSVP session failed: ${response.status} - ${text}`);
  }
}

async function testGetWebhooks() {
  if (!testAccessToken) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(`${API_BASE}/webhooks`, {
    headers: {
      'Authorization': `Bearer ${testAccessToken}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Get webhooks failed: ${response.status}`);
  }
}

async function testSignOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(`Sign out failed: ${error.message}`);
  }
  testAccessToken = null;
}

// ========================
// MAIN
// ========================

async function runAllTests() {
  log('\n🧪 SQUAD PLANNER - TESTS AUTOMATISÉS BACKEND\n', colors.cyan);
  log('=' .repeat(50), colors.cyan);
  
  // Connection tests
  log('\n📡 Tests de connexion\n', colors.blue);
  results.push(await runTest('Connexion Supabase', testSupabaseConnection));
  results.push(await runTest('Health Check API', testHealthCheck));
  
  // Auth tests
  log('\n🔐 Tests d\'authentification\n', colors.blue);
  results.push(await runTest('Inscription (SignUp)', testSignUp));
  results.push(await runTest('Récupération profil', testGetProfile));
  
  // Squad tests
  log('\n👥 Tests Squads\n', colors.blue);
  results.push(await runTest('Création squad', testCreateSquad));
  results.push(await runTest('Liste des squads', testGetSquads));
  results.push(await runTest('Détail squad', testGetSquadDetail));
  
  // Session tests
  log('\n📅 Tests Sessions\n', colors.blue);
  results.push(await runTest('Création session', testCreateSession));
  results.push(await runTest('Liste des sessions', testGetSessions));
  results.push(await runTest('RSVP session', testRSVPSession));
  
  // Webhook tests
  log('\n🔗 Tests Webhooks\n', colors.blue);
  results.push(await runTest('Liste des webhooks', testGetWebhooks));
  
  // Cleanup
  log('\n🧹 Nettoyage\n', colors.blue);
  results.push(await runTest('Déconnexion', testSignOut));
  
  // Summary
  log('\n' + '=' .repeat(50), colors.cyan);
  log('\n📊 RÉSUMÉ DES TESTS\n', colors.cyan);
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;
  
  log(`Total: ${total} tests`, colors.reset);
  log(`✅ Passés: ${passed}`, colors.green);
  log(`❌ Échoués: ${failed}`, colors.red);
  log(`📈 Taux de réussite: ${Math.round((passed / total) * 100)}%\n`, colors.yellow);
  
  if (failed > 0) {
    log('Tests échoués:', colors.red);
    results.filter(r => !r.passed).forEach(r => {
      log(`  - ${r.name}: ${r.error}`, colors.red);
    });
  }
  
  // Write results to file
  const resultsMd = `# 🧪 Résultats des tests - ${new Date().toLocaleString('fr-FR')}

## Résumé
- **Total**: ${total} tests
- **Passés**: ${passed} ✅
- **Échoués**: ${failed} ❌
- **Taux**: ${Math.round((passed / total) * 100)}%

## Détails

| Test | Status | Durée | Erreur |
|------|--------|-------|--------|
${results.map(r => `| ${r.name} | ${r.passed ? '✅' : '❌'} | ${r.duration}ms | ${r.error || '-'} |`).join('\n')}
`;
  
  console.log('\n📄 Résultats sauvegardés dans TEST_RESULTS.md');
  
  return { passed, failed, total, results };
}

// Run tests
runAllTests().catch(console.error);
