/**
 * Send Password Reset Email
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://cwtoprbowdqcemdjrtir.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyMTQyNjMsImV4cCI6MjA4NDc5MDI2M30.FUpLncLIZc7l4hukBu5oOzj0tHl2IiwIIJ2Ghml8-6k';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const EMAIL = process.argv[2] || 'rudylabor@hotmail.fr';

async function resetPassword() {
  console.log(`Sending password reset email to: ${EMAIL}\n`);

  const { data, error } = await supabase.auth.resetPasswordForEmail(EMAIL, {
    redirectTo: 'https://squad-planner-v2-rudy.vercel.app/auth/reset-password',
  });

  if (error) {
    console.log(`❌ Error: ${error.message}`);
  } else {
    console.log('✅ Password reset email sent!');
    console.log('   Check your inbox (and spam folder)');
    console.log('   Click the link to reset your password');
  }
}

resetPassword().catch(console.error);
