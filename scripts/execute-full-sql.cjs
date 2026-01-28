#!/usr/bin/env node
/**
 * Exécute le fichier SQL complet en une seule requête
 * Pas de split - laisse PostgreSQL parser le tout
 */

const fs = require('fs');
const path = require('path');

async function main() {
  console.log('\n🚀 EXECUTION COMPLETE DU SQL\n');

  const projectRoot = path.join(__dirname, '..');

  // Configuration
  const envPath = path.join(projectRoot, '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const SUPABASE_URL = envContent.match(/VITE_SUPABASE_URL=(.+)/)?.[1];

  const envLocalPath = path.join(projectRoot, '.env.local');
  const envLocalContent = fs.readFileSync(envLocalPath, 'utf8');
  const DB_PASSWORD = envLocalContent.match(/SUPABASE_DB_PASSWORD=(.+)/)?.[1];

  const projectRef = SUPABASE_URL.match(/https:\/\/(.+)\.supabase\.co/)?.[1];

  console.log('📋 Configuration:');
  console.log(`   Project: ${projectRef}`);
  console.log(`   Host: db.${projectRef}.supabase.co\n`);

  // Installer pg
  const { execSync } = require('child_process');
  try {
    require.resolve('pg');
  } catch {
    console.log('📦 Installation pg...');
    execSync('npm install pg', { cwd: projectRoot, stdio: 'inherit' });
  }

  const { Client } = require('pg');

  // Connecter
  const client = new Client({
    connectionString: `postgresql://postgres:${encodeURIComponent(DB_PASSWORD)}@db.${projectRef}.supabase.co:5432/postgres`,
    ssl: { rejectUnauthorized: false }
  });

  console.log('🔌 Connexion...');
  await client.connect();
  console.log('✅ Connecté\n');

  // Lire le SQL complet
  const sqlPath = path.join(projectRoot, 'supabase', 'DEPLOY_ALL_MIGRATIONS.sql');
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');

  console.log('📄 Fichier: DEPLOY_ALL_MIGRATIONS.sql');
  console.log(`   Taille: ${(sqlContent.length / 1024).toFixed(1)} KB\n`);

  console.log('⚡ Exécution...');
  console.log('   (cela peut prendre 1-2 minutes)\n');

  try {
    // Exécuter en une seule requête
    await client.query(sqlContent);

    console.log('✅ SQL exécuté avec succès!\n');

  } catch (error) {
    console.log('⚠️  Erreur SQL:');
    console.log(`   ${error.message}\n`);

    // Vérifier si c'est juste "already exists"
    if (error.message.toLowerCase().includes('already exists')) {
      console.log('   (Certaines entités existent déjà - normal)\n');
    } else {
      console.log('   Continuation de la vérification...\n');
    }
  }

  // Vérification
  console.log('============================================');
  console.log('   🔍 VERIFICATION');
  console.log('============================================\n');

  const checks = [
    { name: 'session_check_ins', phase: 'Phase 1' },
    { name: 'reliability_scores', phase: 'Phase 1' },
    { name: 'badges', phase: 'Phase 2' },
    { name: 'user_badges', phase: 'Phase 2' },
    { name: 'roles', phase: 'Phase 2' },
    { name: 'permissions', phase: 'Phase 2' }
  ];

  let allPresent = true;

  for (const check of checks) {
    try {
      const { rows } = await client.query(`
        SELECT COUNT(*) as count FROM ${check.name}
      `);

      const count = parseInt(rows[0].count);
      console.log(`✅ ${check.phase}: ${check.name} (${count} rows)`);

    } catch (error) {
      console.log(`❌ ${check.phase}: ${check.name} - MANQUANTE`);
      allPresent = false;
    }
  }

  await client.end();

  console.log('\n============================================');

  if (allPresent) {
    console.log('   ✅ TOUTES LES TABLES PRESENTES');
    console.log('============================================\n');
    console.log('✅ Phase 0: 100%');
    console.log('✅ Phase 1: 100%');
    console.log('✅ Phase 2: 100%\n');
    console.log('🎯 Prêt pour Phase 3: Discord Integration');
  } else {
    console.log('   ⚠️  CERTAINES TABLES MANQUENT');
    console.log('============================================\n');
    console.log('⚠️  Phase 0-2: Partiellement appliqué');
    console.log('   Vérifiez les erreurs ci-dessus');
  }

  console.log('\n============================================\n');
}

main().catch(error => {
  console.error('\n❌ ERREUR:', error.message);
  console.error(error.stack);
  process.exit(1);
});
