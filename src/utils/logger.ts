/**
 * Logger strutturato per l'applicazione
 * Fornisce logging con livelli, context e integrazione con Sentry
 */

import { logError, logMessage, addBreadcrumb } from './sentry';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment: boolean;
  private logLevel: LogLevel;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.logLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
  }

  /**
   * Log a debug message (only in development)
   */
  debug(message: string, context?: LogContext) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(`[DEBUG] ${message}`, context || '');
      this.addSentryBreadcrumb(message, 'debug', context);
    }
  }

  /**
   * Log an info message
   */
  info(message: string, context?: LogContext) {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(`[INFO] ${message}`, context || '');
      this.addSentryBreadcrumb(message, 'info', context);
    }
  }

  /**
   * Log a warning
   */
  warn(message: string, context?: LogContext) {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(`[WARN] ${message}`, context || '');
      this.addSentryBreadcrumb(message, 'warning', context);
      logMessage(message, 'warning');
    }
  }

  /**
   * Log an error
   */
  error(message: string, error?: Error, context?: LogContext) {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(`[ERROR] ${message}`, error, context || '');

      if (error) {
        logError(error, { message, ...context });
      } else {
        logMessage(message, 'error');
      }
    }
  }

  /**
   * Log sale transaction
   */
  logSale(saleId: string, amount: number, operatorId: string) {
    this.info('Sale completed', {
      saleId,
      amount,
      operatorId,
      timestamp: new Date().toISOString(),
    });

    addBreadcrumb('Sale Transaction', 'transaction', {
      saleId,
      amount,
      operatorId,
    });
  }

  /**
   * Log operator login
   */
  logLogin(operatorId: string, role: string) {
    this.info('Operator logged in', {
      operatorId,
      role,
      timestamp: new Date().toISOString(),
    });

    addBreadcrumb('User Login', 'auth', {
      operatorId,
      role,
    });
  }

  /**
   * Log operator logout
   */
  logLogout(operatorId: string) {
    this.info('Operator logged out', {
      operatorId,
      timestamp: new Date().toISOString(),
    });

    addBreadcrumb('User Logout', 'auth', {
      operatorId,
    });
  }

  /**
   * Log API request
   */
  logApiRequest(method: string, url: string, status?: number) {
    this.debug('API Request', {
      method,
      url,
      status,
      timestamp: new Date().toISOString(),
    });

    addBreadcrumb('API Request', 'http', {
      method,
      url,
      status,
    });
  }

  /**
   * Log API error
   */
  logApiError(method: string, url: string, error: Error) {
    this.error('API Error', error, {
      method,
      url,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log shift operations
   */
  logShiftOperation(operation: 'open' | 'close', operatorId: string, balance?: number) {
    this.info(`Shift ${operation}`, {
      operation,
      operatorId,
      balance,
      timestamp: new Date().toISOString(),
    });

    addBreadcrumb('Shift Operation', 'business', {
      operation,
      operatorId,
      balance,
    });
  }

  /**
   * Log permission denied
   */
  logPermissionDenied(operatorId: string, requiredPermission: string) {
    this.warn('Permission denied', {
      operatorId,
      requiredPermission,
      timestamp: new Date().toISOString(),
    });

    addBreadcrumb('Permission Denied', 'security', {
      operatorId,
      requiredPermission,
    });
  }

  /**
   * Log data export/backup
   */
  logDataExport(type: string, recordCount: number, operatorId: string) {
    this.info('Data export', {
      type,
      recordCount,
      operatorId,
      timestamp: new Date().toISOString(),
    });

    addBreadcrumb('Data Export', 'data', {
      type,
      recordCount,
      operatorId,
    });
  }

  /**
   * Log performance metric
   */
  logPerformance(operation: string, durationMs: number) {
    if (durationMs > 1000) {
      this.warn(`Slow operation: ${operation}`, {
        operation,
        durationMs,
        timestamp: new Date().toISOString(),
      });
    } else {
      this.debug(`Performance: ${operation}`, {
        operation,
        durationMs,
      });
    }
  }

  /**
   * Check if should log at this level
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  /**
   * Add breadcrumb to Sentry if available
   */
  private addSentryBreadcrumb(message: string, category: string, data?: LogContext) {
    try {
      addBreadcrumb(message, category, data);
    } catch (error) {
      // Sentry might not be initialized, ignore
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export default
export default logger;
