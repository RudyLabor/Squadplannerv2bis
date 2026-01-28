-- ============================================================================
-- RECURRING SESSIONS AUTOMATION
-- ============================================================================
-- Function to automatically generate recurring sessions
-- Run this daily via cron or pg_cron extension

CREATE OR REPLACE FUNCTION generate_recurring_sessions()
RETURNS void AS $$
DECLARE
  rec RECORD;
  next_date DATE;
  days_ahead INTEGER;
BEGIN
  FOR rec IN
    SELECT * FROM recurring_sessions
    WHERE is_active = true
    AND (last_generated_at IS NULL OR last_generated_at < CURRENT_DATE - INTERVAL '7 days')
  LOOP
    -- Calculate next session date (next occurrence of day_of_week)
    -- day_of_week: 0=Sunday, 1=Monday, ..., 6=Saturday
    days_ahead := (rec.day_of_week - EXTRACT(DOW FROM CURRENT_DATE)::INTEGER + 7) % 7;
    IF days_ahead = 0 THEN
      days_ahead := 7; -- If today, schedule for next week
    END IF;

    next_date := CURRENT_DATE + days_ahead;

    -- Insert session if doesn't exist for this date
    INSERT INTO sessions (
      squad_id,
      title,
      description,
      scheduled_date,
      scheduled_time,
      duration,
      timezone,
      is_recurring,
      recurring_session_id,
      status,
      proposed_by,
      required_players
    )
    SELECT
      rec.squad_id,
      rec.title,
      rec.description,
      next_date,
      rec.scheduled_time,
      rec.duration,
      rec.timezone,
      true,
      rec.id,
      'pending',
      rec.created_by,
      5
    WHERE NOT EXISTS (
      SELECT 1 FROM sessions
      WHERE recurring_session_id = rec.id
      AND scheduled_date = next_date
    );

    -- Mark as generated
    UPDATE recurring_sessions
    SET last_generated_at = CURRENT_DATE
    WHERE id = rec.id;
  END LOOP;

  RAISE NOTICE 'Recurring sessions generated successfully';
END;
$$ LANGUAGE plpgsql;

-- Optional: Set up pg_cron job to run daily at midnight
-- Uncomment if pg_cron extension is available:
-- SELECT cron.schedule(
--   'generate-recurring-sessions',
--   '0 0 * * *',
--   'SELECT generate_recurring_sessions()'
-- );

-- Manual execution command (run this daily):
-- SELECT generate_recurring_sessions();

COMMENT ON FUNCTION generate_recurring_sessions IS 'Automatically generates sessions from recurring_sessions records. Should be run daily.';
