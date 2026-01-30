import { ArrowLeft, Beaker, CheckCircle2, Loader2, Users, Trophy, Calendar, Sparkles, Gamepad2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

interface TestSetupScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
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

export function TestSetupScreen({ onNavigate, showToast }: TestSetupScreenProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerateEcosystem = async () => {
    setLoading(true);
    setResult(null);

    try {
      showToast('Génération de l\'écosystème de démo...', 'info');

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e884809f/demo/generate-ecosystem`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la génération');
      }

      setResult(data.data);
      showToast('Écosystème de démo créé avec succès !', 'success');
    } catch (error: any) {
      console.error('Generate ecosystem error:', error);
      showToast(error.message || 'Erreur lors de la génération', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-yellow-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-br from-yellow-400/15 to-amber-400/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
            <motion.button
              onClick={() => onNavigate('home')}
              className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Générateur de Démo
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Créer un écosystème complet
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Gamepad2 className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center py-6 mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 mb-4 shadow-xl shadow-amber-500/30">
              <Beaker className="w-10 h-10 text-white" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Écosystème Gaming</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Générez des données réalistes pour tester l'application
            </p>
          </motion.div>

          {/* Features Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 mb-6 shadow-xl shadow-amber-500/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <h3 className="font-bold text-white">Contenu généré</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/90">
                  <Users className="w-4 h-4" strokeWidth={2} />
                  <span className="text-sm font-medium">18 profils gaming avec avatars et stats</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <Users className="w-4 h-4" strokeWidth={2} />
                  <span className="text-sm font-medium">7 squads actives (Valorant, Apex, LoL)</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <Calendar className="w-4 h-4" strokeWidth={2} />
                  <span className="text-sm font-medium">40-80 sessions avec RSVP</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <Trophy className="w-4 h-4" strokeWidth={2} />
                  <span className="text-sm font-medium">Badges et achievements pour chaque profil</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Credentials Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-yellow-100/80 to-amber-100/80 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-yellow-200/50"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/30 flex-shrink-0">
                <Beaker className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-2">
                  Identifiants de démonstration
                </h3>
                <p className="text-sm text-gray-600 font-medium mb-3">
                  Après génération, connectez-vous avec :
                </p>
                <div className="bg-white/60 rounded-xl p-4 border border-yellow-200/50">
                  <p className="text-xs font-mono text-gray-700 mb-1">
                    <strong>Email :</strong> shadow.ninja@squadplanner.demo
                  </p>
                  <p className="text-xs font-mono text-gray-700 mb-1">
                    <strong>Email :</strong> phoenix.rising@squadplanner.demo
                  </p>
                  <p className="text-xs font-mono text-gray-700 mb-2">
                    <strong>Email :</strong> (ou tout autre profil généré)
                  </p>
                  <p className="text-xs font-mono text-gray-700">
                    <strong>Mot de passe :</strong> Demo1234!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Generate Button */}
          <motion.div variants={itemVariants} className="mb-6">
            <motion.button
              onClick={handleGenerateEcosystem}
              disabled={loading}
              className="w-full h-14 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: loading ? 1 : 1.01, y: loading ? 0 : -2 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />
                  Génération en cours... (30-60 secondes)
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" strokeWidth={2} />
                  Générer l'écosystème complet
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Result */}
          {result && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="bg-gradient-to-br from-emerald-50/80 to-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 shadow-lg mb-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    Écosystème de démo créé !
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    L'application est maintenant remplie de données réalistes
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <motion.div
                  className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center"
                  whileHover={{ scale: 1.02 }}
                >
                  <Users className="w-5 h-5 text-indigo-500 mx-auto mb-2" strokeWidth={2} />
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {result.summary?.usersCount || 0}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">Profils</div>
                </motion.div>

                <motion.div
                  className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center"
                  whileHover={{ scale: 1.02 }}
                >
                  <Users className="w-5 h-5 text-purple-500 mx-auto mb-2" strokeWidth={2} />
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {result.summary?.squadsCount || 0}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">Squads</div>
                </motion.div>

                <motion.div
                  className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center"
                  whileHover={{ scale: 1.02 }}
                >
                  <Calendar className="w-5 h-5 text-emerald-500 mx-auto mb-2" strokeWidth={2} />
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {result.summary?.sessionsCount || 0}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">Sessions</div>
                </motion.div>
              </div>

              {/* Sample Users */}
              {result.users && result.users.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-bold text-gray-600 mb-3">
                    Exemples de profils créés :
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {result.users.slice(0, 6).map((user: any, i: number) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100 shadow-sm"
                        whileHover={{ scale: 1.01 }}
                      >
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-gray-800 truncate">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate font-medium">
                            {user.email}
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg">
                          {user.reliabilityScore}%
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sample Squads */}
              {result.squads && result.squads.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-bold text-gray-600 mb-3">
                    Squads créées :
                  </p>
                  <div className="space-y-2">
                    {result.squads.map((squad: any, i: number) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100 shadow-sm"
                        whileHover={{ scale: 1.01 }}
                      >
                        <img
                          src={squad.avatar}
                          alt={squad.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-gray-800 truncate">
                            {squad.name}
                          </div>
                          <div className="text-xs text-gray-500 font-medium">
                            {squad.game} • {squad.members.length} membres
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Steps */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-600 mb-3">
                  Prochaines étapes :
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    onClick={() => {
                      onNavigate('login');
                      showToast('Utilisez les identifiants de démo pour vous connecter', 'info');
                    }}
                    className="flex items-center justify-center gap-2 py-3 bg-gradient-to-br from-gray-100 to-slate-100 text-gray-700 rounded-xl text-xs font-bold hover:shadow-md transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Se connecter
                  </motion.button>
                  <motion.button
                    onClick={() => onNavigate('squads')}
                    className="flex items-center justify-center gap-2 py-3 bg-gradient-to-br from-gray-100 to-slate-100 text-gray-700 rounded-xl text-xs font-bold hover:shadow-md transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Voir les Squads
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Instructions */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-sm font-bold text-gray-700">Comment tester l'application</h3>
            </div>
            <ol className="text-xs text-gray-500 space-y-2 font-medium">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                <span>Cliquez sur "Générer l'écosystème complet"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                <span>Attendez 30-60 secondes pendant la génération</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                <span>Déconnectez-vous de votre compte actuel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                <span>Reconnectez-vous avec un profil de démo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">5</span>
                <span>Explorez les squads, sessions et profils</span>
              </li>
            </ol>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default TestSetupScreen;
