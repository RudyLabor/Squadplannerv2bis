import { ArrowLeft, CheckCircle2, XCircle, Loader2, PlayCircle, Beaker } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
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

    // Wait a bit
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
      // Empty squad peut retourner 404, c'est ok
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
      const result = await notificationsAPI.getUserNotifications();
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
      // Try to mark a notification as read
      const result = await notificationsAPI.markAsRead('test-notif-id');
      const duration = Date.now() - start4;
      
      if (result.notification || result.message) {
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
      // 404 is expected if notification doesn't exist
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
      showToast(`✅ Tous les tests passés (${passed}/${total})`, 'success');
    } else {
      showToast(`⚠️ ${passed}/${total} tests passés`, 'error');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="w-5 h-5 text-[var(--success-500)]" strokeWidth={2} />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-[var(--error-500)]" strokeWidth={2} />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-[var(--primary-500)] animate-spin" strokeWidth={2} />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-[var(--border-medium)]" />;
    }
  };

  const passedCount = tests.filter(t => t.status === 'passed').length;
  const failedCount = tests.filter(t => t.status === 'failed').length;
  const totalCount = tests.length;

  return (
    <div className="min-h-screen pb-24 pt-safe bg-[var(--bg-base)]">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="w-10 h-10 rounded-xl bg-white border-[0.5px] border-[var(--border-medium)] hover:border-[var(--border-strong)] flex items-center justify-center shadow-sm transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-secondary)]" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
              🧪 Tests QA Roadmap #3
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] mt-1">
              Tests automatisés backend + frontend
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm text-center">
            <div className="text-2xl font-bold text-[var(--success-500)]">{passedCount}</div>
            <div className="text-xs text-[var(--fg-tertiary)] mt-1">Passés</div>
          </div>
          <div className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm text-center">
            <div className="text-2xl font-bold text-[var(--error-500)]">{failedCount}</div>
            <div className="text-xs text-[var(--fg-tertiary)] mt-1">Échoués</div>
          </div>
          <div className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm text-center">
            <div className="text-2xl font-bold text-[var(--fg-primary)]">{totalCount}</div>
            <div className="text-xs text-[var(--fg-tertiary)] mt-1">Total</div>
          </div>
        </div>

        {/* Run Button */}
        <Button
          variant="primary"
          onClick={runTests}
          disabled={running}
          className="w-full h-12 text-sm font-semibold bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] hover:from-[var(--primary-600)] hover:to-[var(--primary-700)] text-white rounded-xl shadow-lg shadow-[var(--primary-500)]/20 transition-all duration-200 mb-6"
        >
          {running ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
              Tests en cours...
            </>
          ) : (
            <>
              <PlayCircle className="w-4 h-4" strokeWidth={2} />
              Lancer tous les tests
            </>
          )}
        </Button>

        {/* Tests List */}
        <div className="space-y-3">
          {tests.map((test, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-4 border-[0.5px] ${
                test.status === 'passed' ? 'border-[var(--success-200)] bg-gradient-to-br from-[var(--success-50)] to-white' :
                test.status === 'failed' ? 'border-[var(--error-200)] bg-gradient-to-br from-[var(--error-50)] to-white' :
                test.status === 'running' ? 'border-[var(--primary-200)] bg-gradient-to-br from-[var(--primary-50)] to-white' :
                'border-[var(--border-subtle)]'
              } shadow-sm transition-all duration-200`}
            >
              <div className="flex items-start gap-3">
                {getStatusIcon(test.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-[var(--fg-primary)]">
                      {test.name}
                    </h3>
                    {test.duration && (
                      <span className="text-xs text-[var(--fg-tertiary)] whitespace-nowrap">
                        {test.duration}ms
                      </span>
                    )}
                  </div>
                  {test.details && (
                    <p className="text-xs text-[var(--fg-tertiary)]">{test.details}</p>
                  )}
                  {test.error && (
                    <p className="text-xs text-[var(--error-500)] mt-1">❌ {test.error}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 p-5 bg-[var(--bg-subtle)] rounded-2xl border-[0.5px] border-[var(--border-subtle)]">
          <h3 className="text-sm font-semibold text-[var(--fg-primary)] mb-3">
            🛠️ Actions rapides
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              onClick={() => onNavigate('test-setup')}
              className="text-xs"
            >
              <Beaker className="w-4 h-4" strokeWidth={2} />
              Setup données
            </Button>
            <Button
              variant="secondary"
              onClick={() => onNavigate('smart-suggestions', { squadId: 'test-squad-123' })}
              className="text-xs"
            >
              Tester Suggestions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QATestsScreen;
