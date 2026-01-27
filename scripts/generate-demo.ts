/**
 * 🎮 SQUAD PLANNER - Générateur d'écosystème de démo
 * 
 * Ce script génère un écosystème complet de données réelles dans Supabase
 * en accédant directement au KV Store (bypass de l'Edge Function)
 */

import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = 'https://cwtoprbowdqcemdjrtir.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTIxNDI2MywiZXhwIjoyMDg0NzkwMjYzfQ.9QuJ0c3WpLKQHHmPKsJlDttU8YFPR7f-xD_VLl8gFDE';
const KV_TABLE = 'kv_store_e884809f';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Terminal colors
const c = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(msg: string, color = c.reset) {
  console.log(`${color}${msg}${c.reset}`);
}

// ========================================
// DATA MODELS
// ========================================

const GAMES = [
  'Valorant', 'League of Legends', 'Apex Legends', 'CS2', 
  'Overwatch 2', 'Fortnite', 'Rocket League', 'Rainbow Six Siege'
];

const AVATAR_EMOJIS = ['🎮', '🕹️', '👾', '🎯', '🏆', '⚔️', '🔥', '💎', '🌟', '🦊', '🐉', '🦅', '🐺', '🦁', '🐻'];

const FRENCH_NAMES = [
  'Alexandre "Kira"', 'Sarah "Phoenix"', 'Thomas "Titan"', 'Emma "Luna"',
  'Lucas "Storm"', 'Marie "Viper"', 'Hugo "Flash"', 'Léa "Shadow"',
  'Antoine "Blaze"', 'Camille "Nova"', 'Maxime "Ghost"', 'Julie "Frost"',
  'Nathan "Hawk"', 'Chloé "Raven"', 'Romain "Thunder"', 'Laura "Eclipse"',
  'Théo "Blade"', 'Manon "Crystal"'
];

const SQUAD_NAMES = [
  'Les Conquérants', 'Team Rocket', 'Night Raiders', 'Casual Gamers',
  'Les Légendes', 'Phoenix Squad', 'Alpha Team'
];

const SESSION_TITLES = [
  'Session ranked - Push Diamant', 'Clash Tournament - Finale',
  'Chill & Play - Session détente', 'Training intensif',
  'Soirée découverte', 'Ranked grind', 'Prépa tournoi',
  'Session coaching', 'Fun games', 'Warm-up session'
];

// ========================================
// HELPER FUNCTIONS
// ========================================

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysAgo: number, daysAhead: number): Date {
  const now = Date.now();
  const min = now - daysAgo * 24 * 60 * 60 * 1000;
  const max = now + daysAhead * 24 * 60 * 60 * 1000;
  return new Date(min + Math.random() * (max - min));
}

// ========================================
// DATA GENERATORS
// ========================================

interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  mainGame: string;
  isPremium: boolean;
  level: number;
  badges: string[];
  stats: {
    totalSessions: number;
    sessionsAttended: number;
    reliabilityScore: number;
    mvpCount: number;
    hoursPlayed: number;
    squadCount: number;
  };
  createdAt: string;
  updatedAt: string;
}

function generateUser(name: string, index: number): User {
  const id = generateId();
  const totalSessions = randomNumber(20, 300);
  const sessionsAttended = Math.floor(totalSessions * (randomNumber(70, 99) / 100));
  
  return {
    id,
    email: `${name.toLowerCase().replace(/[^a-z]/g, '')}.${index}@squadplanner.app`,
    name,
    avatar: randomElement(AVATAR_EMOJIS),
    mainGame: randomElement(GAMES),
    isPremium: Math.random() > 0.7,
    level: randomNumber(1, 50),
    badges: ['early_adopter', 'reliable_player'].slice(0, randomNumber(0, 2)),
    stats: {
      totalSessions,
      sessionsAttended,
      reliabilityScore: Math.round((sessionsAttended / totalSessions) * 100),
      mvpCount: randomNumber(0, 50),
      hoursPlayed: randomNumber(50, 500),
      squadCount: randomNumber(1, 5),
    },
    createdAt: new Date(Date.now() - randomNumber(30, 365) * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

interface Squad {
  id: string;
  name: string;
  game: string;
  description: string;
  inviteCode: string;
  ownerId: string;
  members: { userId: string; role: string; joinedAt: string }[];
  stats: {
    totalSessions: number;
    averageAttendance: number;
    reliabilityScore: number;
  };
  preferredDays: string[];
  typicalDuration: number;
  createdAt: string;
  updatedAt: string;
}

function generateSquad(name: string, users: User[]): Squad {
  const id = generateId();
  const memberCount = randomNumber(3, Math.min(6, users.length));
  const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
  const members = shuffledUsers.slice(0, memberCount).map((user, i) => ({
    userId: user.id,
    role: i === 0 ? 'owner' : (i === 1 && Math.random() > 0.5 ? 'moderator' : 'member'),
    joinedAt: new Date(Date.now() - randomNumber(7, 180) * 24 * 60 * 60 * 1000).toISOString(),
  }));

  return {
    id,
    name,
    game: randomElement(GAMES),
    description: `Squad ${name} - Rejoins-nous pour des sessions gaming de qualité !`,
    inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    ownerId: members[0].userId,
    members,
    stats: {
      totalSessions: randomNumber(10, 100),
      averageAttendance: randomNumber(70, 95),
      reliabilityScore: randomNumber(80, 98),
    },
    preferredDays: ['monday', 'wednesday', 'friday', 'saturday'].slice(0, randomNumber(2, 4)),
    typicalDuration: randomElement([60, 90, 120, 180]),
    createdAt: new Date(Date.now() - randomNumber(30, 180) * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

interface Session {
  id: string;
  squadId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  minPlayers: number;
  maxPlayers: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdBy: string;
  slots: {
    id: string;
    date: string;
    time: string;
    responses: { oderId: string; response: 'yes' | 'no' | 'maybe' }[];
  }[];
  createdAt: string;
  updatedAt: string;
}

function generateSession(squad: Squad, isPast: boolean): Session {
  const id = generateId();
  const date = isPast 
    ? randomDate(90, 0) 
    : randomDate(0, 30);
  
  const slots = [{
    id: generateId(),
    date: date.toISOString().split('T')[0],
    time: randomElement(['19:00', '20:00', '21:00', '22:00']),
    responses: squad.members.map(m => ({
      oderId: m.userId,
      response: randomElement(['yes', 'yes', 'yes', 'maybe', 'no']) as 'yes' | 'no' | 'maybe',
    })),
  }];

  const yesCount = slots[0].responses.filter(r => r.response === 'yes').length;
  let status: Session['status'] = 'pending';
  if (isPast) {
    status = yesCount >= 3 ? 'completed' : 'cancelled';
  } else if (yesCount >= 3) {
    status = 'confirmed';
  }

  return {
    id,
    squadId: squad.id,
    title: randomElement(SESSION_TITLES),
    description: 'Session organisée automatiquement',
    date: date.toISOString().split('T')[0],
    time: slots[0].time,
    duration: squad.typicalDuration,
    minPlayers: 3,
    maxPlayers: squad.members.length,
    status,
    createdBy: squad.ownerId,
    slots,
    createdAt: new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ========================================
// DATABASE OPERATIONS
// ========================================

async function clearExistingData() {
  log('🗑️ Suppression des données existantes...', c.yellow);
  
  const { error } = await supabase
    .from(KV_TABLE)
    .delete()
    .or('key.like.user:%,key.like.squad:%,key.like.session:%,key.like.webhook:%,key.like.notification:%');
  
  if (error) {
    log(`⚠️ Erreur lors du nettoyage: ${error.message}`, c.yellow);
  } else {
    log('✅ Données précédentes supprimées', c.green);
  }
}

async function insertData(key: string, value: any) {
  const { error } = await supabase
    .from(KV_TABLE)
    .upsert({
      key,
      value: JSON.stringify(value),
    });
  
  if (error) {
    throw new Error(`Failed to insert ${key}: ${error.message}`);
  }
}

// ========================================
// MAIN GENERATION
// ========================================

async function generateEcosystem() {
  log('\n' + '='.repeat(60), c.cyan);
  log('🎮 SQUAD PLANNER - GÉNÉRATION ÉCOSYSTÈME DE DÉMO', c.cyan);
  log('='.repeat(60) + '\n', c.cyan);

  try {
    // 1. Clear existing data
    await clearExistingData();

    // 2. Generate users
    log('\n👤 Génération des utilisateurs...', c.blue);
    const users: User[] = [];
    for (let i = 0; i < FRENCH_NAMES.length; i++) {
      const user = generateUser(FRENCH_NAMES[i], i);
      users.push(user);
      await insertData(`user:${user.id}`, user);
      log(`  ✅ ${user.name} (${user.email})`, c.green);
    }
    log(`📊 ${users.length} utilisateurs créés`, c.cyan);

    // 3. Generate squads
    log('\n👥 Génération des squads...', c.blue);
    const squads: Squad[] = [];
    for (const squadName of SQUAD_NAMES) {
      const squad = generateSquad(squadName, users);
      squads.push(squad);
      await insertData(`squad:${squad.id}`, squad);
      log(`  ✅ ${squad.name} (${squad.game}) - ${squad.members.length} membres`, c.green);
    }
    log(`📊 ${squads.length} squads créées`, c.cyan);

    // 4. Generate sessions (past and future)
    log('\n📅 Génération des sessions...', c.blue);
    let sessionCount = 0;
    for (const squad of squads) {
      // Past sessions (5-10 per squad)
      const pastCount = randomNumber(5, 10);
      for (let i = 0; i < pastCount; i++) {
        const session = generateSession(squad, true);
        await insertData(`session:${session.id}`, session);
        sessionCount++;
      }
      
      // Future sessions (2-4 per squad)
      const futureCount = randomNumber(2, 4);
      for (let i = 0; i < futureCount; i++) {
        const session = generateSession(squad, false);
        await insertData(`session:${session.id}`, session);
        sessionCount++;
      }
      
      log(`  ✅ ${squad.name}: ${pastCount} passées + ${futureCount} à venir`, c.green);
    }
    log(`📊 ${sessionCount} sessions créées`, c.cyan);

    // 5. Generate some webhooks for testing
    log('\n🔗 Génération des webhooks...', c.blue);
    for (let i = 0; i < 3; i++) {
      const webhook = {
        id: generateId(),
        userId: users[i].id,
        name: `Discord Webhook ${i + 1}`,
        url: `https://discord.com/api/webhooks/test${i + 1}/token`,
        events: ['session.created', 'session.rsvp', 'squad.member_joined'],
        enabled: true,
        createdAt: new Date().toISOString(),
      };
      await insertData(`webhook:${webhook.id}`, webhook);
      log(`  ✅ ${webhook.name}`, c.green);
    }

    // 6. Generate notifications
    log('\n🔔 Génération des notifications...', c.blue);
    for (const user of users.slice(0, 5)) {
      const notifications = [
        {
          id: generateId(),
          userId: user.id,
          type: 'session_reminder',
          title: 'Session dans 1 heure',
          message: 'Ta session "Ranked grind" commence bientôt !',
          read: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: generateId(),
          userId: user.id,
          type: 'squad_invite',
          title: 'Invitation à rejoindre',
          message: 'Tu as été invité à rejoindre Team Rocket',
          read: true,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      
      for (const notif of notifications) {
        await insertData(`notification:${notif.id}`, notif);
      }
    }
    log(`  ✅ 10 notifications créées`, c.green);

    // 7. Create a test account for manual testing
    log('\n🔑 Création du compte de test...', c.blue);
    const testUser: User = {
      id: 'test-user-main',
      email: 'test@squadplanner.app',
      name: 'Test User (Toi)',
      avatar: '🎮',
      mainGame: 'Valorant',
      isPremium: true,
      level: 47,
      badges: ['early_adopter', 'reliable_player', 'premium'],
      stats: {
        totalSessions: 156,
        sessionsAttended: 142,
        reliabilityScore: 91,
        mvpCount: 23,
        hoursPlayed: 384,
        squadCount: 4,
      },
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await insertData(`user:${testUser.id}`, testUser);
    
    // Add test user to some squads
    for (const squad of squads.slice(0, 4)) {
      squad.members.push({
        userId: testUser.id,
        role: 'member',
        joinedAt: new Date().toISOString(),
      });
      await insertData(`squad:${squad.id}`, squad);
    }
    log(`  ✅ Compte de test créé: ${testUser.email}`, c.green);

    // Summary
    log('\n' + '='.repeat(60), c.cyan);
    log('📊 RÉSUMÉ DE LA GÉNÉRATION', c.cyan);
    log('='.repeat(60), c.cyan);
    log(`  👤 Utilisateurs: ${users.length + 1}`, c.green);
    log(`  👥 Squads: ${squads.length}`, c.green);
    log(`  📅 Sessions: ${sessionCount}`, c.green);
    log(`  🔗 Webhooks: 3`, c.green);
    log(`  🔔 Notifications: 10`, c.green);
    log('\n✅ ÉCOSYSTÈME GÉNÉRÉ AVEC SUCCÈS !', c.green);
    log('='.repeat(60) + '\n', c.cyan);

    // Instructions
    log('📋 PROCHAINES ÉTAPES:', c.yellow);
    log('  1. Lance l\'app: npm run dev', c.reset);
    log('  2. Connecte-toi avec un compte existant ou crée-en un', c.reset);
    log('  3. Tu verras les vraies données dans les écrans\n', c.reset);

  } catch (error: any) {
    log(`\n❌ ERREUR: ${error.message}`, c.red);
    process.exit(1);
  }
}

// Run
generateEcosystem();
