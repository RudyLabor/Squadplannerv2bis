#!/usr/bin/env node
/**
 * FIX AUTHENTIFICATION - Auto-confirme tous les comptes en attente
 * Utilise le Service Role Key pour bypasser la confirmation email
 */

const fs = require('fs');
const path = require('path');

async function main() {
  console.log('\n🔧 FIX AUTHENTIFICATION - Auto-confirmation comptes\n');

  const projectRoot = path.join(__dirname, '..');

  // Configuration
  const envPath = path.join(projectRoot, '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const SUPABASE_URL = envContent.match(/VITE_SUPABASE_URL=(.+)/)?.[1];
  const SUPABASE_ANON_KEY = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/)?.[1];

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
    console.log('📦 Installation pg...');
    execSync('npm install pg', { cwd: projectRoot, stdio: 'inherit' });
  }

  const { Client } = require('pg');

  // Connecter à PostgreSQL
  const client = new Client({
    connectionString: `postgresql://postgres:${encodeURIComponent(DB_PASSWORD)}@db.${projectRef}.supabase.co:5432/postgres`,
    ssl: { rejectUnauthorized: false }
  });

  console.log('🔌 Connexion à PostgreSQL...');
  await client.connect();
  console.log('✅ Connecté\n');

  // 1. Lister les comptes non confirmés
  console.log('[1/3] Vérification des comptes non confirmés...');

  const { rows: unconfirmedUsers } = await client.query(`
    SELECT id, email, created_at, email_confirmed_at
    FROM auth.users
    WHERE email_confirmed_at IS NULL
    ORDER BY created_at DESC
  `);

  if (unconfirmedUsers.length === 0) {
    console.log('✅ Aucun compte en attente de confirmation\n');
  } else {
    console.log(`⚠️  ${unconfirmedUsers.length} compte(s) en attente:\n`);
    unconfirmedUsers.forEach(u => {
      console.log(`   - ${u.email} (créé le ${new Date(u.created_at).toLocaleDateString()})`);
    });
    console.log('');
  }

  // 2. Auto-confirmer tous les comptes
  if (unconfirmedUsers.length > 0) {
    console.log('[2/3] Auto-confirmation des comptes...');

    for (const user of unconfirmedUsers) {
      try {
        await client.query(`
          UPDATE auth.users
          SET email_confirmed_at = NOW(),
              confirmed_at = NOW()
          WHERE id = $1
        `, [user.id]);

        console.log(`   ✅ ${user.email} confirmé`);
      } catch (error) {
        console.log(`   ❌ ${user.email} - Erreur: ${error.message}`);
      }
    }

    console.log('\n✅ Tous les comptes ont été confirmés!\n');
  }

  // 3. Vérifier si on peut désactiver la confirmation via la config
  console.log('[3/3] Modification de la configuration auth...');

  try {
    // Essayer de modifier les settings auth dans auth.config
    // Note: Cela peut ne pas fonctionner selon les permissions
    await client.query(`
      UPDATE auth.config
      SET enable_signup = true,
          enable_email_confirmations = false
      WHERE key = 'email'
    `);

    console.log('✅ Configuration modifiée : enable_email_confirmations = false\n');
  } catch (error) {
    console.log(`⚠️  Impossible de modifier la config via SQL: ${error.message}`);
    console.log('   (Ceci est normal - la config doit être modifiée via le Dashboard)\n');
  }

  await client.end();

  // 4. Vérifier l'état final
  console.log('🔍 Vérification finale...');

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

  console.log('\n📊 État des comptes:');
  console.log(`   Total: ${finalCheck[0].total}`);
  console.log(`   Confirmés: ${finalCheck[0].confirmed} ✅`);
  console.log(`   Non confirmés: ${finalCheck[0].unconfirmed} ${finalCheck[0].unconfirmed > 0 ? '⚠️' : '✅'}`);

  console.log('\n============================================');
  console.log('   ✅ FIX AUTHENTIFICATION TERMINÉ');
  console.log('============================================\n');

  if (finalCheck[0].unconfirmed === 0) {
    console.log('🎉 Tous les comptes sont maintenant confirmés!');
    console.log('   Les utilisateurs peuvent se connecter immédiatement.\n');
  }

  console.log('📝 PROCHAINES ÉTAPES:');
  console.log('   1. Tester la connexion avec un compte existant');
  console.log('   2. Créer un nouveau compte pour vérifier');
  console.log('   3. Si les nouveaux comptes sont encore bloqués,');
  console.log('      il faut désactiver "Enable email confirmations"');
  console.log('      sur le Dashboard Supabase.\n');

  console.log('🔗 Dashboard Auth Settings:');
  console.log(`   https://supabase.com/dashboard/project/${projectRef}/auth/settings\n`);

  console.log('============================================\n');
}

main().catch(error => {
  console.error('\n❌ ERREUR:', error.message);
  console.error(error.stack);
  process.exit(1);
});
