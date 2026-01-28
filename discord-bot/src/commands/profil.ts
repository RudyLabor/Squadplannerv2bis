/**
 * /profil Command
 *
 * Manage Squad Planner profile and account linking.
 */

import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js';
import { supabase } from '../index';
import { getLinkedUser } from '../utils/database';

export const profilCommand = {
  data: new SlashCommandBuilder()
    .setName('profil')
    .setDescription('Gérer ton profil Squad Planner')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('info')
        .setDescription('Voir tes statistiques et informations')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('link')
        .setDescription('Lier ton compte Discord à Squad Planner')
        .addStringOption((option) =>
          option
            .setName('code')
            .setDescription('Code de liaison depuis l\'app Squad Planner')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('unlink')
        .setDescription('Délier ton compte Discord de Squad Planner')
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'info':
        await handleInfo(interaction);
        break;
      case 'link':
        await handleLink(interaction);
        break;
      case 'unlink':
        await handleUnlink(interaction);
        break;
    }
  },
};

async function handleInfo(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  const user = await getLinkedUser(interaction.user.id);

  if (!user) {
    await interaction.editReply({
      content: '⚠️ **Compte non lié**\n\nTon compte Discord n\'est pas encore lié à Squad Planner.\n\n**Comment lier ton compte ?**\n1. Ouvre l\'app Squad Planner\n2. Va dans Profil > Intégrations > Discord\n3. Copie ton code de liaison\n4. Utilise `/profil link <code>`',
    });
    return;
  }

  // Get full user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Get squad count
  const { count: squadCount } = await supabase
    .from('squad_members')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  // Get sessions attended count
  const { count: sessionsAttended } = await supabase
    .from('session_rsvps')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('response', 'yes');

  const embed = new EmbedBuilder()
    .setColor(0xEF9C1E)
    .setTitle(`👤 ${profile?.display_name || profile?.username || 'Joueur'}`)
    .setThumbnail(profile?.avatar_url || interaction.user.displayAvatarURL())
    .addFields(
      {
        name: '📊 Niveau',
        value: `${profile?.level || 1}`,
        inline: true,
      },
      {
        name: '⭐ Fiabilité',
        value: `${profile?.reliability_score || 80}%`,
        inline: true,
      },
      {
        name: '🏆 XP',
        value: `${profile?.xp_points || 0}`,
        inline: true,
      },
      {
        name: '👥 Squads',
        value: `${squadCount || 0}`,
        inline: true,
      },
      {
        name: '📅 Sessions',
        value: `${sessionsAttended || 0}`,
        inline: true,
      },
      {
        name: '🔗 Compte lié',
        value: '✅ Discord connecté',
        inline: true,
      }
    )
    .setFooter({ text: 'Squad Planner' })
    .setTimestamp();

  await interaction.editReply({ embeds: [embed] });
}

async function handleLink(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  const linkCode = interaction.options.getString('code', true);

  // Check if already linked
  const { data: existingLink } = await supabase
    .from('discord_links')
    .select('user_id')
    .eq('discord_id', interaction.user.id)
    .single();

  if (existingLink) {
    await interaction.editReply({
      content: '⚠️ Ton compte Discord est déjà lié à un compte Squad Planner.\n\nUtilise `/profil unlink` si tu veux le délier.',
    });
    return;
  }

  // Find the link code (stored temporarily in profiles or a dedicated table)
  const { data: linkData, error } = await supabase
    .from('discord_link_codes')
    .select('user_id, expires_at')
    .eq('code', linkCode.toUpperCase())
    .single();

  if (error || !linkData) {
    await interaction.editReply({
      content: `❌ Code de liaison invalide: \`${linkCode}\`\n\n**Comment obtenir un code ?**\n1. Ouvre l\'app Squad Planner\n2. Va dans Profil > Intégrations > Discord\n3. Clique sur "Générer un code"`,
    });
    return;
  }

  // Check if expired
  if (new Date(linkData.expires_at) < new Date()) {
    await interaction.editReply({
      content: '❌ Ce code a expiré. Génère un nouveau code depuis l\'app.',
    });
    return;
  }

  // Create the link
  const { error: linkError } = await supabase.from('discord_links').insert({
    discord_id: interaction.user.id,
    discord_username: interaction.user.tag,
    discord_avatar: interaction.user.displayAvatarURL(),
    user_id: linkData.user_id,
  });

  if (linkError) {
    console.error('Link error:', linkError);
    await interaction.editReply({
      content: '❌ Erreur lors de la liaison. Réessaie plus tard.',
    });
    return;
  }

  // Delete the used code
  await supabase.from('discord_link_codes').delete().eq('code', linkCode.toUpperCase());

  // Update user profile with Discord info
  await supabase
    .from('profiles')
    .update({
      discord_id: interaction.user.id,
      discord_username: interaction.user.tag,
    })
    .eq('id', linkData.user_id);

  await interaction.editReply({
    content: '✅ **Compte lié avec succès !**\n\nTon compte Discord est maintenant connecté à Squad Planner.\n\nTu peux utiliser toutes les commandes du bot !',
  });

  console.log(`✅ Account linked: Discord ${interaction.user.id} -> Squad Planner ${linkData.user_id}`);
}

async function handleUnlink(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  const { error } = await supabase
    .from('discord_links')
    .delete()
    .eq('discord_id', interaction.user.id);

  if (error) {
    await interaction.editReply({
      content: '❌ Erreur lors de la suppression du lien.',
    });
    return;
  }

  await interaction.editReply({
    content: '✅ **Compte délié**\n\nTon compte Discord n\'est plus connecté à Squad Planner.',
  });
}
