'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import VibeSelector from '@/components/jam/VibeSelector';
import { ProgressionsGrid } from '@/components/jam/ProgressionsGrid';
import JamBuilder from '@/components/jam/JamBuilder';
import { getProgressionsByVibe, type ChordProgression, type Vibe } from '@/lib/jamProgressions';
import { SkillLevel } from '@/lib/enums/skillLevel.enum';

const AVAILABLE_KEYS = ['C', 'G', 'D', 'A', 'E', 'F', 'Bb'] as const;

type Step = 'genre' | 'key' | 'progression' | 'playing';

interface IntermediateFlowProps {
  onSkillChange: () => void;
}

export function IntermediateFlow({ onSkillChange }: IntermediateFlowProps): React.JSX.Element {
  const [step, setStep] = useState<Step>('genre');
  const [selectedVibe, setSelectedVibe] = useState<Vibe | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedProgression, setSelectedProgression] = useState<ChordProgression | null>(null);

  const progressions = useMemo(() => {
    if (!selectedVibe) return [];
    return getProgressionsByVibe(selectedVibe, SkillLevel.Intermediate);
  }, [selectedVibe]);

  const handleGenreSelect = (vibe: Vibe): void => {
    setSelectedVibe(vibe);
    setStep('key');
  };

  const handleKeySelect = (key: string): void => {
    setSelectedKey(key);
    setStep('progression');
  };

  const handleProgressionSelect = (progression: ChordProgression): void => {
    setSelectedProgression({ ...progression });
    setStep('playing');
  };

  const handleBack = (): void => {
    if (step === 'key') {
      setStep('genre');
      setSelectedVibe(null);
    } else if (step === 'progression') {
      setStep('key');
      setSelectedKey(null);
    } else if (step === 'playing') {
      setStep('progression');
      setSelectedProgression(null);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {step === 'genre' && (
        <motion.div
          key="genre"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex flex-col items-center min-h-[50vh] justify-center"
        >
          <h2 className="text-xl font-semibold mb-2">Pick a genre</h2>
          <p className="text-muted-foreground text-sm mb-6">
            More variety for intermediate players
          </p>
          <VibeSelector selectedVibe={selectedVibe ?? 'pop'} onSelectVibe={handleGenreSelect} />
          <Button
            variant="link"
            size="sm"
            onClick={onSkillChange}
            className="mt-8 text-muted-foreground"
          >
            Want full control? <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </motion.div>
      )}

      {step === 'key' && (
        <motion.div
          key="key"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex flex-col items-center min-h-[50vh] justify-center"
        >
          <h2 className="text-xl font-semibold mb-2">Choose a key</h2>
          <button
            onClick={handleBack}
            className="text-sm text-muted-foreground hover:underline mb-6"
          >
            ← Back to genres
          </button>
          <div className="flex flex-wrap gap-3 justify-center max-w-md">
            {AVAILABLE_KEYS.map(key => (
              <Button
                key={key}
                variant={selectedKey === key ? 'default' : 'outline'}
                size="lg"
                onClick={() => handleKeySelect(key)}
                className="min-w-[60px] min-h-[60px] text-lg"
              >
                {key}
              </Button>
            ))}
          </div>
        </motion.div>
      )}

      {step === 'progression' && (
        <motion.div
          key="progression"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-1">Choose a progression</h2>
            <button onClick={handleBack} className="text-sm text-muted-foreground hover:underline">
              ← Back to key
            </button>
          </div>
          <ProgressionsGrid
            vibe={selectedVibe!}
            progressions={progressions}
            selectedProgressionId={selectedProgression?.id ?? null}
            onSelectProgression={setSelectedProgression}
            onBuildProgression={handleProgressionSelect}
          />
        </motion.div>
      )}

      {step === 'playing' && selectedProgression && (
        <motion.div
          key="playing"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <JamBuilder
            progression={selectedProgression}
            onUpdate={setSelectedProgression}
            onClear={handleBack}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
