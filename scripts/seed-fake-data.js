
import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = 'https://cwtoprbowdqcemdjrtir.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTIxNDI2MywiZXhwIjoyMDg0NzkwMjYzfQ.9QuJ0c3WpLKQHHmPKsJlDttU8YFPR7f-xD_VLl8gFDE';
// Using known password for all fake users to allow easy login testing
const FAKE_PASSWORD = 'Password123!'; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const GAMES = ['Valorant', 'League of Legends', 'CS2', 'Rocket League', 'Apex Legends', 'Overwatch 2'];
const LOCATIONS = ['Paris', 'Lyon', 'Marseille', 'Brussels', 'Montreal', 'Geneva'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seedData() {
  console.log('🌱 STARTING DATA SEEDING...');

  try {
    // 1. Create 50 Users
    console.log('\n👥 Generating 50 Users...');
    const users = [];
    
    for (let i = 0; i < 50; i++) {
      const email = `player_${i}_${Date.now()}@squadseed.com`;
      const name = `Player${i}`;
      
      const { data: user, error } = await supabase.auth.admin.createUser({
        email,
        password: FAKE_PASSWORD,
        email_confirm: true,
        user_metadata: {
          name: name,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
          location: getRandomItem(LOCATIONS),
          favorite_game: getRandomItem(GAMES)
        }
      });
      
      if (!error && user.user) {
        users.push(user.user);
        process.stdout.write('.'); // Progress dot
      }
    }
    console.log(`\n✅ Created ${users.length} users.`);

    // 2. Create 10 Squads
    console.log('\n🛡️ Generating 10 Squads...');
    const squads = [];
    
    // Pick 10 random owners
    for (let i = 0; i < 10; i++) {
      const owner = users[i];
      const game = getRandomItem(GAMES);
      const squadName = `${game} Legends ${i}`;
      
      const { data: squad } = await supabase
        .from('squads')
        .insert({
          owner_id: owner.id,
          name: squadName,
          game: game,
          description: `Just a seeded squad for ${game}`,
          is_public: true,
          image_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${squadName}`
        })
        .select()
        .single();
        
      if (squad) {
        squads.push(squad);
        // Add owner explicitly
        await supabase.from('squad_members').insert({ squad_id: squad.id, user_id: owner.id, role: 'owner' });
      }
    }
    console.log(`✅ Created ${squads.length} squads.`);

    // 3. Populate Squads with Members
    console.log('\n🤝 Populating Squads...');
    for (const squad of squads) {
       // Add 2-5 random members per squad
       const memberCount = Math.floor(Math.random() * 4) + 2; 
       for(let k=0; k<memberCount; k++) {
           const randomUser = getRandomItem(users);
           // Simple try-catch to ignore duplicate key errors if user already added
           try {
             await supabase.from('squad_members').insert({ squad_id: squad.id, user_id: randomUser.id, role: 'member' });
           } catch (e) {}
       }
    }
    console.log('✅ Squads populated.');

    // 4. Create Sessions
    console.log('\n📅 Generating Sessions...');
    for (const squad of squads) {
        // Create 2 sessions per squad
        for(let j=0; j<2; j++) {
            await supabase.from('sessions').insert({
                squad_id: squad.id,
                created_by: squad.owner_id,
                title: `${squad.game} Night`,
                start_time: new Date(Date.now() + 86400000 * (j+1)).toISOString(), // +1 day, +2 days
                status: 'planned'
            });
        }
    }
    console.log('✅ Sessions created.');

    console.log('\n✨ DATA SEEDING COMPLETE! The app is now ALIVE.');

  } catch (err) {
    console.error('❌ Seeding Failed:', err);
  }
}

seedData();
