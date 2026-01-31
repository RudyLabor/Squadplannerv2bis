import { useState, useEffect } from 'react';
import { ArrowLeft, GraduationCap, Users, BookOpen, Award, Target, TrendingUp, Shield, MessageCircle, Clock, ChevronRight, Play, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { academyAPI, type AcademyModule, type AcademyStudent, type AcademyStats } from '@/utils/b2b-api';

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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-[#4ade80]';
      case 'intermediate': return 'text-[#f5a623]';
      case 'advanced': return 'text-[#f87171]';
      default: return 'text-[#8b8d90]';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090a] flex items-center justify-center">
        <motion.div
          className="w-10 h-10 border-2 border-[#5e6dd2]/30 border-t-[#5e6dd2] rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#08090a] pb-24 md:pb-8"
    >
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <motion.button
              onClick={() => onNavigate?.('home')}
              className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.06)] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-[#8b8d90]" strokeWidth={1.5} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-[#f7f8f8] tracking-tight">
                Academie
              </h1>
              <p className="text-sm text-[#5e6063]">
                Formation & Talents
              </p>
            </div>
            <div
              className="w-11 h-11 rounded-xl bg-[rgba(94,109,210,0.15)] flex items-center justify-center"
            >
              <GraduationCap className="w-5 h-5 text-[#5e6dd2]" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 text-center hover:bg-[rgba(255,255,255,0.04)] transition-all">
              <div className="w-9 h-9 rounded-lg bg-[rgba(94,109,210,0.15)] flex items-center justify-center mx-auto mb-2">
                <BookOpen className="w-4 h-4 text-[#5e6dd2]" strokeWidth={1.5} />
              </div>
              <div className="text-2xl font-semibold text-[#f7f8f8]">{stats?.totalModules || modules.length}</div>
              <div className="text-xs text-[#5e6063]">Modules</div>
            </div>
            <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 text-center hover:bg-[rgba(255,255,255,0.04)] transition-all">
              <div className="w-9 h-9 rounded-lg bg-[rgba(74,222,128,0.15)] flex items-center justify-center mx-auto mb-2">
                <Users className="w-4 h-4 text-[#4ade80]" strokeWidth={1.5} />
              </div>
              <div className="text-2xl font-semibold text-[#f7f8f8]">{stats?.totalStudents || students.length}</div>
              <div className="text-xs text-[#5e6063]">Eleves</div>
            </div>
            <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 text-center hover:bg-[rgba(255,255,255,0.04)] transition-all">
              <div className="w-9 h-9 rounded-lg bg-[rgba(245,166,35,0.15)] flex items-center justify-center mx-auto mb-2">
                <Award className="w-4 h-4 text-[#f5a623]" strokeWidth={1.5} />
              </div>
              <div className="text-2xl font-semibold text-[#f7f8f8]">{stats?.averageProgress || 72}%</div>
              <div className="text-xs text-[#5e6063]">Progression</div>
            </div>
          </motion.div>

          {/* Tab Selector */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-1 flex gap-1">
              <button
                onClick={() => setSelectedTab('modules')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                  selectedTab === 'modules'
                    ? 'bg-[rgba(255,255,255,0.08)] text-[#f7f8f8]'
                    : 'text-[#5e6063] hover:text-[#8b8d90] hover:bg-[rgba(255,255,255,0.03)]'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <BookOpen className="w-4 h-4" strokeWidth={1.5} />
                  Modules
                </span>
              </button>
              <button
                onClick={() => setSelectedTab('students')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                  selectedTab === 'students'
                    ? 'bg-[rgba(255,255,255,0.08)] text-[#f7f8f8]'
                    : 'text-[#5e6063] hover:text-[#8b8d90] hover:bg-[rgba(255,255,255,0.03)]'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" strokeWidth={1.5} />
                  Eleves
                </span>
              </button>
            </div>
          </motion.div>

          {/* Content */}
          {selectedTab === 'modules' ? (
            <motion.div variants={containerVariants} className="space-y-3">
              {modules.map((module) => {
                const Icon = iconMap[module.icon] || Shield;
                return (
                  <motion.div
                    key={module.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div
                      className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] rounded-xl p-4 cursor-pointer transition-all group"
                      onClick={() => showToast?.(`Module "${module.title}" bientot disponible`, 'info')}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[rgba(94,109,210,0.15)] flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-[#5e6dd2]" strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-[#f7f8f8] truncate">{module.title}</h4>
                            <ChevronRight className="w-4 h-4 text-[#5e6063] flex-shrink-0 group-hover:text-[#8b8d90] transition-colors" strokeWidth={1.5} />
                          </div>
                          <p className="text-sm text-[#8b8d90] line-clamp-2 mb-3">{module.description}</p>
                          <div className="flex items-center gap-4 text-xs text-[#5e6063]">
                            <span className="flex items-center gap-1.5">
                              <Play className="w-3.5 h-3.5" strokeWidth={1.5} />
                              {module.lessons} lecons
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                              {module.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      {module.completed > 0 && (
                        <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)]">
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-[#8b8d90]">Progression</span>
                            <span className="font-medium text-[#5e6dd2]">{module.completed}%</span>
                          </div>
                          <div className="h-1.5 bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${module.completed}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="h-full bg-[#5e6dd2] rounded-full"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div variants={containerVariants} className="space-y-3">
              {students.map((student, i) => (
                <motion.div
                  key={student.id || i}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] rounded-xl p-4 cursor-pointer transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-[rgba(94,109,210,0.15)] flex items-center justify-center text-[#8b93ff] font-semibold overflow-hidden flex-shrink-0">
                        {student.avatarUrl ? (
                          <img src={student.avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          student.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[#f7f8f8] truncate">{student.name}</h4>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={getLevelColor(student.level)}>{getLevelLabel(student.level)}</span>
                          <span className="text-[#5e6063]">|</span>
                          <span className="text-[#8b8d90]">Coach: {student.coach}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[rgba(94,109,210,0.15)]">
                        <Star className="w-3 h-3 text-[#5e6dd2]" strokeWidth={1.5} />
                        <span className="text-sm font-semibold text-[#5e6dd2]">{student.progress}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${student.progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.1 }}
                        className="h-full bg-[#5e6dd2] rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate?.('coaching-tools')}
              className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] rounded-xl p-4 text-center transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[rgba(245,166,35,0.15)] flex items-center justify-center mx-auto mb-2">
                <Award className="w-5 h-5 text-[#f5a623]" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-[#f7f8f8]">Outils Coaching</span>
              <p className="text-xs text-[#5e6063] mt-0.5">Methodes et ressources</p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => showToast?.('Fonctionnalite bientot disponible', 'info')}
              className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] rounded-xl p-4 text-center transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[rgba(74,222,128,0.15)] flex items-center justify-center mx-auto mb-2">
                <Users className="w-5 h-5 text-[#4ade80]" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-[#f7f8f8]">Mes Eleves</span>
              <p className="text-xs text-[#5e6063] mt-0.5">Suivi personnalise</p>
            </motion.button>
          </motion.div>

          {/* Featured Course Banner */}
          <motion.div variants={itemVariants} className="mt-6">
            <motion.div
              className="bg-[rgba(94,109,210,0.08)] border border-[rgba(94,109,210,0.2)] hover:bg-[rgba(94,109,210,0.12)] rounded-xl p-4 cursor-pointer transition-all"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[rgba(94,109,210,0.15)] flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-7 h-7 text-[#5e6dd2]" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-[rgba(94,109,210,0.2)] text-[#8b93ff] text-xs font-medium rounded-md">Nouveau</span>
                  </div>
                  <h4 className="font-semibold text-[#f7f8f8] mb-0.5">Masterclass Leadership</h4>
                  <p className="text-xs text-[#8b8d90]">Developpez vos competences de coach esport</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#5e6dd2]" strokeWidth={1.5} />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default AcademyScreen;
