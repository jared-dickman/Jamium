'use client';

import { useApiQuery, useApiMutation } from '@/app/hooks/query-hooks';
import { songKeys } from '@/app/features/songs/keys';
import { songOptions, songMutations } from '@/app/features/songs/options';
import {
  toSongsListView,
  toSearchView,
} from '@/app/features/songs/transformers/song-view.transformer';
import type {
  SavedSongResponse,
  SongDetailResponse,
  SearchResponseData,
} from '@/app/features/songs/dto/song-response.schema';
import type {
  SavedSongView,
  SongDetailView,
  SearchView,
} from '@/app/features/songs/transformers/song-view.transformer';
import type {
  DownloadRequestInput,
  SearchRequestInput,
} from '@/app/features/songs/dto/song-request.schema';

/**
 * Component API - Feature hooks that components import
 * These are the ONLY hooks that components should use for songs data
 */

/**
 * Fetch list of all saved songs
 *
 * @example
 * const { data: songs, isLoading, error } = useSongs();
 */
export function useSongs() {
  const options = songOptions.list();

  return useApiQuery<SavedSongResponse[], Error, SavedSongView[]>(
    options.queryKey,
    options.queryFn,
    {
      select: toSongsListView,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
}

/**
 * Fetch song detail by artist and song slug
 * API route transforms raw→view, hook consumes view directly
 */
export function useSongDetail(artistSlug: string, songSlug: string) {
  const options = songOptions.detail(artistSlug, songSlug);

  return useApiQuery<SongDetailView, Error, SongDetailView>(options.queryKey, options.queryFn, {
    staleTime: 10 * 60 * 1000,
    enabled: Boolean(artistSlug && songSlug),
  });
}

/**
 * Search for songs in the library
 *
 * @example
 * const { data: results, isLoading, refetch } = useSearchSongs({ artist: 'Beatles', title: 'Let It Be' });
 */
export function useSearchSongs(input: SearchRequestInput) {
  const options = songOptions.search(input);

  return useApiQuery<SearchResponseData, Error, SearchView>(options.queryKey, options.queryFn, {
    select: toSearchView,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: Boolean(input.artist || input.title), // Only search if at least one param provided
  });
}

/**
 * Download/save a new song to the library
 *
 * @example
 * const { mutate: downloadSong, isPending } = useDownloadSong();
 * downloadSong({ artist: 'Beatles', title: 'Let It Be', chordId: 123 });
 */
export function useDownloadSong() {
  return useApiMutation<SongDetailResponse, Error, DownloadRequestInput>(
    (data: DownloadRequestInput) => songMutations.download(data),
    {
      invalidationKeys: [songKeys.all], // Invalidate all song queries on successful download
    }
  );
}

/**
 * Delete a song from the library
 *
 * @example
 * const { mutate: deleteSong, isPending } = useDeleteSong();
 * deleteSong({ artistSlug: 'the-beatles', songSlug: 'let-it-be' });
 */
export function useDeleteSong() {
  return useApiMutation<void, Error, { artistSlug: string; songSlug: string }>(
    ({ artistSlug, songSlug }) => songMutations.delete(artistSlug, songSlug),
    {
      invalidationKeys: [songKeys.all], // Invalidate all song queries on successful delete
    }
  );
}
