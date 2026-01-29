/**
 * Find user by email using various methods
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://cwtoprbowdqcemdjrtir.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTIxNDI2MywiZXhwIjoyMDg0NzkwMjYzfQ.9QuJ0c3WpLKQHHmPKsJlDttU8YFPR7f-xD_VLl8gFDE';

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const USER_EMAIL = 'rudylabor@hotmail.fr';

async function findUser() {
  console.log('=== Find User by Email ===\n');
  console.log(`Searching for: ${USER_EMAIL}\n`);

  // Method 1: List all users with pagination
  console.log('1. Listing ALL users (with pagination)...');
  let page = 1;
  let allUsers = [];
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page: page,
      perPage: 1000
    });

    if (error) {
      console.log(`Error on page ${page}: ${error.message}`);
      break;
    }

    allUsers = allUsers.concat(data.users);

    if (data.users.length < 1000) {
      hasMore = false;
    } else {
      page++;
    }
  }

  console.log(`Total users found: ${allUsers.length}`);

  // Search for the email
  const exactMatch = allUsers.find(u => u.email?.toLowerCase() === USER_EMAIL.toLowerCase());

  if (exactMatch) {
    console.log('\n✅ Found exact match!');
    console.log(`   ID: ${exactMatch.id}`);
    console.log(`   Email: ${exactMatch.email}`);
    console.log(`   Confirmed: ${exactMatch.email_confirmed_at ? 'Yes' : 'No'}`);
    console.log(`   Created: ${exactMatch.created_at}`);
    console.log(`   Last sign in: ${exactMatch.last_sign_in_at || 'Never'}`);

    // Try to reset password for this user
    console.log('\n2. Resetting password for this user...');
    const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(exactMatch.id, {
      password: 'SquadPlanner2026!',
      email_confirm: true
    });

    if (updateError) {
      console.log(`   Error: ${updateError.message}`);
    } else {
      console.log('   ✅ Password updated successfully!');
      console.log(`\n📋 Vos identifiants:`);
      console.log(`   Email: ${USER_EMAIL}`);
      console.log(`   Mot de passe: SquadPlanner2026!`);
    }
  } else {
    console.log('\n❌ No exact match found');

    // Show partial matches
    const partialMatches = allUsers.filter(u =>
      u.email?.toLowerCase().includes('rudy') ||
      u.email?.toLowerCase().includes('labor') ||
      u.email?.toLowerCase().includes('hotmail')
    );

    if (partialMatches.length > 0) {
      console.log('\nPartial matches:');
      partialMatches.forEach(u => {
        console.log(`   - ${u.email}`);
      });
    }
  }
}

findUser().catch(console.error);
