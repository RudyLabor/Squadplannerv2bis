// @ts-nocheck
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
  Gamepad2,
  TrendingUp,
  Bell,
  Share2,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Timer,
  Sparkles,
} from 'lucide-react';
import { sessionsAPI } from '@/app/services/api';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/app/contexts/UserContext';
import { Button, Card, Badge, SkeletonPage } from '@/design-system';

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

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
      // Type assertion to handle Supabase relation typing
      setSession(data as unknown as Session);

      // Trouver le RSVP de l'utilisateur actuel
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
      <div className="min-h-screen bg-[var(--bg-base)]">
        <SkeletonPage />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card variant="elevated" padding="xl" className="text-center max-w-md bg-[var(--bg-elevated)]/80 backdrop-blur-sm border-[var(--border-subtle)]/50 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-error-500)] to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[var(--color-error-500)]/30">
              <AlertCircle className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-[var(--fg-primary)] mb-2">
              Session introuvable
            </h2>
            <p className="text-sm text-[var(--fg-secondary)] font-medium mb-6">
              {error || 'Cette session n\'existe pas ou a ete supprimee.'}
            </p>
            <Button onClick={handleBack} variant="primary" fullWidth>
              Retour
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  const { date, time } = formatDateTime(session.scheduled_date, session.scheduled_time);

  return (
    <div className="min-h-screen pb-32 pt-safe bg-[var(--bg-base)] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[var(--color-success-400)]/20 to-teal-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-[var(--color-primary-400)]/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-warning-400)]/15 to-orange-400/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.35 }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
              <motion.button
                onClick={handleBack}
                className="w-12 h-12 rounded-2xl bg-[var(--bg-elevated)]/80 backdrop-blur-sm border border-[var(--border-subtle)]/50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
              </motion.button>
              <div className="flex-1">
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-[var(--color-primary-600)] to-purple-600 bg-clip-text text-transparent">
                  Repondre a la session
                </h1>
                <p className="text-sm text-[var(--fg-secondary)] font-medium">
                  {session.squad.name}
                </p>
              </div>
              <motion.button
                onClick={loadSession}
                className="w-10 h-10 rounded-xl bg-[var(--bg-elevated)]/80 backdrop-blur-sm border border-[var(--border-subtle)]/50 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
              >
                <RefreshCw className="w-4 h-4 text-[var(--fg-secondary)]" />
              </motion.button>
            </motion.div>

          {/* Session Info Card */}
          <motion.div variants={itemVariants}>
            <Card variant="elevated" padding="lg" className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm border-[var(--border-subtle)]/50 shadow-lg mb-6">
              <div className="flex items-start gap-4 mb-4">
                <motion.div
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-primary-500)] to-purple-600 flex items-center justify-center shadow-lg shadow-[var(--color-primary-500)]/30"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Gamepad2 className="w-7 h-7 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold tracking-tight text-[var(--fg-primary)] mb-1">
                    {session.title}
                  </h2>
                  <p className="text-sm text-[var(--fg-secondary)] font-medium">
                    {session.squad.game}
                  </p>
                </div>
              </div>

              {session.description && (
                <p className="text-sm text-[var(--fg-secondary)] font-medium mb-4 leading-relaxed">
                  {session.description}
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-primary-50)] rounded-xl">
                  <Calendar className="w-4 h-4 text-[var(--color-primary-500)]" />
                  <span className="text-sm font-semibold text-[var(--color-primary-700)]">{date}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-xl">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-semibold text-purple-700">{time}</span>
                </div>
                {session.duration && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-pink-50 rounded-xl">
                    <Timer className="w-4 h-4 text-pink-500" />
                    <span className="text-sm font-semibold text-pink-700">{session.duration}</span>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Jauge de completion */}
          <motion.div
            variants={itemVariants}
            className={`rounded-2xl p-5 mb-6 shadow-xl relative overflow-hidden ${
              isComplete
                ? 'bg-gradient-to-br from-[var(--color-success-500)] to-teal-500 shadow-[var(--color-success-500)]/30'
                : 'bg-gradient-to-br from-[var(--color-warning-500)] to-orange-500 shadow-[var(--color-warning-500)]/30'
            }`}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-white">
                  Progression
                </h3>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm font-bold text-white">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{yesCount}/{requiredPlayers}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-3 bg-white/20 rounded-full overflow-hidden mb-3">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(completionRate, 100)}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>

              <p className="text-sm font-medium text-white/90">
                {isComplete ? (
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Session complète ! Prêts à jouer
                  </span>
                ) : (
                  <span>Encore {requiredPlayers - yesCount} joueur{requiredPlayers - yesCount > 1 ? 's' : ''} pour compléter la session</span>
                )}
              </p>

              {/* Stats mini */}
              <div className="flex gap-4 mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/70">Confirmés</p>
                    <p className="text-sm font-bold text-white">{yesCount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/70">Peut-être</p>
                    <p className="text-sm font-bold text-white">{maybeCount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <X className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/70">Absents</p>
                    <p className="text-sm font-bold text-white">{noCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Boutons d'action rapide */}
          <motion.div
            variants={itemVariants}
            className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl p-5 border border-[var(--border-subtle)]/50 shadow-lg mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[var(--color-primary-500)]" />
              <h3 className="text-base font-bold tracking-tight text-[var(--fg-primary)]">
                Ta reponse
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <motion.button
                onClick={() => handleRSVP('yes')}
                disabled={isSubmitting}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  currentUserRSVP === 'yes'
                    ? 'bg-[var(--color-success-50)] border-[var(--color-success-500)] ring-2 ring-[var(--color-success-200)]'
                    : 'bg-[var(--bg-elevated)]/80 border-[var(--border-subtle)] hover:border-[var(--color-success-300)] hover:bg-[var(--color-success-50)]'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting && currentUserRSVP !== 'yes' ? (
                  <Loader2 className="w-8 h-8 animate-spin text-[var(--fg-tertiary)]" />
                ) : (
                  <>
                    <motion.div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                        currentUserRSVP === 'yes'
                          ? 'bg-gradient-to-br from-[var(--color-success-500)] to-teal-500 shadow-[var(--color-success-500)]/30'
                          : 'bg-[var(--color-success-100)]'
                      }`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Check className={`w-6 h-6 ${
                        currentUserRSVP === 'yes' ? 'text-white' : 'text-[var(--color-success-600)]'
                      }`} strokeWidth={2.5} />
                    </motion.div>
                    <span className={`text-sm font-bold ${
                      currentUserRSVP === 'yes' ? 'text-[var(--color-success-700)]' : 'text-[var(--fg-primary)]'
                    }`}>
                      Partant
                    </span>
                  </>
                )}
              </motion.button>

              <motion.button
                onClick={() => handleRSVP('maybe')}
                disabled={isSubmitting}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  currentUserRSVP === 'maybe'
                    ? 'bg-[var(--color-warning-50)] border-[var(--color-warning-500)] ring-2 ring-[var(--color-warning-200)]'
                    : 'bg-[var(--bg-elevated)]/80 border-[var(--border-subtle)] hover:border-[var(--color-warning-300)] hover:bg-[var(--color-warning-50)]'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                    currentUserRSVP === 'maybe'
                      ? 'bg-gradient-to-br from-[var(--color-warning-500)] to-orange-500 shadow-[var(--color-warning-500)]/30'
                      : 'bg-[var(--color-warning-100)]'
                  }`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <HelpCircle className={`w-6 h-6 ${
                    currentUserRSVP === 'maybe' ? 'text-white' : 'text-[var(--color-warning-600)]'
                  }`} strokeWidth={2.5} />
                </motion.div>
                <span className={`text-sm font-bold ${
                  currentUserRSVP === 'maybe' ? 'text-[var(--color-warning-700)]' : 'text-[var(--fg-primary)]'
                }`}>
                  Peut-etre
                </span>
              </motion.button>

              <motion.button
                onClick={() => handleRSVP('no')}
                disabled={isSubmitting}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  currentUserRSVP === 'no'
                    ? 'bg-[var(--color-error-50)] border-[var(--color-error-500)] ring-2 ring-[var(--color-error-200)]'
                    : 'bg-[var(--bg-elevated)]/80 border-[var(--border-subtle)] hover:border-[var(--color-error-300)] hover:bg-[var(--color-error-50)]'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                    currentUserRSVP === 'no'
                      ? 'bg-gradient-to-br from-[var(--color-error-500)] to-orange-500 shadow-[var(--color-error-500)]/30'
                      : 'bg-[var(--color-error-100)]'
                  }`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <X className={`w-6 h-6 ${
                    currentUserRSVP === 'no' ? 'text-white' : 'text-[var(--color-error-600)]'
                  }`} strokeWidth={2.5} />
                </motion.div>
                <span className={`text-sm font-bold ${
                  currentUserRSVP === 'no' ? 'text-[var(--color-error-700)]' : 'text-[var(--fg-primary)]'
                }`}>
                  Absent
                </span>
              </motion.button>
            </div>

            {currentUserRSVP && (
              <p className="text-xs text-center text-[var(--fg-secondary)] font-medium mt-3">
                Clique sur un autre bouton pour modifier ta reponse
              </p>
            )}
          </motion.div>

          {/* Liste des membres par statut */}
          <div className="space-y-4">

            {/* Confirmes */}
            {groupedRSVPs.yes.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl p-5 border border-[var(--border-subtle)]/50 shadow-lg"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-success-500)] to-teal-500 flex items-center justify-center shadow-md">
                    <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                  <h4 className="font-bold tracking-tight text-[var(--fg-primary)]">
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
              </motion.div>
            )}

            {/* Peut-etre */}
            {groupedRSVPs.maybe.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl p-5 border border-[var(--border-subtle)]/50 shadow-lg"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-warning-500)] to-orange-500 flex items-center justify-center shadow-md">
                    <HelpCircle className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                  <h4 className="font-bold tracking-tight text-[var(--fg-primary)]">
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
              </motion.div>
            )}

            {/* Absents */}
            {groupedRSVPs.no.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl p-5 border border-[var(--border-subtle)]/50 shadow-lg"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-error-500)] to-orange-500 flex items-center justify-center shadow-md">
                    <X className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                  <h4 className="font-bold tracking-tight text-[var(--fg-primary)]">
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
              </motion.div>
            )}

            {/* Pas de reponses */}
            {totalResponses === 0 && (
              <motion.div
                variants={itemVariants}
                className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl p-8 border border-[var(--border-subtle)]/50 shadow-lg text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--bg-subtle)] to-slate-200 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-[var(--fg-secondary)]" />
                </div>
                <p className="text-[var(--fg-primary)] font-semibold mb-2">
                  Aucune reponse pour le moment
                </p>
                <p className="text-sm text-[var(--fg-secondary)]">
                  Sois le premier a repondre !
                </p>
              </motion.div>
            )}
          </div>

          {/* Actions secondaires */}
          <motion.div variants={itemVariants} className="mt-6 flex gap-3">
            <motion.button
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--bg-elevated)]/80 backdrop-blur-sm border border-[var(--border-subtle)]/50 text-[var(--fg-secondary)] font-semibold hover:shadow-lg transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Share2 className="w-4 h-4" />
              Partager
            </motion.button>
            <motion.button
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--bg-elevated)]/80 backdrop-blur-sm border border-[var(--border-subtle)]/50 text-[var(--fg-secondary)] font-semibold hover:shadow-lg transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Bell className="w-4 h-4" />
              Rappel
            </motion.button>
          </motion.div>
          </motion.div>
        </motion.div>
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
    yes: 'bg-[var(--color-success-50)]',
    no: 'bg-[var(--color-error-50)]',
    maybe: 'bg-[var(--color-warning-50)]',
  };

  const badgeGradients = {
    yes: 'from-[var(--color-success-500)] to-teal-500',
    no: 'from-[var(--color-error-500)] to-orange-500',
    maybe: 'from-[var(--color-warning-500)] to-orange-500',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`flex items-center gap-3 p-3 rounded-xl ${bgColors[variant]}`}
      whileHover={{ scale: 1.02 }}
    >
      {/* Avatar avec badge */}
      <div className="relative">
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-[var(--color-primary-500)] to-purple-500">
          {rsvp.user.avatar_url ? (
            <img
              src={rsvp.user.avatar_url}
              alt={rsvp.user.display_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
              {rsvp.user.display_name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br ${badgeGradients[variant]} flex items-center justify-center shadow-md`}>
          {variant === 'yes' && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
          {variant === 'no' && <X className="w-3 h-3 text-white" strokeWidth={3} />}
          {variant === 'maybe' && <HelpCircle className="w-3 h-3 text-white" strokeWidth={3} />}
        </div>
      </div>

      {/* Info utilisateur */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[var(--fg-primary)] truncate">
          {rsvp.user.display_name}
        </p>
        <p className="text-xs text-[var(--fg-secondary)]">
          {new Date(rsvp.responded_at).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      {/* Score de fiabilite */}
      {rsvp.user.reliability_score !== undefined && rsvp.user.reliability_score > 0 && (
        <div className="flex items-center gap-1 px-2.5 py-1.5 bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-subtle)] shadow-sm">
          <TrendingUp className="w-3.5 h-3.5 text-[var(--color-warning-500)]" />
          <span className="text-xs font-bold text-[var(--fg-primary)]">
            {Math.round(rsvp.user.reliability_score)}%
          </span>
        </div>
      )}
    </motion.div>
  );
}

export default RSVPScreen;
