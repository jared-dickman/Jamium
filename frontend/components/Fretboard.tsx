'use client';

import { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FINGER_COLORS, SAPPHIRE } from '@/lib/constants/canvas.constants';
import { FRETBOARD } from '@/lib/constants/game.constants';
import type { ChordVoicing } from '@/lib/chordPositions';
import { createAudioContext } from '@/lib/utils/audio/audioContext';
import { drawFretboardBackground } from '@/lib/utils/canvas/fretboard/drawFretboardBackground';
import { drawBarres, drawFingerPositions } from '@/lib/utils/canvas/fretboard/drawFingerPositions';
import { drawFrets } from '@/lib/utils/canvas/fretboard/drawFrets';
import { drawMarkers } from '@/lib/utils/canvas/fretboard/drawMarkers';
import { drawStrings } from '@/lib/utils/canvas/fretboard/drawStrings';
import { ChevronLeft, ChevronRight, FlipVertical2, Volume2, VolumeX } from 'lucide-react';

interface FretboardProps {
  voicings: ChordVoicing[];
  currentVoicingIndex?: number;
  onVoicingChange?: (index: number) => void;
  isLeftHanded?: boolean;
  showFingerNumbers?: boolean;
  className?: string;
}

const STRING_NAMES = FRETBOARD.STANDARD_TUNING;
const PADDING = 40;
const STRING_DIVISOR = 5;
const MIN_VISIBLE_FRETS = 4;
const MAX_VISIBLE_FRETS = 12; // Maximum frets to show even on wide screens
const VISIBLE_FRET_OFFSET = 2;
const BASE_FRET_THRESHOLD = 1;
const FRET_NUMBER_OFFSET_X = 20;
const FRET_NUMBER_OFFSET_Y = 2.5;
const STRING_NAME_OFFSET_X = 25;
const FRETBOARD_INVERT_STORAGE_KEY = 'fretboard-inverted-preference';
const OPTIMAL_FRET_WIDTH = 60; // Optimal width per fret in pixels
const MIN_FRET_WIDTH = 40; // Minimum width per fret in pixels

export function Fretboard({
  voicings,
  currentVoicingIndex = 0,
  onVoicingChange,
  showFingerNumbers = true,
  className = '',
}: FretboardProps): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isInverted, setIsInverted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem(FRETBOARD_INVERT_STORAGE_KEY);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const currentVoicing = voicings[currentVoicingIndex] || null;

  useEffect(() => {
    if (typeof window !== 'undefined' && !audioContext) {
      const ctx = createAudioContext();
      setAudioContext(ctx);
    }
  }, [audioContext]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(FRETBOARD_INVERT_STORAGE_KEY, JSON.stringify(isInverted));
    }
  }, [isInverted]);

  useEffect(() => {
    if (!currentVoicing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const fretboardWidth = width - PADDING * 2;
    const fretboardHeight = height - PADDING * 2;

    const { baseFret, frets, fingers, barres } = currentVoicing.position;
    const maxFret = Math.max(...frets.filter(f => f > 0));

    // Calculate minimum required frets to show all notes
    const minRequiredFrets = Math.max(MIN_VISIBLE_FRETS, maxFret - baseFret + VISIBLE_FRET_OFFSET);

    // Calculate how many frets we can optimally fit in the available width
    const optimalFrets = Math.floor(fretboardWidth / OPTIMAL_FRET_WIDTH);

    // Use the larger of minimum required or optimal (up to max)
    const visibleFrets = Math.min(MAX_VISIBLE_FRETS, Math.max(minRequiredFrets, optimalFrets));

    const startFret = baseFret === BASE_FRET_THRESHOLD ? 0 : baseFret - 1;
    const endFret = startFret + visibleFrets;
    const fretWidth = fretboardWidth / visibleFrets;
    const stringSpacing = fretboardHeight / STRING_DIVISOR;

    drawFretboardBackground(ctx, {
      width,
      height,
      padding: PADDING,
      fretboardWidth,
      fretboardHeight,
    });

    drawStrings(ctx, { width, padding: PADDING, stringSpacing, isInverted });

    drawFrets(ctx, {
      padding: PADDING,
      height,
      fretWidth,
      visibleFrets,
      startFret,
    });

    drawMarkers(ctx, {
      padding: PADDING,
      height,
      fretWidth,
      stringSpacing,
      startFret,
      endFret,
    });

    ctx.fillStyle = SAPPHIRE[300];
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    if (baseFret > BASE_FRET_THRESHOLD) {
      ctx.fillText(
        `${baseFret}fr`,
        PADDING - FRET_NUMBER_OFFSET_X,
        PADDING + stringSpacing * FRET_NUMBER_OFFSET_Y
      );
    }

    drawFingerPositions(ctx, frets, fingers, {
      padding: PADDING,
      stringSpacing,
      fretWidth,
      startFret,
      endFret,
      showFingerNumbers,
      isInverted,
    });

    if (barres) {
      drawBarres(ctx, barres, {
        padding: PADDING,
        stringSpacing,
        fretWidth,
        startFret,
        isInverted,
      });
    }

    ctx.fillStyle = SAPPHIRE[200];
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    STRING_NAMES.forEach((name, i) => {
      const stringPosition = isInverted ? STRING_NAMES.length - 1 - i : i;
      const y = PADDING + stringPosition * stringSpacing;
      ctx.fillText(name, PADDING - STRING_NAME_OFFSET_X, y);
    });
  }, [currentVoicing, showFingerNumbers, isInverted]);

  const handlePrevVoicing = () => {
    if (voicings.length <= 1) return;
    const newIndex = (currentVoicingIndex - 1 + voicings.length) % voicings.length;
    onVoicingChange?.(newIndex);
  };

  const handleNextVoicing = () => {
    if (voicings.length <= 1) return;
    const newIndex = (currentVoicingIndex + 1) % voicings.length;
    onVoicingChange?.(newIndex);
  };

  const playChord = () => {
    if (!audioContext || !isSoundEnabled || !currentVoicing) return;

    const now = audioContext.currentTime;
    const { frets } = currentVoicing.position;

    const openStringFreqs = [82.41, 110.0, 146.83, 196.0, 246.94, 329.63];

    frets.forEach((fret, stringIndex) => {
      if (fret < 0) return;

      const baseFreq = openStringFreqs[stringIndex];
      if (!baseFreq) return;

      const freq = baseFreq * Math.pow(2, fret / 12);

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(freq, now);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.15, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(now);
      oscillator.stop(now + 1.5);
    });
  };

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
    if (!isSoundEnabled && audioContext?.state === 'suspended') {
      audioContext.resume();
    }
  };

  const toggleInvert = () => {
    setIsInverted(!isInverted);
  };

  if (!currentVoicing) {
    return (
      <div className={cn('p-6 bg-muted rounded-lg', className)}>
        <p className="text-center text-muted-foreground">No chord position available</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold">{currentVoicing.name}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{currentVoicing.positionName}</Badge>
            <Badge
              variant={
                currentVoicing.difficulty === 'beginner'
                  ? 'default'
                  : currentVoicing.difficulty === 'intermediate'
                    ? 'secondary'
                    : 'destructive'
              }
            >
              {currentVoicing.difficulty}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleInvert} title="Invert fretboard">
            <FlipVertical2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleSound} title="Toggle sound">
            {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          {isSoundEnabled && (
            <Button variant="default" onClick={playChord}>
              Play Chord
            </Button>
          )}
        </div>
      </div>

      <div className="relative bg-background rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-[300px] cursor-pointer"
          onClick={isSoundEnabled ? playChord : undefined}
          style={{ display: 'block' }}
        />
      </div>

      {voicings.length > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" size="icon" onClick={handlePrevVoicing}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Voicing {currentVoicingIndex + 1} of {voicings.length}
          </span>
          <Button variant="ghost" size="icon" onClick={handleNextVoicing}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {showFingerNumbers && (
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: FINGER_COLORS[1] }} />
            <span>Index</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: FINGER_COLORS[2] }} />
            <span>Middle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: FINGER_COLORS[3] }} />
            <span>Ring</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: FINGER_COLORS[4] }} />
            <span>Pinky</span>
          </div>
        </div>
      )}
    </div>
  );
}
