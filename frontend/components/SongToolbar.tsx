'use client';

import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronUp,
  Play,
  Square,
  Volume2,
  VolumeX,
  Trash2,
  Settings2,
  Music,
  Gauge,
  RotateCcw,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export const KEY_SIGNATURES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const;

interface SongToolbarProps {
  transpose: number;
  onTransposeChange: (value: number) => void;
  currentKey: string;
  onKeyChange: (key: string) => void;
  originalKey?: string;
  bpm: number;
  onBpmChange: (value: number) => void;
  isAutoScrollEnabled: boolean;
  onToggleAutoScroll: () => void;
  isAudioEnabled: boolean;
  onToggleAudio: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export function SongToolbar({
  transpose,
  onTransposeChange,
  currentKey,
  onKeyChange,
  originalKey,
  bpm,
  onBpmChange,
  isAutoScrollEnabled,
  onToggleAutoScroll,
  isAudioEnabled,
  onToggleAudio,
  onDelete,
  isDeleting,
}: SongToolbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleKeyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onKeyChange(e.target.value);
  };

  return (
    <>
      {/* Mobile: Minimal bar + sheet */}
      <div className="md:hidden">
        <div className="flex items-center justify-between gap-2 p-2 bg-background/90 backdrop-blur-sm border border-border/50 rounded-xl">
          {/* Play Button - Hero */}
          <Button
            variant={isAutoScrollEnabled ? 'default' : 'outline'}
            size="lg"
            onClick={onToggleAutoScroll}
            className={cn(
              'h-11 px-5 gap-2 rounded-xl font-semibold',
              isAutoScrollEnabled && 'bg-gradient-to-r from-blue-500 to-purple-500'
            )}
          >
            {isAutoScrollEnabled ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isAutoScrollEnabled ? 'Stop' : 'Play'}
          </Button>

          {/* Quick Stats */}
          <div className="flex items-center gap-3 text-sm">
            <span className="font-mono font-bold text-foreground">{currentKey}</span>
            <span className="text-muted-foreground">|</span>
            <span className="font-mono text-muted-foreground">{bpm} BPM</span>
          </div>

          {/* Settings Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMenuOpen(true)}
            className="h-11 w-11 rounded-xl"
          >
            <Settings2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Settings Sheet */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              />

              {/* Sheet */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950 rounded-t-3xl border-t border-white/10 max-h-[85vh] overflow-y-auto"
              >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-12 h-1.5 bg-white/20 rounded-full" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-6 pb-4">
                  <h2 className="text-xl font-bold text-white">Song Settings</h2>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsMenuOpen(false)}
                    className="h-10 w-10 rounded-full text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="px-6 pb-8 space-y-6">
                  {/* Key Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-white/60">
                      <Music className="h-4 w-4" />
                      <span className="text-sm font-medium uppercase tracking-wider">
                        Key & Transpose
                      </span>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 space-y-4">
                      {/* Key Selector */}
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Key</span>
                        <div className="flex gap-1 flex-wrap justify-end">
                          {KEY_SIGNATURES.map(key => (
                            <button
                              key={key}
                              onClick={() => onKeyChange(key)}
                              className={cn(
                                'w-9 h-9 rounded-lg text-sm font-semibold transition-all',
                                currentKey === key
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                              )}
                            >
                              {key}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Transpose */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-white/80">Transpose</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onTransposeChange(transpose - 1)}
                            className="h-10 w-10 rounded-xl border-white/20 bg-white/5 hover:bg-white/10"
                          >
                            <ChevronDown className="h-5 w-5" />
                          </Button>
                          <span className="w-12 text-center text-xl font-mono font-bold text-white">
                            {transpose >= 0 ? `+${transpose}` : transpose}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onTransposeChange(transpose + 1)}
                            className="h-10 w-10 rounded-xl border-white/20 bg-white/5 hover:bg-white/10"
                          >
                            <ChevronUp className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>

                      {originalKey && (
                        <div className="text-xs text-white/40 text-right">
                          Original: {originalKey}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tempo Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-white/60">
                      <Gauge className="h-4 w-4" />
                      <span className="text-sm font-medium uppercase tracking-wider">Tempo</span>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">BPM</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onBpmChange(Math.max(40, bpm - 5))}
                            className="h-10 w-10 rounded-xl border-white/20 bg-white/5 hover:bg-white/10"
                          >
                            <ChevronDown className="h-5 w-5" />
                          </Button>
                          <input
                            type="number"
                            value={bpm}
                            onChange={e => {
                              const val = Number(e.target.value);
                              if (Number.isFinite(val) && val >= 0) onBpmChange(val);
                            }}
                            className="w-20 h-10 text-center text-xl font-mono font-bold bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onBpmChange(Math.min(300, bpm + 5))}
                            className="h-10 w-10 rounded-xl border-white/20 bg-white/5 hover:bg-white/10"
                          >
                            <ChevronUp className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Audio Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-white/60">
                      <Volume2 className="h-4 w-4" />
                      <span className="text-sm font-medium uppercase tracking-wider">Audio</span>
                    </div>
                    <button
                      onClick={onToggleAudio}
                      className={cn(
                        'w-full flex items-center justify-between p-4 rounded-2xl transition-all',
                        isAudioEnabled ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-white/5'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {isAudioEnabled ? (
                          <Volume2 className="h-5 w-5 text-blue-400" />
                        ) : (
                          <VolumeX className="h-5 w-5 text-white/40" />
                        )}
                        <span className="text-white">Chord Playback</span>
                      </div>
                      <div
                        className={cn(
                          'w-12 h-7 rounded-full transition-all relative',
                          isAudioEnabled ? 'bg-blue-500' : 'bg-white/20'
                        )}
                      >
                        <div
                          className={cn(
                            'absolute top-1 w-5 h-5 bg-white rounded-full transition-all',
                            isAudioEnabled ? 'left-6' : 'left-1'
                          )}
                        />
                      </div>
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        onTransposeChange(0);
                        onBpmChange(120);
                      }}
                      className="w-full h-12 rounded-xl border-white/20 bg-white/5 hover:bg-white/10 text-white gap-2"
                      disabled={transpose === 0 && bpm === 120}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset All Settings
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onDelete();
                      }}
                      disabled={isDeleting}
                      className="w-full h-12 rounded-xl gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Song
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop: Original inline toolbar */}
      <div className="hidden md:flex items-center gap-1 p-1.5 bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg shadow-sm">
        <Button
          variant={isAutoScrollEnabled ? 'default' : 'ghost'}
          size="sm"
          onClick={onToggleAutoScroll}
          className="h-8 px-3 gap-1.5"
        >
          {isAutoScrollEnabled ? (
            <Square className="h-3.5 w-3.5" />
          ) : (
            <Play className="h-3.5 w-3.5" />
          )}
          <span className="text-xs font-medium">{isAutoScrollEnabled ? 'Stop' : 'Play'}</span>
        </Button>

        <div className="w-px h-5 bg-border/50 mx-1" />

        <div className="flex items-center gap-0.5">
          <select
            value={currentKey}
            onChange={handleKeyChange}
            className="h-8 pl-2 pr-5 text-xs font-semibold bg-muted/30 border border-border/50 cursor-pointer hover:bg-muted/50 hover:border-border rounded transition-colors focus:outline-none focus:ring-1 focus:ring-sapphire-500/50 appearance-none"
          >
            {KEY_SIGNATURES.map(key => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTransposeChange(transpose - 1)}
            className="h-7 w-6 p-0"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
          <span className="w-6 text-center text-xs font-mono tabular-nums text-muted-foreground">
            {transpose >= 0 ? `+${transpose}` : transpose}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTransposeChange(transpose + 1)}
            className="h-7 w-6 p-0"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="w-px h-5 bg-border/50 mx-1" />

        <div className="flex items-center gap-0.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBpmChange(Math.max(40, bpm - 5))}
            className="h-7 w-6 p-0 text-muted-foreground hover:text-foreground"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
          <div className="flex items-center gap-1 px-1">
            <input
              type="number"
              value={bpm}
              onChange={e => {
                const val = Number(e.target.value);
                if (Number.isFinite(val) && val >= 0) onBpmChange(val);
              }}
              className="h-7 w-14 text-xs font-mono text-center bg-muted/30 border border-border/50 rounded hover:border-border focus:outline-none focus:ring-1 focus:ring-sapphire-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min={40}
              max={300}
            />
            <span className="text-[10px] text-muted-foreground font-medium">BPM</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBpmChange(Math.min(300, bpm + 5))}
            className="h-7 w-6 p-0 text-muted-foreground hover:text-foreground"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="w-px h-5 bg-border/50 mx-1" />

        <Button
          variant="outline"
          size="sm"
          onClick={onToggleAudio}
          className={`h-8 w-8 p-0 ${isAudioEnabled ? 'text-sapphire-400' : 'text-muted-foreground'}`}
        >
          {isAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          disabled={isDeleting}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
