
// import apiReal from '../src/utils/api-real.ts'; // Cannot use frontend alias in Node script
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const SUPABASE_URL = 'https://cwtoprbowdqcemdjrtir.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTIxNDI2MywiZXhwIjoyMDg0NzkwMjYzfQ.9QuJ0c3WpLKQHHmPKsJlDttU8YFPR7f-xD_VLl8gFDE';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testProfileFlow() {
  console.log('🚀 Starting Profile QA Test...');

  // 1. Create a Test User
  const email = `qa_test_${Date.now()}@example.com`;
  const password = 'Password123!';
  
  console.log(`👤 Creating user: ${email}`);
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm the user
    user_metadata: {
        name: 'Original Name',
        avatar: 'https://original-avatar.com/img.png'
    }
  });

  if (authError) {
    console.error('❌ Auth Creation Failed:', authError);
    return;
  }

  const userId = authData.user?.id;
  console.log(`✅ User created. ID: ${userId}`);

  // 2. Initial Profile Check (Trigger should have run)
  // Wait a moment for trigger
  await new Promise(r => setTimeout(r, 1000));
  
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError) {
     console.error('❌ Initial Profile Check Failed (Trigger Issue?):', profileError);
  } else {
     console.log('✅ Initial Profile Found:', profile);
  }

  // 3. Attempt Update via API Logic
  // We mimic what api-real.ts does: update 'profiles' table properly
  console.log('🔄 Attempting Profile Update (Username & Avatar)...');
  
  const newName = 'Updated QA Master';
  const newAvatar = 'https://updated-avatar.com/img.png';

  const { data: updated, error: updateError } = await supabase
    .from('profiles')
    .update({ 
        username: newName,
        avatar_url: newAvatar
    })
    .eq('id', userId)
    .select()
    .single();

  if (updateError) {
      console.error('❌ Profile Update Failed:', updateError);
  } else {
      console.log('✅ Profile Updated Successfully:', updated);
      
      if (updated.username !== newName) console.error('⚠️ Username mismatch!');
      if (updated.avatar_url !== newAvatar) console.error('⚠️ Avatar mismatch!');
  }

  // 4. Clean up
  console.log('🧹 Cleaning up test user...');
  await supabase.auth.admin.deleteUser(userId);
  console.log('✨ QA Test Complete.');
}

testProfileFlow();
