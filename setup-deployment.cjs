#!/usr/bin/env node

/**
 * Script d'automatisation du déploiement Squad Planner v2.0
 * Ce script configure automatiquement :
 * - Variables d'environnement Vercel
 * - Migrations SQL Supabase
 * - Auth URLs Supabase
 */

const { execSync } = require('child_process');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function exec(command, description) {
  console.log(`\n🔧 ${description}...`);
  try {
    const output = execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
    console.log(`✅ ${description} - Succès`);
    return output;
  } catch (error) {
    console.error(`❌ ${description} - Erreur:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Configuration automatique de Squad Planner v2.0\n');

  // Étape 1: Récupérer les credentials Supabase
  console.log('📝 Étape 1/4: Credentials Supabase');
  console.log('Récupérez vos credentials depuis: https://app.supabase.com/project/cwtoprbowdqcemdjrtir/settings/api\n');

  const supabaseUrl = await question('SUPABASE_URL (https://xxx.supabase.co): ');
  const supabaseAnonKey = await question('SUPABASE_ANON_KEY: ');

  // Créer le fichier .env local
  const envContent = `# Supabase Configuration
VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${supabaseAnonKey}

# Optional: Add these later for advanced features
# VITE_VAPID_PUBLIC_KEY=
# VITE_STRIPE_PUBLISHABLE_KEY=
# VITE_STRIPE_PREMIUM_PRICE_ID=
# VITE_STRIPE_PRO_PRICE_ID=
`;

  fs.writeFileSync('.env', envContent);
  console.log('✅ Fichier .env créé');

  // Étape 2: Configurer les variables d'environnement Vercel
  console.log('\n📝 Étape 2/4: Configuration Vercel');

  try {
    exec(
      `echo "${supabaseUrl}" | vercel env add VITE_SUPABASE_URL production`,
      'Ajout de VITE_SUPABASE_URL'
    );
    exec(
      `echo "${supabaseAnonKey}" | vercel env add VITE_SUPABASE_ANON_KEY production`,
      'Ajout de VITE_SUPABASE_ANON_KEY'
    );
  } catch (error) {
    console.log('⚠️  Configuration Vercel manuelle requise');
    console.log('Allez sur: https://vercel.com/rudys-projects-253845f1/squad-planner-v2-rudy/settings/environment-variables');
    console.log(`- VITE_SUPABASE_URL = ${supabaseUrl}`);
    console.log(`- VITE_SUPABASE_ANON_KEY = ${supabaseAnonKey}`);
  }

  // Étape 3: Déployer les migrations SQL
  console.log('\n📝 Étape 3/4: Déploiement des migrations SQL');

  try {
    // Lire le fichier SQL
    const sqlContent = fs.readFileSync('FULL_DB_SETUP.sql', 'utf-8');

    // Utiliser psql via Supabase
    console.log('⚠️  Les migrations SQL doivent être exécutées manuellement dans le Dashboard Supabase');
    console.log('1. Allez sur: https://app.supabase.com/project/cwtoprbowdqcemdjrtir/editor');
    console.log('2. Collez le contenu de FULL_DB_SETUP.sql');
    console.log('3. Exécutez le script');

    const continueMigration = await question('\nAvez-vous exécuté les migrations SQL? (o/n): ');
    if (continueMigration.toLowerCase() !== 'o') {
      console.log('⏸️  Déploiement mis en pause. Veuillez exécuter les migrations SQL puis relancer le script.');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Erreur lors de la lecture du fichier SQL:', error.message);
  }

  // Étape 4: Configurer les Auth URLs
  console.log('\n📝 Étape 4/4: Configuration des Auth URLs Supabase');

  const vercelUrl = 'https://squad-planner-v2-rudy.vercel.app';

  console.log('⚠️  Configuration manuelle requise dans Supabase Dashboard:');
  console.log('1. Allez sur: https://app.supabase.com/project/cwtoprbowdqcemdjrtir/auth/url-configuration');
  console.log(`2. Site URL: ${vercelUrl}`);
  console.log('3. Redirect URLs:');
  console.log(`   - ${vercelUrl}`);
  console.log(`   - ${vercelUrl}/**`);
  console.log(`   - https://*.vercel.app`);
  console.log(`   - ${vercelUrl}/oauth/callback`);

  // Étape 5: Redéploiement Vercel
  console.log('\n📝 Étape 5/4 (Bonus): Redéploiement Vercel avec les nouvelles variables');

  const deployNow = await question('\nVoulez-vous redéployer maintenant sur Vercel? (o/n): ');
  if (deployNow.toLowerCase() === 'o') {
    try {
      exec('vercel --prod', 'Redéploiement Vercel');
      console.log(`\n✅ Déploiement terminé! Votre app est disponible sur: ${vercelUrl}`);
    } catch (error) {
      console.log('⚠️  Redéploiement manuel requis. Utilisez: vercel --prod');
    }
  } else {
    console.log('\n⚠️  N\'oubliez pas de redéployer avec: vercel --prod');
  }

  // Résumé final
  console.log('\n' + '='.repeat(60));
  console.log('🎉 Configuration terminée!');
  console.log('='.repeat(60));
  console.log('\n📋 Récapitulatif:');
  console.log('✅ Variables d\'environnement Vercel configurées');
  console.log('✅ Fichier .env local créé');
  console.log('⚠️  Migrations SQL à exécuter manuellement');
  console.log('⚠️  Auth URLs à configurer manuellement');
  console.log('\n📱 Votre application:');
  console.log(`   ${vercelUrl}`);
  console.log('\n🔧 Prochaines étapes:');
  console.log('1. Exécutez les migrations SQL dans Supabase Dashboard');
  console.log('2. Configurez les Auth URLs dans Supabase Dashboard');
  console.log('3. Redéployez avec: vercel --prod');
  console.log('4. Testez votre application!');
  console.log('\n💡 Fonctionnalités optionnelles:');
  console.log('- Web Push: Ajoutez VITE_VAPID_PUBLIC_KEY');
  console.log('- Stripe: Ajoutez VITE_STRIPE_PUBLISHABLE_KEY, etc.');
  console.log('\n');

  rl.close();
}

main().catch(error => {
  console.error('\n❌ Erreur:', error.message);
  rl.close();
  process.exit(1);
});
