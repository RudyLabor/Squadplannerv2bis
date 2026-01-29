/**
 * VÉRIFIER LE SCHÉMA DE LA TABLE PROFILES
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://cwtoprbowdqcemdjrtir.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTIxNDI2MywiZXhwIjoyMDg0NzkwMjYzfQ.9QuJ0c3WpLKQHHmPKsJlDttU8YFPR7f-xD_VLl8gFDE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkProfilesSchema() {
  console.log('🔍 VÉRIFICATION SCHÉMA TABLE PROFILES\n');

  // Requête SQL pour voir les colonnes de la table profiles
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'profiles'
      ORDER BY ordinal_position;
    `
  });

  if (error) {
    console.log('❌ Erreur RPC, essayons une requête simple...');

    // Essayer de lire la table directement
    const { data: profiles, error: selectError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (selectError) {
      console.error('❌ Erreur:', selectError.message);
      console.log('\n💡 La table profiles n\'existe probablement pas.');
      console.log('   Il faut exécuter le script FIX_MISSING_COLUMNS.sql sur le dashboard Supabase.');
      return;
    }

    if (profiles && profiles.length > 0) {
      console.log('✅ Table profiles existe, colonnes détectées:');
      console.log(Object.keys(profiles[0]));
    } else {
      console.log('⚠️  Table profiles existe mais est vide');
      console.log('   Impossible de détecter les colonnes automatiquement');
      console.log('\n💡 Vérifier manuellement sur le dashboard Supabase:');
      console.log('   https://supabase.com/dashboard/project/cwtoprbowdqcemdjrtir/editor');
    }
  } else {
    console.log('✅ Schéma de la table profiles:\n');
    console.table(data);
  }

  // Vérifier les RLS policies
  console.log('\n🔒 VÉRIFICATION DES RLS POLICIES\n');

  const { data: policies, error: policiesError } = await supabase.rpc('exec_sql', {
    sql: `
      SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'profiles';
    `
  });

  if (policiesError) {
    console.log('❌ Impossible de vérifier les RLS policies via RPC');
  } else if (policies && policies.length > 0) {
    console.log('✅ RLS Policies actives:');
    policies.forEach(p => {
      console.log(`\n   📜 ${p.policyname}`);
      console.log(`      Commande: ${p.cmd}`);
      console.log(`      Rôles: ${p.roles}`);
    });
  } else {
    console.log('⚠️  Aucune RLS policy trouvée sur la table profiles');
  }
}

checkProfilesSchema().catch(console.error);
