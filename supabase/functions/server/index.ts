import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const app = new Hono()

// Configuration CORS
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Logger
app.use('*', logger(console.log))

// Client Supabase avec service role
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Vérifier l'authentification
async function verifyAuth(authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Missing authorization header', user: null }
  }
  
  const token = authHeader.split(' ')[1]
  const { data: { user }, error } = await supabase.auth.getUser(token)
  
  if (error || !user) {
    return { error: 'Unauthorized', user: null }
  }
  
  return { error: null, user }
}

// Récupérer l'utilisateur depuis la table users
async function getUserFromAuth(authId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', authId)
    .single()
  
  if (error) throw new Error(`User not found: ${error.message}`)
  return data
}

// ============================================================================
// ROUTES - AUTHENTIFICATION
// ============================================================================

// Signup
app.post('/make-server-e884809f/auth/signup', async (c) => {
  try {
    const { email, password, username, displayName } = await c.req.json()

    // Créer l'utilisateur dans Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmer l'email
    })

    if (authError) {
      return c.json({ error: authError.message }, 400)
    }

    // Créer l'utilisateur dans la table users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        auth_id: authData.user.id,
        email,
        username,
        display_name: displayName || username,
      })
      .select()
      .single()

    if (userError) {
      console.error('Error creating user in database:', userError)
      return c.json({ error: userError.message }, 400)
    }

    return c.json({ user: userData, authUser: authData.user })
  } catch (error) {
    console.error('Signup error:', error)
    return c.json({ error: 'Signup failed: ' + error.message }, 500)
  }
})

// Login (géré par Supabase client-side)
app.post('/make-server-e884809f/auth/login', async (c) => {
  return c.json({ message: 'Use Supabase client signInWithPassword' })
})

// Get current user
app.get('/make-server-e884809f/auth/me', async (c) => {
  const authHeader = c.req.header('Authorization')
  const { error: authError, user: authUser } = await verifyAuth(authHeader)
  
  if (authError) return c.json({ error: authError }, 401)
  
  try {
    const user = await getUserFromAuth(authUser.id)
    return c.json({ user })
  } catch (error) {
    return c.json({ error: error.message }, 404)
  }
})

// ============================================================================
// ROUTES - USERS
// ============================================================================

// Get user profile
app.get('/make-server-e884809f/users/:userId', async (c) => {
  const userId = c.req.param('userId')
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) return c.json({ error: error.message }, 404)
  return c.json({ user: data })
})

// Update user profile
app.put('/make-server-e884809f/users/:userId', async (c) => {
  const authHeader = c.req.header('Authorization')
  const { error: authError, user: authUser } = await verifyAuth(authHeader)
  
  if (authError) return c.json({ error: authError }, 401)
  
  const userId = c.req.param('userId')
  const updates = await c.req.json()
  
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .eq('auth_id', authUser.id) // Sécurité : ne peut modifier que son propre profil
    .select()
    .single()
  
  if (error) return c.json({ error: error.message }, 400)
  return c.json({ user: data })
})

// Search users
app.get('/make-server-e884809f/users/search', async (c) => {
  const query = c.req.query('q')
  
  if (!query) return c.json({ users: [] })
  
  const { data, error } = await supabase
    .from('users')
    .select('id, username, display_name, avatar_url, reliability_score')
    .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
    .limit(10)
  
  if (error) return c.json({ error: error.message }, 400)
  return c.json({ users: data })
})

// ============================================================================
// ROUTES - SQUADS
// ============================================================================

// Get all user's squads
app.get('/make-server-e884809f/squads', async (c) => {
  const authHeader = c.req.header('Authorization')
  const { error: authError, user: authUser } = await verifyAuth(authHeader)
  
  if (authError) return c.json({ error: authError }, 401)
  
  try {
    const user = await getUserFromAuth(authUser.id)
    
    // Récupérer les squads via squad_members
    const { data: memberData, error: memberError } = await supabase
      .from('squad_members')
      .select('squad_id')
      .eq('user_id', user.id)
    
    if (memberError) throw memberError
    
    const squadIds = memberData.map(m => m.squad_id)
    
    if (squadIds.length === 0) {
      return c.json({ squads: [] })
    }
    
    const { data: squads, error: squadError } = await supabase
      .from('squads')
      .select('*, owner:users!owner_id(username, display_name, avatar_url)')
      .in('id', squadIds)
      .order('created_at', { ascending: false })
    
    if (squadError) throw squadError
    
    return c.json({ squads })
  } catch (error) {
    console.error('Get squads error:', error)
    return c.json({ error: error.message }, 500)
  }
})

// Get squad by ID
app.get('/make-server-e884809f/squads/:squadId', async (c) => {
  const authHeader = c.req.header('Authorization')
  const { error: authError, user: authUser } = await verifyAuth(authHeader)
  
  if (authError) return c.json({ error: authError }, 401)
  
  const squadId = c.req.param('squadId')
  
  const { data, error } = await supabase
    .from('squads')
    .select(`
      *,
      owner:users!owner_id(id, username, display_name, avatar_url),
      members:squad_members(
        id,
        role,
        sessions_attended,
        reliability_score,
        joined_at,
        user:users(id, username, display_name, avatar_url, reliability_score)
      )
    `)
    .eq('id', squadId)
    .single()
  
  if (error) return c.json({ error: error.message }, 404)
  return c.json({ squad: data })
})

// Create squad
app.post('/make-server-e884809f/squads', async (c) => {
  const authHeader = c.req.header('Authorization')
  const { error: authError, user: authUser } = await verifyAuth(authHeader)
  
  if (authError) return c.json({ error: authError }, 401)
  
  try {
    const user = await getUserFromAuth(authUser.id)
    const { name, description, game, gameMode, maxMembers, isPublic } = await c.req.json()
    
    // Créer la squad
    const { data: squad, error: squadError } = await supabase
      .from('squads')
      .insert({
        name,
        description,
        game,
        game_mode: gameMode,
        max_members: maxMembers || 6,
        is_public: isPublic || false,
        owner_id: user.id,
      })
      .select()
      .single()
    
    if (squadError) throw squadError
    
    // Ajouter le créateur comme membre owner
    const { error: memberError } = await supabase
      .from('squad_members')
      .insert({
        squad_id: squad.id,
        user_id: user.id,
        role: 'owner',
      })
    
    if (memberError) throw memberError
    
    return c.json({ squad })
  } catch (error) {
    console.error('Create squad error:', error)
    return c.json({ error: error.message }, 500)
  }
})

// Update squad
app.put('/make-server-e884809f/squads/:squadId', async (c) => {
  const authHeader = c.req.header('Authorization')
  const { error: authError, user: authUser } = await verifyAuth(authHeader)
  
  if (authError) return c.json({ error: authError }, 401)
  
  const squadId = c.req.param('squadId')
  const updates = await c.req.json()
  
  try {
    const user = await getUserFromAuth(authUser.id)
    
    // Vérifier que l'utilisateur est owner ou admin
    const { data: member } = await supabase
      .from('squad_members')
      .select('role')
      .eq('squad_id', squadId)
      .eq('user_id', user.id)
      .single()
    
    if (!member || !['owner', 'admin'].includes(member.role)) {
      return c.json({ error: 'Unauthorized' }, 403)
    }
    
    const { data, error } = await supabase
      .from('squads')
      .update(updates)
      .eq('id', squadId)
      .select()
      .single()
    
    if (error) throw error
    
    return c.json({ squad: data })
  } catch (error) {
    return c.json({ error: error.message }, 500)
  }
})

// Join squad with invite code
app.post('/make-server-e884809f/squads/join', async (c) => {
  const authHeader = c.req.header('Authorization')
  const { error: authError, user: authUser } = await verifyAuth(authHeader)
  
  if (authError) return c.json({ error: authError }, 401)
  
  try {
    const user = await getUserFromAuth(authUser.id)
    const { inviteCode } = await c.req.json()
    
    // Trouver la squad
    const { data: squad, error: squadError } = await supabase
      .from('squads')
      .select('*')
      .eq('invite_code', inviteCode)
      .single()
    
    if (squadError) return c.json({ error: 'Code invalide' }, 404)
    
    // Vérifier si déjà membre
    const { data: existing } = await supabase
      .from('squad_members')
      .select('id')
      .eq('squad_id', squad.id)
      .eq('user_id', user.id)
      .single()
    
    if (existing) {
      return c.json({ error: 'Déjà membre de cette squad' }, 400)
    }
    
    // Vérifier la limite de membres
    const { count } = await supabase
      .from('squad_members')
      .select('*', { count: 'exact', head: true })
      .eq('squad_id', squad.id)
    
    if (count >= squad.max_members) {
      return c.json({ error: 'Squad complète' }, 400)
    }
    
    // Ajouter le membre
    const { error: memberError } = await supabase
      .from('squad_members')
      .insert({
        squad_id: squad.id,
        user_id: user.id,
        role: 'member',
      })
    
    if (memberError) throw memberError
    
    // Mettre à jour le compteur
    await supabase
      .from('squads')
      .update({ total_members: count + 1 })
      .eq('id', squad.id)
    
    return c.json({ squad })
  } catch (error) {
    console.error('Join squad error:', error)
    return c.json({ error: error.message }, 500)
  }
})

// Leave squad
app.delete('/make-server-e884809f/squads/:squadId/leave', async (c) => {
  const authHeader = c.req.header('Authorization')
  const { error: authError, user: authUser } = await verifyAuth(authHeader)
  
  if (authError) return c.json({ error: authError }, 401)
  
  const squadId = c.req.param('squadId')
  
  try {
    const user = await getUserFromAuth(authUser.id)
    
    // Vérifier si owner
    const { data: squad } = await supabase
      .from('squads')
      .select('owner_id')
      .eq('id', squadId)
      .single()
    
    if (squad.owner_id === user.id) {
      return c.json({ error: 'Le propriétaire ne peut pas quitter la squad' }, 400)
    }
    
    // Supprimer le membre
    const { error } = await supabase
      .from('squad_members')
      .delete()
      .eq('squad_id', squadId)
      .eq('user_id', user.id)
    
    if (error) throw error
    
    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: error.message }, 500)
  }
})

// ============================================================================
// ROUTES - SESSIONS
// ============================================================================

// Get squad sessions
app.get('/make-server-e884809f/squads/:squadId/sessions', async (c) => {
  const authHeader = c.req.header('Authorization')
  const { error: authError } = await verifyAuth(authHeader)
  
  if (authError) return c.json({ error: authError }, 401)
  
  const squadId = c.req.param('squadId')
  const status = c.req.query('status') // 'upcoming', 'past', 'all'
  
  let query = supabase
    .from('sessions')
    .select(`
      *,
      proposed_by_user:users!proposed_by(id, username, display_name, avatar_url),
      rsvps:session_rsvps(
        id,
        response,
        user:users(id, username, display_name, avatar_url)
      )
    `)
    .eq('squad_id', squadId)
    .order('scheduled_date', { ascending: true })
  
  if (status === 'upcoming') {
    query = query.gte('scheduled_date', new Date().toISOString().split('T')[0])
  } else if (status === 'past') {
    query = query.lt('scheduled_date', new Date().toISOString().split('T')[0])
  }
  
  const { data, error } = await query
  
  if (error) return c.json({ error: error.message }, 400)
  return c.json({ sessions: data })
})

// Get session by ID
app.get('/make-server-e884809f/sessions/:sessionId', async (c) => {
  const authHeader = c.req.header('Authorization')
  const { error: authError } = await verifyAuth(authHeader)
  
  if (authError) return c.json({ error: authError }, 401)
  
  const sessionId = c.req.param('sessionId')
  
  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      squad:squads(id, name, game),
      proposed_by_user:users!proposed_by(id, username, display_name, avatar_url),
      rsvps:session_rsvps(
        id,
        response,
        notes,
        responded_at,
        user:users(id, username, display_name, avatar_url, reliability_score)
      )
    `)
    .eq('id', sessionId)
    .single()
  
  if (error) return c.json({ error: error.message }, 404)
  return c.json({ session: data })
})

// Create session
app.post('/make-server-e884809f/sessions', async (c) => {
  const authHeader = c.req.header('Authorization')
  const { error: authError, user: authUser } = await verifyAuth(authHeader)
  
  if (authError) return c.json({ error: authError }, 401)
  
  try {
    const user = await getUserFromAuth(authUser.id)
    const { squadId, title, description, scheduledDate, scheduledTime, duration, requiredPlayers } = await c.req.json()
    
    // Créer la session
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert({
        squad_id: squadId,
        title,
        description,
        proposed_by: user.id,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        duration,
        required_players: requiredPlayers || 5,
        status: 'pending',
      })
      .select()
      .single()
    
    if (sessionError) throw sessionError
    
    // Créer des notifications pour tous les membres
    const { data: members } = await supabase
      .from('squad_members')
      .select('user_id')
      .eq('squad_id', squadId)
      .neq('user_id', user.id)
    
    if (members && members.length > 0) {
      const notifications = members.map(m => ({
        user_id: m.user_id,
        type: 'session_proposed',
        title: 'Nouvelle session proposée',
        message: `${user.display_name} propose une session : ${title}`,
        action_url: `/sessions/${session.id}`,
        data: { sessionId: session.id, squadId },
      }))
      
      await supabase.from('notifications').insert(notifications)
    }
    
    return c.json({ session })
  } catch (error) {
    console.error('Create session error:', error)
    return c.json({ error: error.message }, 500)
  }
})

// Update session
app.put('/make-server-e884809f/sessions/:sessionId', async (c) => {
  const authHeader = c.req.header('Authorization')
  const { error: authError, user: authUser } = await verifyAuth(authHeader)
  
  if (authError) return c.json({ error: authError }, 401)
  
  const sessionId = c.req.param('sessionId')
  const updates = await c.req.json()
  
  const { data, error } = await supabase
    .from('sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single()
  
  if (error) return c.json({ error: error.message }, 400)
  return c.json({ session: data })
})

// RSVP to session
app.post('/make-server-e884809f/sessions/:sessionId/rsvp', async (c) => {
  const authHeader = c.req.header('Authorization')
  const { error: authError, user: authUser } = await verifyAuth(authHeader)
  
  if (authError) return c.json({ error: authError }, 401)
  
  try {
    const user = await getUserFromAuth(authUser.id)
    const sessionId = c.req.param('sessionId')
    const { response, notes } = await c.req.json()
    
    // Upsert RSVP
    const { data, error } = await supabase
      .from('session_rsvps')
      .upsert({
        session_id: sessionId,
        user_id: user.id,
        response,
        notes,
      }, {
        onConflict: 'session_id,user_id'
      })
      .select()
      .single()
    
    if (error) throw error
    
    return c.json({ rsvp: data })
  } catch (error) {
    console.error('RSVP error:', error)
    return c.json({ error: error.message }, 500)
  }
})

// ============================================================================
// ROUTES - NOTIFICATIONS
// ============================================================================

// Get user notifications
app.get('/make-server-e884809f/notifications', async (c) => {
  const authHeader = c.req.header('Authorization')
  const { error: authError, user: authUser } = await verifyAuth(authHeader)
  
  if (authError) return c.json({ error: authError }, 401)
  
  try {
    const user = await getUserFromAuth(authUser.id)
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
    
    if (error) throw error
    
    return c.json({ notifications: data })
  } catch (error) {
    return c.json({ error: error.message }, 500)
  }
})

// Mark notification as read
app.patch('/make-server-e884809f/notifications/:notificationId/read', async (c) => {
  const authHeader = c.req.header('Authorization')
  const { error: authError, user: authUser } = await verifyAuth(authHeader)
  
  if (authError) return c.json({ error: authError }, 401)
  
  const notificationId = c.req.param('notificationId')
  
  try {
    const user = await getUserFromAuth(authUser.id)
    
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId)
      .eq('user_id', user.id)
      .select()
      .single()
    
    if (error) throw error
    
    return c.json({ notification: data })
  } catch (error) {
    return c.json({ error: error.message }, 500)
  }
})

// Mark all as read
app.post('/make-server-e884809f/notifications/read-all', async (c) => {
  const authHeader = c.req.header('Authorization')
  const { error: authError, user: authUser } = await verifyAuth(authHeader)
  
  if (authError) return c.json({ error: authError }, 401)
  
  try {
    const user = await getUserFromAuth(authUser.id)
    
    const { error } = await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('read', false)
    
    if (error) throw error
    
    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: error.message }, 500)
  }
})

// ============================================================================
// ROUTES - MESSAGES (CHAT)
// ============================================================================

// Get squad messages
app.get('/make-server-e884809f/squads/:squadId/messages', async (c) => {
  const authHeader = c.req.header('Authorization')
  const { error: authError } = await verifyAuth(authHeader)
  
  if (authError) return c.json({ error: authError }, 401)
  
  const squadId = c.req.param('squadId')
  const limit = parseInt(c.req.query('limit') || '50')
  
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      user:users(id, username, display_name, avatar_url)
    `)
    .eq('squad_id', squadId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) return c.json({ error: error.message }, 400)
  return c.json({ messages: data.reverse() })
})

// Send message
app.post('/make-server-e884809f/messages', async (c) => {
  const authHeader = c.req.header('Authorization')
  const { error: authError, user: authUser } = await verifyAuth(authHeader)
  
  if (authError) return c.json({ error: authError }, 401)
  
  try {
    const user = await getUserFromAuth(authUser.id)
    const { squadId, content, type } = await c.req.json()
    
    const { data, error } = await supabase
      .from('messages')
      .insert({
        squad_id: squadId,
        user_id: user.id,
        content,
        type: type || 'text',
      })
      .select()
      .single()
    
    if (error) throw error
    
    return c.json({ message: data })
  } catch (error) {
    console.error('Send message error:', error)
    return c.json({ error: error.message }, 500)
  }
})

// ============================================================================
// ROUTES - STATS & ANALYTICS
// ============================================================================

// Get user stats
app.get('/make-server-e884809f/users/:userId/stats', async (c) => {
  const userId = c.req.param('userId')
  
  try {
    // Stats de base depuis users
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('total_sessions, sessions_attended, reliability_score, xp_points, level')
      .eq('id', userId)
      .single()
    
    if (userError) throw userError
    
    // Nombre de squads
    const { count: squadCount } = await supabase
      .from('squad_members')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
    
    // Achievements débloqués
    const { count: achievementCount } = await supabase
      .from('user_achievements')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('unlocked', true)
    
    return c.json({
      stats: {
        ...user,
        totalSquads: squadCount || 0,
        achievementsUnlocked: achievementCount || 0,
      }
    })
  } catch (error) {
    return c.json({ error: error.message }, 500)
  }
})

// Get squad stats
app.get('/make-server-e884809f/squads/:squadId/stats', async (c) => {
  const squadId = c.req.param('squadId')
  
  try {
    const { data: squad, error: squadError } = await supabase
      .from('squads')
      .select('total_sessions, total_members, reliability_score')
      .eq('id', squadId)
      .single()
    
    if (squadError) throw squadError
    
    // Sessions confirmées
    const { count: confirmedCount } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('squad_id', squadId)
      .eq('status', 'confirmed')
    
    // Sessions complétées
    const { count: completedCount } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('squad_id', squadId)
      .eq('status', 'completed')
    
    return c.json({
      stats: {
        ...squad,
        confirmedSessions: confirmedCount || 0,
        completedSessions: completedCount || 0,
      }
    })
  } catch (error) {
    return c.json({ error: error.message }, 500)
  }
})

// ============================================================================
// ROUTES - ACHIEVEMENTS
// ============================================================================

// Get user achievements
app.get('/make-server-e884809f/users/:userId/achievements', async (c) => {
  const userId = c.req.param('userId')
  
  const { data, error } = await supabase
    .from('user_achievements')
    .select(`
      *,
      achievement:achievements(*)
    `)
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false })
  
  if (error) return c.json({ error: error.message }, 400)
  return c.json({ achievements: data })
})

// ============================================================================
// ROUTE DE TEST
// ============================================================================

app.get('/make-server-e884809f/health', (c) => {
  return c.json({ 
    status: 'ok',
    message: 'Squad Planner API is running',
    timestamp: new Date().toISOString()
  })
})

// ============================================================================
// DÉMARRAGE DU SERVEUR
// ============================================================================

Deno.serve(app.fetch)
