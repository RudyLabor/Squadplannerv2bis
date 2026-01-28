#!/usr/bin/env node

/**
 * Script d'automatisation COMPLÈTE du déploiement Squad Planner v2.0
 * Utilise les APIs Supabase et Vercel pour tout automatiser
 */

const { execSync } = require('child_process');
const fs = require('fs');
const https = require('https');

function exec(command, silent = false) {
  try {
    const output = execSync(command, {
      encoding: 'utf-8',
      stdio: silent ? 'pipe' : 'inherit'
    });
    return output;
  } catch (error) {
    if (!silent) throw error;
    return error.stdout || '';
  }
}

async function getSupabaseCredentials() {
  console.log('🔑 Récupération automatique des credentials Supabase...');

  try {
    // Récupérer les informations du projet via Supabase CLI
    const projectInfo = exec('npx supabase@latest projects list --output json', true);
    const projects = JSON.parse(projectInfo);
    const project = projects.find(p => p.id === 'cwtoprbowdqcemdjrtir');

    if (!project) {
      throw new Error('Projet non trouvé');
    }

    // L'URL est construite à partir de l'ID du projet
    const supabaseUrl = `https://${project.id}.supabase.co`;

    console.log('✅ URL Supabase récupérée:', supabaseUrl);

    // Pour la clé anon, nous devons la récupérer depuis le dashboard
    // ou utiliser l'API Management de Supabase
    console.log('\n⚠️  Pour la clé ANON, ouvrez:');
    console.log(`https://app.supabase.com/project/${project.id}/settings/api`);
    console.log('\nCopiez la "anon public" key et sauvegardez-la dans le fichier .env\n');

    return {
      url: supabaseUrl,
      projectId: project.id
    };
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    return null;
  }
}

async function main() {
  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('   🚀 Configuration AUTOMATIQUE Squad Planner v2.0');
  console.log('══════════════════════════════════════════════════════════════\n');

  // Étape 1: Récupérer les credentials Supabase
  const credentials = await getSupabaseCredentials();

  if (!credentials) {
    console.log('\n❌ Impossible de récupérer les credentials automatiquement');
    console.log('Utilisez plutôt: node setup-deployment.js');
    process.exit(1);
  }

  // Étape 2: Ouvrir automatiquement les pages nécessaires
  console.log('\n📝 Ouverture automatique des pages de configuration...\n');

  const urls = [
    {
      name: 'Supabase API Keys',
      url: `https://app.supabase.com/project/${credentials.projectId}/settings/api`,
      description: 'Copiez la "anon public" key'
    },
    {
      name: 'Supabase SQL Editor',
      url: `https://app.supabase.com/project/${credentials.projectId}/sql/new`,
      description: 'Collez le contenu de FULL_DB_SETUP.sql et exécutez'
    },
    {
      name: 'Supabase Auth URLs',
      url: `https://app.supabase.com/project/${credentials.projectId}/auth/url-configuration`,
      description: 'Configurez les URLs de redirection'
    },
    {
      name: 'Vercel Environment Variables',
      url: 'https://vercel.com/rudys-projects-253845f1/squad-planner-v2-rudy/settings/environment-variables',
      description: 'Variables automatiquement configurées'
    }
  ];

  urls.forEach((item, index) => {
    console.log(`${index + 1}. ${item.name}`);
    console.log(`   ${item.description}`);
    console.log(`   ${item.url}\n`);

    // Ouvrir automatiquement dans le navigateur
    try {
      if (process.platform === 'win32') {
        exec(`start ${item.url}`, true);
      } else if (process.platform === 'darwin') {
        exec(`open ${item.url}`, true);
      } else {
        exec(`xdg-open ${item.url}`, true);
      }
    } catch (error) {
      console.log(`   ⚠️ Ouvrez manuellement ce lien`);
    }
  });

  // Attendre un peu pour laisser le temps à l'utilisateur de voir les URLs
  console.log('⏳ Attendez 5 secondes...\n');
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Étape 3: Créer un template de configuration
  console.log('📝 Création du fichier de configuration...\n');

  const configTemplate = {
    supabase: {
      url: credentials.url,
      anon_key: 'COPIEZ_DEPUIS_DASHBOARD',
      project_id: credentials.projectId
    },
    vercel: {
      project_url: 'https://squad-planner-v2-rudy.vercel.app',
      env_vars: {
        VITE_SUPABASE_URL: credentials.url,
        VITE_SUPABASE_ANON_KEY: 'COPIEZ_DEPUIS_DASHBOARD'
      }
    },
    auth_urls: {
      site_url: 'https://squad-planner-v2-rudy.vercel.app',
      redirect_urls: [
        'https://squad-planner-v2-rudy.vercel.app',
        'https://squad-planner-v2-rudy.vercel.app/**',
        'https://*.vercel.app',
        'https://squad-planner-v2-rudy.vercel.app/oauth/callback'
      ]
    },
    instructions: {
      step_1: 'Copiez la clé ANON depuis Supabase Dashboard',
      step_2: 'Remplacez COPIEZ_DEPUIS_DASHBOARD dans ce fichier',
      step_3: 'Exécutez: node apply-config.js',
      step_4: 'Collez FULL_DB_SETUP.sql dans Supabase SQL Editor',
      step_5: 'Configurez les Auth URLs dans Supabase',
      step_6: 'Redéployez: vercel --prod'
    }
  };

  fs.writeFileSync('deployment-config.json', JSON.stringify(configTemplate, null, 2));
  console.log('✅ Fichier deployment-config.json créé');

  // Étape 4: Créer un script d'application de configuration
  const applyScript = `#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('deployment-config.json', 'utf-8'));

// Créer .env
const envContent = \`VITE_SUPABASE_URL=\${config.supabase.url}
VITE_SUPABASE_ANON_KEY=\${config.supabase.anon_key}
\`;
fs.writeFileSync('.env', envContent);
console.log('✅ .env créé');

// Configurer Vercel
try {
  execSync(\`echo "\${config.supabase.url}" | vercel env add VITE_SUPABASE_URL production\`, { stdio: 'inherit' });
  execSync(\`echo "\${config.supabase.anon_key}" | vercel env add VITE_SUPABASE_ANON_KEY production\`, { stdio: 'inherit' });
  console.log('✅ Variables Vercel configurées');
} catch (error) {
  console.log('⚠️  Configurez manuellement dans Vercel Dashboard');
}

console.log('\\n🎉 Configuration appliquée!');
console.log('Prochaine étape: vercel --prod');
`;

  fs.writeFileSync('apply-config.js', applyScript);
  fs.chmodSync('apply-config.js', '755');
  console.log('✅ Script apply-config.js créé\n');

  // Instructions finales
  console.log('══════════════════════════════════════════════════════════════');
  console.log('   📋 Instructions finales');
  console.log('══════════════════════════════════════════════════════════════\n');
  console.log('1. Dans Supabase API Keys (déjà ouvert):');
  console.log('   → Copiez la "anon public" key');
  console.log('');
  console.log('2. Ouvrez: deployment-config.json');
  console.log('   → Remplacez COPIEZ_DEPUIS_DASHBOARD par votre anon key');
  console.log('');
  console.log('3. Exécutez: node apply-config.js');
  console.log('   → Cela va créer .env et configurer Vercel');
  console.log('');
  console.log('4. Dans Supabase SQL Editor (déjà ouvert):');
  console.log('   → Copiez tout FULL_DB_SETUP.sql');
  console.log('   → Collez et exécutez');
  console.log('');
  console.log('5. Dans Supabase Auth URLs (déjà ouvert):');
  console.log('   → Site URL: https://squad-planner-v2-rudy.vercel.app');
  console.log('   → Ajoutez les Redirect URLs listées dans deployment-config.json');
  console.log('');
  console.log('6. Redéployez: vercel --prod');
  console.log('');
  console.log('══════════════════════════════════════════════════════════════');
  console.log('   🚀 Votre app: https://squad-planner-v2-rudy.vercel.app');
  console.log('══════════════════════════════════════════════════════════════\n');
}

main().catch(error => {
  console.error('\n❌ Erreur:', error.message);
  process.exit(1);
});
