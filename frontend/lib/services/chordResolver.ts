import { Chord } from 'tonal';
import guitarChordsDb from '@tombatossals/chords-db/lib/guitar.json' with { type: 'json' };
import { analyzeChord } from '@/lib/music-theory/tonal-helper';
import type { ChordVoicing, ChordPosition } from '@/lib/chordPositions';

/**
 * Chord Resolver Service
 * Bridges Tonal.js music theory with guitar chord fingering database
 * Resolves any chord symbol to playable guitar voicings
 */

// Type for the chords-db library structure
interface ChordsDbPosition {
  frets: number[];
  fingers: number[];
  baseFret: number;
  barres?: number[] | number;
  capo?: boolean;
  midi?: number[];
}

interface ChordsDbChord {
  key: string;
  suffix: string;
  positions: ChordsDbPosition[];
}

/**
 * Map of common chord suffix variations to chords-db suffixes
 * Tonal.js aliases → chords-db suffix format
 */
const SUFFIX_MAP: Record<string, string> = {
  // Major variations (Tonal returns 'M' for major chords)
  '': 'major',
  M: 'major',
  maj: 'major',
  '^': 'major',

  // Minor variations (Tonal returns 'm' for minor)
  m: 'minor',
  min: 'minor',
  '-': 'minor',

  // Diminished
  dim: 'dim',
  '°': 'dim',
  o: 'dim',

  // Augmented
  aug: 'aug',
  '+': 'aug',

  // Suspended
  sus2: 'sus2',
  sus4: 'sus4',
  sus: 'sus4',

  // Seventh chords
  '7': '7',
  dom7: '7',
  maj7: 'maj7',
  M7: 'maj7',
  '^7': 'maj7',
  Δ7: 'maj7',
  m7: 'm7',
  min7: 'm7',
  '-7': 'm7',
  mi7: 'm7',
  dim7: 'dim7',
  o7: 'dim7',
  '°7': 'dim7',
  m7b5: 'm7b5',
  ø: 'm7b5',
  ø7: 'm7b5',

  // Minor-major seventh (Tonal returns 'm/ma7', 'mM7', etc.)
  'm/ma7': 'mmaj7',
  'm/maj7': 'mmaj7',
  mM7: 'mmaj7',
  mMaj7: 'mmaj7',
  'm/M7': 'mmaj7',
  '-Δ7': 'mmaj7',
  mΔ: 'mmaj7',
  '-^7': 'mmaj7',
  '-maj7': 'mmaj7',
  mmaj7: 'mmaj7',

  // Extended chords
  '9': '9',
  '11': '11',
  '13': '13',
  maj9: 'maj9',
  M9: 'maj9',
  '^9': 'maj9',
  m9: 'm9',
  min9: 'm9',
  '-9': 'm9',
  maj11: 'maj11',
  M11: 'maj11',
  m11: 'm11',
  min11: 'm11',
  '-11': 'm11',
  maj13: 'maj13',
  M13: 'maj13',
  m13: 'm13',
  min13: 'm13',

  // Add chords (Tonal returns 'Madd9' for add9)
  add9: 'add9',
  Madd9: 'add9',
  add2: 'add9',
  '2': 'add9',
  madd9: 'madd9',
  madd2: 'madd9',

  // Sixth chords (Tonal returns '6add9' for 69)
  '6': '6',
  m6: 'm6',
  '69': '69',
  '6add9': '69',
  '6/9': '69',
  M69: '69',
  m69: 'm69',

  // Altered chords (Tonal returns '7#5' for aug7)
  '7b5': '7b5',
  '7#5': 'aug7',
  '+7': 'aug7',
  '7+': 'aug7',
  '7aug': 'aug7',
  aug7: 'aug7',
  '7b9': '7b9',
  '7#9': '7#9',
  '9b5': '9b5',
  aug9: 'aug9',
  '9#11': '9#11',
  alt: 'alt',
  '7sus4': '7sus4',
  '7sus': '7sus4',

  // Power chord
  '5': '5',
};

/**
 * Normalize root note to match chords-db key format
 * C#/Db -> C# or Csharp, etc.
 */
function normalizeRootNote(root: string): string | null {
  const enharmonicMap: Record<string, string> = {
    C: 'C',
    'C#': 'Csharp',
    Db: 'Csharp',
    D: 'D',
    'D#': 'Eb',
    Eb: 'Eb',
    E: 'E',
    F: 'F',
    'F#': 'Fsharp',
    Gb: 'Fsharp',
    G: 'G',
    'G#': 'Ab',
    Ab: 'Ab',
    A: 'A',
    'A#': 'Bb',
    Bb: 'Bb',
    B: 'B',
  };

  return enharmonicMap[root] || null;
}

/**
 * Convert chords-db position to our ChordPosition format
 */
function convertPosition(dbPosition: ChordsDbPosition): ChordPosition {
  // Convert barres format
  let barres: ChordPosition['barres'] = undefined;

  if (dbPosition.barres !== undefined) {
    const barresValue = Array.isArray(dbPosition.barres) ? dbPosition.barres[0] : dbPosition.barres;

    if (typeof barresValue === 'number') {
      // Find which strings are barred at this fret
      const barredFret = barresValue;
      const stringIndices: number[] = [];

      dbPosition.frets.forEach((fret, index) => {
        if (fret === barredFret) {
          stringIndices.push(index);
        }
      });

      if (stringIndices.length >= 2) {
        barres = [
          {
            fret: barredFret,
            fromString: Math.max(...stringIndices), // High string number (low E)
            toString: Math.min(...stringIndices), // Low string number (high e)
          },
        ];
      }
    }
  }

  return {
    frets: dbPosition.frets,
    fingers: dbPosition.fingers,
    baseFret: dbPosition.baseFret,
    barres,
  };
}

/**
 * Determine difficulty level based on chord characteristics
 */
function determineDifficulty(
  position: ChordPosition,
  suffix: string
): 'beginner' | 'intermediate' | 'advanced' {
  const hasBarres = position.barres && position.barres.length > 0;
  const baseFretHigh = position.baseFret > 5;
  const mutedStrings = position.frets.filter(f => f === -1).length;
  const isExtended = ['9', '11', '13', 'maj9', 'maj11', 'maj13', 'm9', 'm11'].some(s =>
    suffix.includes(s)
  );
  const isAltered = ['b5', '#5', 'b9', '#9', 'alt', 'aug'].some(s => suffix.includes(s));

  // Beginner: open chords, no barres, low frets
  if (!hasBarres && position.baseFret === 1 && !isExtended && !isAltered) {
    return 'beginner';
  }

  // Advanced: extended chords, altered chords, or high position barres
  if (isExtended || isAltered || (hasBarres && baseFretHigh)) {
    return 'advanced';
  }

  // Intermediate: everything else
  return 'intermediate';
}

/**
 * Determine position name based on characteristics
 */
function getPositionName(position: ChordPosition, index: number): string {
  const hasBarres = position.barres && position.barres.length > 0;

  if (position.baseFret === 1 && !hasBarres) {
    return 'Open';
  }

  if (hasBarres) {
    return `${position.baseFret}${getOrdinalSuffix(position.baseFret)} Position Barre`;
  }

  return `${position.baseFret}${getOrdinalSuffix(position.baseFret)} Position`;
}

function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0] || '';
}

/**
 * Main resolver: Get guitar voicings for any chord name
 */
export function resolveChordVoicings(chordName: string): ChordVoicing[] {
  // Step 1: Use Tonal.js to parse the chord
  const chordInfo = Chord.get(chordName);

  if (!chordInfo.tonic || chordInfo.notes.length === 0) {
    return [];
  }

  const root = chordInfo.tonic;
  const quality = chordInfo.quality || '';
  const chordType = chordInfo.aliases[0] || chordName;

  // Extract suffix from chord type (remove root note)
  let suffix = chordType.replace(root, '').trim();

  // Normalize suffix using our mapping
  const normalizedSuffix = SUFFIX_MAP[suffix] || suffix || 'major';

  // Step 2: Normalize root note for chords-db lookup
  const normalizedRoot = normalizeRootNote(root);

  if (!normalizedRoot) {
    return [];
  }

  // Step 3: Query chords-db
  const chordsData = guitarChordsDb.chords as Record<string, ChordsDbChord[]>;
  const rootChords = chordsData[normalizedRoot];

  if (!rootChords) {
    return [];
  }

  // Find matching chord by suffix
  const matchingChord = rootChords.find(c => c.suffix === normalizedSuffix);

  if (!matchingChord || !matchingChord.positions) {
    return [];
  }

  // Step 4: Convert to our format
  const voicings: ChordVoicing[] = matchingChord.positions.map((dbPos, index) => {
    const position = convertPosition(dbPos);
    const difficulty = determineDifficulty(position, normalizedSuffix);
    const positionName = getPositionName(position, index);

    return {
      name: chordName,
      position,
      difficulty,
      positionName,
    };
  });

  return voicings;
}

/**
 * Get all available suffixes (chord types) from the database
 */
export function getAvailableChordTypes(): string[] {
  return guitarChordsDb.suffixes || [];
}

/**
 * Check if a chord exists in the database
 */
export function chordExists(chordName: string): boolean {
  return resolveChordVoicings(chordName).length > 0;
}
