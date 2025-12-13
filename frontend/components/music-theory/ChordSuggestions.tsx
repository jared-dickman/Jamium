'use client';

import { useEffect, useState } from 'react';
import {
  suggestNextChords,
  detectKey,
  analyzeChord,
  type ChordSuggestion,
} from '@/lib/music-theory/intelligentChordEngine';
import { Sparkles, Play, ChevronRight } from 'lucide-react';

interface ChordSuggestionsProps {
  currentChords: string[];
  onChordSelect?: (chord: string) => void;
  onPlaySuggestion?: (chord: string) => void;
}

export default function ChordSuggestions({
  currentChords,
  onChordSelect,
  onPlaySuggestion,
}: ChordSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<ChordSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentChords || currentChords.length === 0) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      const key = detectKey(currentChords);
      const nextChords = suggestNextChords(currentChords, key);
      setSuggestions(nextChords);
      setLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [currentChords]);

  if (currentChords.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
            <Sparkles className="h-4 w-4 text-amber-400" />
          </div>
          <h3 className="text-[13px] font-semibold tracking-tight text-white/90">AI Suggestions</h3>
        </div>
        <p className="text-[13px] text-white/40">Play chords to see suggestions</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-5">
      <div className="mb-5 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
          <Sparkles className="h-4 w-4 text-amber-400" />
        </div>
        <h3 className="text-[13px] font-semibold tracking-tight text-white/90">AI Suggestions</h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-amber-400" />
        </div>
      ) : suggestions.length === 0 ? (
        <p className="text-[13px] text-white/40">No suggestions for this progression</p>
      ) : (
        <div className="space-y-2">
          {suggestions.slice(0, 3).map((suggestion, i) => {
            const analysis = analyzeChord(suggestion.chord);
            const probabilityPercent = Math.round(suggestion.probability * 100);

            return (
              <div
                key={i}
                className="group relative rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.06] text-[11px] font-semibold text-white/50">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-[18px] font-bold leading-none tracking-tight text-white">
                        {suggestion.chord}
                      </p>
                      <p className="mt-0.5 text-[11px] font-medium capitalize text-white/40">
                        {suggestion.function}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {onPlaySuggestion && (
                      <button
                        onClick={() => onPlaySuggestion(suggestion.chord)}
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.06] text-white/50 transition-all hover:bg-white/[0.12] hover:text-white"
                      >
                        <Play className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {onChordSelect && (
                      <button
                        onClick={() => onChordSelect(suggestion.chord)}
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.06] text-white/50 transition-all hover:bg-white/[0.12] hover:text-white"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="mr-4 flex-1">
                    <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500/80 to-amber-400/60 transition-all"
                        style={{ width: `${probabilityPercent}%` }}
                      />
                    </div>
                  </div>
                  <span className="tabular-nums text-[11px] font-semibold text-white/50">
                    {probabilityPercent}%
                  </span>
                </div>

                <p className="mt-2 text-[12px] leading-relaxed text-white/50">
                  {suggestion.reason}
                </p>

                {analysis && (
                  <div className="mt-2 flex gap-1">
                    {analysis.notes.map((note, noteIdx) => (
                      <span
                        key={noteIdx}
                        className="flex h-6 w-6 items-center justify-center rounded bg-white/[0.04] text-[10px] font-semibold text-white/60"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-4 text-[11px] leading-relaxed text-white/30">
        Based on music theory and harmonic function
      </p>
    </div>
  );
}
