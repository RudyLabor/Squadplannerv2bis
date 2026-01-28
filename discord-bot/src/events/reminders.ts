/**
 * Session Reminders Handler
 *
 * Sends automatic reminders to Discord channels before sessions start.
 * - 24h before: "Rappel demain"
 * - 1h before: "Rappel dans 1 heure"
 * - At start time: "C'est l'heure !"
 */

import { Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js';
import { supabase } from '../index';
import {
  getSessionAttendees,
  wasReminderSent,
  markReminderSent,
  getGuildIdForSquad,
} from '../utils/database';
import { formatDateTime, getRelativeTime } from '../utils/datetime';

interface SessionWithSquad {
  id: string;
  title: string;
  description: string | null;
  squad_id: string;
  scheduled_date: string;
  scheduled_time: string;
  required_players: number;
  squad: {
    name: string;
    game: string;
  };
}

/**
 * Main reminder handler - called every minute by cron
 */
export async function handleSessionReminders(client: Client): Promise<void> {
  const now = new Date();

  // Check for sessions at different intervals
  await checkAndSendReminders(client, now, 1440, 'h24'); // 24 hours = 1440 minutes
  await checkAndSendReminders(client, now, 60, 'h1');    // 1 hour = 60 minutes
  await checkAndSendReminders(client, now, 0, 'h0');     // At start time
}

/**
 * Check for sessions and send reminders
 */
async function checkAndSendReminders(
  client: Client,
  now: Date,
  minutesBefore: number,
  reminderType: 'h24' | 'h1' | 'h0'
): Promise<void> {
  const targetTime = new Date(now.getTime() + minutesBefore * 60000);

  // Format for comparison (truncate to minute)
  const targetDate = targetTime.toISOString().split('T')[0];
  const targetHour = targetTime.getHours();
  const targetMinute = targetTime.getMinutes();
  const targetTimeStr = `${String(targetHour).padStart(2, '0')}:${String(targetMinute).padStart(2, '0')}`;

  // Get sessions scheduled at the target time
  const { data: sessions, error } = await supabase
    .from('sessions')
    .select(`
      id,
      title,
      description,
      squad_id,
      scheduled_date,
      scheduled_time,
      required_players,
      squad:squads(name, game)
    `)
    .eq('scheduled_date', targetDate)
    .eq('scheduled_time', targetTimeStr)
    .in('status', ['pending', 'confirmed']);

  if (error || !sessions || sessions.length === 0) {
    return;
  }

  for (const session of sessions as unknown as SessionWithSquad[]) {
    try {
      // Check if reminder was already sent
      const alreadySent = await wasReminderSent(session.id, reminderType);
      if (alreadySent) continue;

      // Send the reminder
      await sendReminder(client, session, reminderType);

      // Mark as sent
      await markReminderSent(session.id, reminderType);

      console.log(`📢 Reminder ${reminderType} sent for session: ${session.title}`);
    } catch (err) {
      console.error(`Error sending reminder for session ${session.id}:`, err);
    }
  }
}

/**
 * Send a reminder to the Discord channel
 */
async function sendReminder(
  client: Client,
  session: SessionWithSquad,
  reminderType: 'h24' | 'h1' | 'h0'
): Promise<void> {
  // Get the Discord guild linked to this squad
  const guildId = await getGuildIdForSquad(session.squad_id);
  if (!guildId) {
    console.log(`No Discord guild linked to squad ${session.squad_id}`);
    return;
  }

  const guild = client.guilds.cache.get(guildId);
  if (!guild) {
    console.log(`Guild ${guildId} not found in cache`);
    return;
  }

  // Find the appropriate channel (look for a gaming/sessions channel or use default)
  let channel = guild.channels.cache.find(
    (ch) =>
      ch.isTextBased() &&
      (ch.name.includes('session') ||
        ch.name.includes('gaming') ||
        ch.name.includes('squad') ||
        ch.name === 'general')
  ) as TextChannel;

  if (!channel) {
    channel = guild.channels.cache.find((ch) => ch.isTextBased()) as TextChannel;
  }

  if (!channel) {
    console.log(`No suitable channel found in guild ${guildId}`);
    return;
  }

  // Get attendees for mentions
  const attendees = await getSessionAttendees(session.id);
  const mentions = attendees
    .filter((a) => a.discord_id)
    .map((a) => `<@${a.discord_id}>`)
    .join(' ');

  // Build embed based on reminder type
  const embed = buildReminderEmbed(session, reminderType);

  // Add RSVP buttons for h24 and h1 reminders
  const components =
    reminderType !== 'h0'
      ? [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId(`rsvp_yes:${session.id}`)
              .setLabel('✅ Je viens')
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId(`rsvp_maybe:${session.id}`)
              .setLabel('🤔 Peut-être')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId(`rsvp_no:${session.id}`)
              .setLabel('❌ Absent')
              .setStyle(ButtonStyle.Danger)
          ),
        ]
      : [];

  // Send the reminder
  await channel.send({
    content: reminderType === 'h0' && mentions ? `🎮 ${mentions}` : undefined,
    embeds: [embed],
    components,
  });
}

/**
 * Build the reminder embed based on type
 */
function buildReminderEmbed(session: SessionWithSquad, reminderType: 'h24' | 'h1' | 'h0'): EmbedBuilder {
  const colors = {
    h24: 0x3B82F6, // Blue
    h1: 0xF59E0B,  // Orange
    h0: 0x22C55E,  // Green
  };

  const titles = {
    h24: '📅 Rappel - Session demain !',
    h1: '⏰ Rappel - Session dans 1 heure !',
    h0: '🎮 C\'est l\'heure de jouer !',
  };

  const embed = new EmbedBuilder()
    .setColor(colors[reminderType])
    .setTitle(titles[reminderType])
    .setDescription(`**${session.title}**\n${session.description || ''}`)
    .addFields(
      {
        name: '📅 Date & Heure',
        value: formatDateTime(session.scheduled_date, session.scheduled_time),
        inline: true,
      },
      {
        name: '🎯 Jeu',
        value: session.squad?.game || 'Non défini',
        inline: true,
      },
      {
        name: '👥 Squad',
        value: session.squad?.name || 'Unknown',
        inline: true,
      }
    )
    .setFooter({
      text: 'Squad Planner',
      iconURL: 'https://squadplanner.app/logo.png',
    })
    .setTimestamp();

  if (reminderType === 'h0') {
    embed.addFields({
      name: '🔊 Action',
      value: 'Rejoins le vocal et prépare-toi à jouer !',
      inline: false,
    });
  }

  return embed;
}
