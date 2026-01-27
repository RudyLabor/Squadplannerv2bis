/**
 * 🔄 Synchronise le profil utilisateur avec l'ID Supabase réel
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cwtoprbowdqcemdjrtir.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTIxNDI2MywiZXhwIjoyMDg0NzkwMjYzfQ.9QuJ0c3WpLKQHHmPKsJlDttU8YFPR7f-xD_VLl8gFDE';
const KV_TABLE = 'kv_store_e884809f';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function syncUserProfile() {
  console.log('\n🔄 SYNCHRONISATION DU PROFIL UTILISATEUR\n');
  
  // Get the demo user from Supabase Auth
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const demoUser = users?.find(u => u.email === 'demo@squadplanner.app');
  
  if (!demoUser) {
    console.log('❌ Utilisateur demo@squadplanner.app non trouvé');
    process.exit(1);
  }
  
  const userId = demoUser.id;
  console.log('✅ Utilisateur trouvé:', userId);
  
  // Create/update profile in KV Store
  const profile = {
    id: userId,
    email: 'demo@squadplanner.app',
    name: 'Demo User',
    avatar: '🎮',
    mainGame: 'Valorant',
    isPremium: true,
    level: 42,
    badges: ['early_adopter', 'premium', 'reliable_player'],
    stats: {
      totalSessions: 100,
      sessionsAttended: 92,
      reliabilityScore: 92,
      mvpCount: 15,
      hoursPlayed: 250,
      squadCount: 4,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  await supabase.from(KV_TABLE).upsert({
    key: `user:${userId}`,
    value: JSON.stringify(profile),
  });
  console.log('✅ Profil créé/mis à jour pour:', userId);
  
  // Get all squads and add this user
  const { data: squadsData } = await supabase
    .from(KV_TABLE)
    .select('key, value')
    .like('key', 'squad:%');
  
  if (squadsData) {
    let addedCount = 0;
    for (const row of squadsData.slice(0, 4)) {
      const squad = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
      
      // Remove any existing entry for this user
      squad.members = squad.members.filter((m: any) => m.userId !== userId);
      
      // Add the user
      squad.members.push({
        userId: userId,
        role: 'member',
        joinedAt: new Date().toISOString(),
      });
      
      await supabase.from(KV_TABLE).upsert({
        key: row.key,
        value: JSON.stringify(squad),
      });
      
      console.log(`  ✅ Ajouté à: ${squad.name}`);
      addedCount++;
    }
    console.log(`\n📊 Ajouté à ${addedCount} squads`);
  }
  
  console.log('\n✅ SYNCHRONISATION TERMINÉE !');
  console.log('\n📋 Tu peux maintenant te reconnecter avec:');
  console.log('  📧 Email: demo@squadplanner.app');
  console.log('  🔐 Mot de passe: Demo123!\n');
}

syncUserProfile().catch(console.error);
