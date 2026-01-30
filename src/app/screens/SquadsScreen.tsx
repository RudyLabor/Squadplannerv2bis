/**
 * SQUADS SCREEN - LINEAR DESIGN SYSTEM
 * Premium minimal design matching HomeScreen
 */

import { useState, useEffect } from "react";
import { Plus, Users, Search, ChevronRight, Gamepad2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSquads } from "@/app/contexts/SquadsContext";
import { OrangeDivider } from "@/design-system";

interface SquadsScreenProps {
  onNavigate: (screen: string, params?: any) => void;
}

// Animations - Linear style (same as HomeScreen)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.02 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }
  }
};

// ============================================
// STAT CARD - Visually recessed
// ============================================
function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <motion.div
      className="p-4 rounded-xl bg-[#111214] border border-[#1a1b1f] hover:border-[#26282d] hover:bg-[#141518] transition-all duration-100 group cursor-default"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.1 }}
    >
      <p className="text-[24px] md:text-[28px] font-semibold text-[#ececed] tabular-nums leading-none mb-1">
        {value}
      </p>
      <span className="text-[12px] md:text-[13px] text-[#4a4b50] block">{label}</span>
    </motion.div>
  );
}

// ============================================
// SQUAD CARD - Linear style
// ============================================
function SquadCard({ squad, onClick }: { squad: any; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full p-4 md:p-5 rounded-xl bg-[#111214] border border-[#1a1b1f] hover:bg-[#141518] hover:border-[#26282d] text-left transition-all duration-100 group min-h-[100px]"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.1 }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl bg-[#1a1b1f] group-hover:bg-[#1e2024] flex items-center justify-center transition-colors">
          <Gamepad2 className="w-5 h-5 text-[#4a4b50] group-hover:text-[#6f7177] transition-colors" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-medium text-[#ececed] group-hover:text-white truncate transition-colors">
            {squad.name}
          </h3>
          <p className="text-[13px] text-[#4a4b50] group-hover:text-[#6f7177] truncate transition-colors">
            {squad.game}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-[#26282d] group-hover:text-[#4a4b50] transition-colors flex-shrink-0" />
      </div>

      <div className="flex items-center justify-between text-[13px]">
        <span className="text-[#4a4b50] group-hover:text-[#6f7177] flex items-center gap-1.5 transition-colors">
          <Users className="w-4 h-4" strokeWidth={1.5} />
          {squad.membersCount} membres
        </span>
        <span className="text-[#4ade80]/80 font-semibold tabular-nums">
          {squad.reliabilityScore}%
        </span>
      </div>
    </motion.button>
  );
}

// ============================================
// EMPTY STATE - Premium, action-oriented
// ============================================
function EmptyState({ onNavigate }: { onNavigate: (screen: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }}
      className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-[#131416] to-[#111214] border border-[#1a1b1f]"
    >
      <div className="text-center max-w-[320px] mx-auto">
        {/* Icon - Neutral, professional */}
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#1a1b1f] flex items-center justify-center mx-auto mb-5">
          <Users className="w-6 h-6 md:w-7 md:h-7 text-[#3a3b40]" strokeWidth={1.5} />
        </div>

        {/* Micro-copy - Factual, serious */}
        <h3 className="text-[15px] md:text-[16px] font-semibold text-[#ececed] mb-2">
          Aucune squad pour le moment
        </h3>
        <p className="text-[13px] md:text-[14px] text-[#6f7177] mb-6 leading-relaxed">
          Crée une squad pour commencer à planifier des sessions fiables.
        </p>

        {/* Primary CTA - Clear, prominent */}
        <motion.button
          onClick={() => onNavigate("create-squad")}
          className="inline-flex items-center justify-center gap-2.5 w-full h-12 rounded-xl bg-[#5e6ad2] text-white text-[14px] font-semibold hover:bg-[#6872d9] shadow-lg shadow-[#5e6ad2]/20 transition-colors"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" strokeWidth={2} />
          Créer une squad
        </motion.button>

        {/* Secondary link - Subtle, non-intrusive */}
        <motion.button
          onClick={() => onNavigate("discover-squads")}
          className="mt-4 text-[13px] text-[#5e6ad2] hover:text-[#7c85e0] transition-colors font-medium"
          whileHover={{ x: 2 }}
        >
          Ou rejoindre une squad existante →
        </motion.button>
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export function SquadsScreen({ onNavigate }: SquadsScreenProps) {
  const { squads, loading: squadsLoading, refreshSquads } = useSquads();
  const [searchQuery, setSearchQuery] = useState("");
  const [transformedSquads, setTransformedSquads] = useState<any[]>([]);

  useEffect(() => {
    refreshSquads();
  }, []);

  useEffect(() => {
    if (squads) {
      const transformed = squads.map((squad: any) => ({
        ...squad,
        membersCount: squad.total_members || 0,
        reliabilityScore: squad.reliability_score || 85,
      }));
      setTransformedSquads(transformed);
    }
  }, [squads]);

  const filteredSquads = transformedSquads.filter(
    (squad) =>
      squad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      squad.game.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalMembers = transformedSquads.reduce((acc, s) => acc + s.membersCount, 0);
  const avgReliability = transformedSquads.length > 0
    ? Math.round(transformedSquads.reduce((acc, s) => acc + s.reliabilityScore, 0) / transformedSquads.length)
    : 0;

  // Loading state
  if (squadsLoading) {
    return (
      <div className="min-h-screen bg-[#0e0f11] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#5e6ad2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0f11] pb-24 md:pb-8">
      <motion.div
        className="max-w-3xl mx-auto px-4 md:px-6 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-[24px] md:text-[26px] font-semibold text-[#ececed]">
              Mes Squads
            </h1>
            <motion.button
              onClick={() => onNavigate("create-squad")}
              className="w-11 h-11 rounded-xl bg-[#5e6ad2] text-white flex items-center justify-center hover:bg-[#6872d9] shadow-lg shadow-[#5e6ad2]/20 transition-colors"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" strokeWidth={2} />
            </motion.button>
          </div>
          <p className="text-[13px] text-[#6f7177]">
            {squads.length > 0
              ? `${squads.length} squad${squads.length > 1 ? 's' : ''} active${squads.length > 1 ? 's' : ''}`
              : 'Organise tes sessions de jeu'
            }
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#4a4b50]" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Rechercher une squad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 md:h-12 pl-11 pr-4 rounded-xl bg-[#111214] border border-[#1a1b1f] text-[14px] text-[#ececed] placeholder:text-[#4a4b50] focus:border-[#5e6ad2] focus:outline-none transition-colors"
            />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="grid grid-cols-3 gap-3">
            <StatCard value={squads.length} label="Squads" />
            <StatCard value={totalMembers} label="Membres" />
            <StatCard value={`${avgReliability}%`} label="Fiabilité" />
          </div>
          <OrangeDivider className="mt-6" />
        </motion.div>

        {/* Squads List */}
        <AnimatePresence mode="wait">
          {filteredSquads.length > 0 ? (
            <motion.div
              key="squads-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              {filteredSquads.map((squad) => (
                <motion.div key={squad.id} variants={itemVariants}>
                  <SquadCard
                    squad={squad}
                    onClick={() => onNavigate("squad-detail", { squadId: squad.id })}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : searchQuery ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }}
              className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-[#131416] to-[#111214] border border-[#1a1b1f]"
            >
              <div className="text-center max-w-[280px] mx-auto">
                <div className="w-12 h-12 rounded-xl bg-[#1a1b1f] flex items-center justify-center mx-auto mb-4">
                  <Search className="w-5 h-5 text-[#3a3b40]" strokeWidth={1.5} />
                </div>
                <h3 className="text-[15px] font-semibold text-[#ececed] mb-2">
                  Aucun résultat
                </h3>
                <p className="text-[13px] text-[#6f7177]">
                  Aucune squad ne correspond à "{searchQuery}"
                </p>
              </div>
            </motion.div>
          ) : (
            <EmptyState onNavigate={onNavigate} />
          )}
        </AnimatePresence>

        {/* Discover CTA */}
        {filteredSquads.length > 0 && (
          <motion.div variants={itemVariants} className="mt-8">
            <motion.button
              onClick={() => onNavigate("discover-squads")}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-[#141518] text-[#8b8d93] text-[14px] font-medium hover:bg-[#1a1b1f] hover:text-[#ececed] border border-[#1e2024] hover:border-[#26282d] transition-all duration-100"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <Users className="w-[18px] h-[18px]" strokeWidth={1.5} />
              Découvrir d'autres squads
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default SquadsScreen;
