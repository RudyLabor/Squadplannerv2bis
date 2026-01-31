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
    <div className="min-h-screen pb-24 md:pb-8 bg-[#08090a]">
      <motion.div
        className="max-w-2xl mx-auto px-4 md:px-6 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header - Linear style */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
          <motion.button
            onClick={() => onNavigate('premium')}
            className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#8b8d90] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#f7f8f8] transition-all"
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-[24px] md:text-[28px] font-semibold text-[#f7f8f8]">
              Coaching Tools
            </h1>
            <p className="text-[13px] text-[#5e6063]">
              Optimisez vos stratégies
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-[rgba(245,166,35,0.15)] text-[#f5a623] text-[11px] font-semibold uppercase">
            Premium
          </span>
        </motion.div>

        {/* Tabs - Linear style */}
        <motion.div variants={itemVariants} className="flex gap-1 p-1 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] mb-6">
          {[
            { key: 'lineups', label: 'Lineups' },
            { key: 'roles', label: 'Rôles' },
            { key: 'drafts', label: 'Drafts' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 h-10 rounded-md text-[13px] font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-[rgba(94,109,210,0.15)] text-[#8b93ff] border border-[rgba(94,109,210,0.3)]'
                  : 'text-[#8b8d90] hover:text-[#f7f8f8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Lineups Tab - Linear style */}
        {activeTab === 'lineups' && (
          <motion.div variants={itemVariants}>
            {/* Map Selector */}
            <div className="mb-6">
              <label className="block text-[11px] font-medium text-[#5e6063] uppercase tracking-wider mb-2">
                Carte
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {maps.map((map) => (
                  <motion.button
                    key={map}
                    onClick={() => setSelectedMap(map)}
                    className={`px-4 py-2 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all ${
                      selectedMap === map
                        ? 'bg-[rgba(94,109,210,0.15)] text-[#8b93ff] border border-[rgba(94,109,210,0.3)]'
                        : 'bg-[rgba(255,255,255,0.02)] text-[#8b8d90] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)] hover:text-[#f7f8f8]'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    {map}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Lineups Grid */}
            <div className="space-y-3 mb-6">
              {lineups
                .filter(lineup => lineup.map === selectedMap)
                .map((lineup) => (
                  <motion.div
                    key={lineup.id}
                    variants={itemVariants}
                    className="rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] overflow-hidden hover:bg-[rgba(255,255,255,0.04)] transition-colors cursor-pointer"
                    onClick={() => showToast('Détail lineup à venir', 'info')}
                    whileHover={{ y: -2 }}
                  >
                    <div className="relative h-36">
                      <ImageWithFallback
                        src={lineup.imageUrl}
                        alt={lineup.description}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#08090a] via-transparent to-transparent" />
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[rgba(0,0,0,0.6)] text-[#f7f8f8] text-[11px] font-medium backdrop-blur-sm">
                        {lineup.difficulty}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[rgba(94,109,210,0.15)] text-[#8b93ff]">
                          {lineup.site}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[rgba(245,166,35,0.15)] text-[#f5a623]">
                          {lineup.agent}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[rgba(74,222,128,0.15)] text-[#4ade80]">
                          {lineup.type}
                        </span>
                      </div>
                      <h3 className="text-[14px] font-semibold text-[#f7f8f8]">
                        {lineup.description}
                      </h3>
                    </div>
                  </motion.div>
                ))}
            </div>

            <motion.button
              onClick={() => showToast('Création lineup à venir', 'info')}
              className="w-full h-11 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#8b8d90] text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-[rgba(255,255,255,0.06)] hover:text-[#f7f8f8] transition-all"
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4" strokeWidth={2} />
              Ajouter un lineup
            </motion.button>
          </motion.div>
        )}

        {/* Roles Tab - Linear style */}
        {activeTab === 'roles' && (
          <motion.div variants={itemVariants}>
            {/* Role Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {roles.map((role) => {
                const roleColors: Record<Role, { bg: string; icon: string }> = {
                  'Duelist': { bg: 'bg-[rgba(248,113,113,0.1)]', icon: 'text-[#f87171]' },
                  'Controller': { bg: 'bg-[rgba(94,109,210,0.1)]', icon: 'text-[#8b93ff]' },
                  'Initiator': { bg: 'bg-[rgba(245,166,35,0.1)]', icon: 'text-[#f5a623]' },
                  'Sentinel': { bg: 'bg-[rgba(74,222,128,0.1)]', icon: 'text-[#4ade80]' },
                };
                const colors = roleColors[role.name];

                return (
                  <motion.div
                    key={role.name}
                    variants={itemVariants}
                    className="rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] p-4 hover:bg-[rgba(255,255,255,0.04)] transition-colors"
                    whileHover={{ y: -2 }}
                  >
                    <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center mb-3`}>
                      <role.icon className={`w-5 h-5 ${colors.icon}`} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[14px] font-semibold text-[#f7f8f8] mb-1">
                      {role.name}
                    </h3>
                    <p className="text-[12px] text-[#5e6063]">
                      {role.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Squad Members with Roles */}
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-[#8b93ff]" strokeWidth={1.5} />
              <h3 className="text-[14px] font-semibold text-[#f7f8f8]">
                Assignments
              </h3>
            </div>
            <div className="space-y-3">
              {squadMembers.map((member) => {
                const roleColors: Record<Role, { bg: string; text: string }> = {
                  'Duelist': { bg: 'bg-[rgba(248,113,113,0.15)]', text: 'text-[#f87171]' },
                  'Controller': { bg: 'bg-[rgba(94,109,210,0.15)]', text: 'text-[#8b93ff]' },
                  'Initiator': { bg: 'bg-[rgba(245,166,35,0.15)]', text: 'text-[#f5a623]' },
                  'Sentinel': { bg: 'bg-[rgba(74,222,128,0.15)]', text: 'text-[#4ade80]' },
                };
                const colors = roleColors[member.assignedRole];
                const roleStyle = getRoleStyle(member.assignedRole);

                return (
                  <motion.div
                    key={member.id}
                    variants={itemVariants}
                    className="rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] p-4 hover:bg-[rgba(255,255,255,0.04)] transition-colors"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-[rgba(255,255,255,0.05)] flex-shrink-0">
                        <ImageWithFallback
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[14px] font-semibold text-[#f7f8f8] mb-1">
                          {member.name}
                        </h4>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md ${colors.bg}`}>
                            <roleStyle.icon className={`w-3 h-3 ${colors.text}`} strokeWidth={2} />
                            <span className={`text-[11px] font-medium ${colors.text}`}>
                              {member.assignedRole}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                          {member.mainAgents.map(agent => (
                            <span key={agent} className="text-[11px] text-[#8b8d90] bg-[rgba(255,255,255,0.04)] px-2 py-0.5 rounded-md">
                              {agent}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-[#5e6063] uppercase mb-0.5">K/D</div>
                        <div className="text-[15px] font-semibold text-[#f7f8f8] tabular-nums">{member.stats.kd}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Drafts Tab - Linear style */}
        {activeTab === 'drafts' && (
          <motion.div variants={itemVariants}>
            <div className="space-y-3 mb-6">
              {drafts.map((draft) => (
                <motion.div
                  key={draft.id}
                  variants={itemVariants}
                  className="rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] p-4 hover:bg-[rgba(255,255,255,0.04)] transition-colors cursor-pointer"
                  onClick={() => showToast('Détail draft à venir', 'info')}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-[15px] font-semibold text-[#f7f8f8] mb-1">
                        {draft.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-[rgba(94,109,210,0.15)] text-[#8b93ff] font-medium">
                          {draft.map}
                        </span>
                        <span className="text-[12px] text-[#5e6063]">
                          {draft.playstyle}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[rgba(245,166,35,0.1)]">
                      <Award className="w-4 h-4 text-[#f5a623]" strokeWidth={1.5} />
                      <span className="text-[13px] font-semibold text-[#f5a623] tabular-nums">
                        {draft.rating}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {draft.agents.map((agent) => (
                      <div
                        key={agent}
                        className="px-2.5 py-1 rounded-md bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] text-[12px] font-medium text-[#f7f8f8]"
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
              className="w-full h-12 rounded-xl bg-[#5e6dd2] text-white text-[14px] font-semibold flex items-center justify-center gap-2 hover:bg-[#6a79db] shadow-lg shadow-[#5e6dd2]/20 transition-all"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-5 h-5" strokeWidth={2} />
              Créer une compo
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default CoachingToolsScreen;
