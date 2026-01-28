import { ArrowLeft, Crown, Target, Shield, Zap, Users, TrendingUp, Award, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface CoachingToolsScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

type Role = 'Duelist' | 'Controller' | 'Initiator' | 'Sentinel';

export function CoachingToolsScreen({ onNavigate, showToast }: CoachingToolsScreenProps) {
  const [activeTab, setActiveTab] = useState<'lineups' | 'roles' | 'drafts'>('lineups');
  const [selectedMap, setSelectedMap] = useState('Ascent');
  const [isCreating, setIsCreating] = useState(false);

  const maps = ['Ascent', 'Bind', 'Haven', 'Icebox', 'Split'];

  const roles: Array<{ name: Role; icon: any; color: string; description: string }> = [
    {
      name: 'Duelist',
      icon: Zap,
      color: 'var(--error-500)',
      description: 'Fragger principal, entrée de site',
    },
    {
      name: 'Controller',
      icon: Shield,
      color: 'var(--primary-500)',
      description: 'Contrôle de zone, smokes',
    },
    {
      name: 'Initiator',
      icon: Target,
      color: 'var(--warning-500)',
      description: 'Ouverture, intel, flash',
    },
    {
      name: 'Sentinel',
      icon: Crown,
      color: 'var(--secondary-500)',
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

  const getRoleIcon = (roleName: Role) => {
    const role = roles.find(r => r.name === roleName);
    return role ? role.icon : Shield;
  };

  const getRoleColor = (roleName: Role) => {
    const role = roles.find(r => r.name === roleName);
    return role ? role.color : 'var(--fg-tertiary)';
  };

  return (
    <div className="min-h-screen pb-24 pt-safe">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={() => onNavigate('premium')}
            className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
              Coaching Tools
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)]">
              Optimisez vos stratégies
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[var(--primary-500)] to-[var(--secondary-500)] text-white text-xs font-bold">
            PREMIUM
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-[var(--bg-muted)] p-1.5 rounded-2xl">
          {['lineups', 'roles', 'drafts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 h-11 rounded-xl font-semibold text-sm transition-all ${
                activeTab === tab
                  ? 'bg-white text-[var(--fg-primary)] shadow-sm'
                  : 'text-[var(--fg-tertiary)] hover:text-[var(--fg-secondary)]'
              }`}
            >
              {tab === 'lineups' && 'Lineups'}
              {tab === 'roles' && 'Rôles'}
              {tab === 'drafts' && 'Drafts'}
            </button>
          ))}
        </div>

        {/* Lineups Tab */}
        {activeTab === 'lineups' && (
          <div>
            {/* Map Selector */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-[var(--fg-secondary)] mb-3 block">
                Carte
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {maps.map((map) => (
                  <button
                    key={map}
                    onClick={() => setSelectedMap(map)}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                      selectedMap === map
                        ? 'bg-[var(--primary-500)] text-white shadow-md'
                        : 'bg-white text-[var(--fg-tertiary)] border-[0.5px] border-[var(--border-medium)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    {map}
                  </button>
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl overflow-hidden border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all cursor-pointer"
                    onClick={() => showToast('Détail lineup à venir', 'info')}
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
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-[var(--primary-100)] text-[var(--primary-600)]">
                          {lineup.site}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-[var(--secondary-100)] text-[var(--secondary-600)]">
                          {lineup.agent}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-[var(--warning-100)] text-[var(--warning-600)]">
                          {lineup.type}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-[var(--fg-primary)]">
                        {lineup.description}
                      </h3>
                    </div>
                  </motion.div>
                ))}
            </div>

            <Button
              variant="ghost"
              onClick={() => showToast('Création lineup à venir', 'info')}
              className="w-full h-12 bg-white border-[0.5px] border-[var(--border-medium)] hover:border-[var(--border-strong)] rounded-2xl font-semibold"
            >
              <Plus className="w-5 h-5" strokeWidth={2} />
              Ajouter un lineup
            </Button>
          </div>
        )}

        {/* Roles Tab */}
        {activeTab === 'roles' && (
          <div>
            {/* Role Cards */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {roles.map((role, index) => (
                <motion.div
                  key={role.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-5 border-[0.5px] border-[var(--border-subtle)] shadow-sm"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${role.color}15` }}
                  >
                    <role.icon className="w-6 h-6" style={{ color: role.color }} strokeWidth={2} />
                  </div>
                  <h3 className="text-base font-bold text-[var(--fg-primary)] mb-1">
                    {role.name}
                  </h3>
                  <p className="text-xs text-[var(--fg-tertiary)]">
                    {role.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Squad Members with Roles */}
            <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-4">
              Assignments
            </h3>
            <div className="space-y-3">
              {squadMembers.map((member, index) => {
                const RoleIcon = getRoleIcon(member.assignedRole);
                const roleColor = getRoleColor(member.assignedRole);

                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-[var(--border-subtle)] flex-shrink-0">
                        <ImageWithFallback
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                          {member.name}
                        </h4>
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg"
                            style={{ backgroundColor: `${roleColor}15` }}
                          >
                            <RoleIcon className="w-3.5 h-3.5" style={{ color: roleColor }} strokeWidth={2} />
                            <span className="text-xs font-bold" style={{ color: roleColor }}>
                              {member.assignedRole}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          {member.mainAgents.map(agent => (
                            <span key={agent} className="text-xs text-[var(--fg-tertiary)] bg-[var(--bg-muted)] px-2 py-0.5 rounded">
                              {agent}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-[var(--fg-tertiary)] mb-0.5">K/D</div>
                        <div className="text-sm font-bold text-[var(--fg-primary)]">{member.stats.kd}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Drafts Tab */}
        {activeTab === 'drafts' && (
          <div>
            <div className="space-y-4 mb-6">
              {drafts.map((draft, index) => (
                <motion.div
                  key={draft.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-5 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() => showToast('Détail draft à venir', 'info')}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-[var(--fg-primary)] mb-1">
                        {draft.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--primary-100)] text-[var(--primary-600)] font-semibold">
                          {draft.map}
                        </span>
                        <span className="text-xs text-[var(--fg-tertiary)]">•</span>
                        <span className="text-xs text-[var(--fg-tertiary)] font-medium">
                          {draft.playstyle}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--warning-100)]">
                      <Award className="w-4 h-4 text-[var(--warning-600)]" strokeWidth={2} />
                      <span className="text-sm font-bold text-[var(--warning-600)]">
                        {draft.rating}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {draft.agents.map((agent) => (
                      <div
                        key={agent}
                        className="px-3 py-1.5 rounded-xl bg-[var(--bg-muted)] border-[0.5px] border-[var(--border-medium)] text-xs font-semibold text-[var(--fg-secondary)]"
                      >
                        {agent}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <Button
              variant="primary"
              onClick={() => showToast('Création draft à venir', 'info')}
              className="w-full h-12 bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] hover:from-[var(--primary-600)] hover:to-[var(--primary-700)] text-white rounded-2xl font-semibold shadow-lg shadow-[var(--primary-500)]/20 hover:shadow-xl hover:shadow-[var(--primary-500)]/30 transition-all duration-200"
            >
              <Plus className="w-5 h-5" strokeWidth={2} />
              Créer une compo
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}

export default CoachingToolsScreen;