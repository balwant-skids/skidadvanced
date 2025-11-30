/**
 * Rate Limiting Middleware
 * Feature: skids-e2e-deployment
 * Validates: Requirements 8.4
 * Property 14: Rate Limiting Enforcement
 */

import { NextResponse } from 'next/server';
import { createLogger } from './logger';

const logger = createLogger();

interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Max requests per window
  blockDuration: number;  // Block duration in milliseconds
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blockedUntil?: number;
}

// In-memory store for rate limiting
// In production, use Redis or similar distributed cache
const rateLimitStore = new Map<string, RateLimitEntry>();

// Default configuration
const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 15 * 60 * 1000,  // 15 minutes
  maxRequests: 100,  // 100 requests per window
  blockDuration: 15 * 60 * 1000,  // 15 minutes block
};

/**
 * Get client identifier from request
 */
function getClientId(request: Request): string {
  // Try to get IP from headers (for proxied requests)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  // Fallback to a default identifier
  return 'unknown';
}

/**
 * Clean up expired entries from store
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  
  for (const [key, entry] of rateLimitStore.entries()) {
    // Remove if reset time has passed and not blocked
    if (entry.resetTime < now && (!entry.blockedUntil || entry.blockedUntil < now)) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Check if request should be rate limited
 */
export function checkRateLimit(
  request: Request,
  config: Partial<RateLimitConfig> = {}
): { allowed: boolean; remaining: number; resetTime: number; retryAfter?: number } {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const clientId = getClientId(request);
  const now = Date.now();
  
  // Clean up old entries periodically
  if (Math.random() < 0.01) {  // 1% chance
    cleanupExpiredEntries();
  }
  
  let entry = rateLimitStore.get(clientId);
  
  // Check if client is blocked
  if (entry?.blockedUntil && entry.blockedUntil > now) {
    const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000);
    
    logger.warn('Rate limit block active', {
      clientId,
      blockedUntil: new Date(entry.blockedUntil).toISOString(),
      retryAfter,
    });
    
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.blockedUntil,
      retryAfter,
    };
  }
  
  // Initialize or reset entry if window has passed
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + finalConfig.windowMs,
    };
    rateLimitStore.set(clientId, entry);
  }
  
  // Increment request count
  entry.count++;
  
  // Check if limit exceeded
  if (entry.count > finalConfig.maxRequests) {
    // Block the client
    entry.blockedUntil = now + finalConfig.blockDuration;
    const retryAfter = Math.ceil(finalConfig.blockDuration / 1000);
    
    logger.warn('Rate limit exceeded - blocking client', {
      clientId,
      requestCount: entry.count,
      maxRequests: finalConfig.maxRequests,
      blockDuration: finalConfig.blockDuration,
    });
    
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.blockedUntil,
      retryAfter,
    };
  }
  
  const remaining = finalConfig.maxRequests - entry.count;
  
  return {
    allowed: true,
    remaining,
    resetTime: entry.resetTime,
  };
}

/**
 * Apply rate limiting to API route
 */
export function withRateLimit(
  handler: (request: Request) => Promise<Response>,
  config?: Partial<RateLimitConfig>
) {
  return async (request: Request) => {
    const result = checkRateLimit(request, config);
    
    // Add rate limit headers
    const headers = new Headers();
    headers.set('X-RateLimit-Limit', String(config?.maxRequests || DEFAULT_CONFIG.maxRequests));
    headers.set('X-RateLimit-Remaining', String(result.remaining));
    headers.set('X-RateLimit-Reset', String(result.resetTime));
    
    if (!result.allowed) {
      if (result.retryAfter) {
        headers.set('Retry-After', String(result.retryAfter));
      }
      
      return NextResponse.json(
        {
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests. Please try again later.',
            retryAfter: result.retryAfter,
          },
        },
        {
          status: 429,
          headers,
        }
      );
    }
    
    // Execute handler
    const response = await handler(request);
    
    // Add rate limit headers to response
    for (const [key, value] of headers.entries()) {
      response.headers.set(key, value);
    }
    
    return response;
  };
}

/**
 * Get rate limit status for a client
 */
export function getRateLimitStatus(request: Request): {
  count: number;
  remaining: number;
  resetTime: number;
  isBlocked: boolean;
} {
  const clientId = getClientId(request);
  const entry = rateLimitStore.get(clientId);
  const now = Date.now();
  
  if (!entry) {
    return {
      count: 0,
      remaining: DEFAULT_CONFIG.maxRequests,
      resetTime: now + DEFAULT_CONFIG.windowMs,
      isBlocked: false,
    };
  }
  
  const isBlocked = !!(entry.blockedUntil && entry.blockedUntil > now);
  const remaining = Math.max(0, DEFAULT_CONFIG.maxRequests - entry.count);
  
  return {
    count: entry.count,
    remaining,
    resetTime: entry.blockedUntil || entry.resetTime,
    isBlocked,
  };
}

/**
 * Clear rate limit for a client (admin function)
 */
export function clearRateLimit(clientId: string): boolean {
  return rateLimitStore.delete(clientId);
}

/**
 * Get all rate limit entries (admin function)
 */
export function getAllRateLimits(): Map<string, RateLimitEntry> {
  return new Map(rateLimitStore);
}
