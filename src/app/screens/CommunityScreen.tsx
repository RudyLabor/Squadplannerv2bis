/**
 * COMMUNITY SCREEN - LINEAR DESIGN SYSTEM v2
 * Multi-Squads & Organisation hub
 * Inspired by Linear.app - World-class design
 */

import { ArrowLeft, Globe, Users, TrendingUp, Calendar, MessageCircle, Star, Plus, Crown, Zap, ChevronRight, Gamepad2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface CommunityScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

// ============================================
// ANIMATIONS - Linear-like smooth motion
// ============================================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }
  }
};

// ============================================
// STAT CARD - Transparent bg, colored icons
// ============================================
function StatCard({
  icon: Icon,
  value,
  label,
  accentColor = "#5e6dd2"
}: {
  icon: any;
  value: string | number;
  label: string;
  accentColor?: string;
}) {
  return (
    <motion.div
      className="relative p-4 md:p-5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] transition-all duration-200 group cursor-default overflow-hidden"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
    >
      <div className="relative text-center">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3 transition-all duration-150"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <Icon
            className="w-5 h-5 transition-colors"
            style={{ color: accentColor }}
            strokeWidth={1.5}
          />
        </div>
        <p className="text-[24px] md:text-[28px] font-semibold text-[#f7f8f8] tabular-nums leading-none tracking-tight mb-0.5">
          {value}
        </p>
        <span className="text-[11px] md:text-[12px] text-[rgba(255,255,255,0.4)] uppercase tracking-wide">{label}</span>
      </div>
    </motion.div>
  );
}

// ============================================
// TAB BUTTON - Linear style tabs
// ============================================
function TabButton({
  active,
  icon: Icon,
  label,
  onClick
}: {
  active: boolean;
  icon: any;
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
        active
          ? 'bg-[rgba(255,255,255,0.08)] text-[#f7f8f8]'
          : 'text-[#5e6063] hover:text-[#8b8d90] hover:bg-[rgba(255,255,255,0.03)]'
      }`}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="w-4 h-4" strokeWidth={1.5} />
      {label}
    </motion.button>
  );
}

// ============================================
// SQUAD CARD - Premium Linear style
// ============================================
interface SquadCardProps {
  name: string;
  game: string;
  members: number;
  isActive: boolean;
  role: 'owner' | 'admin' | 'member';
  onNavigate: () => void;
}

const gameColors: Record<string, string> = {
  'Valorant': '#ff4654',
  'League of Legends': '#0ac8b9',
  'CS2': '#f5a623',
  'default': '#5e6dd2'
};

const gameIcons: Record<string, string> = {
  'Valorant': '🎯',
  'League of Legends': '⚔️',
  'CS2': '🔫',
  'default': '🎮'
};

function SquadCard({ name, game, members, isActive, role, onNavigate }: SquadCardProps) {
  const accentColor = gameColors[game] || gameColors.default;
  const emoji = gameIcons[game] || gameIcons.default;

  return (
    <motion.button
      onClick={onNavigate}
      className="relative w-full p-4 md:p-5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] text-left transition-all duration-200 group overflow-hidden"
      variants={itemVariants}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <div className="relative flex items-center gap-4">
        {/* Squad Avatar */}
        <div
          className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <span className="text-xl md:text-2xl">{emoji}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-[15px] md:text-[16px] font-semibold text-[#f7f8f8] group-hover:text-white truncate transition-colors">
              {name}
            </h4>
            {role === 'owner' && <Crown className="w-4 h-4 text-[#f5a623] flex-shrink-0" strokeWidth={1.5} />}
            {role === 'admin' && <Star className="w-4 h-4 text-[#5e6dd2] flex-shrink-0" strokeWidth={1.5} />}
          </div>
          <p className="text-[13px] text-[#5e6063] font-medium mb-1">{game}</p>
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-[#5e6063] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
              {members} membres
            </span>
            {isActive && (
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#4ade80]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                Actif
              </span>
            )}
          </div>
        </div>

        {/* Action */}
        <div className="flex items-center gap-2">
          <span
            className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-200"
            style={{
              backgroundColor: `${accentColor}15`,
              color: accentColor
            }}
          >
            Ouvrir
          </span>
          <ChevronRight className="w-4 h-4 text-[#27282b] group-hover:text-[#5e6063] group-hover:translate-x-0.5 transition-all" strokeWidth={1.5} />
        </div>
      </div>
    </motion.button>
  );
}

// ============================================
// EMPTY STATE - Premium illustration
// ============================================
function EmptyState({
  icon: Icon,
  title,
  description,
  accentColor = "#5e6dd2"
}: {
  icon: any;
  title: string;
  description: string;
  accentColor?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-b from-[#18191b] to-[#101012] border border-[rgba(255,255,255,0.06)] text-center overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: `${accentColor}05` }} />

      <div className="relative">
        <motion.div
          className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[rgba(255,255,255,0.05)]"
          style={{ backgroundColor: `${accentColor}10` }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon className="w-8 h-8 md:w-10 md:h-10" style={{ color: accentColor }} strokeWidth={1.2} />
        </motion.div>

        <h3 className="text-[18px] md:text-[20px] font-bold text-[#f7f8f8] mb-2">{title}</h3>
        <p className="text-[14px] md:text-[15px] text-[#8b8d90] max-w-[320px] mx-auto leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export function CommunityScreen({ onNavigate }: CommunityScreenProps) {
  const [activeTab, setActiveTab] = useState<'squads' | 'activity' | 'events'>('squads');

  const mockSquads = [
    { id: '1', name: 'Squad Alpha', game: 'Valorant', members: 6, isActive: true, role: 'owner' as const },
    { id: '2', name: 'Les Legendes', game: 'League of Legends', members: 8, isActive: true, role: 'admin' as const },
    { id: '3', name: 'CS Masters', game: 'CS2', members: 5, isActive: false, role: 'member' as const },
  ];

  const totalMembers = mockSquads.reduce((acc, s) => acc + s.members, 0);
  const activeSquads = mockSquads.filter(s => s.isActive).length;

  return (
    <div className="min-h-screen bg-[#08090a] pb-28 md:pb-10">
      <motion.div
        className="max-w-2xl mx-auto px-5 md:px-8 py-8 md:py-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ============================================ */}
        {/* HEADER */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
          <motion.button
            onClick={() => onNavigate?.('home')}
            className="w-11 h-11 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.1)] flex items-center justify-center transition-all duration-150"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-5 h-5 text-[#8b8d90]" strokeWidth={1.5} />
          </motion.button>

          <div className="flex-1">
            <h1 className="text-[24px] md:text-[28px] font-semibold text-[#f7f8f8] tracking-tight">
              Communaute
            </h1>
            <p className="text-[13px] md:text-[14px] text-[#5e6063]">
              Multi-Squads & Organisation
            </p>
          </div>

          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(94,109,210,0.15)' }}
          >
            <Globe className="w-5 h-5 text-[#5e6dd2]" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* STATS */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
          <StatCard
            icon={Users}
            value={mockSquads.length}
            label="Squads"
            accentColor="#5e6dd2"
          />
          <StatCard
            icon={TrendingUp}
            value={activeSquads}
            label="Actives"
            accentColor="#4ade80"
          />
          <StatCard
            icon={Star}
            value={totalMembers}
            label="Membres"
            accentColor="#f5a623"
          />
        </motion.div>

        {/* ============================================ */}
        {/* TABS */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="p-1 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
            <div className="flex gap-1">
              <TabButton
                active={activeTab === 'squads'}
                icon={Users}
                label="Mes Squads"
                onClick={() => setActiveTab('squads')}
              />
              <TabButton
                active={activeTab === 'activity'}
                icon={MessageCircle}
                label="Activite"
                onClick={() => setActiveTab('activity')}
              />
              <TabButton
                active={activeTab === 'events'}
                icon={Calendar}
                label="Events"
                onClick={() => setActiveTab('events')}
              />
            </div>
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* CONTENT */}
        {/* ============================================ */}
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
              {mockSquads.map((squad) => (
                <SquadCard
                  key={squad.id}
                  name={squad.name}
                  game={squad.game}
                  members={squad.members}
                  isActive={squad.isActive}
                  role={squad.role}
                  onNavigate={() => onNavigate?.('squad-detail', { squadId: squad.id })}
                />
              ))}
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <EmptyState
              icon={MessageCircle}
              title="Fil d'activite"
              description="Retrouve ici l'activite de toutes tes squads en temps reel"
              accentColor="#5e6dd2"
            />
          )}

          {activeTab === 'events' && (
            <EmptyState
              icon={Calendar}
              title="Events communautaires"
              description="Decouvre les tournois et evenements de ta communaute"
              accentColor="#f5a623"
            />
          )}
        </AnimatePresence>

        {/* ============================================ */}
        {/* CREATE SQUAD CTA */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mt-8">
          <motion.button
            onClick={() => onNavigate?.('create-squad')}
            className="w-full h-14 md:h-16 rounded-xl bg-[#5e6dd2] text-white text-[15px] md:text-[16px] font-semibold flex items-center justify-center gap-3 shadow-lg shadow-[#5e6dd2]/20 hover:bg-[#6a79db] hover:shadow-xl hover:shadow-[#5e6dd2]/25 transition-all duration-200"
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" strokeWidth={2} />
            Creer une nouvelle squad
          </motion.button>
        </motion.div>

        {/* ============================================ */}
        {/* PREMIUM BANNER */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mt-6">
          <motion.button
            onClick={() => onNavigate?.('premium')}
            className="w-full p-4 md:p-5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(245,166,35,0.15)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(245,166,35,0.25)] text-left transition-all duration-200 group overflow-hidden"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.99 }}
          >
            {/* Subtle glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f5a623]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex items-center gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(245,166,35,0.15)' }}
              >
                <Zap className="w-5 h-5 text-[#f5a623]" strokeWidth={1.5} />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-[14px] md:text-[15px] font-semibold text-[#f7f8f8] mb-0.5">
                  Squads illimitees avec Premium
                </h4>
                <p className="text-[12px] md:text-[13px] text-[#5e6063]">
                  Cree autant de squads que tu veux
                </p>
              </div>

              <span className="px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-[rgba(245,166,35,0.15)] text-[#f5a623] group-hover:bg-[rgba(245,166,35,0.2)] transition-colors">
                Upgrade
              </span>
            </div>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default CommunityScreen;
