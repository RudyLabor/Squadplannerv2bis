/**
 * Script de déploiement automatique des migrations SQL
 * Exécute toutes les migrations dans l'ordre via l'API Supabase
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in environment');
  console.error('   Set it with: export SUPABASE_SERVICE_ROLE_KEY=your_key');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const migrations = [
  '20260129_create_check_ins.sql',
  '20260129_reliability_system.sql',
  '20260129_badges_system.sql',
  '20260129_roles_permissions.sql',
];

async function runMigration(filename) {
  console.log(`\n📄 Running migration: ${filename}`);

  const filepath = path.join(__dirname, '..', 'supabase', 'migrations', filename);

  if (!fs.existsSync(filepath)) {
    console.log(`⚠️  File not found: ${filepath}`);
    return false;
  }

  const sql = fs.readFileSync(filepath, 'utf8');

  try {
    // Utiliser rpc pour exécuter SQL brut
    const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql });

    if (error) {
      console.error(`❌ Error in ${filename}:`, error.message);
      return false;
    }

    console.log(`✅ Migration ${filename} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to execute ${filename}:`, error.message);
    return false;
  }
}

async function deployAll() {
  console.log('🚀 Starting migration deployment...\n');

  let successCount = 0;
  let failCount = 0;

  for (const migration of migrations) {
    const success = await runMigration(migration);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log('\n📊 Deployment Summary:');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);

  if (failCount === 0) {
    console.log('\n🎉 All migrations deployed successfully!');
  } else {
    console.log('\n⚠️  Some migrations failed. Check errors above.');
  }
}

deployAll().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
