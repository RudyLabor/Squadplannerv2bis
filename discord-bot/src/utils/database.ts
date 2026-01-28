/**
 * Database Utilities
 *
 * Helper functions for common Supabase queries.
 */

import { supabase } from '../index';

/**
 * Get Squad Planner user linked to a Discord ID
 */
export async function getLinkedUser(discordId: string): Promise<{ id: string } | null> {
  const { data, error } = await supabase
    .from('discord_links')
    .select('user_id')
    .eq('discord_id', discordId)
    .single();

  if (error || !data) {
    // Fallback: check if user has discord_id in profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('discord_id', discordId)
      .single();

    if (profile) {
      return { id: profile.id };
    }

    return null;
  }

  return { id: data.user_id };
}

/**
 * Get Squad linked to a Discord Guild
 */
export async function getSquadByDiscordGuild(guildId: string): Promise<{ id: string; name: string } | null> {
  const { data, error } = await supabase
    .from('discord_guild_links')
    .select('squad_id, squads(id, name)')
    .eq('guild_id', guildId)
    .single();

  if (error || !data) {
    return null;
  }

  const squad = data.squads as any;
  return {
    id: squad?.id || data.squad_id,
    name: squad?.name || 'Unknown Squad',
  };
}

/**
 * Get Discord webhook URL for a squad
 */
export async function getSquadWebhook(squadId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('webhooks')
    .select('url')
    .eq('squad_id', squadId)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return null;
  }

  return data.url;
}

/**
 * Get all users who RSVP'd yes to a session
 */
export async function getSessionAttendees(sessionId: string): Promise<Array<{
  user_id: string;
  discord_id: string | null;
  username: string;
}>> {
  const { data, error } = await supabase
    .from('session_rsvps')
    .select(`
      user_id,
      user:profiles!user_id(
        username,
        display_name,
        discord_id
      )
    `)
    .eq('session_id', sessionId)
    .eq('response', 'yes');

  if (error || !data) {
    return [];
  }

  return data.map((rsvp) => {
    const user = rsvp.user as any;
    return {
      user_id: rsvp.user_id,
      discord_id: user?.discord_id || null,
      username: user?.display_name || user?.username || 'Unknown',
    };
  });
}

/**
 * Get upcoming sessions that need reminders
 */
export async function getSessionsNeedingReminders(minutesBefore: number): Promise<Array<{
  id: string;
  title: string;
  squad_id: string;
  scheduled_date: string;
  scheduled_time: string;
}>> {
  const now = new Date();
  const targetTime = new Date(now.getTime() + minutesBefore * 60000);

  // Format for comparison
  const targetDate = targetTime.toISOString().split('T')[0];
  const targetTimeStr = targetTime.toTimeString().slice(0, 5);

  // Get sessions scheduled at the target time
  const { data, error } = await supabase
    .from('sessions')
    .select('id, title, squad_id, scheduled_date, scheduled_time')
    .eq('scheduled_date', targetDate)
    .eq('scheduled_time', targetTimeStr)
    .eq('status', 'pending');

  if (error || !data) {
    return [];
  }

  return data;
}

/**
 * Mark a reminder as sent
 */
export async function markReminderSent(sessionId: string, reminderType: 'h24' | 'h1' | 'h0'): Promise<void> {
  await supabase.from('session_reminders_sent').insert({
    session_id: sessionId,
    reminder_type: reminderType,
    sent_at: new Date().toISOString(),
  });
}

/**
 * Check if a reminder was already sent
 */
export async function wasReminderSent(sessionId: string, reminderType: 'h24' | 'h1' | 'h0'): Promise<boolean> {
  const { data } = await supabase
    .from('session_reminders_sent')
    .select('id')
    .eq('session_id', sessionId)
    .eq('reminder_type', reminderType)
    .single();

  return !!data;
}

/**
 * Get Discord guild ID linked to a squad
 */
export async function getGuildIdForSquad(squadId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('discord_guild_links')
    .select('guild_id')
    .eq('squad_id', squadId)
    .single();

  if (error || !data) {
    return null;
  }

  return data.guild_id;
}
