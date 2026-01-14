import { z } from 'zod';

// Security: Define max lengths to prevent DoS
const MAX_NAME = 200;
const MAX_KEY = 20;
const MAX_SECTIONS = 50;
const MAX_ARRANGEMENT = 100;
const MAX_LYRICS = 50;
const MAX_IDEAS = 20;
const MAX_IDEA_LENGTH = 2000;

// Lyrics section schema
const lyricsSectionSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['verse', 'chorus', 'bridge', 'intro', 'outro', 'solo']),
  content: z.string().max(5000),
  linkedSectionLabel: z.string().max(10).optional(),
});

// Database row schema (snake_case from Supabase)
export const jamRowSchema = z
  .object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    name: z.string().max(MAX_NAME),
    key: z.string().max(MAX_KEY),
    bpm: z.number().int().min(20).max(300),
    sections: z.record(z.string(), z.unknown()).refine(
      obj => Object.keys(obj).length <= MAX_SECTIONS,
      { message: `Sections cannot exceed ${MAX_SECTIONS}` }
    ),
    arrangement: z.array(z.string().max(10)).max(MAX_ARRANGEMENT),
    lyrics: z.array(lyricsSectionSchema).max(MAX_LYRICS).nullable(),
    ideas: z.array(z.string().max(MAX_IDEA_LENGTH)).max(MAX_IDEAS).nullable(),
    difficulty: z.enum(['beginner', 'intermediate', 'expert']),
    vibe: z.array(z.string().max(20)).max(10),
    is_public: z.boolean(),
    created_at: z.string().max(50),
    updated_at: z.string().max(50),
    deleted_at: z.string().max(50).nullable(),
  })
  .strict();

export type JamRow = z.infer<typeof jamRowSchema>;

// Insert schema (no id, timestamps optional)
export const jamInsertSchema = z
  .object({
    user_id: z.string().uuid(),
    name: z.string().min(1).max(MAX_NAME),
    key: z.string().max(MAX_KEY),
    bpm: z.number().int().min(20).max(300),
    sections: z.record(z.string(), z.unknown()).refine(
      obj => Object.keys(obj).length <= MAX_SECTIONS,
      { message: `Sections cannot exceed ${MAX_SECTIONS}` }
    ),
    arrangement: z.array(z.string().max(10)).max(MAX_ARRANGEMENT),
    lyrics: z.array(lyricsSectionSchema).max(MAX_LYRICS).nullable().optional(),
    ideas: z.array(z.string().max(MAX_IDEA_LENGTH)).max(MAX_IDEAS).nullable().optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'expert']).optional(),
    vibe: z.array(z.string().max(20)).max(10).optional(),
    is_public: z.boolean().optional(),
  })
  .strict();

export type JamInsert = z.infer<typeof jamInsertSchema>;

// Update schema (all fields optional)
export const jamUpdateSchema = jamInsertSchema.partial().omit({ user_id: true });
export type JamUpdate = z.infer<typeof jamUpdateSchema>;
