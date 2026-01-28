#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://cwtoprbowdqcemdjrtir.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyMTQyNjMsImV4cCI6MjA4NDc5MDI2M30.FUpLncLIZc7l4hukBu5oOzj0tHl2IiwIIJ2Ghml8-6k';

function log(msg, type = 'info') {
  const icons = { info: '📝', success: '✅', error: '❌', rocket: '🚀', warning: '⚠️' };
  console.log(`${icons[type]} ${msg}`);
}

async function testAuthSignup() {
  const supabase = createClient(SUPABASE_URL, ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: async (url, options = {}) => {
        const startTime = Date.now();
        try {
          const response = await fetch(url, {
            ...options,
            signal: undefined,
          });
          const duration = Date.now() - startTime;
          log(`${url.split('/').pop()}: ${response.status} (${duration}ms)`, response.ok ? 'success' : 'error');
          return response;
        } catch (error) {
          log(`Fetch error: ${error.message}`, 'error');
          throw error;
        }
      },
    },
  });

  // Try with different email providers
  const testEmails = [
    `testuser${Date.now()}@gmail.com`,
    `testuser${Date.now()}@outlook.com`,
    `testuser${Date.now()}@test.com`,
  ];

  for (const testEmail of testEmails) {
    log(`\n=== Test avec ${testEmail} ===`, 'rocket');

    try {
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'TestPassword123!',
        options: {
          data: {
            username: `user${Date.now()}`,
            display_name: 'Test User',
          },
        },
      });

      if (error) {
        log(`Erreur: ${error.message} (code: ${error.code || 'N/A'})`, 'error');
      } else {
        log('✅ SIGNUP RÉUSSI!', 'success');
        log(`User ID: ${data.user?.id}`, 'info');
        log(`Email confirmé: ${data.user?.email_confirmed_at ? 'Oui' : 'Non'}`, data.user?.email_confirmed_at ? 'success' : 'warning');

        if (data.session) {
          log('Session créée automatiquement', 'success');
        } else {
          log('Pas de session - confirmation email requise', 'warning');
        }

        // Success - break the loop
        log('\n🎉 Auth signup fonctionne correctement!', 'success');
        log('Le problème dans l\'app vient probablement de:', 'info');
        log('1. Configuration du client Supabase dans l\'app', 'info');
        log('2. Gestion de la confirmation email', 'info');
        log('3. Timeout trop court dans le navigateur', 'info');
        break;
      }
    } catch (error) {
      log(`Exception: ${error.name} - ${error.message}`, 'error');
    }
  }
}

async function main() {
  console.log('\n════════════════════════════════════════════════════════════');
  console.log('   🔬 TEST AUTH SIGNUP - EMAIL RÉEL');
  console.log('════════════════════════════════════════════════════════════\n');

  await testAuthSignup();

  console.log('\n════════════════════════════════════════════════════════════\n');
}

main();
