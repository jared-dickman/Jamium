import { NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/logger';
import { serverErrorTracker } from '@/app/utils/error-tracker.server';

export const runtime = 'nodejs';

const HealthResponseSchema = z
  .object({
    status: z.enum(['healthy', 'degraded', 'unhealthy']),
  })
  .strict();

type HealthStatus = z.infer<typeof HealthResponseSchema>['status'];

export async function GET() {
  const startTime = Date.now();

  try {
    let status: HealthStatus = 'healthy';
    let httpStatus = 200;

    // Check 1: Dependencies configured
    // Note: Consider adding rate limiting for production monitoring
    if (!process.env.ANTHROPIC_API_KEY) {
      status = 'unhealthy';
      httpStatus = 503;
    } else {
      // Check 2: Response time acceptable
      const responseTime = Date.now() - startTime;
      if (responseTime > 500) {
        logger.warn('[buddy-health] Slow response', { responseTime });
        status = 'degraded';
      }
    }

    const response = HealthResponseSchema.parse({ status });
    return NextResponse.json(response, { status: httpStatus });
  } catch (err) {
    serverErrorTracker.captureApiError(err, { service: 'buddy-health', operation: 'check' });
    return NextResponse.json({ status: 'unhealthy' }, { status: 503 });
  }
}
