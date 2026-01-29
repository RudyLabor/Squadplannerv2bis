import { ArrowLeft, Globe, Users, TrendingUp, Calendar, Sparkles, MessageCircle, Star, ChevronRight, Plus, Crown, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface CommunityScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
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

const gameGradients: Record<string, string> = {
  'Valorant': 'from-red-500 to-pink-500',
  'League of Legends': 'from-blue-500 to-cyan-500',
  'CS2': 'from-amber-500 to-orange-500',
  'default': 'from-indigo-500 to-purple-500'
};

interface SquadCardProps {
  name: string;
  game: string;
  members: number;
  isActive: boolean;
  role: 'owner' | 'admin' | 'member';
  onNavigate: () => void;
  index: number;
}

function CommunitySquadCard({ name, game, members, isActive, role, onNavigate, index }: SquadCardProps) {
  const gradient = gameGradients[game] || gameGradients.default;

  return (
    <motion.div
      variants={itemVariants}
      custom={index}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all"
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <div className="flex items-center gap-4">
        {/* Squad Avatar */}
        <motion.div
          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg flex-shrink-0`}
          whileHover={{ rotate: 5 }}
        >
          <span className="text-2xl">
            {game === 'Valorant' ? '🎯' : game === 'League of Legends' ? '⚔️' : game === 'CS2' ? '🔫' : '🎮'}
          </span>
        </motion.div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-gray-800 truncate">{name}</h4>
            {role === 'owner' && <Crown className="w-4 h-4 text-amber-500" />}
            {role === 'admin' && <Star className="w-4 h-4 text-blue-500" />}
          </div>
          <p className="text-sm text-gray-500 font-medium">{game}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Users className="w-3 h-3" /> {members} membres
            </span>
            {isActive && (
              <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Actif
              </span>
            )}
          </div>
        </div>

        {/* Action */}
        <motion.button
          onClick={onNavigate}
          className={`px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r ${gradient} text-white shadow-md`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Ouvrir
        </motion.button>
      </div>
    </motion.div>
  );
}

export function CommunityScreen({ onNavigate, showToast }: CommunityScreenProps) {
  const [activeTab, setActiveTab] = useState<'squads' | 'activity' | 'events'>('squads');

  const mockSquads = [
    { id: '1', name: 'Squad Alpha', game: 'Valorant', members: 6, isActive: true, role: 'owner' as const },
    { id: '2', name: 'Les Légendes', game: 'League of Legends', members: 8, isActive: true, role: 'admin' as const },
    { id: '3', name: 'CS Masters', game: 'CS2', members: 5, isActive: false, role: 'member' as const },
  ];

  const totalMembers = mockSquads.reduce((acc, s) => acc + s.members, 0);
  const activeSquads = mockSquads.filter(s => s.isActive).length;

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-br from-cyan-400/15 to-blue-400/15 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
            <motion.button
              onClick={() => onNavigate?.('home')}
              className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Communauté
              </h1>
              <p className="text-sm text-indigo-500 font-medium mt-0.5">
                Multi-Squads & Organisation
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Globe className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-6">
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg text-center"
              whileHover={{ y: -2 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-2">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{mockSquads.length}</div>
              <div className="text-xs text-gray-500 font-medium">Squads</div>
            </motion.div>
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg text-center"
              whileHover={{ y: -2 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{activeSquads}</div>
              <div className="text-xs text-gray-500 font-medium">Actives</div>
            </motion.div>
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg text-center"
              whileHover={{ y: -2 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-2">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{totalMembers}</div>
              <div className="text-xs text-gray-500 font-medium">Membres</div>
            </motion.div>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={itemVariants} className="flex gap-2 mb-6 bg-white/60 backdrop-blur-sm rounded-2xl p-1.5 border border-white/50">
            {[
              { id: 'squads', label: 'Mes Squads', icon: Users },
              { id: 'activity', label: 'Activité', icon: MessageCircle },
              { id: 'events', label: 'Events', icon: Calendar },
            ].map(tab => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'squads' && (
              <motion.div
                key="squads"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {mockSquads.map((squad, index) => (
                  <CommunitySquadCard
                    key={squad.id}
                    name={squad.name}
                    game={squad.game}
                    members={squad.members}
                    isActive={squad.isActive}
                    role={squad.role}
                    onNavigate={() => onNavigate?.('squad-detail', { squadId: squad.id })}
                    index={index}
                  />
                ))}
              </motion.div>
            )}

            {activeTab === 'activity' && (
              <motion.div
                key="activity"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <motion.div
                  className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <MessageCircle className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Fil d'activité</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                  Retrouve ici l'activité de toutes tes squads en temps réel
                </p>
              </motion.div>
            )}

            {activeTab === 'events' && (
              <motion.div
                key="events"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <motion.div
                  className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Calendar className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Events communautaires</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                  Découvre les tournois et événements de ta communauté
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Create Squad CTA */}
          <motion.div variants={itemVariants} className="mt-8">
            <motion.button
              onClick={() => onNavigate?.('create-squad')}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl font-semibold flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/30"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-5 h-5" />
              Créer une nouvelle squad
              <Sparkles className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Premium Banner */}
          <motion.div
            variants={itemVariants}
            className="mt-6 bg-gradient-to-r from-amber-100/80 to-orange-100/80 backdrop-blur-sm rounded-2xl p-4 border border-amber-200/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-amber-800">Squads illimitées avec Premium</h4>
                <p className="text-xs text-amber-600">Crée autant de squads que tu veux</p>
              </div>
              <motion.button
                onClick={() => onNavigate?.('premium')}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-semibold shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Upgrade
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default CommunityScreen;
