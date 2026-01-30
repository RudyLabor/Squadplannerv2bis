import { ArrowLeft, Crown, Target, Shield, Zap, Users, TrendingUp, Award, Plus, Gamepad2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface CoachingToolsScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

type Role = 'Duelist' | 'Controller' | 'Initiator' | 'Sentinel';

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

export function CoachingToolsScreen({ onNavigate, showToast }: CoachingToolsScreenProps) {
  const [activeTab, setActiveTab] = useState<'lineups' | 'roles' | 'drafts'>('lineups');
  const [selectedMap, setSelectedMap] = useState('Ascent');

  const maps = ['Ascent', 'Bind', 'Haven', 'Icebox', 'Split'];

  const roles: Array<{ name: Role; icon: any; gradient: string; shadow: string; description: string }> = [
    {
      name: 'Duelist',
      icon: Zap,
      gradient: 'from-red-500 to-orange-600',
      shadow: 'shadow-red-500/30',
      description: 'Fragger principal, entrée de site',
    },
    {
      name: 'Controller',
      icon: Shield,
      gradient: 'from-indigo-500 to-purple-600',
      shadow: 'shadow-indigo-500/30',
      description: 'Contrôle de zone, smokes',
    },
    {
      name: 'Initiator',
      icon: Target,
      gradient: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/30',
      description: 'Ouverture, intel, flash',
    },
    {
      name: 'Sentinel',
      icon: Crown,
      gradient: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/30',
      description: 'Défense, verrouillage',
    },
  ];

  const squadMembers = [
    {
      id: 1,
      name: 'RudyFourcade',
      avatar: 'https://images.unsplash.com/photo-1599220274056-a6cdbe06c2c0?w=100',
      assignedRole: 'Duelist' as Role,
      mainAgents: ['Jett', 'Reyna'],
      stats: { kd: 1.4, winrate: 65 },
    },
    {
      id: 2,
      name: 'KANA',
      avatar: 'https://images.unsplash.com/photo-1600080695930-6af670ad44fb?w=100',
      assignedRole: 'Controller' as Role,
      mainAgents: ['Omen', 'Viper'],
      stats: { kd: 1.1, winrate: 62 },
    },
    {
      id: 3,
      name: 'HunterAce',
      avatar: 'https://images.unsplash.com/photo-1684636098144-2cb2e1a8a3ab?w=100',
      assignedRole: 'Initiator' as Role,
      mainAgents: ['Sova', 'Breach'],
      stats: { kd: 1.2, winrate: 58 },
    },
    {
      id: 4,
      name: 'Maxence',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      assignedRole: 'Sentinel' as Role,
      mainAgents: ['Cypher', 'Killjoy'],
      stats: { kd: 1.0, winrate: 61 },
    },
  ];

  const lineups = [
    {
      id: 1,
      map: 'Ascent',
      site: 'A',
      agent: 'Sova',
      type: 'Recon',
      description: 'Dart A Main depuis spawn',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600',
      difficulty: 'Facile',
    },
    {
      id: 2,
      map: 'Ascent',
      site: 'B',
      agent: 'Viper',
      type: 'Molly',
      description: 'Post-plant B site',
      imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600',
      difficulty: 'Moyen',
    },
  ];

  const drafts = [
    {
      id: 1,
      name: 'Comp Meta - Ascent',
      map: 'Ascent',
      agents: ['Jett', 'Omen', 'Sova', 'Killjoy', 'Sage'],
      playstyle: 'Contrôle + Pick',
      rating: 4.5,
    },
    {
      id: 2,
      name: 'Rush B - Bind',
      map: 'Bind',
      agents: ['Raze', 'Brimstone', 'Skye', 'Cypher', 'Sage'],
      playstyle: 'Aggressif',
      rating: 4.2,
    },
  ];

  const getRoleStyle = (roleName: Role) => {
    return roles.find(r => r.name === roleName) || roles[0];
  };

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />
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
              onClick={() => onNavigate('premium')}
              className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Coaching Tools
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Optimisez vos stratégies
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-lg shadow-amber-500/30">
              PREMIUM
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={itemVariants} className="flex gap-2 mb-8 bg-white/60 backdrop-blur-sm p-1.5 rounded-2xl border border-white/50">
            {[
              { key: 'lineups', label: 'Lineups' },
              { key: 'roles', label: 'Rôles' },
              { key: 'drafts', label: 'Drafts' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 h-11 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-gray-800 shadow-lg'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Lineups Tab */}
          {activeTab === 'lineups' && (
            <motion.div variants={itemVariants}>
              {/* Map Selector */}
              <div className="mb-6">
                <label className="text-sm font-bold text-gray-700 mb-3 block">
                  Carte
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {maps.map((map) => (
                    <motion.button
                      key={map}
                      onClick={() => setSelectedMap(map)}
                      className={`px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                        selectedMap === map
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
                          : 'bg-white/80 text-gray-600 border border-white/50 hover:shadow-md'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {map}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Lineups Grid */}
              <div className="space-y-4 mb-6">
                {lineups
                  .filter(lineup => lineup.map === selectedMap)
                  .map((lineup, index) => (
                    <motion.div
                      key={lineup.id}
                      variants={itemVariants}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/50 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                      onClick={() => showToast('Détail lineup à venir', 'info')}
                      whileHover={{ scale: 1.01, y: -2 }}
                    >
                      <div className="relative h-40">
                        <ImageWithFallback
                          src={lineup.imageUrl}
                          alt={lineup.description}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 text-white text-xs font-semibold backdrop-blur-sm">
                          {lineup.difficulty}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-600">
                            {lineup.site}
                          </span>
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-600">
                            {lineup.agent}
                          </span>
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-600">
                            {lineup.type}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-gray-800">
                          {lineup.description}
                        </h3>
                      </div>
                    </motion.div>
                  ))}
              </div>

              <motion.button
                onClick={() => showToast('Création lineup à venir', 'info')}
                className="w-full h-12 bg-white/80 backdrop-blur-sm border border-white/50 hover:shadow-lg rounded-2xl font-semibold text-gray-700 flex items-center justify-center gap-2 transition-all"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Plus className="w-5 h-5" strokeWidth={2} />
                Ajouter un lineup
              </motion.button>
            </motion.div>
          )}

          {/* Roles Tab */}
          {activeTab === 'roles' && (
            <motion.div variants={itemVariants}>
              {/* Role Cards */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {roles.map((role, index) => (
                  <motion.div
                    key={role.name}
                    variants={itemVariants}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-lg"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <motion.div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center mb-3 shadow-lg ${role.shadow}`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <role.icon className="w-6 h-6 text-white" strokeWidth={2} />
                    </motion.div>
                    <h3 className="text-base font-bold text-gray-800 mb-1">
                      {role.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {role.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Squad Members with Roles */}
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-indigo-500" />
                <h3 className="text-sm font-bold text-gray-700">
                  Assignments
                </h3>
              </div>
              <div className="space-y-3">
                {squadMembers.map((member, index) => {
                  const roleStyle = getRoleStyle(member.assignedRole);
                  return (
                    <motion.div
                      key={member.id}
                      variants={itemVariants}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg"
                      whileHover={{ scale: 1.01, y: -2 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-white shadow-lg flex-shrink-0">
                          <ImageWithFallback
                            src={member.avatar}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-gray-800 mb-1">
                            {member.name}
                          </h4>
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-gradient-to-r ${roleStyle.gradient} text-white`}>
                              <roleStyle.icon className="w-3.5 h-3.5" strokeWidth={2} />
                              <span className="text-xs font-bold">
                                {member.assignedRole}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1.5">
                            {member.mainAgents.map(agent => (
                              <span key={agent} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                {agent}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-400 mb-0.5">K/D</div>
                          <div className="text-sm font-bold text-gray-800">{member.stats.kd}</div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Drafts Tab */}
          {activeTab === 'drafts' && (
            <motion.div variants={itemVariants}>
              <div className="space-y-4 mb-6">
                {drafts.map((draft, index) => (
                  <motion.div
                    key={draft.id}
                    variants={itemVariants}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                    onClick={() => showToast('Détail draft à venir', 'info')}
                    whileHover={{ scale: 1.01, y: -2 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-base font-bold text-gray-800 mb-1">
                          {draft.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-600 font-bold">
                            {draft.map}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500 font-medium">
                            {draft.playstyle}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-100">
                        <Award className="w-4 h-4 text-amber-600" strokeWidth={2} />
                        <span className="text-sm font-bold text-amber-600">
                          {draft.rating}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {draft.agents.map((agent) => (
                        <div
                          key={agent}
                          className="px-3 py-1.5 rounded-xl bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-700"
                        >
                          {agent}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                onClick={() => showToast('Création draft à venir', 'info')}
                className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Plus className="w-5 h-5" strokeWidth={2} />
                Créer une compo
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default CoachingToolsScreen;
