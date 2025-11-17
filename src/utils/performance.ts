/**
 * Performance optimization utilities
 */

import { useEffect, useRef, useCallback } from 'react';

/**
 * Debounce function for search inputs and expensive operations
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for scroll events and high-frequency events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Hook for debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for measuring component render performance
 */
export function useRenderCount(componentName: string) {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current++;
    if (import.meta.env.DEV) {
      console.log(`${componentName} rendered ${renderCount.current} times`);
    }
  });

  return renderCount.current;
}

/**
 * Measure function execution time
 */
export function measurePerformance<T>(
  fn: () => T,
  label: string
): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();

  if (import.meta.env.DEV) {
    console.log(`${label} took ${(end - start).toFixed(2)}ms`);
  }

  return result;
}

/**
 * Async version of measurePerformance
 */
export async function measurePerformanceAsync<T>(
  fn: () => Promise<T>,
  label: string
): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();

  if (import.meta.env.DEV) {
    console.log(`${label} took ${(end - start).toFixed(2)}ms`);
  }

  return result;
}

/**
 * Lazy load images with Intersection Observer
 */
export function useLazyImage(ref: React.RefObject<HTMLImageElement>, src: string) {
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && ref.current) {
          ref.current.src = src;
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, src]);
}

/**
 * Virtualized list helper for long lists
 */
export function useVirtualList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;

  const totalHeight = items.length * itemHeight;

  return {
    visibleItems,
    offsetY,
    totalHeight,
    setScrollTop,
  };
}

/**
 * Memoize expensive calculations
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Web Worker helper for CPU-intensive tasks
 */
export function useWebWorker<T, R>(
  workerFunction: (data: T) => R
): (data: T) => Promise<R> {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Create worker from function
    const blob = new Blob(
      [`self.onmessage = ${workerFunction.toString()}`],
      { type: 'application/javascript' }
    );
    const url = URL.createObjectURL(blob);
    workerRef.current = new Worker(url);

    return () => {
      workerRef.current?.terminate();
      URL.revokeObjectURL(url);
    };
  }, [workerFunction]);

  return useCallback(
    (data: T) => {
      return new Promise<R>((resolve, reject) => {
        if (!workerRef.current) {
          reject(new Error('Worker not initialized'));
          return;
        }

        workerRef.current.onmessage = (e) => resolve(e.data);
        workerRef.current.onerror = reject;
        workerRef.current.postMessage(data);
      });
    },
    []
  );
}

/**
 * Request Idle Callback wrapper
 */
export function runWhenIdle(callback: () => void, timeout: number = 1000) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout });
  } else {
    setTimeout(callback, 0);
  }
}

/**
 * Batch state updates for better performance
 */
export function batchUpdates(updates: (() => void)[]) {
  // React 18 automatically batches updates
  updates.forEach((update) => update());
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string) {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
}

/**
 * Prefetch route for faster navigation
 */
export function prefetchRoute(path: string) {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = path;
  document.head.appendChild(link);
}

// Export missing useState
import { useState } from 'react';
