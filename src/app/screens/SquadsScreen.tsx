/**
 * SQUADS SCREEN - Premium UI v2.0
 * Framer Motion + Glassmorphism + Gradients
 */

import { useState, useEffect } from "react";
import { Plus, Users, Search, Star, ChevronRight, Sparkles, Trophy, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSquads } from "@/app/contexts/SquadsContext";

interface SquadsScreenProps {
  onNavigate: (screen: string, params?: any) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

interface PremiumSquadCardProps {
  squad: {
    id: string;
    name: string;
    game: string;
    membersCount: number;
    reliabilityScore: number;
    nextSessionText?: string;
  };
  index: number;
  onClick: () => void;
}

const gameGradients: Record<string, string> = {
  'Valorant': 'from-red-500 to-pink-500',
  'League of Legends': 'from-blue-500 to-cyan-500',
  'CS2': 'from-amber-500 to-orange-500',
  'Overwatch 2': 'from-orange-500 to-red-500',
  'Apex Legends': 'from-red-600 to-yellow-500',
  'default': 'from-indigo-500 to-purple-500'
};

function PremiumSquadCard({ squad, index, onClick }: PremiumSquadCardProps) {
  const gradient = gameGradients[squad.game] || gameGradients['default'];

  return (
    <motion.div
      variants={cardVariants}
      custom={index}
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl cursor-pointer group"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`} />

      {/* Glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10" />

      {/* Decorative elements */}
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-black/10 rounded-full blur-xl" />

      {/* Content */}
      <div className="relative z-10 p-4 min-h-[160px] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Users className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          {squad.reliabilityScore >= 90 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
              className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            </motion.div>
          )}
        </div>

        {/* Squad Info */}
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg mb-1 line-clamp-1">
            {squad.name}
          </h3>
          <p className="text-white/80 text-sm font-medium">
            {squad.game}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/20">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-white/90 text-xs font-medium">
              <Users className="w-3.5 h-3.5" />
              <span>{squad.membersCount}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/40" />
            <div className="text-white/90 text-xs font-medium">
              {squad.reliabilityScore}%
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </div>

        {squad.nextSessionText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-white/20 backdrop-blur-sm"
          >
            <span className="text-[10px] font-semibold text-white">
              {squad.nextSessionText}
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

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
        activeSessions: 0,
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-16 h-16 mx-auto mb-4">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-indigo-200"
              style={{ borderTopColor: 'transparent' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Users className="w-6 h-6 text-indigo-500" />
            </div>
          </div>
          <p className="text-gray-500 font-medium">Chargement des squads...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 px-4 py-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Mes Squads
              </h1>
              <motion.button
                onClick={() => onNavigate("create-squad")}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
              </motion.button>
            </div>
            <p className="text-gray-500 font-medium">
              {squads.length} squad{squads.length > 1 ? 's' : ''} active{squads.length > 1 ? 's' : ''}
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher des squads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={itemVariants} className="flex gap-3 mb-6 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            <div className="flex-shrink-0 px-4 py-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20">
              <div className="flex items-center gap-2 text-white">
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-semibold whitespace-nowrap">{squads.length} Squads</span>
              </div>
            </div>
            <div className="flex-shrink-0 px-4 py-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-md">
              <div className="flex items-center gap-2 text-gray-700">
                <Users className="w-4 h-4" />
                <span className="text-sm font-semibold whitespace-nowrap">
                  {transformedSquads.reduce((acc, s) => acc + s.membersCount, 0)} Membres
                </span>
              </div>
            </div>
            <div className="flex-shrink-0 px-4 py-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-md">
              <div className="flex items-center gap-2 text-gray-700">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-semibold whitespace-nowrap">
                  {Math.round(transformedSquads.reduce((acc, s) => acc + s.reliabilityScore, 0) / (transformedSquads.length || 1))}% Fiabilité
                </span>
              </div>
            </div>
          </motion.div>

          {/* Squads Grid */}
          <AnimatePresence mode="wait">
            {filteredSquads.length > 0 ? (
              <motion.div
                key="squads-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 gap-4"
              >
                {filteredSquads.map((squad, index) => (
                  <PremiumSquadCard
                    key={squad.id}
                    squad={squad}
                    index={index}
                    onClick={() => onNavigate("squad-detail", { squadId: squad.id })}
                  />
                ))}
              </motion.div>
            ) : searchQuery ? (
              <motion.div
                key="no-results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 rounded-3xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Aucun résultat
                </h3>
                <p className="text-gray-500 text-sm">
                  Aucune squad ne correspond à "{searchQuery}"
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12"
              >
                <motion.div
                  className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/30"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Users className="w-12 h-12 text-white" strokeWidth={1.5} />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Aucune squad
                </h3>
                <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                  Créez votre première squad ou rejoignez-en une existante
                </p>
                <div className="flex gap-3 justify-center">
                  <motion.button
                    onClick={() => onNavigate("create-squad")}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/30 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Sparkles className="w-5 h-5" />
                    Créer une squad
                  </motion.button>
                  <motion.button
                    onClick={() => onNavigate("join-squad")}
                    className="px-6 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 text-gray-700 font-semibold shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Rejoindre
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default SquadsScreen;
