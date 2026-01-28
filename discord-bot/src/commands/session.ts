/**
 * /session Command
 *
 * Create a new gaming session directly from Discord.
 * Usage: /session <jeu> <date> <heure> [description]
 */

import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import { supabase } from '../index';
import { parseDate, parseTime, formatDateTime } from '../utils/datetime';
import { getLinkedUser, getSquadByDiscordGuild } from '../utils/database';

export const sessionCommand = {
  data: new SlashCommandBuilder()
    .setName('session')
    .setDescription('Créer une nouvelle session de jeu')
    .addStringOption((option) =>
      option
        .setName('jeu')
        .setDescription('Le jeu pour cette session')
        .setRequired(true)
        .addChoices(
          { name: 'Valorant', value: 'Valorant' },
          { name: 'League of Legends', value: 'League of Legends' },
          { name: 'CS2', value: 'CS2' },
          { name: 'Apex Legends', value: 'Apex Legends' },
          { name: 'Fortnite', value: 'Fortnite' },
          { name: 'Rocket League', value: 'Rocket League' },
          { name: 'Overwatch 2', value: 'Overwatch 2' },
          { name: 'Autre', value: 'Autre' }
        )
    )
    .addStringOption((option) =>
      option
        .setName('date')
        .setDescription('Date de la session (ex: demain, lundi, 25/01)')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('heure')
        .setDescription('Heure de début (ex: 21h, 21h30, 21:00)')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('titre')
        .setDescription('Titre de la session (optionnel)')
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName('joueurs')
        .setDescription('Nombre de joueurs requis (défaut: 5)')
        .setRequired(false)
        .setMinValue(2)
        .setMaxValue(20)
    )
    .addStringOption((option) =>
      option
        .setName('description')
        .setDescription('Description ou notes supplémentaires')
        .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    // Get options
    const game = interaction.options.getString('jeu', true);
    const dateInput = interaction.options.getString('date', true);
    const timeInput = interaction.options.getString('heure', true);
    const title = interaction.options.getString('titre') || `Session ${game}`;
    const requiredPlayers = interaction.options.getInteger('joueurs') || 5;
    const description = interaction.options.getString('description');

    // Parse date and time
    const parsedDate = parseDate(dateInput);
    const parsedTime = parseTime(timeInput);

    if (!parsedDate) {
      await interaction.editReply({
        content: `❌ Date invalide: "${dateInput}"\n\n**Formats acceptés:**\n• \`demain\`, \`après-demain\`\n• \`lundi\`, \`mardi\`, etc.\n• \`25/01\`, \`25/01/2026\``,
      });
      return;
    }

    if (!parsedTime) {
      await interaction.editReply({
        content: `❌ Heure invalide: "${timeInput}"\n\n**Formats acceptés:**\n• \`21h\`, \`21h30\`\n• \`21:00\`, \`21:30\`\n• \`9pm\``,
      });
      return;
    }

    // Get linked Squad Planner user
    const user = await getLinkedUser(interaction.user.id);
    if (!user) {
      await interaction.editReply({
        content: '⚠️ **Compte non lié**\n\nTon compte Discord n\'est pas lié à Squad Planner.\n\n👉 Utilise `/profil link` pour lier ton compte.',
      });
      return;
    }

    // Get squad linked to this Discord server
    const squad = await getSquadByDiscordGuild(interaction.guildId!);
    if (!squad) {
      await interaction.editReply({
        content: '⚠️ **Serveur non configuré**\n\nCe serveur Discord n\'est pas lié à un squad.\n\n👉 Un admin doit configurer le bot avec `/squad link`.',
      });
      return;
    }

    // Create session in Supabase
    const { data: session, error } = await supabase
      .from('sessions')
      .insert({
        squad_id: squad.id,
        title,
        description,
        scheduled_date: parsedDate,
        scheduled_time: parsedTime,
        duration: '120', // 2 hours default
        required_players: requiredPlayers,
        proposed_by: user.id,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Session creation error:', error);
      await interaction.editReply({
        content: '❌ Erreur lors de la création de la session. Réessaie plus tard.',
      });
      return;
    }

    // Create beautiful embed
    const embed = new EmbedBuilder()
      .setColor(0xEF9C1E) // Squad Planner orange
      .setTitle(`🎮 ${title}`)
      .setDescription(description || 'Une nouvelle session a été créée !')
      .addFields(
        {
          name: '📅 Date & Heure',
          value: formatDateTime(parsedDate, parsedTime),
          inline: true,
        },
        {
          name: '🎯 Jeu',
          value: game,
          inline: true,
        },
        {
          name: '👥 Joueurs',
          value: `0/${requiredPlayers}`,
          inline: true,
        },
        {
          name: '📋 Squad',
          value: squad.name,
          inline: true,
        },
        {
          name: '👤 Créée par',
          value: `<@${interaction.user.id}>`,
          inline: true,
        }
      )
      .setFooter({
        text: 'Squad Planner • Clique sur les boutons pour répondre',
        iconURL: 'https://squadplanner.app/logo.png',
      })
      .setTimestamp();

    // Create RSVP buttons
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
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
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setLabel('📱 Voir sur l\'app')
        .setStyle(ButtonStyle.Link)
        .setURL(`https://squadplanner.app/session/${session.id}`)
    );

    await interaction.editReply({
      embeds: [embed],
      components: [row],
    });

    // Log success
    console.log(`✅ Session created: ${session.id} by ${interaction.user.tag}`);
  },
};
