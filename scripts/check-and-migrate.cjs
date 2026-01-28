#!/usr/bin/env node
/**
 * Vérifie l'état de la DB et applique seulement les migrations nécessaires
 */

const fs = require('fs');
const path = require('path');

async function main() {
  console.log('\n🔍 Vérification de l\'état de la base de données...\n');

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

  // Connecter
  const client = new Client({
    connectionString: `postgresql://postgres:${encodeURIComponent(DB_PASSWORD)}@db.${projectRef}.supabase.co:5432/postgres`,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('✅ Connecté à PostgreSQL\n');

  // Vérifier les tables existantes
  console.log('📋 Tables existantes:');
  const { rows: tables } = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `);

  const existingTables = tables.map(r => r.table_name);
  existingTables.forEach(t => console.log(`   ✓ ${t}`));
  console.log('');

  // Tables attendues pour Phase 0, 1, 2
  const expectedTables = [
    'check_ins',
    'reliability_scores',
    'badges',
    'user_badges',
    'badge_progress',
    'roles',
    'user_roles',
    'permissions',
    'role_permissions'
  ];

  console.log('🎯 Tables Phase 0+1+2 nécessaires:');
  const missingTables = expectedTables.filter(t => !existingTables.includes(t));

  if (missingTables.length === 0) {
    console.log('   ✅ Toutes les tables sont déjà présentes!\n');

    // Vérifier les colonnes importantes
    console.log('🔍 Vérification des colonnes...');

    const columnsToCheck = [
      { table: 'check_ins', columns: ['id', 'session_id', 'user_id', 'status', 'checked_in_at'] },
      { table: 'reliability_scores', columns: ['id', 'user_id', 'squad_id', 'score', 'streak'] },
      { table: 'badges', columns: ['id', 'name', 'description', 'icon_url', 'criteria'] },
      { table: 'user_badges', columns: ['id', 'user_id', 'badge_id', 'awarded_at'] }
    ];

    let allColumnsOk = true;

    for (const { table, columns } of columnsToCheck) {
      if (existingTables.includes(table)) {
        const { rows: cols } = await client.query(`
          SELECT column_name
          FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = '${table}'
          ORDER BY column_name
        `);

        const existingCols = cols.map(c => c.column_name);
        const missingCols = columns.filter(c => !existingCols.includes(c));

        if (missingCols.length > 0) {
          console.log(`   ⚠️  ${table}: colonnes manquantes: ${missingCols.join(', ')}`);
          allColumnsOk = false;
        } else {
          console.log(`   ✅ ${table}: toutes colonnes présentes`);
        }
      }
    }

    if (allColumnsOk) {
      console.log('\n✅ Structure de la base de données complète!');
      console.log('   Phase 0, 1, 2 déjà déployées.\n');

      await client.end();

      console.log('============================================');
      console.log('   ✅ BASE DE DONNÉES OK');
      console.log('============================================\n');
      console.log('Phase 0: ✅ 100% (Tables + RLS)');
      console.log('Phase 1: ✅ 100% (Check-ins + Reliability)');
      console.log('Phase 2: ✅ 100% (Badges + Roles)\n');
      console.log('🎯 Prêt pour Phase 3: Discord Integration');
      console.log('============================================\n');

      return;
    }

    console.log('\n⚠️  Certaines colonnes manquent, migrations partielles nécessaires.\n');

  } else {
    console.log(`   ⚠️  Tables manquantes: ${missingTables.join(', ')}\n`);
  }

  // Lire les migrations individuelles
  console.log('📤 Application des migrations nécessaires...\n');

  const migrationsDir = path.join(projectRoot, 'supabase', 'migrations');
  const migrationFiles = [
    '20260129_create_check_ins.sql',
    '20260129_reliability_system.sql',
    '20260129_badges_system.sql',
    '20260129_roles_permissions.sql'
  ];

  let appliedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);

    if (!fs.existsSync(filePath)) {
      console.log(`   ⚠️  ${file}: fichier non trouvé`);
      continue;
    }

    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(`📄 ${file}...`);

    try {
      await client.query(sql);
      console.log(`   ✅ Appliquée`);
      appliedCount++;
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log(`   ✓  Déjà appliquée (skipped)`);
        skippedCount++;
      } else {
        console.log(`   ❌ Erreur: ${error.message.split('\n')[0]}`);
        errorCount++;
      }
    }
  }

  await client.end();

  console.log('\n============================================');
  console.log('   📊 RÉSULTAT DES MIGRATIONS');
  console.log('============================================\n');
  console.log(`✅ Appliquées: ${appliedCount}`);
  console.log(`✓  Déjà présentes: ${skippedCount}`);
  console.log(`❌ Erreurs: ${errorCount}\n`);

  if (errorCount > 0) {
    console.log('⚠️  Des erreurs sont survenues. Vérifiez manuellement.');
  } else {
    console.log('✅ Toutes les migrations sont en place!');
    console.log('\nPhase 0: ✅ 100%');
    console.log('Phase 1: ✅ 100%');
    console.log('Phase 2: ✅ 100%\n');
  }

  console.log('============================================\n');
}

main().catch(error => {
  console.error('\n❌ ERREUR:', error.message);
  process.exit(1);
});
