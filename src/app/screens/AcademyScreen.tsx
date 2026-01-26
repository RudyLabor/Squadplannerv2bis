import { ArrowLeft, GraduationCap, Users, BookOpen, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface AcademyScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function AcademyScreen({ onNavigate, showToast }: AcademyScreenProps) {
  const students = [
    { name: 'NewbieX', level: 'Débutant', progress: 35, coach: 'MaxPro' },
    { name: 'RisingY', level: 'Intermédiaire', progress: 68, coach: 'SkillGod' },
    { name: 'ProZ', level: 'Avancé', progress: 92, coach: 'MaxPro' },
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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-[var(--secondary-50)] to-[var(--primary-50)] rounded-2xl p-5 text-center">
          <div className="text-3xl font-bold text-[var(--secondary-700)] mb-1">{students.length}</div>
          <div className="text-sm text-[var(--text-secondary)]">Élèves actifs</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3 px-1">
            Élèves
          </h3>
          <div className="space-y-3">
            {students.map((student, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-medium)] shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)]">{student.name}</h4>
                    <p className="text-xs text-[var(--text-secondary)]">{student.level} • Coach: {student.coach}</p>
                  </div>
                  <span className="px-2 py-1 bg-[var(--secondary-50)] text-[var(--secondary-700)] text-xs font-semibold rounded-lg">
                    {student.progress}%
                  </span>
                </div>
                <div className="bg-[var(--background)] rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-[var(--secondary-500)] to-[var(--primary-500)] h-full rounded-full" style={{ width: `${student.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 gap-3">
          <button onClick={() => showToast?.('Coaching activé', 'success')} className="flex flex-col items-center gap-2 py-4 bg-white rounded-xl border-[0.5px] border-[var(--border-medium)] hover:bg-[var(--background-elevated)] transition-colors">
            <BookOpen className="w-6 h-6 text-[var(--secondary-500)]" strokeWidth={2} />
            <span className="text-sm font-medium text-[var(--text-primary)]">Cours</span>
          </button>
          <button onClick={() => onNavigate?.('coaching-tools')} className="flex flex-col items-center gap-2 py-4 bg-white rounded-xl border-[0.5px] border-[var(--border-medium)] hover:bg-[var(--background-elevated)] transition-colors">
            <Award className="w-6 h-6 text-[var(--warning-500)]" strokeWidth={2} />
            <span className="text-sm font-medium text-[var(--text-primary)]">Certifications</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default AcademyScreen;