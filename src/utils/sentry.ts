import * as Sentry from '@sentry/react';

/**
 * Inizializza Sentry per error tracking e performance monitoring
 */
export const initSentry = () => {
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
  const environment = import.meta.env.VITE_SENTRY_ENVIRONMENT || 'development';
  const appVersion = import.meta.env.VITE_APP_VERSION || '1.0.0';

  // Solo inizializza Sentry se il DSN è configurato
  if (!sentryDsn) {
    console.warn('Sentry DSN not configured. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn: sentryDsn,
    environment,
    release: `omnielong@${appVersion}`,
    integrations: [
      // Use Replay integration when available on the Sentry runtime
      // @ts-ignore - some SDK setups expose Replay on Sentry namespace
      new (Sentry as any).Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Performance Monitoring
    tracesSampleRate: environment === 'production' ? 0.1 : 1.0, // 10% in production, 100% in dev

    // Session Replay
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

    // Error filtering
    beforeSend(event, hint) {
      // Don't send errors in development
      if (environment === 'development') {
        console.error('Sentry would send:', event, hint);
        return null;
      }

      // Filter out common non-critical errors
      const error = hint?.originalException as unknown;
      if (error instanceof Error) {
        // Ignore network errors (user might be offline)
        if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
          return null;
        }

        // Ignore ResizeObserver errors (browser quirk, not actionable)
        if (error.message.includes('ResizeObserver')) {
          return null;
        }
      }

      return event;
    },

    // Privacy: don't send sensitive data from breadcrumbs
    beforeBreadcrumb(breadcrumb) {
      // Don't log PIN inputs
      if (breadcrumb.message?.toLowerCase().includes('pin')) {
        return null;
      }

      // Don't log API keys
      if (breadcrumb.data && typeof breadcrumb.data === 'object' && 'apiKey' in breadcrumb.data) {
        // @ts-ignore
        breadcrumb.data.apiKey = '[REDACTED]';
      }

      return breadcrumb;
    },
  });

  console.log(`Sentry initialized for ${environment} environment`);
};

/**
 * Wrapper/compat helpers for Sentry usage across the codebase
 */
export const captureException = (error: Error, context?: Record<string, unknown>) => {
  if (context) {
    Sentry.setContext('additional', context);
  }
  Sentry.captureException(error);
};

export const logError = captureException;

export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info') => {
  Sentry.captureMessage(message, level);
};

export const logMessage = captureMessage;

export const setUser = (user: { id: string; email?: string; username?: string } | null) => {
  Sentry.setUser(user);
};

export const setUserContext = (userId: string, email?: string, username?: string) => {
  Sentry.setUser({
    id: userId,
    email,
    username,
  });
};

export const clearUserContext = () => {
  Sentry.setUser(null);
};

export const addContext = (key: string, value: any) => {
  Sentry.setContext(key, value);
};

export const addBreadcrumb = (message: string, category: string, data?: Record<string, any>) => {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
  });
};

export const startTransaction = (name: string, op: string) => {
  // Use runtime any to call startTransaction if available on the Sentry instance.
  // This avoids TypeScript errors in projects where the typed SDK doesn't expose it.
  // @ts-ignore
  return (Sentry as any).startTransaction({
    name,
    op,
  });
};

/**
 * ErrorBoundary component wrapper di Sentry
 * Usa questo al posto del normale ErrorBoundary per catturare errori React
 */
export const SentryErrorBoundary = Sentry.ErrorBoundary;

export default Sentry;
