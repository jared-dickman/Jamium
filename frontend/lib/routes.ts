/**
 * Application route constants
 * Use these instead of hardcoded strings to ensure type safety and consistency
 */
export const pageRoutes = {
  home: '/',
  repertoire: '/repertoire',
  jam: '/jam',
  tempo: '/metronome',
  theory: '/music-theory',
} as const;

/** Routes Buddy can navigate to with descriptions */
export const buddyRoutes = {
  repertoire: { path: '/repertoire', desc: 'Song library' },
  jam: { path: '/jam', desc: 'Practice mode' },
  theory: { path: '/music-theory', desc: 'Music theory' },
  tempo: { path: '/metronome', desc: 'Metronome' },
} as const;

export type PageRoute = (typeof pageRoutes)[keyof typeof pageRoutes];
