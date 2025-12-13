'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SkillLevelSelector } from '@/components/jam/SkillLevelSelector';
import { BeginnerFlow, IntermediateFlow, ExpertComposer } from '@/components/jam/flows';
import { cn } from '@/lib/utils';
import { SkillLevel } from '@/lib/enums/skillLevel.enum';
import { MAX_WIDTH } from '@/lib/constants/ui.constants';

const STORAGE_KEY = 'jam-skill-level';

interface JamAssistantClientProps {
  initialMode?: string | null;
}

const SKILL_FROM_MODE: Record<string, SkillLevel> = {
  beginner: SkillLevel.Beginner,
  intermediate: SkillLevel.Intermediate,
  expert: SkillLevel.Expert,
};

type WizardStep = 'skill' | 'flow';

export default function JamAssistantClient({
  initialMode,
}: JamAssistantClientProps): React.JSX.Element {
  const [step, setStep] = useState<WizardStep>('skill');
  const [skillLevel, setSkillLevel] = useState<SkillLevel | null>(null);

  useEffect(() => {
    if (initialMode && SKILL_FROM_MODE[initialMode]) {
      setSkillLevel(SKILL_FROM_MODE[initialMode]);
      setStep('flow');
      return;
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && Object.values(SkillLevel).includes(saved as SkillLevel)) {
      setSkillLevel(saved as SkillLevel);
      setStep('flow');
    }
  }, [initialMode]);

  const handleSkillSelect = useCallback((level: SkillLevel) => {
    setSkillLevel(level);
    localStorage.setItem(STORAGE_KEY, level);
    setStep('flow');
  }, []);

  const handleRestart = useCallback(() => {
    setStep('skill');
  }, []);

  return (
    <div className={cn('container mx-auto py-8 px-4', MAX_WIDTH.EXTRA_LARGE)}>
      <AnimatePresence mode="wait">
        {step === 'skill' && (
          <motion.div
            key="skill-select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-[60vh]"
          >
            <h1 className="text-2xl font-bold mb-2">Let's Jam</h1>
            <p className="text-muted-foreground mb-8">What's your skill level?</p>
            <SkillLevelSelector
              selectedLevel={skillLevel ?? SkillLevel.Beginner}
              onSelectLevel={handleSkillSelect}
            />
          </motion.div>
        )}

        {step === 'flow' && skillLevel && (
          <motion.div
            key="flow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex justify-end mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRestart}
                className="text-muted-foreground text-xs"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Change skill
              </Button>
            </div>

            {skillLevel === SkillLevel.Beginner && (
              <BeginnerFlow onSkillChange={() => handleSkillSelect(SkillLevel.Intermediate)} />
            )}
            {skillLevel === SkillLevel.Intermediate && (
              <IntermediateFlow onSkillChange={() => handleSkillSelect(SkillLevel.Expert)} />
            )}
            {skillLevel === SkillLevel.Expert && <ExpertComposer />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
