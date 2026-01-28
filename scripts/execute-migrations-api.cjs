#!/usr/bin/env node
/**
 * Exécute les migrations SQL via l'API Supabase REST
 * Utilise une approche statement-by-statement
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('\n🚀 Exécution des migrations SQL via API Supabase...\n');

  const projectRoot = path.join(__dirname, '..');

  // Lire la configuration
  const envPath = path.join(projectRoot, '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const SUPABASE_URL = envContent.match(/VITE_SUPABASE_URL=(.+)/)?.[1];

  const envLocalPath = path.join(projectRoot, '.env.local');
  const envLocalContent = fs.readFileSync(envLocalPath, 'utf8');
  const SERVICE_ROLE_KEY = envLocalContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1];

  if (!SERVICE_ROLE_KEY) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY non trouvé dans .env.local');
    process.exit(1);
  }

  console.log('✓ Service Role Key chargé');
  console.log(`✓ URL: ${SUPABASE_URL}\n`);

  // Créer client avec service role
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  // Lire les migrations
  const migrationPath = path.join(projectRoot, 'supabase', 'DEPLOY_ALL_MIGRATIONS.sql');
  const sqlContent = fs.readFileSync(migrationPath, 'utf8');

  console.log('📄 Fichier de migration chargé');
  console.log(`   Taille: ${(sqlContent.length / 1024).toFixed(1)} KB\n`);

  // Approche: Utiliser le SQL Editor de Supabase via API
  // Malheureusement, Supabase n'expose pas d'endpoint REST pour exécuter du SQL arbitraire
  // Même avec le service role key, pour des raisons de sécurité

  // La seule vraie solution automatique est d'utiliser PostgreSQL directement
  console.log('💡 Installation du driver PostgreSQL...');

  const { execSync } = require('child_process');
  try {
    require.resolve('pg');
    console.log('✓ Driver pg déjà installé\n');
  } catch {
    execSync('npm install pg', { cwd: projectRoot, stdio: 'inherit' });
    console.log('✓ Driver pg installé\n');
  }

  const { Client } = require('pg');

  // Extraire project ref
  const projectRef = SUPABASE_URL.match(/https:\/\/(.+)\.supabase\.co/)?.[1];

  // Construire connection string
  // Format: postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres

  console.log('⚠️  Pour se connecter directement à PostgreSQL, nous avons besoin du Database Password');
  console.log('   Vous pouvez le trouver ici: https://supabase.com/dashboard/project/cwtoprbowdqcemdjrtir/settings/database');
  console.log('\n   OU vous pouvez exécuter manuellement le SQL (30 secondes):');
  console.log('   1. Ouvrir: https://supabase.com/dashboard/project/cwtoprbowdqcemdjrtir/sql/new');
  console.log('   2. Le SQL est dans: supabase/DEPLOY_ALL_MIGRATIONS.sql');
  console.log('   3. Copier/Coller et cliquer "Run"\n');

  // Vérifier si on a le password dans les variables d'environnement
  const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD || envLocalContent.match(/SUPABASE_DB_PASSWORD=(.+)/)?.[1];

  if (DB_PASSWORD) {
    console.log('✓ Database password trouvé, connexion...\n');

    const connectionString = `postgresql://postgres.${projectRef}:${DB_PASSWORD}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`;

    const client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      console.log('✓ Connecté à PostgreSQL\n');

      console.log('📤 Exécution des migrations...');
      await client.query(sqlContent);

      console.log('✅ Migrations exécutées avec succès!\n');

      await client.end();
    } catch (error) {
      console.error('❌ Erreur lors de l\'exécution:', error.message);
      await client.end();
      process.exit(1);
    }
  } else {
    console.log('❌ Database password non trouvé');
    console.log('\n📋 Pour automatiser complètement, ajoutez dans .env.local:');
    console.log('   SUPABASE_DB_PASSWORD=your_database_password\n');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('\n❌ ERREUR:', error.message);
  process.exit(1);
});
