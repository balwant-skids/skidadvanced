/**
 * Property-Based Tests for Error Logging
 * Feature: skids-e2e-deployment, Property 10: Error Logging Completeness
 * Validates: Requirements 7.2
 * 
 * Property: For any error that occurs in the application, it should be logged
 * with full stack trace and context
 */

import * as fc from 'fast-check';
import { createLogger } from '../../lib/logger';

describe('Property 10: Error Logging Completeness', () => {
  // Capture console output for testing
  let consoleOutput: string[] = [];
  const originalConsoleError = console.error;
  const originalConsoleLog = console.log;

  beforeEach(() => {
    consoleOutput = [];
    console.error = jest.fn((...args) => {
      consoleOutput.push(JSON.stringify(args));
    });
    console.log = jest.fn((...args) => {
      consoleOutput.push(JSON.stringify(args));
    });
  });

  afterEach(() => {
    console.error = originalConsoleError;
    console.log = originalConsoleLog;
  });

  test('should log all errors with message and stack trace', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }), // error message
        fc.string({ minLength: 1, maxLength: 100 }), // error name
        (message, name) => {
          // Create error
          const error = new Error(message);
          error.name = name;

          // Create logger and log error
          const logger = createLogger();
          logger.error('Test error occurred', error);

          // Verify error was logged
          expect(consoleOutput.length).toBeGreaterThan(0);

          // Parse logged output
          const loggedData = JSON.parse(consoleOutput[0]);
          const logEntry = JSON.parse(loggedData[0]);

          // Verify log entry contains required fields
          expect(logEntry.level).toBe('ERROR');
          expect(logEntry.message).toBe('Test error occurred');
          expect(logEntry.timestamp).toBeDefined();
          expect(logEntry.requestId).toBeDefined();
          expect(logEntry.stack).toBeDefined();
          expect(logEntry.stack).toContain(message);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('should include context in all error logs', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }), // error message
        fc.record({
          // random context
          userId: fc.option(fc.string(), { nil: undefined }),
          action: fc.string(),
          resource: fc.string(),
        }),
        (message, context) => {
          const error = new Error(message);
          const logger = createLogger();

          logger.error('Error with context', error, context);

          // Verify context is included
          const loggedData = JSON.parse(consoleOutput[0]);
          const logEntry = JSON.parse(loggedData[0]);

          expect(logEntry.context).toBeDefined();
          expect(logEntry.context.action).toBe(context.action);
          expect(logEntry.context.resource).toBe(context.resource);
          if (context.userId) {
            expect(logEntry.context.userId).toBe(context.userId);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('should generate unique request IDs for each logger instance', () => {
    fc.assert(
      fc.property(fc.integer({ min: 2, max: 10 }), (numLoggers) => {
        const requestIds = new Set<string>();

        // Create multiple loggers
        for (let i = 0; i < numLoggers; i++) {
          consoleOutput = [];
          const logger = createLogger();
          logger.error('Test error');

          const loggedData = JSON.parse(consoleOutput[0]);
          const logEntry = JSON.parse(loggedData[0]);
          requestIds.add(logEntry.requestId);
        }

        // All request IDs should be unique
        expect(requestIds.size).toBe(numLoggers);
      }),
      { numRuns: 50 }
    );
  });

  test('should preserve request ID across child loggers', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        fc.record({
          key1: fc.string(),
          key2: fc.integer(),
        }),
        (message, additionalContext) => {
          consoleOutput = [];

          // Create parent logger
          const parentLogger = createLogger();
          parentLogger.error('Parent error');

          const parentLogData = JSON.parse(consoleOutput[0]);
          const parentLogEntry = JSON.parse(parentLogData[0]);
          const parentRequestId = parentLogEntry.requestId;

          consoleOutput = [];

          // Create child logger
          const childLogger = parentLogger.child(additionalContext);
          childLogger.error('Child error');

          const childLogData = JSON.parse(consoleOutput[0]);
          const childLogEntry = JSON.parse(childLogData[0]);

          // Request ID should be the same
          expect(childLogEntry.requestId).toBe(parentRequestId);

          // Additional context should be present
          expect(childLogEntry.context.key1).toBe(additionalContext.key1);
          expect(childLogEntry.context.key2).toBe(additionalContext.key2);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('should log errors at different levels correctly', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('ERROR', 'WARN', 'INFO'),
        fc.string({ minLength: 1 }),
        (level, message) => {
          consoleOutput = [];
          const logger = createLogger();

          // Log at different levels
          if (level === 'ERROR') {
            logger.error(message, new Error(message));
          } else if (level === 'WARN') {
            logger.warn(message);
          } else {
            logger.info(message);
          }

          // Verify level is correct
          const loggedData = JSON.parse(consoleOutput[0]);
          const logEntry = JSON.parse(loggedData[0]);

          expect(logEntry.level).toBe(level);
          expect(logEntry.message).toBe(message);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('should handle errors without stack traces', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (message) => {
        consoleOutput = [];
        const logger = createLogger();

        // Log error without Error object
        logger.error(message);

        const loggedData = JSON.parse(consoleOutput[0]);
        const logEntry = JSON.parse(loggedData[0]);

        // Should still log with level and message
        expect(logEntry.level).toBe('ERROR');
        expect(logEntry.message).toBe(message);
        expect(logEntry.timestamp).toBeDefined();
        expect(logEntry.requestId).toBeDefined();
      }),
      { numRuns: 100 }
    );
  });

  test('should include user ID when set', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }), // message
        fc.string({ minLength: 1 }), // userId
        (message, userId) => {
          consoleOutput = [];
          const logger = createLogger();
          logger.setUserId(userId);

          logger.error(message);

          const loggedData = JSON.parse(consoleOutput[0]);
          const logEntry = JSON.parse(loggedData[0]);

          expect(logEntry.userId).toBe(userId);
        }
      ),
      { numRuns: 100 }
    );
  });
});
