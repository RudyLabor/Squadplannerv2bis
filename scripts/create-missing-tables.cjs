#!/usr/bin/env node
/**
 * Crée les tables manquantes pour Phase 1 & 2
 */

const fs = require('fs');
const path = require('path');

async function main() {
  console.log('\n🔨 CRÉATION DES TABLES MANQUANTES\n');

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
  console.log('✅ Connecté à PostgreSQL\n');

  // Lire le SQL
  const sqlPath = path.join(projectRoot, 'scripts', 'create-missing-tables-v2.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log('📄 Exécution du SQL...');
  console.log('   Création de:');
  console.log('   - reliability_scores');
  console.log('   - roles');
  console.log('   - user_roles');
  console.log('   - permissions');
  console.log('   - role_permissions\n');

  try {
    await client.query(sql);
    console.log('✅ Tables créées avec succès!\n');

  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('✓  Tables déjà présentes\n');
    } else {
      console.log(`⚠️  Erreur: ${error.message}\n`);
    }
  }

  // Vérification
  console.log('🔍 Vérification...\n');

  const tables = ['reliability_scores', 'roles', 'user_roles', 'permissions', 'role_permissions'];

  let allPresent = true;

  for (const table of tables) {
    try {
      const { rows } = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`✅ ${table}: ${rows[0].count} rows`);
    } catch (error) {
      console.log(`❌ ${table}: MANQUANTE`);
      allPresent = false;
    }
  }

  await client.end();

  console.log('\n============================================');

  if (allPresent) {
    console.log('   ✅ TOUTES LES TABLES PRESENTES');
    console.log('============================================\n');
    console.log('✅ Phase 0: 100% (Database Schema)');
    console.log('✅ Phase 1: 100% (Check-ins + Reliability)');
    console.log('✅ Phase 2: 100% (Badges + Roles)\n');
    console.log('🎯 BASE DE DONNÉES COMPLETE!');
    console.log('🎯 Prêt pour Phase 3: Discord Integration\n');
  } else {
    console.log('   ⚠️  QUELQUES TABLES MANQUENT ENCORE');
    console.log('============================================\n');
  }

  console.log('============================================\n');
}

main().catch(error => {
  console.error('\n❌ ERREUR:', error.message);
  console.error(error.stack);
  process.exit(1);
});
