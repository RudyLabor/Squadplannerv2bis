import { ArrowLeft, Beaker, CheckCircle2, Loader2, Users, Trophy, Calendar, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

interface TestSetupScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function TestSetupScreen({ onNavigate, showToast }: TestSetupScreenProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerateEcosystem = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      showToast('🎮 Génération de l\'écosystème de démo...', 'info');
      
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
      showToast('✅ Écosystème de démo créé avec succès !', 'success');
    } catch (error: any) {
      console.error('Generate ecosystem error:', error);
      showToast(error.message || 'Erreur lors de la génération', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-safe bg-[var(--bg-base)]">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="w-10 h-10 rounded-xl bg-white border-[0.5px] border-[var(--border-medium)] hover:border-[var(--border-strong)] flex items-center justify-center shadow-sm transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-secondary)]" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
              🎮 Générateur de Démo
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] mt-1">
              Créer un écosystème complet de données
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] rounded-2xl p-5 mb-6 border-[0.5px] border-[var(--primary-200)]">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[var(--primary-600)] flex-shrink-0 mt-0.5" strokeWidth={2} />
            <div>
              <p className="text-sm font-semibold text-[var(--fg-primary)] mb-2">
                Génération d'écosystème complet
              </p>
              <p className="text-xs text-[var(--fg-tertiary)] mb-3">
                Cette fonction va créer un environnement de démo réaliste pour Squad Planner avec :
              </p>
              <ul className="text-xs text-[var(--fg-tertiary)] space-y-1.5">
                <li className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[var(--primary-500)]" strokeWidth={2} />
                  <span><strong>18 profils gaming</strong> avec avatars, stats et biographies</span>
                </li>
                <li className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[var(--primary-500)]" strokeWidth={2} />
                  <span><strong>7 squads actives</strong> (Valorant, Overwatch, Apex, LoL)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[var(--primary-500)]" strokeWidth={2} />
                  <span><strong>40-80 sessions</strong> (passées et futures avec RSVP)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Trophy className="w-3.5 h-3.5 text-[var(--primary-500)]" strokeWidth={2} />
                  <span><strong>Badges et achievements</strong> pour chaque profil</span>
                </li>
                <li className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[var(--primary-500)]" strokeWidth={2} />
                  <span><strong>Historique d'activité</strong> pour feed social</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Credentials Info */}
        <div className="bg-gradient-to-br from-[var(--warning-50)] to-[var(--warning-100)] rounded-2xl p-5 mb-6 border-[0.5px] border-[var(--warning-200)]">
          <div className="flex items-start gap-3">
            <Beaker className="w-5 h-5 text-[var(--warning-600)] flex-shrink-0 mt-0.5" strokeWidth={2} />
            <div>
              <p className="text-sm font-semibold text-[var(--fg-primary)] mb-2">
                Identifiants de démonstration
              </p>
              <p className="text-xs text-[var(--fg-tertiary)] mb-2">
                Après génération, vous pourrez vous connecter avec n'importe quel profil généré :
              </p>
              <div className="bg-white/50 rounded-lg p-3 border border-[var(--warning-200)]">
                <p className="text-xs font-mono text-[var(--fg-secondary)] mb-1">
                  <strong>Email :</strong> shadow.ninja@squadplanner.demo
                </p>
                <p className="text-xs font-mono text-[var(--fg-secondary)] mb-1">
                  <strong>Email :</strong> phoenix.rising@squadplanner.demo
                </p>
                <p className="text-xs font-mono text-[var(--fg-secondary)] mb-2">
                  <strong>Email :</strong> (ou tout autre profil généré)
                </p>
                <p className="text-xs font-mono text-[var(--fg-secondary)]">
                  <strong>Mot de passe :</strong> Demo1234!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          variant="primary"
          onClick={handleGenerateEcosystem}
          disabled={loading}
          className="w-full h-14 text-base font-semibold bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] hover:from-[var(--primary-600)] hover:to-[var(--primary-700)] text-white rounded-xl shadow-lg shadow-[var(--primary-500)]/20 transition-all duration-200"
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
        </Button>

        {/* Result */}
        {result && (
          <div className="mt-6 bg-gradient-to-br from-[var(--success-50)] to-white rounded-2xl p-6 border-[0.5px] border-[var(--success-200)] shadow-sm animate-fadeIn">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-[var(--success-500)]" strokeWidth={2} />
              <div>
                <h3 className="text-base font-semibold text-[var(--fg-primary)]">
                  🎉 Écosystème de démo créé !
                </h3>
                <p className="text-xs text-[var(--fg-tertiary)] mt-1">
                  L'application est maintenant remplie de données réalistes
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-subtle)] text-center">
                <Users className="w-5 h-5 text-[var(--primary-500)] mx-auto mb-2" strokeWidth={2} />
                <div className="text-2xl font-bold text-[var(--fg-primary)] mb-1">
                  {result.summary?.usersCount || 0}
                </div>
                <div className="text-xs text-[var(--fg-tertiary)]">Profils</div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-subtle)] text-center">
                <Users className="w-5 h-5 text-[var(--secondary-500)] mx-auto mb-2" strokeWidth={2} />
                <div className="text-2xl font-bold text-[var(--fg-primary)] mb-1">
                  {result.summary?.squadsCount || 0}
                </div>
                <div className="text-xs text-[var(--fg-tertiary)]">Squads</div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-subtle)] text-center">
                <Calendar className="w-5 h-5 text-[var(--success-500)] mx-auto mb-2" strokeWidth={2} />
                <div className="text-2xl font-bold text-[var(--fg-primary)] mb-1">
                  {result.summary?.sessionsCount || 0}
                </div>
                <div className="text-xs text-[var(--fg-tertiary)]">Sessions</div>
              </div>
            </div>

            {/* Sample Users */}
            {result.users && result.users.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-semibold text-[var(--fg-secondary)] mb-3">
                  👥 Exemples de profils créés :
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {result.users.slice(0, 6).map((user: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-3 border-[0.5px] border-[var(--border-subtle)]">
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-[var(--fg-primary)] truncate">
                          {user.name}
                        </div>
                        <div className="text-xs text-[var(--fg-tertiary)] truncate">
                          {user.email}
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-[var(--success-600)]">
                        {user.reliabilityScore}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sample Squads */}
            {result.squads && result.squads.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-semibold text-[var(--fg-secondary)] mb-3">
                  🎯 Squads créées :
                </p>
                <div className="space-y-2">
                  {result.squads.map((squad: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-3 border-[0.5px] border-[var(--border-subtle)]">
                      <img 
                        src={squad.avatar} 
                        alt={squad.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-[var(--fg-primary)] truncate">
                          {squad.name}
                        </div>
                        <div className="text-xs text-[var(--fg-tertiary)]">
                          {squad.game} • {squad.members.length} membres
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="pt-4 border-t border-[var(--border-subtle)]">
              <p className="text-xs font-semibold text-[var(--fg-secondary)] mb-3">
                🚀 Prochaines étapes :
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    onNavigate('login');
                    showToast('Utilisez les identifiants de démo pour vous connecter', 'info');
                  }}
                  className="text-xs justify-center"
                >
                  Se connecter
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => onNavigate('squads')}
                  className="text-xs justify-center"
                >
                  Voir les Squads
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-5 bg-[var(--bg-subtle)] rounded-2xl border-[0.5px] border-[var(--border-subtle)]">
          <h3 className="text-sm font-semibold text-[var(--fg-primary)] mb-3">
            📋 Comment tester l'application
          </h3>
          <ol className="text-xs text-[var(--fg-tertiary)] space-y-2">
            <li>1. Cliquez sur "Générer l'écosystème complet"</li>
            <li>2. Attendez 30-60 secondes pendant la génération</li>
            <li>3. Déconnectez-vous de votre compte actuel</li>
            <li>4. Reconnectez-vous avec un profil de démo (ex: shadow.ninja@squadplanner.demo)</li>
            <li>5. Explorez les squads, sessions, profils et statistiques</li>
            <li>6. Testez toutes les fonctionnalités avec ces données réalistes</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default TestSetupScreen;
