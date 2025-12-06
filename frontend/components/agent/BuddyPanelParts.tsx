'use client';

import { useState, useRef, useEffect, type FormEvent, type RefObject } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Minimize2, Maximize2, GripHorizontal, PanelRight, Maximize, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Home, Music, Users, PenLine, Guitar, BookOpen, Clock, Piano, SlidersHorizontal, Send, Layers, Radio, Headphones, Feather, AudioWaveform, Disc3 as Turntable } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RandomLoader } from '@/components/ui/loaders/RandomLoader';
import { cn } from '@/lib/utils';
import type { BuddyMessage, Suggestion, DockEdge, DockMode } from '@/lib/types/buddy.types';
import type { SearchResult } from '@/lib/types';
import {
  ContextChip,
  SearchResultButton,
  StructuredBlock,
  EmptyState,
} from '@/components/agent/BuddySubComponents';
import {
  BUDDY_NAV_ROUTES,
  BUDDY_MAX_VISIBLE_RESULTS,
  BUDDY_INPUT_PLACEHOLDER,
  BUDDY_ICON_GLOW_ANIMATION,
  BUDDY_ICON_GLOW_TRANSITION,
  BUDDY_SCROLL_CONTAINER_CLASS,
  BUDDY_GRADIENT_ICON_BOX,
  BUDDY_GRADIENT_USER_MSG,
  BUDDY_GRADIENT_SEND_BTN,
  BUDDY_EDGE_PICKER_VARIANTS,
  BUDDY_EDGE_PICKER_CONTAINER,
} from '@/lib/constants/buddy.constants';

const NAV_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  home: Home, music: Music, users: Users, pen: PenLine, guitar: Guitar,
  book: BookOpen, clock: Clock, piano: Piano, sliders: SlidersHorizontal,
  layers: Layers, radio: Radio, headphones: Headphones, feather: Feather,
  waveform: AudioWaveform, turntable: Turntable,
};

const EDGE_ARROWS: { edge: DockEdge; Icon: typeof ChevronUp; position: string }[] = [
  { edge: 'top', Icon: ChevronUp, position: 'top-0 left-1/2 -translate-x-1/2' },
  { edge: 'bottom', Icon: ChevronDown, position: 'bottom-0 left-1/2 -translate-x-1/2' },
  { edge: 'left', Icon: ChevronLeft, position: 'left-0 top-1/2 -translate-y-1/2' },
  { edge: 'right', Icon: ChevronRight, position: 'right-0 top-1/2 -translate-y-1/2' },
];

interface EdgePickerProps {
  currentEdge: DockEdge;
  onSelectEdge: (edge: DockEdge) => void;
  onClose: () => void;
}

function EdgePicker({ currentEdge, onSelectEdge, onClose }: EdgePickerProps) {
  return (
    <motion.div
      variants={BUDDY_EDGE_PICKER_CONTAINER}
      initial="hidden"
      animate="visible"
      className="relative w-20 h-20"
    >
      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-blue-500/30" />

      {/* Directional arrows */}
      {EDGE_ARROWS.map(({ edge, Icon, position }) => (
        <motion.button
          key={edge}
          variants={BUDDY_EDGE_PICKER_VARIANTS}
          onClick={() => { onSelectEdge(edge); onClose(); }}
          className={cn(
            'absolute p-1.5 rounded-lg transition-all duration-150',
            position,
            currentEdge === edge
              ? 'bg-gradient-to-br from-blue-500/40 to-purple-500/40 text-white scale-110'
              : 'text-white/50 hover:text-white hover:bg-white/10 hover:scale-110'
          )}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon className="h-4 w-4" />
        </motion.button>
      ))}
    </motion.div>
  );
}

interface DockToggleProps {
  dockMode: DockMode;
  dockEdge: DockEdge;
  onToggleDock: () => void;
  onSelectEdge: (edge: DockEdge) => void;
}

function DockToggle({ dockMode, dockEdge, onToggleDock, onSelectEdge }: DockToggleProps) {
  const [showPicker, setShowPicker] = useState(false);
  const isDocked = dockMode === 'docked';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDocked) {
      onToggleDock();
    } else {
      setShowPicker(true);
    }
  };

  return (
    <Popover open={showPicker} onOpenChange={setShowPicker}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={HEADER_BUTTON_CLASS}
          onClick={handleClick}
          title={isDocked ? 'Float freely' : 'Dock to edge'}
        >
          {isDocked ? <Maximize className="h-3.5 w-3.5" /> : <PanelRight className="h-3.5 w-3.5" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="center"
        className="w-auto p-3 bg-slate-900/95 backdrop-blur-xl border-white/10"
      >
        <div className="text-[10px] text-white/50 text-center mb-2 uppercase tracking-wider">Pick edge</div>
        <EdgePicker
          currentEdge={dockEdge}
          onSelectEdge={(edge) => {
            onSelectEdge(edge);
            if (!isDocked) onToggleDock();
          }}
          onClose={() => setShowPicker(false)}
        />
      </PopoverContent>
    </Popover>
  );
}

interface BuddyHeaderProps {
  context: { page: string; artist?: string; song?: string };
  isStatic: boolean;
  isOnboarding: boolean;
  isMinimized: boolean;
  dockMode: DockMode;
  dockEdge: DockEdge;
  onMinimize: () => void;
  onClose: () => void;
  onSkip?: () => void;
  onToggleDock: () => void;
  onSelectEdge: (edge: DockEdge) => void;
}

const HEADER_BUTTON_CLASS = 'h-7 w-7 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors';
const RESULT_LABEL_CLASS = 'text-[9px] uppercase tracking-widest text-white/40 mb-1';

function ResultSection({ label, results, type, onSelect, disabled }: {
  label: string;
  results: SearchResult[];
  type: 'chord' | 'tab';
  onSelect: (result: SearchResult, type: 'chord' | 'tab') => void;
  disabled: boolean;
}) {
  if (results.length === 0) return null;
  return (
    <div>
      <div className={RESULT_LABEL_CLASS}>{label}</div>
      {results.slice(0, BUDDY_MAX_VISIBLE_RESULTS).map(result => (
        <SearchResultButton key={result.id} result={result} type={type} onClick={onSelect} disabled={disabled} />
      ))}
    </div>
  );
}

function BuddyHeaderControls({ isStatic, isOnboarding, isMinimized, dockMode, dockEdge, onMinimize, onClose, onSkip, onToggleDock, onSelectEdge }: Omit<BuddyHeaderProps, 'context'>) {
  if (isOnboarding) {
    return (
      <Button variant="outline" size="sm" className="h-6 px-2 text-xs text-white/40 hover:text-white/80 hover:bg-white/10" onClick={onSkip}>
        Skip
      </Button>
    );
  }

  if (isStatic) return null;

  const isDocked = dockMode === 'docked';

  return (
    <div className="flex items-center gap-0.5">
      <DockToggle
        dockMode={dockMode}
        dockEdge={dockEdge}
        onToggleDock={onToggleDock}
        onSelectEdge={onSelectEdge}
      />
      <div className="w-px h-4 bg-white/10 mx-1" />
      {!isDocked && (
        <Button variant="ghost" size="icon" className={HEADER_BUTTON_CLASS} onClick={(e) => { e.stopPropagation(); onMinimize(); }}>
          {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
        </Button>
      )}
      <Button variant="ghost" size="icon" className={HEADER_BUTTON_CLASS} onClick={(e) => { e.stopPropagation(); onClose(); }}>
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

export function BuddyHeader({ context, isStatic, isOnboarding, isMinimized, dockMode, dockEdge, onMinimize, onClose, onSkip, onToggleDock, onSelectEdge }: BuddyHeaderProps) {
  const isDocked = dockMode === 'docked';
  return (
    <div className={cn('flex items-center justify-between px-4 py-3 border-b border-white/5 select-none', !isStatic && !isDocked && 'cursor-grab active:cursor-grabbing')}>
      <div className="flex items-center gap-2.5">
        {!isStatic && !isDocked && <GripHorizontal className="h-4 w-4 text-white/15" />}
        <motion.div
          animate={BUDDY_ICON_GLOW_ANIMATION}
          transition={BUDDY_ICON_GLOW_TRANSITION}
          className={cn('h-7 w-7', BUDDY_GRADIENT_ICON_BOX)}
        >
          <Bot className="h-4 w-4 text-blue-400" />
        </motion.div>
        <div className="flex flex-col">
          <span className="font-semibold text-sm text-white/90">Buddy</span>
          {!isMinimized && !isStatic && <ContextChip />}
        </div>
      </div>
      <BuddyHeaderControls {...{ isStatic, isOnboarding, isMinimized, dockMode, dockEdge, onMinimize, onClose, onSkip, onToggleDock, onSelectEdge }} />
    </div>
  );
}

interface BuddyNavBarProps {
  onNavigate?: (path: string) => void;
}

export function BuddyNavBar({ onNavigate }: BuddyNavBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (path: string) => {
    router.push(path);
    onNavigate?.(path);
  };

  return (
    <nav className="relative border-b border-white/5 bg-white/[0.02]">
      <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-slate-900/95 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-slate-900/95 to-transparent z-10 pointer-events-none" />
      <div className="flex items-center justify-center gap-0.5 px-4 py-2 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {BUDDY_NAV_ROUTES.map(route => {
          const Icon = NAV_ICONS[route.icon];
          const isActive = pathname === route.path || pathname?.startsWith(route.path);
          return (
            <button
              key={route.path}
              onClick={() => handleClick(route.path)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-medium transition-all whitespace-nowrap shrink-0',
                isActive ? 'bg-white/10 text-white shadow-sm' : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              )}
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              <span>{route.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

interface BuddyMessageListProps {
  messages: BuddyMessage[];
  isLoading: boolean;
  isThinking: boolean;
  thinkingPun: string;
  placeholder: string;
  isSaving: boolean;
  onSelectSuggestion: (suggestion: Suggestion) => void;
  onSelectResult: (result: SearchResult, type: 'chord' | 'tab') => void;
}

export function BuddyMessageList({ messages, isLoading, isThinking, thinkingPun, placeholder, isSaving, onSelectSuggestion, onSelectResult }: BuddyMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isEmptyState = messages.length === 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check if the last message is an empty streaming assistant message
  const lastMessage = messages[messages.length - 1];
  const isStreamingEmpty = isLoading && lastMessage?.role === 'assistant' && !lastMessage?.content;

  return (
    <div className={BUDDY_SCROLL_CONTAINER_CLASS}>
      <AnimatePresence mode="wait">
        {isEmptyState && !isLoading && <EmptyState placeholder={placeholder} />}
      </AnimatePresence>

      {messages.map((message, i) => {
        const isLastEmptyStreaming = i === messages.length - 1 && isStreamingEmpty;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start', isLastEmptyStreaming && 'justify-center w-full')}
          >
            {/* Centered loader without background when streaming empty */}
            {isLastEmptyStreaming ? (
              <div className="py-6">
                <RandomLoader size="lg" />
              </div>
            ) : (
            <div className={cn(
              'max-w-[85%] rounded-xl px-3 py-2 text-xs',
              message.role === 'user'
                ? BUDDY_GRADIENT_USER_MSG
                : 'bg-white/5 border border-white/10 text-white/80'
            )}>
              <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>

              {message.structured && <StructuredBlock data={message.structured} />}

              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {message.suggestions.map((suggestion, idx) => (
                    <button
                      key={`${suggestion.artist}-${suggestion.title}-${idx}`}
                      onClick={() => onSelectSuggestion(suggestion)}
                      disabled={isLoading || isSaving}
                      className="px-2 py-0.5 rounded-md bg-white/10 border border-white/10 hover:border-white/20 hover:bg-white/15 transition-all text-[10px] font-medium text-white/70 disabled:opacity-50"
                    >
                      {suggestion.title}
                    </button>
                  ))}
                </div>
              )}

              {message.results && (message.results.chords.length > 0 || message.results.tabs.length > 0) && (
                <div className="mt-2 space-y-2">
                  <ResultSection label="Chords" results={message.results.chords} type="chord" onSelect={onSelectResult} disabled={isSaving} />
                  <ResultSection label="Tabs" results={message.results.tabs} type="tab" onSelect={onSelectResult} disabled={isSaving} />
                </div>
              )}
            </div>
            )}
          </motion.div>
        );
      })}

      {/* Thinking indicator - shows when agent is processing between tool calls (not during loading) */}
      {isThinking && !isLoading && messages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-start"
        >
          <div className="w-4 h-4">
            <RandomLoader size="sm" />
          </div>
        </motion.div>
      )}

      <div ref={messagesEndRef} data-buddy-messages-end />
    </div>
  );
}

interface BuddyInputProps {
  input: string;
  isLoading: boolean;
  isSaving: boolean;
  isOnboarding: boolean;
  typingText?: string;
  inputRef: RefObject<HTMLInputElement | null>;
  onInputChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export function BuddyInput({ input, isLoading, isSaving, isOnboarding, typingText, inputRef, onInputChange, onSubmit }: BuddyInputProps) {
  return (
    <form onSubmit={onSubmit} data-buddy-form className="px-4 py-3 border-t border-white/5">
      <div className="flex gap-2">
        {isOnboarding ? (
          <div className="flex-1 h-9 bg-white/5 border border-white/10 rounded-lg px-3 flex items-center text-xs text-white/80">
            {typingText}
            {typingText && <span className="ml-0.5 w-0.5 h-4 bg-blue-400 animate-pulse" />}
          </div>
        ) : (
          <Input
            ref={inputRef}
            value={input}
            onChange={e => onInputChange(e.target.value)}
            placeholder={BUDDY_INPUT_PLACEHOLDER}
            disabled={isLoading || isSaving}
            className="flex-1 h-9 bg-white/5 border-white/10 focus:border-blue-500/50 text-xs text-white placeholder:text-white/30 rounded-lg"
          />
        )}
        {!isOnboarding && (
          <Button
            type="submit"
            size="icon"
            className={cn('h-9 w-9 rounded-lg', BUDDY_GRADIENT_SEND_BTN)}
            disabled={isLoading || isSaving || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
}
