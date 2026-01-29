/**
 * DIAGNOSTIC LOGIN ISSUE - Squad Planner
 * Ce script teste exactement ce qui ne marche pas lors du login
 */

const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const SUPABASE_URL = 'https://cwtoprbowdqcemdjrtir.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyMTQyNjMsImV4cCI6MjA4NDc5MDI2M30.FUpLncLIZc7l4hukBu5oOzj0tHl2IiwIIJ2Ghml8-6k';

// Créer client Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Compte de test
const TEST_EMAIL = 'test@test.com';
const TEST_PASSWORD = 'Test123456!';

async function diagnoseLoginIssue() {
  console.log('🔍 DIAGNOSTIC LOGIN ISSUE - Squad Planner\n');
  console.log('='.repeat(60));

  try {
    // ÉTAPE 1: Test de connexion basique
    console.log('\n[ÉTAPE 1] Test de connexion auth basique...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    if (authError) {
      console.error('❌ ERREUR AUTH:', authError.message);
      console.error('   Code:', authError.status);
      console.error('   Details:', authError);
      return;
    }

    console.log('✅ Authentification réussie!');
    console.log('   User ID:', authData.user.id);
    console.log('   Email:', authData.user.email);
    console.log('   Email confirmé:', authData.user.email_confirmed_at ? 'OUI' : 'NON');
    console.log('   Session active:', authData.session ? 'OUI' : 'NON');

    // ÉTAPE 2: Vérifier le profil dans la table profiles
    console.log('\n[ÉTAPE 2] Vérification du profil dans la table "profiles"...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (profileError) {
      console.error('❌ ERREUR PROFIL:', profileError.message);
      console.error('   Code:', profileError.code);
      console.error('   Details:', profileError.details);
      console.error('   Hint:', profileError.hint);

      // Vérifier si c'est un problème RLS
      if (profileError.code === 'PGRST116' || profileError.message.includes('row-level security')) {
        console.error('\n🚨 PROBLÈME IDENTIFIÉ: RLS POLICIES BLOQUENT L\'ACCÈS AU PROFIL!');
        console.error('   → Les RLS policies sur la table "profiles" empêchent l\'utilisateur de lire son propre profil');
      }

      // Vérifier si le profil n'existe pas
      if (profileError.code === 'PGRST116' || profileData === null) {
        console.error('\n🚨 PROBLÈME IDENTIFIÉ: PROFIL INEXISTANT!');
        console.error('   → Le profil n\'existe pas dans la table "profiles" pour cet utilisateur');
      }

      return;
    }

    if (!profileData) {
      console.error('❌ PROFIL INTROUVABLE!');
      console.error('   → L\'utilisateur existe dans auth.users mais pas dans public.profiles');
      console.error('   → Le trigger de création automatique de profil ne fonctionne peut-être pas');

      // ÉTAPE 2.5: Créer le profil manuellement
      console.log('\n[ÉTAPE 2.5] Tentative de création manuelle du profil...');
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: authData.user.email,
          username: authData.user.user_metadata?.username || authData.user.email.split('@')[0],
          display_name: authData.user.user_metadata?.display_name || authData.user.email.split('@')[0],
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ IMPOSSIBLE DE CRÉER LE PROFIL:', createError.message);
        console.error('   Code:', createError.code);
        console.error('   → Vérifier les RLS policies INSERT sur la table profiles');
        return;
      }

      console.log('✅ Profil créé avec succès!');
      console.log('   Username:', newProfile.username);
      console.log('   Display name:', newProfile.display_name);
    } else {
      console.log('✅ Profil trouvé!');
      console.log('   Username:', profileData.username);
      console.log('   Display name:', profileData.display_name);
      console.log('   Email:', profileData.email);
      console.log('   Premium:', profileData.is_premium || false);
    }

    // ÉTAPE 3: Test de session persistence
    console.log('\n[ÉTAPE 3] Test de persistance de session...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('❌ ERREUR SESSION:', sessionError.message);
      return;
    }

    console.log('✅ Session persistante récupérée!');
    console.log('   Access token présent:', sessionData.session?.access_token ? 'OUI' : 'NON');
    console.log('   Expires à:', sessionData.session?.expires_at ? new Date(sessionData.session.expires_at * 1000).toLocaleString() : 'N/A');

    // ÉTAPE 4: Vérifier les RLS policies
    console.log('\n[ÉTAPE 4] Test des RLS policies...');

    // Test lecture propre profil
    const { data: ownProfile, error: ownProfileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (ownProfileError) {
      console.error('❌ IMPOSSIBLE DE LIRE SON PROPRE PROFIL via RLS!');
      console.error('   → RLS policy "Users can view own profile" manquante ou incorrecte');
    } else {
      console.log('✅ RLS permet la lecture du profil');
    }

    // Test mise à jour propre profil
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', authData.user.id);

    if (updateError) {
      console.error('❌ IMPOSSIBLE DE METTRE À JOUR SON PROPRE PROFIL via RLS!');
      console.error('   → RLS policy "Users can update own profile" manquante ou incorrecte');
    } else {
      console.log('✅ RLS permet la mise à jour du profil');
    }

    // RÉSUMÉ
    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSUMÉ DU DIAGNOSTIC\n');

    if (!authError && profileData && !ownProfileError && !updateError) {
      console.log('✅ TOUT FONCTIONNE CORRECTEMENT!');
      console.log('   L\'utilisateur peut se connecter et accéder à son profil.');
      console.log('\n💡 Si l\'app ne fonctionne toujours pas:');
      console.log('   1. Vérifier que le frontend utilise les bonnes variables d\'environnement');
      console.log('   2. Vérifier que AuthContext est bien provider au niveau racine');
      console.log('   3. Vérifier les console.error dans le navigateur');
      console.log('   4. Clear le localStorage et les cookies du navigateur');
    } else {
      console.log('❌ PROBLÈMES DÉTECTÉS:\n');

      if (authError) {
        console.log('   [ ] Authentification échoue');
      }

      if (!profileData || ownProfileError) {
        console.log('   [ ] Profil inaccessible ou inexistant');
      }

      if (updateError) {
        console.log('   [ ] RLS policies trop restrictives');
      }
    }

    console.log('\n' + '='.repeat(60));

    // Déconnexion
    await supabase.auth.signOut();
    console.log('\n✅ Déconnexion effectuée (cleanup)');

  } catch (error) {
    console.error('\n💥 ERREUR CRITIQUE:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Exécuter le diagnostic
diagnoseLoginIssue().catch(console.error);
