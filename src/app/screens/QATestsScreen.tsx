import { ArrowLeft, CheckCircle2, XCircle, Loader2, PlayCircle, Beaker, FlaskConical, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { intelligenceAPI, notificationsAPI } from '@/utils/api';

interface QATestsScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  error?: string;
  details?: any;
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

export function QATestsScreen({ onNavigate, showToast }: QATestsScreenProps) {
  const [running, setRunning] = useState(false);
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Smart Suggestions - Affichage normal', status: 'pending' },
    { name: 'Smart Suggestions - Empty state', status: 'pending' },
    { name: 'Notifications - Liste affichée', status: 'pending' },
    { name: 'Notifications - Mark as read', status: 'pending' },
    { name: 'Heatmap - Génération matrice 7x24', status: 'pending' },
    { name: 'Heatmap - Valeurs normalisées', status: 'pending' },
    { name: 'Members Stats - Batch loading', status: 'pending' },
  ]);

  const updateTest = (index: number, updates: Partial<TestResult>) => {
    setTests(prev => prev.map((test, i) => i === index ? { ...test, ...updates } : test));
  };

  const runTests = async () => {
    setRunning(true);

    // Test 1: Smart Suggestions - Affichage normal
    updateTest(0, { status: 'running' });
    const start1 = Date.now();
    try {
      const result = await intelligenceAPI.getSmartSuggestions('test-squad-123');
      const duration = Date.now() - start1;

      if (result.suggestions && Array.isArray(result.suggestions)) {
        updateTest(0, {
          status: 'passed',
          duration,
          details: `${result.suggestions.length} suggestions retournées`
        });
      } else {
        updateTest(0, {
          status: 'failed',
          error: 'Format de réponse invalide',
          duration
        });
      }
    } catch (error: any) {
      updateTest(0, {
        status: 'failed',
        error: error.message,
        duration: Date.now() - start1
      });
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 2: Smart Suggestions - Empty state
    updateTest(1, { status: 'running' });
    const start2 = Date.now();
    try {
      const result = await intelligenceAPI.getSmartSuggestions('empty-squad');
      const duration = Date.now() - start2;

      if (result.suggestions && result.suggestions.length === 0) {
        updateTest(1, {
          status: 'passed',
          duration,
          details: 'Empty state géré correctement'
        });
      } else {
        updateTest(1, {
          status: 'failed',
          error: 'Devrait retourner tableau vide',
          duration
        });
      }
    } catch (error: any) {
      if (error.message.includes('introuvable')) {
        updateTest(1, {
          status: 'passed',
          duration: Date.now() - start2,
          details: '404 pour squad inexistante (comportement attendu)'
        });
      } else {
        updateTest(1, {
          status: 'failed',
          error: error.message,
          duration: Date.now() - start2
        });
      }
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 3: Notifications - Liste affichée
    updateTest(2, { status: 'running' });
    const start3 = Date.now();
    try {
      const result = await notificationsAPI.getNotifications();
      const duration = Date.now() - start3;

      if (result.notifications && Array.isArray(result.notifications)) {
        updateTest(2, {
          status: 'passed',
          duration,
          details: `${result.notifications.length} notifications, ${result.unreadCount} non lues`
        });
      } else {
        updateTest(2, {
          status: 'failed',
          error: 'Format de réponse invalide',
          duration
        });
      }
    } catch (error: any) {
      updateTest(2, {
        status: 'failed',
        error: error.message,
        duration: Date.now() - start3
      });
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 4: Notifications - Mark as read
    updateTest(3, { status: 'running' });
    const start4 = Date.now();
    try {
      const result = await notificationsAPI.markAsRead('test-notif-id');
      const duration = Date.now() - start4;

      if (result.notification) {
        updateTest(3, {
          status: 'passed',
          duration,
          details: 'Mark as read fonctionne'
        });
      } else {
        updateTest(3, {
          status: 'failed',
          error: 'Réponse invalide',
          duration
        });
      }
    } catch (error: any) {
      if (error.message.includes('introuvable')) {
        updateTest(3, {
          status: 'passed',
          duration: Date.now() - start4,
          details: '404 pour notification inexistante (comportement attendu)'
        });
      } else {
        updateTest(3, {
          status: 'failed',
          error: error.message,
          duration: Date.now() - start4
        });
      }
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 5: Heatmap - Génération matrice
    updateTest(4, { status: 'running' });
    const start5 = Date.now();
    try {
      const result = await intelligenceAPI.getAvailabilityHeatmap('test-squad-123');
      const duration = Date.now() - start5;

      if (result.heatmap && result.heatmap.length === 7) {
        const allHave24Hours = result.heatmap.every((row: any[]) => row.length === 24);
        if (allHave24Hours) {
          updateTest(4, {
            status: 'passed',
            duration,
            details: `Matrice 7x24 correcte, ${result.sessionsCount} sessions analysées`
          });
        } else {
          updateTest(4, {
            status: 'failed',
            error: 'Matrice incorrecte',
            duration
          });
        }
      } else {
        updateTest(4, {
          status: 'failed',
          error: 'Format de heatmap invalide',
          duration
        });
      }
    } catch (error: any) {
      updateTest(4, {
        status: 'failed',
        error: error.message,
        duration: Date.now() - start5
      });
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 6: Heatmap - Valeurs normalisées
    updateTest(5, { status: 'running' });
    const start6 = Date.now();
    try {
      const result = await intelligenceAPI.getAvailabilityHeatmap('test-squad-123');
      const duration = Date.now() - start6;

      const flatValues = result.heatmap.flat();
      const allInRange = flatValues.every((val: number) => val >= 0 && val <= 100);

      if (allInRange) {
        updateTest(5, {
          status: 'passed',
          duration,
          details: 'Toutes les valeurs entre 0-100'
        });
      } else {
        updateTest(5, {
          status: 'failed',
          error: 'Valeurs hors limites 0-100',
          duration
        });
      }
    } catch (error: any) {
      updateTest(5, {
        status: 'failed',
        error: error.message,
        duration: Date.now() - start6
      });
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 7: Members Stats - Batch loading
    updateTest(6, { status: 'running' });
    const start7 = Date.now();
    try {
      const result = await intelligenceAPI.getMembersStats('test-squad-123');
      const duration = Date.now() - start7;

      if (result.members && Array.isArray(result.members)) {
        const hasRequiredFields = result.members.every((m: any) =>
          m.userId && m.reliabilityScore !== undefined && m.totalSessions !== undefined
        );

        if (hasRequiredFields) {
          updateTest(6, {
            status: 'passed',
            duration,
            details: `${result.members.length} membres chargés en ${duration}ms`
          });
        } else {
          updateTest(6, {
            status: 'failed',
            error: 'Champs requis manquants',
            duration
          });
        }
      } else {
        updateTest(6, {
          status: 'failed',
          error: 'Format de réponse invalide',
          duration
        });
      }
    } catch (error: any) {
      updateTest(6, {
        status: 'failed',
        error: error.message,
        duration: Date.now() - start7
      });
    }

    setRunning(false);

    const passed = tests.filter(t => t.status === 'passed').length;
    const total = tests.length;

    if (passed === total) {
      showToast(`Tous les tests passés (${passed}/${total})`, 'success');
    } else {
      showToast(`${passed}/${total} tests passés`, 'error');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" strokeWidth={2} />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" strokeWidth={2} />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-cyan-500 animate-spin" strokeWidth={2} />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const passedCount = tests.filter(t => t.status === 'passed').length;
  const failedCount = tests.filter(t => t.status === 'failed').length;
  const totalCount = tests.length;

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400/15 to-purple-400/15 rounded-full blur-3xl" />
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
              onClick={() => onNavigate('home')}
              className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Tests QA Roadmap #3
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Tests automatisés backend + frontend
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <FlaskConical className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-6">
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg text-center"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 mx-auto mb-2 flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div className="text-2xl font-bold text-emerald-600">{passedCount}</div>
              <div className="text-xs text-gray-500 font-medium">Passés</div>
            </motion.div>
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg text-center"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 mx-auto mb-2 flex items-center justify-center shadow-md">
                <XCircle className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div className="text-2xl font-bold text-red-600">{failedCount}</div>
              <div className="text-xs text-gray-500 font-medium">Échoués</div>
            </motion.div>
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg text-center"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 mx-auto mb-2 flex items-center justify-center shadow-md">
                <FlaskConical className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div className="text-2xl font-bold text-gray-800">{totalCount}</div>
              <div className="text-xs text-gray-500 font-medium">Total</div>
            </motion.div>
          </motion.div>

          {/* Run Button */}
          <motion.div variants={itemVariants} className="mb-6">
            <motion.button
              onClick={runTests}
              disabled={running}
              className="w-full h-14 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-2xl shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: running ? 1 : 1.01, y: running ? 0 : -2 }}
              whileTap={{ scale: running ? 1 : 0.99 }}
            >
              {running ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />
                  Tests en cours...
                </>
              ) : (
                <>
                  <PlayCircle className="w-5 h-5" strokeWidth={2} />
                  Lancer tous les tests
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Tests List */}
          <motion.div variants={itemVariants} className="space-y-3 mb-8">
            {tests.map((test, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl p-4 border shadow-lg transition-all ${
                  test.status === 'passed' ? 'border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white/80' :
                  test.status === 'failed' ? 'border-red-200 bg-gradient-to-br from-red-50/80 to-white/80' :
                  test.status === 'running' ? 'border-cyan-200 bg-gradient-to-br from-cyan-50/80 to-white/80' :
                  'border-white/50'
                }`}
                whileHover={{ scale: 1.01, y: -2 }}
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(test.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm font-bold text-gray-800">
                        {test.name}
                      </h3>
                      {test.duration && (
                        <span className="text-xs text-gray-500 whitespace-nowrap font-medium">
                          {test.duration}ms
                        </span>
                      )}
                    </div>
                    {test.details && (
                      <p className="text-xs text-gray-500 font-medium">{test.details}</p>
                    )}
                    {test.error && (
                      <p className="text-xs text-red-500 mt-1 font-medium">{test.error}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-amber-100/80 to-orange-100/80 backdrop-blur-sm rounded-2xl p-5 border border-amber-200/50"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-sm font-bold text-gray-700">Actions rapides</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                onClick={() => onNavigate('test-setup')}
                className="flex items-center justify-center gap-2 py-3 bg-white text-gray-800 rounded-xl text-xs font-bold hover:shadow-md transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Beaker className="w-4 h-4" strokeWidth={2} />
                Setup données
              </motion.button>
              <motion.button
                onClick={() => onNavigate('smart-suggestions', { squadId: 'test-squad-123' })}
                className="flex items-center justify-center gap-2 py-3 bg-white text-gray-800 rounded-xl text-xs font-bold hover:shadow-md transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Tester Suggestions
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default QATestsScreen;
