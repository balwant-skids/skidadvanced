/**
 * Structured Logging Utility
 * Feature: skids-e2e-deployment
 * Validates: Requirements 7.2
 * Property 10: Error Logging Completeness
 */

import { randomUUID } from 'crypto';

export type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  requestId: string;
  userId?: string;
  context: Record<string, any>;
  stack?: string;
}

/**
 * Logger class for structured logging
 */
class Logger {
  private requestId: string;
  private userId?: string;
  private context: Record<string, any>;

  constructor(requestId?: string, userId?: string, context: Record<string, any> = {}) {
    this.requestId = requestId || randomUUID();
    this.userId = userId;
    this.context = context;
  }

  /**
   * Create a log entry
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    additionalContext?: Record<string, any>,
    error?: Error
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      requestId: this.requestId,
      userId: this.userId,
      context: {
        ...this.context,
        ...additionalContext,
      },
      stack: error?.stack,
    };
  }

  /**
   * Write log entry to console and storage
   */
  private async writeLog(entry: LogEntry) {
    // Console output for development
    const consoleMethod = entry.level === 'ERROR' ? console.error :
                         entry.level === 'WARN' ? console.warn :
                         console.log;
    
    consoleMethod(JSON.stringify(entry, null, 2));

    // In production, we would store logs in Cloudflare Workers KV or external service
    if (process.env.NODE_ENV === 'production') {
      try {
        // Store in database for critical errors
        if (entry.level === 'ERROR') {
          await this.storeErrorLog(entry);
        }
      } catch (error) {
        console.error('Failed to store log:', error);
      }
    }
  }

  /**
   * Store error log in database
   */
  private async storeErrorLog(entry: LogEntry) {
    try {
      // Import Prisma dynamically to avoid circular dependencies
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();

      // Note: ErrorLog model needs to be added to Prisma schema
      // This is a placeholder for when the model is added
      /*
      await prisma.errorLog.create({
        data: {
          level: entry.level,
          message: entry.message,
          stack: entry.stack,
          context: JSON.stringify(entry.context),
          userId: entry.userId,
          timestamp: new Date(entry.timestamp),
        },
      });
      */

      await prisma.$disconnect();
    } catch (error) {
      console.error('Failed to store error log in database:', error);
    }
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error, context?: Record<string, any>) {
    const entry = this.createLogEntry('ERROR', message, context, error);
    this.writeLog(entry);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: Record<string, any>) {
    const entry = this.createLogEntry('WARN', message, context);
    this.writeLog(entry);
  }

  /**
   * Log an info message
   */
  info(message: string, context?: Record<string, any>) {
    const entry = this.createLogEntry('INFO', message, context);
    this.writeLog(entry);
  }

  /**
   * Log a debug message
   */
  debug(message: string, context?: Record<string, any>) {
    if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
      const entry = this.createLogEntry('DEBUG', message, context);
      this.writeLog(entry);
    }
  }

  /**
   * Create a child logger with additional context
   */
  child(additionalContext: Record<string, any>): Logger {
    return new Logger(
      this.requestId,
      this.userId,
      { ...this.context, ...additionalContext }
    );
  }

  /**
   * Set user ID for this logger
   */
  setUserId(userId: string): Logger {
    this.userId = userId;
    return this;
  }
}

/**
 * Create a new logger instance
 */
export function createLogger(
  requestId?: string,
  userId?: string,
  context?: Record<string, any>
): Logger {
  return new Logger(requestId, userId, context);
}

/**
 * Default logger instance
 */
export const logger = createLogger();

/**
 * Extract request ID from headers
 */
export function getRequestId(headers: Headers): string {
  return headers.get('x-request-id') || randomUUID();
}

/**
 * Create logger from Next.js request
 */
export function createRequestLogger(request: Request, userId?: string): Logger {
  const requestId = getRequestId(request.headers);
  const context = {
    method: request.method,
    url: request.url,
    userAgent: request.headers.get('user-agent'),
  };
  
  return createLogger(requestId, userId, context);
}
