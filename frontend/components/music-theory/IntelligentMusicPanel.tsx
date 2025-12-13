'use client';

import { useState } from 'react';
import ChordWheel from '@/components/music-theory/ChordWheel';
import ChordProgressionAnalyzer from '@/components/music-theory/ChordProgressionAnalyzer';
import ChordSuggestions from '@/components/music-theory/ChordSuggestions';
import { suggestNextChords, detectKey } from '@/lib/music-theory/intelligentChordEngine';
import { Disc3, Eye, EyeOff } from 'lucide-react';

interface IntelligentMusicPanelProps {
  chords: string[];
  currentChordIndex: number;
  songKey?: string;
  onChordClick?: (chord: string) => void;
  onPlayChord?: (chord: string) => void;
}

export default function IntelligentMusicPanel({
  chords,
  currentChordIndex,
  songKey,
  onChordClick,
  onPlayChord,
}: IntelligentMusicPanelProps) {
  const [showWheel, setShowWheel] = useState(true);

  const currentChord = chords[currentChordIndex];
  const key = songKey ? detectKey(chords, songKey) : detectKey(chords);
  const suggestions = key ? suggestNextChords(chords, key) : [];
  const suggestedChords = suggestions.map(s => s.chord);

  return (
    <div className="mt-8 space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sapphire-500/20 to-sapphire-600/10 ring-1 ring-white/[0.08]">
            <Disc3 className="h-[18px] w-[18px] text-sapphire-400" />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight text-white">Music Theory</h2>
            <p className="text-[12px] text-white/40">Harmonic analysis & suggestions</p>
          </div>
        </div>

        <button
          onClick={() => setShowWheel(!showWheel)}
          className="flex h-8 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 text-[12px] font-medium text-white/60 transition-all hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-white/80"
        >
          {showWheel ? (
            <>
              <EyeOff className="h-3.5 w-3.5" />
              Hide Circle
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5" />
              Show Circle
            </>
          )}
        </button>
      </div>

      {/* Circle of Fifths */}
      {showWheel && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="flex justify-center">
            <ChordWheel
              currentChord={currentChord}
              suggestedChords={suggestedChords}
              onChordClick={onPlayChord}
              width={500}
              height={500}
            />
          </div>
          <div className="mt-4 flex items-center justify-center gap-6 text-[11px] text-white/40">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400/80" />
              Current
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
              Suggested
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-sapphire-400/80" />
              Major
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-violet-400/80" />
              Minor
            </span>
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChordProgressionAnalyzer
          chords={chords}
          currentChordIndex={currentChordIndex}
          songKey={songKey}
        />
        <ChordSuggestions
          currentChords={chords.slice(0, currentChordIndex + 1)}
          onChordSelect={onChordClick}
          onPlaySuggestion={onPlayChord}
        />
      </div>
    </div>
  );
}
