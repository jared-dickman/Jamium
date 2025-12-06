import { MessageSquare, FileText, Music, Play, Sliders, Repeat, Sparkles } from 'lucide-react';

/**
 * Help content for Songwriter component
 */
export const SONGWRITER_HELP = {
  title: 'Songwriter Assistant Guide',
  sections: [
    {
      title: 'AI Chat Panel',
      icon: <MessageSquare className="w-4 h-4" />,
      content: (
        <>
          <p className="mb-2">Your AI songwriting partner. Ask for help with:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Lyric ideas and rhyme suggestions</li>
            <li>Chord progression recommendations</li>
            <li>Song structure advice (verse, chorus, bridge)</li>
            <li>Theme and mood development</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Lyrics Editor',
      icon: <FileText className="w-4 h-4" />,
      content: (
        <>
          <p className="mb-2">Write and refine your lyrics with real-time analysis:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Automatic syllable counting</li>
            <li>Rhyme scheme detection</li>
            <li>Structure organization (verses, chorus, etc.)</li>
            <li>Click suggested lyrics from the AI to insert them</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Chord Builder',
      icon: <Music className="w-4 h-4" />,
      content: (
        <>
          <p className="mb-2">Build chord progressions that match your lyrics:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Add chords with timing information</li>
            <li>Visual chord diagrams for guitar/piano</li>
            <li>AI-suggested chord progressions</li>
            <li>Sync chords with lyric sections</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Resizable Panels',
      icon: <Sliders className="w-4 h-4" />,
      content: (
        <p>
          Drag the dividers between panels to adjust their size. Your layout preferences are
          automatically saved for future sessions.
        </p>
      ),
    },
  ],
};

/**
 * Help content for Jam Assistant component
 */
export const JAM_HELP = {
  title: 'Jam Assistant Guide',
  sections: [
    {
      title: 'Playback Controls',
      icon: <Play className="w-4 h-4" />,
      content: (
        <>
          <p className="mb-2">Control your jam session:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              <strong>Play/Pause:</strong> Start or stop the progression
            </li>
            <li>
              <strong>Reset:</strong> Return to the first chord
            </li>
            <li>
              <strong>Mute:</strong> Silence audio while keeping the visual progression
            </li>
            <li>
              <strong>Loop Counter:</strong> Tracks how many times you've played through
            </li>
          </ul>
        </>
      ),
    },
    {
      title: 'Tempo & Key',
      icon: <Sliders className="w-4 h-4" />,
      content: (
        <>
          <p className="mb-2">Customize the feel:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              <strong>BPM (40-200):</strong> Adjust tempo to match your comfort level
            </li>
            <li>
              <strong>Transpose:</strong> Move the entire progression up or down by semitones
            </li>
            <li>Slower tempos are great for learning, faster for performance practice</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Building Progressions',
      icon: <Music className="w-4 h-4" />,
      content: (
        <>
          <p className="mb-2">Create your chord sequence:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              <strong>Add Chord:</strong> Adds a musically-suggested next chord
            </li>
            <li>
              <strong>Edit:</strong> Click the edit icon to choose a different chord
            </li>
            <li>
              <strong>Duration:</strong> Set how many beats each chord lasts
            </li>
            <li>
              <strong>Delete:</strong> Remove chords you don't need (must keep at least one)
            </li>
            <li>Click any chord card to jump to it instantly</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Chord Functions',
      icon: <Sparkles className="w-4 h-4" />,
      content: (
        <>
          <p className="mb-2">Each chord has a harmonic function:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              <strong>Tonic:</strong> Home base, feels resolved
            </li>
            <li>
              <strong>Subdominant:</strong> Moves away from home
            </li>
            <li>
              <strong>Dominant:</strong> Creates tension, wants to resolve
            </li>
            <li>
              <strong>Pre-dominant:</strong> Leads naturally to dominant
            </li>
          </ul>
          <p className="mt-2 text-xs">Color-coded cards help you see the harmonic journey!</p>
        </>
      ),
    },
    {
      title: 'Practice Tips',
      icon: <Repeat className="w-4 h-4" />,
      content: (
        <>
          <ul className="list-disc pl-4 space-y-1">
            <li>Start slow (60-80 BPM) to build muscle memory</li>
            <li>Use longer chord durations (8+ beats) when learning</li>
            <li>Watch the loop counter to track your practice sessions</li>
            <li>Try both guitar and piano views to understand voicings</li>
            <li>Transpose to find your comfortable singing key</li>
          </ul>
        </>
      ),
    },
  ],
};

/**
 * Quick tips for first-time users
 */
export const QUICK_TIPS = {
  jam: [
    'Click "Add Chord" to build your first progression',
    'Start with a slower BPM (60-80) when learning',
    'Each chord card shows its harmonic function by color',
    'Click any chord to jump to it during playback',
  ],
};
