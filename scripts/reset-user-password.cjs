/**
 * Reset user password via Admin API
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://cwtoprbowdqcemdjrtir.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTIxNDI2MywiZXhwIjoyMDg0NzkwMjYzfQ.9QuJ0c3WpLKQHHmPKsJlDttU8YFPR7f-xD_VLl8gFDE';

// Admin client with service role
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const USER_EMAIL = 'rudylabor@hotmail.fr';
const NEW_PASSWORD = 'SquadPlanner2026!';

async function resetPassword() {
  console.log('=== Reset User Password ===\n');
  console.log(`Email: ${USER_EMAIL}`);
  console.log(`New Password: ${NEW_PASSWORD}\n`);

  // Get user by email
  const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();

  if (listError) {
    console.log(`Error listing users: ${listError.message}`);
    return;
  }

  const user = users.users.find(u => u.email === USER_EMAIL);

  if (!user) {
    console.log(`User not found: ${USER_EMAIL}`);
    return;
  }

  console.log(`Found user: ${user.id}`);
  console.log(`Email confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);

  // Update password
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
    password: NEW_PASSWORD,
    email_confirm: true // Also ensure email is confirmed
  });

  if (error) {
    console.log(`Error updating password: ${error.message}`);
    return;
  }

  console.log('\n✅ Password reset successful!');
  console.log(`\n📋 Vos nouveaux identifiants:`);
  console.log(`   Email: ${USER_EMAIL}`);
  console.log(`   Mot de passe: ${NEW_PASSWORD}`);
  console.log(`\n🔗 Connectez-vous sur: https://squad-planner-v2-rudy.vercel.app/login`);
}

resetPassword().catch(console.error);
