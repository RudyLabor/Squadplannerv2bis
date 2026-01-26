-- Squad Planner - Initial Database Schema
-- This migration creates the key-value store table used by the application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create kv_store table (already exists, this is documentation)
-- The kv_store_e884809f table is automatically managed by Supabase
-- and used through the kv_store.tsx utility functions

-- Table structure (for reference):
-- CREATE TABLE IF NOT EXISTS kv_store_e884809f (
--   key TEXT PRIMARY KEY,
--   value JSONB NOT NULL,
--   created_at TIMESTAMPTZ DEFAULT NOW(),
--   updated_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- Note: The application uses a key-value pattern with prefixes:
-- - user:{userId}              → User profiles
-- - squad:{squadId}            → Squad data
-- - session:{squadId}:{id}     → Session data
-- - webhook:{userId}:{id}      → Webhook configurations
-- - discord:{userId}           → Discord connections
-- - notifications:{userId}     → Notification settings

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_kv_key_prefix ON kv_store_e884809f (key text_pattern_ops);
CREATE INDEX IF NOT EXISTS idx_kv_updated_at ON kv_store_e884809f (updated_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE kv_store_e884809f ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access their own data
-- Note: This is simplified. Adjust based on your security requirements.
CREATE POLICY "Users can access their own data" ON kv_store_e884809f
  FOR ALL
  USING (
    -- Allow access if key starts with user's ID
    key LIKE 'user:' || auth.uid()::text || '%'
    OR
    -- Allow access to squads where user is a member (simplified check via value)
    value::jsonb->'members' @> jsonb_build_array(jsonb_build_object('id', auth.uid()::text))
    OR
    -- Service role can access everything
    auth.role() = 'service_role'
  );

-- Note: For production, consider creating separate tables for:
-- - users (with proper schema and indexes)
-- - squads (with foreign keys to users)
-- - sessions (with foreign keys to squads)
-- - etc.
-- The KV store pattern is flexible for prototyping but may need optimization at scale.

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on every update
DROP TRIGGER IF EXISTS update_kv_store_updated_at ON kv_store_e884809f;
CREATE TRIGGER update_kv_store_updated_at
  BEFORE UPDATE ON kv_store_e884809f
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Initial schema migration completed successfully';
END $$;
