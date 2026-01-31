import { useState, useEffect } from 'react';
import { ArrowLeft, Building2, Users, BarChart3, Settings, Star, Shield, Sparkles, Plus, UserPlus, Loader2, Crown, RefreshCw, ChevronRight, Zap, Target, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { organizationsAPI, ORG_ROLE_LABELS, SQUAD_TIER_LABELS, ORG_TYPE_LABELS } from '@/utils/api';
import type { Organization, OrgSquad, OrgStats, OrgMember } from '@/utils/organizations-api';
import { IconButton, SkeletonPage } from '@/design-system';

interface OrganizationScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 28 }
  }
};

export function OrganizationScreen({ onNavigate, showToast }: OrganizationScreenProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [squads, setSquads] = useState<OrgSquad[]>([]);
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [stats, setStats] = useState<OrgStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgType, setNewOrgType] = useState<'esport' | 'community' | 'academy' | 'content_creator' | 'enterprise'>('esport');
  const [isCreating, setIsCreating] = useState(false);

  // Load organizations
  useEffect(() => {
    loadOrganizations();
  }, []);

  // Load selected org data
  useEffect(() => {
    if (selectedOrg) {
      loadOrgDetails(selectedOrg.id);
    }
  }, [selectedOrg]);

  const loadOrganizations = async () => {
    try {
      setIsLoading(true);
      const orgs = await organizationsAPI.getMyOrganizations();
      setOrganizations(orgs);
      if (orgs.length > 0) {
        setSelectedOrg(orgs[0]);
      }
    } catch (error) {
      console.error('Error loading organizations:', error);
      // En mode demo, ne pas afficher d'erreur - juste utiliser une liste vide
      setOrganizations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadOrgDetails = async (orgId: string) => {
    try {
      const [orgSquads, orgMembers, orgStats, adminStatus] = await Promise.all([
        organizationsAPI.getSquads(orgId),
        organizationsAPI.getMembers(orgId),
        organizationsAPI.getStats(orgId),
        organizationsAPI.isAdmin(orgId),
      ]);
      setSquads(orgSquads);
      setMembers(orgMembers);
      setStats(orgStats);
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error('Error loading org details:', error);
    }
  };

  const handleCreateOrganization = async () => {
    if (!newOrgName.trim()) {
      showToast?.('Nom requis', 'error');
      return;
    }

    try {
      setIsCreating(true);
      const orgId = await organizationsAPI.create(newOrgName, newOrgType);
      showToast?.('Organisation creee!', 'success');
      setShowCreateModal(false);
      setNewOrgName('');
      await loadOrganizations();
      // Select the newly created org
      const newOrg = await organizationsAPI.getById(orgId);
      if (newOrg) setSelectedOrg(newOrg);
    } catch (error) {
      console.error('Error creating org:', error);
      showToast?.('Erreur de creation', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleGenerateInvite = async () => {
    if (!selectedOrg) return;
    try {
      const inviteCode = await organizationsAPI.generateInvite(selectedOrg.id, 'player');
      const inviteLink = `${window.location.origin}/org/join/${inviteCode}`;
      await navigator.clipboard.writeText(inviteLink);
      showToast?.('Lien copie!', 'success');
    } catch (error) {
      console.error('Error generating invite:', error);
      showToast?.('Erreur', 'error');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090a] px-4 py-8">
        <SkeletonPage />
      </div>
    );
  }

  // No organizations - show create prompt
  if (organizations.length === 0) {
    return (
      <div className="min-h-screen pb-24 md:pb-8 pt-safe bg-[#08090a] relative overflow-hidden">
        {/* Subtle gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#5e6dd2]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 px-4 py-6 max-w-2xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-10">
              <IconButton
                icon={<ArrowLeft className="w-5 h-5" strokeWidth={1.5} />}
                onClick={() => onNavigate?.('home')}
                variant="ghost"
                aria-label="Retour"
                className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[#8a8f98] hover:text-white hover:bg-white/[0.06] transition-all"
              />
              <div className="flex-1">
                <h1 className="text-[22px] font-semibold text-white tracking-tight">
                  Organisation
                </h1>
                <p className="text-sm text-[#8a8f98]">Gestion B2B</p>
              </div>
            </motion.div>

            {/* Empty state */}
            <motion.div variants={itemVariants} className="text-center py-16">
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#5e6dd2] to-violet-600 mb-6"
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Building2 className="w-10 h-10 text-white" strokeWidth={1.5} />
              </motion.div>
              <h2 className="text-xl font-semibold text-white mb-2">Aucune organisation</h2>
              <p className="text-[#8a8f98] mb-8 max-w-xs mx-auto text-sm leading-relaxed">
                Creez votre organisation esport pour gerer vos equipes professionnellement
              </p>
              <motion.button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5e6dd2] hover:bg-[#6b7ae0] text-white font-medium rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-4 h-4" />
                Creer une organisation
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Create Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <CreateOrgModal
              name={newOrgName}
              setName={setNewOrgName}
              type={newOrgType}
              setType={setNewOrgType}
              isCreating={isCreating}
              onCreate={handleCreateOrganization}
              onClose={() => setShowCreateModal(false)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8 pt-safe bg-[#08090a] relative overflow-hidden">
      {/* Subtle gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#5e6dd2]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
            <IconButton
              icon={<ArrowLeft className="w-5 h-5" strokeWidth={1.5} />}
              onClick={() => onNavigate?.('home')}
              variant="ghost"
              aria-label="Retour"
              className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[#8a8f98] hover:text-white hover:bg-white/[0.06] transition-all"
            />
            <div className="flex-1">
              <h1 className="text-[22px] font-semibold text-white tracking-tight">
                Organisation
              </h1>
              <p className="text-sm text-[#8a8f98]">Gestion B2B</p>
            </div>
            <motion.button
              onClick={() => loadOrgDetails(selectedOrg?.id || '')}
              className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[#8a8f98] hover:text-white hover:bg-white/[0.06] transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
            </motion.button>
            {isAdmin && (
              <motion.button
                onClick={() => showToast?.('Parametres', 'info')}
                className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[#8a8f98] hover:text-white hover:bg-white/[0.06] transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="w-4 h-4" strokeWidth={1.5} />
              </motion.button>
            )}
          </motion.div>

          {/* Organization Selector (if multiple) */}
          {organizations.length > 1 && (
            <motion.div variants={itemVariants} className="mb-6">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {organizations.map((org) => (
                  <motion.button
                    key={org.id}
                    onClick={() => setSelectedOrg(org)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all text-sm ${
                      selectedOrg?.id === org.id
                        ? 'bg-[#5e6dd2] text-white'
                        : 'bg-white/[0.03] text-[#8a8f98] border border-white/[0.06] hover:text-white hover:bg-white/[0.06]'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {org.name}
                  </motion.button>
                ))}
                <motion.button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 rounded-lg bg-transparent border border-dashed border-white/[0.1] text-[#8a8f98] hover:text-white hover:border-white/[0.2] font-medium whitespace-nowrap text-sm transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  Nouvelle
                </motion.button>
              </div>
            </motion.div>
          )}

          {selectedOrg && (
            <>
              {/* Hero Section */}
              <motion.div variants={itemVariants} className="mb-6">
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#5e6dd2] to-violet-600 flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: selectedOrg.primary_color || undefined }}
                      whileHover={{ scale: 1.05, rotate: 2 }}
                    >
                      {selectedOrg.logo_url ? (
                        <img src={selectedOrg.logo_url} alt={selectedOrg.name} className="w-8 h-8 rounded-lg object-cover" />
                      ) : (
                        <Building2 className="w-7 h-7 text-white" strokeWidth={1.5} />
                      )}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-lg font-semibold text-white truncate">{selectedOrg.name}</h2>
                        {selectedOrg.is_verified && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-md text-xs font-medium">
                            <Star className="w-3 h-3 fill-current" /> Verifie
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#8a8f98]">
                        {ORG_TYPE_LABELS[selectedOrg.type as keyof typeof ORG_TYPE_LABELS] || selectedOrg.type}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Stats Cards */}
              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 text-center">
                  <div className="w-9 h-9 rounded-lg bg-[#5e6dd2]/10 flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-4.5 h-4.5 text-[#5e6dd2]" strokeWidth={1.5} />
                  </div>
                  <div className="text-2xl font-semibold text-white">{stats?.total_squads || squads.length}</div>
                  <div className="text-xs text-[#8a8f98]">Equipes</div>
                </div>
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 text-center">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
                    <Users className="w-4.5 h-4.5 text-emerald-400" strokeWidth={1.5} />
                  </div>
                  <div className="text-2xl font-semibold text-white">{stats?.total_members || members.length}</div>
                  <div className="text-xs text-[#8a8f98]">Membres</div>
                </div>
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 text-center">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="w-4.5 h-4.5 text-amber-400" strokeWidth={1.5} />
                  </div>
                  <div className="text-2xl font-semibold text-white">{stats?.avg_attendance_rate || 0}%</div>
                  <div className="text-xs text-[#8a8f98]">Presence</div>
                </div>
              </motion.div>

              {/* Extended Stats */}
              {stats && (
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                        <Target className="w-4.5 h-4.5 text-cyan-400" strokeWidth={1.5} />
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-white">{stats.total_sessions_this_month}</div>
                        <div className="text-xs text-[#8a8f98]">Sessions ce mois</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
                        <Zap className="w-4.5 h-4.5 text-violet-400" strokeWidth={1.5} />
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-white">{stats.avg_reliability_score}%</div>
                        <div className="text-xs text-[#8a8f98]">Fiabilite moyenne</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Teams List */}
              <motion.div variants={itemVariants} className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#5e6dd2]" strokeWidth={1.5} />
                    <h3 className="text-sm font-medium text-[#8a8f98]">
                      Equipes ({squads.length})
                    </h3>
                  </div>
                  {isAdmin && (
                    <motion.button
                      onClick={() => showToast?.('Ajouter une equipe', 'info')}
                      className="px-3 py-1.5 bg-[#5e6dd2]/10 text-[#5e6dd2] rounded-lg text-xs font-medium hover:bg-[#5e6dd2]/20 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus className="w-3 h-3 inline mr-1" />
                      Ajouter
                    </motion.button>
                  )}
                </div>
                <div className="space-y-2">
                  {squads.length === 0 ? (
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8 text-center">
                      <Shield className="w-10 h-10 text-[#3a3f47] mx-auto mb-3" strokeWidth={1.5} />
                      <p className="text-[#8a8f98] text-sm mb-4">Aucune equipe</p>
                      {isAdmin && (
                        <motion.button
                          onClick={() => showToast?.('Ajouter equipe', 'info')}
                          className="px-4 py-2 bg-[#5e6dd2] text-white rounded-lg text-sm font-medium hover:bg-[#6b7ae0] transition-colors"
                          whileHover={{ scale: 1.02 }}
                        >
                          Ajouter une equipe
                        </motion.button>
                      )}
                    </div>
                  ) : (
                    squads.map((squad) => (
                      <motion.button
                        key={squad.id}
                        onClick={() => onNavigate?.('squad-detail', { squadId: squad.squad_id })}
                        className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all group text-left"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#5e6dd2] to-violet-600 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-5 h-5 text-white" strokeWidth={1.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white truncate">{squad.squad_name || 'Squad'}</h4>
                            <p className="text-xs text-[#8a8f98]">
                              {squad.squad_members_count || 0} membres
                            </p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                            squad.tier === 'main' ? 'bg-[#5e6dd2]/10 text-[#5e6dd2]' :
                            squad.tier === 'academy' ? 'bg-blue-500/10 text-blue-400' :
                            'bg-white/[0.05] text-[#8a8f98]'
                          }`}>
                            {SQUAD_TIER_LABELS[squad.tier]}
                          </span>
                          <ChevronRight className="w-4 h-4 text-[#3a3f47] group-hover:text-[#8a8f98] transition-colors" />
                        </div>
                      </motion.button>
                    ))
                  )}
                </div>
              </motion.div>

              {/* Members Preview */}
              <motion.div variants={itemVariants} className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
                    <h3 className="text-sm font-medium text-[#8a8f98]">Staff & Managers</h3>
                  </div>
                  {isAdmin && (
                    <motion.button
                      onClick={handleGenerateInvite}
                      className="px-3 py-1.5 bg-amber-500/10 text-amber-400 rounded-lg text-xs font-medium hover:bg-amber-500/20 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <UserPlus className="w-3 h-3 inline mr-1" />
                      Inviter
                    </motion.button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {members
                    .filter(m => ['owner', 'admin', 'manager', 'coach'].includes(m.role))
                    .slice(0, 6)
                    .map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] border border-white/[0.06] rounded-lg"
                      >
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#5e6dd2]/30 to-violet-600/30 flex items-center justify-center overflow-hidden">
                          {member.avatar_url ? (
                            <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Users className="w-3.5 h-3.5 text-[#8a8f98]" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-white">{member.display_name || member.username}</p>
                          <p className="text-[10px] text-[#8a8f98]">{ORG_ROLE_LABELS[member.role]}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-6">
                <motion.button
                  onClick={() => onNavigate?.('advanced-stats')}
                  className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all group text-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-5 h-5 text-indigo-400" strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-medium text-white">Analytics</span>
                </motion.button>
                <motion.button
                  onClick={() => onNavigate?.('academy')}
                  className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all group text-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                    <Users className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-medium text-white">Academie</span>
                </motion.button>
              </motion.div>

              {/* Plan Info */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-r from-[#5e6dd2]/10 to-violet-600/10 border border-[#5e6dd2]/20 rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5e6dd2] to-violet-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">
                      Plan {selectedOrg.plan.charAt(0).toUpperCase() + selectedOrg.plan.slice(1)}
                    </p>
                    <p className="text-xs text-[#8a8f98]">
                      {selectedOrg.max_squads} equipes max - {selectedOrg.max_members} membres max
                    </p>
                  </div>
                  <Star className="w-5 h-5 text-[#5e6dd2]" fill="currentColor" />
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateOrgModal
            name={newOrgName}
            setName={setNewOrgName}
            type={newOrgType}
            setType={setNewOrgType}
            isCreating={isCreating}
            onCreate={handleCreateOrganization}
            onClose={() => setShowCreateModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Create Organization Modal Component
function CreateOrgModal({
  name,
  setName,
  type,
  setType,
  isCreating,
  onCreate,
  onClose,
}: {
  name: string;
  setName: (name: string) => void;
  type: 'esport' | 'community' | 'academy' | 'content_creator' | 'enterprise';
  setType: (type: 'esport' | 'community' | 'academy' | 'content_creator' | 'enterprise') => void;
  isCreating: boolean;
  onCreate: () => void;
  onClose: () => void;
}) {
  const orgTypes = [
    { id: 'esport', label: 'Organisation Esport', icon: Shield, color: 'text-[#5e6dd2]', bg: 'bg-[#5e6dd2]/10' },
    { id: 'community', label: 'Communaute', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 'academy', label: 'Academie', icon: Crown, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { id: 'content_creator', label: 'Createur de contenu', icon: Sparkles, color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { id: 'enterprise', label: 'Entreprise', icon: Building2, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#0f1012] border border-white/[0.08] rounded-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-white mb-6">Creer une organisation</h2>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-[#8a8f98] mb-2 block">
              Nom de l'organisation
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Rocket Esports"
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder:text-[#3a3f47] focus:border-[#5e6dd2] focus:outline-none focus:ring-1 focus:ring-[#5e6dd2]/50 transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#8a8f98] mb-2 block">
              Type d'organisation
            </label>
            <div className="grid grid-cols-2 gap-2">
              {orgTypes.map((t) => {
                const IconComponent = t.icon;
                return (
                  <motion.button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={`p-3 rounded-lg text-left transition-all ${
                      type === t.id
                        ? 'bg-[#5e6dd2]/10 border-2 border-[#5e6dd2]'
                        : 'bg-white/[0.02] border-2 border-transparent hover:bg-white/[0.04]'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className={`w-8 h-8 rounded-lg ${t.bg} flex items-center justify-center mb-2`}>
                      <IconComponent className={`w-4 h-4 ${t.color}`} strokeWidth={1.5} />
                    </div>
                    <p className="text-xs font-medium text-white">{t.label}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <motion.button
            onClick={onClose}
            className="flex-1 py-2.5 bg-white/[0.03] border border-white/[0.08] text-[#8a8f98] rounded-lg font-medium hover:bg-white/[0.06] hover:text-white transition-all"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            Annuler
          </motion.button>
          <motion.button
            onClick={onCreate}
            disabled={isCreating || !name.trim()}
            className="flex-1 py-2.5 bg-[#5e6dd2] hover:bg-[#6b7ae0] text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {isCreating ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              'Creer'
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default OrganizationScreen;
