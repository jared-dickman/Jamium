/**
 * Songs Repository - Zod-validated Supabase operations
 *
 * Uses @ts-expect-error because Supabase JS v2 requires generated Database types
 * for proper inference. Zod validation ensures runtime type safety.
 *
 * TODO: Generate types with `supabase gen types typescript` once table exists
 */

import { getSupabaseClient } from '@/lib/supabase/client';
import {
  songRowSchema,
  songInsertSchema,
  type SongRow,
  type SongInsert,
} from '@/lib/supabase/songs.schema';

const TABLE = 'songs';

export async function findAllSongs(): Promise<SongRow[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .is('deleted_at', null)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(row => songRowSchema.parse(row));
}

export async function findSongBySlug(
  artistSlug: string,
  songSlug: string
): Promise<SongRow | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('artist_slug', artistSlug)
    .eq('song_slug', songSlug)
    .is('deleted_at', null)
    .single();

  if (error?.code === 'PGRST116') return null; // Not found
  if (error) throw error;
  return data ? songRowSchema.parse(data) : null;
}

export async function upsertSong(input: SongInsert): Promise<SongRow> {
  const supabase = getSupabaseClient();
  const validated = songInsertSchema.parse(input);

  const { data, error } = await supabase
    .from(TABLE)
    // @ts-expect-error Supabase requires generated Database types - Zod validates response
    .upsert(validated, { onConflict: 'artist_slug,song_slug' })
    .select()
    .single();

  if (error) throw error;
  return songRowSchema.parse(data);
}

export async function softDeleteSong(artistSlug: string, songSlug: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from(TABLE)
    // @ts-expect-error Supabase requires generated Database types - Zod validates response
    .update({ deleted_at: now })
    .eq('artist_slug', artistSlug)
    .eq('song_slug', songSlug)
    .is('deleted_at', null)
    .select('id')
    .single();

  if (error?.code === 'PGRST116') return false; // Not found
  if (error) throw error;
  return !!data;
}
