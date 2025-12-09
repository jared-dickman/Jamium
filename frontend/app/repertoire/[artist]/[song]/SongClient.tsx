'use client';

import { KEY_SIGNATURES, SongToolbar } from '@/components/SongToolbar';
import type { Song } from '@/lib/types';
import { cn, transposeChord } from '@/lib/utils';
import { calculateScrollSpeed } from '@/lib/utils/song/scrollSpeed';
import type { ChordElementInfo } from '@/lib/utils/song/chordTracking';
import { findClosestVisibleChord } from '@/lib/utils/song/chordTracking';
import { detectKey } from '@/lib/music-theory/tonal-helper';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './SongClient.module.css';
import { ChordDisplay } from '@/components/ChordDisplay';
import { PianoDisplay } from '@/components/PianoDisplay';
import { Button } from '@/components/ui/button';
import { Guitar, Piano, ChevronRight } from 'lucide-react';
import { useGuitarPlayback } from '@/lib/hooks';
import { useDeleteSong } from '@/app/features/songs/hooks';
import { useRouter } from 'next/navigation';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SongClientProps {
  song: Song;
  artistSlug: string;
  songSlug: string;
}

interface GroupedLine {
  lineGroup: number;
  items: Array<{ chord: string | null; lyric: string }>;
}

/** Group section lines by lineGroup for UG-style rendering */
function groupLinesByLineGroup(lines: Song['sections'][0]['lines']): GroupedLine[] {
  // If any line has lineGroup, use that for grouping
  const hasLineGroup = lines.some(l => l.lineGroup !== undefined);

  if (hasLineGroup) {
    const groups = new Map<number, GroupedLine>();
    lines.forEach((line) => {
      const lg = line.lineGroup ?? 0;
      if (!groups.has(lg)) {
        groups.set(lg, { lineGroup: lg, items: [] });
      }
      groups.get(lg)!.items.push({
        chord: line.chord?.name ?? null,
        lyric: line.lyric,
      });
    });
    return Array.from(groups.values()).sort((a, b) => a.lineGroup - b.lineGroup);
  }

  // Fallback: group no-chord prefixes with next chord entry
  const result: GroupedLine[] = [];
  let currentGroup: GroupedLine = { lineGroup: 0, items: [] };

  lines.forEach((line) => {
    currentGroup.items.push({
      chord: line.chord?.name ?? null,
      lyric: line.lyric,
    });
    // If this line has a chord, it ends the current group
    if (line.chord?.name) {
      result.push(currentGroup);
      currentGroup = { lineGroup: result.length, items: [] };
    }
  });

  // Don't forget trailing items without chords
  if (currentGroup.items.length > 0) {
    result.push(currentGroup);
  }

  return result;
}

const getNormalizedKey = (key?: string) => {
  if (!key) return null;
  const match = key.match(/^([A-G][#b]?)/);
  return match ? match[1] : null;
};

const getKeyIndex = (key: string) => {
  const index = KEY_SIGNATURES.indexOf(key as (typeof KEY_SIGNATURES)[number]);
  return index === -1 ? KEY_SIGNATURES.indexOf('C') : index;
};

// Extract all chords from song sections for key detection
const extractChordsFromSong = (song: Song): string[] => {
  const chords: string[] = [];
  for (const section of song.sections) {
    for (const line of section.lines) {
      if (line.chord?.name) {
        chords.push(line.chord.name);
      }
    }
  }
  return chords;
};

export function SongClient({ song, artistSlug, songSlug }: SongClientProps): React.JSX.Element {
  const router = useRouter();

  // Detect key from chords if not provided or unreliable
  const detectedKey = useMemo(() => {
    const chords = extractChordsFromSong(song);
    if (chords.length === 0) return null;
    const result = detectKey(chords);
    // Return tonic with 'm' suffix for minor keys
    if (result) {
      return result.type === 'minor' ? `${result.tonic}m` : result.tonic;
    }
    return null;
  }, [song]);

  // Use detected key, falling back to song.key, then 'C'
  const effectiveKey = detectedKey || getNormalizedKey(song.key) || 'C';
  const originalKeyIndex = getKeyIndex(effectiveKey.replace('m', ''));

  const [transpose, setTranspose] = useState(0);
  const [bpm, setBpm] = useState(120);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(false);
  const [currentChord, setCurrentChord] = useState<string | null>(null);
  const [instrument, setInstrument] = useState<'guitar' | 'piano'>('guitar');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const { mutate: deleteSongMutation, isPending: isDeleting } = useDeleteSong();

  // Initialize guitar playback
  useGuitarPlayback({
    enabled: isAutoScrollEnabled && isAudioEnabled,
    currentChord,
    preset: 'strumming',
    volume: -6,
  });

  const transposeForKey = ((transpose % 12) + 12) % 12;
  const currentKey = KEY_SIGNATURES[(originalKeyIndex + transposeForKey) % 12];

  const transposedSections = useMemo(() => {
    if (transpose === 0) {
      return song.sections;
    }

    return song.sections.map(section => ({
      ...section,
      lines: section.lines.map(line => {
        if (!line.chord?.name) {
          return { ...line };
        }

        return {
          ...line,
          chord: {
            ...line.chord,
            name: transposeChord(line.chord.name, transpose),
          },
        };
      }),
    }));
  }, [song.sections, transpose]);

  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const chordElementsRef = useRef<Map<string, ChordElementInfo>>(new Map());

  useEffect(() => {
    const firstChord = transposedSections
      .flatMap(section => section.lines)
      .find(line => line.chord?.name)?.chord?.name;
    setCurrentChord(firstChord ?? null);
  }, [transposedSections]);

  useEffect(() => {
    if (!isAutoScrollEnabled || !lyricsContainerRef.current) return;

    const container = lyricsContainerRef.current;
    const checkInterval = setInterval(() => {
      const containerRect = container.getBoundingClientRect();
      const centerY = containerRect.top + 100;

      const closestChordName = findClosestVisibleChord(
        chordElementsRef.current,
        containerRect,
        centerY
      );

      if (closestChordName !== null && closestChordName !== currentChord) {
        setCurrentChord(closestChordName);
      }
    }, 100);

    return () => clearInterval(checkInterval);
  }, [isAutoScrollEnabled, currentChord]);

  useEffect(() => {
    if (!isAutoScrollEnabled || typeof window === 'undefined' || !lyricsContainerRef.current) {
      return;
    }

    let frameId: number;
    let lastTimestamp: number | null = null;

    const step = (timestamp: number): void => {
      if (!isAutoScrollEnabled || !lyricsContainerRef.current) return;

      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
        frameId = requestAnimationFrame(step);
        return;
      }

      const elapsedSeconds = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;
      const pixelsPerSecond = calculateScrollSpeed(
        lyricsContainerRef.current,
        transposedSections,
        bpm
      );
      const scrollDelta = pixelsPerSecond * elapsedSeconds;

      const maxScroll =
        lyricsContainerRef.current.scrollHeight - lyricsContainerRef.current.clientHeight;
      const nextScroll = Math.min(lyricsContainerRef.current.scrollTop + scrollDelta, maxScroll);
      lyricsContainerRef.current.scrollTop = nextScroll;

      if (nextScroll >= maxScroll) {
        setIsAutoScrollEnabled(false);
        return;
      }

      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      lastTimestamp = null;
    };
  }, [isAutoScrollEnabled, bpm, transposedSections]);

  const handleTransposeChange = (next: number) => {
    setIsAutoScrollEnabled(false);
    setTranspose(next);
  };

  const handleKeyChange = (key: string) => {
    const nextIndex = getKeyIndex(key);
    let diff = nextIndex - originalKeyIndex;
    if (diff > 6) diff -= 12;
    if (diff < -6) diff += 12;
    handleTransposeChange(diff);
  };

  const toggleAutoScroll = () => {
    setIsAutoScrollEnabled(prev => !prev);
  };

  const handleDelete = () => {
    if (!confirm(`Are you sure you want to delete "${song.title}"? This cannot be undone.`)) {
      return;
    }

    deleteSongMutation(
      { artistSlug, songSlug },
      {
        onSuccess: () => {
          router.push('/repertoire');
        },
      }
    );
  };

  return (
    <div className={styles.songContainer}>
      {/* Compact Toolbar - Linear/Stripe inspired */}
      <SongToolbar
        transpose={transpose}
        onTransposeChange={handleTransposeChange}
        currentKey={currentKey ?? 'C'}
        onKeyChange={handleKeyChange}
        originalKey={effectiveKey}
        bpm={bpm}
        onBpmChange={setBpm}
        isAutoScrollEnabled={isAutoScrollEnabled}
        onToggleAutoScroll={toggleAutoScroll}
        isAudioEnabled={isAudioEnabled}
        onToggleAudio={() => setIsAudioEnabled(!isAudioEnabled)}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />

      {/* Lyrics Container - UG Style */}
      <div ref={lyricsContainerRef} className={styles.lyricsContainer}>
        {transposedSections.map((section, sectionIndex) => {
          const groupedLines = groupLinesByLineGroup(section.lines);
          return (
            <Collapsible key={`${section.name}-${sectionIndex}`} defaultOpen className={styles.section}>
              <CollapsibleTrigger className={styles.sectionTrigger}>
                <ChevronRight className={styles.chevronRotate} />
                <h3 className={styles.sectionTitle}>{section.name}</h3>
              </CollapsibleTrigger>
              <CollapsibleContent className={styles.sectionContent}>
                {groupedLines.map((group, groupIndex) => (
                  <div key={`group-${group.lineGroup}`} className={styles.ugLineGroup}>
                    {group.items.map((item, itemIndex) => {
                      const chordKey = `${sectionIndex}-${groupIndex}-${itemIndex}`;
                      const isActive = item.chord === currentChord;
                      return (
                        <span key={chordKey} className={styles.ugFragment}>
                          <span
                            ref={el => {
                              if (el && item.chord) {
                                chordElementsRef.current.set(chordKey, {
                                  element: el,
                                  chordName: item.chord,
                                });
                              }
                            }}
                            className={cn(styles.ugChord, isActive && styles.chordActive)}
                            onClick={() => item.chord && setCurrentChord(item.chord)}
                          >
                            {item.chord || '\u00A0'}
                          </span>
                          <span className={styles.ugLyric}>{item.lyric}</span>
                        </span>
                      );
                    })}
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>

      {/* Instrument Toggle and Display */}
      <div className="mt-6">
        {/* Instrument Toggle */}
        <div className="flex gap-2 justify-center bg-[#0a1744]/30 p-3 rounded-lg border border-sapphire-500/15 max-w-md mx-auto mb-4">
          <Button
            variant={instrument === 'guitar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setInstrument('guitar')}
            className="gap-2 flex-1"
          >
            <Guitar className="h-4 w-4" />
            Guitar
          </Button>
          <Button
            variant={instrument === 'piano' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setInstrument('piano')}
            className="gap-2 flex-1"
          >
            <Piano className="h-4 w-4" />
            Piano
          </Button>
        </div>

        {/* Instrument Display */}
        {instrument === 'guitar' ? (
          <ChordDisplay chordName={currentChord} />
        ) : (
          <PianoDisplay chordName={currentChord} />
        )}
      </div>
    </div>
  );
}

export default SongClient;
