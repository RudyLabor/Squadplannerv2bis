/**
 * 📋 SQUADS SCREEN - Aligné sur maquette Figma
 * Design System v2 - Mobile-first
 */

import { useState, useEffect } from "react";
import { Plus, Users } from "lucide-react";
import { squadsAPI } from "@/utils/api";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  PageHeader,
  SearchBar,
  SquadCard,
  EmptyState,
  ActionButton,
} from "@/app/components/ui/DesignSystem";

interface SquadsScreenProps {
  onNavigate: (screen: string, params?: any) => void;
}

export function SquadsScreen({ onNavigate }: SquadsScreenProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [squads, setSquads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load squads
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      loadSquads();
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [authLoading, isAuthenticated]);

  const loadSquads = async () => {
    setIsLoading(true);
    try {
      const { squads: userSquads } = await squadsAPI.getSquads();
      
      // Transform squads for display
      const transformedSquads = (userSquads || []).map((squad: any) => ({
        ...squad,
        membersCount: Array.isArray(squad.members) ? squad.members.length : (squad.members || 0),
        reliabilityScore: squad.reliabilityScore || Math.floor(Math.random() * 20) + 80,
        activeSessions: squad.activeSessions || Math.floor(Math.random() * 5),
        nextSessionText: formatNextSession(squad.nextSession),
      }));
      
      setSquads(transformedSquads);
    } catch (error) {
      console.error("Load squads error:", error);
      setSquads([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNextSession = (nextSession: any): string | undefined => {
    if (!nextSession) return undefined;
    if (typeof nextSession === 'string') return nextSession;
    if (nextSession.date) {
      const date = new Date(nextSession.date);
      return date.toLocaleDateString('fr-FR', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return 'Prochainement';
  };

  const filteredSquads = squads.filter(
    (squad) =>
      squad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      squad.game.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Chargement des squads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="px-4 py-6">
        {/* Header */}
        <PageHeader
          title="Mes squads"
          subtitle={`${squads.length} squads actives`}
        />

        {/* Search + Add Button */}
        <SearchBar
          placeholder="Rechercher des squads..."
          value={searchQuery}
          onChange={setSearchQuery}
          onAction={() => onNavigate("create-squad")}
          actionIcon={Plus}
        />

        {/* Squads Grid */}
        {filteredSquads.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredSquads.map((squad) => (
              <SquadCard
                key={squad.id}
                name={squad.name}
                game={squad.game}
                gameImage={squad.gameImage || getGameImage(squad.game)}
                members={squad.membersCount}
                reliability={squad.reliabilityScore}
                nextSession={squad.nextSessionText}
                sessionsCount={squad.activeSessions}
                onClick={() => onNavigate("squad-detail", { squadId: squad.id })}
              />
            ))}
          </div>
        ) : searchQuery ? (
          // No results for search
          <EmptyState
            icon={Users}
            title="Aucun résultat"
            description={`Aucune squad ne correspond à "${searchQuery}"`}
          />
        ) : (
          // No squads at all
          <EmptyState
            icon={Users}
            title="Aucune squad"
            description="Créez votre première squad ou rejoignez-en une existante"
            action={
              <div className="flex gap-3">
                <ActionButton
                  variant="primary"
                  icon={Plus}
                  onClick={() => onNavigate("create-squad")}
                >
                  Créer une squad
                </ActionButton>
                <ActionButton
                  variant="secondary"
                  onClick={() => onNavigate("join-squad")}
                >
                  Rejoindre
                </ActionButton>
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}

// Helper to get game image
function getGameImage(game: string): string {
  const gameImages: Record<string, string> = {
    'Valorant': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=200&fit=crop',
    'League of Legends': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&h=200&fit=crop',
    'CS2': 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b0d?w=200&h=200&fit=crop',
    'Overwatch 2': 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=200&h=200&fit=crop',
    'Apex Legends': 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=200&h=200&fit=crop',
  };
  return gameImages[game] || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=200&fit=crop';
}

export default SquadsScreen;
