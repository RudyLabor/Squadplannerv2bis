-- ============================================================================
-- AJOUT DES RLS POLICIES MANQUANTES - Squad Planner v2.0
-- ============================================================================

-- Organizations RLS
DROP POLICY IF EXISTS "View accessible organizations" ON organizations;
CREATE POLICY "View accessible organizations" ON organizations
  FOR SELECT USING (
    type = 'community' OR
    id IN (SELECT organization_id FROM squads WHERE id IN
      (SELECT squad_id FROM squad_members WHERE user_id = auth.uid()))
  );

DROP POLICY IF EXISTS "Owners can update" ON organizations;
CREATE POLICY "Owners can update" ON organizations
  FOR UPDATE USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Authenticated can create" ON organizations;
CREATE POLICY "Authenticated can create" ON organizations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Friendships RLS
DROP POLICY IF EXISTS "View own friendships" ON friendships;
CREATE POLICY "View own friendships" ON friendships
  FOR SELECT USING (user_id = auth.uid() OR friend_id = auth.uid());

DROP POLICY IF EXISTS "Create own friendships" ON friendships;
CREATE POLICY "Create own friendships" ON friendships
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Update own friendships" ON friendships;
CREATE POLICY "Update own friendships" ON friendships
  FOR UPDATE USING (user_id = auth.uid());

-- Achievements RLS
DROP POLICY IF EXISTS "Anyone can view achievements" ON achievements;
CREATE POLICY "Anyone can view achievements" ON achievements
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "View own achievement progress" ON user_achievements;
CREATE POLICY "View own achievement progress" ON user_achievements
  FOR SELECT USING (user_id = auth.uid());

-- Badges RLS
DROP POLICY IF EXISTS "Anyone can view badges" ON badges;
CREATE POLICY "Anyone can view badges" ON badges
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "View own badges" ON user_badges;
CREATE POLICY "View own badges" ON user_badges
  FOR SELECT USING (user_id = auth.uid());

-- Challenges RLS
DROP POLICY IF EXISTS "View active challenges" ON challenges;
CREATE POLICY "View active challenges" ON challenges
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "View own challenge progress" ON user_challenge_progress;
CREATE POLICY "View own challenge progress" ON user_challenge_progress
  FOR SELECT USING (user_id = auth.uid());

-- Tournaments RLS
DROP POLICY IF EXISTS "View active tournaments" ON tournaments;
CREATE POLICY "View active tournaments" ON tournaments
  FOR SELECT USING (status IN ('upcoming', 'registration_open', 'ongoing'));

DROP POLICY IF EXISTS "View team registrations" ON tournament_teams;
CREATE POLICY "View team registrations" ON tournament_teams
  FOR SELECT USING (
    squad_id IN (SELECT squad_id FROM squad_members WHERE user_id = auth.uid())
  );

-- Leagues RLS
DROP POLICY IF EXISTS "View active leagues" ON leagues;
CREATE POLICY "View active leagues" ON leagues
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "View league team registrations" ON league_teams;
CREATE POLICY "View league team registrations" ON league_teams
  FOR SELECT USING (
    squad_id IN (SELECT squad_id FROM squad_members WHERE user_id = auth.uid())
  );

-- Seasons RLS
DROP POLICY IF EXISTS "View active seasons" ON seasons;
CREATE POLICY "View active seasons" ON seasons
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "View season stats" ON season_stats;
CREATE POLICY "View season stats" ON season_stats
  FOR SELECT USING (
    squad_id IN (SELECT squad_id FROM squad_members WHERE user_id = auth.uid())
  );

-- Integrations RLS
DROP POLICY IF EXISTS "Own integrations only" ON integrations;
CREATE POLICY "Own integrations only" ON integrations
  FOR ALL USING (user_id = auth.uid());

-- Webhooks RLS
DROP POLICY IF EXISTS "Squad webhooks for members" ON webhooks;
CREATE POLICY "Squad webhooks for members" ON webhooks
  FOR SELECT USING (
    squad_id IN (SELECT squad_id FROM squad_members WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Squad admins can manage webhooks" ON webhooks;
CREATE POLICY "Squad admins can manage webhooks" ON webhooks
  FOR ALL USING (
    squad_id IN (SELECT squad_id FROM squad_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
  );

-- Availability RLS
DROP POLICY IF EXISTS "Own availability" ON availability_slots;
CREATE POLICY "Own availability" ON availability_slots
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Squad members can view availability" ON availability_slots;
CREATE POLICY "Squad members can view availability" ON availability_slots
  FOR SELECT USING (
    user_id IN (
      SELECT DISTINCT sm.user_id
      FROM squad_members sm
      WHERE sm.squad_id IN (SELECT squad_id FROM squad_members WHERE user_id = auth.uid())
    )
  );

-- Analytics Squad RLS
DROP POLICY IF EXISTS "View squad analytics as member" ON analytics_squad;
CREATE POLICY "View squad analytics as member" ON analytics_squad
  FOR SELECT USING (
    squad_id IN (SELECT squad_id FROM squad_members WHERE user_id = auth.uid())
  );

-- Analytics User RLS
DROP POLICY IF EXISTS "View own analytics" ON analytics_user;
CREATE POLICY "View own analytics" ON analytics_user
  FOR SELECT USING (user_id = auth.uid());

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE season_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_squad ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_user ENABLE ROW LEVEL SECURITY;
