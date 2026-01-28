/**
 * Discord Webhook Integration
 *
 * Sends formatted embeds to Discord webhooks when events happen in Squad Planner.
 * Supports session creation, updates, RSVPs, and member events.
 */

import { supabase } from '@/lib/supabase';

// Discord embed colors
const COLORS = {
  primary: 0xEF9C1E,    // Squad Planner orange
  success: 0x22C55E,    // Green
  warning: 0xF59E0B,    // Amber
  error: 0xEF4444,      // Red
  info: 0x3B82F6,       // Blue
  discord: 0x5865F2,    // Discord blurple
};

// Event types that can trigger webhooks
export type WebhookEventType =
  | 'session_created'
  | 'session_updated'
  | 'session_cancelled'
  | 'session_reminder'
  | 'rsvp_submitted'
  | 'member_joined'
  | 'member_left';

interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  footer?: {
    text: string;
    icon_url?: string;
  };
  timestamp?: string;
  thumbnail?: {
    url: string;
  };
}

interface DiscordWebhookPayload {
  content?: string;
  username?: string;
  avatar_url?: string;
  embeds?: DiscordEmbed[];
}

interface SessionData {
  id: string;
  title: string;
  description?: string;
  game?: string;
  scheduled_date: string;
  scheduled_time: string;
  duration?: number;
  squad_id: string;
  squad_name?: string;
  creator_name?: string;
  confirmed_count?: number;
  max_players?: number;
}

interface RSVPData {
  user_name: string;
  response: 'yes' | 'no' | 'maybe';
  session_title: string;
}

interface MemberData {
  user_name: string;
  squad_name: string;
  role?: string;
}

/**
 * Get all active webhooks for a squad that listen for a specific event
 */
async function getWebhooksForEvent(squadId: string, eventType: WebhookEventType): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('webhooks')
      .select('url, events')
      .eq('squad_id', squadId)
      .eq('is_active', true);

    if (error) {
      console.error('[Discord Webhook] Error fetching webhooks:', error);
      return [];
    }

    // Filter webhooks that listen for this event type
    return (data || [])
      .filter(webhook => webhook.events?.includes(eventType))
      .map(webhook => webhook.url);
  } catch (error) {
    console.error('[Discord Webhook] Error:', error);
    return [];
  }
}

/**
 * Send a payload to a Discord webhook
 */
async function sendToWebhook(webhookUrl: string, payload: DiscordWebhookPayload): Promise<boolean> {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'Squad Planner',
        avatar_url: 'https://squadplanner.app/logo.png',
        ...payload,
      }),
    });

    if (!response.ok) {
      console.error('[Discord Webhook] Failed to send:', response.status, response.statusText);
      return false;
    }

    console.log('[Discord Webhook] Message sent successfully');
    return true;
  } catch (error) {
    console.error('[Discord Webhook] Error sending:', error);
    return false;
  }
}

/**
 * Format date for display
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

/**
 * Format time for display
 */
function formatTime(timeStr: string): string {
  return timeStr.substring(0, 5); // HH:MM
}

/**
 * Create embed for session created event
 */
function createSessionCreatedEmbed(session: SessionData): DiscordEmbed {
  const fields = [
    {
      name: '📅 Date',
      value: formatDate(session.scheduled_date),
      inline: true,
    },
    {
      name: '🕐 Heure',
      value: formatTime(session.scheduled_time),
      inline: true,
    },
  ];

  if (session.game) {
    fields.push({
      name: '🎮 Jeu',
      value: session.game,
      inline: true,
    });
  }

  if (session.duration) {
    fields.push({
      name: '⏱️ Durée',
      value: `${session.duration} min`,
      inline: true,
    });
  }

  if (session.max_players) {
    fields.push({
      name: '👥 Joueurs',
      value: `${session.confirmed_count || 0}/${session.max_players}`,
      inline: true,
    });
  }

  return {
    title: `🎮 Nouvelle Session : ${session.title}`,
    description: session.description || 'Une nouvelle session a été créée !',
    color: COLORS.primary,
    fields,
    footer: {
      text: `Créée par ${session.creator_name || 'un membre'} • ${session.squad_name || 'Squad Planner'}`,
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create embed for session updated event
 */
function createSessionUpdatedEmbed(session: SessionData): DiscordEmbed {
  return {
    title: `📝 Session Modifiée : ${session.title}`,
    description: 'Les détails de la session ont été mis à jour.',
    color: COLORS.info,
    fields: [
      {
        name: '📅 Date',
        value: formatDate(session.scheduled_date),
        inline: true,
      },
      {
        name: '🕐 Heure',
        value: formatTime(session.scheduled_time),
        inline: true,
      },
      {
        name: '👥 Confirmés',
        value: `${session.confirmed_count || 0} joueur(s)`,
        inline: true,
      },
    ],
    footer: {
      text: session.squad_name || 'Squad Planner',
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create embed for session cancelled event
 */
function createSessionCancelledEmbed(session: SessionData): DiscordEmbed {
  return {
    title: `❌ Session Annulée : ${session.title}`,
    description: 'Cette session a été annulée.',
    color: COLORS.error,
    fields: [
      {
        name: '📅 Date prévue',
        value: formatDate(session.scheduled_date),
        inline: true,
      },
      {
        name: '🕐 Heure prévue',
        value: formatTime(session.scheduled_time),
        inline: true,
      },
    ],
    footer: {
      text: session.squad_name || 'Squad Planner',
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create embed for session reminder
 */
function createSessionReminderEmbed(session: SessionData, reminderType: '24h' | '1h'): DiscordEmbed {
  const emoji = reminderType === '24h' ? '📢' : '⏰';
  const timeText = reminderType === '24h' ? 'dans 24 heures' : 'dans 1 heure';

  return {
    title: `${emoji} Rappel : ${session.title}`,
    description: `La session commence ${timeText} !`,
    color: COLORS.warning,
    fields: [
      {
        name: '📅 Date',
        value: formatDate(session.scheduled_date),
        inline: true,
      },
      {
        name: '🕐 Heure',
        value: formatTime(session.scheduled_time),
        inline: true,
      },
      {
        name: '👥 Confirmés',
        value: `${session.confirmed_count || 0} joueur(s)`,
        inline: true,
      },
    ],
    footer: {
      text: session.squad_name || 'Squad Planner',
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create embed for RSVP event
 */
function createRSVPEmbed(rsvp: RSVPData): DiscordEmbed {
  const responseMap = {
    yes: { emoji: '✅', text: 'sera présent', color: COLORS.success },
    no: { emoji: '❌', text: 'ne sera pas présent', color: COLORS.error },
    maybe: { emoji: '❓', text: 'hésite encore', color: COLORS.warning },
  };

  const response = responseMap[rsvp.response];

  return {
    title: `${response.emoji} Réponse RSVP`,
    description: `**${rsvp.user_name}** ${response.text} pour la session "${rsvp.session_title}"`,
    color: response.color,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create embed for member joined event
 */
function createMemberJoinedEmbed(member: MemberData): DiscordEmbed {
  return {
    title: '👋 Nouveau Membre',
    description: `**${member.user_name}** a rejoint le squad !`,
    color: COLORS.success,
    fields: member.role ? [
      {
        name: 'Rôle',
        value: member.role,
        inline: true,
      },
    ] : undefined,
    footer: {
      text: member.squad_name,
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create embed for member left event
 */
function createMemberLeftEmbed(member: MemberData): DiscordEmbed {
  return {
    title: '👋 Départ',
    description: `**${member.user_name}** a quitté le squad.`,
    color: COLORS.warning,
    footer: {
      text: member.squad_name,
    },
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Trigger webhook for session created event
 */
export async function triggerSessionCreated(squadId: string, session: SessionData): Promise<void> {
  const webhooks = await getWebhooksForEvent(squadId, 'session_created');
  if (webhooks.length === 0) return;

  const embed = createSessionCreatedEmbed(session);
  const payload: DiscordWebhookPayload = {
    content: '🎮 **Nouvelle session de jeu !**',
    embeds: [embed],
  };

  await Promise.all(webhooks.map(url => sendToWebhook(url, payload)));
}

/**
 * Trigger webhook for session updated event
 */
export async function triggerSessionUpdated(squadId: string, session: SessionData): Promise<void> {
  const webhooks = await getWebhooksForEvent(squadId, 'session_updated');
  if (webhooks.length === 0) return;

  const embed = createSessionUpdatedEmbed(session);
  const payload: DiscordWebhookPayload = {
    embeds: [embed],
  };

  await Promise.all(webhooks.map(url => sendToWebhook(url, payload)));
}

/**
 * Trigger webhook for session cancelled event
 */
export async function triggerSessionCancelled(squadId: string, session: SessionData): Promise<void> {
  const webhooks = await getWebhooksForEvent(squadId, 'session_updated');
  if (webhooks.length === 0) return;

  const embed = createSessionCancelledEmbed(session);
  const payload: DiscordWebhookPayload = {
    content: '⚠️ **Session annulée**',
    embeds: [embed],
  };

  await Promise.all(webhooks.map(url => sendToWebhook(url, payload)));
}

/**
 * Trigger webhook for session reminder
 */
export async function triggerSessionReminder(squadId: string, session: SessionData, reminderType: '24h' | '1h'): Promise<void> {
  const webhooks = await getWebhooksForEvent(squadId, 'session_updated');
  if (webhooks.length === 0) return;

  const embed = createSessionReminderEmbed(session, reminderType);
  const payload: DiscordWebhookPayload = {
    content: reminderType === '1h' ? '@here ⏰ **Rappel de session !**' : '📢 **Rappel de session !**',
    embeds: [embed],
  };

  await Promise.all(webhooks.map(url => sendToWebhook(url, payload)));
}

/**
 * Trigger webhook for RSVP event
 */
export async function triggerRSVPSubmitted(squadId: string, rsvp: RSVPData): Promise<void> {
  const webhooks = await getWebhooksForEvent(squadId, 'rsvp_submitted');
  if (webhooks.length === 0) return;

  const embed = createRSVPEmbed(rsvp);
  const payload: DiscordWebhookPayload = {
    embeds: [embed],
  };

  await Promise.all(webhooks.map(url => sendToWebhook(url, payload)));
}

/**
 * Trigger webhook for member joined event
 */
export async function triggerMemberJoined(squadId: string, member: MemberData): Promise<void> {
  const webhooks = await getWebhooksForEvent(squadId, 'member_joined');
  if (webhooks.length === 0) return;

  const embed = createMemberJoinedEmbed(member);
  const payload: DiscordWebhookPayload = {
    embeds: [embed],
  };

  await Promise.all(webhooks.map(url => sendToWebhook(url, payload)));
}

/**
 * Trigger webhook for member left event
 */
export async function triggerMemberLeft(squadId: string, member: MemberData): Promise<void> {
  const webhooks = await getWebhooksForEvent(squadId, 'member_joined');
  if (webhooks.length === 0) return;

  const embed = createMemberLeftEmbed(member);
  const payload: DiscordWebhookPayload = {
    embeds: [embed],
  };

  await Promise.all(webhooks.map(url => sendToWebhook(url, payload)));
}

/**
 * Test webhook connection by sending a test message
 */
export async function testWebhook(webhookUrl: string): Promise<boolean> {
  const payload: DiscordWebhookPayload = {
    content: '✅ **Test réussi !** Squad Planner est maintenant connecté à ce channel.',
    embeds: [
      {
        title: '🎮 Squad Planner',
        description: 'Votre webhook Discord est correctement configuré. Vous recevrez désormais des notifications pour les événements de votre squad.',
        color: COLORS.success,
        fields: [
          {
            name: '📅 Sessions',
            value: 'Création, modification, annulation',
            inline: true,
          },
          {
            name: '✅ RSVPs',
            value: 'Réponses des membres',
            inline: true,
          },
          {
            name: '👥 Membres',
            value: 'Arrivées et départs',
            inline: true,
          },
        ],
        footer: {
          text: 'Squad Planner • Le meilleur ami de ton squad',
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  return sendToWebhook(webhookUrl, payload);
}
