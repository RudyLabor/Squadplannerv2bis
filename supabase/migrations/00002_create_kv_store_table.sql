-- Create the kv_store_e884809f table
-- This table is used for all app data storage using a key-value pattern

-- Create the table
CREATE TABLE IF NOT EXISTS kv_store_e884809f (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_kv_key_prefix ON kv_store_e884809f (key text_pattern_ops);
CREATE INDEX IF NOT EXISTS idx_kv_updated_at ON kv_store_e884809f (updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_kv_value_gin ON kv_store_e884809f USING gin (value);

-- Enable Row Level Security
ALTER TABLE kv_store_e884809f ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role full access" ON kv_store_e884809f;
DROP POLICY IF EXISTS "Users can access their own data" ON kv_store_e884809f;

-- Policy 1: Service role has full access (for server-side operations)
CREATE POLICY "Service role full access" ON kv_store_e884809f
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy 2: Anon users have full access (simplified for prototyping)
-- In production, you should implement proper RLS based on auth.uid()
CREATE POLICY "Anon users have access" ON kv_store_e884809f
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_kv_store_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on every update
DROP TRIGGER IF EXISTS trigger_update_kv_store_updated_at ON kv_store_e884809f;
CREATE TRIGGER trigger_update_kv_store_updated_at
  BEFORE UPDATE ON kv_store_e884809f
  FOR EACH ROW
  EXECUTE FUNCTION update_kv_store_updated_at();

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ KV Store table created successfully';
END $$;
