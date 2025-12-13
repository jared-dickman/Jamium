import { logger } from '@/lib/logger';
/**
 * 🎸 INTELLIGENT CHORD ENGINE
 * Powered by Tonal.js for music theory intelligence
 *
 * Features:
 * - Chord analysis and decomposition
 * - Smart chord progression suggestions
 * - Key detection and harmony analysis
 * - Auto-harmonization capabilities
 * - Music theory-based next chord predictions
 */

import { Chord, Key, Note, Interval, Scale } from 'tonal';

export interface ChordAnalysis {
  symbol: string;
  notes: string[];
  intervals: string[];
  root: string;
  type: string;
  quality: 'major' | 'minor' | 'diminished' | 'augmented' | 'dominant' | 'other';
  tonic?: string;
  aliases: string[];
}

export interface KeyAnalysis {
  tonic: string;
  type: 'major' | 'minor';
  scale: string[];
  chords: string[];
  relativeKey: string;
  parallelKey: string;
  dominantKey: string;
  subdominantKey: string;
}

export interface ChordSuggestion {
  chord: string;
  probability: number;
  reason: string;
  function: 'tonic' | 'subdominant' | 'dominant' | 'mediant' | 'submediant' | 'leading';
}

/**
 * Analyze a chord and return comprehensive music theory information
 */
export function analyzeChord(chordSymbol: string): ChordAnalysis | null {
  try {
    const chord = Chord.get(chordSymbol);

    if (!chord.notes || chord.notes.length === 0) {
      return null;
    }

    // Determine quality
    let quality: ChordAnalysis['quality'] = 'other';
    const chordType = chord.type.toLowerCase();

    if (chordType.includes('major') || chordType === 'M') {
      quality = 'major';
    } else if (chordType.includes('minor') || chordType === 'm') {
      quality = 'minor';
    } else if (chordType.includes('dim')) {
      quality = 'diminished';
    } else if (chordType.includes('aug')) {
      quality = 'augmented';
    } else if (chordType.includes('7') && !chordType.includes('maj7')) {
      quality = 'dominant';
    }

    return {
      symbol: chord.symbol,
      notes: chord.notes,
      intervals: chord.intervals,
      root: chord.tonic || '',
      type: chord.type,
      quality,
      tonic: chord.tonic || undefined,
      aliases: chord.aliases,
    };
  } catch (error) {
    logger.error('Error analyzing chord:', error);
    return null;
  }
}

/**
 * Detect the most likely key from a chord progression
 * @param hintKey - Optional key hint (e.g., 'C' or 'Am') to use directly
 */
export function detectKey(chordSymbols: string[], hintKey?: string): KeyAnalysis | null {
  try {
    // If hint provided, use it directly
    if (hintKey) {
      const isMinor = hintKey.endsWith('m');
      const tonic = isMinor ? hintKey.replace('m', '') : hintKey;
      const keyData = isMinor ? Key.minorKey(tonic) : Key.majorKey(tonic);
      const scale = isMinor ? Scale.get(`${tonic} minor`) : Scale.get(`${tonic} major`);
      const keyChords = 'chords' in keyData ? Array.from(keyData.chords) : [];

      return {
        tonic,
        type: isMinor ? 'minor' : 'major',
        scale: Array.from(scale.notes),
        chords: keyChords,
        relativeKey: isMinor ? Note.transpose(tonic, '3m') : Note.transpose(tonic, '-3m') + 'm',
        parallelKey: isMinor ? tonic : tonic + 'm',
        dominantKey: Note.transpose(tonic, '5P'),
        subdominantKey: Note.transpose(tonic, '4P'),
      };
    }

    // Get all possible keys
    const majorKeys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
    const minorKeys = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'Bbm', 'Fm', 'Cm', 'Gm', 'Dm'];

    let bestKey: string | null = null;
    let bestScore = 0;

    // Score each key based on how many chords fit
    [...majorKeys, ...minorKeys].forEach(keyTonic => {
      const keyData = keyTonic.endsWith('m')
        ? Key.minorKey(keyTonic.replace('m', ''))
        : Key.majorKey(keyTonic);

      let score = 0;
      chordSymbols.forEach(chordSymbol => {
        // Normalize chord symbol for comparison
        const normalizedChord = chordSymbol.replace(/\s+/g, '');
        const keyChords = 'chords' in keyData ? keyData.chords : [];
        if (
          keyChords.some((keyChord: string) => {
            const normalizedKeyChord = keyChord.replace(/\s+/g, '');
            if (normalizedKeyChord === normalizedChord) {
              return true;
            }
            const chordRoot = keyChord.split(/[^A-G#b]/)[0];
            return chordRoot ? normalizedChord.startsWith(chordRoot) : false;
          })
        ) {
          score++;
        }
      });

      if (score > bestScore) {
        bestScore = score;
        bestKey = keyTonic;
      }
    });

    if (!bestKey) {
      return null;
    }

    // Get full key analysis
    const resolvedKey = bestKey as string;
    const isMinor = resolvedKey.endsWith('m');
    const tonic = isMinor ? resolvedKey.replace('m', '') : resolvedKey;
    const keyData = isMinor ? Key.minorKey(tonic) : Key.majorKey(tonic);
    const scale = isMinor ? Scale.get(`${tonic} minor`) : Scale.get(`${tonic} major`);

    const keyChords = 'chords' in keyData ? Array.from(keyData.chords) : [];

    return {
      tonic,
      type: isMinor ? 'minor' : 'major',
      scale: Array.from(scale.notes),
      chords: keyChords,
      relativeKey: isMinor
        ? Note.transpose(tonic, '3m') // Relative major
        : Note.transpose(tonic, '-3m') + 'm', // Relative minor
      parallelKey: isMinor ? tonic : tonic + 'm',
      dominantKey: Note.transpose(tonic, '5P'),
      subdominantKey: Note.transpose(tonic, '4P'),
    };
  } catch (error) {
    logger.error('Error detecting key:', error);
    return null;
  }
}

/**
 * Suggest next chords based on music theory and common progressions
 */
export function suggestNextChords(
  currentChords: string[],
  keyAnalysis?: KeyAnalysis | null
): ChordSuggestion[] {
  const suggestions: ChordSuggestion[] = [];

  if (!currentChords || currentChords.length === 0) {
    return suggestions;
  }

  const lastChord = currentChords[currentChords.length - 1];
  if (!lastChord) {
    return suggestions;
  }

  const key = keyAnalysis || detectKey(currentChords);
  if (!key) {
    return suggestions;
  }

  const lastChordAnalysis = analyzeChord(lastChord);
  if (!lastChordAnalysis || !lastChordAnalysis.root) {
    return suggestions;
  }

  // Common chord progressions in music theory
  const progressionRules = [
    // Tonic (I) can go anywhere
    { from: 0, to: [3, 4, 5], weight: 0.8, function: 'subdominant' as const },
    // Subdominant (IV) often goes to V or I
    { from: 3, to: [4, 0], weight: 0.9, function: 'dominant' as const },
    // Dominant (V) resolves to I
    { from: 4, to: [0], weight: 0.95, function: 'tonic' as const },
    // Minor vi can go to IV or V
    { from: 5, to: [3, 4], weight: 0.7, function: 'subdominant' as const },
    // Minor ii goes to V
    { from: 1, to: [4], weight: 0.85, function: 'dominant' as const },
  ];

  // Find position of last chord in key
  const lastChordNormalized = lastChord.replace(/\s+/g, '');
  const lastChordIndex = key.chords.findIndex(c => {
    const normalizedKeyChord = c.replace(/\s+/g, '');
    if (normalizedKeyChord === lastChordNormalized) {
      return true;
    }
    const chordRoot = c.split(/[^A-G#b]/)[0];
    return chordRoot ? lastChordNormalized.startsWith(chordRoot) : false;
  });

  if (lastChordIndex !== -1) {
    progressionRules.forEach(rule => {
      if (rule.from === lastChordIndex) {
        rule.to.forEach(targetIndex => {
          const targetChord = key.chords[targetIndex];
          if (targetChord) {
            suggestions.push({
              chord: targetChord,
              probability: rule.weight,
              reason: `Strong ${rule.function} resolution`,
              function: rule.function,
            });
          }
        });
      }
    });
  }

  // Add common jazz substitutions
  if (lastChordAnalysis.quality === 'dominant') {
    const tritoneRoot = Note.transpose(lastChordAnalysis.root, '3A');
    suggestions.push({
      chord: tritoneRoot + '7',
      probability: 0.6,
      reason: 'Tritone substitution',
      function: 'dominant',
    });
  }

  // Sort by probability
  suggestions.sort((a, b) => b.probability - a.probability);

  return suggestions.slice(0, 5); // Return top 5
}

/**
 * Generate a bass line from chord progression
 */
export function generateBassLine(
  chords: string[],
  style: 'root' | 'walking' | 'alternating' = 'root'
): string[] {
  const bassNotes: string[] = [];

  chords.forEach((chordSymbol, index) => {
    const chord = analyzeChord(chordSymbol);
    if (!chord) return;

    const root = chord.root;
    if (!root) {
      return;
    }

    switch (style) {
      case 'root':
        bassNotes.push(root + '2');
        break;

      case 'alternating':
        bassNotes.push(root + '2');
        const fifth = Note.transpose(root, '5P');
        bassNotes.push(fifth + '2');
        break;

      case 'walking':
        bassNotes.push(root + '2');
        const third = Note.transpose(root, chord.quality === 'minor' ? '3m' : '3M');
        bassNotes.push(third + '2');
        const fifth2 = Note.transpose(root, '5P');
        bassNotes.push(fifth2 + '2');

        // Connect to next chord
        if (index < chords.length - 1) {
          const nextSymbol = chords[index + 1];
          if (!nextSymbol) {
            break;
          }
          const nextChord = analyzeChord(nextSymbol);
          if (nextChord) {
            const nextRoot = nextChord.root;
            if (nextRoot) {
              const connectingNote = Note.transpose(nextRoot, '-2M');
              bassNotes.push(connectingNote + '2');
            }
          }
        }
        break;
    }
  });

  return bassNotes;
}

/**
 * Transpose an entire chord progression
 */
export function transposeProgression(chords: string[], semitones: number): string[] {
  return chords.map(chordSymbol => {
    const chord = analyzeChord(chordSymbol);
    if (!chord) return chordSymbol;

    const newRoot = Note.transpose(chord.root, Interval.fromSemitones(semitones));
    return newRoot + chord.type;
  });
}

/**
 * Get circle of fifths position (0-11, where 0 is C)
 */
export function getCircleOfFifthsPosition(note: string): number {
  const circleOrder = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
  const normalized = Note.get(note).pc; // Pitch class
  return circleOrder.findIndex(n => Note.get(n).pc === normalized);
}

/**
 * Get chord color based on quality for visualization
 */
export function getChordColor(quality: ChordAnalysis['quality']): string {
  // Note: These return hex values for dynamic usage in canvas/SVG contexts
  // where CSS variables may not be available
  const colors = {
    major:
      getComputedStyle(document.documentElement).getPropertyValue('--sapphire-500').trim() ||
      '#3B82F6', // Blue
    minor: '#8B5CF6', // Purple
    dominant: '#F59E0B', // Amber
    diminished: '#EF4444', // Red
    augmented: '#10B981', // Green
    other: '#6B7280', // Gray
  };
  return colors[quality];
}
