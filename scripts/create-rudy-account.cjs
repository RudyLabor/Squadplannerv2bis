/**
 * Create Rudy's account in auth.users
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
const USER_PASSWORD = 'SquadPlanner2026!';
const USERNAME = 'Ruudaams';
const EXISTING_PROFILE_ID = '4f400fad-10c1-4ca5-a78f-6d8db699c0d7';

async function createAccount() {
  console.log('=== Create Account for Rudy ===\n');
  console.log(`Email: ${USER_EMAIL}`);
  console.log(`Password: ${USER_PASSWORD}`);
  console.log(`Username: ${USERNAME}\n`);

  // Create user with specific ID to match existing profile
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: USER_EMAIL,
    password: USER_PASSWORD,
    email_confirm: true, // Auto-confirm email
    user_metadata: {
      username: USERNAME,
      display_name: USERNAME
    },
    // Use the existing profile ID so it matches
    id: EXISTING_PROFILE_ID
  });

  if (error) {
    console.log(`Error creating user: ${error.message}`);

    // If ID conflict, try without specifying ID
    if (error.message.includes('already') || error.message.includes('duplicate')) {
      console.log('\nTrying without specific ID...');
      const { data: data2, error: error2 } = await supabaseAdmin.auth.admin.createUser({
        email: USER_EMAIL,
        password: USER_PASSWORD,
        email_confirm: true,
        user_metadata: {
          username: USERNAME,
          display_name: USERNAME
        }
      });

      if (error2) {
        console.log(`Error: ${error2.message}`);
        return;
      }

      console.log('\n✅ Account created (new ID)!');
      console.log(`User ID: ${data2.user.id}`);

      // Update profile to match new auth ID
      console.log('\nUpdating profile to match new auth ID...');
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ id: data2.user.id })
        .eq('email', USER_EMAIL);

      if (updateError) {
        console.log(`Profile update error: ${updateError.message}`);
        // Try to create new profile instead
        const { error: insertError } = await supabaseAdmin
          .from('profiles')
          .upsert({
            id: data2.user.id,
            email: USER_EMAIL,
            username: USERNAME,
            display_name: USERNAME
          });
        if (insertError) {
          console.log(`Profile insert error: ${insertError.message}`);
        } else {
          console.log('Profile created/updated!');
        }
      }
    }
    return;
  }

  console.log('\n✅ Account created successfully!');
  console.log(`User ID: ${data.user.id}`);
  console.log(`\n📋 Vos identifiants de connexion:`);
  console.log(`   Email: ${USER_EMAIL}`);
  console.log(`   Mot de passe: ${USER_PASSWORD}`);
  console.log(`\n🔗 Connectez-vous sur: https://squad-planner-v2-rudy.vercel.app/login`);
}

createAccount().catch(console.error);
