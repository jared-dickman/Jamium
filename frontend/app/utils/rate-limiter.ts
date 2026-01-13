/**
 * In-memory rate limiter for API endpoints
 * Note: Resets on cold start (serverless limitation)
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimiter = new Map<string, RateLimitRecord>();

/**
 * Check if request is within rate limit
 * @param ip - Client IP address
 * @param limit - Maximum requests per window (default: 10)
 * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 * @returns true if allowed, false if rate limit exceeded
 */
export function checkRateLimit(ip: string, limit = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimiter.get(ip);

  if (!record || now > record.resetTime) {
    rateLimiter.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * Get remaining requests for an IP
 */
export function getRemainingRequests(ip: string, limit = 10): number {
  const record = rateLimiter.get(ip);
  if (!record || Date.now() > record.resetTime) {
    return limit;
  }
  return Math.max(0, limit - record.count);
}

/**
 * Clear rate limit for specific IP (for testing)
 */
export function clearRateLimit(ip: string): void {
  rateLimiter.delete(ip);
}
