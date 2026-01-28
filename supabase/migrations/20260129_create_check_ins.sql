-- ============================================================================
-- CHECK-IN OBLIGATOIRE - Squad Planner v2.0
-- Feature signature: Confirmation 1h avant session + "Je suis en route"
-- ============================================================================

-- Table session_check_ins
CREATE TABLE IF NOT EXISTS session_check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Statuts check-in
  status TEXT NOT NULL CHECK (status IN ('confirmed', 'on_my_way', 'running_late', 'cancelled')),

  -- Notes optionnelles
  notes TEXT,

  -- Timestamps
  checked_in_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  UNIQUE(session_id, user_id),

  -- Index pour performance
  CONSTRAINT session_check_ins_session_id_idx FOREIGN KEY (session_id) REFERENCES sessions(id),
  CONSTRAINT session_check_ins_user_id_idx FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Index pour requêtes rapides
CREATE INDEX IF NOT EXISTS idx_check_ins_session ON session_check_ins(session_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_user ON session_check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_status ON session_check_ins(status);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE session_check_ins ENABLE ROW LEVEL SECURITY;

-- Policy: View check-ins for sessions you're part of
CREATE POLICY "View check-ins for squad sessions" ON session_check_ins
  FOR SELECT USING (
    session_id IN (
      SELECT s.id FROM sessions s
      INNER JOIN squad_members sm ON sm.squad_id = s.squad_id
      WHERE sm.user_id = auth.uid()
    )
  );

-- Policy: Create own check-in
CREATE POLICY "Create own check-in" ON session_check_ins
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Policy: Update own check-in
CREATE POLICY "Update own check-in" ON session_check_ins
  FOR UPDATE USING (user_id = auth.uid());

-- Policy: Delete own check-in
CREATE POLICY "Delete own check-in" ON session_check_ins
  FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_check_in_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update timestamp
CREATE TRIGGER update_session_check_ins_timestamp
  BEFORE UPDATE ON session_check_ins
  FOR EACH ROW
  EXECUTE FUNCTION update_check_in_timestamp();

-- Function: Send notification when check-in status changes
CREATE OR REPLACE FUNCTION notify_check_in_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notification for squad members
  INSERT INTO notifications (user_id, type, title, message, data)
  SELECT
    sm.user_id,
    'check_in_update',
    'Mise à jour check-in',
    (SELECT u.display_name FROM users u WHERE u.id = NEW.user_id) ||
    CASE NEW.status
      WHEN 'confirmed' THEN ' est confirmé'
      WHEN 'on_my_way' THEN ' est en route'
      WHEN 'running_late' THEN ' est en retard'
      WHEN 'cancelled' THEN ' a annulé'
    END,
    jsonb_build_object(
      'session_id', NEW.session_id,
      'user_id', NEW.user_id,
      'status', NEW.status
    )
  FROM squad_members sm
  INNER JOIN sessions s ON s.squad_id = sm.squad_id
  WHERE s.id = NEW.session_id
    AND sm.user_id != NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Notify on check-in update
CREATE TRIGGER notify_on_check_in_change
  AFTER INSERT OR UPDATE ON session_check_ins
  FOR EACH ROW
  EXECUTE FUNCTION notify_check_in_status_change();

-- ============================================================================
-- INITIAL DATA (Example statuses)
-- ============================================================================

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Check-in system created successfully';
  RAISE NOTICE '   - Table: session_check_ins';
  RAISE NOTICE '   - Statuses: confirmed, on_my_way, running_late, cancelled';
  RAISE NOTICE '   - RLS policies: Enabled';
  RAISE NOTICE '   - Notifications: Auto-send on status change';
END $$;
