'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import VibeSelector from '@/components/jam/VibeSelector';
import ProgressionCard from '@/components/jam/ProgressionCard';
import JamBuilder from '@/components/jam/JamBuilder';
import { getProgressionsByVibe, type ChordProgression, type Vibe } from '@/lib/jamProgressions';
import { SkillLevel } from '@/lib/enums/skillLevel.enum';

type Step = 'genre' | 'progression' | 'playing';

interface BeginnerFlowProps {
  onSkillChange: () => void;
}

export function BeginnerFlow({ onSkillChange }: BeginnerFlowProps): React.JSX.Element {
  const [step, setStep] = useState<Step>('genre');
  const [selectedVibe, setSelectedVibe] = useState<Vibe | null>(null);
  const [selectedProgression, setSelectedProgression] = useState<ChordProgression | null>(null);

  const progressions = useMemo(() => {
    if (!selectedVibe) return [];
    return getProgressionsByVibe(selectedVibe, SkillLevel.Beginner).slice(0, 3);
  }, [selectedVibe]);

  const handleGenreSelect = (vibe: Vibe): void => {
    setSelectedVibe(vibe);
    setStep('progression');
  };

  const handleProgressionSelect = (progression: ChordProgression): void => {
    setSelectedProgression(progression);
    setStep('playing');
  };

  const handleBack = (): void => {
    if (step === 'progression') {
      setStep('genre');
      setSelectedVibe(null);
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
          <p className="text-muted-foreground text-sm mb-6">We'll suggest easy progressions</p>
          <VibeSelector selectedVibe={selectedVibe ?? 'pop'} onSelectVibe={handleGenreSelect} />
          <Button
            variant="link"
            size="sm"
            onClick={onSkillChange}
            className="mt-8 text-muted-foreground"
          >
            Want more control? <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
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
              ← Back to genres
            </button>
          </div>
          <div className="grid gap-4 max-sm:grid-cols-1 md:grid-cols-3 max-w-4xl mx-auto">
            {progressions.map(prog => (
              <ProgressionCard
                key={prog.id}
                progression={prog}
                isSelected={selectedProgression?.id === prog.id}
                onSelect={() => handleProgressionSelect(prog)}
                onBuild={() => handleProgressionSelect(prog)}
              />
            ))}
          </div>
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
