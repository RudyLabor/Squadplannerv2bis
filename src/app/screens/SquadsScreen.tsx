/**
 * 📋 SQUADS SCREEN - Aligné sur maquette Figma
 * Design System v2 - Mobile-first
 */

import { useState, useEffect } from "react";
import { Plus, Users } from "lucide-react";
import { useSquads } from "@/app/contexts/SquadsContext";
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
  const { squads, loading: squadsLoading, refreshSquads } = useSquads();
  const [searchQuery, setSearchQuery] = useState("");
  const [transformedSquads, setTransformedSquads] = useState<any[]>([]);

  // Initial load
  useEffect(() => {
    refreshSquads();
  }, []);

  // Transform squads whenever they change
  useEffect(() => {
    if (squads) {
      const transformed = squads.map((squad: any) => ({
        ...squad,
        membersCount: squad.total_members || 0,
        reliabilityScore: squad.reliability_score || 85,
        activeSessions: 0, // Could be linked to sessions if needed
        nextSessionText: squad.next_session_date ? "Prochainement" : undefined,
      }));
      setTransformedSquads(transformed);
    }
  }, [squads]);

  const filteredSquads = transformedSquads.filter(
    (squad) =>
      squad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      squad.game.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading state
  if (squadsLoading) {
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
