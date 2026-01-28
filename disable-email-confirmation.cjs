#!/usr/bin/env node

const { Client } = require('pg');

const DB_CONFIG = {
  host: 'db.cwtoprbowdqcemdjrtir.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Ruudboy92600*',
  ssl: { rejectUnauthorized: false }
};

function log(msg, type = 'info') {
  const icons = { info: '📝', success: '✅', error: '❌', rocket: '🚀' };
  console.log(`${icons[type]} ${msg}`);
}

async function disableEmailConfirmation() {
  const client = new Client(DB_CONFIG);

  try {
    log('Connexion à PostgreSQL...', 'rocket');
    await client.connect();
    log('Connecté!', 'success');

    log('Vérification de la configuration auth actuelle...', 'info');

    // Check current auth config
    try {
      const { rows: currentConfig } = await client.query(`
        SELECT
          name,
          setting
        FROM pg_settings
        WHERE name LIKE '%auth%'
        ORDER BY name;
      `);

      log('Configuration auth actuelle:', 'info');
      currentConfig.forEach(row => {
        console.log(`  ${row.name} = ${row.setting}`);
      });
    } catch (err) {
      log('Impossible de lire la config PostgreSQL', 'error');
    }

    // Try to update auth settings via auth.config table
    log('Tentative de désactivation de la confirmation par email...', 'rocket');

    try {
      // Method 1: Try auth.config table
      await client.query(`
        UPDATE auth.config
        SET
          enable_signup = true,
          mailer_autoconfirm = true,
          disable_signup = false
        WHERE id = 1;
      `);
      log('Configuration mise à jour via auth.config!', 'success');
    } catch (err) {
      // Table doesn't exist, try alternative methods
      log('Table auth.config non trouvée, tentative méthode alternative...', 'info');

      try {
        // Method 2: Create or update settings in a custom table
        await client.query(`
          CREATE TABLE IF NOT EXISTS public.auth_settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `);

        await client.query(`
          INSERT INTO public.auth_settings (key, value)
          VALUES
            ('enable_signup', 'true'),
            ('mailer_autoconfirm', 'true'),
            ('disable_signup', 'false')
          ON CONFLICT (key)
          DO UPDATE SET
            value = EXCLUDED.value,
            updated_at = NOW();
        `);

        log('Paramètres auth sauvegardés dans public.auth_settings', 'success');
      } catch (altErr) {
        log(`Erreur méthode alternative: ${altErr.message}`, 'error');
      }
    }

    log('', 'info');
    log('IMPORTANT: Configuration via PostgreSQL limitée', 'info');
    log('Pour désactiver complètement la confirmation email:', 'info');
    log('1. Ouvrez: https://app.supabase.com/project/cwtoprbowdqcemdjrtir/auth/providers', 'info');
    log('2. Dans "Email" provider settings', 'info');
    log('3. Désactivez "Confirm email" (Enable email confirmations)', 'info');
    log('4. Cliquez "Save"', 'info');
    log('', 'info');

  } catch (error) {
    log(`Erreur: ${error.message}`, 'error');
  } finally {
    await client.end();
  }
}

async function main() {
  console.log('\n════════════════════════════════════════════════════════════');
  console.log('   🔧 DÉSACTIVATION CONFIRMATION EMAIL');
  console.log('════════════════════════════════════════════════════════════\n');

  await disableEmailConfirmation();

  console.log('\n════════════════════════════════════════════════════════════\n');
}

main();
