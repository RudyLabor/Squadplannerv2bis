import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import { projectId, publicAnonKey } from "./supabase-info.ts";
import { setupDatabase, createTableDirectly } from "./database-setup.ts";

const app = new Hono();

// Supabase URL from project info
const supabaseUrl = `https://${projectId}.supabase.co`;

// Log server startup for debugging
console.log('🚀 Squad Planner Edge Function starting (LITE VERSION)...');
console.log(`📅 Server timestamp: ${new Date().toISOString()}`);

// Check environment variables
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!serviceRoleKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set!');
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

// Supabase client with SERVICE_ROLE_KEY for admin operations only
export const supabase = createClient(
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

// ============================================================
// MIDDLEWARE (must be before routes)
// ============================================================

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
// HEALTH CHECK
// ============================================================

app.get("/make-server-e884809f/health", (c) => {
  return c.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    version: "3.0.1-with-setup",
  });
});

// ============================================================
// SETUP ENDPOINT - Create database table
// ============================================================

app.get("/make-server-e884809f/setup", async (c) => {
  return c.json({
    message: 'Database setup instructions',
    instructions: [
      '1. Go to https://supabase.com/dashboard',
      '2. Select your Squad Planner project',
      '3. Click on "SQL Editor" in the left menu',
      '4. Copy and paste the SQL below',
      '5. Click "RUN" or press Ctrl+Enter'
    ],
    sql: `-- Create KV Store table
CREATE TABLE IF NOT EXISTS public.kv_store_e884809f (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_kv_key_prefix 
  ON public.kv_store_e884809f (key text_pattern_ops);

CREATE INDEX IF NOT EXISTS idx_kv_updated_at 
  ON public.kv_store_e884809f (updated_at DESC);

-- Enable RLS
ALTER TABLE public.kv_store_e884809f ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Service role full access" ON public.kv_store_e884809f;
DROP POLICY IF EXISTS "Anon users have access" ON public.kv_store_e884809f;

CREATE POLICY "Service role full access" 
  ON public.kv_store_e884809f 
  FOR ALL TO service_role 
  USING (true) WITH CHECK (true);

CREATE POLICY "Anon users have access" 
  ON public.kv_store_e884809f 
  FOR ALL TO anon 
  USING (true) WITH CHECK (true);

-- Success message
SELECT '✅ Table created successfully!' as status;`,
    note: 'Or use POST /make-server-e884809f/setup to attempt automatic creation (requires SUPABASE_DB_URL env variable)'
  });
});

app.post("/make-server-e884809f/setup", async (c) => {
  console.log('🔧 POST /setup called - attempting automatic table creation...');
  
  try {
    // Try direct creation first (requires SUPABASE_DB_URL)
    const directResult = await createTableDirectly(supabase);
    
    if (directResult.success) {
      return c.json({
        success: true,
        message: directResult.message,
        method: 'direct_postgres'
      });
    }
    
    // If direct creation failed, try via setupDatabase
    const setupResult = await setupDatabase(supabase);
    
    return c.json({
      success: setupResult.success,
      message: setupResult.message,
      method: 'supabase_client',
      instructions: setupResult.success ? null : 'Please create the table manually using GET /make-server-e884809f/setup for SQL'
    });
    
  } catch (error: any) {
    console.error('❌ Setup endpoint error:', error);
    return c.json({
      success: false,
      error: error.message,
      instructions: 'Automatic creation failed. Please use GET /make-server-e884809f/setup for manual instructions'
    }, 500);
  }
});

// ============================================================
// LOAD ROUTE MODULES
// ============================================================

// Lazy load route modules to reduce bundle size
const loadRoutes = async () => {
  try {
    console.log('📦 Loading route modules...');
    
    // Import all route modules
    const authRoutes = await import('./routes-auth.ts');
    const squadRoutes = await import('./routes-squads.ts');
    const sessionRoutes = await import('./routes-sessions.ts');
    const analyticsRoutes = await import('./routes-analytics.ts');
    const integrationRoutes = await import('./routes-integrations.ts');
    
    // Register routes
    authRoutes.registerAuthRoutes(app, supabase);
    squadRoutes.registerSquadRoutes(app, supabase);
    sessionRoutes.registerSessionRoutes(app, supabase);
    analyticsRoutes.registerAnalyticsRoutes(app, supabase);
    integrationRoutes.registerIntegrationRoutes(app, supabase);
    
    console.log('✅ All routes loaded successfully');
  } catch (error) {
    console.error('❌ Error loading routes:', error);
    throw error;
  }
};

// Load routes before starting server
await loadRoutes();

// ============================================================
// DATABASE CHECK (non-blocking)
// ============================================================

// Check database after server starts (don't block startup)
setupDatabase(supabase).then(result => {
  if (result.success) {
    console.log('✅ Database check passed');
  } else {
    console.warn('⚠️ Database check failed - table may need to be created manually');
    console.warn('Visit /make-server-e884809f/setup for instructions');
  }
});

// Start server
Deno.serve(app.fetch);
