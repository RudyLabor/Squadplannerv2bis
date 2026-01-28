/**
 * /squad Command
 *
 * View squad info and manage squad-Discord link.
 * Usage: /squad [info|link|unlink|sessions]
 */

import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { supabase } from '../index';
import { getLinkedUser, getSquadByDiscordGuild } from '../utils/database';
import { formatDateTime } from '../utils/datetime';

export const squadCommand = {
  data: new SlashCommandBuilder()
    .setName('squad')
    .setDescription('Voir les infos de ton squad')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('info')
        .setDescription('Voir les informations du squad lié à ce serveur')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('sessions')
        .setDescription('Voir les prochaines sessions du squad')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('membres')
        .setDescription('Voir la liste des membres du squad')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('link')
        .setDescription('Lier ce serveur Discord à un squad (Admin)')
        .addStringOption((option) =>
          option
            .setName('code')
            .setDescription('Code d\'invitation du squad')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('unlink')
        .setDescription('Délier ce serveur Discord du squad (Admin)')
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'info':
        await handleInfo(interaction);
        break;
      case 'sessions':
        await handleSessions(interaction);
        break;
      case 'membres':
        await handleMembers(interaction);
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
  await interaction.deferReply();

  const squad = await getSquadByDiscordGuild(interaction.guildId!);

  if (!squad) {
    await interaction.editReply({
      content: '⚠️ **Serveur non configuré**\n\nCe serveur Discord n\'est pas lié à un squad.\n\n👉 Un admin peut utiliser `/squad link <code>` pour le configurer.',
    });
    return;
  }

  // Get squad details with members count
  const { data: squadDetails } = await supabase
    .from('squads')
    .select(`
      *,
      owner:users!owner_id(username, display_name),
      members:squad_members(count)
    `)
    .eq('id', squad.id)
    .single();

  if (!squadDetails) {
    await interaction.editReply({ content: '❌ Erreur lors de la récupération du squad.' });
    return;
  }

  // Get upcoming sessions count
  const { count: upcomingSessions } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })
    .eq('squad_id', squad.id)
    .gte('scheduled_date', new Date().toISOString().split('T')[0])
    .eq('status', 'pending');

  const embed = new EmbedBuilder()
    .setColor(0xEF9C1E)
    .setTitle(`🎮 ${squadDetails.name}`)
    .setDescription(squadDetails.description || 'Aucune description')
    .addFields(
      {
        name: '🎯 Jeu principal',
        value: squadDetails.game || 'Non défini',
        inline: true,
      },
      {
        name: '👥 Membres',
        value: `${(squadDetails.members as any)?.[0]?.count || 0}/${squadDetails.max_members || 10}`,
        inline: true,
      },
      {
        name: '📅 Sessions à venir',
        value: `${upcomingSessions || 0}`,
        inline: true,
      },
      {
        name: '👑 Propriétaire',
        value: (squadDetails.owner as any)?.display_name || (squadDetails.owner as any)?.username || 'Unknown',
        inline: true,
      },
      {
        name: '🔗 Code d\'invitation',
        value: `\`${squadDetails.invite_code || 'N/A'}\``,
        inline: true,
      }
    )
    .setFooter({ text: 'Squad Planner' })
    .setTimestamp();

  await interaction.editReply({ embeds: [embed] });
}

async function handleSessions(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  const squad = await getSquadByDiscordGuild(interaction.guildId!);

  if (!squad) {
    await interaction.editReply({
      content: '⚠️ Ce serveur n\'est pas lié à un squad.',
    });
    return;
  }

  // Get upcoming sessions
  const { data: sessions } = await supabase
    .from('sessions')
    .select('*, proposed_by_user:users!proposed_by(display_name, username)')
    .eq('squad_id', squad.id)
    .gte('scheduled_date', new Date().toISOString().split('T')[0])
    .eq('status', 'pending')
    .order('scheduled_date', { ascending: true })
    .order('scheduled_time', { ascending: true })
    .limit(5);

  if (!sessions || sessions.length === 0) {
    await interaction.editReply({
      content: '📭 **Aucune session à venir**\n\nUtilise `/session` pour en créer une !',
    });
    return;
  }

  const embed = new EmbedBuilder()
    .setColor(0xEF9C1E)
    .setTitle(`📅 Sessions à venir - ${squad.name}`)
    .setDescription(`${sessions.length} session(s) planifiée(s)`)
    .setFooter({ text: 'Squad Planner • /rsvp pour répondre' })
    .setTimestamp();

  for (const session of sessions) {
    const creator = (session.proposed_by_user as any)?.display_name ||
                    (session.proposed_by_user as any)?.username || 'Unknown';

    embed.addFields({
      name: `🎮 ${session.title}`,
      value: `📅 ${formatDateTime(session.scheduled_date, session.scheduled_time)}\n👤 Par ${creator}`,
      inline: false,
    });
  }

  await interaction.editReply({ embeds: [embed] });
}

async function handleMembers(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  const squad = await getSquadByDiscordGuild(interaction.guildId!);

  if (!squad) {
    await interaction.editReply({
      content: '⚠️ Ce serveur n\'est pas lié à un squad.',
    });
    return;
  }

  // Get members
  const { data: members } = await supabase
    .from('squad_members')
    .select(`
      role,
      joined_at,
      reliability_score,
      user:users(id, username, display_name, reliability_score)
    `)
    .eq('squad_id', squad.id)
    .order('role')
    .order('joined_at');

  if (!members || members.length === 0) {
    await interaction.editReply({ content: '👥 Aucun membre trouvé.' });
    return;
  }

  const roleEmoji: Record<string, string> = {
    owner: '👑',
    co_leader: '⭐',
    member: '👤',
  };

  const memberList = members
    .map((m) => {
      const user = m.user as any;
      const name = user?.display_name || user?.username || 'Unknown';
      const emoji = roleEmoji[m.role] || '👤';
      const reliability = m.reliability_score || user?.reliability_score || 0;
      return `${emoji} **${name}** - ${reliability}% fiabilité`;
    })
    .join('\n');

  const embed = new EmbedBuilder()
    .setColor(0xEF9C1E)
    .setTitle(`👥 Membres - ${squad.name}`)
    .setDescription(memberList)
    .addFields({
      name: 'Légende',
      value: '👑 Owner • ⭐ Co-leader • 👤 Membre',
    })
    .setFooter({ text: `${members.length} membre(s)` })
    .setTimestamp();

  await interaction.editReply({ embeds: [embed] });
}

async function handleLink(interaction: ChatInputCommandInteraction) {
  // Check admin permissions
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
    await interaction.reply({
      content: '❌ Seuls les administrateurs peuvent lier un squad.',
      ephemeral: true,
    });
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  const inviteCode = interaction.options.getString('code', true);

  // Find squad by invite code
  const { data: squad, error } = await supabase
    .from('squads')
    .select('id, name')
    .eq('invite_code', inviteCode.toUpperCase())
    .single();

  if (error || !squad) {
    await interaction.editReply({
      content: `❌ Code d'invitation invalide: \`${inviteCode}\``,
    });
    return;
  }

  // Check if guild is already linked
  const { data: existingLink } = await supabase
    .from('discord_guild_links')
    .select('squad_id')
    .eq('guild_id', interaction.guildId!)
    .single();

  if (existingLink) {
    await interaction.editReply({
      content: '⚠️ Ce serveur est déjà lié à un squad. Utilise `/squad unlink` d\'abord.',
    });
    return;
  }

  // Create link
  const { error: linkError } = await supabase.from('discord_guild_links').insert({
    guild_id: interaction.guildId!,
    guild_name: interaction.guild?.name,
    squad_id: squad.id,
  });

  if (linkError) {
    console.error('Guild link error:', linkError);
    await interaction.editReply({
      content: '❌ Erreur lors de la liaison. Réessaie plus tard.',
    });
    return;
  }

  await interaction.editReply({
    content: `✅ **Serveur lié avec succès !**\n\nCe serveur Discord est maintenant lié au squad **${squad.name}**.\n\nLes membres peuvent maintenant utiliser les commandes du bot.`,
  });
}

async function handleUnlink(interaction: ChatInputCommandInteraction) {
  // Check admin permissions
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
    await interaction.reply({
      content: '❌ Seuls les administrateurs peuvent délier un squad.',
      ephemeral: true,
    });
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  const { error } = await supabase
    .from('discord_guild_links')
    .delete()
    .eq('guild_id', interaction.guildId!);

  if (error) {
    await interaction.editReply({
      content: '❌ Erreur lors de la suppression du lien.',
    });
    return;
  }

  await interaction.editReply({
    content: '✅ **Serveur délié**\n\nCe serveur n\'est plus lié à aucun squad.',
  });
}
