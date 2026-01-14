'use client';

import { useEffect, useRef, useState, useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CANVAS_RATIO } from '@/lib/constants/game.constants';
import type { PianoChordVoicing } from '@/lib/pianoChords';
import { getInversionLabel, midiToNoteName } from '@/lib/pianoChords';
import { createAudioContext } from '@/lib/utils/audio/audioContext';
import { playPianoChord } from '@/lib/utils/audio/pianoPlayback';
import { drawWhiteKey, drawBlackKey } from '@/lib/utils/canvas/pianoKeyRendering';
import {
  getMidiNote,
  getBlackKeyMidiOffset,
  isBlackKeyPresent,
} from '@/lib/utils/canvas/pianoKeyboard';
import { ChevronLeft, ChevronRight, Hand, Volume2, VolumeX } from 'lucide-react';
import { Chord } from 'tonal';

interface PianoKeyboardProps {
  voicings: PianoChordVoicing[];
  currentVoicingIndex?: number;
  onVoicingChange?: (index: number) => void;
  className?: string;
}

const OCTAVE_COUNT = 2;

// Roman numerals for scale degrees
const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

/**
 * Get the scale degree (roman numeral) for a note relative to chord root
 */
function getScaleDegree(noteMidi: number, chordName: string): string {
  const chord = Chord.get(chordName);
  if (!chord.tonic || !chord.notes.length) return '';

  // Get pitch classes
  const notePc = ((noteMidi % 12) + 12) % 12;
  const chordNotes = chord.notes;

  // Find which chord tone this is (1st, 3rd, 5th, 7th, etc.)
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const noteName = noteNames[notePc];

  // Match against chord notes (handle enharmonics)
  for (let i = 0; i < chordNotes.length; i++) {
    const chordNote = chordNotes[i];
    if (!chordNote) continue;

    // Compare pitch classes
    const chordNotePc = noteNames.indexOf(chordNote.replace(/b/g, '').replace(/#/g, ''));
    const adjustedPc =
      chordNote.includes('#')
        ? (chordNotePc + 1) % 12
        : chordNote.includes('b')
          ? (chordNotePc - 1 + 12) % 12
          : chordNotePc;

    if (adjustedPc === notePc || noteName === chordNote) {
      // Map chord position to scale degree
      const degrees = ['1', '3', '5', '7', '9', '11', '13'];
      return degrees[i] ?? '';
    }
  }

  return '';
}

/**
 * Calculate optimal octave start to center chord notes on keyboard
 */
function calculateOctaveStart(notes: number[]): number {
  if (notes.length === 0) return 3;

  const minNote = Math.min(...notes);
  const maxNote = Math.max(...notes);
  const centerNote = Math.floor((minNote + maxNote) / 2);

  // Calculate which octave puts the center note in the middle of 2 octaves
  const centerOctave = Math.floor(centerNote / 12) - 1;

  // Offset by half an octave to center better
  return Math.max(1, Math.min(6, centerOctave));
}

export function PianoKeyboard({
  voicings,
  currentVoicingIndex = 0,
  onVoicingChange,
  className = '',
}: PianoKeyboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  const currentVoicing = voicings[currentVoicingIndex] || null;

  // Calculate dynamic octave start based on chord notes
  const octaveStart = useMemo(() => {
    if (!currentVoicing) return 3;
    return calculateOctaveStart(currentVoicing.position.notes);
  }, [currentVoicing]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !audioContext) {
      const ctx = createAudioContext();
      setAudioContext(ctx);
    }
  }, [audioContext]);

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

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    const totalWhiteKeys = OCTAVE_COUNT * 7;
    const keyWidth = width / totalWhiteKeys;
    const whiteKeyHeight = height * CANVAS_RATIO.BLACK_KEY_HEIGHT;
    const blackKeyHeight = height * CANVAS_RATIO.BLACK_KEY_OFFSET;
    const blackKeyWidth = keyWidth * CANVAS_RATIO.BLACK_KEY_WIDTH;

    const isNoteInChord = (midi: number): boolean => {
      return currentVoicing.position.notes.includes(midi);
    };

    // Helper to draw note label (note name + scale degree)
    const drawNoteLabel = (
      x: number,
      y: number,
      midi: number,
      isBlack: boolean,
      keyW: number
    ) => {
      const noteName = midiToNoteName(midi).replace(/\d+/, ''); // Remove octave number
      const degree = getScaleDegree(midi, currentVoicing.name);

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Note name
      ctx.font = `bold ${isBlack ? 10 : 14}px system-ui`;
      ctx.fillStyle = isBlack ? '#ffffff' : '#1e293b';
      ctx.fillText(noteName, x + keyW / 2, y - (isBlack ? 24 : 35));

      // Scale degree below note name
      if (degree) {
        ctx.font = `${isBlack ? 8 : 11}px system-ui`;
        ctx.fillStyle = isBlack ? '#94a3b8' : '#64748b';
        ctx.fillText(degree, x + keyW / 2, y - (isBlack ? 12 : 18));
      }

      ctx.restore();
    };

    // Draw white keys
    let whiteKeyIndex = 0;
    for (let octave = octaveStart; octave < octaveStart + OCTAVE_COUNT; octave++) {
      for (let key = 0; key < 7; key++) {
        const x = whiteKeyIndex * keyWidth;
        const midi = getMidiNote(octave, key);
        const isPressed = isNoteInChord(midi);

        drawWhiteKey(ctx, {
          x,
          width: keyWidth,
          height: whiteKeyHeight,
          isPressed,
          finger: undefined,
          showFingerNumbers: false,
          isBlackKey: false,
        });

        if (isPressed) {
          drawNoteLabel(x, whiteKeyHeight, midi, false, keyWidth);
        }

        whiteKeyIndex++;
      }
    }

    // Draw black keys
    whiteKeyIndex = 0;
    for (let octave = octaveStart; octave < octaveStart + OCTAVE_COUNT; octave++) {
      for (let key = 0; key < 7; key++) {
        if (isBlackKeyPresent(key)) {
          const x = whiteKeyIndex * keyWidth + keyWidth - blackKeyWidth / 2;
          const blackKeyOffset = getBlackKeyMidiOffset(key);

          if (blackKeyOffset !== -1) {
            const baseNote = octave * 12 + 12;
            const midi = baseNote + blackKeyOffset;
            const isPressed = isNoteInChord(midi);

            drawBlackKey(ctx, {
              x,
              width: blackKeyWidth,
              height: blackKeyHeight,
              isPressed,
              finger: undefined,
              showFingerNumbers: false,
              isBlackKey: true,
            });

            if (isPressed) {
              drawNoteLabel(x, blackKeyHeight, midi, true, blackKeyWidth);
            }
          }
        }
        whiteKeyIndex++;
      }
    }
  }, [currentVoicing, octaveStart]);

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

  const playChord = (): void => {
    if (!audioContext || !isSoundEnabled || !currentVoicing) return;
    playPianoChord(audioContext, currentVoicing.position.notes);
  };

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
    if (!isSoundEnabled && audioContext?.state === 'suspended') {
      audioContext.resume();
    }
  };

  if (!currentVoicing) {
    return (
      <div className={cn('p-6 bg-muted rounded-lg', className)}>
        <p className="text-center text-muted-foreground">No piano chord position available</p>
      </div>
    );
  }

  // Get chord notes for legend
  const chordNotes = currentVoicing.position.notes.map(midi => {
    const noteName = midiToNoteName(midi).replace(/\d+/, '');
    const degree = getScaleDegree(midi, currentVoicing.name);
    return { noteName, degree };
  });

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold">{currentVoicing.name}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{getInversionLabel(currentVoicing.inversion)}</Badge>
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
            <Badge variant="outline" className="gap-1">
              <Hand className="h-3 w-3" />
              {currentVoicing.position.hand === 'left'
                ? 'Left Hand'
                : currentVoicing.position.hand === 'right'
                  ? 'Right Hand'
                  : 'Both Hands'}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
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

      {/* Piano Canvas */}
      <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-lg overflow-hidden p-4">
        <canvas
          ref={canvasRef}
          className="w-full h-[180px] cursor-pointer"
          onClick={isSoundEnabled ? playChord : undefined}
          style={{ display: 'block' }}
        />
      </div>

      {/* Voicing Navigation */}
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

      {/* Chord Tones Legend */}
      <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
        {chordNotes.map((note, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded bg-sapphire-500 flex items-center justify-center text-white font-bold text-xs">
              {note.noteName}
            </div>
            {note.degree && (
              <span className="text-muted-foreground text-xs">({note.degree})</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
