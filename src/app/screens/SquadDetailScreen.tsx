import { ArrowLeft, Plus, Users, Calendar, Clock, CheckCircle2, XCircle, Sparkles, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/Button';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useTranslation } from '@/i18n/useTranslation';
import { squadsAPI } from '@/utils/api';
import { AnimatedCard } from '@/app/components/animations';

interface SquadDetailScreenProps {
  onNavigate?: (screen: string) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
  data?: any;
}

export function SquadDetailScreen({ onNavigate, showToast, data }: SquadDetailScreenProps) {
  const { t } = useTranslation();
  
  // Mock data for demo
  // State for squad data
  const [squad, setSquad] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load squad data
  // Load squad data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await squadsAPI.getSquads(); // Assuming we want the first squad or list
        // For Detail Screen usually we need an ID from nav params, but here we fallback to first squad
        if (response.squads && response.squads.length > 0) {
           setSquad(response.squads[0]);
        }
      } catch (e: any) {
        console.error(e);
        showToast?.('Erreur de chargement: ' + e.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading || !squad) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F5F3F0] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#FDFCFB]/95 backdrop-blur-xl border-b border-[rgba(120,113,108,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate?.('squads')}
              className="p-2 hover:bg-[#FFFBEB] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[rgba(28,25,23,0.7)]" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[rgba(28,25,23,0.95)]">{squad.name}</h1>
              <p className="text-sm text-[rgba(28,25,23,0.6)]">{squad.game}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Next Session Card */}
          <AnimatedCard className="p-6 bg-[#FDFCFB] border-[0.5px] border-[rgba(120,113,108,0.1)] rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[rgba(28,25,23,0.95)]">
                {t('squad.nextSession')}
              </h2>
              <Calendar className="w-5 h-5 text-[#F59E0B]" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[rgba(28,25,23,0.5)]" />
                <span className="text-[rgba(28,25,23,0.7)]">
                  {squad.nextSession.date} à {squad.nextSession.time}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-[rgba(28,25,23,0.5)]" />
                <span className="text-[rgba(28,25,23,0.7)]">
                  {squad.nextSession.confirmed}/{squad.nextSession.total} confirmés
                </span>
              </div>

              <div className="flex gap-3 mt-6">
                <Button className="flex-1 bg-[#10B981] text-white">
                  <CheckCircle2 className="w-4 h-4" />
                  {t('rsvp.available')}
                </Button>
                <Button variant="outline" className="flex-1 border-[#F43F5E] text-[#F43F5E]">
                  <XCircle className="w-4 h-4" />
                  {t('rsvp.unavailable')}
                </Button>
              </div>
            </div>
          </AnimatedCard>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onNavigate?.('propose-session')}
              className="p-4 bg-[#FFFBEB] border border-[#FCD34D] rounded-xl text-left hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5 text-[#F59E0B] mb-2" />
              <div className="font-semibold text-[rgba(28,25,23,0.95)]">
                {t('squad.proposeSession')}
              </div>
            </button>

            <button
              onClick={() => onNavigate?.('squad-chat')}
              className="p-4 bg-[#F0FDFA] border border-[#5EEAD4] rounded-xl text-left hover:shadow-lg transition-all"
            >
              <MessageCircle className="w-5 h-5 text-[#14B8A6] mb-2" />
              <div className="font-semibold text-[rgba(28,25,23,0.95)]">
                {t('squad.chat')}
              </div>
            </button>
          </div>

          {/* Members */}
          <AnimatedCard className="p-6 bg-[#FDFCFB] border-[0.5px] border-[rgba(120,113,108,0.1)] rounded-2xl">
            <h3 className="text-lg font-semibold text-[rgba(28,25,23,0.95)] mb-4">
              {t('squad.members')}
            </h3>
            <div className="space-y-4">
              {squad.members.map((member: any) => (
                <div key={member.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-[rgba(120,113,108,0.05)] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <ImageWithFallback src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" />
                      {member.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] border-2 border-[#FDFCFB] rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-[rgba(28,25,23,0.95)] flex items-center gap-2">
                        {member.name}
                        {member.reliability >= 95 && <Sparkles className="w-3 h-3 text-[#F59E0B]" />}
                      </div>
                      <div className="text-xs text-[rgba(28,25,23,0.6)]">
                         Fiabilité: {member.reliability}%
                      </div>
                    </div>
                  </div>
                  {member.online && (
                    <span className="text-xs font-medium text-[#10B981] bg-[#ECFDF5] px-2 py-1 rounded-full">
                      En ligne
                    </span>
                  )}
                </div>
              ))}
            </div>
          </AnimatedCard>

        </div>
      </div>
    </div>
  );
}
export default SquadDetailScreen;
