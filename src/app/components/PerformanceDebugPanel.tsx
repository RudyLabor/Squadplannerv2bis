import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BarChart3, RefreshCw } from 'lucide-react';
import { perfMonitor } from '@/app/hooks/usePerformanceMonitor';

export function PerformanceDebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [metrics, setMetrics] = useState(perfMonitor.getMetrics());

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setMetrics(perfMonitor.getMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    const checkEnabled = setInterval(() => {
      if (perfMonitor.isEnabled() && !isOpen) {
        setIsOpen(true);
      } else if (!perfMonitor.isEnabled() && isOpen) {
        setIsOpen(false);
      }
    }, 500);

    return () => clearInterval(checkEnabled);
  }, [isOpen]);

  if (!perfMonitor.isEnabled()) return null;

  const handleClear = () => {
    perfMonitor.clear();
    setMetrics([]);
  };

  const handlePrint = () => {
    perfMonitor.printReport();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-[9999] pointer-events-auto"
        >
          <div className="bg-black/95 backdrop-blur-xl rounded-2xl p-4 text-white shadow-2xl border border-white/10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold">Performance Monitor</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="w-8 h-8 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 flex items-center justify-center transition-colors"
                  title="Print to console"
                >
                  <RefreshCw className="w-4 h-4 text-blue-400" />
                </button>
                <button
                  onClick={() => perfMonitor.disable()}
                  className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors"
                  title="Close panel"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {metrics.length === 0 ? (
                <div className="text-xs text-white/50 text-center py-4">
                  No metrics yet. Navigate around the app.
                </div>
              ) : (
                metrics.map(metric => {
                  const networkCalls = perfMonitor.getNetworkCalls(metric.screenName);
                  
                  return (
                    <div
                      key={metric.screenName}
                      className="bg-white/5 rounded-lg p-3 border border-white/10"
                    >
                      <div className="text-sm font-bold mb-2 text-emerald-400">
                        {metric.screenName}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-white/50">Render:</span>
                          <span className={`ml-1 font-mono ${
                            metric.renderTime < 300 ? 'text-green-400' :
                            metric.renderTime < 700 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {metric.renderTime.toFixed(0)}ms
                          </span>
                        </div>
                        
                        <div>
                          <span className="text-white/50">Re-renders:</span>
                          <span className={`ml-1 font-mono ${
                            metric.reRenderCount <= 3 ? 'text-green-400' :
                            metric.reRenderCount <= 10 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {metric.reRenderCount}
                          </span>
                        </div>
                        
                        <div>
                          <span className="text-white/50">Network:</span>
                          <span className={`ml-1 font-mono ${
                            metric.networkCalls <= 3 ? 'text-green-400' :
                            metric.networkCalls <= 8 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {metric.networkCalls} calls
                          </span>
                        </div>
                        
                        <div>
                          <span className="text-white/50">Avg:</span>
                          <span className={`ml-1 font-mono ${
                            metric.avgNetworkTime < 300 ? 'text-green-400' :
                            metric.avgNetworkTime < 500 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {metric.avgNetworkTime.toFixed(0)}ms
                          </span>
                        </div>
                      </div>

                      {networkCalls.length > 0 && (
                        <details className="mt-2">
                          <summary className="text-xs text-white/50 cursor-pointer hover:text-white/70">
                            Network details ({networkCalls.length})
                          </summary>
                          <div className="mt-2 space-y-1">
                            {networkCalls.map((call, i) => (
                              <div key={i} className="text-xs font-mono flex items-center justify-between">
                                <span className="text-white/60 truncate flex-1">
                                  {call.status === 'success' ? '✅' : '❌'} {call.url}
                                </span>
                                <span className={
                                  call.duration < 300 ? 'text-green-400' :
                                  call.duration < 500 ? 'text-yellow-400' :
                                  'text-red-400'
                                }>
                                  {call.duration.toFixed(0)}ms
                                </span>
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Legend */}
            <div className="mt-3 pt-3 border-t border-white/10 text-xs text-white/40">
              <div className="flex items-center gap-4">
                <span>🟢 Good</span>
                <span>🟡 OK</span>
                <span>🔴 Slow</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}