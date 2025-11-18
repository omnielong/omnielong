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
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
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
      const error = hint.originalException;
      if (error instanceof Error) {
        // Ignore network errors (user might be offline)
        if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
          return null;
        }
      }

      return event;
    },

    // Privacy: don't send sensitive data
    beforeBreadcrumb(breadcrumb) {
      // Don't log PIN inputs
      if (breadcrumb.message?.toLowerCase().includes('pin')) {
        return null;
      }

      // Don't log API keys
      if (breadcrumb.data && 'apiKey' in breadcrumb.data) {
        breadcrumb.data.apiKey = '[REDACTED]';
      }

      return breadcrumb;
    },
  });

  console.log(`Sentry initialized for ${environment} environment`);
};

/**
 * Log custom error to Sentry
 */
export const logError = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, {
    extra: context,
  });
};

/**
 * Log custom message to Sentry
 */
export const logMessage = (message: string, level: Sentry.SeverityLevel = 'info') => {
  Sentry.captureMessage(message, level);
};

/**
 * Set user context for error tracking
 */
export const setUserContext = (userId: string, email?: string, username?: string) => {
  Sentry.setUser({
    id: userId,
    email,
    username,
  });
};

/**
 * Clear user context (on logout)
 */
export const clearUserContext = () => {
  Sentry.setUser(null);
};

/**
 * Add custom context to errors
 */
export const addContext = (key: string, value: any) => {
  Sentry.setContext(key, value);
};

/**
 * Add breadcrumb for debugging
 */
export const addBreadcrumb = (message: string, category: string, data?: Record<string, any>) => {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
  });
};

/**
 * Start a transaction for performance monitoring
 */
export const startTransaction = (name: string, op: string) => {
  return Sentry.startTransaction({
    name,
    op,
  });
};

/**
 * React Error Boundary component
 */
export const SentryErrorBoundary = Sentry.ErrorBoundary;

export default Sentry;
