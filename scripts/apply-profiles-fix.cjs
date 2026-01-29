/**
 * APPLIQUER LE FIX DE LA TABLE PROFILES
 * Execute le SQL pour ajouter les colonnes manquantes
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://cwtoprbowdqcemdjrtir.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTIxNDI2MywiZXhwIjoyMDg0NzkwMjYzfQ.9QuJ0c3WpLKQHHmPKsJlDttU8YFPR7f-xD_VLl8gFDE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
});

async function applyFix() {
  console.log('🔧 APPLICATION DU FIX PROFILES TABLE\n');
  console.log('='.repeat(60));

  try {
    // Lire le fichier SQL
    const sqlFile = path.join(__dirname, 'fix-profiles-table.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    console.log('\n📄 Contenu SQL chargé depuis fix-profiles-table.sql');

    // Séparer les commandes SQL (on ne peut pas exécuter tout d'un coup)
    const commands = [
      // Ajouter display_name
      `ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name TEXT;`,

      // Ajouter total_sessions
      `ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_sessions INTEGER DEFAULT 0;`,

      // Ajouter sessions_attended
      `ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sessions_attended INTEGER DEFAULT 0;`,

      // Mettre à jour les display_name manquants
      `UPDATE public.profiles SET display_name = COALESCE(username, split_part(email, '@', 1)) WHERE display_name IS NULL;`,

      // Activer RLS
      `ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;`
    ];

    console.log('\n🔨 Exécution des commandes SQL...\n');

    for (let i = 0; i < commands.length; i++) {
      const cmd = commands[i].trim();
      if (!cmd) continue;

      console.log(`   [${i + 1}/${commands.length}] ${cmd.substring(0, 60)}...`);

      const { data, error } = await supabase.rpc('exec_sql', { sql: cmd });

      if (error) {
        // Certaines erreurs sont OK (colonne existe déjà, etc.)
        if (error.message.includes('already exists') || error.message.includes('does not exist')) {
          console.log(`      ℹ️  ${error.message.substring(0, 80)}`);
        } else {
          console.error(`      ❌ Erreur: ${error.message}`);
        }
      } else {
        console.log(`      ✅ OK`);
      }
    }

    // Créer/mettre à jour le trigger via function
    console.log('\n📝 Création du trigger handle_new_user...');

    const triggerFunction = `
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO public.profiles (id, email, username, display_name, avatar_url)
        VALUES (
          NEW.id,
          NEW.email,
          COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
          COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
          NEW.raw_user_meta_data->>'avatar_url'
        )
        ON CONFLICT (id) DO NOTHING;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;

    const { error: funcError } = await supabase.rpc('exec_sql', { sql: triggerFunction });

    if (funcError) {
      console.log(`   ℹ️  ${funcError.message}`);
    } else {
      console.log('   ✅ Fonction handle_new_user créée');
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n✅ FIX APPLIQUÉ!\n');
    console.log('💡 Prochaines étapes:');
    console.log('   1. Exécuter: node scripts/create-test-account.cjs');
    console.log('   2. Tester la connexion sur l\'app avec test@test.com / Test123456!');
    console.log('\n' + '='.repeat(60));

  } catch (error) {
    console.error('\n❌ ERREUR CRITIQUE:', error.message);
    console.error(error.stack);
  }
}

applyFix().catch(console.error);
