/**
 * Direct Login Test Script
 * Run with: node scripts/test-login-direct.cjs
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://cwtoprbowdqcemdjrtir.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyMTQyNjMsImV4cCI6MjA4NDc5MDI2M30.FUpLncLIZc7l4hukBu5oOzj0tHl2IiwIIJ2Ghml8-6k';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test credentials - use the user's email
const TEST_EMAIL = process.argv[2] || 'rudylabor@hotmail.fr';
const TEST_PASSWORD = process.argv[3] || 'test123';

async function testLogin() {
  console.log('=== Squad Planner Login Diagnostic ===\n');
  console.log(`Testing login for: ${TEST_EMAIL}\n`);

  // Test 1: Connection to Supabase
  console.log('1. Testing Supabase connection...');
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) {
      console.log(`   ❌ Connection error: ${error.message}`);
      console.log(`   Code: ${error.code}`);
    } else {
      console.log('   ✅ Supabase connection OK');
    }
  } catch (err) {
    console.log(`   ❌ Connection failed: ${err.message}`);
  }

  // Test 2: Sign In
  console.log('\n2. Testing signInWithPassword...');
  try {
    const startTime = Date.now();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    const elapsed = Date.now() - startTime;

    if (error) {
      console.log(`   ❌ Sign in error (${elapsed}ms): ${error.message}`);
      console.log(`   Error code: ${error.status || error.code}`);

      if (error.message.includes('Invalid login')) {
        console.log('\n   ⚠️  Le mot de passe est incorrect ou le compte n\'existe pas');
      } else if (error.message.includes('Email not confirmed')) {
        console.log('\n   ⚠️  L\'email n\'a pas été confirmé');
      }
    } else if (data.session) {
      console.log(`   ✅ Sign in successful (${elapsed}ms)`);
      console.log(`   User ID: ${data.user?.id}`);
      console.log(`   Email: ${data.user?.email}`);
      console.log(`   Session expires: ${new Date(data.session.expires_at * 1000).toLocaleString()}`);

      // Test 3: Get Profile
      console.log('\n3. Testing profile fetch...');
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.log(`   ⚠️  Profile not found: ${profileError.message}`);
          console.log('   Using auth metadata as fallback...');
          console.log(`   Metadata: ${JSON.stringify(data.user.user_metadata, null, 2)}`);
        } else {
          console.log('   ✅ Profile found:');
          console.log(`   Username: ${profile.username}`);
          console.log(`   Display Name: ${profile.display_name}`);
          console.log(`   Created: ${profile.created_at}`);
        }
      } catch (err) {
        console.log(`   ❌ Profile fetch error: ${err.message}`);
      }

      // Sign out
      await supabase.auth.signOut();
      console.log('\n4. Signed out successfully');
    } else {
      console.log(`   ⚠️  No session returned (${elapsed}ms)`);
      console.log(`   This usually means email confirmation is required`);
    }
  } catch (err) {
    console.log(`   ❌ Unexpected error: ${err.message}`);
  }

  console.log('\n=== Diagnostic Complete ===');
}

testLogin().catch(console.error);
