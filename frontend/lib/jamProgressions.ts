/**
 * Jam Assistant - Chord Progression Database
 * Organized by vibe/genre with skill-level considerations
 */

export type ChordFunction = 'tonic' | 'subdominant' | 'dominant' | 'passing' | 'borrowed';
export type SkillLevel = 'beginner' | 'intermediate' | 'expert';
export type Vibe =
  | 'pop'
  | 'rock'
  | 'jazz'
  | 'blues'
  | 'folk'
  | 'indie'
  | 'soul'
  | 'country'
  | 'funk'
  | 'latin';

export interface JamChord {
  name: string;
  function: ChordFunction;
  duration?: number; // beats
  optional?: boolean;
}

export interface ChordProgression {
  id: string;
  name: string;
  vibe: Vibe[];
  key: string;
  chords: JamChord[];
  difficulty: SkillLevel;
  description: string;
  examples?: string[]; // Famous songs using this
  bpm: number; // Suggested tempo
}

// Section types for song structure
export type SectionType = 'verse' | 'chorus' | 'bridge' | 'intro' | 'outro' | 'solo';

// Song section extends ChordProgression with section metadata
export interface SongSection extends Omit<ChordProgression, 'examples'> {
  sectionType: SectionType;
  label: string; // "A", "B", "X" or custom
  color?: string;
}

// Lyrics section linked to song sections
export interface LyricsSection {
  id: string;
  type: SectionType;
  content: string;
  linkedSectionLabel?: string;
}

// Full song structure with multiple sections
export interface SongStructure {
  id: string;
  name: string;
  key: string;
  bpm: number;
  sections: Record<string, SongSection>; // keyed by label (A, B, X)
  arrangement: string[]; // ["A", "B", "A", "B", "X", "B"]
  activeSectionLabel: string;
  lyrics?: LyricsSection[];
  ideas?: string[];
  difficulty: SkillLevel;
  vibe: Vibe[];
  createdAt?: string;
  updatedAt?: string;
}

// Helper to create empty song structure
export function createEmptySongStructure(key = 'C', bpm = 120): SongStructure {
  const defaultSection: SongSection = {
    id: 'section-a',
    name: 'Verse',
    sectionType: 'verse',
    label: 'A',
    vibe: ['pop'],
    key,
    chords: [],
    difficulty: 'beginner',
    description: 'Main verse section',
    bpm,
  };

  return {
    id: crypto.randomUUID(),
    name: 'Untitled Song',
    key,
    bpm,
    sections: { A: defaultSection },
    arrangement: ['A'],
    activeSectionLabel: 'A',
    difficulty: 'beginner',
    vibe: ['pop'],
  };
}

// Section label colors
export const SECTION_COLORS: Record<string, string> = {
  A: 'hsl(210, 90%, 60%)', // Blue - Verse
  B: 'hsl(30, 90%, 55%)',  // Orange - Chorus
  X: 'hsl(280, 70%, 60%)', // Purple - Bridge
  C: 'hsl(120, 70%, 50%)', // Green - Other
};

export const PROGRESSIONS: ChordProgression[] = [
  // POP PROGRESSIONS
  {
    id: 'pop-axis',
    name: 'I-V-vi-IV (Pop Axis)',
    vibe: ['pop', 'rock', 'indie'],
    key: 'C',
    chords: [
      { name: 'C', function: 'tonic', duration: 4 },
      { name: 'G', function: 'dominant', duration: 4 },
      { name: 'Am', function: 'subdominant', duration: 4 },
      { name: 'F', function: 'subdominant', duration: 4 },
    ],
    difficulty: 'beginner',
    description: 'The most popular progression in modern music',
    examples: ['Let It Be - Beatles', 'Someone Like You - Adele', 'No Woman No Cry - Bob Marley'],
    bpm: 80,
  },
  {
    id: 'pop-variant',
    name: 'vi-IV-I-V',
    vibe: ['pop', 'indie'],
    key: 'C',
    chords: [
      { name: 'Am', function: 'tonic', duration: 4 },
      { name: 'F', function: 'subdominant', duration: 4 },
      { name: 'C', function: 'tonic', duration: 4 },
      { name: 'G', function: 'dominant', duration: 4 },
    ],
    difficulty: 'beginner',
    description: 'Emotional variant starting on the relative minor',
    examples: ['Grenade - Bruno Mars', 'Apologize - OneRepublic'],
    bpm: 90,
  },

  // ROCK PROGRESSIONS
  {
    id: 'rock-classic',
    name: 'I-bVII-IV (Rock Classic)',
    vibe: ['rock', 'indie'],
    key: 'A',
    chords: [
      { name: 'A', function: 'tonic', duration: 4 },
      { name: 'G', function: 'borrowed', duration: 4 },
      { name: 'D', function: 'subdominant', duration: 4 },
      { name: 'A', function: 'tonic', duration: 4 },
    ],
    difficulty: 'beginner',
    description: 'Powerful rock progression with borrowed bVII chord',
    examples: ['Sweet Home Alabama', "Summer of '69"],
    bpm: 120,
  },
  {
    id: 'rock-power',
    name: 'I-IV-V (Power Chords)',
    vibe: ['rock'],
    key: 'E',
    chords: [
      { name: 'E5', function: 'tonic', duration: 4 },
      { name: 'A5', function: 'subdominant', duration: 4 },
      { name: 'B5', function: 'dominant', duration: 4 },
      { name: 'A5', function: 'subdominant', duration: 4 },
    ],
    difficulty: 'beginner',
    description: 'Classic power chord progression for driving rock',
    examples: ['Wild Thing', 'Louie Louie'],
    bpm: 140,
  },

  // BLUES PROGRESSIONS
  {
    id: 'blues-12bar',
    name: '12-Bar Blues',
    vibe: ['blues', 'rock'],
    key: 'A',
    chords: [
      { name: 'A7', function: 'tonic', duration: 16 },
      { name: 'D7', function: 'subdominant', duration: 8 },
      { name: 'A7', function: 'tonic', duration: 8 },
      { name: 'E7', function: 'dominant', duration: 4 },
      { name: 'D7', function: 'subdominant', duration: 4 },
      { name: 'A7', function: 'tonic', duration: 4 },
      { name: 'E7', function: 'dominant', duration: 4 },
    ],
    difficulty: 'intermediate',
    description: 'The foundation of blues music',
    examples: ['Sweet Home Chicago', 'The Thrill Is Gone'],
    bpm: 90,
  },
  {
    id: 'blues-minor',
    name: 'Minor Blues',
    vibe: ['blues', 'jazz'],
    key: 'Am',
    chords: [
      { name: 'Am7', function: 'tonic', duration: 16 },
      { name: 'Dm7', function: 'subdominant', duration: 8 },
      { name: 'Am7', function: 'tonic', duration: 8 },
      { name: 'E7', function: 'dominant', duration: 8 },
      { name: 'Am7', function: 'tonic', duration: 8 },
    ],
    difficulty: 'intermediate',
    description: 'Soulful minor blues progression',
    examples: ['Black Magic Woman', 'All Along the Watchtower'],
    bpm: 85,
  },

  // JAZZ PROGRESSIONS
  {
    id: 'jazz-251',
    name: 'ii-V-I (Jazz Turnaround)',
    vibe: ['jazz', 'soul'],
    key: 'C',
    chords: [
      { name: 'Dm7', function: 'subdominant', duration: 4 },
      { name: 'G7', function: 'dominant', duration: 4 },
      { name: 'Cmaj7', function: 'tonic', duration: 8 },
    ],
    difficulty: 'intermediate',
    description: 'The most important progression in jazz',
    examples: ['Autumn Leaves', 'All The Things You Are'],
    bpm: 120,
  },
  {
    id: 'jazz-rhythm-changes',
    name: 'Rhythm Changes (A Section)',
    vibe: ['jazz'],
    key: 'Bb',
    chords: [
      { name: 'Bbmaj7', function: 'tonic', duration: 4 },
      { name: 'G7', function: 'dominant', duration: 4 },
      { name: 'Cm7', function: 'subdominant', duration: 4 },
      { name: 'F7', function: 'dominant', duration: 4 },
      { name: 'Bbmaj7', function: 'tonic', duration: 4 },
      { name: 'G7', function: 'dominant', duration: 4 },
      { name: 'Cm7', function: 'subdominant', duration: 4 },
      { name: 'F7', function: 'dominant', duration: 4 },
    ],
    difficulty: 'expert',
    description: 'Based on "I Got Rhythm" - cornerstone of bebop',
    examples: ['Anthropology', 'Oleo'],
    bpm: 160,
  },

  // FOLK PROGRESSIONS
  {
    id: 'folk-simple',
    name: 'I-IV-V (Folk Standard)',
    vibe: ['folk', 'country'],
    key: 'G',
    chords: [
      { name: 'G', function: 'tonic', duration: 4 },
      { name: 'C', function: 'subdominant', duration: 4 },
      { name: 'D', function: 'dominant', duration: 4 },
      { name: 'G', function: 'tonic', duration: 4 },
    ],
    difficulty: 'beginner',
    description: 'Simple and timeless folk progression',
    examples: ['This Land Is Your Land', "Blowin' in the Wind"],
    bpm: 100,
  },
  {
    id: 'folk-emotional',
    name: 'I-V-vi-iii-IV-I-IV-V',
    vibe: ['folk', 'indie'],
    key: 'C',
    chords: [
      { name: 'C', function: 'tonic', duration: 4 },
      { name: 'G', function: 'dominant', duration: 4 },
      { name: 'Am', function: 'subdominant', duration: 4 },
      { name: 'Em', function: 'passing', duration: 4 },
      { name: 'F', function: 'subdominant', duration: 4 },
      { name: 'C', function: 'tonic', duration: 4 },
      { name: 'F', function: 'subdominant', duration: 4 },
      { name: 'G', function: 'dominant', duration: 4 },
    ],
    difficulty: 'intermediate',
    description: 'Flowing progression for emotional storytelling',
    examples: ['Hallelujah - Leonard Cohen'],
    bpm: 70,
  },

  // SOUL/FUNK PROGRESSIONS
  {
    id: 'soul-classic',
    name: 'I-IV-I-V (Soul Groove)',
    vibe: ['soul', 'funk'],
    key: 'E',
    chords: [
      { name: 'E7', function: 'tonic', duration: 8 },
      { name: 'A7', function: 'subdominant', duration: 4 },
      { name: 'E7', function: 'tonic', duration: 4 },
      { name: 'B7', function: 'dominant', duration: 4 },
      { name: 'E7', function: 'tonic', duration: 4 },
    ],
    difficulty: 'intermediate',
    description: 'Groovy soul progression with dominant 7th flavor',
    examples: ['Superstition', 'Use Me - Bill Withers'],
    bpm: 95,
  },
  {
    id: 'funk-vamp',
    name: 'i-iv (Funk Vamp)',
    vibe: ['funk', 'soul'],
    key: 'Em',
    chords: [
      { name: 'Em7', function: 'tonic', duration: 8 },
      { name: 'Am7', function: 'subdominant', duration: 8 },
    ],
    difficulty: 'beginner',
    description: 'Hypnotic two-chord funk groove',
    examples: ['Chameleon - Herbie Hancock', 'Cissy Strut'],
    bpm: 100,
  },

  // INDIE PROGRESSIONS
  {
    id: 'indie-melancholy',
    name: 'I-V-IV-IV',
    vibe: ['indie', 'rock'],
    key: 'D',
    chords: [
      { name: 'D', function: 'tonic', duration: 4 },
      { name: 'A', function: 'dominant', duration: 4 },
      { name: 'G', function: 'subdominant', duration: 8 },
    ],
    difficulty: 'beginner',
    description: 'Bittersweet indie rock staple',
    examples: ['Wonderwall - Oasis', 'High and Dry - Radiohead'],
    bpm: 88,
  },

  // LATIN PROGRESSIONS
  {
    id: 'latin-bossa',
    name: 'Bossa Nova Changes',
    vibe: ['latin', 'jazz'],
    key: 'Dm',
    chords: [
      { name: 'Dm7', function: 'tonic', duration: 8 },
      { name: 'G7', function: 'subdominant', duration: 4 },
      { name: 'Cmaj7', function: 'borrowed', duration: 4 },
      { name: 'Fmaj7', function: 'passing', duration: 4 },
      { name: 'Bm7b5', function: 'subdominant', duration: 4 },
      { name: 'E7', function: 'dominant', duration: 4 },
      { name: 'Am7', function: 'subdominant', duration: 4 },
    ],
    difficulty: 'expert',
    description: 'Sophisticated bossa nova progression',
    examples: ['Girl from Ipanema', 'Corcovado'],
    bpm: 130,
  },
];

/**
 * Get progressions filtered by vibe
 */
export function getProgressionsByVibe(vibe: Vibe, skillLevel?: SkillLevel): ChordProgression[] {
  let filtered = PROGRESSIONS.filter(p => p.vibe.includes(vibe));

  if (skillLevel) {
    const skillOrder: SkillLevel[] = ['beginner', 'intermediate', 'expert'];
    const maxLevel = skillOrder.indexOf(skillLevel);
    filtered = filtered.filter(p => skillOrder.indexOf(p.difficulty) <= maxLevel);
  }

  return filtered;
}

/**
 * Get recommended next chords based on current chord and key
 */
export function getNextChordSuggestions(currentChord: string, _key: string, _vibe: Vibe): string[] {
  // Common chord transitions based on function
  const transitions: Record<string, string[]> = {
    // Tonic chords often go to subdominant or dominant
    C: ['F', 'G', 'Am', 'Dm', 'Em'],
    G: ['C', 'D', 'Em', 'Am', 'Bm'],
    D: ['G', 'A', 'Bm', 'Em', 'F#m'],
    A: ['D', 'E', 'F#m', 'Bm', 'C#m'],
    E: ['A', 'B', 'C#m', 'F#m', 'G#m'],

    // Minor tonics
    Am: ['F', 'G', 'C', 'Dm', 'Em'],
    Em: ['C', 'D', 'G', 'Am', 'Bm'],
    Dm: ['F', 'C', 'Bb', 'Am', 'Gm'],

    // Dominant 7ths resolve to tonic
    G7: ['C', 'Cmaj7'],
    D7: ['G', 'Gmaj7'],
    A7: ['D', 'Dmaj7'],
    E7: ['A', 'Amaj7'],
    B7: ['E', 'Emaj7'],
  };

  return transitions[currentChord] || [];
}

/**
 * Chord function colors for UI
 */
export const FUNCTION_COLORS: Record<ChordFunction, string> = {
  tonic: 'hsl(210, 90%, 60%)', // Blue - home/stable
  subdominant: 'hsl(120, 70%, 50%)', // Green - movement
  dominant: 'hsl(30, 90%, 55%)', // Orange - tension
  passing: 'hsl(280, 70%, 60%)', // Purple - transition
  borrowed: 'hsl(350, 80%, 60%)', // Red - outside
};

/**
 * Vibe descriptions and emoji
 */
export const VIBE_INFO: Record<Vibe, { emoji: string; description: string }> = {
  pop: { emoji: '🎵', description: 'Catchy, accessible, radio-friendly' },
  rock: { emoji: '🎸', description: 'Powerful, energetic, guitar-driven' },
  jazz: { emoji: '🎺', description: 'Sophisticated, complex, improvisational' },
  blues: { emoji: '🎷', description: 'Soulful, expressive, 12-bar based' },
  folk: { emoji: '🪕', description: 'Simple, storytelling, acoustic' },
  indie: { emoji: '🎧', description: 'Creative, emotional, alternative' },
  soul: { emoji: '✨', description: 'Groovy, emotional, R&B influenced' },
  country: { emoji: '🤠', description: 'Heartfelt, twangy, narrative' },
  funk: { emoji: '🕺', description: 'Syncopated, rhythmic, danceable' },
  latin: { emoji: '💃', description: 'Rhythmic, passionate, syncopated' },
};

/**
 * Suggested song extracted from progression examples
 */
export interface SuggestedSong {
  title: string;
  artist: string;
  progressionId: string;
  progressionName: string;
  chords: JamChord[];
  difficulty: SkillLevel;
  vibe: Vibe[];
  bpm: number;
  key: string;
}

/**
 * Parse "Song Title - Artist" format from examples
 */
function parseSongExample(example: string): { title: string; artist: string } | null {
  const parts = example.split(' - ');
  if (parts.length === 2 && parts[0] && parts[1]) {
    return { title: parts[0].trim(), artist: parts[1].trim() };
  }
  // Handle reversed format "Artist - Song"
  if (parts.length === 2 && parts[1] && parts[0]) {
    // Heuristic: if first part looks like a band name (contains "The", single word, etc.)
    const firstPart = parts[0].trim();
    const secondPart = parts[1].trim();
    if (firstPart.startsWith('The ') || !firstPart.includes(' ')) {
      return { title: secondPart, artist: firstPart };
    }
    return { title: firstPart, artist: secondPart };
  }
  return null;
}

/**
 * Extract suggested songs from all progressions with examples
 */
export function extractSuggestedSongs(skillLevel?: SkillLevel): SuggestedSong[] {
  const songs: SuggestedSong[] = [];

  for (const progression of PROGRESSIONS) {
    if (!progression.examples) continue;

    // Filter by skill level if provided
    if (skillLevel) {
      const skillOrder: SkillLevel[] = ['beginner', 'intermediate', 'expert'];
      const maxLevel = skillOrder.indexOf(skillLevel);
      if (skillOrder.indexOf(progression.difficulty) > maxLevel) continue;
    }

    for (const example of progression.examples) {
      const parsed = parseSongExample(example);
      if (!parsed) continue;

      songs.push({
        title: parsed.title,
        artist: parsed.artist,
        progressionId: progression.id,
        progressionName: progression.name,
        chords: progression.chords,
        difficulty: progression.difficulty,
        vibe: progression.vibe,
        bpm: progression.bpm,
        key: progression.key,
      });
    }
  }

  return songs;
}
