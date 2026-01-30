// @ts-nocheck
/**
 * RSVP SCREEN - Linear Dark Design
 * Design system: Linear.app inspired
 * Background: #08090a, Semantic colors for RSVP buttons
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
  Gamepad2,
  TrendingUp,
  Bell,
  Share2,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Timer,
} from 'lucide-react';
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

  // Stats calculees
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
      setSession(data as unknown as Session);

      const rsvps = (data as any)?.rsvps as any[] | null;
      if (userProfile?.id && rsvps) {
        const userRSVP = rsvps.find((r: any) => r.user?.id === userProfile.id);
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

  // Real-time subscription
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
        yes: 'Presence confirmee !',
        no: 'Absence enregistree',
        maybe: 'Reponse enregistree : peut-etre',
      };
      showToast?.(messages[response], 'success');

      await loadSession();
    } catch (err: any) {
      console.error('Error submitting RSVP:', err);
      showToast?.(err.message || 'Erreur lors de la reponse', 'error');
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

  // Grouper les RSVPs par reponse
  const groupedRSVPs = {
    yes: session?.rsvps.filter(r => r.response === 'yes') || [],
    maybe: session?.rsvps.filter(r => r.response === 'maybe') || [],
    no: session?.rsvps.filter(r => r.response === 'no') || [],
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090a]">
        <div className="px-4 py-6 max-w-2xl mx-auto">
          {/* Header skeleton */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#18191b] animate-pulse" />
            <div className="flex-1">
              <div className="h-5 w-40 bg-[#18191b] rounded animate-pulse mb-2" />
              <div className="h-4 w-24 bg-[#18191b] rounded animate-pulse" />
            </div>
          </div>
          {/* Card skeleton */}
          <div className="bg-[#101113] border border-[rgba(255,255,255,0.08)] rounded-xl p-5 mb-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#18191b] animate-pulse" />
              <div className="flex-1">
                <div className="h-5 w-48 bg-[#18191b] rounded animate-pulse mb-2" />
                <div className="h-4 w-32 bg-[#18191b] rounded animate-pulse" />
              </div>
            </div>
          </div>
          {/* Progress skeleton */}
          <div className="bg-[#101113] border border-[rgba(255,255,255,0.08)] rounded-xl p-5 mb-4">
            <div className="h-3 bg-[#18191b] rounded-full animate-pulse mb-4" />
            <div className="flex gap-6">
              <div className="h-8 w-20 bg-[#18191b] rounded animate-pulse" />
              <div className="h-8 w-20 bg-[#18191b] rounded animate-pulse" />
              <div className="h-8 w-20 bg-[#18191b] rounded animate-pulse" />
            </div>
          </div>
          {/* Buttons skeleton */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="h-24 bg-[#101113] border border-[rgba(255,255,255,0.08)] rounded-xl animate-pulse" />
            <div className="h-24 bg-[#101113] border border-[rgba(255,255,255,0.08)] rounded-xl animate-pulse" />
            <div className="h-24 bg-[#101113] border border-[rgba(255,255,255,0.08)] rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !session) {
    return (
      <div className="min-h-screen bg-[#08090a] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm w-full"
        >
          <div className="bg-[#101113] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 text-center">
            <div className="w-14 h-14 rounded-xl bg-[rgba(255,85,85,0.1)] border border-[rgba(255,85,85,0.2)] flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7 text-[#ff5555]" />
            </div>
            <h2 className="text-lg font-semibold text-[#f7f8f8] mb-2" style={{ fontWeight: 510 }}>
              Session introuvable
            </h2>
            <p className="text-sm text-[#8a8f98] mb-6">
              {error || "Cette session n'existe pas ou a ete supprimee."}
            </p>
            <button
              onClick={handleBack}
              className="w-full h-10 bg-[#5e6dd2] hover:bg-[#6977dc] text-white font-medium rounded-lg transition-all duration-150"
              style={{ fontWeight: 510 }}
            >
              Retour
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const { date, time } = formatDateTime(session.scheduled_date, session.scheduled_time);

  return (
    <div className="min-h-screen pb-32 bg-[#08090a]">
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <motion.button
              onClick={handleBack}
              className="w-10 h-10 rounded-lg bg-[#101113] border border-[rgba(255,255,255,0.08)] flex items-center justify-center hover:bg-[#18191b] hover:border-[rgba(255,255,255,0.12)] transition-all duration-150"
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-[#8a8f98]" />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-[#f7f8f8] tracking-tight" style={{ fontWeight: 510 }}>
                Repondre a la session
              </h1>
              <p className="text-sm text-[#8a8f98]">
                {session.squad.name}
              </p>
            </div>
            <motion.button
              onClick={loadSession}
              className="w-9 h-9 rounded-lg bg-[#101113] border border-[rgba(255,255,255,0.08)] flex items-center justify-center hover:bg-[#18191b] hover:border-[rgba(255,255,255,0.12)] transition-all duration-150"
              whileTap={{ scale: 0.95 }}
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <RefreshCw className="w-4 h-4 text-[#5d6066]" />
            </motion.button>
          </div>

          {/* Session Info Card */}
          <div className="bg-[#101113] border border-[rgba(255,255,255,0.08)] rounded-xl p-5 mb-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-[rgba(94,109,210,0.1)] border border-[rgba(94,109,210,0.2)] flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-[#5e6dd2]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-[#f7f8f8] truncate" style={{ fontWeight: 510 }}>
                  {session.title}
                </h2>
                <p className="text-sm text-[#8a8f98]">
                  {session.squad.game}
                </p>
              </div>
            </div>

            {session.description && (
              <p className="text-sm text-[#8a8f98] mb-4 leading-relaxed">
                {session.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#18191b] rounded-lg border border-[rgba(255,255,255,0.04)]">
                <Calendar className="w-3.5 h-3.5 text-[#5e6dd2]" />
                <span className="text-xs font-medium text-[#8a8f98]" style={{ fontWeight: 510 }}>{date}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#18191b] rounded-lg border border-[rgba(255,255,255,0.04)]">
                <Clock className="w-3.5 h-3.5 text-[#945cf2]" />
                <span className="text-xs font-medium text-[#8a8f98]" style={{ fontWeight: 510 }}>{time}</span>
              </div>
              {session.duration && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#18191b] rounded-lg border border-[rgba(255,255,255,0.04)]">
                  <Timer className="w-3.5 h-3.5 text-[#ff8c42]" />
                  <span className="text-xs font-medium text-[#8a8f98]" style={{ fontWeight: 510 }}>{session.duration}</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-[#101113] border border-[rgba(255,255,255,0.08)] rounded-xl p-5 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#f7f8f8]" style={{ fontWeight: 510 }}>
                Progression
              </h3>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#18191b]">
                <Users className="w-3.5 h-3.5 text-[#5d6066]" />
                <span className="text-xs font-semibold text-[#f7f8f8]" style={{ fontWeight: 510 }}>
                  {yesCount}/{requiredPlayers}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-[#18191b] rounded-full overflow-hidden mb-3">
              <motion.div
                className={`absolute inset-y-0 left-0 rounded-full ${isComplete ? 'bg-[#25bc68]' : 'bg-[#5e6dd2]'}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(completionRate, 100)}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>

            <p className="text-xs text-[#8a8f98] mb-4">
              {isComplete ? (
                <span className="flex items-center gap-1.5 text-[#25bc68]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Session complete ! Prets a jouer
                </span>
              ) : (
                <span>Encore {requiredPlayers - yesCount} joueur{requiredPlayers - yesCount > 1 ? 's' : ''} pour completer la session</span>
              )}
            </p>

            {/* Stats */}
            <div className="flex gap-4 pt-4 border-t border-[rgba(255,255,255,0.04)]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-[rgba(37,188,104,0.1)] flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-[#25bc68]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#5d6066] uppercase tracking-wide">Confirmes</p>
                  <p className="text-sm font-semibold text-[#f7f8f8]" style={{ fontWeight: 510 }}>{yesCount}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-[rgba(255,140,66,0.1)] flex items-center justify-center">
                  <HelpCircle className="w-3.5 h-3.5 text-[#ff8c42]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#5d6066] uppercase tracking-wide">Peut-etre</p>
                  <p className="text-sm font-semibold text-[#f7f8f8]" style={{ fontWeight: 510 }}>{maybeCount}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-[rgba(255,85,85,0.1)] flex items-center justify-center">
                  <X className="w-3.5 h-3.5 text-[#ff5555]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#5d6066] uppercase tracking-wide">Absents</p>
                  <p className="text-sm font-semibold text-[#f7f8f8]" style={{ fontWeight: 510 }}>{noCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RSVP Buttons */}
          <div className="bg-[#101113] border border-[rgba(255,255,255,0.08)] rounded-xl p-5 mb-4">
            <h3 className="text-sm font-semibold text-[#f7f8f8] mb-4" style={{ fontWeight: 510 }}>
              Ta reponse
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {/* Partant - Vert */}
              <motion.button
                onClick={() => handleRSVP('yes')}
                disabled={isSubmitting}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-150 ${
                  currentUserRSVP === 'yes'
                    ? 'bg-[rgba(37,188,104,0.15)] border-[rgba(37,188,104,0.4)]'
                    : 'bg-[#18191b] border-[rgba(255,255,255,0.08)] hover:border-[rgba(37,188,104,0.3)] hover:bg-[rgba(37,188,104,0.05)]'
                }`}
                whileTap={{ scale: 0.97 }}
              >
                {isSubmitting && currentUserRSVP !== 'yes' ? (
                  <Loader2 className="w-6 h-6 animate-spin text-[#5d6066]" />
                ) : (
                  <>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      currentUserRSVP === 'yes'
                        ? 'bg-[#25bc68]'
                        : 'bg-[rgba(37,188,104,0.1)] border border-[rgba(37,188,104,0.2)]'
                    }`}>
                      <Check className={`w-5 h-5 ${currentUserRSVP === 'yes' ? 'text-white' : 'text-[#25bc68]'}`} strokeWidth={2.5} />
                    </div>
                    <span className={`text-sm font-medium ${
                      currentUserRSVP === 'yes' ? 'text-[#25bc68]' : 'text-[#8a8f98]'
                    }`} style={{ fontWeight: 510 }}>
                      Partant
                    </span>
                  </>
                )}
              </motion.button>

              {/* Peut-etre - Orange */}
              <motion.button
                onClick={() => handleRSVP('maybe')}
                disabled={isSubmitting}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-150 ${
                  currentUserRSVP === 'maybe'
                    ? 'bg-[rgba(255,140,66,0.15)] border-[rgba(255,140,66,0.4)]'
                    : 'bg-[#18191b] border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,140,66,0.3)] hover:bg-[rgba(255,140,66,0.05)]'
                }`}
                whileTap={{ scale: 0.97 }}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  currentUserRSVP === 'maybe'
                    ? 'bg-[#ff8c42]'
                    : 'bg-[rgba(255,140,66,0.1)] border border-[rgba(255,140,66,0.2)]'
                }`}>
                  <HelpCircle className={`w-5 h-5 ${currentUserRSVP === 'maybe' ? 'text-white' : 'text-[#ff8c42]'}`} strokeWidth={2.5} />
                </div>
                <span className={`text-sm font-medium ${
                  currentUserRSVP === 'maybe' ? 'text-[#ff8c42]' : 'text-[#8a8f98]'
                }`} style={{ fontWeight: 510 }}>
                  Peut-etre
                </span>
              </motion.button>

              {/* Absent - Rouge */}
              <motion.button
                onClick={() => handleRSVP('no')}
                disabled={isSubmitting}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-150 ${
                  currentUserRSVP === 'no'
                    ? 'bg-[rgba(255,85,85,0.15)] border-[rgba(255,85,85,0.4)]'
                    : 'bg-[#18191b] border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,85,85,0.3)] hover:bg-[rgba(255,85,85,0.05)]'
                }`}
                whileTap={{ scale: 0.97 }}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  currentUserRSVP === 'no'
                    ? 'bg-[#ff5555]'
                    : 'bg-[rgba(255,85,85,0.1)] border border-[rgba(255,85,85,0.2)]'
                }`}>
                  <X className={`w-5 h-5 ${currentUserRSVP === 'no' ? 'text-white' : 'text-[#ff5555]'}`} strokeWidth={2.5} />
                </div>
                <span className={`text-sm font-medium ${
                  currentUserRSVP === 'no' ? 'text-[#ff5555]' : 'text-[#8a8f98]'
                }`} style={{ fontWeight: 510 }}>
                  Absent
                </span>
              </motion.button>
            </div>

            {currentUserRSVP && (
              <p className="text-xs text-center text-[#5d6066] mt-3">
                Clique sur un autre bouton pour modifier ta reponse
              </p>
            )}
          </div>

          {/* Members List */}
          <div className="space-y-3">
            {/* Confirmes */}
            {groupedRSVPs.yes.length > 0 && (
              <div className="bg-[#101113] border border-[rgba(255,255,255,0.08)] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md bg-[rgba(37,188,104,0.1)] flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-[#25bc68]" strokeWidth={2.5} />
                  </div>
                  <h4 className="text-sm font-semibold text-[#f7f8f8]" style={{ fontWeight: 510 }}>
                    Confirmes ({groupedRSVPs.yes.length})
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

            {/* Peut-etre */}
            {groupedRSVPs.maybe.length > 0 && (
              <div className="bg-[#101113] border border-[rgba(255,255,255,0.08)] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md bg-[rgba(255,140,66,0.1)] flex items-center justify-center">
                    <HelpCircle className="w-3.5 h-3.5 text-[#ff8c42]" strokeWidth={2.5} />
                  </div>
                  <h4 className="text-sm font-semibold text-[#f7f8f8]" style={{ fontWeight: 510 }}>
                    Peut-etre ({groupedRSVPs.maybe.length})
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
              <div className="bg-[#101113] border border-[rgba(255,255,255,0.08)] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md bg-[rgba(255,85,85,0.1)] flex items-center justify-center">
                    <X className="w-3.5 h-3.5 text-[#ff5555]" strokeWidth={2.5} />
                  </div>
                  <h4 className="text-sm font-semibold text-[#f7f8f8]" style={{ fontWeight: 510 }}>
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

            {/* Empty state */}
            {totalResponses === 0 && (
              <div className="bg-[#101113] border border-[rgba(255,255,255,0.08)] rounded-xl p-8 text-center">
                <div className="w-14 h-14 rounded-xl bg-[#18191b] border border-[rgba(255,255,255,0.08)] flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-[#5d6066]" />
                </div>
                <p className="text-sm font-medium text-[#f7f8f8] mb-1" style={{ fontWeight: 510 }}>
                  Aucune reponse pour le moment
                </p>
                <p className="text-xs text-[#5d6066]">
                  Sois le premier a repondre !
                </p>
              </div>
            )}
          </div>

          {/* Secondary Actions */}
          <div className="mt-4 flex gap-3">
            <motion.button
              className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-[#18191b] border border-[rgba(255,255,255,0.08)] text-[#8a8f98] text-sm font-medium hover:bg-[#101113] hover:border-[rgba(255,255,255,0.12)] transition-all duration-150"
              style={{ fontWeight: 510 }}
              whileTap={{ scale: 0.98 }}
            >
              <Share2 className="w-4 h-4" />
              Partager
            </motion.button>
            <motion.button
              className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-[#18191b] border border-[rgba(255,255,255,0.08)] text-[#8a8f98] text-sm font-medium hover:bg-[#101113] hover:border-[rgba(255,255,255,0.12)] transition-all duration-150"
              style={{ fontWeight: 510 }}
              whileTap={{ scale: 0.98 }}
            >
              <Bell className="w-4 h-4" />
              Rappel
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Member Card Component
interface RSVPMemberCardProps {
  rsvp: RSVP;
  variant: 'yes' | 'no' | 'maybe';
}

function RSVPMemberCard({ rsvp, variant }: RSVPMemberCardProps) {
  const colors = {
    yes: {
      bg: 'bg-[rgba(37,188,104,0.05)]',
      border: 'border-[rgba(37,188,104,0.1)]',
      badge: 'bg-[#25bc68]',
      icon: <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />,
    },
    maybe: {
      bg: 'bg-[rgba(255,140,66,0.05)]',
      border: 'border-[rgba(255,140,66,0.1)]',
      badge: 'bg-[#ff8c42]',
      icon: <HelpCircle className="w-2.5 h-2.5 text-white" strokeWidth={3} />,
    },
    no: {
      bg: 'bg-[rgba(255,85,85,0.05)]',
      border: 'border-[rgba(255,85,85,0.1)]',
      badge: 'bg-[#ff5555]',
      icon: <X className="w-2.5 h-2.5 text-white" strokeWidth={3} />,
    },
  };

  const style = colors[variant];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className={`flex items-center gap-3 p-3 rounded-lg ${style.bg} border ${style.border}`}
    >
      {/* Avatar */}
      <div className="relative">
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#18191b]">
          {rsvp.user.avatar_url ? (
            <img
              src={rsvp.user.avatar_url}
              alt={rsvp.user.display_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#5e6dd2] to-[#945cf2] text-white font-semibold text-sm">
              {rsvp.user.display_name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${style.badge} flex items-center justify-center ring-2 ring-[#101113]`}>
          {style.icon}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#f7f8f8] truncate" style={{ fontWeight: 510 }}>
          {rsvp.user.display_name}
        </p>
        <p className="text-xs text-[#5d6066]">
          {new Date(rsvp.responded_at).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      {/* Reliability Score */}
      {rsvp.user.reliability_score !== undefined && rsvp.user.reliability_score > 0 && (
        <div className="flex items-center gap-1 px-2 py-1 bg-[#18191b] rounded-md border border-[rgba(255,255,255,0.04)]">
          <TrendingUp className="w-3 h-3 text-[#ff8c42]" />
          <span className="text-xs font-semibold text-[#f7f8f8]" style={{ fontWeight: 510 }}>
            {Math.round(rsvp.user.reliability_score)}%
          </span>
        </div>
      )}
    </motion.div>
  );
}

export default RSVPScreen;
