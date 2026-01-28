#!/usr/bin/env node
/**
 * FIX AUTHENTIFICATION via API Supabase Admin
 * Utilise le Service Role Key pour confirmer les comptes
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

async function main() {
  console.log('\n🔧 FIX AUTHENTIFICATION VIA API ADMIN\n');

  const projectRoot = path.join(__dirname, '..');

  // Configuration
  const envPath = path.join(projectRoot, '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const SUPABASE_URL = envContent.match(/VITE_SUPABASE_URL=(.+)/)?.[1];

  const envLocalPath = path.join(projectRoot, '.env.local');
  const envLocalContent = fs.readFileSync(envLocalPath, 'utf8');
  const SERVICE_ROLE_KEY = envLocalContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1];
  const DB_PASSWORD = envLocalContent.match(/SUPABASE_DB_PASSWORD=(.+)/)?.[1];

  const projectRef = SUPABASE_URL.match(/https:\/\/(.+)\.supabase\.co/)?.[1];

  console.log('📋 Configuration:');
  console.log(`   Project: ${projectRef}`);
  console.log(`   URL: ${SUPABASE_URL}\n`);

  // Installer pg
  const { execSync } = require('child_process');
  try {
    require.resolve('pg');
  } catch {
    execSync('npm install pg', { cwd: projectRoot, stdio: 'inherit' });
  }

  const { Client } = require('pg');

  // 1. Lister les comptes non confirmés via PostgreSQL
  console.log('[1/2] Récupération des comptes non confirmés...');

  const client = new Client({
    connectionString: `postgresql://postgres:${encodeURIComponent(DB_PASSWORD)}@db.${projectRef}.supabase.co:5432/postgres`,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();

  const { rows: unconfirmedUsers } = await client.query(`
    SELECT id, email, created_at
    FROM auth.users
    WHERE email_confirmed_at IS NULL
    ORDER BY created_at DESC
  `);

  await client.end();

  if (unconfirmedUsers.length === 0) {
    console.log('✅ Aucun compte en attente de confirmation\n');
    return;
  }

  console.log(`⚠️  ${unconfirmedUsers.length} compte(s) trouvé(s):\n`);
  unconfirmedUsers.forEach(u => {
    console.log(`   - ${u.email} (ID: ${u.id.substring(0, 8)}...)`);
  });
  console.log('');

  // 2. Confirmer chaque compte via l'API Admin
  console.log('[2/2] Confirmation via API Supabase Admin...\n');

  for (const user of unconfirmedUsers) {
    console.log(`🔄 Confirmation de ${user.email}...`);

    try {
      // Utiliser l'API Admin pour confirmer l'email
      const result = await makeRequest(
        'PUT',
        `${SUPABASE_URL}/auth/v1/admin/users/${user.id}`,
        SERVICE_ROLE_KEY,
        {
          email_confirm: true
        }
      );

      if (result.error) {
        console.log(`   ❌ Erreur: ${result.error.message}`);
      } else {
        console.log(`   ✅ Confirmé avec succès`);
      }

    } catch (error) {
      console.log(`   ❌ Erreur: ${error.message}`);
    }

    console.log('');
  }

  // 3. Vérifier l'état final
  console.log('🔍 Vérification finale...\n');

  const client2 = new Client({
    connectionString: `postgresql://postgres:${encodeURIComponent(DB_PASSWORD)}@db.${projectRef}.supabase.co:5432/postgres`,
    ssl: { rejectUnauthorized: false }
  });

  await client2.connect();

  const { rows: finalCheck } = await client2.query(`
    SELECT
      COUNT(*) FILTER (WHERE email_confirmed_at IS NULL) as unconfirmed,
      COUNT(*) FILTER (WHERE email_confirmed_at IS NOT NULL) as confirmed,
      COUNT(*) as total
    FROM auth.users
  `);

  await client2.end();

  console.log('📊 État final des comptes:');
  console.log(`   Total: ${finalCheck[0].total}`);
  console.log(`   Confirmés: ${finalCheck[0].confirmed} ✅`);
  console.log(`   Non confirmés: ${finalCheck[0].unconfirmed} ${finalCheck[0].unconfirmed > 0 ? '⚠️' : '✅'}`);

  console.log('\n============================================');

  if (finalCheck[0].unconfirmed === 0) {
    console.log('   ✅ TOUS LES COMPTES CONFIRMÉS');
    console.log('============================================\n');
    console.log('🎉 Les utilisateurs peuvent maintenant se connecter!\n');
  } else {
    console.log('   ⚠️  COMPTES ENCORE NON CONFIRMÉS');
    console.log('============================================\n');
    console.log('Il reste des comptes bloqués.');
    console.log('Solution finale: Désactiver "Enable email confirmations"');
    console.log(`sur ${SUPABASE_URL.replace('https://', 'https://supabase.com/dashboard/project/')}/auth/settings\n`);
  }
}

// Helper pour faire des requêtes HTTPS
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
          resolve(parsed);
        } catch {
          resolve({ error: { message: responseData } });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(data);
    }

    req.end();
  });
}

main().catch(error => {
  console.error('\n❌ ERREUR:', error.message);
  console.error(error.stack);
  process.exit(1);
});
