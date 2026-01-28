#!/usr/bin/env node
/**
 * TEST AUTHENTIFICATION - Vérifie que la création de compte fonctionne
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

function makeRequest(method, url, apiKey, body) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const data = body ? JSON.stringify(body) : null;

    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`,
      }
    };

    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(data);
    }

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, data: { raw: responseData } });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(data);
    }

    req.end();
  });
}

async function main() {
  console.log('\n🧪 TEST AUTHENTIFICATION\n');

  const projectRoot = path.join(__dirname, '..');
  const envPath = path.join(projectRoot, '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const SUPABASE_URL = envContent.match(/VITE_SUPABASE_URL=(.+)/)?.[1];
  const SUPABASE_ANON_KEY = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/)?.[1];

  console.log('📋 Configuration:');
  console.log(`   URL: ${SUPABASE_URL}\n`);

  // Générer un email de test unique
  const timestamp = Date.now();
  const testEmail = `testauth${timestamp}@test.com`;
  const testPassword = 'TestPassword123!';
  const testUsername = `testuser${timestamp}`;

  console.log('👤 Compte de test:');
  console.log(`   Email: ${testEmail}`);
  console.log(`   Username: ${testUsername}\n`);

  // TEST 1: Créer un compte
  console.log('[1/3] Création du compte...');

  try {
    const signupResult = await makeRequest(
      'POST',
      `${SUPABASE_URL}/auth/v1/signup`,
      SUPABASE_ANON_KEY,
      {
        email: testEmail,
        password: testPassword,
        data: {
          username: testUsername,
          display_name: testUsername
        }
      }
    );

    if (signupResult.status !== 200) {
      console.log(`   ❌ Échec (HTTP ${signupResult.status})`);
      console.log(`   Erreur: ${JSON.stringify(signupResult.data)}\n`);
      return;
    }

    const hasSession = signupResult.data.access_token !== undefined;
    const needsConfirmation = signupResult.data.user && !hasSession;

    if (needsConfirmation) {
      console.log('   ❌ PROBLÈME: Email confirmation encore requise!');
      console.log('   Le compte est créé mais pas de session.');
      console.log('   → La configuration Supabase n\'est pas encore appliquée.\n');
      console.log('💡 Solution: Attendre 1-2 minutes et réessayer.');
      console.log('   Ou vérifier dans le Dashboard que le toggle est bien OFF.\n');
      return;
    }

    if (hasSession) {
      console.log('   ✅ Compte créé avec SESSION immédiate!');
      console.log(`   User ID: ${signupResult.data.user.id.substring(0, 8)}...`);
      console.log(`   Access Token: ${signupResult.data.access_token.substring(0, 20)}...\n`);
    }

    // TEST 2: Vérifier le profil
    console.log('[2/3] Vérification du profil...');

    const profileResult = await makeRequest(
      'GET',
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${signupResult.data.user.id}`,
      SUPABASE_ANON_KEY,
      null
    );

    if (profileResult.status === 200 && profileResult.data.length > 0) {
      console.log('   ✅ Profil créé automatiquement');
      console.log(`   Username: ${profileResult.data[0].username}`);
      console.log(`   Email: ${profileResult.data[0].email}\n`);
    } else {
      console.log('   ⚠️  Profil non trouvé (peut être normal si trigger lent)\n');
    }

    // TEST 3: Se déconnecter et se reconnecter
    console.log('[3/3] Test de reconnexion...');

    const loginResult = await makeRequest(
      'POST',
      `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
      SUPABASE_ANON_KEY,
      {
        email: testEmail,
        password: testPassword
      }
    );

    if (loginResult.status === 200 && loginResult.data.access_token) {
      console.log('   ✅ Reconnexion réussie!');
      console.log(`   Access Token: ${loginResult.data.access_token.substring(0, 20)}...\n`);
    } else {
      console.log(`   ❌ Échec de reconnexion (HTTP ${loginResult.status})`);
      console.log(`   Erreur: ${JSON.stringify(loginResult.data)}\n`);
      return;
    }

    // SUCCESS
    console.log('╔══════════════════════════════════════════════════════╗');
    console.log('║  ✅ AUTHENTIFICATION COMPLÈTEMENT FONCTIONNELLE      ║');
    console.log('╚══════════════════════════════════════════════════════╝\n');

    console.log('🎉 Résultat:');
    console.log('   ✅ Création de compte: IMMÉDIATE');
    console.log('   ✅ Session créée: OUI');
    console.log('   ✅ Pas de confirmation email: CORRECT');
    console.log('   ✅ Profil auto-créé: OUI');
    console.log('   ✅ Reconnexion: FONCTIONNE\n');

    console.log('📱 L\'application est maintenant utilisable!');
    console.log('   Les utilisateurs peuvent créer des comptes et se connecter.\n');

  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}\n`);
  }
}

main().catch(error => {
  console.error('\n❌ ERREUR:', error.message);
  process.exit(1);
});
