# URL Params System

Type-safe URL state for Jamium via nuqs.

## Architecture

```
useJamParams.ts  → nuqs wrapper (single import point)
pageParams.ts    → schema (all params defined here)
tools.ts         → 5 Buddy tools (navigate has params arg)
```

## Quick Start

```tsx
import { useJamParams, jamParsers } from '@/lib/hooks';

const [song, setSong] = useJamParams('song', jamParsers.song);
const [bpm, setBpm] = useJamParams('bpm', jamParsers.bpm);
```

## Buddy Integration

Navigate tool accepts `params` arg to control UI state:

```ts
navigate({ path: '/songs/Oasis/Wonderwall', params: { tab: 'chords', bpm: '90' } });
```

## Adding Params

1. Add parser to `jamParsers` in `useJamParams.ts`
2. Add schema entry to `PageParams` in `pageParams.ts`
