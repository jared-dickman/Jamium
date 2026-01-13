import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { serverErrorTracker } from '@/app/utils/error-tracker.server';
import { validateApiAuth } from '@/lib/auth/apiAuth';
import { savedSongSchema } from '@/app/features/songs/dto/song-response.schema';
import { toSongsListView } from '@/app/features/songs/transformers/song-view.transformer';
import { songsListViewSchema } from '@/app/features/songs/dto/song-view.schema';
import { z } from 'zod';
import { findAllSongs, upsertSong } from '@/lib/supabase/songs.repository';
import type { SongRow } from '@/lib/supabase/songs.schema';

const GENERIC_ERRORS = {
  FETCH: 'Failed to fetch songs',
  SAVE: 'Failed to save song',
  VALIDATION: 'Invalid request data',
} as const;

function slugify(text: string): string {
  return text
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

function toDomain(record: SongRow): z.infer<typeof savedSongSchema> {
  return {
    artist: record.artist,
    artistSlug: record.artist_slug,
    title: record.title,
    songSlug: record.song_slug,
    key: record.key ?? '',
    album: record.album ?? undefined,
    hasChords: record.has_chords,
    hasTab: record.has_tab,
    updatedAt: record.updated_at,
  };
}

export async function GET(request: NextRequest) {
  const authResult = validateApiAuth(request);
  if (!authResult.authorized) {
    return authResult.response!;
  }

  try {
    const songs = await findAllSongs();
    const viewData = toSongsListView(songs.map(toDomain));
    return NextResponse.json(songsListViewSchema.parse(viewData));
  } catch (err) {
    serverErrorTracker.captureApiError(err, {
      service: 'songs-api',
      operation: 'get-songs',
    });
    return NextResponse.json({ error: GENERIC_ERRORS.FETCH }, { status: 500 });
  }
}

// POST expects a complete song object from the UG skill
const saveSongSchema = z.object({
  artist: z.string(),
  title: z.string(),
  key: z.string().optional(),
  album: z.string().optional(),
  originalKey: z.string().optional(),
  performer: z.string().optional(),
  capo: z.number().optional(),
  sections: z.array(z.any()),
  sourceUrl: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const authResult = validateApiAuth(request);
  if (!authResult.authorized) {
    return authResult.response!;
  }

  try {
    const body = await request.json();
    const validationResult = saveSongSchema.safeParse(body);

    if (!validationResult.success) {
      serverErrorTracker.captureApiError(new Error('Request validation failed'), {
        service: 'songs-api',
        operation: 'save-song',
        validationErrors: validationResult.error.flatten(),
      });
      return NextResponse.json({ error: GENERIC_ERRORS.VALIDATION }, { status: 400 });
    }

    const song = validationResult.data;
    const artistSlug = slugify(song.artist);
    const songSlug = slugify(song.title);
    const now = new Date().toISOString();

    const savedSong = await upsertSong({
      artist: song.artist,
      artist_slug: artistSlug,
      title: song.title,
      song_slug: songSlug,
      key: song.key ?? null,
      album: song.album ?? null,
      original_key: song.originalKey ?? null,
      performer: song.performer ?? null,
      capo: song.capo?.toString() ?? null,
      source_url: song.sourceUrl ?? null,
      sections: song.sections,
      has_chords: true,
      has_tab: false,
      updated_at: now,
    });

    return NextResponse.json(savedSongSchema.parse(toDomain(savedSong)));
  } catch (err) {
    serverErrorTracker.captureApiError(err, {
      service: 'songs-api',
      operation: 'save-song',
    });
    return NextResponse.json({ error: GENERIC_ERRORS.SAVE }, { status: 500 });
  }
}
