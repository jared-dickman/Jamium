'use client';

import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, Music, Clock } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { type SuggestedSong, FUNCTION_COLORS, VIBE_INFO } from '@/lib/jamProgressions';
import { getChordPlayer } from '@/lib/audio/chordPlayer';

interface SongProgressionCardProps {
  song: SuggestedSong;
  onStartJam: (song: SuggestedSong) => void;
}

const DIFFICULTY_COLORS = {
  beginner: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  intermediate: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  expert: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
};

export function SongProgressionCard({ song, onStartJam }: SongProgressionCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChordIndex, setCurrentChordIndex] = useState(-1);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stopPlayback = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    const player = getChordPlayer();
    player.stop();
    setIsPlaying(false);
    setCurrentChordIndex(-1);
  }, []);

  const handlePreview = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();

      if (isPlaying) {
        stopPlayback();
        return;
      }

      const player = getChordPlayer();
      await player.initialize();
      setIsPlaying(true);

      const msPerBeat = (60 / song.bpm) * 1000;

      const playChordAtIndex = (index: number): void => {
        if (index >= song.chords.length) {
          setIsPlaying(false);
          setCurrentChordIndex(-1);
          return;
        }

        const chord = song.chords[index];
        if (!chord) return;

        setCurrentChordIndex(index);
        player.playChord(chord.name, 2);

        const durationBeats = chord.duration ?? 4;
        const durationMs = durationBeats * msPerBeat;

        timeoutRef.current = setTimeout(() => {
          playChordAtIndex(index + 1);
        }, durationMs);
      };

      playChordAtIndex(0);
    },
    [isPlaying, song, stopPlayback]
  );

  const primaryVibe = song.vibe[0];
  const vibeInfo = primaryVibe ? VIBE_INFO[primaryVibe] : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="cursor-pointer group relative overflow-hidden h-full">
        <CardHeader className="pb-2">
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-bold text-xl leading-tight line-clamp-1">{song.title}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{song.artist}</p>
          </motion.div>
        </CardHeader>

        <CardContent className="space-y-3 pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={cn('text-xs', DIFFICULTY_COLORS[song.difficulty])}>
              {song.difficulty}
            </Badge>
            {vibeInfo && (
              <Badge variant="outline" className="text-xs">
                {vibeInfo.emoji} {primaryVibe}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {song.chords.slice(0, 6).map((chord, idx) => (
              <motion.span
                key={idx}
                className={cn(
                  'px-2 py-0.5 rounded text-xs font-medium transition-all',
                  currentChordIndex === idx && 'ring-2 ring-white scale-110'
                )}
                style={{
                  backgroundColor:
                    currentChordIndex === idx
                      ? FUNCTION_COLORS[chord.function]
                      : `${FUNCTION_COLORS[chord.function]}15`,
                  border: `1px solid ${FUNCTION_COLORS[chord.function]}30`,
                  color: currentChordIndex === idx ? 'white' : FUNCTION_COLORS[chord.function],
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: currentChordIndex === idx ? 1.1 : 1 }}
                transition={{ delay: 0.15 + idx * 0.03 }}
              >
                {chord.name}
              </motion.span>
            ))}
            {song.chords.length > 6 && (
              <span className="text-xs text-muted-foreground px-1">
                +{song.chords.length - 6} more
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {song.bpm} BPM
            </span>
            <span className="flex items-center gap-1">
              <Music className="w-3 h-3" />
              Key of {song.key}
            </span>
          </div>

          <p className="text-xs text-muted-foreground/70 truncate">{song.progressionName}</p>
        </CardContent>

        <CardFooter className="pt-2 gap-2">
          <motion.div className="flex-1" whileTap={{ scale: 0.97 }}>
            <Button
              size="sm"
              variant="outline"
              className={cn('w-full', isPlaying && 'bg-red-500/10 border-red-500/30 text-red-500')}
              onClick={handlePreview}
            >
              {isPlaying ? (
                <>
                  <Square className="w-3.5 h-3.5" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  Preview
                </>
              )}
            </Button>
          </motion.div>
          <motion.div className="flex-1" whileTap={{ scale: 0.97 }}>
            <Button
              size="sm"
              className="w-full"
              onClick={e => {
                e.stopPropagation();
                onStartJam(song);
              }}
            >
              Start Jam
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
