/**
 * CORS Configuration and Middleware
 * Feature: skids-e2e-deployment
 * Validates: Requirements 8.5
 * Property 15: CORS Policy Enforcement
 */

import { NextResponse } from 'next/server';
import { createLogger } from './logger';

const logger = createLogger();

interface CORSConfig {
  origin: string | string[] | ((origin: string) => boolean);
  methods: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials: boolean;
  maxAge?: number;
}

// Default CORS configuration
const DEFAULT_CORS_CONFIG: CORSConfig = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://skids-advanced.pages.dev',
    'https://www.skids-advanced.com',
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-Request-ID',
  ],
  exposedHeaders: [
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
  ],
  credentials: true,
  maxAge: 86400,  // 24 hours
};

/**
 * Check if origin is allowed
 */
function isOriginAllowed(origin: string, config: CORSConfig): boolean {
  if (typeof config.origin === 'function') {
    return config.origin(origin);
  }
  
  if (Array.isArray(config.origin)) {
    return config.origin.includes(origin);
  }
  
  return config.origin === origin || config.origin === '*';
}

/**
 * Get CORS headers for response
 */
export function getCORSHeaders(
  request: Request,
  config: Partial<CORSConfig> = {}
): Headers {
  const finalConfig = { ...DEFAULT_CORS_CONFIG, ...config };
  const headers = new Headers();
  
  const origin = request.headers.get('origin');
  
  if (origin && isOriginAllowed(origin, finalConfig)) {
    headers.set('Access-Control-Allow-Origin', origin);
    
    if (finalConfig.credentials) {
      headers.set('Access-Control-Allow-Credentials', 'true');
    }
    
    if (finalConfig.methods.length > 0) {
      headers.set('Access-Control-Allow-Methods', finalConfig.methods.join(', '));
    }
    
    if (finalConfig.allowedHeaders && finalConfig.allowedHeaders.length > 0) {
      headers.set('Access-Control-Allow-Headers', finalConfig.allowedHeaders.join(', '));
    }
    
    if (finalConfig.exposedHeaders && finalConfig.exposedHeaders.length > 0) {
      headers.set('Access-Control-Expose-Headers', finalConfig.exposedHeaders.join(', '));
    }
    
    if (finalConfig.maxAge) {
      headers.set('Access-Control-Max-Age', String(finalConfig.maxAge));
    }
  } else if (origin) {
    logger.warn('CORS request from unauthorized origin', { origin });
  }
  
  return headers;
}

/**
 * Handle CORS preflight request
 */
export function handleCORSPreflight(
  request: Request,
  config?: Partial<CORSConfig>
): Response {
  const headers = getCORSHeaders(request, config);
  
  return new Response(null, {
    status: 204,
    headers,
  });
}

/**
 * Apply CORS to API route
 */
export function withCORS(
  handler: (request: Request) => Promise<Response>,
  config?: Partial<CORSConfig>
) {
  return async (request: Request) => {
    // Handle preflight request
    if (request.method === 'OPTIONS') {
      return handleCORSPreflight(request, config);
    }
    
    // Get CORS headers
    const corsHeaders = getCORSHeaders(request, config);
    
    // Check if origin is allowed
    const origin = request.headers.get('origin');
    const finalConfig = { ...DEFAULT_CORS_CONFIG, ...config };
    
    if (origin && !isOriginAllowed(origin, finalConfig)) {
      logger.warn('Blocked request from unauthorized origin', { origin });
      
      return NextResponse.json(
        {
          error: {
            code: 'CORS_ERROR',
            message: 'Origin not allowed',
          },
        },
        { status: 403 }
      );
    }
    
    // Execute handler
    const response = await handler(request);
    
    // Add CORS headers to response
    for (const [key, value] of corsHeaders.entries()) {
      response.headers.set(key, value);
    }
    
    return response;
  };
}

/**
 * Combine CORS with other middleware
 */
export function applyCORSHeaders(response: Response, request: Request): Response {
  const corsHeaders = getCORSHeaders(request);
  
  for (const [key, value] of corsHeaders.entries()) {
    response.headers.set(key, value);
  }
  
  return response;
}

/**
 * Check if request is from allowed origin
 */
export function isAllowedOrigin(request: Request, config?: Partial<CORSConfig>): boolean {
  const origin = request.headers.get('origin');
  
  if (!origin) {
    // Same-origin requests don't have Origin header
    return true;
  }
  
  const finalConfig = { ...DEFAULT_CORS_CONFIG, ...config };
  return isOriginAllowed(origin, finalConfig);
}

/**
 * Get allowed origins list
 */
export function getAllowedOrigins(): string[] {
  const origins = DEFAULT_CORS_CONFIG.origin;
  
  if (Array.isArray(origins)) {
    return origins;
  }
  
  if (typeof origins === 'string') {
    return [origins];
  }
  
  return [];
}
