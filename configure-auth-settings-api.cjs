#!/usr/bin/env node

const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTIxNDI2MywiZXhwIjoyMDg0NzkwMjYzfQ.TT_wI_QY9bHv4xZ_sj5bNmcG7a1M2LYDcpZ9n9xcUn0';
const PROJECT_REF = 'cwtoprbowdqcemdjrtir';
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;

function log(msg, type = 'info') {
  const icons = { info: '📝', success: '✅', error: '❌', rocket: '🚀' };
  console.log(`${icons[type]} ${msg}`);
}

async function configureAuthSettings() {
  try {
    log('Configuration de GoTrue auth settings...', 'rocket');

    // Try to get current config first
    log('Vérification de la configuration actuelle...', 'info');

    const getConfigResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/config`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (getConfigResponse.ok) {
      const currentConfig = await getConfigResponse.json();
      log('Configuration actuelle:', 'info');
      console.log(JSON.stringify(currentConfig, null, 2));
    } else {
      log(`Impossible de lire la config: ${getConfigResponse.status} ${getConfigResponse.statusText}`, 'error');
      const errorText = await getConfigResponse.text();
      console.log('Erreur:', errorText);
    }

    // Try to update config
    log('Mise à jour de la configuration auth...', 'rocket');

    const updateConfigResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/config`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        MAILER_AUTOCONFIRM: true,
        DISABLE_SIGNUP: false,
        ENABLE_SIGNUP: true,
      }),
    });

    if (updateConfigResponse.ok) {
      log('Configuration mise à jour avec succès!', 'success');
      const updatedConfig = await updateConfigResponse.json();
      console.log('Nouvelle configuration:', JSON.stringify(updatedConfig, null, 2));
    } else {
      log(`Erreur lors de la mise à jour: ${updateConfigResponse.status} ${updateConfigResponse.statusText}`, 'error');
      const errorText = await updateConfigResponse.text();
      console.log('Erreur:', errorText);

      // Try alternative endpoint
      log('Tentative endpoint alternatif...', 'info');
      const altResponse = await fetch(`${SUPABASE_URL}/auth/v1/config`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'apikey': SERVICE_ROLE_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mailer_autoconfirm: true,
          disable_signup: false,
        }),
      });

      if (altResponse.ok) {
        log('Configuration mise à jour via endpoint alternatif!', 'success');
      } else {
        log(`Endpoint alternatif échoué: ${altResponse.status}`, 'error');
      }
    }

  } catch (error) {
    log(`Erreur: ${error.message}`, 'error');
    console.error(error);
  }

  log('', 'info');
  log('Si la configuration API ne fonctionne pas, vous devez:', 'info');
  log('1. Ouvrir: https://app.supabase.com/project/cwtoprbowdqcemdjrtir/auth/providers', 'info');
  log('2. Cliquer sur "Email" provider', 'info');
  log('3. Désactiver "Enable email confirmations"', 'info');
  log('4. Sauvegarder', 'info');
  log('', 'info');
}

async function main() {
  console.log('\n════════════════════════════════════════════════════════════');
  console.log('   🔧 CONFIGURATION AUTH SETTINGS VIA API');
  console.log('════════════════════════════════════════════════════════════\n');

  await configureAuthSettings();

  console.log('\n════════════════════════════════════════════════════════════\n');
}

main();
