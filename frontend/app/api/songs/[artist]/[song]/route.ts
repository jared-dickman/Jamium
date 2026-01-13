import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { serverErrorTracker } from '@/app/utils/error-tracker.server';
import { validateApiAuth } from '@/lib/auth/apiAuth';
import { toSongDetailView } from '@/app/features/songs/transformers/song-view.transformer';
import { songDetailViewSchema } from '@/app/features/songs/dto/song-view.schema';
import { findSongBySlug, softDeleteSong } from '@/lib/supabase/songs.repository';
import type { SongRow } from '@/lib/supabase/songs.schema';

// Security: Validate path parameters with strict bounds
const PathParamsSchema = z
  .object({
    artist: z.string().min(1).max(200),
    song: z.string().min(1).max(300),
  })
  .strict();

interface RouteParams {
  params: Promise<{ artist: string; song: string }>;
}

type SongSection = {
  name: string;
  lines: Array<{ chord?: { name: string } | null; lyric: string; lineGroup?: number }>;
};

function toSongDetailResponse(record: SongRow) {
  const rawSections = record.sections as Array<{
    name: string;
    lines: Array<{
      lyrics?: string;
      chords?: string;
      chord?: { name: string } | null;
      lyric?: string;
      lineGroup?: number;
    }>;
  }>;

  // Transform sections to expected format (preserve lineGroup for UG-style rendering)
  const sections: SongSection[] = rawSections.map(section => ({
    name: section.name,
    lines: section.lines.map(line => ({
      chord: line.chord ?? (line.chords ? { name: line.chords } : null),
      lyric: line.lyric ?? line.lyrics ?? '',
      lineGroup: line.lineGroup,
    })),
  }));

  return {
    summary: {
      artist: record.artist,
      artistSlug: record.artist_slug,
      title: record.title,
      songSlug: record.song_slug,
      key: record.key ?? '',
      album: record.album ?? null,
      hasChords: record.has_chords,
      hasTab: record.has_tab,
      updatedAt: record.updated_at,
    },
    songJson: {
      artist: record.artist,
      title: record.title,
      key: record.key ?? undefined,
      album: record.album ?? null,
      sections,
    },
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const authResult = validateApiAuth(request);
  if (!authResult.authorized) {
    return authResult.response!;
  }

  let artist: string | undefined;
  let song: string | undefined;

  try {
    const resolvedParams = await params;

    // Security: Validate params before query (prevents injection)
    const parseResult = PathParamsSchema.safeParse(resolvedParams);
    if (!parseResult.success) {
      serverErrorTracker.captureApiError(new Error('Invalid path parameters'), {
        service: 'songs-api',
        operation: 'get-song-detail',
        validationErrors: parseResult.error.flatten(),
      });
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    artist = parseResult.data.artist;
    song = parseResult.data.song;

    const record = await findSongBySlug(artist, song);

    if (!record) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    const songDetailResponse = toSongDetailResponse(record);
    const transformed = toSongDetailView(songDetailResponse);

    if (!transformed) {
      return NextResponse.json({ error: 'Song data incomplete' }, { status: 404 });
    }

    return NextResponse.json(songDetailViewSchema.parse(transformed));
  } catch (err) {
    serverErrorTracker.captureApiError(err, {
      service: 'songs-api',
      operation: 'get-song-detail',
      artist,
      title: song,
    });
    return NextResponse.json({ error: 'Failed to fetch song' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authResult = validateApiAuth(request);
  if (!authResult.authorized) {
    return authResult.response!;
  }

  let artist: string | undefined;
  let song: string | undefined;

  try {
    const resolvedParams = await params;

    // Security: Validate params before query (prevents injection)
    const parseResult = PathParamsSchema.safeParse(resolvedParams);
    if (!parseResult.success) {
      serverErrorTracker.captureApiError(new Error('Invalid path parameters'), {
        service: 'songs-api',
        operation: 'delete-song',
        validationErrors: parseResult.error.flatten(),
      });
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    artist = parseResult.data.artist;
    song = parseResult.data.song;

    serverErrorTracker.addBreadcrumb('songs-api', 'Soft-deleting song', { artist, title: song });

    const deleted = await softDeleteSong(artist, song);

    if (!deleted) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    serverErrorTracker.captureApiError(err, {
      service: 'songs-api',
      operation: 'delete-song',
      artist,
      title: song,
    });
    return NextResponse.json({ error: 'Failed to delete song' }, { status: 500 });
  }
}
