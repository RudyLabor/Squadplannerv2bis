import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  screenName: string;
  renderTime: number;
  networkCalls: number;
  avgNetworkTime: number;
  reRenderCount: number;
  timestamp: number;
}

interface NetworkCall {
  url: string;
  duration: number;
  size?: number;
  status: 'success' | 'error';
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private networkCalls: Map<string, NetworkCall[]> = new Map();
  private enabled: boolean = false;

  static getInstance() {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  enable() {
    this.enabled = true;
    console.log('🔍 Performance Monitor ENABLED');
  }

  disable() {
    this.enabled = false;
  }

  isEnabled() {
    return this.enabled;
  }

  trackScreenRender(screenName: string, duration: number) {
    if (!this.enabled) return;

    const existing = this.metrics.get(screenName);
    if (existing) {
      existing.reRenderCount++;
      existing.renderTime = duration;
    } else {
      this.metrics.set(screenName, {
        screenName,
        renderTime: duration,
        networkCalls: 0,
        avgNetworkTime: 0,
        reRenderCount: 1,
        timestamp: Date.now(),
      });
    }
  }

  trackNetworkCall(screenName: string, call: NetworkCall) {
    if (!this.enabled) return;

    const calls = this.networkCalls.get(screenName) || [];
    calls.push(call);
    this.networkCalls.set(screenName, calls);

    // Update metrics
    const metrics = this.metrics.get(screenName);
    if (metrics) {
      metrics.networkCalls = calls.length;
      metrics.avgNetworkTime = calls.reduce((acc, c) => acc + c.duration, 0) / calls.length;
    }
  }

  getMetrics(screenName?: string): PerformanceMetrics[] {
    if (screenName) {
      const metric = this.metrics.get(screenName);
      return metric ? [metric] : [];
    }
    return Array.from(this.metrics.values());
  }

  getNetworkCalls(screenName: string): NetworkCall[] {
    return this.networkCalls.get(screenName) || [];
  }

  clear(screenName?: string) {
    if (screenName) {
      this.metrics.delete(screenName);
      this.networkCalls.delete(screenName);
    } else {
      this.metrics.clear();
      this.networkCalls.clear();
    }
  }

  printReport(screenName?: string) {
    if (!this.enabled) return;

    const metrics = this.getMetrics(screenName);
    console.log('\n📊 PERFORMANCE REPORT\n');
    
    metrics.forEach(m => {
      const calls = this.getNetworkCalls(m.screenName);
      console.log(`\n🎯 ${m.screenName}`);
      console.log(`  ⏱️  Render: ${m.renderTime.toFixed(2)}ms`);
      console.log(`  🔄 Re-renders: ${m.reRenderCount}`);
      console.log(`  🌐 Network calls: ${m.networkCalls}`);
      console.log(`  ⚡ Avg network time: ${m.avgNetworkTime.toFixed(2)}ms`);
      
      if (calls.length > 0) {
        console.log(`  📡 Network details:`);
        calls.forEach((call, i) => {
          const emoji = call.status === 'success' ? '✅' : '❌';
          console.log(`     ${emoji} ${call.url}: ${call.duration.toFixed(2)}ms`);
        });
      }
    });
    
    console.log('\n');
  }
}

export const perfMonitor = PerformanceMonitor.getInstance();

// Hook to track screen performance
export function usePerformanceMonitor(screenName: string) {
  const renderCount = useRef(0);
  const mountTime = useRef(Date.now());
  const [isEnabled] = useState(() => perfMonitor.isEnabled());

  useEffect(() => {
    if (!isEnabled) return;

    renderCount.current++;
    const renderTime = Date.now() - mountTime.current;
    
    perfMonitor.trackScreenRender(screenName, renderTime);

    // Log on first render
    if (renderCount.current === 1) {
      console.log(`🎨 ${screenName} mounted in ${renderTime}ms`);
    }
  });

  useEffect(() => {
    return () => {
      if (isEnabled && renderCount.current > 1) {
        console.log(`🔄 ${screenName} had ${renderCount.current} renders`);
      }
    };
  }, [screenName, isEnabled]);

  return {
    trackNetworkCall: (url: string, duration: number, status: 'success' | 'error' = 'success') => {
      if (isEnabled) {
        perfMonitor.trackNetworkCall(screenName, { url, duration, status });
      }
    },
    renderCount: renderCount.current,
  };
}

// Hook to enable/disable monitoring via secret gesture
export function usePerformanceDebug() {
  const [tapCount, setTapCount] = useState(0);
  const tapTimeout = useRef<NodeJS.Timeout>();

  const handleSecretTap = () => {
    setTapCount(prev => prev + 1);

    if (tapTimeout.current) {
      clearTimeout(tapTimeout.current);
    }

    tapTimeout.current = setTimeout(() => {
      setTapCount(0);
    }, 2000);
  };

  useEffect(() => {
    if (tapCount >= 5) {
      const isEnabled = perfMonitor.isEnabled();
      if (isEnabled) {
        perfMonitor.disable();
        console.log('🔴 Performance Monitor DISABLED');
      } else {
        perfMonitor.enable();
        console.log('🟢 Performance Monitor ENABLED');
      }
      setTapCount(0);
    }
  }, [tapCount]);

  return { handleSecretTap, isMonitoring: perfMonitor.isEnabled() };
}

// Performance decorator for network calls
export function measureNetworkCall<T>(
  screenName: string,
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = Date.now();
  
  return fn()
    .then(result => {
      const duration = Date.now() - start;
      perfMonitor.trackNetworkCall(screenName, {
        url: operation,
        duration,
        status: 'success',
      });
      return result;
    })
    .catch(error => {
      const duration = Date.now() - start;
      perfMonitor.trackNetworkCall(screenName, {
        url: operation,
        duration,
        status: 'error',
      });
      throw error;
    });
}
