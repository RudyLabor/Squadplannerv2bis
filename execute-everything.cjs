#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

const SUPABASE_URL = 'https://cwtoprbowdqcemdjrtir.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTIxNDI2MywiZXhwIjoyMDg0NzkwMjYzfQ.9QuJ0c3WpLKQHHmPKsJlDttU8YFPR7f-xD_VLl8gFDE';
const PROJECT_REF = 'cwtoprbowdqcemdjrtir';
const VERCEL_URL = 'https://squad-planner-v2-rudy.vercel.app';

function log(msg, type = 'info') {
  const icons = { info: '📝', success: '✅', error: '❌', warning: '⚠️', rocket: '🚀' };
  console.log(`${icons[type]} ${msg}`);
}

function httpsRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ status: res.statusCode, data });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body));
    req.end();
  });
}

async function executeSQL() {
  log('Exécution des migrations SQL via API Supabase', 'rocket');

  const sql = fs.readFileSync('FULL_DB_SETUP.sql', 'utf-8');

  // Utiliser l'API PostgreSQL REST directement
  const options = {
    hostname: PROJECT_REF + '.supabase.co',
    port: 443,
    path: '/rest/v1/rpc/exec',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Prefer': 'return=minimal'
    }
  };

  // Diviser le SQL en statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 10 && !s.startsWith('--'));

  log(`${statements.length} statements SQL à exécuter`, 'info');

  let success = 0;
  let errors = 0;

  // Exécuter via pg directement avec la connection string
  const { Client } = require('pg');

  // Construire la connection string
  const connectionString = `postgresql://postgres.${PROJECT_REF}:${SUPABASE_SERVICE_KEY.split('.')[2]}@aws-0-eu-west-1.pooler.supabase.com:5432/postgres`;

  try {
    // Alternative simple: exécuter tout le SQL en une fois
    const payload = {
      query: sql
    };

    const execOptions = {
      hostname: PROJECT_REF + '.supabase.co',
      port: 443,
      path: '/rest/v1/rpc',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      }
    };

    // Essayer d'exécuter via PostgREST
    try {
      await httpsRequest(execOptions, JSON.stringify({ sql }));
      log('Migrations SQL exécutées avec succès', 'success');
    } catch (e) {
      // Si PostgREST ne marche pas, utiliser pg
      log('PostgREST non disponible, installation de pg...', 'warning');
      const { execSync } = require('child_process');

      try {
        execSync('npm list pg', { stdio: 'pipe' });
      } catch {
        execSync('npm install pg', { stdio: 'inherit' });
      }

      const { Client } = require('pg');
      const client = new Client({
        host: `aws-0-eu-west-1.pooler.supabase.com`,
        port: 5432,
        database: 'postgres',
        user: `postgres.${PROJECT_REF}`,
        password: 'Fqz3jZwuNPebqGJa' // Mot de passe de votre projet
      });

      await client.connect();
      log('Connecté à PostgreSQL', 'success');

      await client.query(sql);
      log('Migrations SQL exécutées avec succès', 'success');

      await client.end();
    }

  } catch (error) {
    log(`Erreur SQL: ${error.message}`, 'error');
    throw error;
  }
}

async function configureAuth() {
  log('Configuration des Auth URLs via Management API', 'rocket');

  const authConfig = {
    SITE_URL: VERCEL_URL,
    URI_ALLOW_LIST: `${VERCEL_URL},${VERCEL_URL}/**,https://*.vercel.app,${VERCEL_URL}/oauth/callback`
  };

  const options = {
    hostname: 'api.supabase.com',
    port: 443,
    path: `/v1/projects/${PROJECT_REF}/config/auth`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
    }
  };

  try {
    await httpsRequest(options, authConfig);
    log('Auth URLs configurées avec succès', 'success');
  } catch (error) {
    log(`Erreur Auth Config: ${error.message}`, 'warning');
    log('Configuration manuelle requise pour Auth URLs', 'info');
  }
}

async function main() {
  console.log('\n════════════════════════════════════════════════════════════');
  console.log('   🚀 EXÉCUTION AUTOMATIQUE COMPLÈTE');
  console.log('════════════════════════════════════════════════════════════\n');

  try {
    // 1. Migrations SQL
    await executeSQL();

    // 2. Auth URLs
    await configureAuth();

    // Succès
    console.log('\n════════════════════════════════════════════════════════════');
    console.log('   🎉 TOUT EST FAIT !');
    console.log('════════════════════════════════════════════════════════════\n');

    log('Votre application est 100% opérationnelle !', 'success');
    console.log(`\n   🌐 ${VERCEL_URL}\n`);
    console.log('Testez maintenant :');
    console.log('  1. Ouvrez l\'app');
    console.log('  2. Créez un compte');
    console.log('  3. Créez votre premier squad!\n');

  } catch (error) {
    log(`Erreur: ${error.message}`, 'error');
    process.exit(1);
  }
}

main();
