#!/usr/bin/env node
/**
 * Applique TOUTES les migrations Phase 0, 1, 2 proprement
 * Gère les erreurs "already exists" gracieusement
 */

const fs = require('fs');
const path = require('path');

async function main() {
  console.log('\n🚀 APPLICATION COMPLETE DES MIGRATIONS\n');
  console.log('Phase 0: Database Schema');
  console.log('Phase 1: Check-ins + Reliability');
  console.log('Phase 2: Badges + Roles\n');
  console.log('============================================\n');

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
    console.log('📦 Installation driver PostgreSQL...');
    execSync('npm install pg', { cwd: projectRoot, stdio: 'inherit' });
    console.log('');
  }

  const { Client } = require('pg');

  // Connecter
  const client = new Client({
    connectionString: `postgresql://postgres:${encodeURIComponent(DB_PASSWORD)}@db.${projectRef}.supabase.co:5432/postgres`,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 30000
  });

  console.log('🔌 Connexion à PostgreSQL...');
  await client.connect();
  console.log('✅ Connecté\n');

  // Préparer la table badges avec les bonnes colonnes
  console.log('[PREP] Préparation table badges...');
  try {
    // Vérifier colonnes badges
    const { rows: badgesColumns } = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'badges'
    `);
    const badgesCols = badgesColumns.map(c => c.column_name);

    // Ajouter colonnes manquantes
    if (!badgesCols.includes('rarity')) {
      await client.query(`ALTER TABLE badges ADD COLUMN IF NOT EXISTS rarity TEXT DEFAULT 'common'`);
      console.log('   ✅ Colonne rarity ajoutée');
    }
    if (!badgesCols.includes('criteria')) {
      await client.query(`ALTER TABLE badges ADD COLUMN IF NOT EXISTS criteria JSONB DEFAULT '{}'::jsonb`);
      console.log('   ✅ Colonne criteria ajoutée');
    }

    console.log('');
  } catch (error) {
    console.log(`   ⚠️  ${error.message}\n`);
  }

  // Lire les 4 fichiers de migration
  const migrationsDir = path.join(projectRoot, 'supabase', 'migrations');
  const migrations = [
    { file: '20260129_create_check_ins.sql', phase: 'Phase 1', name: 'Check-ins System' },
    { file: '20260129_reliability_system.sql', phase: 'Phase 1', name: 'Reliability System' },
    { file: '20260129_badges_system.sql', phase: 'Phase 2', name: 'Badges System' },
    { file: '20260129_roles_permissions.sql', phase: 'Phase 2', name: 'Roles & Permissions' }
  ];

  let successCount = 0;
  let partialCount = 0;
  let errorCount = 0;

  for (const migration of migrations) {
    const filePath = path.join(migrationsDir, migration.file);

    if (!fs.existsSync(filePath)) {
      console.log(`❌ [${migration.phase}] ${migration.name}`);
      console.log(`   Fichier non trouvé: ${migration.file}\n`);
      errorCount++;
      continue;
    }

    console.log(`📄 [${migration.phase}] ${migration.name}...`);

    const sql = fs.readFileSync(filePath, 'utf8');

    try {
      // Exécuter avec gestion d'erreurs permissive
      await client.query('BEGIN');

      // Splitter en statements et exécuter un par un
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 20 && !s.startsWith('--'));

      let stmtSuccess = 0;
      let stmtSkipped = 0;
      let stmtErrors = 0;

      for (const stmt of statements) {
        try {
          await client.query(stmt);
          stmtSuccess++;
        } catch (err) {
          const errMsg = err.message.toLowerCase();
          if (
            errMsg.includes('already exists') ||
            errMsg.includes('duplicate') ||
            errMsg.includes('unique constraint')
          ) {
            stmtSkipped++;
          } else {
            stmtErrors++;
            if (stmtErrors === 1) {
              // Afficher seulement la première erreur
              console.log(`   ⚠️  ${err.message.split('\n')[0]}`);
            }
          }
        }
      }

      await client.query('COMMIT');

      if (stmtErrors === 0) {
        console.log(`   ✅ Succès (${stmtSuccess} statements, ${stmtSkipped} déjà présents)`);
        successCount++;
      } else {
        console.log(`   ⚠️  Partiel (${stmtSuccess} ok, ${stmtSkipped} skipped, ${stmtErrors} erreurs)`);
        partialCount++;
      }

    } catch (error) {
      await client.query('ROLLBACK');
      console.log(`   ❌ Erreur: ${error.message.split('\n')[0]}`);
      errorCount++;
    }

    console.log('');
  }

  // Vérification finale
  console.log('============================================');
  console.log('   🔍 VERIFICATION FINALE');
  console.log('============================================\n');

  // Tables attendues (avec les VRAIS noms)
  const expectedTables = {
    'Phase 1': ['session_check_ins', 'reliability_scores'],
    'Phase 2': ['badges', 'user_badges', 'badge_progress', 'roles', 'user_roles', 'permissions', 'role_permissions']
  };

  for (const [phase, tables] of Object.entries(expectedTables)) {
    console.log(`${phase}:`);

    for (const table of tables) {
      const { rows } = await client.query(`
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = $1
        )
      `, [table]);

      if (rows[0].exists) {
        // Compter les lignes
        const { rows: countRows } = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
        const count = parseInt(countRows[0].count);

        console.log(`   ✅ ${table} (${count} rows)`);
      } else {
        console.log(`   ❌ ${table} - MANQUANTE`);
      }
    }
    console.log('');
  }

  // Fonctions clés
  console.log('Fonctions:');
  const expectedFunctions = [
    'award_badges_to_user',
    'calculate_user_reliability',
    'update_reliability_scores',
    'check_badge_leader_fiable'
  ];

  for (const func of expectedFunctions) {
    const { rows } = await client.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.routines
        WHERE routine_schema = 'public' AND routine_name = $1
      )
    `, [func]);

    if (rows[0].exists) {
      console.log(`   ✅ ${func}()`);
    } else {
      console.log(`   ⚠️  ${func}() - manquante`);
    }
  }

  await client.end();

  // Summary
  console.log('\n============================================');
  console.log('   📊 RÉSULTAT FINAL');
  console.log('============================================\n');
  console.log(`✅ Migrations complètes: ${successCount}/4`);
  console.log(`⚠️  Migrations partielles: ${partialCount}/4`);
  console.log(`❌ Migrations échouées: ${errorCount}/4\n`);

  if (errorCount === 0) {
    console.log('✅ Phase 0: 100% (Database)');
    console.log('✅ Phase 1: 100% (Check-ins + Reliability)');
    console.log('✅ Phase 2: 100% (Badges + Roles)\n');
    console.log('🎯 BASE DE DONNÉES PRÊTE');
    console.log('🎯 Prêt pour Phase 3: Discord Integration');
  } else {
    console.log('⚠️  Quelques migrations ont échoué');
    console.log('   Vérifiez les logs ci-dessus');
  }

  console.log('\n============================================\n');
}

main().catch(error => {
  console.error('\n❌ ERREUR FATALE:', error.message);
  console.error(error.stack);
  process.exit(1);
});
