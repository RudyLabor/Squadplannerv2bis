/**
 * /rsvp Command
 *
 * Respond to a session invitation.
 * Usage: /rsvp <session> <réponse>
 */

import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js';
import { supabase } from '../index';
import { getLinkedUser } from '../utils/database';
import { formatDateTime } from '../utils/datetime';

export const rsvpCommand = {
  data: new SlashCommandBuilder()
    .setName('rsvp')
    .setDescription('Répondre à une invitation de session')
    .addStringOption((option) =>
      option
        .setName('reponse')
        .setDescription('Ta réponse')
        .setRequired(true)
        .addChoices(
          { name: '✅ Je viens', value: 'yes' },
          { name: '🤔 Peut-être', value: 'maybe' },
          { name: '❌ Absent', value: 'no' }
        )
    )
    .addStringOption((option) =>
      option
        .setName('session')
        .setDescription('ID de la session (optionnel si une seule session à venir)')
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('note')
        .setDescription('Note ou raison (optionnel)')
        .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const response = interaction.options.getString('reponse', true) as 'yes' | 'no' | 'maybe';
    const sessionId = interaction.options.getString('session');
    const note = interaction.options.getString('note');

    // Get linked user
    const user = await getLinkedUser(interaction.user.id);
    if (!user) {
      await interaction.editReply({
        content: '⚠️ **Compte non lié**\n\nTon compte Discord n\'est pas lié à Squad Planner.\n\n👉 Utilise `/profil link` pour lier ton compte.',
      });
      return;
    }

    // If no session ID provided, get the next upcoming session for user's squads
    let targetSessionId = sessionId;

    if (!targetSessionId) {
      // Get user's squads
      const { data: memberships } = await supabase
        .from('squad_members')
        .select('squad_id')
        .eq('user_id', user.id);

      if (!memberships || memberships.length === 0) {
        await interaction.editReply({
          content: '⚠️ Tu n\'es membre d\'aucun squad.',
        });
        return;
      }

      const squadIds = memberships.map((m) => m.squad_id);

      // Get next upcoming session
      const { data: sessions } = await supabase
        .from('sessions')
        .select('id, title, scheduled_date, scheduled_time, squad:squads(name)')
        .in('squad_id', squadIds)
        .gte('scheduled_date', new Date().toISOString().split('T')[0])
        .eq('status', 'pending')
        .order('scheduled_date', { ascending: true })
        .order('scheduled_time', { ascending: true })
        .limit(1);

      if (!sessions || sessions.length === 0) {
        await interaction.editReply({
          content: '📭 **Aucune session à venir**\n\nIl n\'y a pas de session planifiée pour le moment.',
        });
        return;
      }

      targetSessionId = sessions[0].id;
    }

    // Get session details
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*, squad:squads(name, game)')
      .eq('id', targetSessionId)
      .single();

    if (sessionError || !session) {
      await interaction.editReply({
        content: '❌ Session introuvable. Vérifie l\'ID.',
      });
      return;
    }

    // Submit RSVP
    const { error: rsvpError } = await supabase
      .from('session_rsvps')
      .upsert(
        {
          session_id: targetSessionId,
          user_id: user.id,
          response,
          notes: note,
        },
        {
          onConflict: 'session_id,user_id',
        }
      );

    if (rsvpError) {
      console.error('RSVP error:', rsvpError);
      await interaction.editReply({
        content: '❌ Erreur lors de l\'enregistrement de ta réponse.',
      });
      return;
    }

    // Create confirmation embed
    const responseEmoji = {
      yes: '✅',
      no: '❌',
      maybe: '🤔',
    };

    const responseText = {
      yes: 'Présence confirmée',
      no: 'Absence notée',
      maybe: 'Peut-être',
    };

    const embed = new EmbedBuilder()
      .setColor(response === 'yes' ? 0x22C55E : response === 'no' ? 0xEF4444 : 0xF59E0B)
      .setTitle(`${responseEmoji[response]} ${responseText[response]}`)
      .addFields(
        {
          name: '📋 Session',
          value: session.title,
          inline: true,
        },
        {
          name: '📅 Date',
          value: formatDateTime(session.scheduled_date, session.scheduled_time),
          inline: true,
        },
        {
          name: '🎮 Squad',
          value: (session.squad as any)?.name || 'Unknown',
          inline: true,
        }
      )
      .setFooter({ text: 'Squad Planner' })
      .setTimestamp();

    if (note) {
      embed.addFields({ name: '📝 Note', value: note });
    }

    await interaction.editReply({
      embeds: [embed],
    });

    console.log(`✅ RSVP: ${user.id} -> ${response} for session ${targetSessionId}`);
  },
};
