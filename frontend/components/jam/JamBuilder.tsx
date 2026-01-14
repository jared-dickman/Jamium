'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  type ChordProgression,
  type JamChord,
  type SongSection,
  type LyricsSection,
  FUNCTION_COLORS,
  SECTION_COLORS,
  getNextChordSuggestions,
} from '@/lib/jamProgressions';
import { SectionTabs } from '@/components/jam/SectionTabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { cn, transposeChord } from '@/lib/utils';
import { SimpleTooltip } from '@/components/ui/simple-tooltip';
import { InfoCard } from '@/components/ui/info-card';
import { QUICK_TIPS } from '@/lib/constants/help-content.constants';
import { getChordPlayer } from '@/lib/audio/chordPlayer';
import {
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Plus,
  Music2,
  Volume2,
  VolumeX,
  ChevronDown,
  Save,
  Edit3,
  PenLine,
} from 'lucide-react';
import { ChordDisplay } from '@/components/ChordDisplay';
import { PianoDisplay } from '@/components/PianoDisplay';
import ChordPicker from '@/components/jam/ChordPicker';
import LyricsIdeasPanel from '@/components/jam/LyricsIdeasPanel';
import { motion, AnimatePresence } from 'framer-motion';

interface JamBuilderProps {
  progression: ChordProgression;
  onUpdate: (progression: ChordProgression) => void;
  onClear: () => void;
}

export default function JamBuilder({ progression, onUpdate, onClear }: JamBuilderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const [bpm, setBpm] = useState(progression.bpm);
  const [selectedInstrument, setSelectedInstrument] = useState<'guitar' | 'piano'>('guitar');
  const [showChordDisplay, setShowChordDisplay] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [loopCount, setLoopCount] = useState(0);
  const [editingChordIndex, setEditingChordIndex] = useState<number | null>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [activeSectionLabel, setActiveSectionLabel] = useState('A');
  const [showLyrics, setShowLyrics] = useState(false);
  const [lyrics, setLyrics] = useState<LyricsSection[]>([]);
  const [ideas, setIdeas] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);
  const [sections, setSections] = useState<Record<string, SongSection>>(() => ({
    A: {
      id: 'section-a',
      name: 'Verse',
      sectionType: 'verse',
      label: 'A',
      chords: progression.chords,
      vibe: progression.vibe,
      key: progression.key,
      difficulty: progression.difficulty,
      description: 'Main verse',
      bpm: progression.bpm,
    },
  }));

  // Song arrangement - order of sections to play (e.g., ['A', 'B', 'A', 'B', 'C'])
  const [arrangement, setArrangement] = useState<string[]>(['A']);

  // Get active section's chords (computed fresh each render for proper reactivity)
  const activeSection = sections[activeSectionLabel];
  const activeChords = activeSection?.chords ?? progression.chords;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const chordPlayerRef = useRef(getChordPlayer());

  // Calculate interval based on BPM and chord duration
  const getChordInterval = useCallback(
    (chord: JamChord) => {
      const beatsPerSecond = bpm / 60;
      const duration = chord.duration || 4;
      return (duration / beatsPerSecond) * 1000; // ms
    },
    [bpm]
  );

  // Play progression with audio (uses activeChords)
  useEffect(() => {
    if (isPlaying && activeChords.length > 0) {
      const currentChord = activeChords[currentChordIndex];
      if (!currentChord) return undefined;

      if (!isMuted && audioInitialized) {
        const duration = currentChord.duration || 4;
        chordPlayerRef.current.playChord(currentChord.name, duration);
      }

      const interval = getChordInterval(currentChord);

      intervalRef.current = setTimeout(() => {
        const nextIndex = currentChordIndex + 1;
        if (nextIndex >= activeChords.length) {
          setCurrentChordIndex(0);
          setLoopCount(prev => prev + 1);
        } else {
          setCurrentChordIndex(nextIndex);
        }
      }, interval);

      return () => {
        if (intervalRef.current) clearTimeout(intervalRef.current);
      };
    }
    return undefined;
  }, [isPlaying, currentChordIndex, activeChords, isMuted, audioInitialized, getChordInterval]);

  const handlePlayPause = async () => {
    // Initialize audio on first play
    if (!audioInitialized) {
      await chordPlayerRef.current.initialize();
      setAudioInitialized(true);
    }

    if (isPlaying) {
      setIsPlaying(false);
      chordPlayerRef.current.stop();
      if (intervalRef.current) clearTimeout(intervalRef.current);
    } else {
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentChordIndex(0);
    setLoopCount(0);
    if (intervalRef.current) clearTimeout(intervalRef.current);
  };

  // Helper to update active section's chords and sync to parent
  const updateActiveChords = useCallback(
    (newChords: JamChord[]) => {
      setSections(prev => ({
        ...prev,
        [activeSectionLabel]: {
          ...prev[activeSectionLabel]!,
          chords: newChords,
        },
      }));
      onUpdate({ ...progression, chords: newChords });
    },
    [activeSectionLabel, progression, onUpdate]
  );

  const handleAddChord = () => {
    const lastChord = activeChords[activeChords.length - 1];
    const suggestions = getNextChordSuggestions(lastChord?.name || 'C', progression.key, 'pop');
    const newChord: JamChord = {
      name: suggestions[0] || progression.key,
      function: 'tonic',
      duration: 4,
    };
    updateActiveChords([...activeChords, newChord]);
  };

  const handleRemoveChord = (index: number) => {
    if (activeChords.length <= 1) return;
    const newChords = activeChords.filter((_, i) => i !== index);
    updateActiveChords(newChords);
    if (currentChordIndex >= newChords.length) {
      setCurrentChordIndex(Math.max(0, newChords.length - 1));
    }
  };

  const handleUpdateChord = (index: number, updates: Partial<JamChord>) => {
    const newChords = activeChords.map((chord, i) =>
      i === index ? { ...chord, ...updates } : chord
    );
    updateActiveChords(newChords);
  };

  const handleTranspose = (steps: number) => {
    const newChords = activeChords.map(chord => ({
      ...chord,
      name: transposeChord(chord.name, steps),
    }));
    const newKey = transposeChord(progression.key, steps);

    // Update active section and parent
    setSections(prev => ({
      ...prev,
      [activeSectionLabel]: { ...prev[activeSectionLabel]!, chords: newChords },
    }));
    onUpdate({ ...progression, key: newKey, chords: newChords });
  };

  const handleAddSection = useCallback(() => {
    const existingLabels = Object.keys(sections);
    const nextLabels = ['B', 'C', 'D', 'E', 'X'];
    const newLabel = nextLabels.find(l => !existingLabels.includes(l)) ?? `S${existingLabels.length + 1}`;
    const sectionTypes: Array<'chorus' | 'bridge' | 'verse'> = ['chorus', 'bridge', 'verse'];
    const sectionType = sectionTypes[existingLabels.length % 3] ?? 'verse';

    // Copy current section's chords as starting point
    const startingChords = activeChords.length > 0 ? [...activeChords] : [{ name: progression.key, function: 'tonic' as const, duration: 4 }];

    setSections(prev => ({
      ...prev,
      [newLabel]: {
        id: `section-${newLabel.toLowerCase()}`,
        name: sectionType.charAt(0).toUpperCase() + sectionType.slice(1),
        sectionType,
        label: newLabel,
        chords: startingChords,
        vibe: progression.vibe,
        key: progression.key,
        difficulty: progression.difficulty,
        description: `${sectionType} section`,
        bpm: progression.bpm,
      },
    }));
    setArrangement(prev => [...prev, newLabel]);
    setActiveSectionLabel(newLabel);
    setCurrentChordIndex(0);
    onUpdate({ ...progression, chords: startingChords });
  }, [sections, activeChords, progression, onUpdate]);

  // Handle section switching - sync chords to parent and reset playback
  const handleSectionChange = useCallback(
    (label: string) => {
      setActiveSectionLabel(label);
      setCurrentChordIndex(0);
      const sectionChords = sections[label]?.chords ?? [];
      onUpdate({ ...progression, chords: sectionChords });
    },
    [sections, progression, onUpdate]
  );

  const currentChord = activeChords[currentChordIndex];

  // Handler for AI lyric/theme requests - triggers Buddy chat
  const handleAIRequest = useCallback(
    (action: 'generate_lyrics' | 'suggest_themes', sectionId?: string) => {
      setIsAILoading(true);
      const chordNames = activeChords.map(c => c.name).join(', ');
      const vibe = progression.vibe.join(', ');

      window.dispatchEvent(
        new CustomEvent('buddy:lyric-request', {
          detail: {
            action,
            chords: chordNames,
            key: progression.key,
            vibe,
            sectionId,
            sectionType: sectionId ? sections[sectionId]?.sectionType : 'verse',
          },
        })
      );

      setTimeout(() => setIsAILoading(false), 3000);
    },
    [activeChords, progression.key, progression.vibe, sections]
  );

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Quick Tips */}
      <InfoCard title="Quick Start" variant="tip" defaultVisible={progression.chords.length === 0}>
        <ul className="space-y-1 text-xs">
          {QUICK_TIPS.jam.map((tip, i) => (
            <li key={i}>• {tip}</li>
          ))}
        </ul>
      </InfoCard>

      {/* Header Controls */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <CardTitle className="text-xl md:text-2xl mb-1">{progression.name}</CardTitle>
                <motion.p
                  className="text-sm text-muted-foreground"
                  key={`${progression.key}-${activeChords.length}-${activeSectionLabel}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Key of {progression.key} • Section {activeSectionLabel} • {activeChords.length} chords
                </motion.p>
              </motion.div>
              <motion.div
                className="flex gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <SimpleTooltip content="Clear the entire progression">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="sm" onClick={onClear}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  </motion.div>
                </SimpleTooltip>
                <SimpleTooltip content="Save this progression for later">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="sm">
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                  </motion.div>
                </SimpleTooltip>
                <SimpleTooltip content={showLyrics ? 'Hide lyrics panel' : 'Show lyrics panel'}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="sm"
                      variant={showLyrics ? 'default' : 'outline'}
                      onClick={() => setShowLyrics(!showLyrics)}
                    >
                      <PenLine className="w-4 h-4 mr-1" />
                      Lyrics
                    </Button>
                  </motion.div>
                </SimpleTooltip>
              </motion.div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Playback Controls */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <SimpleTooltip
                content={isPlaying ? 'Pause playback' : 'Start playing the progression'}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" onClick={handlePlayPause} className="w-24">
                    <motion.div
                      key={isPlaying ? 'pause' : 'play'}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-5 h-5 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 mr-2" />
                          Play
                        </>
                      )}
                    </motion.div>
                  </Button>
                </motion.div>
              </SimpleTooltip>

              <SimpleTooltip content="Reset to the first chord">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="lg" onClick={handleReset}>
                    <motion.div whileHover={{ rotate: -180 }} transition={{ duration: 0.3 }}>
                      <RotateCcw className="w-5 h-5 mr-2" />
                    </motion.div>
                    Reset
                  </Button>
                </motion.div>
              </SimpleTooltip>

              <SimpleTooltip content={isMuted ? 'Unmute audio' : 'Mute audio'}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={isMuted ? { opacity: 0.5 } : { opacity: 1 }}
                >
                  <Button variant="outline" size="lg" onClick={() => setIsMuted(!isMuted)}>
                    <motion.div
                      key={isMuted ? 'muted' : 'unmuted'}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </motion.div>
                  </Button>
                </motion.div>
              </SimpleTooltip>

              <SimpleTooltip content="Number of times the progression has looped">
                <motion.div
                  className="ml-auto text-sm text-muted-foreground cursor-help"
                  key={loopCount}
                  initial={{ scale: 1.2, color: 'var(--sapphire-400)' }}
                  animate={{ scale: 1, color: 'currentColor' }}
                  transition={{ duration: 0.3 }}
                >
                  Loop: {loopCount}
                </motion.div>
              </SimpleTooltip>
            </motion.div>

            {/* BPM Control */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <motion.label
                  className="text-sm font-medium"
                  key={bpm}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 0.2 }}
                >
                  Tempo: {bpm} BPM
                </motion.label>
                <div className="flex gap-2">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setBpm(Math.max(40, bpm - 5))}
                    >
                      -5
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setBpm(Math.min(200, bpm + 5))}
                    >
                      +5
                    </Button>
                  </motion.div>
                </div>
              </div>
              <Slider
                value={[bpm]}
                onValueChange={value => setBpm(value[0] ?? 120)}
                min={40}
                max={200}
                step={1}
                className="w-full"
              />
            </motion.div>

            {/* Key Transpose */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <label className="text-sm font-medium">Transpose Key</label>
              <div className="flex gap-2">
                <motion.div
                  className="flex-1"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button variant="outline" onClick={() => handleTranspose(-1)} className="w-full">
                    -1 ♭
                  </Button>
                </motion.div>
                <motion.div
                  className="flex-1"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button variant="outline" onClick={() => handleTranspose(1)} className="w-full">
                    +1 ♯
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Instrument Toggle */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              <label className="text-sm font-medium">Instrument</label>
              <div className="flex gap-2 relative">
                <motion.div
                  className="absolute inset-0 bg-primary/20 rounded-md"
                  initial={false}
                  animate={{
                    x: selectedInstrument === 'guitar' ? 0 : '100%',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  style={{ width: '50%' }}
                />
                <motion.div
                  className="flex-1"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    variant={selectedInstrument === 'guitar' ? 'default' : 'outline'}
                    onClick={() => setSelectedInstrument('guitar')}
                    className="w-full relative z-10"
                  >
                    Guitar
                  </Button>
                </motion.div>
                <motion.div
                  className="flex-1"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    variant={selectedInstrument === 'piano' ? 'default' : 'outline'}
                    onClick={() => setSelectedInstrument('piano')}
                    className="w-full relative z-10"
                  >
                    Piano
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Section Tabs - for editing individual sections */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.3 }}
      >
        <SectionTabs
          sections={sections}
          activeSectionLabel={activeSectionLabel}
          onSectionChange={handleSectionChange}
          onAddSection={handleAddSection}
        />
      </motion.div>

      {/* Song Arrangement - order sections play in */}
      <Card className="border-dashed">
        <CardHeader className="py-3">
          <CardTitle className="text-sm flex items-center justify-between">
            <span>Song Arrangement</span>
            <span className="text-xs text-muted-foreground font-normal">
              Click section to add • Click chip to remove
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2 items-center min-h-[2.5rem]">
            {arrangement.map((label, i) => (
              <motion.button
                key={`${label}-${i}`}
                onClick={() => setArrangement(prev => prev.filter((_, idx) => idx !== i))}
                className="px-3 py-1 rounded-md text-sm font-bold border-2 hover:opacity-70 transition-opacity"
                style={{
                  backgroundColor: `${SECTION_COLORS[label] ?? SECTION_COLORS.C}20`,
                  borderColor: SECTION_COLORS[label] ?? SECTION_COLORS.C,
                  color: SECTION_COLORS[label] ?? SECTION_COLORS.C,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {label}
              </motion.button>
            ))}
            <span className="text-muted-foreground mx-2">|</span>
            {Object.keys(sections).sort().map(label => (
              <motion.button
                key={`add-${label}`}
                onClick={() => setArrangement(prev => [...prev, label])}
                className="px-2 py-0.5 rounded text-xs border border-dashed hover:border-solid transition-all"
                style={{ borderColor: SECTION_COLORS[label] ?? SECTION_COLORS.C }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                +{label}
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chord Progression Builder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.3 }}
              >
                Chord Progression — Section {activeSectionLabel}
              </motion.span>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.3, type: 'spring' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="sm" onClick={handleAddChord}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Chord
                </Button>
              </motion.div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 1.1,
                  },
                },
              }}
            >
              {activeChords.map((chord, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.8 },
                    show: { opacity: 1, y: 0, scale: 1 },
                  }}
                  className={cn(
                    'relative p-4 rounded-lg border-2 transition-all duration-200',
                    'hover:shadow-md cursor-pointer group',
                    currentChordIndex === index && isPlaying
                      ? 'border-sapphire-500 shadow-lg shadow-sapphire-500/20 scale-105'
                      : 'border-sapphire-500/10'
                  )}
                  style={{
                    backgroundColor:
                      currentChordIndex === index && isPlaying
                        ? `${FUNCTION_COLORS[chord.function]}20`
                        : `${FUNCTION_COLORS[chord.function]}10`,
                  }}
                  onClick={() => setEditingChordIndex(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  animate={
                    currentChordIndex === index && isPlaying
                      ? {
                          boxShadow: [
                            `0 0 0px ${FUNCTION_COLORS[chord.function]}40`,
                            `0 0 20px ${FUNCTION_COLORS[chord.function]}60`,
                            `0 0 0px ${FUNCTION_COLORS[chord.function]}40`,
                          ],
                        }
                      : {}
                  }
                  transition={{
                    boxShadow: {
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }}
                >
                  {/* Delete button */}
                  {activeChords.length > 1 && (
                    <motion.button
                      onClick={e => {
                        e.stopPropagation();
                        handleRemoveChord(index);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center z-10"
                      whileHover={{ scale: 1.2, rotate: 90 }}
                      whileTap={{ scale: 0.8 }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </motion.button>
                  )}

                  {/* Edit button */}
                  <motion.button
                    onClick={e => {
                      e.stopPropagation();
                      setEditingChordIndex(index);
                    }}
                    className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-sapphire-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit3 className="w-3 h-3" />
                  </motion.button>

                  <div className="text-center">
                    <motion.div
                      className="text-2xl font-bold mb-1"
                      key={chord.name}
                      initial={{ scale: 1.3, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    >
                      {chord.name}
                    </motion.div>
                    <motion.div
                      className="text-xs capitalize mb-2"
                      style={{ color: FUNCTION_COLORS[chord.function] }}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {chord.function}
                    </motion.div>
                    <Input
                      type="number"
                      value={chord.duration || 4}
                      onChange={e =>
                        handleUpdateChord(index, {
                          duration: parseInt(e.target.value) || 4,
                        })
                      }
                      onClick={e => e.stopPropagation()}
                      className="h-8 text-xs text-center"
                      min={1}
                      max={16}
                    />
                    <div className="text-xs text-muted-foreground mt-1">beats</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Current Chord Display */}
      <AnimatePresence mode="wait">
        {showChordDisplay && currentChord && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <motion.span
                    key={currentChord.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    Current Chord: {currentChord.name}
                  </motion.span>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button variant="outline" size="sm" onClick={() => setShowChordDisplay(false)}>
                      <motion.div
                        animate={{ rotate: showChordDisplay ? 0 : 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </Button>
                  </motion.div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  key={currentChord.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {selectedInstrument === 'guitar' ? (
                    <ChordDisplay chordName={currentChord.name} />
                  ) : (
                    <PianoDisplay chordName={currentChord.name} />
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!showChordDisplay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button variant="outline" className="w-full" onClick={() => setShowChordDisplay(true)}>
              <Music2 className="w-4 h-4 mr-2" />
              Show Chord Voicings
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lyrics & Ideas Panel */}
      <AnimatePresence>
        {showLyrics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LyricsIdeasPanel
              lyrics={lyrics}
              ideas={ideas}
              sections={sections}
              currentKey={progression.key}
              currentVibe={progression.vibe}
              onLyricsChange={setLyrics}
              onIdeasChange={setIdeas}
              onRequestAI={handleAIRequest}
              isAILoading={isAILoading}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chord Picker Modal */}
      {editingChordIndex !== null && activeChords[editingChordIndex] && (
        <ChordPicker
          isOpen={true}
          onClose={() => setEditingChordIndex(null)}
          currentChord={activeChords[editingChordIndex]!}
          suggestedKey={progression.key}
          onSelectChord={chordName => {
            handleUpdateChord(editingChordIndex, { name: chordName });
            setEditingChordIndex(null);
          }}
        />
      )}
    </motion.div>
  );
}
