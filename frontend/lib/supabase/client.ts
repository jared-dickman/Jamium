import { createClient } from '@supabase/supabase-js';
import { env } from '@/app/config/env';

let supabaseInstance: ReturnType<typeof createClient> | null = null;

/**
 * Get Supabase client singleton
 *
 * Uses service role key for server-side operations.
 * Singleton prevents creating multiple clients in serverless.
 */
export function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient(env.SUPABASE_URL, env.SUPABASE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabaseInstance;
}

// Re-export schemas and types from songs.schema.ts
export { songRowSchema, songInsertSchema, songUpdateSchema } from '@/lib/supabase/songs.schema';
export type { SongRow, SongInsert, SongUpdate } from '@/lib/supabase/songs.schema';
