/**
 * 🎯 SESSION RSVP CARD - Système complet de réponses
 * Intègre SwipeableRSVP + compteur visuel + liste membres temps réel
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Users, Check, X, HelpCircle, Clock, TrendingUp } from 'lucide-react';
import { SwipeableRSVP } from './ui/SwipeableRSVP';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface RSVP {
  id: string;
  response: 'yes' | 'no' | 'maybe';
  user: {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string;
    reliability_score?: number;
  };
  responded_at: string;
}

interface SessionRSVPCardProps {
  sessionId: string;
  rsvps: RSVP[];
  requiredPlayers: number;
  currentUserRSVP?: 'yes' | 'no' | 'maybe';
  onRSVP: (response: 'yes' | 'no' | 'maybe') => Promise<void>;
}

export function SessionRSVPCard({
  sessionId,
  rsvps: initialRSVPs,
  requiredPlayers,
  currentUserRSVP,
  onRSVP,
}: SessionRSVPCardProps) {
  const [rsvps, setRSVPs] = useState<RSVP[]>(initialRSVPs);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calcul des stats
  const yesCount = rsvps.filter(r => r.response === 'yes').length;
  const noCount = rsvps.filter(r => r.response === 'no').length;
  const maybeCount = rsvps.filter(r => r.response === 'maybe').length;
  const totalResponses = rsvps.length;
  const completionRate = requiredPlayers > 0 ? (yesCount / requiredPlayers) * 100 : 0;
  const isComplete = yesCount >= requiredPlayers;

  // Real-time subscription pour les RSVPs
  useEffect(() => {
    const channel = supabase
      .channel(`session_rsvps_${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_rsvps',
          filter: `session_id=eq.${sessionId}`,
        },
        async (payload) => {
          console.log('RSVP real-time update:', payload);

          // Refresh RSVPs from database
          const { data, error } = await supabase
            .from('session_rsvps')
            .select(`
              id,
              response,
              responded_at,
              user:users(id, username, display_name, avatar_url, reliability_score)
            `)
            .eq('session_id', sessionId);

          if (!error && data) {
            setRSVPs(data as any);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const handleRSVP = async (response: 'yes' | 'no' | 'maybe') => {
    setIsSubmitting(true);
    try {
      await onRSVP(response);
    } catch (error) {
      console.error('Error submitting RSVP:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      {/* Header avec compteur visuel */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Qui vient jouer ?
          </h3>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold ${
              isComplete
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
            }`}>
              <Users className="w-4 h-4" />
              <span className="text-sm">{yesCount}/{requiredPlayers}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className={`absolute inset-y-0 left-0 ${
              isComplete ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(completionRate, 100)}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>

        {/* Status text */}
        <p className="text-sm text-gray-500 mt-2">
          {isComplete ? (
            <span className="text-emerald-600 font-medium flex items-center gap-1">
              <Check className="w-4 h-4" />
              Session complète !
            </span>
          ) : (
            <span>Encore {requiredPlayers - yesCount} joueur{requiredPlayers - yesCount > 1 ? 's' : ''} recherché{requiredPlayers - yesCount > 1 ? 's' : ''}</span>
          )}
        </p>
      </div>

      {/* Réponse de l'utilisateur avec SwipeableRSVP */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Ta réponse
        </p>
        {!currentUserRSVP || currentUserRSVP === 'maybe' ? (
          <SwipeableRSVP
            onResponse={handleRSVP}
            disabled={isSubmitting}
          >
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-sm font-medium text-gray-900 mb-1">
                Swipe pour répondre
              </p>
              <p className="text-xs text-gray-500">
                ← Non disponible | Partant →
              </p>
            </div>
          </SwipeableRSVP>
        ) : (
          <div className={`rounded-xl p-4 flex items-center gap-3 ${
            currentUserRSVP === 'yes'
              ? 'bg-emerald-50 border-2 border-emerald-200'
              : 'bg-red-50 border-2 border-red-200'
          }`}>
            {currentUserRSVP === 'yes' ? (
              <>
                <Check className="w-5 h-5 text-emerald-600" />
                <span className="font-medium text-emerald-900">Tu as confirmé ta présence</span>
              </>
            ) : (
              <>
                <X className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-900">Tu as décliné</span>
              </>
            )}
            <button
              onClick={() => handleRSVP('maybe')}
              className="ml-auto text-sm text-gray-600 hover:text-gray-900"
              disabled={isSubmitting}
            >
              Modifier
            </button>
          </div>
        )}
      </div>

      {/* Liste des réponses en temps réel */}
      <div>
        <div className="flex items-center gap-4 mb-3">
          <h4 className="text-sm font-medium text-gray-700">
            Réponses ({totalResponses})
          </h4>
          <div className="flex gap-2 text-xs">
            <span className="flex items-center gap-1 text-emerald-600">
              <Check className="w-3 h-3" />
              {yesCount}
            </span>
            <span className="flex items-center gap-1 text-red-600">
              <X className="w-3 h-3" />
              {noCount}
            </span>
            <span className="flex items-center gap-1 text-amber-600">
              <HelpCircle className="w-3 h-3" />
              {maybeCount}
            </span>
          </div>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {rsvps.map((rsvp) => (
              <motion.div
                key={rsvp.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  rsvp.response === 'yes'
                    ? 'bg-emerald-50'
                    : rsvp.response === 'no'
                    ? 'bg-red-50'
                    : 'bg-amber-50'
                }`}
              >
                {/* Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    {rsvp.user.avatar_url ? (
                      <img
                        src={rsvp.user.avatar_url}
                        alt={rsvp.user.display_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">
                        {rsvp.user.display_name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  {/* Badge RSVP */}
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${
                    rsvp.response === 'yes'
                      ? 'bg-emerald-500'
                      : rsvp.response === 'no'
                      ? 'bg-red-500'
                      : 'bg-amber-500'
                  }`}>
                    {rsvp.response === 'yes' ? (
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    ) : rsvp.response === 'no' ? (
                      <X className="w-3 h-3 text-white" strokeWidth={3} />
                    ) : (
                      <HelpCircle className="w-3 h-3 text-white" strokeWidth={3} />
                    )}
                  </div>
                </div>

                {/* User info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {rsvp.user.display_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(rsvp.responded_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                {/* Reliability score */}
                {rsvp.user.reliability_score !== undefined && rsvp.user.reliability_score > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-full">
                    <TrendingUp className="w-3 h-3 text-amber-500" />
                    <span className="text-xs font-semibold text-gray-700">
                      {Math.round(rsvp.user.reliability_score)}%
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {totalResponses === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucune réponse pour le moment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
