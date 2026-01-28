import { useState } from 'react';
import { ArrowLeft, GraduationCap, Users, BookOpen, Award, Target, TrendingUp, Shield, MessageCircle, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface AcademyScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

interface Module {
  id: number;
  title: string;
  description: string;
  lessons: number;
  duration: string;
  icon: any;
  color: string;
  completed: number;
}

export function AcademyScreen({ onNavigate, showToast }: AcademyScreenProps) {
  const [selectedTab, setSelectedTab] = useState<'modules' | 'students'>('modules');

  const modules: Module[] = [
    {
      id: 1,
      title: 'Gestion d\'équipe',
      description: 'Apprenez à créer et gérer une équipe performante',
      lessons: 12,
      duration: '2h',
      icon: Shield,
      color: 'from-blue-500 to-blue-600',
      completed: 0,
    },
    {
      id: 2,
      title: 'Stratégies de jeu',
      description: 'Maîtrisez les tactiques et stratégies avancées',
      lessons: 8,
      duration: '1.5h',
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      completed: 0,
    },
    {
      id: 3,
      title: 'Communication efficace',
      description: 'Améliorez la communication au sein de votre équipe',
      lessons: 6,
      duration: '1h',
      icon: MessageCircle,
      color: 'from-green-500 to-green-600',
      completed: 0,
    },
    {
      id: 4,
      title: 'Analyse des performances',
      description: 'Analysez et optimisez vos performances',
      lessons: 10,
      duration: '2.5h',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      completed: 0,
    },
  ];

  const students = [
    { name: 'NewbieX', level: 'Débutant', progress: 35, coach: 'MaxPro', avatar: '👤' },
    { name: 'RisingY', level: 'Intermédiaire', progress: 68, coach: 'SkillGod', avatar: '👤' },
    { name: 'ProZ', level: 'Avancé', progress: 92, coach: 'MaxPro', avatar: '👤' },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20">
      <div className="sticky top-0 z-10 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={() => onNavigate?.('home')} className="p-2 hover:bg-[var(--background-elevated)] rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" strokeWidth={2} />
          </button>
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">Académie</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--secondary-500)] to-[var(--primary-500)] mb-4 shadow-lg">
            <GraduationCap className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Gaming Academy</h2>
          <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto">
            Formation et développement de nouveaux talents
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-3">
          <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center border border-blue-200">
            <div className="text-2xl font-bold text-blue-700 mb-1">{modules.length}</div>
            <div className="text-xs text-blue-600">Modules disponibles</div>
          </div>
          <div className="flex-1 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 text-center border border-purple-200">
            <div className="text-2xl font-bold text-purple-700 mb-1">{students.length}</div>
            <div className="text-xs text-purple-600">Élèves actifs</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="flex gap-2 p-1 bg-[var(--background-elevated)] rounded-xl mb-4">
            <button
              onClick={() => setSelectedTab('modules')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                selectedTab === 'modules'
                  ? 'bg-white text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Modules
            </button>
            <button
              onClick={() => setSelectedTab('students')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                selectedTab === 'students'
                  ? 'bg-white text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Élèves
            </button>
          </div>

          {selectedTab === 'modules' ? (
            <div className="space-y-3">
              {modules.map((module, i) => {
                const Icon = module.icon;
                return (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="bg-white rounded-2xl p-4 border border-[var(--border-medium)] shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => showToast?.(`Module "${module.title}" bientôt disponible`, 'info')}
                  >
                    <div className="flex items-start gap-4 mb-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${module.color}`}>
                        <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-[var(--text-primary)] mb-1">{module.title}</h4>
                        <p className="text-sm text-[var(--text-secondary)] mb-2">{module.description}</p>
                        <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>{module.lessons} leçons</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{module.duration}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[var(--text-tertiary)] flex-shrink-0" />
                    </div>
                    {module.completed > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[var(--text-secondary)]">Progression</span>
                          <span className="font-semibold text-[var(--text-primary)]">{module.completed}%</span>
                        </div>
                        <div className="bg-[var(--background)] rounded-full h-2 overflow-hidden">
                          <div className={`bg-gradient-to-r ${module.color} h-full rounded-full`} style={{ width: `${module.completed}%` }} />
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {students.map((student, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="bg-white rounded-xl p-4 border border-[var(--border-medium)] shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] flex items-center justify-center text-white text-xl">
                      {student.avatar}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[var(--text-primary)]">{student.name}</h4>
                      <p className="text-xs text-[var(--text-secondary)]">{student.level} • Coach: {student.coach}</p>
                    </div>
                    <span className="px-3 py-1 bg-[var(--secondary-50)] text-[var(--secondary-700)] text-xs font-semibold rounded-full">
                      {student.progress}%
                    </span>
                  </div>
                  <div className="bg-[var(--background)] rounded-full h-2.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-[var(--secondary-500)] to-[var(--primary-500)] h-full rounded-full transition-all" style={{ width: `${student.progress}%` }} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 gap-3">
          <button onClick={() => onNavigate?.('coaching-tools')} className="flex flex-col items-center gap-2 py-4 bg-white rounded-xl border border-[var(--border-medium)] hover:bg-[var(--background-elevated)] transition-colors">
            <Award className="w-6 h-6 text-[var(--warning-500)]" strokeWidth={2} />
            <span className="text-sm font-medium text-[var(--text-primary)]">Outils Coaching</span>
          </button>
          <button onClick={() => showToast?.('Fonctionnalité bientôt disponible', 'info')} className="flex flex-col items-center gap-2 py-4 bg-white rounded-xl border border-[var(--border-medium)] hover:bg-[var(--background-elevated)] transition-colors">
            <Users className="w-6 h-6 text-[var(--primary-500)]" strokeWidth={2} />
            <span className="text-sm font-medium text-[var(--text-primary)]">Mes Élèves</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default AcademyScreen;