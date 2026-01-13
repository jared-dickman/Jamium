'use client';

import { useEffect, useState } from 'react';
import {
  analyzeChord,
  detectKey,
  type ChordAnalysis,
  type KeyAnalysis,
} from '@/lib/music-theory/intelligentChordEngine';
import { Music2, Info } from 'lucide-react';

interface ChordProgressionAnalyzerProps {
  chords: string[];
  currentChordIndex?: number;
  songKey?: string;
}

export default function ChordProgressionAnalyzer({
  chords,
  currentChordIndex = 0,
  songKey,
}: ChordProgressionAnalyzerProps) {
  const [keyAnalysis, setKeyAnalysis] = useState<KeyAnalysis | null>(null);
  const [chordAnalyses, setChordAnalyses] = useState<(ChordAnalysis | null)[]>([]);

  useEffect(() => {
    if (!chords || chords.length === 0) return;
    const key = songKey ? detectKey(chords, songKey) : detectKey(chords);
    setKeyAnalysis(key);
    setChordAnalyses(chords.map(chord => analyzeChord(chord)));
  }, [chords, songKey]);

  if (!keyAnalysis) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
      </div>
    );
  }

  const currentChordAnalysis = chordAnalyses[currentChordIndex];

  return (
    <div className="space-y-4">
      {/* Key Analysis */}
      <div className="rounded-xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-5">
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sapphire-500/10">
            <Music2 className="h-4 w-4 text-sapphire-400" />
          </div>
          <h3 className="text-[13px] font-semibold tracking-tight text-white/90">Key Analysis</h3>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-white/40">
              Key
            </p>
            <p className="text-[28px] font-bold leading-none tracking-tight text-white">
              {keyAnalysis.tonic}
              <span className="ml-1 text-[18px] font-medium text-white/60">
                {keyAnalysis.type === 'minor' ? 'Minor' : 'Major'}
              </span>
            </p>
          </div>

          <div>
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-white/40">
              Scale
            </p>
            <p className="font-mono text-[13px] leading-relaxed text-white/70">
              {keyAnalysis.scale.join(' · ')}
            </p>
          </div>

          <div>
            <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-white/40">
              Relative
            </p>
            <p className="text-[15px] font-medium text-white/80">{keyAnalysis.relativeKey}</p>
          </div>

          <div>
            <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-white/40">
              Parallel
            </p>
            <p className="text-[15px] font-medium text-white/80">{keyAnalysis.parallelKey}</p>
          </div>
        </div>
      </div>

      {/* Current Chord */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06]">
            <Info className="h-4 w-4 text-white/50" />
          </div>
          <h3 className="text-[13px] font-semibold tracking-tight text-white/90">Current Chord</h3>
        </div>

        {currentChordAnalysis ? (
          <div className="flex items-start justify-between">
            <div>
              <p className="mb-2 text-[32px] font-bold leading-none tracking-tight text-white">
                {currentChordAnalysis.symbol}
              </p>
              <span className="inline-flex items-center rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] font-medium capitalize text-white/60">
                {currentChordAnalysis.quality}
              </span>
            </div>

            <div className="text-right">
              <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-white/40">
                Notes
              </p>
              <div className="flex justify-end gap-1">
                {currentChordAnalysis.notes.map((note, i) => (
                  <span
                    key={i}
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-sapphire-500/15 text-[12px] font-semibold text-sapphire-300"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-[13px] text-white/40">No chord selected</p>
        )}
      </div>
    </div>
  );
}
