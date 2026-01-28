#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('deployment-config.json', 'utf-8'));

// Créer .env
const envContent = `VITE_SUPABASE_URL=${config.supabase.url}
VITE_SUPABASE_ANON_KEY=${config.supabase.anon_key}
`;
fs.writeFileSync('.env', envContent);
console.log('✅ .env créé');

// Configurer Vercel
try {
  execSync(`echo "${config.supabase.url}" | vercel env add VITE_SUPABASE_URL production`, { stdio: 'inherit' });
  execSync(`echo "${config.supabase.anon_key}" | vercel env add VITE_SUPABASE_ANON_KEY production`, { stdio: 'inherit' });
  console.log('✅ Variables Vercel configurées');
} catch (error) {
  console.log('⚠️  Configurez manuellement dans Vercel Dashboard');
}

console.log('\n🎉 Configuration appliquée!');
console.log('Prochaine étape: vercel --prod');
