'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Wand2, ArrowLeft, Sparkles } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SkillLevelSelector } from './SkillLevelSelector';
import VibeSelector from './VibeSelector';
import ProgressionCard from './ProgressionCard';
import { ExpertComposer } from './flows';
import JamBuilder from './JamBuilder';
import { getProgressionsByVibe, type ChordProgression, type Vibe } from '@/lib/jamProgressions';
import { MAX_WIDTH } from '@/lib/constants/ui.constants';
import { SkillLevel } from '@/lib/enums/skillLevel.enum';

type Screen = 'intro' | 'discover-skill' | 'discover-vibe' | 'discover-suggestions' | 'build' | 'playing';

const PATH_CARDS = [
  {
    id: 'discover',
    icon: Compass,
    title: 'Discover',
    description: 'Find the perfect progression for your style',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30',
    iconColor: 'text-emerald-500',
  },
  {
    id: 'build',
    icon: Wand2,
    title: 'Build',
    description: 'Create custom progressions from scratch',
    gradient: 'from-violet-500/20 to-purple-500/20',
    borderColor: 'border-violet-500/30',
    iconColor: 'text-violet-500',
  },
] as const;

export function JamIntroScreen(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('intro');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(SkillLevel.Beginner);
  const [selectedVibe, setSelectedVibe] = useState<Vibe | null>(null);
  const [selectedProgression, setSelectedProgression] = useState<ChordProgression | null>(null);

  const progressions = useMemo(() => {
    if (!selectedVibe) return [];
    return getProgressionsByVibe(selectedVibe, skillLevel).slice(0, 6);
  }, [selectedVibe, skillLevel]);

  const handlePathSelect = (pathId: string) => {
    if (pathId === 'discover') setScreen('discover-skill');
    else if (pathId === 'build') setScreen('build');
  };

  const handleSkillSelect = (level: SkillLevel) => {
    setSkillLevel(level);
    setScreen('discover-vibe');
  };

  const handleVibeSelect = (vibe: Vibe) => {
    setSelectedVibe(vibe);
    setScreen('discover-suggestions');
  };

  const handleProgressionSelect = (progression: ChordProgression) => {
    setSelectedProgression(progression);
    setScreen('playing');
  };

  const handleBack = () => {
    if (screen === 'playing') {
      setScreen('discover-suggestions');
      setSelectedProgression(null);
    } else if (screen === 'discover-suggestions') {
      setScreen('discover-vibe');
      setSelectedVibe(null);
    } else if (screen === 'discover-vibe') {
      setScreen('discover-skill');
    } else if (screen === 'discover-skill' || screen === 'build') {
      setScreen('intro');
    }
  };

  return (
    <div className={cn('container mx-auto py-8 px-4', MAX_WIDTH.EXTRA_LARGE)}>
      <AnimatePresence mode="wait">
        {screen === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-[60vh]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-10"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-3 flex items-center justify-center gap-3">
                <Sparkles className="w-8 h-8 text-amber-500" />
                Let's Jam
              </h1>
              <p className="text-muted-foreground text-lg">How do you want to play today?</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
              {PATH_CARDS.map((path, idx) => (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1, type: 'spring', stiffness: 300 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={cn(
                      'cursor-pointer border-2 transition-all h-full',
                      'hover:shadow-xl hover:shadow-primary/5',
                      path.borderColor
                    )}
                    onClick={() => handlePathSelect(path.id)}
                  >
                    <CardContent className="p-8 text-center">
                      <div
                        className={cn(
                          'w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center',
                          `bg-gradient-to-br ${path.gradient}`
                        )}
                      >
                        <path.icon className={cn('w-8 h-8', path.iconColor)} />
                      </div>
                      <h2 className="text-xl font-semibold mb-2">{path.title}</h2>
                      <p className="text-sm text-muted-foreground">{path.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {screen === 'discover-skill' && (
          <motion.div
            key="discover-skill"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex flex-col items-center justify-center min-h-[60vh]"
          >
            <Button variant="ghost" size="sm" onClick={handleBack} className="self-start mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h2 className="text-2xl font-bold mb-2">What's your skill level?</h2>
            <p className="text-muted-foreground mb-8">
              We'll tailor the suggestions to your experience
            </p>
            <SkillLevelSelector selectedLevel={skillLevel} onSelectLevel={handleSkillSelect} />
          </motion.div>
        )}

        {screen === 'discover-vibe' && (
          <motion.div
            key="discover-vibe"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex flex-col items-center justify-center min-h-[60vh]"
          >
            <Button variant="ghost" size="sm" onClick={handleBack} className="self-start mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h2 className="text-2xl font-bold mb-2">Pick a vibe</h2>
            <p className="text-muted-foreground mb-8">What style are you feeling today?</p>
            <VibeSelector selectedVibe={selectedVibe ?? 'pop'} onSelectVibe={handleVibeSelect} />
          </motion.div>
        )}

        {screen === 'discover-suggestions' && (
          <motion.div
            key="discover-suggestions"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div>
              <Button variant="ghost" size="sm" onClick={handleBack} className="mb-4">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <h2 className="text-2xl font-bold">Choose a progression</h2>
              <p className="text-muted-foreground">
                {skillLevel === SkillLevel.Beginner && 'Simple progressions to get you started'}
                {skillLevel === SkillLevel.Intermediate && 'Progressions with more variety'}
                {skillLevel === SkillLevel.Expert && 'Advanced progressions for experienced players'}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {progressions.map(prog => (
                <motion.div
                  key={prog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <ProgressionCard
                    progression={prog}
                    isSelected={selectedProgression?.id === prog.id}
                    onSelect={() => setSelectedProgression(prog)}
                    onBuild={() => handleProgressionSelect(prog)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {screen === 'build' && (
          <motion.div
            key="build"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className="mb-6">
              <Button variant="ghost" size="sm" onClick={handleBack} className="mb-4">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </div>
            <ExpertComposer />
          </motion.div>
        )}

        {screen === 'playing' && selectedProgression && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <JamBuilder
              progression={selectedProgression}
              onUpdate={setSelectedProgression}
              onClear={handleBack}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
