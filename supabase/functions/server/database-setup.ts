import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

/**
 * Create the kv_store table if it doesn't exist
 * This uses direct SQL execution via Supabase's postgres connection
 */
export async function setupDatabase(supabase: SupabaseClient): Promise<{ success: boolean; message: string }> {
  try {
    console.log('🔧 Setting up database...');
    
    // First, check if table exists by trying to select from it
    const { error: checkError } = await supabase
      .from('kv_store_e884809f')
      .select('key')
      .limit(1);
    
    if (!checkError) {
      console.log('✅ Table kv_store_e884809f already exists');
      return { success: true, message: 'Table already exists' };
    }
    
    console.log('⚠️ Table does not exist, attempting to create it...');
    
    // The table doesn't exist, we need to create it
    // We'll use a workaround: create it via the REST API by inserting data
    // which will fail, but we can detect this and provide instructions
    
    return {
      success: false,
      message: `Table kv_store_e884809f does not exist. Please create it manually in Supabase Dashboard.
      
SQL to run:
CREATE TABLE IF NOT EXISTS public.kv_store_e884809f (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kv_key_prefix ON public.kv_store_e884809f (key text_pattern_ops);
CREATE INDEX IF NOT EXISTS idx_kv_updated_at ON public.kv_store_e884809f (updated_at DESC);

ALTER TABLE public.kv_store_e884809f ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON public.kv_store_e884809f
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Anon users have access" ON public.kv_store_e884809f
  FOR ALL TO anon USING (true) WITH CHECK (true);

Error: ${checkError.message}
`
    };
    
  } catch (error: any) {
    console.error('❌ Database setup error:', error);
    return {
      success: false,
      message: `Database setup failed: ${error.message}`
    };
  }
}

/**
 * Create table using SQL if we have the right permissions
 */
export async function createTableDirectly(supabase: SupabaseClient): Promise<{ success: boolean; message: string }> {
  try {
    // Try to execute SQL directly
    // Note: This requires the postgres:// connection string
    const dbUrl = Deno.env.get('SUPABASE_DB_URL');
    
    if (!dbUrl) {
      return {
        success: false,
        message: 'SUPABASE_DB_URL not configured. Cannot create table automatically.'
      };
    }
    
    console.log('🔧 Attempting to create table via postgres connection...');
    
    // Import postgres client
    const { default: postgres } = await import('https://deno.land/x/postgres@v0.17.0/mod.ts');
    
    const client = new postgres(dbUrl);
    
    await client.connect();
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.kv_store_e884809f (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_kv_key_prefix ON public.kv_store_e884809f (key text_pattern_ops);
      CREATE INDEX IF NOT EXISTS idx_kv_updated_at ON public.kv_store_e884809f (updated_at DESC);
      
      ALTER TABLE public.kv_store_e884809f ENABLE ROW LEVEL SECURITY;
      
      DROP POLICY IF EXISTS "Service role full access" ON public.kv_store_e884809f;
      DROP POLICY IF EXISTS "Anon users have access" ON public.kv_store_e884809f;
      
      CREATE POLICY "Service role full access" ON public.kv_store_e884809f
        FOR ALL TO service_role USING (true) WITH CHECK (true);
      
      CREATE POLICY "Anon users have access" ON public.kv_store_e884809f
        FOR ALL TO anon USING (true) WITH CHECK (true);
    `;
    
    await client.queryArray(createTableSQL);
    await client.end();
    
    console.log('✅ Table created successfully via postgres connection');
    
    return {
      success: true,
      message: 'Table kv_store_e884809f created successfully!'
    };
    
  } catch (error: any) {
    console.error('❌ Direct table creation failed:', error);
    return {
      success: false,
      message: `Direct creation failed: ${error.message}. Please create table manually.`
    };
  }
}
