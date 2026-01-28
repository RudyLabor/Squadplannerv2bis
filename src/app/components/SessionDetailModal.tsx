/**
 * 📋 SESSION DETAIL MODAL - Détails complets d'une session
 * Avec système RSVP temps réel
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MapPin, Users, Edit, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SessionRSVPCard } from './SessionRSVPCard';
import { NoShowPrediction } from './NoShowPrediction';
import { sessionsAPI } from '@/app/services/api';
import { useAuth } from '@/app/contexts/AuthContext';

interface SessionDetailModalProps {
  sessionId: string;
  isOpen: boolean;
  onClose: () => void;
  onRSVP?: (response: 'yes' | 'no' | 'maybe') => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function SessionDetailModal({
  sessionId,
  isOpen,
  onClose,
  onRSVP: onRSVPProp,
  showToast,
}: SessionDetailModalProps) {
  const { user } = useAuth();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && sessionId) {
      loadSession();
    }
  }, [isOpen, sessionId]);

  const loadSession = async () => {
    setLoading(true);
    setError(null);
    try {
      const { session: data } = await sessionsAPI.getById(sessionId);
      setSession(data);
    } catch (err: any) {
      console.error('Error loading session:', err);
      setError(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (response: 'yes' | 'no' | 'maybe') => {
    try {
      await sessionsAPI.rsvp(sessionId, response);

      // Notification
      const messages = {
        yes: 'Présence confirmée ! ✅',
        no: 'Absence notée',
        maybe: 'Réponse mise à jour',
      };
      showToast?.(messages[response], 'success');

      // Callback parent
      onRSVPProp?.(response);

      // Reload session data
      await loadSession();
    } catch (err: any) {
      console.error('Error submitting RSVP:', err);
      showToast?.('Erreur lors de la réponse', 'error');
      throw err;
    }
  };

  if (!isOpen) return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', damping: 25, stiffness: 300 }
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.95,
      transition: { duration: 0.2 }
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white w-full max-w-2xl max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-br from-amber-500 to-amber-600 p-6 pb-8">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-6 bg-white/20 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-white/20 rounded w-1/2" />
                  </div>
                ) : error ? (
                  <div className="text-white">
                    <p className="font-semibold">Erreur</p>
                    <p className="text-sm opacity-90">{error}</p>
                  </div>
                ) : session ? (
                  <>
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-2">
                          {session.title}
                        </h2>
                        <p className="text-white/90 text-sm">
                          {session.squad?.name} • {session.squad?.game}
                        </p>
                      </div>
                      {session.squad?.game && (
                        <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg">
                          <img
                            src={`https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop`}
                            alt={session.squad.game}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </>
                ) : null}
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6 space-y-6">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-600">Impossible de charger la session</p>
                    <button
                      onClick={loadSession}
                      className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600"
                    >
                      Réessayer
                    </button>
                  </div>
                ) : session ? (
                  <>
                    {/* Informations */}
                    <div className="space-y-3">
                      <InfoRow
                        icon={Calendar}
                        label="Date"
                        value={new Date(session.scheduled_date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      />
                      <InfoRow
                        icon={Clock}
                        label="Heure"
                        value={session.scheduled_time}
                      />
                      {session.duration && (
                        <InfoRow
                          icon={Clock}
                          label="Durée"
                          value={`${session.duration} minutes`}
                        />
                      )}
                      <InfoRow
                        icon={Users}
                        label="Joueurs requis"
                        value={`${session.required_players || 5} joueurs`}
                      />
                    </div>

                    {/* Description */}
                    {session.description && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {session.description}
                        </p>
                      </div>
                    )}

                    {/* RSVP Card avec real-time */}
                    <SessionRSVPCard
                      sessionId={sessionId}
                      rsvps={session.rsvps || []}
                      requiredPlayers={session.required_players || 5}
                      currentUserRSVP={
                        session.rsvps?.find((r: any) => r.user?.id === user?.id)?.response
                      }
                      onRSVP={handleRSVP}
                    />

                    {/* Prédiction No-Show (IA) */}
                    {session.rsvps && session.rsvps.length > 0 && (
                      <NoShowPrediction
                        sessionId={sessionId}
                        rsvps={session.rsvps}
                      />
                    )}

                    {/* Actions (si owner) */}
                    {session.proposed_by === user?.id && (
                      <div className="flex gap-2 pt-4 border-t border-gray-100">
                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 transition-colors">
                          <Edit className="w-4 h-4" />
                          Modifier
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 rounded-xl font-medium text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                          Annuler
                        </button>
                      </div>
                    )}
                  </>
                ) : null}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Info Row Component
function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
        <Icon className="w-5 h-5 text-amber-600" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
