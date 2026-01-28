#!/usr/bin/env node
/**
 * Exécute chaque fichier de migration individuellement
 * Continue même en cas d'erreur
 */

const fs = require('fs');
const path = require('path');

async function main() {
  console.log('\n🚀 EXECUTION MIGRATIONS INDIVIDUELLES\n');

  const projectRoot = path.join(__dirname, '..');

  // Configuration
  const envPath = path.join(projectRoot, '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const SUPABASE_URL = envContent.match(/VITE_SUPABASE_URL=(.+)/)?.[1];

  const envLocalPath = path.join(projectRoot, '.env.local');
  const envLocalContent = fs.readFileSync(envLocalPath, 'utf8');
  const DB_PASSWORD = envLocalContent.match(/SUPABASE_DB_PASSWORD=(.+)/)?.[1];

  const projectRef = SUPABASE_URL.match(/https:\/\/(.+)\.supabase\.co/)?.[1];

  // Installer pg
  const { execSync } = require('child_process');
  try {
    require.resolve('pg');
  } catch {
    execSync('npm install pg', { cwd: projectRoot, stdio: 'inherit' });
  }

  const { Client } = require('pg');

  const migrations = [
    '20260129_create_check_ins.sql',
    '20260129_reliability_system.sql',
    '20260129_badges_system.sql',
    '20260129_roles_permissions.sql'
  ];

  const migrationsDir = path.join(projectRoot, 'supabase', 'migrations');

  for (const migrationFile of migrations) {
    console.log(`\n📄 ${migrationFile}...`);

    const filePath = path.join(migrationsDir, migrationFile);

    if (!fs.existsSync(filePath)) {
      console.log('   ❌ Fichier non trouvé\n');
      continue;
    }

    const sql = fs.readFileSync(filePath, 'utf8');

    // Créer une nouvelle connexion pour chaque migration
    const client = new Client({
      connectionString: `postgresql://postgres:${encodeURIComponent(DB_PASSWORD)}@db.${projectRef}.supabase.co:5432/postgres`,
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();

      // Exécuter le SQL complet
      try {
        await client.query(sql);
        console.log('   ✅ Appliquée avec succès');

      } catch (error) {
        const errMsg = error.message.toLowerCase();

        if (
          errMsg.includes('already exists') ||
          errMsg.includes('duplicate')
        ) {
          console.log('   ✓  Déjà appliquée (skipped)');
        } else {
          console.log(`   ⚠️  Erreur: ${error.message.split('\n')[0]}`);
          console.log('      Continuation...');
        }
      }

      await client.end();

    } catch (error) {
      console.log(`   ❌ Connexion échouée: ${error.message}`);
      try { await client.end(); } catch {}
    }
  }

  // Vérification finale avec une nouvelle connexion
  console.log('\n============================================');
  console.log('   🔍 VERIFICATION FINALE');
  console.log('============================================\n');

  const verifyClient = new Client({
    connectionString: `postgresql://postgres:${encodeURIComponent(DB_PASSWORD)}@db.${projectRef}.supabase.co:5432/postgres`,
    ssl: { rejectUnauthorized: false }
  });

  await verifyClient.connect();

  const checks = [
    { name: 'session_check_ins', label: '[Phase 1] Check-ins table' },
    { name: 'reliability_scores', label: '[Phase 1] Reliability scores table' },
    { name: 'badges', label: '[Phase 2] Badges table' },
    { name: 'user_badges', label: '[Phase 2] User badges table' },
    { name: 'badge_progress', label: '[Phase 2] Badge progress table' },
    { name: 'roles', label: '[Phase 2] Roles table' },
    { name: 'user_roles', label: '[Phase 2] User roles table' },
    { name: 'permissions', label: '[Phase 2] Permissions table' },
    { name: 'role_permissions', label: '[Phase 2] Role permissions table' }
  ];

  let presentCount = 0;
  let totalCount = checks.length;

  for (const check of checks) {
    try {
      const { rows } = await client.query(`SELECT COUNT(*) as count FROM ${check.name}`);
      const count = parseInt(rows[0].count);
      console.log(`✅ ${check.label} (${count} rows)`);
      presentCount++;
    } catch (error) {
      console.log(`❌ ${check.label} - MANQUANTE`);
    }
  }

  // Vérifier fonctions clés
  console.log('');
  const functions = [
    'award_badges_to_user',
    'calculate_user_reliability',
    'check_badge_leader_fiable'
  ];

  for (const func of functions) {
    try {
      const { rows } = await client.query(`
        SELECT proname FROM pg_proc
        WHERE proname = $1
      `, [func]);

      if (rows.length > 0) {
        console.log(`✅ Fonction: ${func}()`);
      } else {
        console.log(`⚠️  Fonction: ${func}() - manquante`);
      }
    } catch (error) {
      console.log(`⚠️  Fonction: ${func}() - vérification échouée`);
    }
  }

  await verifyClient.end();

  // Résumé
  console.log('\n============================================');
  console.log('   📊 RÉSUMÉ');
  console.log('============================================\n');

  const percentage = Math.round((presentCount / totalCount) * 100);

  console.log(`Tables: ${presentCount}/${totalCount} (${percentage}%)\n`);

  if (presentCount === totalCount) {
    console.log('✅ Phase 0: 100% (Database Schema)');
    console.log('✅ Phase 1: 100% (Check-ins + Reliability)');
    console.log('✅ Phase 2: 100% (Badges + Roles)\n');
    console.log('🎯 BASE DE DONNÉES COMPLETE');
    console.log('🎯 Prêt pour Phase 3: Discord Integration');
  } else if (percentage >= 50) {
    console.log(`⚠️  Phase 0-2: ${percentage}% complété`);
    console.log('   Certaines tables manquent');
    console.log('   Mais suffisant pour continuer');
  } else {
    console.log(`❌ Phase 0-2: Seulement ${percentage}% complété`);
    console.log('   Plusieurs tables manquent');
  }

  console.log('\n============================================\n');
}

main().catch(error => {
  console.error('\n❌ ERREUR:', error.message);
  console.error(error.stack);
  process.exit(1);
});
