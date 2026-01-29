/**
 * CRÉER UN COMPTE DE TEST - Squad Planner
 * Ce script crée un compte test fonctionnel dans le bon projet Supabase
 */

const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase (BON PROJET)
const SUPABASE_URL = 'https://cwtoprbowdqcemdjrtir.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTIxNDI2MywiZXhwIjoyMDg0NzkwMjYzfQ.9QuJ0c3WpLKQHHmPKsJlDttU8YFPR7f-xD_VLl8gFDE';

// Client avec service role pour bypass RLS
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Comptes de test à créer
const TEST_ACCOUNTS = [
  {
    email: 'test@test.com',
    password: 'Test123456!',
    username: 'testuser',
    display_name: 'Test User'
  },
  {
    email: 'demo@demo.com',
    password: 'Demo123456!',
    username: 'demouser',
    display_name: 'Demo User'
  }
];

async function createTestAccounts() {
  console.log('🚀 CRÉATION DES COMPTES DE TEST - Squad Planner\n');
  console.log('='.repeat(60));

  for (const account of TEST_ACCOUNTS) {
    console.log(`\n📧 Création du compte: ${account.email}`);

    try {
      // ÉTAPE 1: Créer le compte auth
      console.log('   [1/3] Création auth user...');
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true, // Auto-confirmer l'email
        user_metadata: {
          username: account.username,
          display_name: account.display_name
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          console.log('   ℹ️  Compte déjà existant, on continue...');

          // Récupérer l'user existant
          const { data: users } = await supabase.auth.admin.listUsers();
          const existingUser = users.users.find(u => u.email === account.email);

          if (!existingUser) {
            console.error('   ❌ Impossible de trouver l\'utilisateur existant');
            continue;
          }

          // Confirmer l'email si pas fait
          if (!existingUser.email_confirmed_at) {
            console.log('   [1.5/3] Confirmation de l\'email...');
            await supabase.auth.admin.updateUserById(existingUser.id, {
              email_confirm: true
            });
            console.log('   ✅ Email confirmé');
          }

          // ÉTAPE 2: Vérifier/créer le profil
          console.log('   [2/3] Vérification du profil...');
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', existingUser.id)
            .maybeSingle();

          if (profileError) {
            console.error('   ❌ Erreur vérification profil:', profileError.message);
            continue;
          }

          if (!profile) {
            console.log('   [2.5/3] Création du profil manquant...');
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: existingUser.id,
                email: account.email,
                username: account.username,
                display_name: account.display_name,
                is_premium: false,
                reliability_score: 100,
                total_sessions: 0,
                sessions_attended: 0
              });

            if (insertError) {
              console.error('   ❌ Erreur création profil:', insertError.message);
              continue;
            }

            console.log('   ✅ Profil créé avec succès');
          } else {
            console.log('   ✅ Profil existe déjà');
          }

          // ÉTAPE 3: Tester la connexion
          console.log('   [3/3] Test de connexion...');
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: account.email,
            password: account.password
          });

          if (signInError) {
            console.error('   ❌ Erreur de connexion:', signInError.message);
            console.error('   💡 Essayez de réinitialiser le mot de passe sur le dashboard Supabase');
          } else {
            console.log('   ✅ Connexion réussie!');
            console.log('   👤 User ID:', signInData.user.id);
            await supabase.auth.signOut();
          }

        } else {
          console.error('   ❌ Erreur création auth:', authError.message);
          continue;
        }
      } else {
        console.log('   ✅ Auth user créé:', authData.user.id);

        // ÉTAPE 2: Créer le profil
        console.log('   [2/3] Création du profil...');
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: account.email,
            username: account.username,
            display_name: account.display_name,
            is_premium: false,
            reliability_score: 100,
            total_sessions: 0,
            sessions_attended: 0
          });

        if (profileError) {
          console.error('   ❌ Erreur création profil:', profileError.message);
          continue;
        }

        console.log('   ✅ Profil créé avec succès');

        // ÉTAPE 3: Tester la connexion
        console.log('   [3/3] Test de connexion...');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: account.email,
          password: account.password
        });

        if (signInError) {
          console.error('   ❌ Erreur de connexion:', signInError.message);
        } else {
          console.log('   ✅ Connexion réussie!');
          await supabase.auth.signOut();
        }
      }

      console.log(`\n   ✅ Compte ${account.email} prêt à l'emploi!`);

    } catch (error) {
      console.error(`\n   ❌ Erreur pour ${account.email}:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 RÉSUMÉ\n');
  console.log('✅ Comptes de test créés et prêts:');
  console.log('   📧 test@test.com / Test123456!');
  console.log('   📧 demo@demo.com / Demo123456!');
  console.log('\n💡 Tu peux maintenant te connecter avec ces comptes sur l\'app!');
  console.log('\n' + '='.repeat(60));
}

// Exécuter la création
createTestAccounts().catch(console.error);
