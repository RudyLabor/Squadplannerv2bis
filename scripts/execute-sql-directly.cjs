#!/usr/bin/env node
/**
 * Exécute les migrations SQL directement via PostgreSQL
 * Utilise la connection directe (non-pooler)
 */

const fs = require('fs');
const path = require('path');

async function main() {
  console.log('\n🚀 Exécution des migrations SQL via PostgreSQL...\n');

  const projectRoot = path.join(__dirname, '..');

  // Lire configuration
  const envPath = path.join(projectRoot, '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const SUPABASE_URL = envContent.match(/VITE_SUPABASE_URL=(.+)/)?.[1];

  const envLocalPath = path.join(projectRoot, '.env.local');
  const envLocalContent = fs.readFileSync(envLocalPath, 'utf8');
  const DB_PASSWORD = envLocalContent.match(/SUPABASE_DB_PASSWORD=(.+)/)?.[1];

  if (!DB_PASSWORD) {
    console.error('❌ SUPABASE_DB_PASSWORD non trouvé dans .env.local');
    process.exit(1);
  }

  // Extraire project ref
  const projectRef = SUPABASE_URL.match(/https:\/\/(.+)\.supabase\.co/)?.[1];

  console.log('📋 Configuration:');
  console.log(`   Project: ${projectRef}`);
  console.log(`   Password: ${'*'.repeat(10)}\n`);

  // Installer pg si nécessaire
  console.log('💡 Vérification driver PostgreSQL...');
  const { execSync } = require('child_process');
  try {
    require.resolve('pg');
    console.log('✓ Driver pg disponible\n');
  } catch {
    console.log('   Installation en cours...');
    execSync('npm install pg', { cwd: projectRoot, stdio: 'inherit' });
    console.log('✓ Driver pg installé\n');
  }

  const { Client } = require('pg');

  // Lire les migrations
  const migrationPath = path.join(projectRoot, 'supabase', 'DEPLOY_ALL_MIGRATIONS.sql');
  const sqlContent = fs.readFileSync(migrationPath, 'utf8');

  console.log('📄 Migrations SQL:');
  console.log(`   Fichier: DEPLOY_ALL_MIGRATIONS.sql`);
  console.log(`   Taille: ${(sqlContent.length / 1024).toFixed(1)} KB`);
  console.log(`   Statements: ~${sqlContent.split(';').length}\n`);

  // Connection strings à essayer
  const connectionStrings = [
    // Direct connection
    {
      name: 'Direct Connection (port 5432)',
      connString: `postgresql://postgres:${encodeURIComponent(DB_PASSWORD)}@db.${projectRef}.supabase.co:5432/postgres`
    },
    // Pooler connection IPv4
    {
      name: 'Pooler Connection IPv4 (port 6543)',
      connString: `postgresql://postgres.${projectRef}:${encodeURIComponent(DB_PASSWORD)}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`
    },
    // Alternative pooler
    {
      name: 'Pooler Session Mode (port 5432)',
      connString: `postgresql://postgres.${projectRef}:${encodeURIComponent(DB_PASSWORD)}@aws-0-eu-central-1.pooler.supabase.com:5432/postgres`
    }
  ];

  let connected = false;
  let client = null;

  for (const { name, connString } of connectionStrings) {
    console.log(`🔌 Tentative: ${name}...`);

    client = new Client({
      connectionString: connString,
      ssl: {
        rejectUnauthorized: false
      },
      connectionTimeoutMillis: 10000
    });

    try {
      await client.connect();
      console.log(`✅ Connecté via ${name}\n`);
      connected = true;
      break;
    } catch (error) {
      console.log(`   ❌ Échec: ${error.message}`);
      try {
        await client.end();
      } catch {}
      client = null;
    }
  }

  if (!connected || !client) {
    console.error('\n❌ Impossible de se connecter à PostgreSQL');
    console.error('   Vérifiez que:');
    console.error('   1. Le password est correct');
    console.error('   2. La base de données est accessible');
    console.error('   3. Le projet Supabase est actif\n');
    process.exit(1);
  }

  // Exécuter les migrations
  console.log('📤 Exécution des migrations SQL...');
  console.log('   (cela peut prendre 30-60 secondes)\n');

  try {
    await client.query(sqlContent);
    console.log('✅ Migrations exécutées avec succès!\n');

    // Vérifier que les tables ont été créées
    const { rows } = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('check_ins', 'reliability_scores', 'badges', 'user_badges')
      ORDER BY table_name
    `);

    console.log('✅ Vérification des tables créées:');
    rows.forEach(row => {
      console.log(`   ✓ ${row.table_name}`);
    });
    console.log('');

  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution des migrations:');
    console.error(`   ${error.message}\n`);

    if (error.message.includes('already exists')) {
      console.log('⚠️  Certaines tables existent déjà (migrations déjà appliquées?)');
      console.log('   Continuez si c\'est intentionnel.\n');
    } else {
      await client.end();
      process.exit(1);
    }
  }

  await client.end();
  console.log('============================================');
  console.log('   ✅ MIGRATIONS SQL COMPLETES');
  console.log('============================================\n');
}

main().catch(error => {
  console.error('\n❌ ERREUR:', error.message);
  console.error(error.stack);
  process.exit(1);
});
