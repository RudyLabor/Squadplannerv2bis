import { useState, useEffect } from 'react';
import { ArrowLeft, GraduationCap, Users, BookOpen, Award, Target, TrendingUp, Shield, MessageCircle, Clock, ChevronRight, Sparkles, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { academyAPI, type AcademyModule, type AcademyStudent, type AcademyStats } from '@/utils/b2b-api';
import { Card, Button, SkeletonPage } from '@/design-system';

interface AcademyScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const iconMap: Record<string, any> = {
  Shield,
  Target,
  MessageCircle,
  TrendingUp,
  Award,
  Users,
};

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

export function AcademyScreen({ onNavigate, showToast }: AcademyScreenProps) {
  const [selectedTab, setSelectedTab] = useState<'modules' | 'students'>('modules');
  const [isLoading, setIsLoading] = useState(true);
  const [modules, setModules] = useState<AcademyModule[]>([]);
  const [students, setStudents] = useState<AcademyStudent[]>([]);
  const [stats, setStats] = useState<AcademyStats | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [modulesData, studentsData, statsData] = await Promise.all([
        academyAPI.getModules(),
        academyAPI.getStudents(),
        academyAPI.getStats(),
      ]);
      setModules(modulesData);
      setStudents(studentsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading academy data:', error);
      showToast?.('Erreur de chargement', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Debutant';
      case 'intermediate': return 'Intermediaire';
      case 'advanced': return 'Avance';
      default: return level;
    }
  };

  if (isLoading) {
    return <SkeletonPage />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.35 }}
      className="min-h-screen pb-24 pt-safe bg-[var(--bg-base)] relative overflow-hidden"
    >
      {/* Background decorations - static for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400/15 to-teal-400/15 rounded-full blur-3xl" />
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
              onClick={() => onNavigate?.('home')}
              className="w-12 h-12 rounded-2xl bg-[var(--bg-elevated)] backdrop-blur-sm border border-[var(--border-subtle)] flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-[var(--fg-secondary)]" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Academie
              </h1>
              <p className="text-sm text-[var(--fg-secondary)] font-medium">
                Formation & Talents
              </p>
            </div>
            <motion.button
              onClick={loadData}
              disabled={isLoading}
              className="w-10 h-10 rounded-xl bg-[var(--bg-elevated)] backdrop-blur-sm border border-[var(--border-subtle)] flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-4 h-4 text-[var(--fg-secondary)] ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <GraduationCap className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center py-6 mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-xl shadow-indigo-500/30">
              <GraduationCap className="w-10 h-10 text-white" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg-primary)] mb-2">Gaming Academy</h2>
            <p className="text-sm text-[var(--fg-secondary)] max-w-md mx-auto">
              Formation et developpement de nouveaux talents
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-6">
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card className="p-4 text-center bg-gradient-to-br from-blue-500 to-indigo-600 border-0 text-white shadow-xl shadow-blue-500/30">
                <div className="text-3xl font-bold tracking-tight mb-1">{stats?.totalModules || modules.length}</div>
                <div className="text-sm text-white/90 font-medium">Modules disponibles</div>
              </Card>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card className="p-4 text-center bg-gradient-to-br from-purple-500 to-violet-600 border-0 text-white shadow-xl shadow-purple-500/30">
                <div className="text-3xl font-bold tracking-tight mb-1">{stats?.totalStudents || students.length}</div>
                <div className="text-sm text-white/90 font-medium">Eleves actifs</div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Tab Selector */}
          <motion.div variants={itemVariants}>
            <Card className="p-1.5 mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTab('modules')}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                    selectedTab === 'modules'
                      ? 'bg-[var(--bg-elevated)] text-[var(--fg-primary)] shadow-lg'
                      : 'text-[var(--fg-secondary)] hover:text-[var(--fg-primary)]'
                  }`}
                >
                  Modules
                </button>
                <button
                  onClick={() => setSelectedTab('students')}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                    selectedTab === 'students'
                      ? 'bg-[var(--bg-elevated)] text-[var(--fg-primary)] shadow-lg'
                      : 'text-[var(--fg-secondary)] hover:text-[var(--fg-primary)]'
                  }`}
                >
                  Eleves
                </button>
              </div>
            </Card>
          </motion.div>

          {/* Content */}
          {selectedTab === 'modules' ? (
            <motion.div variants={itemVariants} className="space-y-4">
              {modules.map((module, i) => {
                const Icon = iconMap[module.icon] || Shield;
                return (
                  <motion.div
                    key={module.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card
                      className="p-5 hover:shadow-xl transition-all cursor-pointer"
                      interactive
                      onClick={() => showToast?.(`Module "${module.title}" bientot disponible`, 'info')}
                    >
                      <div className="flex items-start gap-4 mb-3">
                        <motion.div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${module.gradient} flex items-center justify-center shadow-lg ${module.shadow}`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                        </motion.div>
                        <div className="flex-1">
                          <h4 className="font-bold tracking-tight text-[var(--fg-primary)] mb-1">{module.title}</h4>
                          <p className="text-sm text-[var(--fg-secondary)] mb-2">{module.description}</p>
                          <div className="flex items-center gap-4 text-sm text-[var(--fg-tertiary)]">
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>{module.lessons} lecons</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{module.duration}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-[var(--fg-tertiary)] flex-shrink-0" />
                      </div>
                      {module.completed > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[var(--fg-secondary)]">Progression</span>
                            <span className="font-bold text-[var(--fg-primary)]">{module.completed}%</span>
                          </div>
                          <div className="bg-[var(--bg-base)] rounded-full h-2 overflow-hidden">
                            <div className={`bg-gradient-to-r ${module.gradient} h-full rounded-full`} style={{ width: `${module.completed}%` }} />
                          </div>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div variants={itemVariants} className="space-y-3">
              {students.map((student, i) => (
                <motion.div
                  key={student.id || i}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <motion.div
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-500/30 overflow-hidden"
                        whileHover={{ scale: 1.1 }}
                      >
                        {student.avatarUrl ? (
                          <img src={student.avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          '👤'
                        )}
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="font-bold tracking-tight text-[var(--fg-primary)]">{student.name}</h4>
                        <p className="text-sm text-[var(--fg-secondary)]">{getLevelLabel(student.level)} • Coach: {student.coach}</p>
                      </div>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-bold rounded-full">
                        {student.progress}%
                      </span>
                    </div>
                    <div className="bg-[var(--bg-base)] rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${student.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full"
                      />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mt-6">
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card
                className="py-5 text-center cursor-pointer hover:shadow-xl transition-all"
                interactive
                onClick={() => onNavigate?.('coaching-tools')}
              >
                <Award className="w-7 h-7 text-amber-500 mx-auto mb-2" strokeWidth={2} />
                <span className="text-sm font-bold tracking-tight text-[var(--fg-primary)]">Outils Coaching</span>
              </Card>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card
                className="py-5 text-center cursor-pointer hover:shadow-xl transition-all"
                interactive
                onClick={() => showToast?.('Fonctionnalite bientot disponible', 'info')}
              >
                <Users className="w-7 h-7 text-indigo-500 mx-auto mb-2" strokeWidth={2} />
                <span className="text-sm font-bold tracking-tight text-[var(--fg-primary)]">Mes Eleves</span>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default AcademyScreen;
