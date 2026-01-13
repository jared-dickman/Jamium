import { z } from 'zod';

const MAX_ARTIST_LENGTH = 200;
const MAX_TITLE_LENGTH = 300;

// Download song request
export const downloadRequestSchema = z
  .object({
    songUrl: z.string().url().max(500),
    artist: z.string().min(1).max(MAX_ARTIST_LENGTH).optional(),
    title: z.string().min(1).max(MAX_TITLE_LENGTH).optional(),
  })
  .strict();

export type DownloadRequestInput = z.infer<typeof downloadRequestSchema>;

// Search request
export const searchRequestSchema = z
  .object({
    artist: z.string().min(1).max(MAX_ARTIST_LENGTH),
    title: z.string().min(1).max(MAX_TITLE_LENGTH),
  })
  .strict();

export type SearchRequestInput = z.infer<typeof searchRequestSchema>;
