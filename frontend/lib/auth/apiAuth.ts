import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const API_KEY_HEADER = 'x-api-key';

const ApiKeySchema = z.string().min(32, 'API key must be at least 32 characters');

interface AuthResult {
  authorized: boolean;
  response?: NextResponse;
}

/**
 * Server-side API authentication middleware
 *
 * SECURITY NOTE: Client-side auth removed. This validates server-to-server requests only.
 * - Client requests pass through without auth (rely on deployment-level protection)
 * - Server-to-server requests must include x-api-key header matching API_KEY env var
 * - If API_KEY is not configured, all requests are allowed (single-user mode)
 *
 * For multi-user: Implement session-based auth with httpOnly cookies
 */
export function validateApiAuth(request: NextRequest): AuthResult {
  const expectedKey = process.env.API_KEY;

  // Optional auth: If no API_KEY configured, allow all requests
  if (!expectedKey) {
    logger.debug('[auth] API_KEY not configured - allowing request', {
      path: request.nextUrl.pathname,
    });
    return { authorized: true };
  }

  // If API_KEY is configured, validate the request
  const apiKey = request.headers.get(API_KEY_HEADER);

  if (!apiKey) {
    logger.warn('[auth] Missing API key', {
      path: request.nextUrl.pathname,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
    });
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Unauthorized: API key required' }, { status: 401 }),
    };
  }

  const parseResult = ApiKeySchema.safeParse(apiKey);
  if (!parseResult.success) {
    logger.warn('[auth] Invalid API key format', {
      path: request.nextUrl.pathname,
    });
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Unauthorized: Invalid API key format' },
        { status: 401 }
      ),
    };
  }

  if (apiKey !== expectedKey) {
    logger.warn('[auth] Invalid API key', {
      path: request.nextUrl.pathname,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
    });
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Not found' }, { status: 404 }),
    };
  }

  return { authorized: true };
}
