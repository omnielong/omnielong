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

        // Ignore ResizeObserver errors (browser quirk, not actionable)
        if (error.message.includes('ResizeObserver')) {
          return null;
        }
      }

      return event;
    },
  });
};

/**
 * ErrorBoundary component wrapper di Sentry
 * Usa questo al posto del normale ErrorBoundary per catturare errori React
 */
export const SentryErrorBoundary = Sentry.ErrorBoundary;

/**
 * Cattura un'eccezione manualmente e la invia a Sentry
 */
export const captureException = (error: Error, context?: Record<string, unknown>) => {
  if (context) {
    Sentry.setContext('additional', context);
  }
  Sentry.captureException(error);
};

/**
 * Cattura un messaggio manualmente e lo invia a Sentry
 */
export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info') => {
  Sentry.captureMessage(message, level);
};

/**
 * Imposta informazioni sull'utente per Sentry
 */
export const setUser = (user: { id: string; email?: string; username?: string } | null) => {
  Sentry.setUser(user);
};
