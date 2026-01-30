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

  // Check for latecomers (progressive reminders at T+5, T+10, T+15)
  await handleLatecomerReminders(client);
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
  // For h0 (session start), use the enhanced ping function
  if (reminderType === 'h0') {
    await pingAllConfirmedParticipants(client, session);
    return;
  }

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

  // Get attendees for mentions (only those who said yes or maybe)
  const attendees = await getSessionAttendees(session.id);
  const mentions = attendees
    .filter((a) => a.discord_id && (a.response === 'yes' || a.response === 'maybe'))
    .map((a) => `<@${a.discord_id}>`)
    .join(' ');

  // Build embed based on reminder type
  const embed = buildReminderEmbed(session, reminderType);

  // Add RSVP buttons for h24 and h1 reminders
  const components = [
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
  ];

  // Send the reminder
  await channel.send({
    content: mentions ? `📢 ${mentions}` : undefined,
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

// ============================================================================
// PHASE 3 FEATURES: Auto Voice, Ping, Presence, Latecomers
// ============================================================================

/**
 * Auto create/open voice channel when session starts
 */
export async function handleAutoVoiceChannel(client: Client, session: SessionWithSquad): Promise<string | null> {
  try {
    const guildId = await getGuildIdForSquad(session.squad_id);
    if (!guildId) return null;

    const guild = client.guilds.cache.get(guildId);
    if (!guild) return null;

    // Check if voice channel already exists
    const existingChannel = guild.channels.cache.find(
      (ch) => ch.isVoiceBased() && ch.name.toLowerCase().includes(session.title.toLowerCase().substring(0, 20))
    );

    if (existingChannel) {
      console.log(`Voice channel already exists: ${existingChannel.name}`);
      return existingChannel.id;
    }

    // Get category (look for gaming/session category)
    const category = guild.channels.cache.find(
      (ch) => ch.type === 4 && // CategoryChannel
        (ch.name.toLowerCase().includes('gaming') ||
         ch.name.toLowerCase().includes('session') ||
         ch.name.toLowerCase().includes('vocal'))
    );

    // Create new voice channel
    const channelName = `🎮 ${session.title}`.substring(0, 100);
    const voiceChannel = await guild.channels.create({
      name: channelName,
      type: 2, // VoiceChannel
      parent: category?.id,
      reason: `Auto-created for Squad Planner session: ${session.title}`,
    });

    console.log(`✅ Created voice channel: ${voiceChannel.name}`);

    // Store channel ID for cleanup later
    await supabase
      .from('sessions')
      .update({ discord_voice_channel_id: voiceChannel.id })
      .eq('id', session.id);

    return voiceChannel.id;
  } catch (error) {
    console.error('[Auto Voice] Error creating voice channel:', error);
    return null;
  }
}

/**
 * Ping all confirmed participants at session start
 */
export async function pingAllConfirmedParticipants(
  client: Client,
  session: SessionWithSquad
): Promise<void> {
  try {
    const guildId = await getGuildIdForSquad(session.squad_id);
    if (!guildId) return;

    const guild = client.guilds.cache.get(guildId);
    if (!guild) return;

    // Get confirmed attendees
    const attendees = await getSessionAttendees(session.id);
    const confirmedAttendees = attendees.filter(a => a.response === 'yes' && a.discord_id);

    if (confirmedAttendees.length === 0) {
      console.log('No confirmed attendees with Discord IDs');
      return;
    }

    // Create mentions
    const mentions = confirmedAttendees.map(a => `<@${a.discord_id}>`).join(' ');

    // Find channel
    const channel = guild.channels.cache.find(
      (ch) => ch.isTextBased() &&
        (ch.name.includes('session') || ch.name.includes('gaming') || ch.name === 'general')
    ) as TextChannel;

    if (!channel) return;

    // Create voice channel first
    const voiceChannelId = await handleAutoVoiceChannel(client, session);
    const voiceLink = voiceChannelId ? `\n🔊 Rejoins le salon: <#${voiceChannelId}>` : '';

    // Send ping message
    const embed = new EmbedBuilder()
      .setColor(0x22C55E)
      .setTitle('🎮 Session en cours !')
      .setDescription(`**${session.title}** commence maintenant !${voiceLink}`)
      .addFields(
        { name: '👥 Participants confirmés', value: `${confirmedAttendees.length} joueur(s)`, inline: true },
        { name: '🎯 Jeu', value: session.squad?.game || 'Non défini', inline: true }
      )
      .setFooter({ text: 'Squad Planner • Bonne partie !' })
      .setTimestamp();

    await channel.send({
      content: `🚀 **C'est l'heure !** ${mentions}`,
      embeds: [embed],
    });

    console.log(`✅ Pinged ${confirmedAttendees.length} confirmed participants`);
  } catch (error) {
    console.error('[Ping All] Error:', error);
  }
}

/**
 * Track presence - who joined voice channel
 */
export async function trackPresence(
  client: Client,
  sessionId: string
): Promise<{ present: string[]; absent: string[] }> {
  try {
    // Get session details
    const { data: session, error } = await supabase
      .from('sessions')
      .select('discord_voice_channel_id, squad_id')
      .eq('id', sessionId)
      .single();

    if (error || !session?.discord_voice_channel_id) {
      return { present: [], absent: [] };
    }

    const guildId = await getGuildIdForSquad(session.squad_id);
    if (!guildId) return { present: [], absent: [] };

    const guild = client.guilds.cache.get(guildId);
    if (!guild) return { present: [], absent: [] };

    const voiceChannel = guild.channels.cache.get(session.discord_voice_channel_id);
    if (!voiceChannel || !voiceChannel.isVoiceBased()) {
      return { present: [], absent: [] };
    }

    // Get confirmed attendees
    const attendees = await getSessionAttendees(sessionId);
    const confirmedAttendees = attendees.filter(a => a.response === 'yes' && a.discord_id);

    // Check who is in voice channel
    const membersInVoice = voiceChannel.members.map(m => m.id);

    const present: string[] = [];
    const absent: string[] = [];

    confirmedAttendees.forEach(attendee => {
      if (membersInVoice.includes(attendee.discord_id!)) {
        present.push(attendee.discord_id!);
      } else {
        absent.push(attendee.discord_id!);
      }
    });

    return { present, absent };
  } catch (error) {
    console.error('[Track Presence] Error:', error);
    return { present: [], absent: [] };
  }
}

/**
 * Send progressive reminders to latecomers
 * Called at: T+5min, T+10min, T+15min
 */
export async function handleLatecomerReminders(client: Client): Promise<void> {
  const now = new Date();

  // Check sessions that started 5, 10, or 15 minutes ago
  const intervals = [5, 10, 15];

  for (const minutesAgo of intervals) {
    const targetTime = new Date(now.getTime() - minutesAgo * 60000);
    const targetDate = targetTime.toISOString().split('T')[0];
    const targetHour = targetTime.getHours();
    const targetMinute = targetTime.getMinutes();
    const targetTimeStr = `${String(targetHour).padStart(2, '0')}:${String(targetMinute).padStart(2, '0')}`;

    // Get sessions that started at this time
    const { data: sessions } = await supabase
      .from('sessions')
      .select(`
        id,
        title,
        squad_id,
        discord_voice_channel_id,
        squad:squads(name)
      `)
      .eq('scheduled_date', targetDate)
      .eq('scheduled_time', targetTimeStr)
      .eq('status', 'confirmed');

    if (!sessions) continue;

    for (const session of sessions) {
      await sendLatecomerReminder(client, session as any, minutesAgo);
    }
  }
}

/**
 * Send reminder to specific latecomers
 */
async function sendLatecomerReminder(
  client: Client,
  session: { id: string; title: string; squad_id: string; discord_voice_channel_id?: string; squad?: { name: string } },
  minutesLate: number
): Promise<void> {
  try {
    const reminderKey = `latecomer_${minutesLate}`;
    const alreadySent = await wasReminderSent(session.id, reminderKey as any);
    if (alreadySent) return;

    const guildId = await getGuildIdForSquad(session.squad_id);
    if (!guildId) return;

    const guild = client.guilds.cache.get(guildId);
    if (!guild) return;

    // Track who is absent
    const { absent } = await trackPresence(client, session.id);

    if (absent.length === 0) {
      console.log(`No latecomers for session ${session.id}`);
      return;
    }

    // Find text channel
    const channel = guild.channels.cache.find(
      (ch) => ch.isTextBased() &&
        (ch.name.includes('session') || ch.name.includes('gaming') || ch.name === 'general')
    ) as TextChannel;

    if (!channel) return;

    // Escalating messages
    const messages = {
      5: { emoji: '⏰', text: 'La session a commencé il y a 5 minutes...' },
      10: { emoji: '😬', text: 'Tu as 10 minutes de retard !' },
      15: { emoji: '🆘', text: 'Tes coéquipiers t\'attendent depuis 15 minutes !' },
    };

    const msg = messages[minutesLate as keyof typeof messages];
    const mentions = absent.map(id => `<@${id}>`).join(' ');

    const voiceLink = session.discord_voice_channel_id
      ? `\n🔊 Rejoins vite: <#${session.discord_voice_channel_id}>`
      : '';

    const embed = new EmbedBuilder()
      .setColor(minutesLate >= 15 ? 0xEF4444 : minutesLate >= 10 ? 0xF59E0B : 0x3B82F6)
      .setTitle(`${msg.emoji} Rappel aux retardataires`)
      .setDescription(`${msg.text}${voiceLink}`)
      .addFields(
        { name: '🎮 Session', value: session.title, inline: true },
        { name: '⏱️ Retard', value: `${minutesLate} minutes`, inline: true }
      )
      .setFooter({ text: 'Squad Planner' })
      .setTimestamp();

    await channel.send({
      content: mentions,
      embeds: [embed],
    });

    await markReminderSent(session.id, reminderKey as any);
    console.log(`📢 Latecomer reminder (${minutesLate}min) sent for session: ${session.title}`);
  } catch (error) {
    console.error('[Latecomer Reminder] Error:', error);
  }
}
