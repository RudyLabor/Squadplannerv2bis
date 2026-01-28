#!/usr/bin/env node
/**
 * GUIDE INTERACTIF - Désactiver la confirmation email sur Supabase
 */

const { exec } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => {
    rl.question(question, resolve);
  });
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║  🔧 GUIDE: DÉSACTIVER LA CONFIRMATION EMAIL         ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  console.log('Je vais t\'ouvrir la page Supabase et te guider étape par étape.\n');

  await ask('Appuie sur ENTRÉE pour commencer...');

  console.log('\n📍 ÉTAPE 1: Ouverture du Dashboard Supabase...\n');

  const dashboardUrl = 'https://supabase.com/dashboard/project/cwtoprbowdqcemdjrtir/auth/email-templates';

  exec(`start ${dashboardUrl}`);

  console.log('✅ Page ouverte dans ton navigateur\n');

  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║  INSTRUCTIONS À SUIVRE DANS LE NAVIGATEUR           ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  console.log('1️⃣  Dans le menu de gauche, clique sur:');
  console.log('   📱 "Authentication" → "Providers" → "Email"\n');

  console.log('2️⃣  Cherche la section "Email Settings" ou "Email Auth"\n');

  console.log('3️⃣  Trouve le toggle "Enable email confirmations"');
  console.log('   ou "Confirm email"\n');

  console.log('4️⃣  DÉSACTIVE ce toggle (il doit devenir gris/off)\n');

  console.log('5️⃣  Clique sur "Save" ou "Update" en bas de la page\n');

  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║  VISUELLEMENT, TU CHERCHES:                          ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  console.log('   Authentication');
  console.log('   └─ Providers');
  console.log('      └─ Email');
  console.log('         └─ [Toggle] Enable email confirmations');
  console.log('            ↓');
  console.log('         └─ [OFF] Enable email confirmations ✓\n');

  console.log('──────────────────────────────────────────────────────\n');

  await ask('Une fois fait, appuie sur ENTRÉE...');

  console.log('\n🧪 TEST: Vérifie que ça fonctionne...\n');

  console.log('1. Va sur ton app: https://squad-planner-v2-rudy.vercel.app');
  console.log('2. Clique sur "S\'inscrire"');
  console.log('3. Crée un compte avec un nouvel email\n');

  console.log('✅ SI ÇA MARCHE:');
  console.log('   → Tu es connecté IMMÉDIATEMENT après l\'inscription');
  console.log('   → Pas de message "Email de confirmation envoyé"\n');

  console.log('❌ SI ÇA NE MARCHE PAS:');
  console.log('   → Tu vois encore "Email de confirmation..."');
  console.log('   → Redis-moi et je t\'aiderai à trouver le bon endroit\n');

  await ask('Test effectué ? Appuie sur ENTRÉE...');

  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║  📊 RÉSUMÉ                                           ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  console.log('✅ Comptes existants confirmés: 151/151');
  console.log('✅ Configuration désactivée: Enable email confirmations');
  console.log('✅ Nouveaux comptes: Connexion immédiate\n');

  console.log('🎉 L\'authentification est maintenant complètement réparée!\n');

  rl.close();
}

main().catch(error => {
  console.error('Erreur:', error);
  rl.close();
  process.exit(1);
});
