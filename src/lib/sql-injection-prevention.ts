/**
 * SQL Injection Prevention Utility
 * 
 * This module provides utilities to prevent SQL injection attacks by:
 * 1. Validating that all Prisma queries use parameterized queries
 * 2. Sanitizing user input before database operations
 * 3. Providing safe query builders for dynamic queries
 */

/**
 * Sanitize user input to prevent SQL injection
 * Removes or escapes potentially dangerous characters
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }

  // Remove null bytes
  let sanitized = input.replace(/\0/g, '');

  // Escape single quotes (though Prisma handles this, defense in depth)
  sanitized = sanitized.replace(/'/g, "''");

  // Remove SQL comment markers
  sanitized = sanitized.replace(/--/g, '');
  sanitized = sanitized.replace(/\/\*/g, '');
  sanitized = sanitized.replace(/\*\//g, '');

  // Remove semicolons (prevent query chaining)
  sanitized = sanitized.replace(/;/g, '');

  return sanitized.trim();
}

/**
 * Validate that a string doesn't contain SQL injection patterns
 */
export function validateNoSQLInjection(input: string): boolean {
  if (typeof input !== 'string') {
    return false;
  }

  // Check for common SQL injection patterns
  const dangerousPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(UNION\s+SELECT)/i,
    /(OR\s+1\s*=\s*1)/i,
    /(AND\s+1\s*=\s*1)/i,
    /('OR')/i,
    /(--)/,
    /(\/\*|\*\/)/,
    /(;)/,
    /(xp_)/i,
    /(sp_)/i,
  ];

  return !dangerousPatterns.some(pattern => pattern.test(input));
}

/**
 * Sanitize an object's string values
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj };

  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeInput(sanitized[key]);
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key]);
    }
  }

  return sanitized;
}

/**
 * Validate email format (prevents SQL injection via email field)
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && validateNoSQLInjection(email);
}

/**
 * Validate alphanumeric input (for IDs, codes, etc.)
 */
export function validateAlphanumeric(input: string): boolean {
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  return alphanumericRegex.test(input);
}

/**
 * Validate UUID format
 */
export function validateUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Safe query parameter builder for Prisma where clauses
 * Ensures all values are properly typed and validated
 */
export function buildSafeWhereClause<T extends Record<string, any>>(
  params: T
): T {
  const safeParams = { ...params };

  for (const key in safeParams) {
    const value = safeParams[key];

    // Validate string values
    if (typeof value === 'string') {
      if (!validateNoSQLInjection(value)) {
        throw new Error(`Invalid input detected in field: ${key}`);
      }
    }

    // Recursively validate nested objects
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      safeParams[key] = buildSafeWhereClause(value);
    }

    // Validate arrays
    if (Array.isArray(value)) {
      safeParams[key] = value.map(item =>
        typeof item === 'string' && !validateNoSQLInjection(item)
          ? (() => {
              throw new Error(`Invalid input detected in array field: ${key}`);
            })()
          : item
      );
    }
  }

  return safeParams;
}

/**
 * Audit log for potential SQL injection attempts
 */
export function logSQLInjectionAttempt(
  input: string,
  context: {
    userId?: string;
    endpoint?: string;
    ip?: string;
  }
): void {
  console.error('[SECURITY] Potential SQL injection attempt detected', {
    input: input.substring(0, 100), // Log first 100 chars only
    ...context,
    timestamp: new Date().toISOString(),
  });

  // In production, send to security monitoring service
  // e.g., Sentry, DataDog, CloudWatch, etc.
}

/**
 * Middleware helper to validate request body for SQL injection
 */
export function validateRequestBody(body: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  function checkValue(value: any, path: string = ''): void {
    if (typeof value === 'string') {
      if (!validateNoSQLInjection(value)) {
        errors.push(`Potentially dangerous input detected at: ${path}`);
      }
    } else if (typeof value === 'object' && value !== null) {
      for (const key in value) {
        checkValue(value[key], path ? `${path}.${key}` : key);
      }
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        checkValue(item, `${path}[${index}]`);
      });
    }
  }

  checkValue(body);

  return {
    isValid: errors.length === 0,
    errors,
  };
}
