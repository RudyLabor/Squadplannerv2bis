#!/usr/bin/env node
/**
 * Vérifie le schéma actuel de la base de données
 */

const fs = require('fs');
const path = require('path');

async function main() {
  console.log('\n🔍 VERIFICATION DU SCHEMA\n');

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

  const client = new Client({
    connectionString: `postgresql://postgres:${encodeURIComponent(DB_PASSWORD)}@db.${projectRef}.supabase.co:5432/postgres`,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('✅ Connecté\n');

  // Lister TOUTES les tables
  console.log('📋 TOUTES LES TABLES:');
  const { rows: allTables } = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `);

  console.log(`   Total: ${allTables.length} tables\n`);
  allTables.forEach(t => console.log(`   - ${t.table_name}`));

  // Vérifier schéma de la table badges
  console.log('\n\n📋 SCHEMA TABLE "badges":');
  const { rows: badgesColumns } = await client.query(`
    SELECT
      column_name,
      data_type,
      character_maximum_length,
      is_nullable,
      column_default
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'badges'
    ORDER BY ordinal_position
  `);

  if (badgesColumns.length === 0) {
    console.log('   Table "badges" n\'existe pas\n');
  } else {
    console.log('');
    badgesColumns.forEach(col => {
      console.log(`   ${col.column_name}:`);
      console.log(`      Type: ${col.data_type}`);
      console.log(`      Nullable: ${col.is_nullable}`);
      console.log(`      Default: ${col.column_default || 'none'}`);
      console.log('');
    });
  }

  // Compter les badges existants
  try {
    const { rows } = await client.query(`SELECT COUNT(*) as count, id FROM badges GROUP BY id LIMIT 5`);
    console.log(`   Badges existants: ${rows.length}`);
    rows.forEach(r => console.log(`      - ${r.id}`));
  } catch (error) {
    console.log(`   Impossible de lire les badges: ${error.message}`);
  }

  // Vérifier autres tables phase 1 & 2
  const phaseTables = ['session_check_ins', 'reliability_scores', 'user_badges', 'roles', 'permissions'];

  console.log('\n\n📋 TABLES PHASE 1 & 2:');
  for (const table of phaseTables) {
    try {
      const { rows } = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`✅ ${table}: ${rows[0].count} rows`);
    } catch (error) {
      console.log(`❌ ${table}: N'existe pas`);
    }
  }

  await client.end();

  console.log('\n============================================\n');
}

main().catch(error => {
  console.error('\n❌ ERREUR:', error.message);
  console.error(error.stack);
  process.exit(1);
});
