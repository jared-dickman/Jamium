'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

import { useIntelligentComposer } from '@/lib/hooks/useIntelligentComposer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ANIMATION_DURATION, FADE_VARIANTS } from '@/lib/constants/animation.constants';

const KEYS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'] as const;
const GENRES = ['pop', 'jazz', 'rock', 'blues'] as const;
const TEMPO_PRESETS = [
  { label: 'Slow', bpm: 70 },
  { label: 'Medium', bpm: 100 },
  { label: 'Fast', bpm: 130 },
];

export function ExpertComposer(): React.JSX.Element {
  const [state, controls] = useIntelligentComposer();
  const [inputChord, setInputChord] = useState('');
  const [tempo, setTempo] = useState(100);

  const handleAddChord = async (): Promise<void> => {
    if (!inputChord.trim()) return;

    if (!state.isReady) {
      await controls.initialize();
    }

    await controls.playChord(inputChord);
    controls.addChordToProgression(inputChord);
    controls.getSuggestions(inputChord);
    setInputChord('');
  };

  const handleSuggestionClick = async (chord: string): Promise<void> => {
    await controls.playChord(chord);
    controls.addChordToProgression(chord);
    controls.getSuggestions(chord);
  };

  return (
    <motion.div
      variants={FADE_VARIANTS}
      initial="hidden"
      animate="show"
      transition={{ duration: ANIMATION_DURATION.NORMAL }}
      className="space-y-6"
      data-testid="expert-composer"
    >
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="grid gap-4 max-sm:grid-cols-1 md:grid-cols-3">
            <section className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Key</label>
              <div className="flex flex-wrap gap-1">
                {KEYS.slice(0, 12).map(key => (
                  <Button
                    key={key}
                    variant={state.key === key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => controls.setKey(key)}
                    className="min-w-[40px] min-h-[44px] text-xs"
                  >
                    {key}
                  </Button>
                ))}
              </div>
            </section>

            <section className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Genre</label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map(genre => (
                  <Button
                    key={genre}
                    variant={state.genre === genre ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => controls.setGenre(genre)}
                    className="min-h-[44px] capitalize"
                  >
                    {genre}
                  </Button>
                ))}
              </div>
            </section>

            <section className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Tempo</label>
              <div className="flex gap-2">
                {TEMPO_PRESETS.map(preset => (
                  <Button
                    key={preset.bpm}
                    variant={tempo === preset.bpm ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTempo(preset.bpm)}
                    className="min-h-[44px] flex-1"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </section>
          </div>

          <section className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">Add Chord</label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={inputChord}
                onChange={e => setInputChord(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddChord()}
                placeholder="e.g., Cmaj7, Am, G7"
                className="flex-1 min-h-[44px]"
              />
              <Button onClick={handleAddChord} className="min-h-[44px]">
                Add
              </Button>
            </div>
          </section>

          {state.progression.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Your Progression</label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={controls.playProgression}>
                    ▶ Play
                  </Button>
                  <Button variant="outline" size="sm" onClick={controls.clearProgression}>
                    Clear
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {state.progression.map((chord, i) => (
                  <Badge key={i} variant="secondary" className="text-base py-2 px-3">
                    {chord}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {state.suggestions.length > 0 && (
            <section className="space-y-3">
              <label className="text-sm font-medium">AI Suggestions</label>
              <div className="grid gap-3 max-sm:grid-cols-1 md:grid-cols-2">
                {state.suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(suggestion.chord)}
                    className={cn(
                      'rounded-lg border p-4 text-left transition-all duration-200',
                      'border-violet-500/10 hover:bg-violet-500/5 hover:border-violet-500/30',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50',
                      'min-h-[44px]'
                    )}
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xl font-bold text-violet-400">{suggestion.chord}</span>
                      <Badge variant="default">{Math.round(suggestion.confidence * 100)}%</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
                    <div className="mt-2 flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {suggestion.relationship}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {suggestion.tensionChange > 0 ? '↑ Tension' : '↓ Resolution'}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {state.progression.length === 0 && (
            <section className="rounded-lg bg-violet-500/5 border border-violet-500/10 p-4">
              <p className="mb-3 text-sm text-muted-foreground">Quick Start:</p>
              <div className="flex flex-wrap gap-2">
                {['C', 'Am', 'Cmaj7'].map(chord => (
                  <Button
                    key={chord}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInputChord(chord);
                      setTimeout(handleAddChord, 100);
                    }}
                    className="min-h-[44px]"
                  >
                    Start with {chord}
                  </Button>
                ))}
              </div>
            </section>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4 text-sm text-muted-foreground">
        <span>Audio: {state.isReady ? '✅ Ready' : '⏸ Click to start'}</span>
        <span>Playing: {state.isPlaying ? '🎵' : '⏸'}</span>
      </div>
    </motion.div>
  );
}
