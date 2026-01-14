/**
 * Piano chord voicing system with algorithmic inversion generation
 * Inversions are computed from bass note, not hardcoded labels
 */

import { Chord, Note } from 'tonal';

// MIDI note helper - Middle C (C4) = 60
const NOTE_C4 = 60;

export type InversionType = 'root' | '1st' | '2nd' | '3rd';

export interface PianoChordPosition {
  notes: number[];
  fingerNumbers?: number[];
  hand: 'left' | 'right' | 'both';
  spread: 'close' | 'open' | 'wide';
}

export interface PianoChordVoicing {
  name: string;
  position: PianoChordPosition;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  inversion: InversionType;
  voicingStyle: 'close' | 'open' | 'drop2' | 'shell';
  octave: number;
}

/**
 * Convert note name to MIDI number
 */
function noteToMidi(noteName: string): number {
  return Note.midi(noteName) ?? 60;
}

/**
 * Get pitch class (note without octave) from MIDI
 */
function midiToPitchClass(midi: number): number {
  return ((midi % 12) + 12) % 12;
}

/**
 * Detect inversion based on bass note compared to chord tones
 */
export function detectInversion(bassNote: number, chordName: string): InversionType {
  const chord = Chord.get(chordName);
  if (!chord.notes.length || !chord.tonic) return 'root';

  const bassPitchClass = midiToPitchClass(bassNote);
  const chordPitchClasses = chord.notes.map(n => midiToPitchClass(noteToMidi(n + '4')));

  const bassIndex = chordPitchClasses.findIndex(pc => pc === bassPitchClass);

  switch (bassIndex) {
    case 0:
      return 'root';
    case 1:
      return '1st';
    case 2:
      return '2nd';
    case 3:
      return '3rd';
    default:
      return 'root';
  }
}

/**
 * Get human-readable inversion label
 */
export function getInversionLabel(inversion: InversionType): string {
  switch (inversion) {
    case 'root':
      return 'Root Position';
    case '1st':
      return '1st Inversion';
    case '2nd':
      return '2nd Inversion';
    case '3rd':
      return '3rd Inversion';
  }
}

/**
 * Calculate comfortable fingerings for right hand based on chord shape
 */
function calculateFingers(noteCount: number, spread: 'close' | 'open'): number[] {
  if (spread === 'close') {
    switch (noteCount) {
      case 3:
        return [1, 3, 5];
      case 4:
        return [1, 2, 3, 5];
      case 5:
        return [1, 2, 3, 4, 5];
      default:
        return [1, 3, 5];
    }
  }
  // Open voicing - more spread
  switch (noteCount) {
    case 3:
      return [1, 2, 5];
    case 4:
      return [1, 2, 4, 5];
    default:
      return [1, 3, 5];
  }
}

/**
 * Generate all playable inversions for a chord
 * Playability-first: only generates inversions with comfortable fingerings
 */
export function generateInversions(chordName: string, octave: number = 4): PianoChordVoicing[] {
  const chord = Chord.get(chordName);
  if (!chord.notes.length || !chord.tonic) return [];

  const voicings: PianoChordVoicing[] = [];
  const noteCount = chord.notes.length;
  const baseOctave = octave;

  // Get MIDI notes for root position starting at the given octave
  const rootMidi = noteToMidi(chord.tonic + baseOctave);

  // Generate inversions by rotating which note is in bass
  for (let inv = 0; inv < noteCount; inv++) {
    // Build the chord with rotated bass note
    const midiNotes: number[] = [];
    let currentOctave = baseOctave;

    for (let i = 0; i < noteCount; i++) {
      const noteIndex = (inv + i) % noteCount;
      const note = chord.notes[noteIndex];
      if (!note) continue;

      let midi = noteToMidi(note + currentOctave);

      // Ensure ascending order - if note would be lower than previous, bump octave
      if (midiNotes.length > 0) {
        const lastNote = midiNotes[midiNotes.length - 1];
        while (lastNote !== undefined && midi <= lastNote) {
          currentOctave++;
          midi = noteToMidi(note + currentOctave);
        }
      }

      midiNotes.push(midi);
    }

    // Check playability - max span of 10 semitones for comfortable playing (just over an octave)
    const span = (midiNotes[midiNotes.length - 1] ?? 0) - (midiNotes[0] ?? 0);
    const isPlayable = span <= 14; // About a 9th - manageable for most hands

    if (!isPlayable) continue;

    const spread = span <= 7 ? 'close' : 'open';
    const inversion = detectInversion(midiNotes[0] ?? rootMidi, chordName);

    voicings.push({
      name: chordName,
      position: {
        notes: midiNotes,
        fingerNumbers: calculateFingers(noteCount, spread),
        hand: 'right',
        spread,
      },
      difficulty: inv === 0 ? 'beginner' : inv <= 1 ? 'intermediate' : 'advanced',
      inversion,
      voicingStyle: spread === 'close' ? 'close' : 'open',
      octave: baseOctave,
    });
  }

  return voicings;
}

/**
 * Get piano chord voicings for a chord name
 * Now generates inversions algorithmically
 */
export function getPianoChordVoicings(chordName: string): PianoChordVoicing[] {
  const normalized = chordName.trim();
  if (!normalized) return [];

  // Generate inversions for octave 4 (middle C area)
  const voicings = generateInversions(normalized, 4);

  if (voicings.length > 0) {
    return voicings;
  }

  // Fallback: try parsing the chord differently
  const match = normalized.match(/^([A-G][#b]?)(.*)?$/);
  if (match) {
    const [, root, quality = ''] = match;
    const fullChord = (root ?? '') + quality;
    return generateInversions(fullChord, 4);
  }

  return [];
}

/**
 * Get default piano voicing (root position)
 */
export function getDefaultPianoVoicing(chordName: string): PianoChordVoicing | null {
  const voicings = getPianoChordVoicings(chordName);
  return voicings.length > 0 ? (voicings[0] ?? null) : null;
}

/**
 * Convert MIDI note number to note name
 */
export function midiToNoteName(midi: number): string {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midi / 12) - 1;
  const noteName = noteNames[midi % 12];
  return `${noteName}${octave}`;
}

/**
 * Convert MIDI note to frequency (Hz)
 */
export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}
