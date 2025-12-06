export const APP_ROUTES = {
  HOME: '/',
  REPERTOIRE: '/repertoire',
  JAM: '/jam',
  METRONOME: '/metronome',
} as const;

export const API_ROUTES = {
  SONGS: '/api/songs',
  SEARCH: '/api/search',
  SONG_DETAIL: (artistSlug: string, songSlug: string): string =>
    `/api/songs/${artistSlug}/${songSlug}`,
} as const;
