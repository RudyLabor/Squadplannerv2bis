/**
 * Squad Planner Discord Bot
 *
 * Main entry point for the Discord bot.
 * Handles slash commands, session reminders, and real-time notifications.
 */

import { Client, GatewayIntentBits, Collection, Events } from 'discord.js';
import { config } from 'dotenv';
import * as cron from 'node-cron';
import { createClient } from '@supabase/supabase-js';

// Import commands
import { sessionCommand } from './commands/session';
import { rsvpCommand } from './commands/rsvp';
import { squadCommand } from './commands/squad';
import { retardCommand } from './commands/retard';
import { helpCommand } from './commands/help';
import { profilCommand } from './commands/profil';

// Import event handlers
import { handleSessionReminders } from './events/reminders';
import { setupRealtimeListeners } from './events/realtime';

// Load environment variables
config();

// Validate required environment variables
const requiredEnvVars = ['DISCORD_TOKEN', 'DISCORD_CLIENT_ID', 'SUPABASE_URL', 'SUPABASE_SERVICE_KEY'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Initialize Supabase client (server-side with service key)
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Initialize Discord client
// Note: GuildMembers requires Privileged Intent in Discord Developer Portal
// For now, using only non-privileged intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    // GatewayIntentBits.GuildMembers, // Requires privileged intent
    // GatewayIntentBits.GuildVoiceStates, // Optional
  ],
});

// Store commands in a collection
const commands = new Collection<string, any>();
commands.set('session', sessionCommand);
commands.set('rsvp', rsvpCommand);
commands.set('squad', squadCommand);
commands.set('retard', retardCommand);
commands.set('help', helpCommand);
commands.set('profil', profilCommand);

// Bot ready event
client.once(Events.ClientReady, async (readyClient) => {
  console.log(`\n🤖 Squad Planner Bot is online!`);
  console.log(`📊 Logged in as: ${readyClient.user.tag}`);
  console.log(`🌐 Serving ${readyClient.guilds.cache.size} server(s)`);
  console.log(`⚡ ${commands.size} slash commands loaded\n`);

  // Set bot status
  readyClient.user.setActivity('🎮 /session pour jouer', { type: 0 });

  // Setup real-time listeners for Supabase
  await setupRealtimeListeners(client);

  // Setup cron jobs for session reminders
  // Run every minute to check for upcoming sessions
  cron.schedule('* * * * *', async () => {
    await handleSessionReminders(client);
  });

  console.log('✅ Reminders scheduler started (checks every minute)');
});

// Handle slash command interactions
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) {
    console.warn(`⚠️ Unknown command: ${interaction.commandName}`);
    return;
  }

  try {
    console.log(`📥 Command /${interaction.commandName} by ${interaction.user.tag}`);
    await command.execute(interaction);
  } catch (error) {
    console.error(`❌ Error executing /${interaction.commandName}:`, error);

    const errorMessage = {
      content: '❌ Une erreur est survenue. Réessaie plus tard.',
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

// Handle button interactions (for RSVP buttons, etc.)
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  const [action, sessionId] = interaction.customId.split(':');

  if (action === 'rsvp_yes' || action === 'rsvp_no' || action === 'rsvp_maybe') {
    const response = action.replace('rsvp_', '') as 'yes' | 'no' | 'maybe';

    try {
      // Get user's linked Squad Planner account
      const { data: userLink } = await supabase
        .from('discord_links')
        .select('user_id')
        .eq('discord_id', interaction.user.id)
        .single();

      if (!userLink) {
        await interaction.reply({
          content: '⚠️ Ton compte Discord n\'est pas lié à Squad Planner. Utilise `/profil link` pour le lier.',
          ephemeral: true,
        });
        return;
      }

      // Submit RSVP
      const { error } = await supabase
        .from('session_rsvps')
        .upsert({
          session_id: sessionId,
          user_id: userLink.user_id,
          response,
        }, {
          onConflict: 'session_id,user_id',
        });

      if (error) throw error;

      const responseText = {
        yes: '✅ Présence confirmée !',
        no: '❌ Absence notée.',
        maybe: '🤔 Peut-être noté.',
      };

      await interaction.reply({
        content: responseText[response],
        ephemeral: true,
      });

    } catch (error) {
      console.error('RSVP button error:', error);
      await interaction.reply({
        content: '❌ Erreur lors de l\'enregistrement de ta réponse.',
        ephemeral: true,
      });
    }
  }
});

// Error handling
client.on(Events.Error, (error) => {
  console.error('❌ Discord client error:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled promise rejection:', error);
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);

console.log('🚀 Starting Squad Planner Discord Bot...');
