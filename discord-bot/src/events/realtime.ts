/**
 * Supabase Realtime Events Handler
 *
 * Listens to database changes and sends Discord notifications.
 */

import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import { supabase } from '../index';
import { getGuildIdForSquad, getSquadWebhook } from '../utils/database';
import { formatDateTime } from '../utils/datetime';

/**
 * Setup real-time listeners for Supabase tables
 */
export async function setupRealtimeListeners(client: Client): Promise<void> {
  console.log('🔌 Setting up Supabase realtime listeners...');

  // Listen for new sessions
  supabase
    .channel('sessions_channel')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'sessions' },
      async (payload) => {
        console.log('📥 New session created:', payload.new.id);
        await handleNewSession(client, payload.new as any);
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'sessions' },
      async (payload) => {
        // Check if session was cancelled
        if (payload.new.status === 'cancelled' && payload.old.status !== 'cancelled') {
          console.log('❌ Session cancelled:', payload.new.id);
          await handleSessionCancelled(client, payload.new as any);
        }
      }
    )
    .subscribe((status) => {
      console.log(`📡 Sessions channel status: ${status}`);
    });

  // Listen for RSVPs
  supabase
    .channel('rsvps_channel')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'session_rsvps' },
      async (payload) => {
        console.log('📥 New RSVP:', payload.new.id);
        await handleNewRSVP(client, payload.new as any);
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'session_rsvps' },
      async (payload) => {
        // Only notify if response changed
        if (payload.new.response !== payload.old.response) {
          await handleNewRSVP(client, payload.new as any);
        }
      }
    )
    .subscribe((status) => {
      console.log(`📡 RSVPs channel status: ${status}`);
    });

  // Listen for new squad members
  supabase
    .channel('members_channel')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'squad_members' },
      async (payload) => {
        console.log('📥 New squad member:', payload.new.user_id);
        await handleNewMember(client, payload.new as any);
      }
    )
    .subscribe((status) => {
      console.log(`📡 Members channel status: ${status}`);
    });

  console.log('✅ Realtime listeners setup complete');
}

/**
 * Handle new session notification
 */
async function handleNewSession(client: Client, session: any): Promise<void> {
  try {
    // Get full session details
    const { data: fullSession } = await supabase
      .from('sessions')
      .select(`
        *,
        squad:squads(name, game),
        creator:profiles!proposed_by(username, display_name, discord_id)
      `)
      .eq('id', session.id)
      .single();

    if (!fullSession) return;

    const guildId = await getGuildIdForSquad(fullSession.squad_id);
    if (!guildId) return;

    const guild = client.guilds.cache.get(guildId);
    if (!guild) return;

    const channel = findGamingChannel(guild);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(0xEF9C1E)
      .setTitle('🎮 Nouvelle session créée !')
      .setDescription(`**${fullSession.title}**\n${fullSession.description || ''}`)
      .addFields(
        {
          name: '📅 Date',
          value: formatDateTime(fullSession.scheduled_date, fullSession.scheduled_time),
          inline: true,
        },
        {
          name: '🎯 Jeu',
          value: (fullSession.squad as any)?.game || 'Non défini',
          inline: true,
        },
        {
          name: '👤 Créée par',
          value: (fullSession.creator as any)?.display_name || (fullSession.creator as any)?.username || 'Unknown',
          inline: true,
        }
      )
      .setFooter({ text: 'Squad Planner • Réponds avec /rsvp' })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  } catch (err) {
    console.error('Error handling new session:', err);
  }
}

/**
 * Handle session cancelled notification
 */
async function handleSessionCancelled(client: Client, session: any): Promise<void> {
  try {
    const { data: fullSession } = await supabase
      .from('sessions')
      .select('*, squad:squads(name)')
      .eq('id', session.id)
      .single();

    if (!fullSession) return;

    const guildId = await getGuildIdForSquad(fullSession.squad_id);
    if (!guildId) return;

    const guild = client.guilds.cache.get(guildId);
    if (!guild) return;

    const channel = findGamingChannel(guild);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(0xEF4444)
      .setTitle('❌ Session annulée')
      .setDescription(`**${fullSession.title}** a été annulée.`)
      .addFields({
        name: '📅 Date prévue',
        value: formatDateTime(fullSession.scheduled_date, fullSession.scheduled_time),
      })
      .setTimestamp();

    if (fullSession.cancellation_reason) {
      embed.addFields({
        name: '📝 Raison',
        value: fullSession.cancellation_reason,
      });
    }

    await channel.send({ embeds: [embed] });
  } catch (err) {
    console.error('Error handling session cancelled:', err);
  }
}

/**
 * Handle new RSVP notification
 */
async function handleNewRSVP(client: Client, rsvp: any): Promise<void> {
  try {
    // Get session and user details
    const { data: session } = await supabase
      .from('sessions')
      .select('title, squad_id')
      .eq('id', rsvp.session_id)
      .single();

    const { data: user } = await supabase
      .from('profiles')
      .select('username, display_name, discord_id')
      .eq('id', rsvp.user_id)
      .single();

    if (!session || !user) return;

    const guildId = await getGuildIdForSquad(session.squad_id);
    if (!guildId) return;

    const guild = client.guilds.cache.get(guildId);
    if (!guild) return;

    const channel = findGamingChannel(guild);
    if (!channel) return;

    const responseEmoji = {
      yes: '✅',
      no: '❌',
      maybe: '🤔',
    };

    const responseText = {
      yes: 'sera présent(e)',
      no: 'sera absent(e)',
      maybe: 'n\'est pas sûr(e)',
    };

    const response = rsvp.response as 'yes' | 'no' | 'maybe';
    const userName = user.display_name || user.username || 'Un membre';
    const userMention = user.discord_id ? `<@${user.discord_id}>` : userName;

    // Simple notification message
    await channel.send({
      content: `${responseEmoji[response]} ${userMention} ${responseText[response]} pour **${session.title}**`,
    });
  } catch (err) {
    console.error('Error handling new RSVP:', err);
  }
}

/**
 * Handle new squad member notification
 */
async function handleNewMember(client: Client, member: any): Promise<void> {
  try {
    // Get member and squad details
    const { data: user } = await supabase
      .from('profiles')
      .select('username, display_name, discord_id')
      .eq('id', member.user_id)
      .single();

    const { data: squad } = await supabase
      .from('squads')
      .select('name')
      .eq('id', member.squad_id)
      .single();

    if (!user || !squad) return;

    const guildId = await getGuildIdForSquad(member.squad_id);
    if (!guildId) return;

    const guild = client.guilds.cache.get(guildId);
    if (!guild) return;

    const channel = findGamingChannel(guild);
    if (!channel) return;

    const userName = user.display_name || user.username || 'Un nouveau membre';
    const userMention = user.discord_id ? `<@${user.discord_id}>` : userName;

    const embed = new EmbedBuilder()
      .setColor(0x22C55E)
      .setTitle('👋 Nouveau membre !')
      .setDescription(`${userMention} a rejoint **${squad.name}**`)
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  } catch (err) {
    console.error('Error handling new member:', err);
  }
}

/**
 * Find the best channel for gaming notifications
 */
function findGamingChannel(guild: any): TextChannel | null {
  // Priority: session > gaming > squad > general > first text channel
  const channelPriority = ['session', 'gaming', 'squad', 'general'];

  for (const keyword of channelPriority) {
    const channel = guild.channels.cache.find(
      (ch: any) => ch.isTextBased() && ch.name.toLowerCase().includes(keyword)
    );
    if (channel) return channel as TextChannel;
  }

  // Fallback to first text channel
  return guild.channels.cache.find((ch: any) => ch.isTextBased()) as TextChannel || null;
}
