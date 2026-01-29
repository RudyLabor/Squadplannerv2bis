-- ============================================================================
-- AJOUT DES RLS POLICIES MANQUANTES - Squad Planner v2.0
-- Version défensive - vérifie existence de chaque table avant d'agir
-- ============================================================================

-- Helper pour activer RLS et créer policy de façon sécurisée
DO $$
BEGIN
  -- Organizations
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'organizations' AND table_schema = 'public') THEN
    ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "View accessible organizations" ON organizations;
    CREATE POLICY "View accessible organizations" ON organizations FOR SELECT USING (true);
  END IF;

  -- Friendships
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'friendships' AND table_schema = 'public') THEN
    ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "View own friendships" ON friendships;
    CREATE POLICY "View own friendships" ON friendships FOR SELECT USING (user_id = auth.uid() OR friend_id = auth.uid());
    DROP POLICY IF EXISTS "Create own friendships" ON friendships;
    CREATE POLICY "Create own friendships" ON friendships FOR INSERT WITH CHECK (user_id = auth.uid());
    DROP POLICY IF EXISTS "Update own friendships" ON friendships;
    CREATE POLICY "Update own friendships" ON friendships FOR UPDATE USING (user_id = auth.uid());
  END IF;

  -- Achievements
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'achievements' AND table_schema = 'public') THEN
    ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Anyone can view achievements" ON achievements;
    CREATE POLICY "Anyone can view achievements" ON achievements FOR SELECT USING (true);
  END IF;

  -- User Achievements
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_achievements' AND table_schema = 'public') THEN
    ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "View own achievement progress" ON user_achievements;
    CREATE POLICY "View own achievement progress" ON user_achievements FOR SELECT USING (user_id = auth.uid());
  END IF;

  -- Badges
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'badges' AND table_schema = 'public') THEN
    ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Anyone can view badges" ON badges;
    CREATE POLICY "Anyone can view badges" ON badges FOR SELECT USING (true);
  END IF;

  -- User Badges
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_badges' AND table_schema = 'public') THEN
    ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "View own badges" ON user_badges;
    CREATE POLICY "View own badges" ON user_badges FOR SELECT USING (user_id = auth.uid());
  END IF;

  -- Challenges
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'challenges' AND table_schema = 'public') THEN
    ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "View challenges" ON challenges;
    CREATE POLICY "View challenges" ON challenges FOR SELECT USING (true);
  END IF;

  -- User Challenge Progress
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_challenge_progress' AND table_schema = 'public') THEN
    ALTER TABLE user_challenge_progress ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "View own challenge progress" ON user_challenge_progress;
    CREATE POLICY "View own challenge progress" ON user_challenge_progress FOR SELECT USING (user_id = auth.uid());
  END IF;

  -- Tournaments
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tournaments' AND table_schema = 'public') THEN
    ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "View tournaments" ON tournaments;
    CREATE POLICY "View tournaments" ON tournaments FOR SELECT USING (true);
  END IF;

  -- Tournament Teams
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tournament_teams' AND table_schema = 'public') THEN
    ALTER TABLE tournament_teams ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "View team registrations" ON tournament_teams;
    CREATE POLICY "View team registrations" ON tournament_teams FOR SELECT USING (
      squad_id IN (SELECT squad_id FROM squad_members WHERE user_id = auth.uid())
    );
  END IF;

  -- Leagues
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'leagues' AND table_schema = 'public') THEN
    ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "View leagues" ON leagues;
    CREATE POLICY "View leagues" ON leagues FOR SELECT USING (true);
  END IF;

  -- League Teams
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'league_teams' AND table_schema = 'public') THEN
    ALTER TABLE league_teams ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "View league team registrations" ON league_teams;
    CREATE POLICY "View league team registrations" ON league_teams FOR SELECT USING (
      squad_id IN (SELECT squad_id FROM squad_members WHERE user_id = auth.uid())
    );
  END IF;

  -- Seasons
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'seasons' AND table_schema = 'public') THEN
    ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "View seasons" ON seasons;
    CREATE POLICY "View seasons" ON seasons FOR SELECT USING (true);
  END IF;

  -- Season Stats
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'season_stats' AND table_schema = 'public') THEN
    ALTER TABLE season_stats ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "View season stats" ON season_stats;
    CREATE POLICY "View season stats" ON season_stats FOR SELECT USING (
      squad_id IN (SELECT squad_id FROM squad_members WHERE user_id = auth.uid())
    );
  END IF;

  -- Integrations
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'integrations' AND table_schema = 'public') THEN
    ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Own integrations only" ON integrations;
    CREATE POLICY "Own integrations only" ON integrations FOR ALL USING (user_id = auth.uid());
  END IF;

  -- Webhooks
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'webhooks' AND table_schema = 'public') THEN
    ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Squad webhooks for members" ON webhooks;
    CREATE POLICY "Squad webhooks for members" ON webhooks FOR SELECT USING (
      squad_id IN (SELECT squad_id FROM squad_members WHERE user_id = auth.uid())
    );
  END IF;

  -- Availability Slots
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'availability_slots' AND table_schema = 'public') THEN
    ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Own availability" ON availability_slots;
    CREATE POLICY "Own availability" ON availability_slots FOR ALL USING (user_id = auth.uid());
  END IF;

  -- Analytics Squad
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'analytics_squad' AND table_schema = 'public') THEN
    ALTER TABLE analytics_squad ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "View squad analytics as member" ON analytics_squad;
    CREATE POLICY "View squad analytics as member" ON analytics_squad FOR SELECT USING (
      squad_id IN (SELECT squad_id FROM squad_members WHERE user_id = auth.uid())
    );
  END IF;

  -- Analytics User
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'analytics_user' AND table_schema = 'public') THEN
    ALTER TABLE analytics_user ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "View own analytics" ON analytics_user;
    CREATE POLICY "View own analytics" ON analytics_user FOR SELECT USING (user_id = auth.uid());
  END IF;

  RAISE NOTICE '✅ RLS policies applied successfully';
END $$;
