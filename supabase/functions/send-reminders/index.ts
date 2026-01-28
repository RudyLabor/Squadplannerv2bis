/**
 * 🔔 SEND REMINDERS - Edge Function
 * Cron job pour envoyer les rappels automatiques J-1, H-1, 10min
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  try {
    const now = new Date();
    const results = {
      day_before: 0,
      hour_before: 0,
      ten_min_before: 0,
    };

    // 1. RAPPEL J-1 (24h avant)
    const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const oneDayStart = new Date(oneDayLater);
    oneDayStart.setMinutes(0, 0, 0);
    const oneDayEnd = new Date(oneDayStart.getTime() + 10 * 60 * 1000); // 10 min window

    const { data: dayBeforeSessions } = await supabase
      .from('sessions')
      .select('id, title, scheduled_date, scheduled_time, squad_id, squad:squads(name)')
      .eq('status', 'confirmed')
      .gte('scheduled_date', oneDayStart.toISOString().split('T')[0])
      .lt('scheduled_time', oneDayEnd.toTimeString().split(' ')[0]);

    if (dayBeforeSessions) {
      for (const session of dayBeforeSessions) {
        await sendReminder(session, 'day_before');
        results.day_before++;
      }
    }

    // 2. RAPPEL H-1 (1h avant)
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const oneHourStart = new Date(oneHourLater);
    oneHourStart.setMinutes(0, 0, 0);
    const oneHourEnd = new Date(oneHourStart.getTime() + 10 * 60 * 1000);

    const { data: hourBeforeSessions } = await supabase
      .from('sessions')
      .select('id, title, scheduled_date, scheduled_time, squad_id, squad:squads(name)')
      .eq('status', 'confirmed')
      .eq('scheduled_date', now.toISOString().split('T')[0])
      .gte('scheduled_time', oneHourStart.toTimeString().split(' ')[0])
      .lt('scheduled_time', oneHourEnd.toTimeString().split(' ')[0]);

    if (hourBeforeSessions) {
      for (const session of hourBeforeSessions) {
        await sendReminder(session, 'hour_before');
        results.hour_before++;
      }
    }

    // 3. RAPPEL 10 MIN avant
    const tenMinLater = new Date(now.getTime() + 10 * 60 * 1000);
    const tenMinStart = new Date(tenMinLater);
    tenMinStart.setMinutes(0, 0, 0);
    const tenMinEnd = new Date(tenMinStart.getTime() + 5 * 60 * 1000); // 5 min window

    const { data: tenMinSessions } = await supabase
      .from('sessions')
      .select('id, title, scheduled_date, scheduled_time, squad_id, squad:squads(name)')
      .eq('status', 'confirmed')
      .eq('scheduled_date', now.toISOString().split('T')[0])
      .gte('scheduled_time', tenMinStart.toTimeString().split(' ')[0])
      .lt('scheduled_time', tenMinEnd.toTimeString().split(' ')[0]);

    if (tenMinSessions) {
      for (const session of tenMinSessions) {
        await sendReminder(session, 'ten_min_before');
        results.ten_min_before++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: now.toISOString(),
        results,
        message: `Envoyé: ${results.day_before} rappels J-1, ${results.hour_before} rappels H-1, ${results.ten_min_before} rappels 10min`,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error sending reminders:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

/**
 * Send reminder notifications to squad members
 */
async function sendReminder(
  session: any,
  type: 'day_before' | 'hour_before' | 'ten_min_before'
) {
  // Get squad members who have RSVP'd yes
  const { data: rsvps } = await supabase
    .from('session_rsvps')
    .select('user_id')
    .eq('session_id', session.id)
    .eq('response', 'yes');

  if (!rsvps || rsvps.length === 0) return;

  const messages = {
    day_before: {
      title: `Session demain !`,
      message: `${session.title} avec ${session.squad.name} demain à ${session.scheduled_time}`,
    },
    hour_before: {
      title: `Session dans 1h !`,
      message: `${session.title} commence dans 1 heure. Préparez-vous !`,
    },
    ten_min_before: {
      title: `C'est l'heure ! 🎮`,
      message: `${session.title} commence dans 10 minutes. Check-in obligatoire !`,
    },
  };

  const { title, message } = messages[type];

  // Create notifications for each user
  const notifications = rsvps.map((rsvp) => ({
    user_id: rsvp.user_id,
    type: `session_reminder_${type}`,
    title,
    message,
    data: {
      session_id: session.id,
      squad_id: session.squad_id,
      scheduled_date: session.scheduled_date,
      scheduled_time: session.scheduled_time,
    },
    created_at: new Date().toISOString(),
  }));

  await supabase.from('notifications').insert(notifications);

  console.log(`✅ Sent ${type} reminder for session ${session.id} to ${rsvps.length} users`);
}
