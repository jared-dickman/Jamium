import { z } from 'zod';

// Security: Define max lengths to prevent DoS
const MAX_ARTIST = 200;
const MAX_TITLE = 300;
const MAX_SLUG = 300;
const MAX_KEY = 20;
const MAX_URL = 2000;
const MAX_SECTIONS = 100;

// Database row schema (snake_case from Supabase)
export const songRowSchema = z
  .object({
    id: z.string().uuid(),
    artist: z.string().max(MAX_ARTIST),
    artist_slug: z.string().max(MAX_SLUG),
    title: z.string().max(MAX_TITLE),
    song_slug: z.string().max(MAX_SLUG),
    key: z.string().max(MAX_KEY).nullable(),
    album: z.string().max(MAX_TITLE).nullable(),
    original_key: z.string().max(MAX_KEY).nullable(),
    performer: z.string().max(MAX_ARTIST).nullable(),
    capo: z.string().max(10).nullable(),
    source_url: z.string().max(MAX_URL).nullable(),
    sections: z.array(z.unknown()).max(MAX_SECTIONS),
    has_chords: z.boolean(),
    has_tab: z.boolean(),
    created_at: z.string().max(50),
    updated_at: z.string().max(50),
    deleted_at: z.string().max(50).nullable(),
  })
  .strict();

export type SongRow = z.infer<typeof songRowSchema>;

// Insert schema (no id, timestamps optional)
export const songInsertSchema = z
  .object({
    artist: z.string().min(1).max(MAX_ARTIST),
    artist_slug: z.string().min(1).max(MAX_SLUG),
    title: z.string().min(1).max(MAX_TITLE),
    song_slug: z.string().min(1).max(MAX_SLUG),
    key: z.string().max(MAX_KEY).nullable().optional(),
    album: z.string().max(MAX_TITLE).nullable().optional(),
    original_key: z.string().max(MAX_KEY).nullable().optional(),
    performer: z.string().max(MAX_ARTIST).nullable().optional(),
    capo: z.string().max(10).nullable().optional(),
    source_url: z.string().max(MAX_URL).nullable().optional(),
    sections: z.array(z.unknown()).max(MAX_SECTIONS),
    has_chords: z.boolean().optional(),
    has_tab: z.boolean().optional(),
    updated_at: z.string().max(50).optional(),
  })
  .strict();

export type SongInsert = z.infer<typeof songInsertSchema>;

// Update schema (all fields optional)
export const songUpdateSchema = songInsertSchema.partial();
export type SongUpdate = z.infer<typeof songUpdateSchema>;
