/**
 * List all auth users
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

async function listUsers() {
  console.log('=== List All Auth Users ===\n');

  const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    console.log(`Error: ${error.message}`);
    return;
  }

  console.log(`Total users in auth.users: ${users.users.length}\n`);

  // Search for rudylabor
  const searchTerm = 'rudy';
  const matchingUsers = users.users.filter(u =>
    u.email?.toLowerCase().includes(searchTerm) ||
    u.user_metadata?.username?.toLowerCase().includes(searchTerm)
  );

  if (matchingUsers.length > 0) {
    console.log(`Users matching "${searchTerm}":`);
    matchingUsers.forEach(u => {
      console.log(`  - ${u.email} (ID: ${u.id})`);
      console.log(`    Confirmed: ${u.email_confirmed_at ? 'Yes' : 'No'}`);
      console.log(`    Created: ${u.created_at}`);
    });
  } else {
    console.log(`No users matching "${searchTerm}"`);
  }

  // Show first 10 users
  console.log('\nFirst 10 users:');
  users.users.slice(0, 10).forEach((u, i) => {
    console.log(`${i + 1}. ${u.email}`);
  });
}

listUsers().catch(console.error);
