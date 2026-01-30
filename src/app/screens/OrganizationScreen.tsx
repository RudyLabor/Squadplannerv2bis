import { useState, useEffect } from 'react';
import { ArrowLeft, Building2, Users, TrendingUp, BarChart3, Settings, Star, Shield, Sparkles, Plus, UserPlus, Loader2, Crown, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { organizationsAPI, ORG_ROLE_LABELS, SQUAD_TIER_LABELS, ORG_TYPE_LABELS } from '@/utils/api';
import type { Organization, OrgSquad, OrgStats, OrgMember } from '@/utils/organizations-api';
import { IconButton, Card, Badge, SkeletonPage } from '@/design-system';

interface OrganizationScreenProps {
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
      showToast?.('Erreur de chargement', 'error');
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
      showToast?.('Organisation créée!', 'success');
      setShowCreateModal(false);
      setNewOrgName('');
      await loadOrganizations();
      // Select the newly created org
      const newOrg = await organizationsAPI.getById(orgId);
      if (newOrg) setSelectedOrg(newOrg);
    } catch (error) {
      console.error('Error creating org:', error);
      showToast?.('Erreur de création', 'error');
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
      showToast?.('Lien copié!', 'success');
    } catch (error) {
      console.error('Error generating invite:', error);
      showToast?.('Erreur', 'error');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 px-4 py-8">
        <SkeletonPage />
      </div>
    );
  }

  // No organizations - show create prompt
  if (organizations.length === 0) {
    return (
      <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 relative overflow-hidden">
        <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
              <IconButton
                icon={<ArrowLeft className="w-5 h-5" strokeWidth={2} />}
                onClick={() => onNavigate?.('home')}
                variant="ghost"
                aria-label="Retour a l'accueil"
                className="w-12 h-12 rounded-2xl bg-[var(--bg-elevated)]/80 backdrop-blur-sm border border-[var(--border-subtle)] shadow-lg"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Organisation
                </h1>
                <p className="text-sm text-[var(--fg-secondary)] font-medium">Gestion B2B</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center py-12">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-red-500 to-orange-600 mb-6 shadow-xl">
                <Building2 className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg-primary)] mb-3">Aucune organisation</h2>
              <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                Créez votre organisation esport pour gérer vos équipes professionnellement
              </p>
              <motion.button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                Créer une organisation
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
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-red-400/20 to-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
            <IconButton
              icon={<ArrowLeft className="w-5 h-5" strokeWidth={2} />}
              onClick={() => onNavigate?.('home')}
              variant="ghost"
              aria-label="Retour a l'accueil"
              className="w-12 h-12 rounded-2xl bg-[var(--bg-elevated)]/80 backdrop-blur-sm border border-[var(--border-subtle)] shadow-lg hover:shadow-xl transition-all"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Organisation
              </h1>
              <p className="text-sm text-[var(--fg-secondary)] font-medium">
                Gestion B2B
              </p>
            </div>
            <motion.button
              onClick={() => loadOrgDetails(selectedOrg?.id || '')}
              className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="w-4 h-4 text-gray-500" />
            </motion.button>
            {isAdmin && (
              <motion.button
                onClick={() => showToast?.('Paramètres', 'info')}
                className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="w-5 h-5 text-gray-500" strokeWidth={2} />
              </motion.button>
            )}
          </motion.div>

          {/* Organization Selector (if multiple) */}
          {organizations.length > 1 && (
            <motion.div variants={itemVariants} className="mb-6">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {organizations.map((org) => (
                  <motion.button
                    key={org.id}
                    onClick={() => setSelectedOrg(org)}
                    className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                      selectedOrg?.id === org.id
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                        : 'bg-white/80 text-gray-600 border border-white/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {org.name}
                  </motion.button>
                ))}
                <motion.button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 rounded-xl bg-white/60 border border-dashed border-gray-300 text-gray-500 font-medium whitespace-nowrap"
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
              <motion.div variants={itemVariants} className="text-center py-6 mb-6">
                <div
                  className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-orange-600 mb-4 shadow-xl shadow-red-500/30"
                  style={{ backgroundColor: selectedOrg.primary_color || undefined }}
                >
                  {selectedOrg.logo_url ? (
                    <img src={selectedOrg.logo_url} alt={selectedOrg.name} className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <Building2 className="w-10 h-10 text-white" strokeWidth={1.5} />
                  )}
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-[var(--fg-primary)] mb-1">{selectedOrg.name}</h2>
                <p className="text-gray-500 font-medium">
                  {ORG_TYPE_LABELS[selectedOrg.type as keyof typeof ORG_TYPE_LABELS] || selectedOrg.type}
                </p>
                {selectedOrg.is_verified && (
                  <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                    <Star className="w-3 h-3 fill-current" /> Vérifié
                  </span>
                )}
              </motion.div>

              {/* Stats Card */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl p-5 mb-6 shadow-xl shadow-red-500/30 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

                <div className="relative z-10 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{stats?.total_squads || squads.length}</div>
                    <div className="text-xs text-white/80 font-medium">Équipes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{stats?.total_members || members.length}</div>
                    <div className="text-xs text-white/80 font-medium">Membres</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{stats?.avg_attendance_rate || 0}%</div>
                    <div className="text-xs text-white/80 font-medium">Présence</div>
                  </div>
                </div>

                {stats && (
                  <div className="relative z-10 grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/20">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{stats.total_sessions_this_month}</div>
                      <div className="text-xs text-white/80">Sessions ce mois</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{stats.avg_reliability_score}%</div>
                      <div className="text-xs text-white/80">Fiabilité moyenne</div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Teams List */}
              <motion.div variants={itemVariants} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-red-500" />
                    <h3 className="text-sm font-bold tracking-tight text-[var(--fg-secondary)]">
                      Équipes ({squads.length})
                    </h3>
                  </div>
                  {isAdmin && (
                    <motion.button
                      onClick={() => showToast?.('Ajouter une équipe', 'info')}
                      className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-bold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus className="w-3 h-3 inline mr-1" />
                      Ajouter
                    </motion.button>
                  )}
                </div>
                <div className="space-y-3">
                  {squads.length === 0 ? (
                    <div className="bg-white/60 rounded-2xl p-6 text-center">
                      <Shield className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Aucune équipe</p>
                      {isAdmin && (
                        <motion.button
                          onClick={() => showToast?.('Ajouter équipe', 'info')}
                          className="mt-3 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold"
                          whileHover={{ scale: 1.05 }}
                        >
                          Ajouter une équipe
                        </motion.button>
                      )}
                    </div>
                  ) : (
                    squads.map((squad) => (
                      <motion.div
                        key={squad.id}
                        variants={itemVariants}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all"
                        whileHover={{ scale: 1.01, y: -2 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <motion.div
                              className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-md"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <Shield className="w-5 h-5 text-white" strokeWidth={2} />
                            </motion.div>
                            <div>
                              <h4 className="font-bold tracking-tight text-[var(--fg-primary)]">{squad.squad_name || 'Squad'}</h4>
                              <p className="text-xs text-gray-500 font-medium">
                                {squad.squad_members_count || 0} membres • {SQUAD_TIER_LABELS[squad.tier]}
                              </p>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                            squad.tier === 'main' ? 'bg-red-100 text-red-700' :
                            squad.tier === 'academy' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {squad.squad_game || squad.tier}
                          </span>
                        </div>
                        <motion.button
                          onClick={() => onNavigate?.('squad-detail', { squadId: squad.squad_id })}
                          className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          Gérer l'équipe
                        </motion.button>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>

              {/* Members Preview */}
              <motion.div variants={itemVariants} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-500" />
                    <h3 className="text-sm font-bold tracking-tight text-[var(--fg-secondary)]">Staff & Managers</h3>
                  </div>
                  {isAdmin && (
                    <motion.button
                      onClick={handleGenerateInvite}
                      className="px-3 py-1.5 bg-amber-100 text-amber-600 rounded-lg text-xs font-bold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
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
                        className="flex items-center gap-2 px-3 py-2 bg-white/80 rounded-xl border border-white/50"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
                          {member.avatar_url ? (
                            <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Users className="w-4 h-4 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800">{member.display_name || member.username}</p>
                          <p className="text-[10px] text-gray-500">{ORG_ROLE_LABELS[member.role]}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
                <motion.button
                  onClick={() => onNavigate?.('advanced-stats')}
                  className="flex flex-col items-center gap-3 py-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                    <BarChart3 className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <span className="text-sm font-bold text-gray-800">Analytics</span>
                </motion.button>
                <motion.button
                  onClick={() => onNavigate?.('academy')}
                  className="flex flex-col items-center gap-3 py-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                    <Users className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <span className="text-sm font-bold text-gray-800">Académie</span>
                </motion.button>
              </motion.div>

              {/* Pro Tip */}
              <motion.div
                variants={itemVariants}
                className="mt-6 bg-gradient-to-br from-amber-100/80 to-orange-100/80 backdrop-blur-sm rounded-2xl p-4 border border-amber-200/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                    <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-amber-800">
                      Plan {selectedOrg.plan.charAt(0).toUpperCase() + selectedOrg.plan.slice(1)}
                    </p>
                    <p className="text-[10px] text-amber-600 mt-0.5">
                      {selectedOrg.max_squads} équipes max • {selectedOrg.max_members} membres max
                    </p>
                  </div>
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
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
    { id: 'esport', label: 'Organisation Esport', icon: '🎮' },
    { id: 'community', label: 'Communauté', icon: '🌐' },
    { id: 'academy', label: 'Académie', icon: '🎓' },
    { id: 'content_creator', label: 'Créateur de contenu', icon: '📹' },
    { id: 'enterprise', label: 'Entreprise', icon: '🏢' },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold tracking-tight text-[var(--fg-primary)] mb-6">Créer une organisation</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              Nom de l'organisation
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Rocket Esports"
              className="w-full px-4 py-3 bg-gray-100 rounded-xl border-2 border-transparent focus:border-red-500 focus:outline-none font-medium"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              Type d'organisation
            </label>
            <div className="grid grid-cols-2 gap-2">
              {orgTypes.map((t) => (
                <motion.button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={`p-3 rounded-xl text-left transition-all ${
                    type === t.id
                      ? 'bg-red-100 border-2 border-red-500'
                      : 'bg-gray-100 border-2 border-transparent'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-lg">{t.icon}</span>
                  <p className="text-xs font-medium text-gray-700 mt-1">{t.label}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <motion.button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Annuler
          </motion.button>
          <motion.button
            onClick={onCreate}
            disabled={isCreating || !name.trim()}
            className="flex-1 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isCreating ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              'Créer'
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default OrganizationScreen;
