/**
 * /help Command
 *
 * Display help information about available commands.
 */

import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js';

export const helpCommand = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Afficher l\'aide et les commandes disponibles'),

  async execute(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
      .setColor(0xEF9C1E)
      .setTitle('🤖 Squad Planner Bot - Aide')
      .setDescription('Coordonne tes sessions de jeu directement depuis Discord !')
      .addFields(
        {
          name: '🎮 /session',
          value: 'Créer une nouvelle session de jeu\n`/session <jeu> <date> <heure>`\nExemple: `/session Valorant demain 21h`',
          inline: false,
        },
        {
          name: '✋ /rsvp',
          value: 'Répondre à une invitation de session\n`/rsvp <oui|non|peut-être>`\nExemple: `/rsvp oui`',
          inline: false,
        },
        {
          name: '👥 /squad',
          value: 'Voir les infos de ton squad\n`/squad info` - Informations du squad\n`/squad sessions` - Sessions à venir\n`/squad membres` - Liste des membres',
          inline: false,
        },
        {
          name: '⏰ /retard',
          value: 'Signaler un retard\n`/retard <minutes> [raison]`\nExemple: `/retard 15 embouteillages`',
          inline: false,
        },
        {
          name: '👤 /profil',
          value: 'Gérer ton profil Squad Planner\n`/profil link` - Lier ton compte\n`/profil info` - Voir tes stats',
          inline: false,
        },
        {
          name: '🔗 Liens utiles',
          value: '[Site web](https://squadplanner.app) • [App mobile](https://squadplanner.app/download) • [Support](https://discord.gg/squadplanner)',
          inline: false,
        }
      )
      .setFooter({
        text: 'Squad Planner • La coordination gaming, simplifiée',
        iconURL: 'https://squadplanner.app/logo.png',
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
