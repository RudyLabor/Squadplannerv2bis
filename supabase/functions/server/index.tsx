import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { projectId, publicAnonKey } from "./supabase-info.ts";
import { getOAuthAuthorizationUrl, exchangeCodeForToken, getUserInfo } from "./oauth-config.ts";
import { getAuthenticatedUser } from "./auth-helper.tsx";

const app = new Hono();

// Supabase URL from project info
const supabaseUrl = `https://${projectId}.supabase.co`;

// Log server startup for debugging
console.log('🚀 Squad Planner Edge Function starting...');
console.log(`📅 Server timestamp: ${new Date().toISOString()}`);
console.log('🔧 Auth helper version: 2.0.1-with-projectId-fix');

// Check environment variables
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const dbUrl = Deno.env.get('SUPABASE_DB_URL');

if (!serviceRoleKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set!');
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

console.log('✅ Environment check:', {
  supabaseUrl,
  hasServiceRoleKey: !!serviceRoleKey,
  serviceRoleKeyLength: serviceRoleKey.length,
  serviceRoleKeyPrefix: serviceRoleKey.substring(0, 20) + '...',
  hasDbUrl: !!dbUrl,
});

// Supabase client with SERVICE_ROLE_KEY for admin operations only
// - Creating users (auth.admin.createUser)
// - Listing users (auth.admin.listUsers)
// - Updating users (auth.admin.updateUserById)
// ⚠️ Do NOT use this for JWT validation - see getAuthenticatedUser() function
const supabase = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  }
);

// Supabase client with ANON_KEY for non-authenticated operations
// Note: We don't use this for JWT validation - we verify JWTs locally with jose
// See getAuthenticatedUser() function for JWT verification
const supabaseAnon = createClient(
  supabaseUrl,
  publicAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  }
);

// Log environment setup (without exposing sensitive keys)
console.log('🚀 Server starting with config:', {
  supabaseUrl,
  usingPublicAnonKey: !!publicAnonKey,
  anonKeyPrefix: publicAnonKey?.substring(0, 20) + '...',
  hasServiceRoleClient: !!supabase,
  hasAnonClient: !!supabaseAnon
});

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ============================================================
// AUTO-GENERATE DEMO ECOSYSTEM ON STARTUP
// ============================================================

// TEMPORARILY DISABLED FOR DEPLOYMENT
// The dynamic import causes deployment issues
// You can manually generate demo data if needed

console.log('ℹ️  Auto-generation of demo data is disabled for deployment.');

// ============================================================
// AUTH MIDDLEWARE
// ============================================================
// Auth helper imported from ./auth-helper.tsx

// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/make-server-e884809f/health", (c) => {
  return c.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    version: "2.0.1-auth-fix",
    authHelperFixed: true
  });
});

// ============================================================
// DEBUG ENDPOINT - Environment & Auth Check
// ============================================================

app.get("/make-server-e884809f/debug/env", (c) => {
  const svcRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const dbUrl = Deno.env.get('SUPABASE_DB_URL');
  const supabaseUrlEnv = Deno.env.get('SUPABASE_URL');
  
  return c.json({
    timestamp: new Date().toISOString(),
    version: "2.0.1-auth-fix",
    environment: {
      hasServiceRoleKey: !!svcRoleKey,
      serviceRoleKeyLength: svcRoleKey?.length || 0,
      serviceRoleKeyPrefix: svcRoleKey?.substring(0, 30) + '...' || 'missing',
      hasAnonKey: !!anonKey,
      anonKeyLength: anonKey?.length || 0,
      hasDbUrl: !!dbUrl,
      supabaseUrlEnv: supabaseUrlEnv || 'not set',
      supabaseUrlComputed: supabaseUrl,
      projectId: projectId
    }
  });
});

// ============================================================
// AUTH ROUTES
// ============================================================

// Debug route to check JWT token validity with detailed logging
app.post("/make-server-e884809f/auth/verify-token", async (c) => {
  console.log('\n🧪 === VERIFY TOKEN DEBUG ROUTE CALLED ===');
  
  try {
    const authHeader = c.req.header('Authorization');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader) {
      return c.json({ 
        valid: false,
        error: 'No Authorization header',
        debug: {
          hasHeader: false
        }
      }, 401);
    }
    
    console.log('Calling getAuthenticatedUser...');
    const user = await getAuthenticatedUser(authHeader);
    console.log('getAuthenticatedUser returned:', user ? 'user object' : 'null');
    
    if (!user) {
      return c.json({ 
        valid: false,
        error: 'Token invalide ou expiré',
        debug: {
          hasHeader: true,
          userReturned: false,
          note: 'Check server logs for detailed auth errors'
        }
      }, 401);
    }
    
    console.log('✅ Token valid for user:', user.email);
    return c.json({ 
      valid: true,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error: any) {
    console.error('❌ Verify token error:', error);
    return c.json({ 
      valid: false,
      error: error.message,
      debug: {
        errorName: error.name,
        errorStack: error.stack
      }
    }, 500);
  }
});

// Sign Up
app.post("/make-server-e884809f/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, avatar } = body;

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password et nom requis' }, 400);
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, avatar },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Sign up error:', error.message);
      return c.json({ error: error.message }, 400);
    }

    // Store user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email: data.user.email,
      name,
      avatar,
      reliabilityScore: 100,
      totalSessions: 0,
      attendedSessions: 0,
      createdAt: new Date().toISOString(),
    });

    return c.json({ 
      user: data.user,
      message: 'Compte créé avec succès !' 
    });
  } catch (error) {
    console.log('Sign up error during main signup flow:', error);
    return c.json({ error: 'Erreur lors de la création du compte' }, 500);
  }
});

// Sign In (handled by Supabase client in frontend)
// Session check (handled by Supabase client in frontend)

// Check if user exists (for debugging login issues)
app.post("/make-server-e884809f/auth/check-user", async (c) => {
  try {
    const body = await c.req.json();
    const { email } = body;

    if (!email) {
      return c.json({ error: 'Email requis' }, 400);
    }

    // Try to get user by email using admin API
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error('Error listing users:', userError);
      return c.json({ error: 'Erreur lors de la vérification' }, 500);
    }

    const user = userData.users.find(u => u.email === email);
    
    if (!user) {
      return c.json({ 
        exists: false, 
        message: 'Aucun compte trouvé avec cet email' 
      });
    }

    return c.json({ 
      exists: true,
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        email_confirmed_at: user.email_confirmed_at,
        last_sign_in_at: user.last_sign_in_at
      },
      message: 'Compte trouvé' 
    });
  } catch (error) {
    console.error('Check user error:', error);
    return c.json({ error: 'Erreur lors de la vérification du compte' }, 500);
  }
});

// Reset user password (for support/debugging)
app.post("/make-server-e884809f/auth/reset-password-admin", async (c) => {
  try {
    const body = await c.req.json();
    const { email, newPassword } = body;

    if (!email || !newPassword) {
      return c.json({ error: 'Email et nouveau mot de passe requis' }, 400);
    }

    // Get user by email
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error('Error listing users:', userError);
      return c.json({ error: 'Erreur lors de la vérification' }, 500);
    }

    const user = userData.users.find(u => u.email === email);
    
    if (!user) {
      return c.json({ error: 'Aucun compte trouvé avec cet email' }, 404);
    }

    // Update user password
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (updateError) {
      console.error('Error updating password:', updateError);
      return c.json({ error: 'Erreur lors de la mise à jour du mot de passe' }, 500);
    }

    return c.json({ 
      message: 'Mot de passe réinitialisé avec succès',
      email: email
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return c.json({ error: 'Erreur lors de la réinitialisation du mot de passe' }, 500);
  }
});

// Get User Profile
app.get("/make-server-e884809f/auth/profile", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    console.log('Get profile request - Auth header present:', !!authHeader);
    
    const user = await getAuthenticatedUser(authHeader);
    
    if (!user) {
      console.log('Get profile - User not authenticated');
      return c.json({ error: 'Non autorisé' }, 401);
    }

    console.log(`Get profile - User authenticated: ${user.id}`);

    let profile = await kv.get(`user:${user.id}`);
    console.log(`Get profile - Profile found in KV:`, !!profile);
    
    // If no profile exists, create a default one
    if (!profile) {
      console.log(`Creating default profile for user ${user.id}`);
      
      // Check if user is premium (rudylabor@hotmail.fr)
      const isPremium = user.email === 'rudylabor@hotmail.fr';
      
      profile = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Joueur',
        avatar: user.user_metadata?.avatar || '🎮',
        isPremium, // Premium status
        reliabilityScore: 100,
        totalSessions: 0,
        attendedSessions: 0,
        createdAt: new Date().toISOString(),
      };
      
      try {
        await kv.set(`user:${user.id}`, profile);
        console.log(`Default profile created successfully for user ${user.id} - Premium: ${isPremium}`);
      } catch (kvError) {
        console.error(`KV set error for user ${user.id}:`, kvError);
        // Continue anyway with the profile object
      }
    } else {
      // Update existing profile to add premium flag if email matches
      if (user.email === 'rudylabor@hotmail.fr' && !profile.isPremium) {
        console.log(`Upgrading user ${user.id} to Premium`);
        profile.isPremium = true;
        await kv.set(`user:${user.id}`, profile);
      }
    }

    // Load user integrations
    const integrations = await kv.get(`user-integrations:${user.id}`);
    
    // Attach integrations to profile
    if (integrations) {
      profile.integrations = integrations;
    }

    return c.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    return c.json({ error: 'Erreur lors de la récupération du profil' }, 500);
  }
});

// Update User Profile
app.put("/make-server-e884809f/auth/profile", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      console.log('❌ PUT /auth/profile - User not authenticated');
      return c.json({ 
        code: 401,
        error: 'Non autorisé',
        message: 'Invalid JWT'
      }, 401);
    }

    const body = await c.req.json();
    const currentProfile = await kv.get(`user:${user.id}`);

    const updatedProfile = {
      ...currentProfile,
      ...body,
      id: user.id, // Prevent ID override
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`user:${user.id}`, updatedProfile);
    
    console.log('✅ PUT /auth/profile - Profile updated for user:', user.id);

    return c.json({ profile: updatedProfile });
  } catch (error) {
    console.log('❌ Update profile error:', error);
    return c.json({ 
      code: 500,
      error: 'Erreur lors de la mise à jour du profil',
      message: error?.message || 'Internal server error'
    }, 500);
  }
});

// Update User Profile - BYPASS Route (no JWT verification, uses userId from body)
// ⚠️ TEMPORARY: This is a workaround for the JWT verification issue
app.put("/make-server-e884809f/auth/profile-bypass", async (c) => {
  console.log('🚨🚨🚨 BYPASS ROUTE CALLED /auth/profile-bypass 🚨🚨🚨');
  console.log('Request method:', c.req.method);
  console.log('Request URL:', c.req.url);
  
  try {
    const body = await c.req.json();
    console.log('Request body:', body);
    
    // Expect userId in the body for this bypass route
    const { userId, ...updates } = body;
    
    if (!userId) {
      console.log('❌ PUT /auth/profile-bypass - No userId provided');
      return c.json({ 
        code: 400,
        error: 'Bad request',
        message: 'userId is required in request body'
      }, 400);
    }

    console.log('🚨 BYPASS: Updating profile for user (no JWT verification):', userId);

    const currentProfile = await kv.get(`user:${userId}`);

    const updatedProfile = {
      ...currentProfile,
      ...updates,
      id: userId, // Prevent ID override
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`user:${userId}`, updatedProfile);
    
    console.log('✅ PUT /auth/profile-bypass - Profile updated for user:', userId);

    return c.json({ profile: updatedProfile });
  } catch (error) {
    console.log('❌ Update profile bypass error:', error);
    return c.json({ 
      code: 500,
      error: 'Erreur lors de la mise à jour du profil',
      message: error?.message || 'Internal server error'
    }, 500);
  }
});

// ============================================================
// SQUADS ROUTES
// ============================================================

// Get all squads
app.get("/make-server-e884809f/squads", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      console.log('❌ GET /squads - User not authenticated');
      return c.json({ 
        error: 'Non autorisé',
        message: 'Invalid JWT'
      }, 401);
    }

    console.log('✅ GET /squads - User authenticated:', user.id);
    const squads = await kv.getByPrefix('squad:');
    
    // Filter squads where user is a member
    const userSquads = squads.filter((squad: any) => 
      squad.members?.some((m: any) => m.id === user.id)
    );

    console.log(`✅ GET /squads - Found ${userSquads.length} squads for user ${user.id}`);
    return c.json({ squads: userSquads });
  } catch (error) {
    console.error('❌ Get squads error:', error);
    return c.json({ error: 'Erreur lors de la récupération des squads' }, 500);
  }
});

// Get squad by ID
app.get("/make-server-e884809f/squads/:id", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const squadId = c.req.param('id');
    const squad = await kv.get(`squad:${squadId}`);

    if (!squad) {
      return c.json({ error: 'Squad non trouvé' }, 404);
    }

    // Check if user is a member
    const isMember = squad.members?.some((m: any) => m.id === user.id);
    
    if (!isMember) {
      return c.json({ error: 'Accès refusé' }, 403);
    }

    return c.json({ squad });
  } catch (error) {
    console.log('Get squad error:', error);
    return c.json({ error: 'Erreur lors de la récupération du squad' }, 500);
  }
});

// Create squad
app.post("/make-server-e884809f/squads", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const body = await c.req.json();
    const { name, game, description, avatar, members = [] } = body;

    if (!name || !game) {
      return c.json({ error: 'Nom et jeu requis' }, 400);
    }

    const squadId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const inviteCode = Math.random().toString(36).substr(2, 8).toUpperCase();
    const userProfile = await kv.get(`user:${user.id}`);

    const squad = {
      id: squadId,
      name,
      game,
      description,
      avatar,
      ownerId: user.id,
      inviteCode, // Add invite code
      members: [
        {
          id: user.id,
          name: userProfile?.name || user.email,
          avatar: userProfile?.avatar,
          role: 'owner',
          reliabilityScore: userProfile?.reliabilityScore || 100,
        },
        ...members,
      ],
      stats: {
        totalSessions: 0,
        activePlayers: 1,
        avgReliability: userProfile?.reliabilityScore || 100,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`squad:${squadId}`, squad);
    // Also index by invite code for easy lookup
    await kv.set(`invite:${inviteCode}`, { squadId, createdAt: new Date().toISOString() });

    // Trigger webhook
    await triggerWebhooks(user.id, 'squad.created', { squad });

    return c.json({ squad, message: 'Squad créé avec succès !' });
  } catch (error) {
    console.log('Create squad error:', error);
    return c.json({ error: 'Erreur lors de la création du squad' }, 500);
  }
});

// Join squad by invite code
app.post("/make-server-e884809f/squads/join", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const body = await c.req.json();
    const { inviteCode } = body;

    if (!inviteCode) {
      return c.json({ error: 'Code d\'invitation requis' }, 400);
    }

    // Find squad by invite code
    const invite = await kv.get(`invite:${inviteCode.toUpperCase()}`);
    
    if (!invite || !invite.squadId) {
      return c.json({ error: 'Code d\'invitation invalide' }, 404);
    }

    const squad = await kv.get(`squad:${invite.squadId}`);

    if (!squad) {
      return c.json({ error: 'Squad non trouvé' }, 404);
    }

    // Check if already a member
    const isMember = squad.members?.some((m: any) => m.id === user.id);
    
    if (isMember) {
      return c.json({ error: 'Vous êtes déjà membre de cette squad' }, 400);
    }

    // Add user to squad
    const userProfile = await kv.get(`user:${user.id}`);
    
    const newMember = {
      id: user.id,
      name: userProfile?.name || user.email,
      avatar: userProfile?.avatar,
      role: 'member',
      reliabilityScore: userProfile?.reliabilityScore || 100,
      joinedAt: new Date().toISOString(),
    };

    squad.members.push(newMember);
    squad.stats.activePlayers = squad.members.length;
    squad.updatedAt = new Date().toISOString();

    await kv.set(`squad:${squad.id}`, squad);

    // Trigger webhook
    await triggerWebhooks(user.id, 'squad.member_joined', { squad, member: newMember });

    return c.json({ squad, message: 'Vous avez rejoint la squad !' });
  } catch (error) {
    console.log('Join squad error:', error);
    return c.json({ error: 'Erreur lors de l\'adhésion à la squad' }, 500);
  }
});

// Update squad
app.put("/make-server-e884809f/squads/:id", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const squadId = c.req.param('id');
    const squad = await kv.get(`squad:${squadId}`);

    if (!squad) {
      return c.json({ error: 'Squad non trouvé' }, 404);
    }

    if (squad.ownerId !== user.id) {
      return c.json({ error: 'Seul le propriétaire peut modifier le squad' }, 403);
    }

    const body = await c.req.json();
    const updatedSquad = {
      ...squad,
      ...body,
      id: squadId, // Prevent ID override
      ownerId: squad.ownerId, // Prevent owner override
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`squad:${squadId}`, updatedSquad);

    // Trigger webhook
    await triggerWebhooks(user.id, 'squad.updated', { squad: updatedSquad });

    return c.json({ squad: updatedSquad });
  } catch (error) {
    console.log('Update squad error:', error);
    return c.json({ error: 'Erreur lors de la mise à jour du squad' }, 500);
  }
});

// Delete squad
app.delete("/make-server-e884809f/squads/:id", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const squadId = c.req.param('id');
    const squad = await kv.get(`squad:${squadId}`);

    if (!squad) {
      return c.json({ error: 'Squad non trouvé' }, 404);
    }

    if (squad.ownerId !== user.id) {
      return c.json({ error: 'Seul le propriétaire peut supprimer le squad' }, 403);
    }

    await kv.del(`squad:${squadId}`);

    // Delete all sessions for this squad
    const sessions = await kv.getByPrefix(`session:${squadId}:`);
    for (const session of sessions) {
      await kv.del(`session:${squadId}:${session.id}`);
    }

    return c.json({ message: 'Squad supprimé avec succès' });
  } catch (error) {
    console.log('Delete squad error:', error);
    return c.json({ error: 'Erreur lors de la suppression du squad' }, 500);
  }
});

// ============================================================
// SESSIONS ROUTES
// ============================================================

// Get sessions for a squad
app.get("/make-server-e884809f/squads/:squadId/sessions", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const squadId = c.req.param('squadId');
    const squad = await kv.get(`squad:${squadId}`);

    if (!squad) {
      return c.json({ error: 'Squad non trouvé' }, 404);
    }

    const sessions = await kv.getByPrefix(`session:${squadId}:`);

    return c.json({ sessions });
  } catch (error) {
    console.log('Get sessions error:', error);
    return c.json({ error: 'Erreur lors de la récupération des sessions' }, 500);
  }
});

// Get all sessions for user
app.get("/make-server-e884809f/sessions", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      console.log('❌ GET /sessions - User not authenticated');
      return c.json({ 
        error: 'Non autorisé',
        message: 'Invalid JWT'
      }, 401);
    }

    console.log('✅ GET /sessions - User authenticated:', user.id);
    const allSessions = await kv.getByPrefix('session:');
    
    // Filter sessions where user is invited or RSVP'd
    const userSessions = allSessions.filter((session: any) =>
      session.proposedBy === user.id ||
      session.slots?.some((slot: any) => 
        slot.responses?.some((r: any) => r.playerId === user.id)
      )
    );

    console.log(`✅ GET /sessions - Found ${userSessions.length} sessions for user ${user.id}`);
    return c.json({ sessions: userSessions });
  } catch (error) {
    console.error('❌ Get all sessions error:', error);
    return c.json({ error: 'Erreur lors de la récupération des sessions' }, 500);
  }
});

// Create session
app.post("/make-server-e884809f/squads/:squadId/sessions", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const squadId = c.req.param('squadId');
    const squad = await kv.get(`squad:${squadId}`);

    if (!squad) {
      return c.json({ error: 'Squad non trouvé' }, 404);
    }

    const body = await c.req.json();
    const { title, game, slots, playersNeeded } = body;

    if (!title || !game || !slots || !playersNeeded) {
      return c.json({ error: 'Titre, jeu, créneaux et nombre de joueurs requis' }, 400);
    }

    const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const userProfile = await kv.get(`user:${user.id}`);

    const session = {
      id: sessionId,
      squadId,
      squadName: squad.name,
      title,
      game,
      proposedBy: user.id,
      proposedByName: userProfile?.name || user.email,
      proposedByAvatar: userProfile?.avatar,
      playersNeeded,
      slots: slots.map((slot: any) => ({
        ...slot,
        responses: [],
      })),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`session:${squadId}:${sessionId}`, session);

    // Update squad stats
    squad.stats.totalSessions = (squad.stats.totalSessions || 0) + 1;
    await kv.set(`squad:${squadId}`, squad);

    // Trigger webhook
    await triggerWebhooks(user.id, 'session.created', { session });

    // Schedule push notifications
    await schedulePushNotifications(session);

    return c.json({ session, message: 'Session créée avec succès !' });
  } catch (error) {
    console.log('Create session error:', error);
    return c.json({ error: 'Erreur lors de la création de la session' }, 500);
  }
});

// RSVP to session slot
app.post("/make-server-e884809f/sessions/:sessionId/rsvp", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const sessionId = c.req.param('sessionId');
    const body = await c.req.json();
    const { slotId, response } = body;

    if (!slotId || !response) {
      return c.json({ error: 'Créneau et réponse requis' }, 400);
    }

    // Find session across all squads
    const allSessions = await kv.getByPrefix('session:');
    const session = allSessions.find((s: any) => s.id === sessionId);

    if (!session) {
      return c.json({ error: 'Session non trouvée' }, 404);
    }

    const userProfile = await kv.get(`user:${user.id}`);

    // Update slot responses
    const updatedSlots = session.slots.map((slot: any) => {
      if (slot.id === slotId) {
        // Remove previous response from this user
        const filteredResponses = slot.responses.filter(
          (r: any) => r.playerId !== user.id
        );

        return {
          ...slot,
          responses: [
            ...filteredResponses,
            {
              playerId: user.id,
              playerName: userProfile?.name || user.email,
              playerAvatar: userProfile?.avatar,
              response,
              timestamp: new Date().toISOString(),
            },
          ],
        };
      }
      return slot;
    });

    const updatedSession = {
      ...session,
      slots: updatedSlots,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`session:${session.squadId}:${sessionId}`, updatedSession);

    // Check if session is confirmed (enough "yes" responses)
    const confirmedSlot = updatedSlots.find((slot: any) => {
      const yesCount = slot.responses.filter((r: any) => r.response === 'yes').length;
      return yesCount >= session.playersNeeded;
    });

    if (confirmedSlot && session.status === 'pending') {
      updatedSession.status = 'confirmed';
      updatedSession.confirmedSlot = confirmedSlot;
      await kv.set(`session:${session.squadId}:${sessionId}`, updatedSession);
    }

    // Trigger webhook
    await triggerWebhooks(user.id, 'player.rsvp', { session: updatedSession, response });

    return c.json({ session: updatedSession, message: 'RSVP enregistré !' });
  } catch (error) {
    console.log('RSVP error:', error);
    return c.json({ error: 'Erreur lors de l\'enregistrement du RSVP' }, 500);
  }
});

// Update session status
app.put("/make-server-e884809f/sessions/:sessionId/status", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const sessionId = c.req.param('sessionId');
    const body = await c.req.json();
    const { status } = body;

    if (!status) {
      return c.json({ error: 'Statut requis' }, 400);
    }

    const allSessions = await kv.getByPrefix('session:');
    const session = allSessions.find((s: any) => s.id === sessionId);

    if (!session) {
      return c.json({ error: 'Session non trouvée' }, 404);
    }

    if (session.proposedBy !== user.id) {
      return c.json({ error: 'Seul le créateur peut modifier le statut' }, 403);
    }

    const updatedSession = {
      ...session,
      status,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`session:${session.squadId}:${sessionId}`, updatedSession);

    // Trigger webhooks based on status
    if (status === 'cancelled') {
      await triggerWebhooks(user.id, 'session.cancelled', { session: updatedSession });
    } else if (status === 'in-progress') {
      await triggerWebhooks(user.id, 'session.starting', { session: updatedSession });
    } else if (status === 'completed') {
      // Update reliability scores
      await updateReliabilityScores(session);
    }

    return c.json({ session: updatedSession });
  } catch (error) {
    console.log('Update session status error:', error);
    return c.json({ error: 'Erreur lors de la mise à jour du statut' }, 500);
  }
});

// ============================================================
// CHECK-IN ROUTES (ROADMAP #2)
// ============================================================

// Submit check-in for a session
app.post("/make-server-e884809f/sessions/:sessionId/check-in", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const sessionId = c.req.param('sessionId');
    const { status, note } = await c.req.json(); // status: 'present' | 'late' | 'absent'
    
    console.log(`Check-in for session ${sessionId} by user ${user.id} with status: ${status}`);

    // Find the session across all squads
    const allSessions = await kv.getByPrefix('session:');
    const session = allSessions.find((s: any) => s.id === sessionId);

    if (!session) {
      return c.json({ error: 'Session non trouvée' }, 404);
    }

    // Check if user is a member of the squad
    const squad = await kv.get(`squad:${session.squadId}`);
    if (!squad) {
      return c.json({ error: 'Squad non trouvée' }, 404);
    }

    const isMember = squad.members?.some((m: any) => m.id === user.id);
    if (!isMember) {
      return c.json({ error: 'Vous n\'êtes pas membre de cette squad' }, 403);
    }

    // Initialize check-ins array if it doesn't exist
    if (!session.checkIns) {
      session.checkIns = [];
    }

    // Remove existing check-in for this user (if any)
    session.checkIns = session.checkIns.filter((ci: any) => ci.userId !== user.id);

    // Add new check-in
    const checkIn = {
      userId: user.id,
      userName: user.user_metadata?.name || user.email,
      status, // 'present', 'late', 'absent'
      note: note || '',
      timestamp: new Date().toISOString(),
    };

    session.checkIns.push(checkIn);
    session.updatedAt = new Date().toISOString();

    // Save updated session
    await kv.set(`session:${session.squadId}:${sessionId}`, session);

    // Update reliability score based on check-in
    await updateReliabilityFromCheckIn(user.id, session, status);

    console.log(`✅ Check-in recorded: ${status} for user ${user.id}`);

    return c.json({ 
      checkIn,
      message: `Check-in enregistré : ${status}` 
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return c.json({ error: 'Erreur lors du check-in' }, 500);
  }
});

// Get check-ins for a session
app.get("/make-server-e884809f/sessions/:sessionId/check-ins", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const sessionId = c.req.param('sessionId');

    // Find the session
    const allSessions = await kv.getByPrefix('session:');
    const session = allSessions.find((s: any) => s.id === sessionId);

    if (!session) {
      return c.json({ error: 'Session non trouvée' }, 404);
    }

    return c.json({ 
      checkIns: session.checkIns || [],
      sessionId 
    });
  } catch (error) {
    console.error('Get check-ins error:', error);
    return c.json({ error: 'Erreur lors de la récupération des check-ins' }, 500);
  }
});

// Get user's reliability stats and badges
app.get("/make-server-e884809f/users/:userId/stats", async (c) => {
  try {
    const authUser = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!authUser) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const userId = c.req.param('userId');
    
    // Get user profile
    const userProfile = await kv.get(`user:${userId}`);
    
    if (!userProfile) {
      return c.json({ error: 'Utilisateur non trouvé' }, 404);
    }

    // Calculate stats
    const totalSessions = userProfile.totalSessions || 0;
    const attendedSessions = userProfile.attendedSessions || 0;
    const reliabilityScore = userProfile.reliabilityScore || 100;
    
    const attendanceRate = totalSessions > 0 ? Math.round((attendedSessions / totalSessions) * 100) : 100;
    const noShowCount = totalSessions - attendedSessions;
    const noShowRate = totalSessions > 0 ? Math.round((noShowCount / totalSessions) * 100) : 0;

    // Calculate badges
    const badges = calculateBadgesDetailed({
      reliabilityScore,
      totalSessions,
      attendedSessions,
      attendanceRate,
      noShowRate,
    });

    const stats = {
      userId,
      totalSessions,
      attendedSessions,
      reliabilityScore,
      attendanceRate,
      noShowCount,
      noShowRate,
      badges,
    };

    return c.json({ stats });
  } catch (error) {
    console.error('Get user stats error:', error);
    return c.json({ error: 'Erreur lors de la récupération des stats' }, 500);
  }
});

// Get leaderboard (ROADMAP #2)
app.get("/make-server-e884809f/leaderboard", async (c) => {
  try {
    const authUser = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!authUser) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    // Get all users
    const allUsers = await kv.getByPrefix('user:');
    
    // Sort by reliability score
    const sortedUsers = allUsers
      .filter((u: any) => u.reliabilityScore !== undefined)
      .sort((a: any, b: any) => (b.reliabilityScore || 0) - (a.reliabilityScore || 0))
      .slice(0, 100); // Top 100
    
    // Map to leaderboard format
    const leaderboard = sortedUsers.map((user: any, index: number) => ({
      rank: index + 1,
      userId: user.id,
      name: user.name,
      avatar: user.avatar,
      reliabilityScore: user.reliabilityScore || 100,
      totalSessions: user.totalSessions || 0,
      attendedSessions: user.attendedSessions || 0,
      isPremium: user.isPremium || false,
    }));

    return c.json({ leaderboard });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return c.json({ error: 'Erreur lors de la récupération du classement' }, 500);
  }
});

// ============================================================
// WEBHOOKS ROUTES
// ============================================================

// Get webhooks for user
app.get("/make-server-e884809f/webhooks", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const webhooks = await kv.getByPrefix(`webhook:${user.id}:`);

    return c.json({ webhooks });
  } catch (error) {
    console.log('Get webhooks error:', error);
    return c.json({ error: 'Erreur lors de la récupération des webhooks' }, 500);
  }
});

// Create webhook
app.post("/make-server-e884809f/webhooks", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const body = await c.req.json();
    const { name, url, events } = body;

    if (!name || !url || !events || events.length === 0) {
      return c.json({ error: 'Nom, URL et événements requis' }, 400);
    }

    const webhookId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const webhook = {
      id: webhookId,
      userId: user.id,
      name,
      url,
      events,
      isActive: true,
      totalCalls: 0,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`webhook:${user.id}:${webhookId}`, webhook);

    return c.json({ webhook, message: 'Webhook créé avec succès !' });
  } catch (error) {
    console.log('Create webhook error:', error);
    return c.json({ error: 'Erreur lors de la création du webhook' }, 500);
  }
});

// Update webhook
app.put("/make-server-e884809f/webhooks/:id", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const webhookId = c.req.param('id');
    const webhook = await kv.get(`webhook:${user.id}:${webhookId}`);

    if (!webhook) {
      return c.json({ error: 'Webhook non trouvé' }, 404);
    }

    const body = await c.req.json();
    const updatedWebhook = {
      ...webhook,
      ...body,
      id: webhookId,
      userId: user.id,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`webhook:${user.id}:${webhookId}`, updatedWebhook);

    return c.json({ webhook: updatedWebhook });
  } catch (error) {
    console.log('Update webhook error:', error);
    return c.json({ error: 'Erreur lors de la mise à jour du webhook' }, 500);
  }
});

// Delete webhook
app.delete("/make-server-e884809f/webhooks/:id", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const webhookId = c.req.param('id');
    await kv.del(`webhook:${user.id}:${webhookId}`);

    return c.json({ message: 'Webhook supprimé avec succès' });
  } catch (error) {
    console.log('Delete webhook error:', error);
    return c.json({ error: 'Erreur lors de la suppression du webhook' }, 500);
  }
});

// ============================================================
// PUSH NOTIFICATIONS ROUTES
// ============================================================

// Get notification settings
app.get("/make-server-e884809f/notifications/settings", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const settings = await kv.get(`notifications:${user.id}`) || {
      enabled: false,
      beforeSession24h: true,
      beforeSession1h: true,
      onSessionStart: true,
      onRsvpUpdate: true,
    };

    return c.json({ settings });
  } catch (error) {
    console.log('Get notification settings error:', error);
    return c.json({ error: 'Erreur lors de la récupération des paramètres' }, 500);
  }
});

// Update notification settings
app.put("/make-server-e884809f/notifications/settings", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const body = await c.req.json();
    await kv.set(`notifications:${user.id}`, body);

    return c.json({ settings: body, message: 'Paramètres enregistrés !' });
  } catch (error) {
    console.log('Update notification settings error:', error);
    return c.json({ error: 'Erreur lors de la mise à jour des paramètres' }, 500);
  }
});

// ============================================================
// DISCORD BOT ROUTES
// ============================================================

// Connect Discord
app.post("/make-server-e884809f/discord/connect", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const body = await c.req.json();
    const { serverId, channelId } = body;

    if (!serverId || !channelId) {
      return c.json({ error: 'Server ID et Channel ID requis' }, 400);
    }

    const discordConfig = {
      userId: user.id,
      serverId,
      channelId,
      isConnected: true,
      connectedAt: new Date().toISOString(),
    };

    await kv.set(`discord:${user.id}`, discordConfig);

    return c.json({ config: discordConfig, message: 'Discord connecté !' });
  } catch (error) {
    console.log('Connect Discord error:', error);
    return c.json({ error: 'Erreur lors de la connexion Discord' }, 500);
  }
});

// Get Discord config
app.get("/make-server-e884809f/discord/config", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const config = await kv.get(`discord:${user.id}`);

    return c.json({ config: config || { isConnected: false } });
  } catch (error) {
    console.log('Get Discord config error:', error);
    return c.json({ error: 'Erreur lors de la récupération de la config Discord' }, 500);
  }
});

// Disconnect Discord
app.delete("/make-server-e884809f/discord/disconnect", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    await kv.del(`discord:${user.id}`);

    return c.json({ message: 'Discord déconnecté' });
  } catch (error) {
    console.log('Disconnect Discord error:', error);
    return c.json({ error: 'Erreur lors de la déconnexion Discord' }, 500);
  }
});

// ============================================================
// INTELLIGENCE & ANALYTICS ROUTES
// ============================================================

// Get heatmap data (availability patterns)
app.get("/make-server-e884809f/analytics/heatmap", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    // Get all sessions for user's squads
    const allSessions = await kv.getByPrefix('session:');
    const userSquads = await kv.getByPrefix('squad:');
    
    // Filter user's squads
    const mySquads = userSquads.filter((squad: any) =>
      squad.members?.some((m: any) => m.id === user.id)
    );
    const mySquadIds = mySquads.map((s: any) => s.id);
    
    // Filter sessions from user's squads
    const mySessions = allSessions.filter((session: any) =>
      mySquadIds.includes(session.squadId)
    );

    // Generate heatmap data
    const heatmap: any[] = [];
    const slotCounts: Record<string, { count: number; accepted: number }> = {};

    mySessions.forEach((session: any) => {
      session.slots?.forEach((slot: any) => {
        const date = new Date(slot.date + 'T' + slot.time);
        const hour = date.getHours();
        const day = date.getDay();
        const key = `${day}-${hour}`;

        if (!slotCounts[key]) {
          slotCounts[key] = { count: 0, accepted: 0 };
        }

        slotCounts[key].count++;
        const acceptedCount = slot.responses?.filter((r: any) => r.response === 'yes').length || 0;
        slotCounts[key].accepted += acceptedCount;
      });
    });

    // Convert to heatmap format
    Object.entries(slotCounts).forEach(([key, data]) => {
      const [day, hour] = key.split('-').map(Number);
      const availability = data.count > 0 ? Math.round((data.accepted / data.count) * 100) : 0;
      
      heatmap.push({
        hour,
        day,
        availability,
        sessionsCount: data.count,
      });
    });

    return c.json({ heatmap });
  } catch (error) {
    console.log('Get heatmap error:', error);
    return c.json({ error: 'Erreur lors de la récupération de la heatmap' }, 500);
  }
});

// Get AI suggestions
app.get("/make-server-e884809f/analytics/suggestions", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    // This would normally use ML/AI, but we'll generate smart suggestions based on data
    const allSessions = await kv.getByPrefix('session:');
    const userSquads = await kv.getByPrefix('squad:');
    
    const mySquads = userSquads.filter((squad: any) =>
      squad.members?.some((m: any) => m.id === user.id)
    );

    const suggestions = [];

    // Suggestion: Best time slot
    // Find the most successful time slot
    // (This is simplified - real implementation would be more complex)

    suggestions.push({
      id: 'optimal-time',
      title: 'Proposer une session Mardi 21h',
      description: 'Basé sur l\'historique, ce créneau a 94% de chances de réunir toute la squad.',
      action: 'Créer la session',
      priority: 'high',
      data: { day: 'Tuesday', time: '21:00' },
    });

    return c.json({ suggestions });
  } catch (error) {
    console.log('Get suggestions error:', error);
    return c.json({ error: 'Erreur lors de la récupération des suggestions' }, 500);
  }
});

// Get squad cohesion metrics
app.get("/make-server-e884809f/squads/:squadId/cohesion", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const squadId = c.req.param('squadId');
    const squad = await kv.get(`squad:${squadId}`);

    if (!squad) {
      return c.json({ error: 'Squad non trouvé' }, 404);
    }

    // Calculate cohesion metrics
    const sessions = await kv.getByPrefix(`session:${squadId}:`);
    
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter((s: any) => s.status === 'completed').length;
    
    // Calculate average attendance
    let totalAttendance = 0;
    let attendanceCount = 0;
    
    sessions.forEach((session: any) => {
      session.slots?.forEach((slot: any) => {
        const responses = slot.responses || [];
        if (responses.length > 0) {
          const yesCount = responses.filter((r: any) => r.response === 'yes').length;
          totalAttendance += (yesCount / responses.length) * 100;
          attendanceCount++;
        }
      });
    });

    const avgAttendance = attendanceCount > 0 ? Math.round(totalAttendance / attendanceCount) : 0;

    // Calculate cohesion score (simplified)
    const cohesionScore = Math.min(100, Math.round(
      (completedSessions / Math.max(1, totalSessions)) * 50 +
      avgAttendance * 0.5
    ));

    const metrics = {
      score: cohesionScore,
      stability: Math.round(cohesionScore * 0.9), // Simplified
      avgAttendance,
      activeMembers: squad.members?.filter((m: any) => m.reliabilityScore > 70).length || 0,
      inactiveMembers: squad.members?.filter((m: any) => m.reliabilityScore <= 70).length || 0,
      avgReliability: Math.round(
        squad.members?.reduce((sum: number, m: any) => sum + (m.reliabilityScore || 0), 0) / 
        Math.max(1, squad.members?.length || 1)
      ),
      trend: cohesionScore >= 80 ? 'up' : cohesionScore >= 60 ? 'stable' : 'down',
      recommendations: [],
    };

    return c.json({ metrics, members: squad.members });
  } catch (error) {
    console.log('Get cohesion error:', error);
    return c.json({ error: 'Erreur lors du calcul de la cohésion' }, 500);
  }
});

// Get weekly recap
app.get("/make-server-e884809f/analytics/weekly-recap", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    // Get sessions from last 7 days
    const allSessions = await kv.getByPrefix('session:');
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentSessions = allSessions.filter((session: any) => {
      const sessionDate = new Date(session.createdAt);
      return sessionDate >= weekAgo;
    });

    const recap = {
      period: 'Cette semaine',
      sessionsPlanned: recentSessions.length,
      sessionsCompleted: recentSessions.filter((s: any) => s.status === 'completed').length,
      totalHours: recentSessions.length * 2.5, // Simplified
      avgAttendance: 89, // Simplified - would calculate from actual data
      highlights: [
        'Meilleure semaine du mois 🔥',
        'Aucune session annulée',
        '8 jours de streak',
      ],
    };

    return c.json({ recap });
  } catch (error) {
    console.log('Error fetching weekly recap:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// ============================================================
// CHAT ROUTES
// ============================================================

// Get squad messages
app.get("/make-server-e884809f/squads/:squadId/messages", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const squadId = c.req.param('squadId');
    const limit = parseInt(c.req.query('limit') || '50');
    
    // Get all messages for this squad
    const allMessages = await kv.getByPrefix(`message:${squadId}:`);
    
    // Sort by timestamp descending and limit
    const messages = allMessages
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
      .reverse(); // Return chronological order

    return c.json({ messages });
  } catch (error) {
    console.log('Error fetching messages:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// Send message
app.post("/make-server-e884809f/squads/:squadId/messages", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const squadId = c.req.param('squadId');
    const body = await c.req.json();
    const { content, type = 'text' } = body;

    if (!content?.trim()) {
      return c.json({ error: 'Le message ne peut pas être vide' }, 400);
    }

    const messageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const message = {
      id: messageId,
      squadId,
      userId: user.id,
      userName: user.user_metadata?.name || user.email?.split('@')[0] || 'Anonyme',
      userAvatar: user.user_metadata?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
      content: content.trim(),
      type, // 'text', 'system', 'session_created', etc.
      timestamp: new Date().toISOString(),
      reactions: [],
    };

    await kv.set(`message:${squadId}:${messageId}`, message);

    return c.json({ message }, 201);
  } catch (error) {
    console.log('Error sending message:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// Add reaction to message
app.post("/make-server-e884809f/messages/:messageId/reactions", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const messageId = c.req.param('messageId');
    const body = await c.req.json();
    const { emoji } = body;

    if (!emoji) {
      return c.json({ error: 'Emoji requis' }, 400);
    }

    // Get all messages and find the one to update
    const allMessages = await kv.getByPrefix('message:');
    const message = allMessages.find((m: any) => m.id === messageId);

    if (!message) {
      return c.json({ error: 'Message introuvable' }, 404);
    }

    // Add or remove reaction
    const existingReaction = message.reactions.find((r: any) => r.userId === user.id && r.emoji === emoji);
    
    if (existingReaction) {
      // Remove reaction
      message.reactions = message.reactions.filter((r: any) => !(r.userId === user.id && r.emoji === emoji));
    } else {
      // Add reaction
      message.reactions.push({
        userId: user.id,
        userName: user.user_metadata?.name || user.email?.split('@')[0] || 'Anonyme',
        emoji,
      });
    }

    await kv.set(`message:${message.squadId}:${messageId}`, message);

    return c.json({ message });
  } catch (error) {
    console.log('Error adding reaction:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// ============================================================
// HELPER FUNCTIONS
// ============================================================

// Trigger webhooks for events
async function triggerWebhooks(userId: string, event: string, payload: any) {
  try {
    const webhooks = await kv.getByPrefix(`webhook:${userId}:`);
    
    // Filter webhooks that are active and subscribed to this event
    const relevantWebhooks = webhooks.filter((webhook: any) => 
      webhook.isActive && webhook.events.includes(event)
    );

    // Send webhook requests (fire and forget)
    for (const webhook of relevantWebhooks) {
      try {
        fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Squad-Planner-Event': event,
          },
          body: JSON.stringify({
            event,
            timestamp: new Date().toISOString(),
            data: payload,
          }),
        }).catch(err => console.log(`Webhook ${webhook.id} failed:`, err));

        // Update webhook stats
        webhook.totalCalls = (webhook.totalCalls || 0) + 1;
        webhook.lastCalledAt = new Date().toISOString();
        await kv.set(`webhook:${userId}:${webhook.id}`, webhook);
      } catch (err) {
        console.log(`Error triggering webhook ${webhook.id}:`, err);
      }
    }
  } catch (error) {
    console.log('Error in triggerWebhooks:', error);
  }
}

// Schedule push notifications for a session
async function schedulePushNotifications(session: any) {
  try {
    // This would integrate with a push notification service
    // For now, just log that we would schedule notifications
    console.log(`Scheduling notifications for session ${session.id}`);
    
    // In production, this would:
    // 1. Find all squad members
    // 2. Check their notification preferences
    // 3. Schedule notifications via a service like Firebase Cloud Messaging
  } catch (error) {
    console.log('Error scheduling push notifications:', error);
  }
}

// Update reliability scores after a session
async function updateReliabilityScores(session: any) {
  try {
    console.log(`Updating reliability scores for session ${session.id}`);
    
    // Get all users who RSVP'd "yes" to the confirmed slot
    const confirmedSlot = session.slots?.find((slot: any) => slot.id === session.confirmedSlot?.id);
    
    if (!confirmedSlot) return;
    
    const yesResponses = confirmedSlot.responses?.filter((r: any) => r.response === 'yes') || [];
    
    // In a real implementation, we would:
    // 1. Track who actually showed up (via check-in system)
    // 2. Compare with who said "yes"
    // 3. Increase score for those who showed up
    // 4. Decrease score for those who didn't
    
    // For now, assume everyone who said "yes" showed up (simplified)
    for (const response of yesResponses) {
      const userProfile = await kv.get(`user:${response.playerId}`);
      
      if (userProfile) {
        userProfile.totalSessions = (userProfile.totalSessions || 0) + 1;
        userProfile.attendedSessions = (userProfile.attendedSessions || 0) + 1;
        
        // Calculate new reliability score
        const attendanceRate = userProfile.attendedSessions / userProfile.totalSessions;
        userProfile.reliabilityScore = Math.round(attendanceRate * 100);
        
        await kv.set(`user:${response.playerId}`, userProfile);
      }
    }
  } catch (error) {
    console.log('Error updating reliability scores:', error);
  }
}

// Update reliability score based on check-in status (ROADMAP #2)
async function updateReliabilityFromCheckIn(userId: string, session: any, status: 'present' | 'late' | 'absent') {
  try {
    console.log(`Updating reliability for user ${userId} with status: ${status}`);
    
    const userProfile = await kv.get(`user:${userId}`);
    
    if (!userProfile) {
      console.log(`User profile not found for ${userId}`);
      return;
    }

    // Initialize counters if they don't exist
    userProfile.totalSessions = (userProfile.totalSessions || 0) + 1;
    
    // Update attended sessions based on status
    if (status === 'present') {
      userProfile.attendedSessions = (userProfile.attendedSessions || 0) + 1;
    } else if (status === 'late') {
      // Count as partial attendance (0.8 weight)
      userProfile.attendedSessions = (userProfile.attendedSessions || 0) + 0.8;
    }
    // status === 'absent' doesn't increase attendedSessions
    
    // Calculate new reliability score
    const attendanceRate = userProfile.attendedSessions / userProfile.totalSessions;
    userProfile.reliabilityScore = Math.round(attendanceRate * 100);
    
    console.log(`✅ Updated reliability for ${userId}:`, {
      totalSessions: userProfile.totalSessions,
      attendedSessions: userProfile.attendedSessions,
      reliabilityScore: userProfile.reliabilityScore,
    });
    
    await kv.set(`user:${userId}`, userProfile);
  } catch (error) {
    console.error('Error updating reliability from check-in:', error);
  }
}

// Calculate badges based on user stats (ROADMAP #2)
function calculateBadgesDetailed(stats: any) {
  const badges = [];
  
  // Badge: Reliable - Score >= 95%
  if (stats.reliabilityScore >= 95) {
    badges.push({
      id: 'reliable',
      name: 'Fiable',
      description: 'Score de fiabilité ≥ 95%',
      icon: '🏆',
      rarity: 'legendary',
      unlockedAt: new Date().toISOString(),
    });
  }
  
  // Badge: Consistent - 10+ sessions AND 90%+ attendance
  if (stats.totalSessions >= 10 && stats.attendanceRate >= 90) {
    badges.push({
      id: 'consistent',
      name: 'Régulier',
      description: '10+ sessions avec 90%+ de présence',
      icon: '⭐',
      rarity: 'rare',
      unlockedAt: new Date().toISOString(),
    });
  }
  
  // Badge: Perfect Attendance - 0% no-show
  if (stats.totalSessions >= 5 && stats.noShowRate === 0) {
    badges.push({
      id: 'perfect',
      name: 'Présence Parfaite',
      description: 'Aucun no-show sur 5+ sessions',
      icon: '💎',
      rarity: 'legendary',
      unlockedAt: new Date().toISOString(),
    });
  }
  
  // Badge: Active Player - 20+ sessions
  if (stats.totalSessions >= 20) {
    badges.push({
      id: 'active',
      name: 'Joueur Actif',
      description: '20+ sessions complétées',
      icon: '🎮',
      rarity: 'epic',
      unlockedAt: new Date().toISOString(),
    });
  }
  
  // Badge: Squad Leader - Reliable + Active
  if (stats.reliabilityScore >= 95 && stats.totalSessions >= 30) {
    badges.push({
      id: 'leader',
      name: 'Leader de Squad',
      description: 'Score parfait sur 30+ sessions',
      icon: '👑',
      rarity: 'legendary',
      unlockedAt: new Date().toISOString(),
    });
  }
  
  return badges;
}

// ============================================================
// TEST DATA SETUP (DEV ONLY)
// ============================================================

// Setup test environment with mock data
app.post("/make-server-e884809f/test/setup", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const body = await c.req.json();
    const { squadId } = body;

    if (!squadId) {
      return c.json({ error: 'squadId requis' }, 400);
    }

    console.log('🧪 Setting up test environment for squad:', squadId);

    // Generate 15 test sessions spread over past 2 months
    const sessions = [];
    const today = new Date();
    
    // Generate sessions biased towards Tuesday 21h and Thursday 20h
    const patterns = [
      { day: 2, hour: 21, weight: 5 },  // Tuesday 21h - 5 sessions
      { day: 4, hour: 20, weight: 3 },  // Thursday 20h - 3 sessions
      { day: 6, hour: 18, weight: 2 },  // Saturday 18h - 2 sessions
    ];

    let sessionCount = 0;
    for (const pattern of patterns) {
      for (let i = 0; i < pattern.weight; i++) {
        const weeksAgo = i + 1;
        const sessionDate = new Date(today);
        sessionDate.setDate(today.getDate() - (weeksAgo * 7));
        
        // Set to the target day of week
        const currentDay = sessionDate.getDay();
        const daysToAdd = pattern.day - currentDay;
        sessionDate.setDate(sessionDate.getDate() + daysToAdd);

        const sessionId = crypto.randomUUID();
        const session = {
          id: sessionId,
          squadId,
          title: `Session Test ${sessionCount + 1}`,
          game: 'Valorant',
          date: sessionDate.toISOString().split('T')[0],
          time: `${String(pattern.hour).padStart(2, '0')}:00`,
          duration: 120,
          status: 'confirmed',
          confirmed: 4, // 4 out of 5 = 80% attendance
          declined: 1,
          total: 5,
          responses: [],
          createdAt: sessionDate.toISOString(),
        };

        await kv.set(`session:${squadId}:${sessionId}`, session);
        sessions.push(session);
        sessionCount++;
      }
    }

    // Generate 10 notifications
    const notifications = [];
    const types: Array<'session_confirmed' | 'reminder_24h' | 'new_vote' | 'badge_unlocked' | 'no_show'> = [
      'session_confirmed', 
      'reminder_24h', 
      'new_vote', 
      'badge_unlocked', 
      'no_show'
    ];
    
    const titles: Record<string, string> = {
      session_confirmed: 'Session confirmée',
      reminder_24h: 'Rappel : Session dans 24h',
      new_vote: 'Nouveau vote',
      badge_unlocked: 'Nouveau badge débloqué',
      no_show: 'Check-in manqué',
    };
    
    const messages: Record<string, string> = {
      session_confirmed: 'Votre session Valorant est confirmée pour demain à 21h',
      reminder_24h: 'N\'oublie pas : Session Valorant demain à 21h',
      new_vote: 'Alex a voté OUI pour la session de demain',
      badge_unlocked: 'Félicitations ! Tu as débloqué le badge "Fiable"',
      no_show: 'Tu as manqué la session d\'hier - Pense à faire le check-in',
    };

    for (let i = 0; i < 10; i++) {
      const type = types[i % types.length];
      const notifId = crypto.randomUUID();
      const hoursAgo = i * 3;
      const createdAt = new Date();
      createdAt.setHours(createdAt.getHours() - hoursAgo);

      const notification = {
        id: notifId,
        userId: user.id,
        type,
        title: titles[type],
        message: messages[type],
        metadata: {
          sessionId: sessions[0]?.id || crypto.randomUUID(),
          squadId,
        },
        read: i > 2, // First 3 unread, rest read
        createdAt: createdAt.toISOString(),
      };

      await kv.set(`notification:${user.id}:${notifId}`, notification);
      notifications.push(notification);
    }

    console.log('✅ Test environment created:', {
      sessions: sessions.length,
      notifications: notifications.length,
    });

    return c.json({
      success: true,
      message: 'Environnement de test créé avec succès',
      data: {
        sessionsCreated: sessions.length,
        notificationsCreated: notifications.length,
        patterns: patterns.map(p => `${['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][p.day]} ${p.hour}h (${p.weight} sessions)`),
      },
    });
  } catch (error) {
    console.error('Test setup error:', error);
    return c.json({ error: 'Erreur lors de la création de l\'environnement de test' }, 500);
  }
});

// ============================================================
// ROADMAP #3 - AUTOMATISATION & INTELLIGENCE
// ============================================================

// Get smart time slot suggestions based on historical data
app.get("/make-server-e884809f/squads/:squadId/smart-suggestions", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const squadId = c.req.param('squadId');
    
    // Check if user is member of squad
    const squad = await kv.get(`squad:${squadId}`);
    if (!squad) {
      return c.json({ error: 'Squad introuvable' }, 404);
    }
    
    const isMember = squad.members?.some((m: any) => m.userId === user.id);
    if (!isMember) {
      return c.json({ error: 'Non autorisé - Vous n\'êtes pas membre de cette squad' }, 403);
    }

    // Load all past sessions for this squad
    const allSessions = await kv.getByPrefix(`session:${squadId}:`);
    const pastSessions = allSessions.filter((s: any) => new Date(s.date) < new Date() && s.status === 'confirmed');

    if (pastSessions.length === 0) {
      return c.json({ suggestions: [] });
    }

    // Calculate day/hour statistics
    const dayHourStats: any = {};

    pastSessions.forEach((session: any) => {
      const sessionDate = new Date(session.date);
      const day = sessionDate.getDay(); // 0 = Sunday, 6 = Saturday
      const hour = parseInt(session.time?.split(':')[0] || '0');

      const key = `${day}-${hour}`;
      if (!dayHourStats[key]) {
        dayHourStats[key] = { day, hour, count: 0, totalAttendance: 0 };
      }

      dayHourStats[key].count++;
      // Estimate attendance (confirmed / total members)
      const attendanceRate = (session.confirmed || 0) / (squad.members?.length || 1);
      dayHourStats[key].totalAttendance += attendanceRate;
    });

    // Calculate scores and create suggestions
    const suggestions = Object.values(dayHourStats).map((stat: any) => {
      const avgAttendance = stat.totalAttendance / stat.count;
      const score = Math.round(avgAttendance * stat.count * 100);

      const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

      return {
        id: `${stat.day}-${stat.hour}`,
        day: stat.day,
        dayName: dayNames[stat.day],
        hour: stat.hour,
        time: `${String(stat.hour).padStart(2, '0')}:00`,
        score,
        confidence: Math.round(avgAttendance * 100),
        sessionsCount: stat.count,
        title: `${dayNames[stat.day]} à ${String(stat.hour).padStart(2, '0')}h`,
        description: `${stat.count} session(s) avec ${Math.round(avgAttendance * 100)}% de participation`,
      };
    });

    // Sort by score and return top 3
    const topSuggestions = suggestions.sort((a, b) => b.score - a.score).slice(0, 3);

    return c.json({ suggestions: topSuggestions });
  } catch (error) {
    console.error('Smart suggestions error:', error);
    return c.json({ error: 'Erreur lors du calcul des suggestions' }, 500);
  }
});

// Create recurring session
app.post("/make-server-e884809f/squads/:squadId/recurring-session", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const squadId = c.req.param('squadId');
    const body = await c.req.json();
    const { dayOfWeek, time, duration, game, title } = body;

    // Validate
    if (dayOfWeek === undefined || !time) {
      return c.json({ error: 'dayOfWeek et time sont requis' }, 400);
    }

    // Check if user is member
    const squad = await kv.get(`squad:${squadId}`);
    if (!squad) {
      return c.json({ error: 'Squad introuvable' }, 404);
    }
    
    const isMember = squad.members?.some((m: any) => m.userId === user.id);
    if (!isMember) {
      return c.json({ error: 'Non autorisé' }, 403);
    }

    // Calculate next date for this day of week
    const today = new Date();
    const targetDay = dayOfWeek; // 0 = Sunday, 6 = Saturday
    const currentDay = today.getDay();
    
    let daysUntilTarget = targetDay - currentDay;
    if (daysUntilTarget <= 0) {
      daysUntilTarget += 7; // Next week
    }

    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysUntilTarget);
    const dateStr = nextDate.toISOString().split('T')[0];

    // Create the first session
    const sessionId = crypto.randomUUID();
    const session = {
      id: sessionId,
      squadId,
      title: title || `Session ${squad.game || game || 'Gaming'}`,
      game: game || squad.game,
      date: dateStr,
      time,
      duration: duration || 120,
      status: 'pending',
      confirmed: 0,
      declined: 0,
      total: squad.members?.length || 0,
      responses: [],
      isRecurring: true,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`session:${squadId}:${sessionId}`, session);

    // Store recurring config
    const recurringConfig = {
      squadId,
      dayOfWeek,
      time,
      duration,
      game,
      title,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`recurring:${squadId}`, recurringConfig);

    console.log(`✅ Created recurring session: ${sessionId} for ${dateStr} ${time}`);

    return c.json({ 
      session,
      recurringConfig,
      message: 'Session récurrente créée avec succès' 
    });
  } catch (error) {
    console.error('Create recurring session error:', error);
    return c.json({ error: 'Erreur lors de la création de la session récurrente' }, 500);
  }
});

// Get user notifications
app.get("/make-server-e884809f/users/:userId/notifications", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const userId = c.req.param('userId');
    
    // User can only get their own notifications
    if (userId !== user.id) {
      return c.json({ error: 'Non autorisé' }, 403);
    }

    // Get all notifications for this user
    const allNotifications = await kv.getByPrefix(`notification:${userId}:`);
    
    // Sort by createdAt (most recent first)
    const notifications = allNotifications.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Count unread
    const unreadCount = notifications.filter((n: any) => !n.read).length;

    return c.json({ 
      notifications,
      unreadCount 
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return c.json({ error: 'Erreur lors de la récupération des notifications' }, 500);
  }
});

// Mark notification as read
app.post("/make-server-e884809f/notifications/mark-read", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const body = await c.req.json();
    const { notificationId } = body;

    if (!notificationId) {
      return c.json({ error: 'notificationId requis' }, 400);
    }

    // Load notification
    const notification = await kv.get(`notification:${user.id}:${notificationId}`);
    
    if (!notification) {
      return c.json({ error: 'Notification introuvable' }, 404);
    }

    // Update read status
    notification.read = true;
    notification.readAt = new Date().toISOString();
    
    await kv.set(`notification:${user.id}:${notificationId}`, notification);

    return c.json({ 
      notification,
      message: 'Notification marquée comme lue' 
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    return c.json({ error: 'Erreur lors de la mise à jour de la notification' }, 500);
  }
});

// Get availability heatmap for squad
app.get("/make-server-e884809f/squads/:squadId/availability-heatmap", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const squadId = c.req.param('squadId');
    
    // Check if user is member
    const squad = await kv.get(`squad:${squadId}`);
    if (!squad) {
      return c.json({ error: 'Squad introuvable' }, 404);
    }
    
    const isMember = squad.members?.some((m: any) => m.userId === user.id);
    if (!isMember) {
      return c.json({ error: 'Non autorisé' }, 403);
    }

    // Load all past confirmed sessions
    const allSessions = await kv.getByPrefix(`session:${squadId}:`);
    const pastSessions = allSessions.filter((s: any) => 
      new Date(s.date) < new Date() && s.status === 'confirmed'
    );

    // Initialize 7x24 matrix (7 days, 24 hours)
    const heatmap = Array(7).fill(null).map(() => Array(24).fill(0));

    // Fill heatmap with successful sessions
    pastSessions.forEach((session: any) => {
      const sessionDate = new Date(session.date);
      const day = sessionDate.getDay();
      const hour = parseInt(session.time?.split(':')[0] || '0');

      // Only count sessions with good attendance (> 70%)
      const attendanceRate = (session.confirmed || 0) / (squad.members?.length || 1);
      if (attendanceRate > 0.7) {
        heatmap[day][hour]++;
      }
    });

    // Normalize values (0-100)
    const flatValues = heatmap.flat();
    const maxValue = Math.max(...flatValues, 1); // Avoid division by 0
    
    const normalizedHeatmap = heatmap.map(row => 
      row.map(value => Math.round((value / maxValue) * 100))
    );

    return c.json({ 
      heatmap: normalizedHeatmap,
      maxValue,
      sessionsCount: pastSessions.length 
    });
  } catch (error) {
    console.error('Availability heatmap error:', error);
    return c.json({ error: 'Erreur lors du calcul de la heatmap' }, 500);
  }
});

// Get members stats in batch (optimization for SquadDetailScreen)
app.get("/make-server-e884809f/squads/:squadId/members-stats", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const squadId = c.req.param('squadId');
    
    // Check if user is member
    const squad = await kv.get(`squad:${squadId}`);
    if (!squad) {
      return c.json({ error: 'Squad introuvable' }, 404);
    }
    
    const isMember = squad.members?.some((m: any) => m.userId === user.id);
    if (!isMember) {
      return c.json({ error: 'Non autorisé' }, 403);
    }

    // Load stats for all members
    const members = squad.members || [];
    const membersStats = [];

    for (const member of members) {
      // Load user stats
      const userStatsKey = `user-stats:${member.userId}`;
      let stats = await kv.get(userStatsKey);

      if (!stats) {
        // Create default stats if not found
        stats = {
          userId: member.userId,
          reliabilityScore: 100,
          totalSessions: 0,
          attendedSessions: 0,
          attendanceRate: 100,
          noShowCount: 0,
          noShowRate: 0,
        };
      }

      membersStats.push({
        userId: member.userId,
        name: member.name,
        avatar: member.avatar,
        reliabilityScore: stats.reliabilityScore,
        totalSessions: stats.totalSessions,
        attendanceRate: stats.attendanceRate,
        lastSession: stats.lastSessionDate || null,
      });
    }

    return c.json({ members: membersStats });
  } catch (error) {
    console.error('Get members stats error:', error);
    return c.json({ error: 'Erreur lors de la récupération des stats des membres' }, 500);
  }
});

// ============================================================
// USER INTEGRATIONS ROUTES
// ============================================================

// Get user integrations
app.get("/make-server-e884809f/user/integrations", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const integrations = await kv.get(`user-integrations:${user.id}`);
    
    // Return default if not found
    if (!integrations) {
      return c.json({
        integrations: {
          discord: { connected: false, username: '' },
          googleCalendar: { connected: false, email: '' },
          twitch: { connected: false, username: '' },
          steam: { connected: false, username: '' },
          riot: { connected: false, username: '' },
          battlenet: { connected: false, username: '' },
        }
      });
    }

    return c.json({ integrations });
  } catch (error) {
    console.error('Get integrations error:', error);
    return c.json({ error: 'Erreur lors de la récupération des intégrations' }, 500);
  }
});

// Save user integrations
app.post("/make-server-e884809f/user/integrations", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const body = await c.req.json();
    const { integrations } = body;

    if (!integrations) {
      return c.json({ error: 'Données d\'intégrations requises' }, 400);
    }

    await kv.set(`user-integrations:${user.id}`, integrations);

    return c.json({ 
      integrations,
      message: 'Intégrations sauvegardées avec succès' 
    });
  } catch (error) {
    console.error('Save integrations error:', error);
    return c.json({ error: 'Erreur lors de la sauvegarde des intégrations' }, 500);
  }
});

// Connect integration (OAuth simulation)
app.post("/make-server-e884809f/user/integrations/:platform/connect", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const platform = c.req.param('platform');
    const body = await c.req.json();
    const { username, email } = body;

    // Get current integrations
    let integrations = await kv.get(`user-integrations:${user.id}`);
    
    if (!integrations) {
      integrations = {
        discord: { connected: false, username: '' },
        googleCalendar: { connected: false, email: '' },
        twitch: { connected: false, username: '' },
        steam: { connected: false, username: '' },
        riot: { connected: false, username: '' },
        battlenet: { connected: false, username: '' },
      };
    }

    // Update platform connection
    if (integrations[platform]) {
      integrations[platform] = {
        connected: true,
        username: username || email || `user_${platform}`,
        email: email || '',
        connectedAt: new Date().toISOString(),
      };

      await kv.set(`user-integrations:${user.id}`, integrations);

      return c.json({ 
        integrations,
        message: `${platform} connecté avec succès` 
      });
    }

    return c.json({ error: 'Plateforme inconnue' }, 400);
  } catch (error) {
    console.error('Connect integration error:', error);
    return c.json({ error: 'Erreur lors de la connexion' }, 500);
  }
});

// Disconnect integration
app.post("/make-server-e884809f/user/integrations/:platform/disconnect", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const platform = c.req.param('platform');

    // Get current integrations
    let integrations = await kv.get(`user-integrations:${user.id}`);
    
    if (!integrations) {
      return c.json({ error: 'Intégrations non trouvées' }, 404);
    }

    // Disconnect platform
    if (integrations[platform]) {
      integrations[platform] = {
        connected: false,
        username: '',
        email: '',
      };

      await kv.set(`user-integrations:${user.id}`, integrations);

      return c.json({ 
        integrations,
        message: `${platform} déconnecté` 
      });
    }

    return c.json({ error: 'Plateforme inconnue' }, 400);
  } catch (error) {
    console.error('Disconnect integration error:', error);
    return c.json({ error: 'Erreur lors de la déconnexion' }, 500);
  }
});

// ============================================================
// USER NOTIFICATION SETTINGS ROUTES
// ============================================================

// Get user notification settings
app.get("/make-server-e884809f/user/notification-settings", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const settings = await kv.get(`user-notification-settings:${user.id}`);
    
    // Return defaults if not found
    if (!settings) {
      return c.json({
        settings: {
          sessionReminder: true,
          squadInvite: true,
          newMessage: true,
          achievementUnlocked: true,
          friendRequest: true,
          sessionStarting: true,
          weeklyRecap: false,
          pushEnabled: true,
          emailEnabled: false,
        }
      });
    }

    return c.json({ settings });
  } catch (error) {
    console.error('Get notification settings error:', error);
    return c.json({ error: 'Erreur lors de la récupération des paramètres' }, 500);
  }
});

// Save user notification settings
app.post("/make-server-e884809f/user/notification-settings", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const body = await c.req.json();
    const { settings } = body;

    if (!settings) {
      return c.json({ error: 'Paramètres de notification requis' }, 400);
    }

    await kv.set(`user-notification-settings:${user.id}`, settings);

    return c.json({ 
      settings,
      message: 'Paramètres de notification sauvegardés' 
    });
  } catch (error) {
    console.error('Save notification settings error:', error);
    return c.json({ error: 'Erreur lors de la sauvegarde des paramètres' }, 500);
  }
});

// ============================================================
// OAUTH ROUTES
// ============================================================

// Initiate OAuth flow
app.get("/make-server-e884809f/oauth/:platform/authorize", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const platform = c.req.param('platform');
    
    // Generate state token with user ID
    const state = `${user.id}:${Date.now()}:${Math.random().toString(36).substring(7)}`;
    
    // Store state for verification
    await kv.set(`oauth-state:${state}`, {
      userId: user.id,
      platform,
      createdAt: new Date().toISOString(),
    });

    // Get authorization URL
    const authUrl = getOAuthAuthorizationUrl(platform, state);
    
    if (!authUrl) {
      return c.json({ error: 'Plateforme OAuth non supportée' }, 400);
    }

    return c.json({ authUrl });
  } catch (error) {
    console.error('OAuth authorize error:', error);
    return c.json({ error: 'Erreur lors de l\'initialisation OAuth' }, 500);
  }
});

// OAuth callback handler
app.get("/make-server-e884809f/oauth/:platform/callback", async (c) => {
  try {
    const platform = c.req.param('platform');
    const code = c.req.query('code');
    const state = c.req.query('state');

    if (!code || !state) {
      return c.redirect(`${Deno.env.get('FRONTEND_URL') || ''}/integrations?error=missing_params`);
    }

    // Verify state
    const stateData = await kv.get(`oauth-state:${state}`);
    
    if (!stateData) {
      return c.redirect(`${Deno.env.get('FRONTEND_URL') || ''}/integrations?error=invalid_state`);
    }

    // Delete used state
    await kv.del(`oauth-state:${state}`);

    // Exchange code for token
    const tokens = await exchangeCodeForToken(platform, code);
    
    if (!tokens) {
      return c.redirect(`${Deno.env.get('FRONTEND_URL') || ''}/integrations?error=token_exchange_failed`);
    }

    // Get user info from platform
    const platformUserInfo = await getUserInfo(platform, tokens.access_token);
    
    if (!platformUserInfo) {
      return c.redirect(`${Deno.env.get('FRONTEND_URL') || ''}/integrations?error=user_info_failed`);
    }

    // Save integration data
    let integrations = await kv.get(`user-integrations:${stateData.userId}`);
    
    if (!integrations) {
      integrations = {
        discord: { connected: false, username: '' },
        googleCalendar: { connected: false, email: '' },
        twitch: { connected: false, username: '' },
        steam: { connected: false, username: '' },
        riot: { connected: false, username: '' },
        battlenet: { connected: false, username: '' },
      };
    }

    // Update platform integration
    const platformKey = platform === 'google' ? 'googleCalendar' : platform;
    integrations[platformKey] = {
      connected: true,
      username: platformUserInfo.username || platformUserInfo.displayName || platformUserInfo.gameName || platformUserInfo.battletag || platformUserInfo.email || 'Connected',
      email: platformUserInfo.email || '',
      platformUserId: platformUserInfo.id,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000).toISOString() : null,
      connectedAt: new Date().toISOString(),
    };

    await kv.set(`user-integrations:${stateData.userId}`, integrations);

    // Redirect to frontend with success
    return c.redirect(`${Deno.env.get('FRONTEND_URL') || ''}/integrations?success=${platform}`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    return c.redirect(`${Deno.env.get('FRONTEND_URL') || ''}/integrations?error=server_error`);
  }
});

// ============================================================
// WEB PUSH NOTIFICATIONS
// ============================================================

// Get VAPID public key
app.get("/make-server-e884809f/push/vapid-public-key", async (c) => {
  try {
    const publicKey = Deno.env.get('VAPID_PUBLIC_KEY');
    
    if (!publicKey) {
      return c.json({ error: 'VAPID keys not configured' }, 500);
    }

    return c.json({ publicKey });
  } catch (error) {
    console.error('Get VAPID public key error:', error);
    return c.json({ error: 'Erreur lors de la récupération de la clé publique' }, 500);
  }
});

// Save push subscription
app.post("/make-server-e884809f/push/subscribe", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const body = await c.req.json();
    const { subscription } = body;

    if (!subscription) {
      return c.json({ error: 'Subscription requise' }, 400);
    }

    // Save subscription for user
    await kv.set(`push-subscription:${user.id}`, {
      subscription,
      createdAt: new Date().toISOString(),
    });

    return c.json({ message: 'Subscription sauvegardée' });
  } catch (error) {
    console.error('Save push subscription error:', error);
    return c.json({ error: 'Erreur lors de la sauvegarde de la subscription' }, 500);
  }
});

// Delete push subscription
app.delete("/make-server-e884809f/push/unsubscribe", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    await kv.del(`push-subscription:${user.id}`);

    return c.json({ message: 'Subscription supprimée' });
  } catch (error) {
    console.error('Delete push subscription error:', error);
    return c.json({ error: 'Erreur lors de la suppression de la subscription' }, 500);
  }
});

// Send push notification (internal use or admin)
app.post("/make-server-e884809f/push/send", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const body = await c.req.json();
    const { userId, title, message, url, icon } = body;

    if (!userId || !title || !message) {
      return c.json({ error: 'userId, title et message requis' }, 400);
    }

    // Get user's push subscription
    const subData = await kv.get(`push-subscription:${userId}`);
    
    if (!subData || !subData.subscription) {
      return c.json({ error: 'User not subscribed to push notifications' }, 404);
    }

    // Note: Web Push sending requires the web-push library which needs to be installed
    // For now, we'll just return success. The actual push sending would be implemented with:
    // import webPush from 'npm:web-push';
    
    const payload = JSON.stringify({
      title,
      body: message,
      icon: icon || '/icon-192.png',
      badge: '/badge-72.png',
      data: {
        url: url || '/',
      },
    });

    // TODO: Implement actual push sending with web-push library
    // await webPush.sendNotification(subData.subscription, payload);

    return c.json({ 
      message: 'Notification envoyée',
      // Remove this when implementing real push
      debug: 'Push notifications are mocked - install web-push library to enable real push'
    });
  } catch (error) {
    console.error('Send push notification error:', error);
    return c.json({ error: 'Erreur lors de l\'envoi de la notification' }, 500);
  }
});

// ============================================================
// GOOGLE CALENDAR ROUTES
// ============================================================

// Sync session to Google Calendar
app.post("/make-server-e884809f/calendar/sync", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const body = await c.req.json();
    const { sessionId, squadId } = body;

    if (!sessionId || !squadId) {
      return c.json({ error: 'ID de session et de squad requis' }, 400);
    }

    // Get user profile to check Google connection
    const userProfile = await kv.get(`user:${user.id}`);
    
    if (!userProfile?.integrations?.google?.connected) {
      return c.json({ error: 'Google Calendar non connecté' }, 400);
    }

    const googleAccessToken = userProfile.integrations.google.accessToken;

    // Get session details
    const session = await kv.get(`session:${sessionId}`);
    
    if (!session) {
      return c.json({ error: 'Session non trouvée' }, 404);
    }

    // Get squad details
    const squad = await kv.get(`squad:${squadId}`);
    
    if (!squad) {
      return c.json({ error: 'Squad non trouvé' }, 404);
    }

    // Import Google Calendar functions
    const { createCalendarEvent } = await import('./google-calendar.ts');

    // Create calendar event
    const startTime = new Date(session.scheduledTime);
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration

    const calendarEvent = {
      summary: `🎮 ${squad.name} - Session de jeu`,
      description: `Session Squad Planner\n\nSquad: ${squad.name}\nJeu: ${squad.game}\n\nParticipants confirmés: ${session.participants?.filter((p: any) => p.status === 'going').length || 0}/${squad.members.length}`,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'Europe/Paris',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'Europe/Paris',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 30 },
          { method: 'email', minutes: 60 },
        ],
      },
    };

    const googleEvent = await createCalendarEvent(googleAccessToken, calendarEvent);

    // Save Google Calendar event ID in session
    const updatedSession = {
      ...session,
      googleCalendarEventId: googleEvent.id,
      googleCalendarEventLink: googleEvent.htmlLink,
      syncedAt: new Date().toISOString(),
    };

    await kv.set(`session:${sessionId}`, updatedSession);

    console.log('✅ Session synced to Google Calendar:', googleEvent.id);

    return c.json({ 
      message: 'Session synchronisée avec Google Calendar !',
      eventId: googleEvent.id,
      eventLink: googleEvent.htmlLink,
    });
  } catch (error: any) {
    console.error('Sync calendar error:', error);
    return c.json({ error: error.message || 'Erreur lors de la synchronisation' }, 500);
  }
});

// List Google Calendar events
app.get("/make-server-e884809f/calendar/events", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    // Get user profile to check Google connection
    const userProfile = await kv.get(`user:${user.id}`);
    
    if (!userProfile?.integrations?.google?.connected) {
      return c.json({ error: 'Google Calendar non connecté' }, 400);
    }

    const googleAccessToken = userProfile.integrations.google.accessToken;

    // Import Google Calendar functions
    const { listCalendarEvents } = await import('./google-calendar.ts');

    const events = await listCalendarEvents(googleAccessToken, 20);

    return c.json({ events });
  } catch (error: any) {
    console.error('List calendar events error:', error);
    return c.json({ error: error.message || 'Erreur lors de la récupération des événements' }, 500);
  }
});

// Check free/busy slots
app.post("/make-server-e884809f/calendar/freebusy", async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ error: 'Non autorisé' }, 401);
    }

    const body = await c.req.json();
    const { timeMin, timeMax } = body;

    if (!timeMin || !timeMax) {
      return c.json({ error: 'Plage horaire requise' }, 400);
    }

    // Get user profile to check Google connection
    const userProfile = await kv.get(`user:${user.id}`);
    
    if (!userProfile?.integrations?.google?.connected) {
      return c.json({ error: 'Google Calendar non connecté' }, 400);
    }

    const googleAccessToken = userProfile.integrations.google.accessToken;

    // Import Google Calendar functions
    const { getFreeBusy } = await import('./google-calendar.ts');

    const freeBusy = await getFreeBusy(googleAccessToken, timeMin, timeMax);

    return c.json({ freeBusy });
  } catch (error: any) {
    console.error('Get free/busy error:', error);
    return c.json({ error: error.message || 'Erreur lors de la vérification des disponibilités' }, 500);
  }
});

// ============================================================
// DEMO ECOSYSTEM GENERATOR
// ============================================================

app.post("/make-server-e884809f/demo/generate-ecosystem", async (c) => {
  try {
    console.log('🎮 Generating demo ecosystem...');
    
    // Import the generator function
    const { generateDemoEcosystem } = await import('./test-data-generator.ts');
    
    // Generate the ecosystem
    const result = await generateDemoEcosystem(supabase);
    
    return c.json({
      success: true,
      message: 'Écosystème de démo généré avec succès !',
      data: result
    });
  } catch (error: any) {
    console.error('❌ Generate demo ecosystem error:', error);
    return c.json({ 
      error: error.message || 'Erreur lors de la génération de l\'écosystème de démo',
      details: error.stack
    }, 500);
  }
});

Deno.serve(app.fetch);