/**
 * 🔑 Création d'un compte de test utilisable
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cwtoprbowdqcemdjrtir.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTIxNDI2MywiZXhwIjoyMDg0NzkwMjYzfQ.9QuJ0c3WpLKQHHmPKsJlDttU8YFPR7f-xD_VLl8gFDE';
const KV_TABLE = 'kv_store_e884809f';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createTestAccount() {
  console.log('\n🔑 CRÉATION DU COMPTE DE TEST\n');
  
  const email = 'demo@squadplanner.app';
  const password = 'Demo123!';
  
  // Check if user already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existingUser = existingUsers?.users?.find(u => u.email === email);
  
  if (existingUser) {
    console.log('⚠️ Compte existant trouvé, suppression...');
    await supabase.auth.admin.deleteUser(existingUser.id);
  }
  
  // Create user with confirmed email
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name: 'Demo User',
      avatar: '🎮',
    }
  });
  
  if (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
  
  console.log('✅ Compte créé avec succès !');
  console.log('\n📧 Email:', email);
  console.log('🔐 Mot de passe:', password);
  console.log('🆔 User ID:', data.user.id);
  
  // Create profile in KV store
  const profile = {
    id: data.user.id,
    email,
    name: 'Demo User',
    avatar: '🎮',
    mainGame: 'Valorant',
    isPremium: true,
    level: 42,
    badges: ['early_adopter', 'premium'],
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
    key: `user:${data.user.id}`,
    value: JSON.stringify(profile),
  });
  
  // Add to some squads
  const { data: squadsData } = await supabase
    .from(KV_TABLE)
    .select('key, value')
    .like('key', 'squad:%')
    .limit(4);
  
  if (squadsData) {
    for (const row of squadsData) {
      const squad = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
      if (!squad.members.some((m: any) => m.userId === data.user.id)) {
        squad.members.push({
          userId: data.user.id,
          role: 'member',
          joinedAt: new Date().toISOString(),
        });
        await supabase.from(KV_TABLE).upsert({
          key: row.key,
          value: JSON.stringify(squad),
        });
        console.log(`  ✅ Ajouté à: ${squad.name}`);
      }
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📋 POUR TE CONNECTER:');
  console.log('='.repeat(50));
  console.log(`\n  📧 Email: ${email}`);
  console.log(`  🔐 Mot de passe: ${password}\n`);
  console.log('='.repeat(50) + '\n');
}

createTestAccount();
