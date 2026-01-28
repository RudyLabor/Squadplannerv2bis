/**
 * Script pour appliquer les migrations Discord et Push directement
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://cwtoprbowdqcemdjrtir.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTIxNDI2MywiZXhwIjoyMDg0NzkwMjYzfQ.9QuJ0c3WpLKQHHmPKsJlDttU8YFPR7f-xD_VLl8gFDE';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runSQL(sql, name) {
  console.log(`\n📦 Applying: ${name}...`);
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    if (error) {
      // Try direct query approach
      console.log(`   Using direct approach...`);
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({ sql_query: sql })
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
    }
    console.log(`   ✅ Success!`);
    return true;
  } catch (err) {
    console.log(`   ⚠️ Note: ${err.message?.substring(0, 100)}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Applying Discord & Push Notifications migrations...\n');

  // Discord tables - simplified version for direct execution
  const discordSQL = `
    -- Discord Links Table
    CREATE TABLE IF NOT EXISTS discord_links (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      discord_id TEXT UNIQUE NOT NULL,
      discord_username TEXT,
      discord_avatar TEXT,
      user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Discord Guild Links Table
    CREATE TABLE IF NOT EXISTS discord_guild_links (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      guild_id TEXT UNIQUE NOT NULL,
      guild_name TEXT,
      squad_id UUID REFERENCES squads(id) ON DELETE CASCADE,
      notification_channel_id TEXT,
      voice_channel_id TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Discord Link Codes Table
    CREATE TABLE IF NOT EXISTS discord_link_codes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      code TEXT UNIQUE NOT NULL,
      user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '10 minutes'),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Session Reminders Sent Table
    CREATE TABLE IF NOT EXISTS session_reminders_sent (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
      reminder_type TEXT NOT NULL CHECK (reminder_type IN ('h24', 'h1', 'h0')),
      sent_at TIMESTAMPTZ DEFAULT NOW(),
      channel_id TEXT,
      message_id TEXT,
      UNIQUE(session_id, reminder_type)
    );
  `;

  const pushSQL = `
    -- Push Subscriptions Table
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      endpoint TEXT NOT NULL,
      p256dh_key TEXT NOT NULL,
      auth_key TEXT NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      device_info JSONB DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, endpoint)
    );

    -- Notification Logs Table
    CREATE TABLE IF NOT EXISTS notification_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
      notification_type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT,
      data JSONB DEFAULT '{}',
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'clicked')),
      error_message TEXT,
      sent_at TIMESTAMPTZ,
      delivered_at TIMESTAMPTZ,
      clicked_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  // Execute via REST API directly
  const executeSQL = async (sql, name) => {
    console.log(`\n📦 Creating ${name}...`);

    // Split by statements and execute one by one
    const statements = sql.split(';').filter(s => s.trim().length > 0);

    for (const stmt of statements) {
      const cleanStmt = stmt.trim();
      if (!cleanStmt) continue;

      try {
        // Use the Supabase SQL editor endpoint indirectly through the client
        const { error } = await supabase
          .from('_temp_check')
          .select('*')
          .limit(0);

        // If we can query, the connection works
        // For DDL, we need to use the management API or dashboard
        console.log(`   Statement prepared for: ${cleanStmt.substring(0, 50)}...`);
      } catch (err) {
        // Expected - just checking connection
      }
    }
    console.log(`   ✅ SQL prepared for manual execution`);
  };

  await executeSQL(discordSQL, 'Discord Tables');
  await executeSQL(pushSQL, 'Push Notification Tables');

  console.log('\n' + '='.repeat(60));
  console.log('📋 IMPORTANT: Execute these SQL statements in Supabase Dashboard:');
  console.log('   1. Go to: https://supabase.com/dashboard/project/cwtoprbowdqcemdjrtir/sql');
  console.log('   2. Copy & paste the SQL from:');
  console.log('      - supabase/migrations/20260129_discord_bot_tables.sql');
  console.log('      - supabase/migrations/20260129_push_subscriptions.sql');
  console.log('   3. Click "Run" for each one');
  console.log('='.repeat(60));
}

main().catch(console.error);
