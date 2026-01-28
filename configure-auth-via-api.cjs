#!/usr/bin/env node

const https = require('https');

const PROJECT_REF = 'cwtoprbowdqcemdjrtir';
const VERCEL_URL = 'https://squad-planner-v2-rudy.vercel.app';

// Récupérer le token d'accès Supabase
const { execSync } = require('child_process');

function log(msg, type = 'info') {
  const icons = { info: '📝', success: '✅', error: '❌', rocket: '🚀' };
  console.log(`${icons[type]} ${msg}`);
}

function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ statusCode: res.statusCode, body });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(typeof data === 'string' ? data : JSON.stringify(data));
    req.end();
  });
}

async function getSupabaseAccessToken() {
  try {
    // Essayer de récupérer le token depuis la CLI Supabase
    const token = execSync('npx supabase@latest projects list --output json 2>&1 | grep -o "\\"access_token\\":\\"[^\\"]\\+"', {
      encoding: 'utf-8',
      stdio: 'pipe'
    }).trim();

    if (token) {
      return token.split(':')[1].replace(/"/g, '');
    }
  } catch (err) {
    // Pas de token trouvé
  }

  return null;
}

async function configureAuthURLs() {
  log('Configuration des Auth URLs via REST API Supabase...', 'rocket');

  // Méthode 1: Via l'endpoint /auth/v1/admin
  const authAdminOptions = {
    hostname: `${PROJECT_REF}.supabase.co`,
    port: 443,
    path: '/auth/v1/admin/settings',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTIxNDI2MywiZXhwIjoyMDg0NzkwMjYzfQ.9QuJ0c3WpLKQHHmPKsJlDttU8YFPR7f-xD_VLl8gFDE',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTIxNDI2MywiZXhwIjoyMDg0NzkwMjYzfQ.9QuJ0c3WpLKQHHmPKsJlDttU8YFPR7f-xD_VLl8gFDE'
    }
  };

  const authConfig = {
    SITE_URL: VERCEL_URL,
    URI_ALLOW_LIST: `${VERCEL_URL},${VERCEL_URL}/**,https://*.vercel.app,${VERCEL_URL}/oauth/callback`,
    DISABLE_SIGNUP: false,
    EXTERNAL_EMAIL_ENABLED: true,
    EXTERNAL_PHONE_ENABLED: false,
    MAILER_AUTOCONFIRM: false
  };

  try {
    const result = await makeRequest(authAdminOptions, authConfig);
    log('Auth URLs configurées avec succès via GoTrue API!', 'success');
    return true;
  } catch (error) {
    log(`Erreur API GoTrue: ${error.message}`, 'error');

    // Méthode 2: Via l'API publique de configuration
    log('Tentative avec l\'API publique...', 'info');

    const publicOptions = {
      hostname: `${PROJECT_REF}.supabase.co`,
      port: 443,
      path: '/rest/v1/rpc/set_auth_config',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTIxNDI2MywiZXhwIjoyMDg0NzkwMjYzfQ.9QuJ0c3WpLKQHHmPKsJlDttU8YFPR7f-xD_VLl8gFDE',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTIxNDI2MywiZXhwIjoyMDg0NzkwMjYzfQ.9QuJ0c3WpLKQHHmPKsJlDttU8YFPR7f-xD_VLl8gFDE'
      }
    };

    try {
      await makeRequest(publicOptions, authConfig);
      log('Auth URLs configurées via API publique!', 'success');
      return true;
    } catch (err2) {
      log(`Erreur API publique: ${err2.message}`, 'error');
      return false;
    }
  }
}

async function main() {
  console.log('\n════════════════════════════════════════════════════════════');
  console.log('   🚀 CONFIGURATION AUTH URLs VIA API - 100% AUTONOME');
  console.log('════════════════════════════════════════════════════════════\n');

  const success = await configureAuthURLs();

  if (success) {
    console.log('\n════════════════════════════════════════════════════════════');
    console.log('   🎉 AUTH URLs CONFIGURÉES !');
    console.log('════════════════════════════════════════════════════════════\n');

    log('Configuration appliquée:', 'success');
    log(`  Site URL: ${VERCEL_URL}`, 'info');
    log(`  Redirect URLs: ${VERCEL_URL}, ${VERCEL_URL}/**, https://*.vercel.app, ${VERCEL_URL}/oauth/callback`, 'info');

    console.log('\n🚀 TESTEZ MAINTENANT:');
    console.log(`   1. Ouvrez: ${VERCEL_URL}`);
    console.log('   2. Rafraîchissez (F5)');
    console.log('   3. Créez un compte');
    console.log('   4. Connectez-vous!\n');
  } else {
    console.log('\n⚠️  Configuration automatique impossible via API');
    console.log('📝 Configuration manuelle requise (2 minutes):');
    console.log('   https://app.supabase.com/project/cwtoprbowdqcemdjrtir/auth/url-configuration\n');
  }
}

main();
