import { z } from 'zod';

/**
 * Song View Schemas
 * Validates transformed API responses before sending to client
 */

export const savedSongViewSchema = z
  .object({
    artist: z.string(),
    artistSlug: z.string(),
    title: z.string(),
    songSlug: z.string(),
    key: z.string(),
    album: z.string().nullable().optional(),
    hasChords: z.boolean(),
    hasTab: z.boolean(),
    updatedAt: z.string(),
    displayTitle: z.string(),
    detailUrl: z.string(),
  })
  .strict();

export const songsListViewSchema = z.array(savedSongViewSchema);

export const songDetailViewSchema = z
  .object({
    artist: z.string(),
    artistSlug: z.string(),
    title: z.string(),
    songSlug: z.string(),
    key: z.string().optional(),
    album: z.string().nullable().optional(),
    sections: z.array(
      z.object({
        name: z.string(),
        lines: z.array(
          z.object({
            chord: z.object({ name: z.string() }).optional(),
            lyric: z.string(),
            lineGroup: z.number().optional(),
          })
        ),
      })
    ),
    chordsHtml: z.string().optional(),
    tabHtml: z.string().optional(),
  })
  .strict();
