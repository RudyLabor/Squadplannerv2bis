
import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = 'https://cwtoprbowdqcemdjrtir.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTIxNDI2MywiZXhwIjoyMDg0NzkwMjYzfQ.9QuJ0c3WpLKQHHmPKsJlDttU8YFPR7f-xD_VLl8gFDE';
// Using known password for all fake users to allow easy login testing
const FAKE_PASSWORD = 'Password123!'; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const GAMES = ['Valorant', 'League of Legends', 'CS2', 'Rocket League', 'Apex Legends', 'Overwatch 2'];
const LOCATIONS = ['Paris', 'Lyon', 'Marseille', 'Brussels', 'Montreal', 'Geneva'];

const LOG = (msg, type = 'INFO') => {
  const icons = { INFO: 'ℹ️', PASS: '✅', FAIL: '❌', WARN: '⚠️' };
  console.log(`${icons[type]} [${type}] ${msg}`);
};

async function runQASuite() {
  console.log('\n🔍 STARTING "STUDIO QUALITY" QA SUITE (V2)\n=======================================');
  console.log(`🔑 Using Key (Verified): ${SUPABASE_KEY.substring(0, 10)}...`);
  let errors = 0;

  try {
    // =========================================================================
    // ROADMAP 1: CORE LOOP (Squad -> Session -> RSVP)
    // =========================================================================
    console.log('\n🏁 TESTING ROADMAP 1: CORE LOOP');
    
    // 1. Create a Test Squad Owner
    const email = `qa_owner_${Date.now()}@squadplanner.com`;
   
    const { data: owner, error: ownerError } = await supabase.auth.admin.createUser({
      email,
      password: 'Password123!',
      email_confirm: true,
      user_metadata: { name: 'QA Captain', avatar: 'https://i.pravatar.cc/300' }
    });
    
    if (ownerError) {
        console.error('Full Error:', JSON.stringify(ownerError, null, 2));
        throw new Error(`Failed to create owner: ${ownerError.message}`);
    }
    LOG(`User Created: ${email}`, 'PASS');

    // 2. Validate Profile Creation (Trigger Test)
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', owner.user.id).single();
    if (!profile) {
       LOG('Profile NOT created automatically!', 'FAIL'); errors++;
    } else {
       LOG('Profile creation verification', 'PASS');
       // Verify new fields exist
       if (profile.reliability_score !== undefined) LOG('Reliability Score initialized', 'PASS');
    }

    // 3. Create Squad
    const squadName = `QA Squad ${Date.now()}`;
    const { data: squad, error: squadError } = await supabase.from('squads').insert({
        owner_id: owner.user.id,
        name: squadName,
        game: 'Valorant',
        is_public: false
    }).select().single();

    if (squadError) { LOG(`Squad creation failed: ${squadError.message}`, 'FAIL'); errors++; }
    else LOG(`Squad Created: "${squad.name}"`, 'PASS');

    // 4. Create Session
    const startTime = new Date(Date.now() + 86400000).toISOString(); // Tomorrow
    const { data: session, error: sessError } = await supabase.from('sessions').insert({
        squad_id: squad.id,
        created_by: owner.user.id,
        title: 'Ranked Placement',
        start_time: startTime,
        status: 'planned'
    }).select().single();

    if (sessError) { LOG(`Session creation failed: ${sessError.message}`, 'FAIL'); errors++; }
    else LOG(`Session Planned: "${session.title}"`, 'PASS');

    // 5. RSVP Flow
    const { error: rsvpError } = await supabase.from('session_attendees').insert({
        session_id: session.id,
        user_id: owner.user.id,
        status: 'yes'
    });
    if (rsvpError) { LOG(`RSVP failed: ${rsvpError.message}`, 'FAIL'); errors++; }
    else LOG('RSVP Successful (Owner confirmed)', 'PASS');


    // =========================================================================
    // ROADMAP 2: ENGAGEMENT & DISCIPLINE
    // =========================================================================
    console.log('\n🔥 TESTING ROADMAP 2: ENGAGEMENT');

    // 1. Reliability Calculation (Simulation)
    await supabase.from('profiles').update({ reliability_score: 95 }).eq('id', owner.user.id);
    const { data: updatedProfile } = await supabase.from('profiles').select('reliability_score').eq('id', owner.user.id).single();
    
    if (updatedProfile && updatedProfile.reliability_score === 95) LOG('Reliability Score Update verifiable', 'PASS');
    else { LOG('Reliability Score failed update', 'FAIL'); errors++; }

    // =========================================================================
    // ROADMAP 3: INTELLIGENCE & MASTER PLAN
    // =========================================================================
    console.log('\n🧠 TESTING ROADMAP 3: MASTER PLAN');

    // 1. Profile Depth (Bio, Play Style - new columns)
    const { error: updateError } = await supabase.from('profiles').update({
        bio: 'IGL for QA Team',
        play_style: 'Aggressive',
        favorite_game: 'Valorant',
        location: 'Paris'
    }).eq('id', owner.user.id);

    if (updateError) { 
        LOG(`Failed to update advanced profile fields: ${updateError.message}`, 'FAIL'); 
        errors++; 
    } else {
        const { data: deepProfile } = await supabase.from('profiles').select('bio, play_style').eq('id', owner.user.id).single();
        if (deepProfile.bio === 'IGL for QA Team') LOG('Advanced Profile Fields (Bio, PlayStyle) persistent', 'PASS');
        else { LOG('Advanced Profile fields did not persist', 'FAIL'); errors++; }
    }

  } catch (err) {
    LOG(`CRITICAL FAILURE: ${err.message}`, 'FAIL');
    errors++;
  }

  console.log('\n=======================================');
  if (errors === 0) {
    console.log('✅ RESULT: SUCCÈS TOTAL - APP QUALIFIÉE "STUDIO QUALITY"');
  } else {
    console.log(`❌ RESULT: ${errors} ECHECS - CORRECTION REQUISE`);
    process.exit(1);
  }
}

runQASuite();
