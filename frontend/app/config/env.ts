import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    API_BASE_URL: z.string().url().optional().describe('Backend API base URL (server-side)'),
    ANTHROPIC_API_KEY: z
      .string()
      .min(1)
      .describe('Anthropic API key for Claude (server-side only)'),
    JINA_API_KEY: z.string().min(1).optional().describe('Jina AI API key for web scraping'),
    PINECONE_API_KEY: z.string().min(1).optional().describe('Pinecone API key for vector DB'),
    FIRECRAWL_API_KEY: z.string().min(1).optional().describe('Firecrawl API key for web crawling'),

    // Supabase
    SUPABASE_URL: z.string().url().describe('Supabase project URL'),
    SUPABASE_KEY: z.string().min(1).describe('Supabase service role key (server-side only)'),
  },
  client: {
    NEXT_PUBLIC_API_BASE_URL: z
      .string()
      .url()
      .optional()
      .describe('Backend API base URL (client-side)'),
    NEXT_PUBLIC_BUILD_TIME: z.string().optional().describe('Build timestamp (set at build time)'),
    NEXT_PUBLIC_LOGROCKET_APP_ID: z
      .string()
      .optional()
      .describe('LogRocket app ID for session replay'),
    NEXT_PUBLIC_APP_VERSION: z.string().optional().describe('App version for tracking'),
    NEXT_PUBLIC_FORCE_ONBOARDING: z
      .string()
      .optional()

      .describe('Dev-only: Force onboarding demo to replay (ignored in production)'),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_BUILD_TIME: process.env.NEXT_PUBLIC_BUILD_TIME,
    NEXT_PUBLIC_LOGROCKET_APP_ID: process.env.NEXT_PUBLIC_LOGROCKET_APP_ID,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
    NEXT_PUBLIC_FORCE_ONBOARDING: process.env.NEXT_PUBLIC_FORCE_ONBOARDING,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
