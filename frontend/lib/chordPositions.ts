/**
 * Guitar chord position database
 * Each position is represented as [string, fret, finger]
 * string: 1-6 (1=high E, 6=low E)
 * fret: 0=open, -1=muted, 1-24=fret number
 * finger: 0=open, 1-4=fingers, -1=muted
 */

export interface ChordPosition {
  frets: number[]; // 6 numbers representing each string (low E to high e): -1=muted, 0=open, 1-24=fret
  fingers: number[]; // Finger positions: -1=muted, 0=open, 1-4=fingers
  baseFret: number; // Starting fret for display (1 for open positions)
  barres?: { fret: number; fromString: number; toString: number }[]; // Barre chord info
}

export interface ChordVoicing {
  name: string;
  position: ChordPosition;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  positionName: string; // e.g., "Open", "5th Position", "Barre"
}

// Chord database - multiple voicings per chord
export const CHORD_DATABASE: Record<string, ChordVoicing[]> = {
  // C Major voicings
  C: [
    {
      name: 'C',
      position: {
        frets: [-1, 3, 2, 0, 1, 0],
        fingers: [-1, 3, 2, 0, 1, 0],
        baseFret: 1,
      },
      difficulty: 'beginner',
      positionName: 'Open',
    },
    {
      name: 'C',
      position: {
        frets: [-1, 3, 5, 5, 5, 3],
        fingers: [-1, 1, 3, 3, 3, 1],
        baseFret: 3,
        barres: [{ fret: 3, fromString: 5, toString: 1 }],
      },
      difficulty: 'intermediate',
      positionName: '3rd Position Barre',
    },
    {
      name: 'C',
      position: {
        frets: [8, 10, 10, 9, 8, 8],
        fingers: [1, 3, 4, 2, 1, 1],
        baseFret: 8,
        barres: [{ fret: 8, fromString: 6, toString: 1 }],
      },
      difficulty: 'intermediate',
      positionName: '8th Position',
    },
  ],

  // D Major voicings
  D: [
    {
      name: 'D',
      position: {
        frets: [-1, -1, 0, 2, 3, 2],
        fingers: [-1, -1, 0, 1, 3, 2],
        baseFret: 1,
      },
      difficulty: 'beginner',
      positionName: 'Open',
    },
    {
      name: 'D',
      position: {
        frets: [-1, 5, 7, 7, 7, 5],
        fingers: [-1, 1, 3, 3, 3, 1],
        baseFret: 5,
        barres: [{ fret: 5, fromString: 5, toString: 1 }],
      },
      difficulty: 'intermediate',
      positionName: '5th Position Barre',
    },
    {
      name: 'D',
      position: {
        frets: [10, 12, 12, 11, 10, 10],
        fingers: [1, 3, 4, 2, 1, 1],
        baseFret: 10,
        barres: [{ fret: 10, fromString: 6, toString: 1 }],
      },
      difficulty: 'intermediate',
      positionName: '10th Position',
    },
  ],

  // E Major voicings
  E: [
    {
      name: 'E',
      position: {
        frets: [0, 2, 2, 1, 0, 0],
        fingers: [0, 2, 3, 1, 0, 0],
        baseFret: 1,
      },
      difficulty: 'beginner',
      positionName: 'Open',
    },
    {
      name: 'E',
      position: {
        frets: [-1, 7, 9, 9, 9, 7],
        fingers: [-1, 1, 3, 3, 3, 1],
        baseFret: 7,
        barres: [{ fret: 7, fromString: 5, toString: 1 }],
      },
      difficulty: 'intermediate',
      positionName: '7th Position Barre',
    },
  ],

  // F Major voicings
  F: [
    {
      name: 'F',
      position: {
        frets: [1, 3, 3, 2, 1, 1],
        fingers: [1, 3, 4, 2, 1, 1],
        baseFret: 1,
        barres: [{ fret: 1, fromString: 6, toString: 1 }],
      },
      difficulty: 'intermediate',
      positionName: '1st Position Barre',
    },
    {
      name: 'F',
      position: {
        frets: [-1, -1, 3, 2, 1, 1],
        fingers: [-1, -1, 3, 2, 1, 1],
        baseFret: 1,
      },
      difficulty: 'beginner',
      positionName: 'Simplified',
    },
    {
      name: 'F',
      position: {
        frets: [-1, 8, 10, 10, 10, 8],
        fingers: [-1, 1, 3, 3, 3, 1],
        baseFret: 8,
        barres: [{ fret: 8, fromString: 5, toString: 1 }],
      },
      difficulty: 'intermediate',
      positionName: '8th Position',
    },
  ],

  // G Major voicings
  G: [
    {
      name: 'G',
      position: {
        frets: [3, 2, 0, 0, 0, 3],
        fingers: [2, 1, 0, 0, 0, 3],
        baseFret: 1,
      },
      difficulty: 'beginner',
      positionName: 'Open',
    },
    {
      name: 'G',
      position: {
        frets: [3, 5, 5, 4, 3, 3],
        fingers: [1, 3, 4, 2, 1, 1],
        baseFret: 3,
        barres: [{ fret: 3, fromString: 6, toString: 1 }],
      },
      difficulty: 'intermediate',
      positionName: '3rd Position Barre',
    },
    {
      name: 'G',
      position: {
        frets: [-1, 10, 12, 12, 12, 10],
        fingers: [-1, 1, 3, 3, 3, 1],
        baseFret: 10,
        barres: [{ fret: 10, fromString: 5, toString: 1 }],
      },
      difficulty: 'intermediate',
      positionName: '10th Position',
    },
  ],

  // A Major voicings
  A: [
    {
      name: 'A',
      position: {
        frets: [-1, 0, 2, 2, 2, 0],
        fingers: [-1, 0, 1, 2, 3, 0],
        baseFret: 1,
      },
      difficulty: 'beginner',
      positionName: 'Open',
    },
    {
      name: 'A',
      position: {
        frets: [-1, -1, 7, 6, 5, 5],
        fingers: [-1, -1, 4, 3, 1, 2],
        baseFret: 5,
      },
      difficulty: 'intermediate',
      positionName: '5th Position',
    },
    {
      name: 'A',
      position: {
        frets: [5, 7, 7, 6, 5, 5],
        fingers: [1, 3, 4, 2, 1, 1],
        baseFret: 5,
        barres: [{ fret: 5, fromString: 6, toString: 1 }],
      },
      difficulty: 'intermediate',
      positionName: '5th Position Barre',
    },
  ],

  // B Major voicings
  B: [
    {
      name: 'B',
      position: {
        frets: [-1, 2, 4, 4, 4, 2],
        fingers: [-1, 1, 3, 3, 3, 1],
        baseFret: 2,
        barres: [{ fret: 2, fromString: 5, toString: 1 }],
      },
      difficulty: 'intermediate',
      positionName: '2nd Position Barre',
    },
    {
      name: 'B',
      position: {
        frets: [7, 9, 9, 8, 7, 7],
        fingers: [1, 3, 4, 2, 1, 1],
        baseFret: 7,
        barres: [{ fret: 7, fromString: 6, toString: 1 }],
      },
      difficulty: 'intermediate',
      positionName: '7th Position',
    },
  ],

  // Minor chords
  Am: [
    {
      name: 'Am',
      position: {
        frets: [-1, 0, 2, 2, 1, 0],
        fingers: [-1, 0, 2, 3, 1, 0],
        baseFret: 1,
      },
      difficulty: 'beginner',
      positionName: 'Open',
    },
    {
      name: 'Am',
      position: {
        frets: [5, 7, 7, 5, 5, 5],
        fingers: [1, 3, 4, 1, 1, 1],
        baseFret: 5,
        barres: [{ fret: 5, fromString: 6, toString: 1 }],
      },
      difficulty: 'intermediate',
      positionName: '5th Position Barre',
    },
  ],

  Dm: [
    {
      name: 'Dm',
      position: {
        frets: [-1, -1, 0, 2, 3, 1],
        fingers: [-1, -1, 0, 2, 3, 1],
        baseFret: 1,
      },
      difficulty: 'beginner',
      positionName: 'Open',
    },
    {
      name: 'Dm',
      position: {
        frets: [-1, 5, 7, 7, 6, 5],
        fingers: [-1, 1, 3, 4, 2, 1],
        baseFret: 5,
        barres: [{ fret: 5, fromString: 5, toString: 1 }],
      },
      difficulty: 'intermediate',
      positionName: '5th Position',
    },
  ],

  Em: [
    {
      name: 'Em',
      position: {
        frets: [0, 2, 2, 0, 0, 0],
        fingers: [0, 1, 2, 0, 0, 0],
        baseFret: 1,
      },
      difficulty: 'beginner',
      positionName: 'Open',
    },
    {
      name: 'Em',
      position: {
        frets: [-1, 7, 9, 9, 8, 7],
        fingers: [-1, 1, 3, 4, 2, 1],
        baseFret: 7,
        barres: [{ fret: 7, fromString: 5, toString: 1 }],
      },
      difficulty: 'intermediate',
      positionName: '7th Position',
    },
  ],

  // Seventh chords
  G7: [
    {
      name: 'G7',
      position: {
        frets: [3, 2, 0, 0, 0, 1],
        fingers: [3, 2, 0, 0, 0, 1],
        baseFret: 1,
      },
      difficulty: 'beginner',
      positionName: 'Open',
    },
  ],

  C7: [
    {
      name: 'C7',
      position: {
        frets: [-1, 3, 2, 3, 1, 0],
        fingers: [-1, 3, 2, 4, 1, 0],
        baseFret: 1,
      },
      difficulty: 'beginner',
      positionName: 'Open',
    },
  ],

  D7: [
    {
      name: 'D7',
      position: {
        frets: [-1, -1, 0, 2, 1, 2],
        fingers: [-1, -1, 0, 2, 1, 3],
        baseFret: 1,
      },
      difficulty: 'beginner',
      positionName: 'Open',
    },
  ],

  E7: [
    {
      name: 'E7',
      position: {
        frets: [0, 2, 0, 1, 0, 0],
        fingers: [0, 2, 0, 1, 0, 0],
        baseFret: 1,
      },
      difficulty: 'beginner',
      positionName: 'Open',
    },
  ],

  A7: [
    {
      name: 'A7',
      position: {
        frets: [-1, 0, 2, 0, 2, 0],
        fingers: [-1, 0, 2, 0, 3, 0],
        baseFret: 1,
      },
      difficulty: 'beginner',
      positionName: 'Open',
    },
  ],
};

/**
 * Get chord voicings for a chord name
 * Handles sharps, flats, and common chord variations
 * Falls back to comprehensive guitar chord database if not in static database
 */
export function getChordVoicings(chordName: string): ChordVoicing[] {
  // Import resolver dynamically to avoid circular dependencies
  const { resolveChordVoicings } = require('@/lib/services/chordResolver');

  // Normalize chord name
  const normalized = chordName.trim();

  // Try exact match first in static database
  if (CHORD_DATABASE[normalized]) {
    return CHORD_DATABASE[normalized];
  }

  // Extract root note and quality
  const match = normalized.match(/^([A-G][#b]?)(.*)?$/);
  if (!match) {
    // If can't parse, try resolver as last resort
    return resolveChordVoicings(normalized);
  }

  const [, root, quality = ''] = match;

  // Try with quality
  const withQuality = (root ?? '') + quality;
  if (root && CHORD_DATABASE[withQuality]) {
    return CHORD_DATABASE[withQuality];
  }

  // Try just root (major)
  if (root && CHORD_DATABASE[root]) {
    return CHORD_DATABASE[root];
  }

  // Fallback to comprehensive chord resolver
  return resolveChordVoicings(normalized);
}

/**
 * Get a default voicing for a chord (usually the first/easiest one)
 */
export function getDefaultVoicing(chordName: string): ChordVoicing | null {
  const voicings = getChordVoicings(chordName);
  return voicings.length > 0 ? (voicings[0] ?? null) : null;
}
