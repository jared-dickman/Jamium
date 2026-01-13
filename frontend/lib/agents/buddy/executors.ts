/**
 * Buddy Tool Executors - Powered by Riff-Ripper 🎸
 *
 * Uses riff-ripper's TypeScript functions for UG search/fetch,
 * then saves via the existing /api/songs endpoint to persist to Supabase.
 */

import { logger } from '@/lib/logger';
import { serverErrorTracker } from '@/app/utils/error-tracker.server';
import { searchTabs, ripSong, type RiffRipperResult } from '@/lib/agents/riff-ripper';

/** Get the API base URL for internal fetch calls (server-side) */
function getApiBaseUrl(): string {
  // Vercel provides VERCEL_URL for serverless functions
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Local development - use PORT if available
  const port = process.env.PORT || '3000';
  return `http://localhost:${port}`;
}

export async function executeSearch(
  _apiBaseUrl: string,
  artist: string,
  title: string
): Promise<string> {
  try {
    const results = await searchTabs(artist, title, 'Chords');

    if (!results || results.length === 0) {
      return JSON.stringify({
        query: { artist, title },
        chords: [],
        tabs: [],
        message: `No results found for "${artist} - ${title}"`,
      });
    }

    const chords = results.map(r => ({
      songUrl: r.url,
      artist,
      title,
      type: 'Chords',
      rating: r.rating,
      votes: r.votes,
    }));

    return JSON.stringify({
      query: { artist, title },
      chords,
      tabs: [],
      message: `Found ${chords.length} results`,
    });
  } catch (error) {
    logger.error('[buddy/search]', { error: error instanceof Error ? error.message : error });
    serverErrorTracker.captureApiError(error, {
      service: 'buddy',
      operation: 'execute-search',
      artist,
      title,
    });
    return JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error',
      query: { artist, title },
      chords: [],
      tabs: [],
    });
  }
}

export async function executeDownload(
  _apiBaseUrl: string,
  songUrl: string,
  artist?: string,
  title?: string
): Promise<string> {
  try {
    let result: RiffRipperResult;

    if (artist && title) {
      result = await ripSong({ artist, title });
    } else {
      const urlMatch = songUrl.match(/\/tab\/([^/]+)\/([^/]+)-(?:chords|tabs)/);
      if (!urlMatch) {
        return JSON.stringify({ success: false, error: 'Invalid Ultimate Guitar URL format' });
      }
      const parsedArtist = urlMatch[1]?.replace(/-/g, ' ') || 'Unknown';
      const parsedTitle = urlMatch[2]?.replace(/-/g, ' ') || 'Unknown';
      result = await ripSong({ artist: parsedArtist, title: parsedTitle });
    }

    if (!result.success || !result.song) {
      return JSON.stringify({ success: false, error: result.error || 'Failed to download song' });
    }

    const song = result.song;
    const saveResponse = await fetch(`${getApiBaseUrl()}/api/songs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        artist: song.artist,
        title: song.title,
        key: song.key,
        album: song.album,
        originalKey: song.originalKey,
        performer: song.performer,
        capo: song.capo,
        sections: song.sections,
        sourceUrl: song.sourceUrl,
      }),
    });

    if (!saveResponse.ok) {
      const errorText = await saveResponse.text();
      logger.error('[buddy/download]', { status: saveResponse.status, errorText });
      throw new Error(`Failed to save song: ${errorText || saveResponse.status}`);
    }

    const savedSong = await saveResponse.json();
    return JSON.stringify({
      success: true,
      song: savedSong,
      message: `Successfully downloaded "${song.title}" by ${song.artist}`,
    });
  } catch (error) {
    logger.error('[buddy/download]', { error: error instanceof Error ? error.message : error });
    serverErrorTracker.captureApiError(error, {
      service: 'buddy',
      operation: 'download-song',
      songUrl,
    });
    return JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export async function executeListArtists(_apiBaseUrl?: string): Promise<string> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/songs`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch songs: ${response.status}`);
    }

    const songs = await response.json();
    const artistMap = new Map<string, { name: string; slug: string; songCount: number }>();

    for (const song of songs) {
      const existing = artistMap.get(song.artistSlug);
      if (existing) {
        existing.songCount++;
      } else {
        artistMap.set(song.artistSlug, {
          name: song.artist,
          slug: song.artistSlug,
          songCount: 1,
        });
      }
    }

    const artists = Array.from(artistMap.values()).sort((a, b) => a.name.localeCompare(b.name));

    return JSON.stringify({ artists, count: artists.length });
  } catch (error) {
    serverErrorTracker.captureApiError(error, {
      service: 'buddy',
      operation: 'list-artists',
    });
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return JSON.stringify({ error: errorMsg, artists: [] });
  }
}

export async function executeGetArtistSongs(_apiBaseUrl: string, artist: string): Promise<string> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/songs`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch songs: ${response.status}`);
    }

    interface SongEntry {
      artist: string;
      artistSlug: string;
      title: string;
      songSlug: string;
      key?: string;
      album?: string;
    }

    const allSongs: SongEntry[] = await response.json();
    const artistLower = artist.toLowerCase();
    const artistSongs = allSongs.filter(
      song =>
        song.artist.toLowerCase() === artistLower ||
        song.artistSlug.toLowerCase() === artistLower ||
        song.artist.toLowerCase().includes(artistLower)
    );

    return JSON.stringify({
      artist,
      songs: artistSongs,
      count: artistSongs.length,
    });
  } catch (error) {
    serverErrorTracker.captureApiError(error, {
      service: 'buddy',
      operation: 'get-artist-songs',
      artist,
    });
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return JSON.stringify({ error: errorMsg, songs: [] });
  }
}

export function executeNavigate(path: string, reason?: string): string {
  if (!path.startsWith('/')) {
    return JSON.stringify({
      error: 'Invalid path - must start with /',
      navigateTo: null,
    });
  }

  return JSON.stringify({
    navigateTo: path,
    reason: reason || 'Navigating to requested page',
  });
}

interface NavigateResult {
  navigateTo?: string;
  reason?: string;
  error?: string;
}

export function parseNavigationResult(toolResult: string): NavigateResult | null {
  try {
    const result = JSON.parse(toolResult) as NavigateResult;
    return result.navigateTo ? result : null;
  } catch {
    return null;
  }
}
