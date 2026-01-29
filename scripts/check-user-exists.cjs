/**
 * Check if user exists in profiles table
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://cwtoprbowdqcemdjrtir.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyMTQyNjMsImV4cCI6MjA4NDc5MDI2M30.FUpLncLIZc7l4hukBu5oOzj0tHl2IiwIIJ2Ghml8-6k';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const EMAIL_TO_CHECK = process.argv[2] || 'rudylabor@hotmail.fr';

async function checkUser() {
  console.log(`Checking if user exists: ${EMAIL_TO_CHECK}\n`);

  // Check profiles table
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, email, username, created_at')
    .ilike('email', EMAIL_TO_CHECK);

  if (error) {
    console.log(`Error checking profiles: ${error.message}`);
  } else if (profiles && profiles.length > 0) {
    console.log('✅ User found in profiles:');
    profiles.forEach(p => {
      console.log(`   ID: ${p.id}`);
      console.log(`   Email: ${p.email}`);
      console.log(`   Username: ${p.username}`);
      console.log(`   Created: ${p.created_at}`);
    });
  } else {
    console.log('❌ No user found with this email in profiles table');
  }

  // List some profiles to verify the table works
  console.log('\nListing first 5 profiles in database:');
  const { data: allProfiles, error: allError } = await supabase
    .from('profiles')
    .select('email, username, created_at')
    .limit(5);

  if (allError) {
    console.log(`Error: ${allError.message}`);
  } else if (allProfiles && allProfiles.length > 0) {
    allProfiles.forEach((p, i) => {
      console.log(`${i + 1}. ${p.email || 'no-email'} (${p.username || 'no-username'})`);
    });
  } else {
    console.log('No profiles found in database');
  }
}

checkUser().catch(console.error);
