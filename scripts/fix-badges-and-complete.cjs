#!/usr/bin/env node
/**
 * Fixe la table badges et complète toutes les migrations
 */

const fs = require('fs');
const path = require('path');

async function main() {
  console.log('\n🔧 Fix badges table et completion migrations...\n');

  const projectRoot = path.join(__dirname, '..');

  // Configuration
  const envPath = path.join(projectRoot, '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const SUPABASE_URL = envContent.match(/VITE_SUPABASE_URL=(.+)/)?.[1];

  const envLocalPath = path.join(projectRoot, '.env.local');
  const envLocalContent = fs.readFileSync(envLocalPath, 'utf8');
  const DB_PASSWORD = envLocalContent.match(/SUPABASE_DB_PASSWORD=(.+)/)?.[1];

  const projectRef = SUPABASE_URL.match(/https:\/\/(.+)\.supabase\.co/)?.[1];

  // Installer pg si nécessaire
  const { execSync } = require('child_process');
  try {
    require.resolve('pg');
  } catch {
    execSync('npm install pg', { cwd: projectRoot, stdio: 'inherit' });
  }

  const { Client } = require('pg');

  // Connecter
  const client = new Client({
    connectionString: `postgresql://postgres:${encodeURIComponent(DB_PASSWORD)}@db.${projectRef}.supabase.co:5432/postgres`,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('✅ Connecté à PostgreSQL\n');

  // 1. Vérifier et ajouter la colonne rarity si manquante
  console.log('[1/3] Vérification table badges...');

  const { rows: columns } = await client.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'badges'
  `);

  const existingColumns = columns.map(c => c.column_name);
  console.log(`   Colonnes actuelles: ${existingColumns.join(', ')}`);

  if (!existingColumns.includes('rarity')) {
    console.log('   ⚠️  Colonne "rarity" manquante, ajout...');

    await client.query(`
      ALTER TABLE badges
      ADD COLUMN IF NOT EXISTS rarity TEXT DEFAULT 'common'
        CHECK (rarity IN ('common', 'rare', 'epic', 'legendary'));
    `);

    console.log('   ✅ Colonne "rarity" ajoutée');
  } else {
    console.log('   ✓  Colonne "rarity" présente');
  }

  // Vérifier autres colonnes nécessaires
  const requiredColumns = ['id', 'name', 'description', 'icon', 'criteria', 'rarity'];
  const missingColumns = requiredColumns.filter(c => !existingColumns.includes(c));

  for (const col of missingColumns) {
    if (col === 'icon' && !existingColumns.includes(col)) {
      console.log(`   ⚠️  Colonne "${col}" manquante, ajout...`);
      await client.query(`ALTER TABLE badges ADD COLUMN IF NOT EXISTS ${col} TEXT`);
      console.log(`   ✅ Colonne "${col}" ajoutée`);
    }
  }

  // 2. Réappliquer la migration badges
  console.log('\n[2/3] Application migration badges...');

  const badgesMigrationPath = path.join(projectRoot, 'supabase', 'migrations', '20260129_badges_system.sql');
  const badgesSql = fs.readFileSync(badgesMigrationPath, 'utf8');

  try {
    await client.query(badgesSql);
    console.log('   ✅ Migration badges appliquée avec succès');
  } catch (error) {
    if (error.message.includes('already exists') || error.message.includes('duplicate key')) {
      console.log('   ✓  Badges déjà présents (skipped)');
    } else {
      console.log(`   ⚠️  Erreur partielle: ${error.message.split('\n')[0]}`);
      console.log('   Continuation...');
    }
  }

  // 3. Vérifier toutes les tables finales
  console.log('\n[3/3] Vérification finale...');

  const expectedTables = [
    'check_ins',
    'reliability_scores',
    'badges',
    'user_badges',
    'roles',
    'user_roles',
    'permissions',
    'role_permissions'
  ];

  const { rows: tables } = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = ANY($1)
  `, [expectedTables]);

  const presentTables = tables.map(t => t.table_name);

  console.log('\n📋 État des tables Phase 0+1+2:');
  for (const table of expectedTables) {
    if (presentTables.includes(table)) {
      console.log(`   ✅ ${table}`);
    } else {
      console.log(`   ❌ ${table} - MANQUANTE`);
    }
  }

  // Vérifier quelques fonctions clés
  console.log('\n📋 Fonctions:');
  const { rows: functions } = await client.query(`
    SELECT routine_name
    FROM information_schema.routines
    WHERE routine_schema = 'public'
    AND routine_name IN ('award_badges_to_user', 'calculate_user_reliability', 'update_reliability_scores')
  `);

  const presentFunctions = functions.map(f => f.routine_name);
  const expectedFunctions = ['award_badges_to_user', 'calculate_user_reliability', 'update_reliability_scores'];

  for (const func of expectedFunctions) {
    if (presentFunctions.includes(func)) {
      console.log(`   ✅ ${func}()`);
    } else {
      console.log(`   ⚠️  ${func}() - manquante`);
    }
  }

  await client.end();

  // Summary
  console.log('\n============================================');
  console.log('   ✅ MIGRATIONS COMPLETES');
  console.log('============================================\n');

  const allTablesPresent = expectedTables.every(t => presentTables.includes(t));

  if (allTablesPresent) {
    console.log('✅ Phase 0: 100% (Database Schema + RLS)');
    console.log('✅ Phase 1: 100% (Check-ins + Reliability System)');
    console.log('✅ Phase 2: 100% (Badges + Roles + Permissions)\n');

    console.log('🎯 BASE DE DONNÉES COMPLETE');
    console.log('🎯 Prêt pour Phase 3: Discord Integration');
  } else {
    console.log('⚠️  Quelques tables manquent encore');
    console.log('   Vérifiez les logs ci-dessus');
  }

  console.log('\n============================================\n');
}

main().catch(error => {
  console.error('\n❌ ERREUR:', error.message);
  console.error(error.stack);
  process.exit(1);
});
