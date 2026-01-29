/**
 * FIX DIRECT: Créer les profils pour les comptes test existants
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://cwtoprbowdqcemdjrtir.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTIxNDI2MywiZXhwIjoyMDg0NzkwMjYzfQ.9QuJ0c3WpLKQHHmPKsJlDttU8YFPR7f-xD_VLl8gFDE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixProfilesDirectly() {
  console.log('🔧 FIX DIRECT DES PROFILS\n');
  console.log('='.repeat(60));

  try {
    // ÉTAPE 1: Lister tous les users auth
    console.log('\n[1/3] Récupération des utilisateurs auth...');
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('❌ Erreur:', listError.message);
      return;
    }

    console.log(`✅ ${users.length} utilisateurs trouvés`);

    // ÉTAPE 2: Pour chaque user, créer/mettre à jour le profil
    console.log('\n[2/3] Création/mise à jour des profils...\n');

    for (const user of users) {
      console.log(`\n   👤 ${user.email}`);
      console.log(`      ID: ${user.id}`);

      // Vérifier si profil existe
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      const username = user.user_metadata?.username || user.email.split('@')[0];
      const display_name = user.user_metadata?.display_name || user.user_metadata?.username || user.email.split('@')[0];

      if (existingProfile) {
        console.log('      ℹ️  Profil existe, mise à jour...');

        // Mettre à jour seulement si display_name est null
        const updates = {};
        if (!existingProfile.display_name) {
          updates.display_name = display_name;
        }
        if (!existingProfile.username) {
          updates.username = username;
        }
        if (existingProfile.total_sessions === undefined) {
          updates.total_sessions = 0;
        }
        if (existingProfile.sessions_attended === undefined) {
          updates.sessions_attended = 0;
        }

        if (Object.keys(updates).length > 0) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id);

          if (updateError) {
            console.error('      ❌ Erreur update:', updateError.message);
          } else {
            console.log('      ✅ Profil mis à jour:', Object.keys(updates).join(', '));
          }
        } else {
          console.log('      ✅ Profil déjà complet');
        }
      } else {
        console.log('      ⚠️  Profil manquant, création...');

        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            username,
            display_name,
            avatar_url: user.user_metadata?.avatar_url || null,
            is_premium: false,
            reliability_score: 100,
            total_sessions: 0,
            sessions_attended: 0
          });

        if (insertError) {
          console.error('      ❌ Erreur création:', insertError.message);

          // Si la colonne display_name n'existe pas, on essaie sans
          if (insertError.message.includes('display_name')) {
            console.log('      🔄 Retry sans display_name...');
            const { error: retryError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                email: user.email,
                username,
                avatar_url: user.user_metadata?.avatar_url || null,
                is_premium: false,
                reliability_score: 100
              });

            if (retryError) {
              console.error('      ❌ Erreur retry:', retryError.message);
            } else {
              console.log('      ✅ Profil créé (sans display_name)');
            }
          }
        } else {
          console.log('      ✅ Profil créé avec succès');
        }
      }
    }

    // ÉTAPE 3: Tester la connexion
    console.log('\n[3/3] Test de connexion...\n');

    const testAccounts = [
      { email: 'test@test.com', password: 'Test123456!' },
      { email: 'demo@demo.com', password: 'Demo123456!' }
    ];

    for (const account of testAccounts) {
      console.log(`   🔐 Test connexion ${account.email}...`);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: account.email,
        password: account.password
      });

      if (error) {
        console.error(`      ❌ Échec: ${error.message}`);
      } else {
        console.log(`      ✅ Connexion OK!`);

        // Tester récupération profil
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError) {
          console.error(`      ❌ Profil inaccessible: ${profileError.message}`);
        } else if (!profile) {
          console.error(`      ❌ Profil introuvable`);
        } else {
          console.log(`      ✅ Profil OK: ${profile.username || profile.email}`);
        }

        await supabase.auth.signOut();
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n✅ FIX TERMINÉ!\n');
    console.log('💡 Instructions pour l\'utilisateur:');
    console.log('   1. Ouvre l\'app dans ton navigateur');
    console.log('   2. Connecte-toi avec:');
    console.log('      📧 Email: test@test.com');
    console.log('      🔑 Mot de passe: Test123456!');
    console.log('   3. Si ça ne marche toujours pas:');
    console.log('      - Ouvre la console développeur (F12)');
    console.log('      - Regarde les erreurs dans l\'onglet Console');
    console.log('      - Clear le localStorage et réessaye');
    console.log('\n' + '='.repeat(60));

  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
    console.error(error.stack);
  }
}

fixProfilesDirectly().catch(console.error);
