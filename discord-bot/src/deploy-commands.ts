/**
 * Deploy Slash Commands
 *
 * This script registers all slash commands with Discord.
 * Run: npm run deploy-commands
 */

import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';

// Import command definitions
import { sessionCommand } from './commands/session';
import { rsvpCommand } from './commands/rsvp';
import { squadCommand } from './commands/squad';
import { retardCommand } from './commands/retard';
import { helpCommand } from './commands/help';
import { profilCommand } from './commands/profil';

// Load environment variables
config();

const commands = [
  sessionCommand.data.toJSON(),
  rsvpCommand.data.toJSON(),
  squadCommand.data.toJSON(),
  retardCommand.data.toJSON(),
  helpCommand.data.toJSON(),
  profilCommand.data.toJSON(),
];

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

async function deployCommands() {
  try {
    console.log('🚀 Starting slash commands deployment...\n');
    console.log(`📋 Commands to register: ${commands.length}`);
    commands.forEach((cmd) => console.log(`   • /${cmd.name}`));
    console.log('');

    // If GUILD_ID is provided, deploy to that guild only (faster, for testing)
    // Otherwise, deploy globally (takes up to 1 hour to propagate)
    if (process.env.DISCORD_GUILD_ID) {
      console.log(`🎯 Deploying to test guild: ${process.env.DISCORD_GUILD_ID}`);

      const data = await rest.put(
        Routes.applicationGuildCommands(
          process.env.DISCORD_CLIENT_ID!,
          process.env.DISCORD_GUILD_ID
        ),
        { body: commands }
      );

      console.log(`\n✅ Successfully deployed ${(data as any[]).length} commands to test guild!`);
      console.log('   Commands are available immediately.\n');
    } else {
      console.log('🌍 Deploying globally (this may take up to 1 hour to propagate)');

      const data = await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
        { body: commands }
      );

      console.log(`\n✅ Successfully deployed ${(data as any[]).length} commands globally!`);
      console.log('   Commands will be available in all servers within 1 hour.\n');
    }

    console.log('🎉 Deployment complete!');
  } catch (error) {
    console.error('❌ Error deploying commands:', error);
    process.exit(1);
  }
}

deployCommands();
