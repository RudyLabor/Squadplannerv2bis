/**
 * 🎯 RSVP SCREEN - Écran dédié aux réponses de session
 * Phase 0/2 Critical Feature - Permet aux membres de répondre aux sessions
 *
 * Features:
 * - Cards membres avec photo et statut visuel (✅⏳❌)
 * - Boutons d'action rapides
 * - Jauge de complétion visuelle (3/5 confirmés)
 * - Temps réel via Supabase
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Users,
  Check,
  X,
  HelpCircle,
  Clock,
  Calendar,
  MapPin,
  Gamepad2,
  TrendingUp,
  Bell,
  Share2,
  MessageCircle,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Timer,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { sessionsAPI } from '@/app/services/api';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/app/contexts/UserContext';

interface RSVP {
  id: string;
  response: 'yes' | 'no' | 'maybe';
  notes?: string;
  responded_at: string;
  user: {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string;
    reliability_score?: number;
  };
}

interface Session {
  id: string;
  title: string;
  description?: string;
  scheduled_date: string;
  scheduled_time: string;
  duration?: string;
  required_players: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  squad: {
    id: string;
    name: string;
    game: string;
  };
  proposed_by_user: {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string;
  };
  rsvps: RSVP[];
}

interface RSVPScreenProps {
  onNavigate?: (screen: string, params?: Record<string, string>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function RSVPScreen({ onNavigate, showToast }: RSVPScreenProps) {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { userProfile } = useUser();

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserRSVP, setCurrentUserRSVP] = useState<'yes' | 'no' | 'maybe' | null>(null);

  // Stats calculées
  const yesCount = session?.rsvps.filter(r => r.response === 'yes').length || 0;
  const noCount = session?.rsvps.filter(r => r.response === 'no').length || 0;
  const maybeCount = session?.rsvps.filter(r => r.response === 'maybe').length || 0;
  const totalResponses = session?.rsvps.length || 0;
  const requiredPlayers = session?.required_players || 5;
  const completionRate = requiredPlayers > 0 ? (yesCount / requiredPlayers) * 100 : 0;
  const isComplete = yesCount >= requiredPlayers;

  // Chargement de la session
  const loadSession = useCallback(async () => {
    if (!sessionId) return;

    try {
      setLoading(true);
      setError(null);

      const { session: data } = await sessionsAPI.getById(sessionId);
      setSession(data);

      // Trouver le RSVP de l'utilisateur actuel
      if (userProfile?.id && data?.rsvps) {
        const userRSVP = data.rsvps.find(r => r.user.id === userProfile.id);
        setCurrentUserRSVP(userRSVP?.response || null);
      }
    } catch (err: any) {
      console.error('Error loading session:', err);
      setError(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [sessionId, userProfile?.id]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // Real-time subscription pour les RSVPs
  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel(`rsvp_screen_${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_rsvps',
          filter: `session_id=eq.${sessionId}`,
        },
        () => {
          // Refresh data on any RSVP change
          loadSession();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, loadSession]);

  // Soumettre un RSVP
  const handleRSVP = async (response: 'yes' | 'no' | 'maybe') => {
    if (!sessionId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await sessionsAPI.rsvp(sessionId, response);
      setCurrentUserRSVP(response);

      const messages = {
        yes: 'Présence confirmée !',
        no: 'Absence enregistrée',
        maybe: 'Réponse enregistrée : peut-être',
      };
      showToast?.(messages[response], 'success');

      // Refresh session data
      await loadSession();
    } catch (err: any) {
      console.error('Error submitting RSVP:', err);
      showToast?.(err.message || 'Erreur lors de la réponse', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation
  const handleBack = () => {
    if (onNavigate) {
      onNavigate('sessions');
    } else {
      navigate(-1);
    }
  };

  // Format date et heure
  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return {
      date: dateObj.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      }),
      time: dateObj.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      }),
    };
  };

  // Grouper les RSVPs par réponse
  const groupedRSVPs = {
    yes: session?.rsvps.filter(r => r.response === 'yes') || [],
    maybe: session?.rsvps.filter(r => r.response === 'maybe') || [],
    no: session?.rsvps.filter(r => r.response === 'no') || [],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary-500)]" />
          <p className="text-[var(--fg-tertiary)]">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-2">
            Session introuvable
          </h2>
          <p className="text-[var(--fg-tertiary)] mb-6">
            {error || 'Cette session n\'existe pas ou a été supprimée.'}
          </p>
          <Button onClick={handleBack}>
            Retour
          </Button>
        </div>
      </div>
    );
  }

  const { date, time } = formatDateTime(session.scheduled_date, session.scheduled_time);

  return (
    <div className="min-h-screen pb-32 pt-safe bg-[var(--bg-base)]">
      <div className="px-4 py-6 max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={handleBack}
            className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-[var(--fg-primary)] tracking-tight">
              Répondre à la session
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] font-medium">
              {session.squad.name}
            </p>
          </div>
          <button
            onClick={loadSession}
            className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Session Info Card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] flex items-center justify-center">
              <Gamepad2 className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-1">
                {session.title}
              </h2>
              <p className="text-sm text-[var(--fg-tertiary)]">
                {session.squad.game}
              </p>
            </div>
          </div>

          {session.description && (
            <p className="text-sm text-[var(--fg-secondary)] mb-4 leading-relaxed">
              {session.description}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
              <Calendar className="w-4 h-4 text-[var(--primary-500)]" />
              <span className="text-sm font-medium text-[var(--fg-secondary)]">{date}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
              <Clock className="w-4 h-4 text-[var(--primary-500)]" />
              <span className="text-sm font-medium text-[var(--fg-secondary)]">{time}</span>
            </div>
            {session.duration && (
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
                <Timer className="w-4 h-4 text-[var(--primary-500)]" />
                <span className="text-sm font-medium text-[var(--fg-secondary)]">{session.duration}</span>
              </div>
            )}
          </div>
        </div>

        {/* Jauge de complétion */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-[var(--fg-primary)]">
              Progression
            </h3>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold ${
              isComplete
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
            }`}>
              <Users className="w-4 h-4" />
              <span className="text-sm">{yesCount}/{requiredPlayers}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
            <motion.div
              className={`absolute inset-y-0 left-0 rounded-full ${
                isComplete ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(completionRate, 100)}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>

          <p className={`text-sm ${isComplete ? 'text-emerald-600' : 'text-[var(--fg-tertiary)]'}`}>
            {isComplete ? (
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Session complète ! Prêts à jouer
              </span>
            ) : (
              <span>Encore {requiredPlayers - yesCount} joueur{requiredPlayers - yesCount > 1 ? 's' : ''} pour compléter la session</span>
            )}
          </p>

          {/* Stats mini */}
          <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Check className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-[var(--fg-tertiary)]">Confirmés</p>
                <p className="text-sm font-semibold text-[var(--fg-primary)]">{yesCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-[var(--fg-tertiary)]">Peut-être</p>
                <p className="text-sm font-semibold text-[var(--fg-primary)]">{maybeCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                <X className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-[var(--fg-tertiary)]">Absents</p>
                <p className="text-sm font-semibold text-[var(--fg-primary)]">{noCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons d'action rapide */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
          <h3 className="text-base font-semibold text-[var(--fg-primary)] mb-4">
            Ta réponse
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleRSVP('yes')}
              disabled={isSubmitting}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                currentUserRSVP === 'yes'
                  ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200'
                  : 'bg-white border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
              }`}
            >
              {isSubmitting && currentUserRSVP !== 'yes' ? (
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              ) : (
                <>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    currentUserRSVP === 'yes' ? 'bg-emerald-500' : 'bg-emerald-100'
                  }`}>
                    <Check className={`w-6 h-6 ${
                      currentUserRSVP === 'yes' ? 'text-white' : 'text-emerald-600'
                    }`} strokeWidth={2.5} />
                  </div>
                  <span className={`text-sm font-semibold ${
                    currentUserRSVP === 'yes' ? 'text-emerald-700' : 'text-[var(--fg-primary)]'
                  }`}>
                    Partant
                  </span>
                </>
              )}
            </button>

            <button
              onClick={() => handleRSVP('maybe')}
              disabled={isSubmitting}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                currentUserRSVP === 'maybe'
                  ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-200'
                  : 'bg-white border-gray-200 hover:border-amber-300 hover:bg-amber-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                currentUserRSVP === 'maybe' ? 'bg-amber-500' : 'bg-amber-100'
              }`}>
                <HelpCircle className={`w-6 h-6 ${
                  currentUserRSVP === 'maybe' ? 'text-white' : 'text-amber-600'
                }`} strokeWidth={2.5} />
              </div>
              <span className={`text-sm font-semibold ${
                currentUserRSVP === 'maybe' ? 'text-amber-700' : 'text-[var(--fg-primary)]'
              }`}>
                Peut-être
              </span>
            </button>

            <button
              onClick={() => handleRSVP('no')}
              disabled={isSubmitting}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                currentUserRSVP === 'no'
                  ? 'bg-red-50 border-red-500 ring-2 ring-red-200'
                  : 'bg-white border-gray-200 hover:border-red-300 hover:bg-red-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                currentUserRSVP === 'no' ? 'bg-red-500' : 'bg-red-100'
              }`}>
                <X className={`w-6 h-6 ${
                  currentUserRSVP === 'no' ? 'text-white' : 'text-red-600'
                }`} strokeWidth={2.5} />
              </div>
              <span className={`text-sm font-semibold ${
                currentUserRSVP === 'no' ? 'text-red-700' : 'text-[var(--fg-primary)]'
              }`}>
                Absent
              </span>
            </button>
          </div>

          {currentUserRSVP && (
            <p className="text-xs text-center text-[var(--fg-tertiary)] mt-3">
              Clique sur un autre bouton pour modifier ta réponse
            </p>
          )}
        </div>

        {/* Liste des membres par statut */}
        <div className="space-y-4">

          {/* Confirmés */}
          {groupedRSVPs.yes.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <h4 className="font-semibold text-[var(--fg-primary)]">
                  Confirmés ({groupedRSVPs.yes.length})
                </h4>
              </div>
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {groupedRSVPs.yes.map((rsvp) => (
                    <RSVPMemberCard key={rsvp.id} rsvp={rsvp} variant="yes" />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Peut-être */}
          {groupedRSVPs.maybe.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <h4 className="font-semibold text-[var(--fg-primary)]">
                  Peut-être ({groupedRSVPs.maybe.length})
                </h4>
              </div>
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {groupedRSVPs.maybe.map((rsvp) => (
                    <RSVPMemberCard key={rsvp.id} rsvp={rsvp} variant="maybe" />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Absents */}
          {groupedRSVPs.no.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
                  <X className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <h4 className="font-semibold text-[var(--fg-primary)]">
                  Absents ({groupedRSVPs.no.length})
                </h4>
              </div>
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {groupedRSVPs.no.map((rsvp) => (
                    <RSVPMemberCard key={rsvp.id} rsvp={rsvp} variant="no" />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Pas de réponses */}
          {totalResponses === 0 && (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-[var(--fg-secondary)] font-medium mb-2">
                Aucune réponse pour le moment
              </p>
              <p className="text-sm text-[var(--fg-tertiary)]">
                Sois le premier à répondre !
              </p>
            </div>
          )}
        </div>

        {/* Actions secondaires */}
        <div className="mt-6 flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 text-[var(--fg-secondary)] font-medium hover:bg-gray-200 transition-colors">
            <Share2 className="w-4 h-4" />
            Partager
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 text-[var(--fg-secondary)] font-medium hover:bg-gray-200 transition-colors">
            <Bell className="w-4 h-4" />
            Rappel
          </button>
        </div>
      </div>
    </div>
  );
}

// Composant Card membre RSVP
interface RSVPMemberCardProps {
  rsvp: RSVP;
  variant: 'yes' | 'no' | 'maybe';
}

function RSVPMemberCard({ rsvp, variant }: RSVPMemberCardProps) {
  const bgColors = {
    yes: 'bg-emerald-50',
    no: 'bg-red-50',
    maybe: 'bg-amber-50',
  };

  const badgeColors = {
    yes: 'bg-emerald-500',
    no: 'bg-red-500',
    maybe: 'bg-amber-500',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`flex items-center gap-3 p-3 rounded-xl ${bgColors[variant]}`}
    >
      {/* Avatar avec badge */}
      <div className="relative">
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-200">
          {rsvp.user.avatar_url ? (
            <img
              src={rsvp.user.avatar_url}
              alt={rsvp.user.display_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold text-lg">
              {rsvp.user.display_name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${badgeColors[variant]}`}>
          {variant === 'yes' && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
          {variant === 'no' && <X className="w-3 h-3 text-white" strokeWidth={3} />}
          {variant === 'maybe' && <HelpCircle className="w-3 h-3 text-white" strokeWidth={3} />}
        </div>
      </div>

      {/* Info utilisateur */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[var(--fg-primary)] truncate">
          {rsvp.user.display_name}
        </p>
        <p className="text-xs text-[var(--fg-tertiary)]">
          {new Date(rsvp.responded_at).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      {/* Score de fiabilité */}
      {rsvp.user.reliability_score !== undefined && rsvp.user.reliability_score > 0 && (
        <div className="flex items-center gap-1 px-2.5 py-1.5 bg-white rounded-lg border border-gray-200">
          <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-semibold text-[var(--fg-secondary)]">
            {Math.round(rsvp.user.reliability_score)}%
          </span>
        </div>
      )}
    </motion.div>
  );
}

export default RSVPScreen;
