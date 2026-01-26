import { Plus, Calendar, Users, TrendingUp, Clock, ArrowRight, Sparkles, Brain, BarChart3, Repeat, HeartPulse, Trophy, Target, UsersRound, Swords, RotateCcw, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { SwipeableRSVP } from '@/app/components/ui/SwipeableRSVP';
import { Celebration } from '@/app/components/ui/Celebration';
import { AnimatedNumber } from '@/app/components/ui/AnimatedNumber';
import { useTranslation } from '@/i18n/useTranslation';
import { useHaptic } from '@/app/hooks/useHaptic';
import { useSoundEffects } from '@/app/hooks/useSoundEffects';
import { games } from '@/data/games';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { usePerformanceMonitor } from '@/app/hooks/usePerformanceMonitor';
import { sessionsAPI, squadsAPI } from '@/utils/api';
import { useAuth } from '@/app/contexts/AuthContext';
import { AnimatedCard, AnimatedCardSimple, AnimatedList, AnimatedListItem, AnimatedSection, ParallaxSection } from '@/app/components/animations';
import { staggerContainer, staggerItem, easings } from '@/utils/motion-variants';

interface HomeScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function HomeScreen({ onNavigate, showToast }: HomeScreenProps) {
  const { t } = useTranslation();
  const { notification } = useHaptic();
  const { play } = useSoundEffects();
  const { isAuthenticated } = useAuth(); // ✅ Get auth status
  const [showCelebration, setShowCelebration] = useState(false);
  const [rsvpResponse, setRsvpResponse] = useState<string | null>(null);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  const [nextSession, setNextSession] = useState<any>(null);
  const [squads, setSquads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔍 Performance Monitoring
  usePerformanceMonitor('HomeScreen');

  // Load data from backend - ONLY IF AUTHENTICATED
  useEffect(() => {
    if (isAuthenticated) {
      loadHomeData();
    } else {
      // Skip loading if not authenticated
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadHomeData = async () => {
    setIsLoading(true);
    try {
      const [sessionsResponse, squadsResponse] = await Promise.all([
        sessionsAPI.getAll().catch(err => {
          // Silent fail for auth errors - user might not be logged in yet
          if (err.message?.includes('401') || err.message?.includes('Unauthorized') || err.message?.includes('Invalid JWT')) {
            console.log('⚠️ Not authenticated yet, skipping sessions load');
            return { sessions: [] };
          }
          throw err;
        }),
        squadsAPI.getAll().catch(err => {
          // Silent fail for auth errors - user might not be logged in yet
          if (err.message?.includes('401') || err.message?.includes('Unauthorized') || err.message?.includes('Invalid JWT')) {
            console.log('⚠️ Not authenticated yet, skipping squads load');
            return { squads: [] };
          }
          throw err;
        }),
      ]);

      // Get the next upcoming session
      const upcoming = sessionsResponse.sessions?.find((s: any) => new Date(s.date) > new Date());
      setNextSession(upcoming);
      
      setSquads(squadsResponse.squads || []);
    } catch (error: any) {
      // Log detailed error but don't show it to user for empty states
      console.log('Chargement des données:', error.message || 'Aucune donnée disponible');
      // Set empty arrays for new users
      setSquads([]);
      setNextSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRSVP = async (response: 'yes' | 'no' | 'maybe') => {
    notification('success');
    play('success');
    
    const messages = {
      yes: 'Tu es partant ! 🎮',
      no: 'Réponse enregistrée',
      maybe: 'Peut-être noté 👍'
    };
    
    setRsvpResponse(response);

    if (!nextSession) return;

    try {
      // Call API to save RSVP
      await sessionsAPI.rsvp(nextSession.id, nextSession.slotId, response);
      
      if (response === 'yes') {
        setShowCelebration(true);
      } else {
        showToast(messages[response], 'success');
      }
    } catch (error: any) {
      console.error('RSVP error:', error);
      showToast(error.message || 'Erreur lors de la réponse', 'error');
      setRsvpResponse(null); // Reset on error
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-safe relative">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* ✨ Header ultra-raffiné avec Parallax */}
        <ParallaxSection speed={0.2} enableFade={false} className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easings.apple }}
          >
            <h1 className="text-4xl font-semibold text-[var(--fg-primary)] mb-2 tracking-tight">
              {t('home.hero.title')}
            </h1>
            <p className="text-base text-[var(--fg-tertiary)] font-normal max-w-md">
              {t('home.hero.subtitle')}
            </p>
          </motion.div>
        </ParallaxSection>

        {/* ✨ Stats premium avec Stagger orchestré */}
        <motion.div 
          className="grid grid-cols-3 gap-3 mb-10"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <AnimatedCardSimple delay={100} direction="up" threshold={0.1}>
            <motion.div 
              className="bg-white rounded-2xl p-5 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-xl transition-shadow duration-300"
              whileHover={{ 
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                transition: { duration: 0.2 } 
              }}
            >
              <Calendar className="w-5 h-5 text-[var(--fg-tertiary)] mb-3" strokeWidth={1.5} />
              <div className="text-3xl font-semibold text-[var(--fg-primary)] mb-1 tracking-tight">
                <AnimatedNumber value={247} duration={1.8} />
              </div>
              <div className="text-xs text-[var(--fg-tertiary)] font-medium">Sessions</div>
            </motion.div>
          </AnimatedCardSimple>

          <AnimatedCardSimple delay={150} direction="up" threshold={0.1}>
            <motion.div 
              className="bg-white rounded-2xl p-5 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-xl transition-shadow duration-300"
              whileHover={{ 
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                transition: { duration: 0.2 } 
              }}
            >
              <Users className="w-5 h-5 text-[var(--fg-tertiary)] mb-3" strokeWidth={1.5} />
              <div className="text-3xl font-semibold text-[var(--fg-primary)] mb-1 tracking-tight">
                <AnimatedNumber value={1800} suffix="K" duration={2} />
              </div>
              <div className="text-xs text-[var(--fg-tertiary)] font-medium">Joueurs</div>
            </motion.div>
          </AnimatedCardSimple>

          <AnimatedCardSimple delay={200} direction="up" threshold={0.1}>
            <motion.div 
              className="bg-white rounded-2xl p-5 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-xl transition-shadow duration-300"
              whileHover={{ 
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                transition: { duration: 0.2 } 
              }}
            >
              <TrendingUp className="w-5 h-5 text-[var(--primary-500)] mb-3" strokeWidth={1.5} />
              <div className="text-3xl font-semibold text-[var(--fg-primary)] mb-1 tracking-tight">
                <AnimatedNumber value={89} suffix="%" duration={2.2} />
              </div>
              <div className="text-xs text-[var(--fg-tertiary)] font-medium">Fiabilité</div>
            </motion.div>
          </AnimatedCardSimple>
        </motion.div>

        {/* ✨ Next Session avec animation premium */}
        {nextSession && (
          <AnimatedCard delay={250} direction="up" threshold={0.1} className="mb-10">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[var(--fg-primary)] tracking-tight">
                  Prochaine session
                </h2>
                <span className="text-sm text-[var(--fg-tertiary)] font-medium">
                  dans {nextSession.hoursUntil}h
                </span>
              </div>

              <SwipeableRSVP onResponse={handleRSVP} disabled={rsvpResponse !== null}>
                <motion.div
                  className="bg-white rounded-2xl overflow-hidden border-[0.5px] border-[var(--border-subtle)] shadow-lg"
                  whileHover={{ 
                    boxShadow: '0 25px 50px rgba(0,0,0,0.12)',
                    transition: { duration: 0.3 } 
                  }}
                >
                  <div className="relative h-40">
                    <ImageWithFallback 
                      src={nextSession.gameImage}
                      alt={nextSession.game}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    
                    <div className="absolute bottom-5 left-5 right-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-semibold text-white mb-1">
                            {nextSession.squadName}
                          </div>
                          <div className="text-sm text-white/80">
                            {nextSession.game} • {nextSession.time}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/20 backdrop-blur-xl border border-white/30">
                          <Users className="w-4 h-4 text-white" strokeWidth={2} />
                          <span className="text-sm font-semibold text-white">
                            {nextSession.confirmed}/{nextSession.total}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </SwipeableRSVP>
            </div>
          </AnimatedCard>
        )}

        {/* Celebration overlay */}
        {showCelebration && (
          <Celebration
            title="Tu es partant !"
            subtitle={`Rendez-vous ${nextSession.time} pour ${nextSession.game}`}
            variant="success"
            onComplete={() => setShowCelebration(false)}
          />
        )}

        {/* ✨ Quick Actions avec stagger */}
        <motion.div 
          className="grid grid-cols-2 gap-3 mb-10"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <AnimatedCardSimple delay={300} direction="up" threshold={0.1}>
            <Button
              variant="primary"
              onClick={() => onNavigate('create-squad')}
              className="h-14 w-full text-sm font-semibold bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] hover:from-[var(--primary-600)] hover:to-[var(--primary-700)] text-white rounded-2xl shadow-lg shadow-[var(--primary-500)]/20 hover:shadow-2xl hover:shadow-[var(--primary-500)]/40 transition-all duration-300"
            >
              <Plus className="w-5 h-5" strokeWidth={2} />
              Créer Squad
            </Button>
          </AnimatedCardSimple>

          <AnimatedCardSimple delay={350} direction="up" threshold={0.1}>
            <Button
              variant="ghost"
              onClick={() => onNavigate('join-squad')}
              className="h-14 w-full text-sm font-semibold bg-white border-[0.5px] border-[var(--border-medium)] hover:border-[var(--border-strong)] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <Users className="w-5 h-5" strokeWidth={2} />
              Rejoindre Squad
            </Button>
          </AnimatedCardSimple>
        </motion.div>

        <AnimatedCardSimple delay={400} direction="up" threshold={0.1} className="mb-10">
          <Button
            variant="ghost"
            onClick={() => onNavigate('propose-session')}
            className="h-14 w-full text-sm font-semibold bg-white border-[0.5px] border-[var(--border-medium)] hover:border-[var(--border-strong)] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <Clock className="w-5 h-5" strokeWidth={2} />
            Proposer Session
          </Button>
        </AnimatedCardSimple>

        {/* ✨ Intelligence & Outils avec animations orchestrées */}
        <div className="mb-10">
          <motion.h2 
            className="text-lg font-semibold text-[var(--fg-primary)] tracking-tight mb-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: easings.apple }}
          >
            Intelligence & Outils
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-2 gap-3 mb-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <AnimatedCard delay={450} direction="up" threshold={0.1}>
              <motion.button
                onClick={() => onNavigate('intelligence')}
                className="w-full bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 text-white shadow-md hover:shadow-2xl transition-all text-left"
                whileHover={{ 
                  boxShadow: '0 25px 50px rgba(139, 92, 246, 0.3)',
                }}
              >
                <TrendingUp className="w-6 h-6 mb-3" strokeWidth={2} />
                <div className="text-base font-bold mb-1">Intelligence IA</div>
                <div className="text-xs opacity-90">Suggestions optimales</div>
              </motion.button>
            </AnimatedCard>

            <AnimatedCard delay={500} direction="up" threshold={0.1}>
              <motion.button
                onClick={() => onNavigate('weekly-recap')}
                className="w-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] rounded-2xl p-5 text-white shadow-md hover:shadow-2xl transition-all text-left"
                whileHover={{ 
                  boxShadow: '0 25px 50px rgba(251, 191, 36, 0.3)',
                }}
              >
                <Calendar className="w-6 h-6 mb-3" strokeWidth={2} />
                <div className="text-base font-bold mb-1">Récap Hebdo</div>
                <div className="text-xs opacity-90">Vos statistiques</div>
              </motion.button>
            </AnimatedCard>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 gap-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <AnimatedCardSimple delay={550} direction="up" threshold={0.1}>
              <button
                onClick={() => onNavigate('recurring-session')}
                className="w-full bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-lg transition-all text-left"
              >
                <RotateCcw className="w-5 h-5 text-[var(--primary-500)] mb-2" strokeWidth={2} />
                <div className="text-sm font-bold text-[var(--fg-primary)] mb-0.5">Rituels</div>
                <div className="text-xs text-[var(--fg-tertiary)]">Sessions auto</div>
              </button>
            </AnimatedCardSimple>

            <AnimatedCardSimple delay={600} direction="up" threshold={0.1}>
              <button
                onClick={() => onNavigate('squad-health')}
                className="w-full bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-lg transition-all text-left"
              >
                <Activity className="w-5 h-5 text-[var(--secondary-500)] mb-2" strokeWidth={2} />
                <div className="text-sm font-bold text-[var(--fg-primary)] mb-0.5">Cohésion</div>
                <div className="text-xs text-[var(--fg-tertiary)]">Santé squad</div>
              </button>
            </AnimatedCardSimple>
          </motion.div>
        </div>

        {/* ✨ Social & Compétition */}
        <div className="mb-10">
          <motion.h2 
            className="text-lg font-semibold text-[var(--fg-primary)] tracking-tight mb-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: easings.apple }}
          >
            Social & Compétition
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-2 gap-3 mb-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <AnimatedCard delay={650} direction="up" threshold={0.1}>
              <motion.button
                onClick={() => onNavigate('leaderboard')}
                className="w-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] rounded-2xl p-5 text-white shadow-md hover:shadow-2xl transition-all text-left"
                whileHover={{ 
                  boxShadow: '0 25px 50px rgba(251, 191, 36, 0.3)',
                }}
              >
                <Trophy className="w-6 h-6 mb-3" strokeWidth={2} />
                <div className="text-base font-bold mb-1">Classements</div>
                <div className="text-xs opacity-90">Top joueurs</div>
              </motion.button>
            </AnimatedCard>

            <AnimatedCard delay={700} direction="up" threshold={0.1}>
              <motion.button
                onClick={() => onNavigate('tournaments')}
                className="w-full bg-gradient-to-br from-[var(--secondary-500)] to-[var(--secondary-600)] rounded-2xl p-5 text-white shadow-md hover:shadow-2xl transition-all text-left"
                whileHover={{ 
                  boxShadow: '0 25px 50px rgba(20, 184, 166, 0.3)',
                }}
              >
                <Swords className="w-6 h-6 mb-3" strokeWidth={2} />
                <div className="text-base font-bold mb-1">Tournois</div>
                <div className="text-xs opacity-90">Compétitions</div>
              </motion.button>
            </AnimatedCard>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 gap-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <AnimatedCardSimple delay={750} direction="up" threshold={0.1}>
              <button
                onClick={() => onNavigate('challenges')}
                className="w-full bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-lg transition-all text-left"
              >
                <Target className="w-5 h-5 text-[var(--primary-500)] mb-2" strokeWidth={2} />
                <div className="text-sm font-bold text-[var(--fg-primary)] mb-0.5">Défis</div>
                <div className="text-xs text-[var(--fg-tertiary)]">Hebdomadaires</div>
              </button>
            </AnimatedCardSimple>

            <AnimatedCardSimple delay={800} direction="up" threshold={0.1}>
              <button
                onClick={() => onNavigate('discover-squads')}
                className="w-full bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-lg transition-all text-left"
              >
                <UsersRound className="w-5 h-5 text-[var(--secondary-500)] mb-2" strokeWidth={2} />
                <div className="text-sm font-bold text-[var(--fg-primary)] mb-0.5">Découvrir</div>
                <div className="text-xs text-[var(--fg-tertiary)]">Squads publiques</div>
              </button>
            </AnimatedCardSimple>
          </motion.div>
        </div>

        {/* ✨ Communauté & B2B */}
        <div className="mt-8">
          <motion.h2 
            className="text-lg font-semibold text-[var(--fg-primary)] tracking-tight mb-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: easings.apple }}
          >
            Communauté & B2B
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-2 gap-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <AnimatedCardSimple delay={850} direction="up" threshold={0.1}>
              <button
                onClick={() => onNavigate('community')}
                className="w-full bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-lg transition-all text-left"
              >
                <div className="text-2xl mb-2">🌍</div>
                <div className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                  Multi-Squads
                </div>
                <div className="text-xs text-[var(--fg-tertiary)]">
                  Gérez plusieurs squads
                </div>
              </button>
            </AnimatedCardSimple>

            <AnimatedCardSimple delay={900} direction="up" threshold={0.1}>
              <button
                onClick={() => onNavigate('leagues')}
                className="w-full bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-lg transition-all text-left"
              >
                <div className="text-2xl mb-2">🏆</div>
                <div className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                  Ligues
                </div>
                <div className="text-xs text-[var(--fg-tertiary)]">
                  Compétition interne
                </div>
              </button>
            </AnimatedCardSimple>

            <AnimatedCardSimple delay={950} direction="up" threshold={0.1}>
              <button
                onClick={() => onNavigate('seasons')}
                className="w-full bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-lg transition-all text-left"
              >
                <div className="text-2xl mb-2">📅</div>
                <div className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                  Saisons
                </div>
                <div className="text-xs text-[var(--fg-tertiary)]">
                  Progression trimestrielle
                </div>
              </button>
            </AnimatedCardSimple>

            <AnimatedCard delay={1000} direction="up" threshold={0.1}>
              <motion.button
                onClick={() => onNavigate('organization')}
                className="w-full bg-gradient-to-br from-[var(--error-500)] to-[var(--warning-500)] rounded-2xl p-4 text-white shadow-md hover:shadow-2xl transition-all text-left"
                whileHover={{ 
                  boxShadow: '0 25px 50px rgba(239, 68, 68, 0.3)',
                }}
              >
                <div className="text-2xl mb-2">🏢</div>
                <div className="text-sm font-semibold mb-1">
                  Mode B2B
                </div>
                <div className="text-xs text-white/80">
                  Équipes esport
                </div>
              </motion.button>
            </AnimatedCard>
          </motion.div>
        </div>

        {/* ✨ Mes Squads avec animations en cascade */}
        <div>
          <motion.div 
            className="flex items-center justify-between mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: easings.apple }}
          >
            <h2 className="text-lg font-semibold text-[var(--fg-primary)] tracking-tight mt-10">
              Mes Squads
            </h2>
            <button 
              onClick={() => onNavigate('squads')}
              className="flex items-center gap-1.5 text-sm text-[var(--primary-500)] hover:text-[var(--primary-600)] font-medium transition-colors"
            >
              Voir tout
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </motion.div>

          <motion.div 
            className="space-y-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {squads.map((squad, index) => (
              <AnimatedCard
                key={squad.id}
                delay={1050 + index * 50}
                direction="up"
                threshold={0.1}
                onClick={() => onNavigate('squad-detail', { id: squad.id })}
              >
                <motion.div
                  className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm cursor-pointer"
                  whileHover={{ 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-[var(--border-subtle)]">
                      <ImageWithFallback 
                        src={squad.gameImage}
                        alt={squad.game}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base font-semibold text-[var(--fg-primary)] truncate">
                          {squad.name}
                        </span>
                        {squad.needsResponse && (
                          <span className="w-2 h-2 rounded-full bg-[var(--primary-500)] flex-shrink-0 animate-pulse" />
                        )}
                      </div>
                      <div className="text-sm text-[var(--fg-tertiary)] font-medium">
                        {squad.game} • {squad.members} membres
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-semibold text-[var(--primary-500)] mb-1">
                        {squad.reliability}%
                      </div>
                      <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                        {squad.nextSession}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatedCard>
            ))}
          </motion.div>
        </div>

      </div>
    </div>
  );
}