'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music2, Wand2, ArrowLeft, Sparkles } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SongProgressionCard } from './SongProgressionCard';
import { ExpertComposer } from './flows';
import JamBuilder from './JamBuilder';
import {
  extractSuggestedSongs,
  PROGRESSIONS,
  type SuggestedSong,
  type ChordProgression,
} from '@/lib/jamProgressions';
import { MAX_WIDTH } from '@/lib/constants/ui.constants';

type Screen = 'intro' | 'songs' | 'composer' | 'playing';

const PATH_CARDS = [
  {
    id: 'songs',
    icon: Music2,
    title: 'Play a Song',
    description: 'Learn classic progressions by playing famous songs',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30',
    iconColor: 'text-emerald-500',
  },
  {
    id: 'composer',
    icon: Wand2,
    title: 'Build Your Own',
    description: 'Create custom progressions from scratch',
    gradient: 'from-violet-500/20 to-purple-500/20',
    borderColor: 'border-violet-500/30',
    iconColor: 'text-violet-500',
  },
] as const;

const STAGGER_CHILDREN = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const CARD_ITEM = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function JamIntroScreen(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('intro');
  const [selectedSong, setSelectedSong] = useState<SuggestedSong | null>(null);

  const suggestedSongs = useMemo(() => extractSuggestedSongs('intermediate'), []);

  const handlePathSelect = (pathId: string) => {
    if (pathId === 'songs') setScreen('songs');
    else if (pathId === 'composer') setScreen('composer');
  };

  const handleStartJam = (song: SuggestedSong) => {
    setSelectedSong(song);
    setScreen('playing');
  };

  const handleBack = () => {
    if (screen === 'playing') {
      setScreen('songs');
      setSelectedSong(null);
    } else {
      setScreen('intro');
    }
  };

  // Convert SuggestedSong to ChordProgression for JamBuilder
  const progressionFromSong = useMemo((): ChordProgression | null => {
    if (!selectedSong) return null;
    return (
      PROGRESSIONS.find(p => p.id === selectedSong.progressionId) ?? {
        id: selectedSong.progressionId,
        name: `${selectedSong.title} - ${selectedSong.artist}`,
        vibe: selectedSong.vibe,
        key: selectedSong.key,
        chords: selectedSong.chords,
        difficulty: selectedSong.difficulty,
        description: selectedSong.progressionName,
        bpm: selectedSong.bpm,
      }
    );
  }, [selectedSong]);

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

        {screen === 'songs' && (
          <motion.div
            key="songs"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className="mb-6">
              <Button variant="ghost" size="sm" onClick={handleBack} className="mb-4">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <h2 className="text-2xl font-bold">Pick a Song</h2>
              <p className="text-muted-foreground">
                Learn progressions by playing songs you know and love
              </p>
            </div>

            <motion.div
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              variants={STAGGER_CHILDREN}
              initial="hidden"
              animate="show"
            >
              {suggestedSongs.map(song => (
                <motion.div key={`${song.progressionId}-${song.title}`} variants={CARD_ITEM}>
                  <SongProgressionCard song={song} onStartJam={handleStartJam} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {screen === 'composer' && (
          <motion.div
            key="composer"
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

        {screen === 'playing' && progressionFromSong && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <JamBuilder
              progression={progressionFromSong}
              onUpdate={() => {}}
              onClear={handleBack}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
