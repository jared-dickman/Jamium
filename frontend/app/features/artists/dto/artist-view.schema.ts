import { z } from 'zod';

/**
 * Artist View Schema
 * Validates transformed API responses before sending to client
 */
export const artistViewSchema = z
  .object({
    slug: z.string(),
    name: z.string(),
    songCount: z.number(),
    songsUrl: z.string(),
  })
  .strict();

export const artistsListViewSchema = z.array(artistViewSchema);
