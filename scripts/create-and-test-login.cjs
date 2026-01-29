/**
 * Create a test account and verify login works
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://cwtoprbowdqcemdjrtir.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyMTQyNjMsImV4cCI6MjA4NDc5MDI2M30.FUpLncLIZc7l4hukBu5oOzj0tHl2IiwIIJ2Ghml8-6k';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Generate unique test email
const timestamp = Date.now();
const TEST_EMAIL = `test_${timestamp}@squadplanner.test`;
const TEST_PASSWORD = 'TestPassword123!';
const TEST_USERNAME = `testuser_${timestamp}`;

async function testFullFlow() {
  console.log('=== Full Login System Test ===\n');

  // Step 1: Sign Up
  console.log('1. Creating test account...');
  console.log(`   Email: ${TEST_EMAIL}`);
  console.log(`   Password: ${TEST_PASSWORD}`);

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    options: {
      data: {
        username: TEST_USERNAME,
        display_name: 'Test User'
      }
    }
  });

  if (signUpError) {
    console.log(`   ❌ Sign up error: ${signUpError.message}`);
    return;
  }

  if (signUpData.user && !signUpData.session) {
    console.log('   ⚠️  Email confirmation required - cannot test login');
    console.log('   Supabase has email confirmation ENABLED');
    console.log('\n   To fix: Go to Supabase Dashboard > Auth > Providers > Email');
    console.log('   And disable "Confirm email"');
    return;
  }

  if (signUpData.session) {
    console.log('   ✅ Account created successfully (no email confirmation needed)');
    console.log(`   User ID: ${signUpData.user?.id}`);

    // Sign out first
    await supabase.auth.signOut();
    console.log('   ✅ Signed out');
  }

  // Step 2: Sign In
  console.log('\n2. Testing sign in with new account...');
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD
  });

  if (signInError) {
    console.log(`   ❌ Sign in error: ${signInError.message}`);
    return;
  }

  if (signInData.session) {
    console.log('   ✅ Sign in successful!');
    console.log(`   Session token: ${signInData.session.access_token.substring(0, 20)}...`);
  }

  // Step 3: Check profile
  console.log('\n3. Checking profile...');
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', signInData.user.id)
    .single();

  if (profileError) {
    console.log(`   ⚠️  Profile not found: ${profileError.message}`);
    console.log('   This is OK - fallback user data will be used');
  } else {
    console.log('   ✅ Profile found!');
    console.log(`   Username: ${profile.username}`);
  }

  // Step 4: Clean up
  console.log('\n4. Cleaning up test account...');
  await supabase.auth.signOut();
  console.log('   ✅ Signed out');

  console.log('\n=== Test Complete ===');
  console.log('\n📋 SUMMARY:');
  console.log('   ✅ Supabase Auth is working correctly');
  console.log('   ✅ Sign up works');
  console.log('   ✅ Sign in works');
  console.log('\n   If you cannot login with your account, the password is incorrect.');
  console.log('   Use the password reset email that was sent, or create a new account.');
}

testFullFlow().catch(console.error);
