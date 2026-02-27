/**
 * Performance Monitoring Utilities
 * Tracks and optimizes app performance metrics
 */

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage?: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              console.warn(`Long task detected: ${entry.duration}ms`);
            }
          }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch (e) {
        // Long task API not supported
      }
    }
  }

  /**
   * Mark the start of a performance measurement
   */
  markStart(label: string) {
    if ('performance' in window && performance.mark) {
      performance.mark(`${label}-start`);
    }
  }

  /**
   * Mark the end of a performance measurement and calculate duration
   */
  markEnd(label: string): number {
    if ('performance' in window && performance.mark && performance.measure) {
      performance.mark(`${label}-end`);
      try {
        const measure = performance.measure(label, `${label}-start`, `${label}-end`);
        return measure.duration;
      } catch (e) {
        return 0;
      }
    }
    return 0;
  }

  /**
   * Get current memory usage (if available)
   */
  getMemoryUsage(): number | undefined {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / 1048576; // Convert to MB
    }
    return undefined;
  }

  /**
   * Log performance metrics
   */
  logMetrics(component: string) {
    const metrics = this.metrics.get(component);
    if (metrics) {
      console.log(`Performance metrics for ${component}:`, metrics);
    }
  }

  /**
   * Clear all performance marks and measures
   */
  clearMarks() {
    if ('performance' in window && performance.clearMarks) {
      performance.clearMarks();
      performance.clearMeasures();
    }
  }

  /**
   * Cleanup observers
   */
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();

/**
 * React hook for component performance monitoring
 */
export function usePerformanceMonitor(componentName: string) {
  const startTime = Date.now();

  return {
    markRenderComplete: () => {
      const renderTime = Date.now() - startTime;
      if (renderTime > 100) {
        console.warn(`Slow render detected in ${componentName}: ${renderTime}ms`);
      }
    },
  };
}
