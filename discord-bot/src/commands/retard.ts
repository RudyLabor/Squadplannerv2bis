/**
 * /retard Command
 *
 * Signal being late to a session.
 * Usage: /retard <minutes> [raison]
 */

import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js';
import { supabase } from '../index';
import { getLinkedUser, getSquadByDiscordGuild } from '../utils/database';

export const retardCommand = {
  data: new SlashCommandBuilder()
    .setName('retard')
    .setDescription('Signaler un retard pour la session en cours')
    .addIntegerOption((option) =>
      option
        .setName('minutes')
        .setDescription('Nombre de minutes de retard estimé')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(120)
    )
    .addStringOption((option) =>
      option
        .setName('raison')
        .setDescription('Raison du retard (optionnel)')
        .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const minutes = interaction.options.getInteger('minutes', true);
    const reason = interaction.options.getString('raison');

    // Get linked user
    const user = await getLinkedUser(interaction.user.id);
    if (!user) {
      await interaction.editReply({
        content: '⚠️ **Compte non lié**\n\nTon compte Discord n\'est pas lié à Squad Planner.\n\n👉 Utilise `/profil link` pour lier ton compte.',
      });
      return;
    }

    // Get squad for this guild
    const squad = await getSquadByDiscordGuild(interaction.guildId!);
    if (!squad) {
      await interaction.editReply({
        content: '⚠️ Ce serveur n\'est pas lié à un squad.',
      });
      return;
    }

    // Find the current or next session (within 30 minutes)
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);

    const { data: sessions } = await supabase
      .from('sessions')
      .select('id, title, scheduled_date, scheduled_time')
      .eq('squad_id', squad.id)
      .in('status', ['pending', 'ongoing'])
      .order('scheduled_date', { ascending: true })
      .order('scheduled_time', { ascending: true })
      .limit(1);

    if (!sessions || sessions.length === 0) {
      await interaction.editReply({
        content: '📭 **Aucune session en cours**\n\nIl n\'y a pas de session active pour signaler un retard.',
      });
      return;
    }

    const session = sessions[0];

    // Update or create check-in with late status
    const { error } = await supabase.from('session_check_ins').upsert(
      {
        session_id: session.id,
        user_id: user.id,
        status: 'running_late',
        notes: reason ? `${minutes} min - ${reason}` : `${minutes} min de retard`,
        checked_in_at: new Date().toISOString(),
      },
      {
        onConflict: 'session_id,user_id',
      }
    );

    if (error) {
      console.error('Late notification error:', error);
      await interaction.editReply({
        content: '❌ Erreur lors de l\'enregistrement du retard.',
      });
      return;
    }

    // Create notification embed
    const embed = new EmbedBuilder()
      .setColor(0xF59E0B) // Warning yellow
      .setTitle('⏰ Retard signalé')
      .setDescription(`<@${interaction.user.id}> sera en retard de **${minutes} minutes**`)
      .addFields({
        name: '📋 Session',
        value: session.title,
        inline: true,
      });

    if (reason) {
      embed.addFields({
        name: '📝 Raison',
        value: reason,
        inline: true,
      });
    }

    embed
      .setFooter({ text: 'Squad Planner' })
      .setTimestamp();

    // Send public notification
    await interaction.editReply({ embeds: [embed] });

    console.log(`⏰ Late notification: ${user.id} - ${minutes}min for session ${session.id}`);
  },
};
