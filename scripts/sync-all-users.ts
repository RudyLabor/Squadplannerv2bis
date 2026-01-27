/**
 * 🔄 Synchronise TOUS les utilisateurs Supabase avec les données du KV Store
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cwtoprbowdqcemdjrtir.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTIxNDI2MywiZXhwIjoyMDg0NzkwMjYzfQ.9QuJ0c3WpLKQHHmPKsJlDttU8YFPR7f-xD_VLl8gFDE';
const KV_TABLE = 'kv_store_e884809f';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function syncAllUsers() {
  console.log('\n🔄 SYNCHRONISATION DE TOUS LES UTILISATEURS\n');
  
  // Get all users from Supabase Auth
  const { data: { users } } = await supabase.auth.admin.listUsers();
  
  if (!users || users.length === 0) {
    console.log('❌ Aucun utilisateur trouvé');
    process.exit(1);
  }
  
  console.log(`📊 ${users.length} utilisateurs trouvés\n`);
  
  // Get all squads
  const { data: squadsData } = await supabase
    .from(KV_TABLE)
    .select('key, value')
    .like('key', 'squad:%');
  
  const squads = squadsData?.map(row => ({
    key: row.key,
    data: typeof row.value === 'string' ? JSON.parse(row.value) : row.value
  })) || [];
  
  console.log(`📊 ${squads.length} squads trouvées\n`);
  
  for (const user of users) {
    const userId = user.id;
    const email = user.email || 'unknown';
    const name = user.user_metadata?.name || email.split('@')[0] || 'User';
    
    console.log(`\n👤 Traitement de: ${name} (${email})`);
    
    // Create/update profile in KV Store
    const profile = {
      id: userId,
      email: email,
      name: name,
      avatar: user.user_metadata?.avatar || '🎮',
      mainGame: 'Valorant',
      isPremium: true,
      level: Math.floor(Math.random() * 40) + 10,
      badges: ['early_adopter', 'premium'],
      stats: {
        totalSessions: Math.floor(Math.random() * 100) + 50,
        sessionsAttended: Math.floor(Math.random() * 80) + 40,
        reliabilityScore: Math.floor(Math.random() * 20) + 80,
        mvpCount: Math.floor(Math.random() * 20) + 5,
        hoursPlayed: Math.floor(Math.random() * 300) + 100,
        squadCount: 4,
      },
      createdAt: user.created_at || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await supabase.from(KV_TABLE).upsert({
      key: `user:${userId}`,
      value: JSON.stringify(profile),
    });
    console.log(`  ✅ Profil créé/mis à jour`);
    
    // Add user to first 4 squads
    let addedCount = 0;
    for (const squad of squads.slice(0, 4)) {
      // Remove any existing entry for this user
      squad.data.members = squad.data.members.filter((m: any) => m.userId !== userId);
      
      // Add the user
      squad.data.members.push({
        userId: userId,
        role: addedCount === 0 ? 'owner' : 'member',
        joinedAt: new Date().toISOString(),
      });
      
      await supabase.from(KV_TABLE).upsert({
        key: squad.key,
        value: JSON.stringify(squad.data),
      });
      
      console.log(`  ✅ Ajouté à: ${squad.data.name}`);
      addedCount++;
    }
  }
  
  console.log('\n✅ SYNCHRONISATION TERMINÉE !');
  console.log('\n📋 Rafraîchis la page pour voir les données.\n');
}

syncAllUsers().catch(console.error);
