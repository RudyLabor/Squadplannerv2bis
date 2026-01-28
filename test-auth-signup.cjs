#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://cwtoprbowdqcemdjrtir.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyMTQyNjMsImV4cCI6MjA4NDc5MDI2M30.FUpLncLIZc7l4hukBu5oOzj0tHl2IiwIIJ2Ghml8-6k';

function log(msg, type = 'info') {
  const icons = { info: '📝', success: '✅', error: '❌', rocket: '🚀', warning: '⚠️' };
  console.log(`${icons[type]} ${msg}`);
}

async function testAuthSignup() {
  log('Création du client Supabase...', 'rocket');

  const supabase = createClient(SUPABASE_URL, ANON_KEY, {
    auth: {
      persistSession: false, // Disable session persistence for testing
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      // Add custom fetch with detailed logging
      fetch: async (url, options = {}) => {
        log(`Fetch: ${url}`, 'info');
        const startTime = Date.now();

        try {
          const response = await fetch(url, {
            ...options,
            signal: undefined, // Remove any signal to prevent AbortError
          });

          const duration = Date.now() - startTime;
          log(`Response: ${response.status} ${response.statusText} (${duration}ms)`,
              response.ok ? 'success' : 'error');

          return response;
        } catch (error) {
          const duration = Date.now() - startTime;
          log(`Fetch error after ${duration}ms: ${error.message}`, 'error');
          throw error;
        }
      },
    },
  });

  log('Client créé avec succès', 'success');

  // Test 1: Check if auth service is accessible
  log('\n=== TEST 1: Vérification du service auth ===', 'rocket');
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      log(`Erreur getSession: ${error.message}`, 'error');
    } else {
      log('Service auth accessible', 'success');
    }
  } catch (error) {
    log(`Exception getSession: ${error.message}`, 'error');
  }

  // Test 2: Try signup with test email
  log('\n=== TEST 2: Test signup ===', 'rocket');
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  try {
    log(`Tentative signup avec: ${testEmail}`, 'info');

    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          username: 'testuser',
          display_name: 'Test User',
        },
      },
    });

    if (error) {
      log(`Erreur signup: ${error.message}`, 'error');
      log(`Détails: ${JSON.stringify(error, null, 2)}`, 'error');
    } else {
      log('Signup réussi!', 'success');
      log(`User ID: ${data.user?.id}`, 'success');
      log(`Email: ${data.user?.email}`, 'success');
      log(`Confirmation required: ${data.user?.email_confirmed_at ? 'Non' : 'Oui'}`, data.user?.email_confirmed_at ? 'success' : 'warning');

      if (!data.user?.email_confirmed_at) {
        log('⚠️  ATTENTION: Confirmation email requise!', 'warning');
        log('⚠️  L\'utilisateur doit confirmer son email avant de se connecter', 'warning');
        log('⚠️  Pour désactiver:', 'warning');
        log('    1. https://app.supabase.com/project/cwtoprbowdqcemdjrtir/auth/providers', 'warning');
        log('    2. Email provider > Désactiver "Enable email confirmations"', 'warning');
      }
    }
  } catch (error) {
    log(`Exception signup: ${error.name} - ${error.message}`, 'error');
    if (error.stack) {
      console.log('\nStack trace:');
      console.log(error.stack);
    }
  }

  // Test 3: Check CORS
  log('\n=== TEST 3: Vérification CORS ===', 'rocket');
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/health`, {
      method: 'GET',
      headers: {
        'apikey': ANON_KEY,
      },
    });

    if (response.ok) {
      log('CORS OK - Service auth accessible', 'success');
    } else {
      log(`CORS issue: ${response.status} ${response.statusText}`, 'error');
    }
  } catch (error) {
    log(`Erreur CORS: ${error.message}`, 'error');
  }
}

async function main() {
  console.log('\n════════════════════════════════════════════════════════════');
  console.log('   🔬 DIAGNOSTIC AUTH SIGNUP');
  console.log('════════════════════════════════════════════════════════════\n');

  try {
    await testAuthSignup();
  } catch (error) {
    log(`Erreur fatale: ${error.message}`, 'error');
    console.error(error);
  }

  console.log('\n════════════════════════════════════════════════════════════\n');
}

main();
