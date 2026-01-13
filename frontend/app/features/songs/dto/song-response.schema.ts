import { z } from 'zod';

const MAX_ARTIST_LENGTH = 200;
const MAX_TITLE_LENGTH = 300;
const MAX_SLUG_LENGTH = 300;
const MAX_KEY_LENGTH = 20;
const MAX_HTML_LENGTH = 500000;
const MAX_SECTIONS = 100;
const MAX_LINES_PER_SECTION = 200;

// SavedSong schema (list item)
export const savedSongSchema = z
  .object({
    artist: z.string().max(MAX_ARTIST_LENGTH),
    artistSlug: z.string().max(MAX_SLUG_LENGTH),
    title: z.string().max(MAX_TITLE_LENGTH),
    songSlug: z.string().max(MAX_SLUG_LENGTH),
    key: z.string().max(MAX_KEY_LENGTH),
    album: z.string().max(MAX_TITLE_LENGTH).nullable().optional(),
    hasChords: z.boolean(),
    hasTab: z.boolean(),
    updatedAt: z.string().max(50),
  })
  .strict();

export type SavedSongResponse = z.infer<typeof savedSongSchema>;

// Song detail schema
export const songSectionLineSchema = z
  .object({
    chord: z
      .object({
        name: z.string().max(20),
      })
      .strict()
      .nullish(),
    lyric: z.string().max(1000),
    lineGroup: z.number().int().optional(),
  })
  .strict();

export const songSectionSchema = z
  .object({
    name: z.string().max(100),
    lines: z.array(songSectionLineSchema).max(MAX_LINES_PER_SECTION),
  })
  .strict();

export const songSchema = z
  .object({
    artist: z.string().max(MAX_ARTIST_LENGTH),
    title: z.string().max(MAX_TITLE_LENGTH),
    key: z.string().max(MAX_KEY_LENGTH).optional(),
    album: z.string().max(MAX_TITLE_LENGTH).nullable().optional(),
    sections: z.array(songSectionSchema).max(MAX_SECTIONS),
  })
  .strict();

export type SongResponse = z.infer<typeof songSchema>;

// Song detail with additional metadata
export const songDetailSchema = z
  .object({
    summary: savedSongSchema,
    chordsHtml: z.string().max(MAX_HTML_LENGTH).nullish(),
    tabHtml: z.string().max(MAX_HTML_LENGTH).nullish(),
    songJson: songSchema.nullish(),
  })
  .strict();

export type SongDetailResponse = z.infer<typeof songDetailSchema>;

// Search result schema
export const searchResultSchema = z
  .object({
    id: z.number().int(),
    title: z.string().max(MAX_TITLE_LENGTH),
    artist: z.string().max(MAX_ARTIST_LENGTH),
    rating: z.number(),
    votes: z.number().int(),
    score: z.number(),
    type: z.string().max(50),
  })
  .strict();

export type SearchResultResponse = z.infer<typeof searchResultSchema>;

// Search response schema
export const searchResponseSchema = z
  .object({
    query: z
      .object({
        artist: z.string().max(MAX_ARTIST_LENGTH),
        title: z.string().max(MAX_TITLE_LENGTH),
      })
      .strict(),
    chords: z.array(searchResultSchema).max(100),
    tabs: z.array(searchResultSchema).max(100),
  })
  .strict();

export type SearchResponseData = z.infer<typeof searchResponseSchema>;
