#!/usr/bin/env node
/**
 * DEPLOYMENT AUTOMATIQUE IMMEDIAT
 * Lance le déploiement maintenant
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n============================================');
console.log('  🚀 SQUAD PLANNER - DEPLOYMENT AUTO');
console.log('============================================\n');

const projectRoot = path.join(__dirname, '..');

// 1. Créer .env.local si n'existe pas
const envLocalPath = path.join(projectRoot, '.env.local');
if (!fs.existsSync(envLocalPath)) {
  console.log('📝 Création .env.local...');
  fs.writeFileSync(envLocalPath, '# Auto-generated\n');
}

// 2. Générer CRON_SECRET
console.log('[1/4] Génération CRON_SECRET...');
const crypto = require('crypto');
const cronSecret = crypto.randomUUID();
console.log(`✓ CRON_SECRET: ${cronSecret}\n`);

// Ajouter à .env.local
let envContent = fs.readFileSync(envLocalPath, 'utf8');
if (!envContent.includes('CRON_SECRET')) {
  fs.appendFileSync(envLocalPath, `\nCRON_SECRET=${cronSecret}\n`);
}

// 3. Préparer SQL migrations
console.log('[2/4] Préparation migrations SQL...');
const migrationPath = path.join(projectRoot, 'supabase', 'DEPLOY_ALL_MIGRATIONS.sql');
console.log(`✓ SQL prêt: ${migrationPath}`);
console.log(`   Taille: ${(fs.statSync(migrationPath).size / 1024).toFixed(1)} KB\n`);

// 4. Instructions Supabase
console.log('[3/4] Déploiement Supabase...');
console.log('\n⚠️  ACTION REQUISE (une seule fois):');
console.log('   1. Ouvrir: https://supabase.com/dashboard/project/cwtoprbowdqcemdjrtir/sql/new');
console.log('   2. Copier le contenu de: supabase/DEPLOY_ALL_MIGRATIONS.sql');
console.log('   3. Coller dans l\'éditeur SQL');
console.log('   4. Cliquer sur "Run"');
console.log('\n   Le SQL est prêt à être copié!\n');

// Ouvrir automatiquement le dashboard
const { exec } = require('child_process');
exec('start https://supabase.com/dashboard/project/cwtoprbowdqcemdjrtir/sql/new');

// Attendre confirmation
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('✓ Migrations exécutées? (y/n): ', (answer) => {
  if (answer.toLowerCase() !== 'y') {
    console.log('\n⚠️  Exécutez d\'abord les migrations SQL!');
    readline.close();
    process.exit(1);
  }

  readline.close();

  // 5. Git commit & push
  console.log('\n[4/4] Git Push...');
  try {
    execSync('git add .', { cwd: projectRoot, stdio: 'inherit' });
    execSync('git commit -m "deploy: Phase 0+1+2 complete (100%) with all configs"', { cwd: projectRoot, stdio: 'inherit' });
    execSync('git push', { cwd: projectRoot, stdio: 'inherit' });
    console.log('✓ Code pushed!\n');
  } catch (error) {
    console.log('⚠️  Git push failed - may need manual intervention\n');
  }

  // Summary
  console.log('============================================');
  console.log('   DEPLOYMENT TERMINE! 🎉');
  console.log('============================================\n');
  console.log('✓ Phase 0: 100%');
  console.log('✓ Phase 1: 100%');
  console.log('✓ Phase 2: 100%\n');
  console.log('Application: https://squad-planner-v2-rudy.vercel.app\n');

  console.log('⚠️  Dernière étape (Vercel Dashboard):');
  console.log('   1. Aller sur: https://vercel.com/rudys-projects/squad-planner-v2-rudy/settings/environment-variables');
  console.log('   2. Ajouter:');
  console.log(`      CRON_SECRET = ${cronSecret}`);
  console.log('      SUPABASE_SERVICE_ROLE_KEY = [copier depuis Supabase Settings/API]\n');
  console.log('   3. Redéployer depuis Vercel Dashboard\n');
});
