'use client';

import { useState, useRef, useEffect, useCallback, useMemo, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send } from 'lucide-react';
import type { DockEdge, DockMode } from '@/lib/types/buddy.types';
import { useIntervalEffect } from '@/lib/hooks/useIntervalEffect';
import { useBuddyChat } from '@/lib/hooks/useBuddyChat';
import { useBuddyPanelState, clampPosition, getDockedStyle } from '@/lib/hooks/useBuddyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RandomLoader } from '@/components/ui/loaders/RandomLoader';
import { cn, selectRandomWithFallback } from '@/lib/utils';
import { useBuddy } from '@/lib/contexts/BuddyContext';
import type { SearchResult } from '@/lib/types';
import type { BuddyMessage } from '@/lib/types/buddy.types';
import type { OnboardingState } from '@/lib/hooks/useOnboardingDemo';
import placeholders from '@/lib/data/placeholders.json';
import {
  BuddyHeader,
  BuddyNavBar,
  BuddyMessageList,
  BuddyInput,
} from '@/components/agent/BuddyPanelParts';
import { ContextChip } from '@/components/agent/BuddySubComponents';
import {
  BUDDY_PLACEHOLDER_INTERVAL_MS,
  BUDDY_FIRST_LOAD_VARIANTS,
  BUDDY_LANDING_VARIANTS,
  BUDDY_PANEL_VARIANTS,
  BUDDY_GLOW_VARIANTS,
  BUDDY_MINIMIZED_VARIANTS,
  BUDDY_AUTOFOCUS_DELAY_MS,
  BUDDY_ENTRANCE_DELAY_MS,
  BUDDY_FIRST_LOAD_DELAY_MS,
  BUDDY_DEFAULT_PLACEHOLDER,
  BUDDY_PANEL_WIDTH,
  BUDDY_PANEL_HEIGHT,
  BUDDY_HEADER_HEIGHT,
  BUDDY_INPUT_PLACEHOLDER,
  BUDDY_ICON_GLOW_ANIMATION,
  BUDDY_ICON_GLOW_TRANSITION,
  BUDDY_SCROLL_CONTAINER_CLASS,
  BUDDY_GRADIENT_ICON_BOX,
  BUDDY_DOCK_SPRING,
  BUDDY_DOCKED_HEIGHT,
} from '@/lib/constants/buddy.constants';

interface CoreAgentBuddyProps {
  onSave?: (result: SearchResult, type: 'chord' | 'tab') => void;
  isSaving?: boolean;
  isLanding?: boolean;
  onboarding?: OnboardingState;
}

export function CoreAgentBuddy({ onSave, isSaving = false, isLanding = false, onboarding }: CoreAgentBuddyProps) {
  const { context, isOpen, setIsOpen, expandSignal } = useBuddy();
  const isOnboarding = !!onboarding;
  const isStatic = isLanding || isOnboarding;

  const chat = useBuddyChat({ context, onSave });
  const inputRef = useRef<HTMLInputElement>(null);

  // Consolidated panel state (position, dock, minimize) with localStorage persistence
  const {
    position, setPosition, isMinimized, setIsMinimized,
    dockMode, dockEdge, setDockEdge, handleToggleDock, handleDragEnd, isDocked
  } = useBuddyPanelState(isStatic);

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(() =>
    selectRandomWithFallback(placeholders, BUDDY_DEFAULT_PLACEHOLDER)
  );

  const displayMessages = isOnboarding ? (onboarding?.messages as BuddyMessage[]) : chat.messages;
  const displayLoading = isOnboarding ? onboarding?.isLoading : chat.isLoading;
  const displayThinking = isOnboarding ? false : chat.isThinking;
  const displayInput = isOnboarding ? onboarding?.typingText : chat.input;
  const isEmptyState = displayMessages.length === 0;
  const shouldRotatePlaceholder = isEmptyState && isOpen && !isMinimized && !isStatic;

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), BUDDY_ENTRANCE_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // Expand when explicitly summoned (button/shortcut)
  useEffect(() => {
    if (expandSignal > 0) {
      setIsMinimized(false);
    }
  }, [expandSignal, setIsMinimized]);

  const handleAnimationComplete = useCallback(() => {
    if (isFirstLoad) {
      setTimeout(() => setIsFirstLoad(false), BUDDY_FIRST_LOAD_DELAY_MS);
    }
  }, [isFirstLoad]);

  useEffect(() => {
    // Autofocus when buddy is visible and expanded (including static/onboarding mode)
    const isVisible = isStatic || isOpen;
    if (isVisible && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), BUDDY_AUTOFOCUS_DELAY_MS);
    }
  }, [isOpen, isMinimized, isStatic]);

  // Auto-focus input when thinking/loading finishes
  const wasProcessingRef = useRef(false);
  useEffect(() => {
    const isProcessing = chat.isLoading || chat.isThinking;
    if (wasProcessingRef.current && !isProcessing) {
      setTimeout(() => inputRef.current?.focus(), BUDDY_AUTOFOCUS_DELAY_MS);
    }
    wasProcessingRef.current = isProcessing;
  }, [chat.isLoading, chat.isThinking]);

  useIntervalEffect(
    () => setCurrentPlaceholder(selectRandomWithFallback(placeholders, BUDDY_DEFAULT_PLACEHOLDER)),
    BUDDY_PLACEHOLDER_INTERVAL_MS,
    shouldRotatePlaceholder
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    chat.sendMessage(chat.input);
  };

  const shouldShow = isStatic || (isReady && isOpen);

  return (
    <AnimatePresence>
      {shouldShow && (
        <>
          {/* Mobile: Full-screen sheet */}
          {!isStatic && (
            <MobilePanel
              context={context}
              messages={chat.messages}
              input={chat.input}
              isLoading={chat.isLoading}
              isThinking={chat.isThinking}
              isSaving={isSaving}
              thinkingPun={chat.thinkingPun}
              placeholder={currentPlaceholder}
              inputRef={inputRef}
              onInputChange={chat.setInput}
              onSubmit={handleSubmit}
              onClose={() => setIsOpen(false)}
              onSelectSuggestion={chat.selectSuggestion}
              onSelectResult={chat.selectResult}
            />
          )}

          {/* Desktop: Draggable floating panel */}
          <DesktopPanel
            context={context}
            isStatic={isStatic}
            isOnboarding={isOnboarding}
            isMinimized={isMinimized}
            isFirstLoad={isFirstLoad}
            position={position}
            dockMode={dockMode}
            dockEdge={dockEdge}
            displayMessages={displayMessages}
            displayLoading={displayLoading}
            displayThinking={displayThinking}
            displayInput={displayInput}
            input={chat.input}
            isLoading={chat.isLoading}
            isSaving={isSaving}
            thinkingPun={chat.thinkingPun}
            placeholder={currentPlaceholder}
            inputRef={inputRef}
            onInputChange={chat.setInput}
            onSubmit={handleSubmit}
            onPositionChange={setPosition}
            onDragEnd={handleDragEnd}
            onMinimize={() => setIsMinimized(!isMinimized)}
            onClose={() => setIsOpen(false)}
            onToggleDock={handleToggleDock}
            onSelectEdge={setDockEdge}
            onSkip={onboarding?.skip}
            onAnimationComplete={handleAnimationComplete}
            onSelectSuggestion={chat.selectSuggestion}
            onSelectResult={chat.selectResult}
          />
        </>
      )}
    </AnimatePresence>
  );
}

interface MobilePanelProps {
  context: { page: string; artist?: string; song?: string };
  messages: BuddyMessage[];
  input: string;
  isLoading: boolean;
  isThinking: boolean;
  isSaving: boolean;
  thinkingPun: string;
  placeholder: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onInputChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
  onSelectSuggestion: (suggestion: { artist: string; title: string }) => void;
  onSelectResult: (result: SearchResult, type: 'chord' | 'tab') => void;
}

function MobilePanel({ context, messages, input, isLoading, isThinking, isSaving, thinkingPun, placeholder, inputRef, onInputChange, onSubmit, onClose, onSelectSuggestion, onSelectResult }: MobilePanelProps) {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed inset-0 z-[60] md:hidden bg-slate-950 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex flex-col h-full">
        <MobileHeader context={context} onClose={onClose} />
        <BuddyNavBar onNavigate={onClose} />

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          <BuddyMessageList
            messages={messages}
            isLoading={isLoading}
            isThinking={isThinking}
            thinkingPun={thinkingPun}
            placeholder={placeholder}
            isSaving={isSaving}
            onSelectSuggestion={onSelectSuggestion}
            onSelectResult={onSelectResult}
          />
        </div>

        <form onSubmit={onSubmit} className="px-4 py-4 border-t border-white/10 bg-slate-900/50">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={e => onInputChange(e.target.value)}
              placeholder={BUDDY_INPUT_PLACEHOLDER}
              disabled={isLoading || isSaving}
              className="flex-1 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl text-base"
            />
            <Button
              type="submit"
              size="icon"
              className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl"
              disabled={isLoading || isSaving || !input.trim()}
            >
              {isLoading ? <RandomLoader size="sm" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

function MobileHeader({ context, onClose }: { context: { page: string; artist?: string; song?: string }; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
      <div className="flex-1" /> {/* Left spacer for centering */}
      <div className="flex items-center gap-3">
        <motion.div
          animate={BUDDY_ICON_GLOW_ANIMATION}
          transition={BUDDY_ICON_GLOW_TRANSITION}
          className={cn('h-9 w-9', BUDDY_GRADIENT_ICON_BOX)}
        >
          <Bot className="h-5 w-5 text-blue-400" />
        </motion.div>
        <span className="font-semibold text-lg text-white">Buddy</span>
      </div>
      <div className="flex-1 flex justify-end">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

interface DesktopPanelProps {
  context: { page: string; artist?: string; song?: string };
  isStatic: boolean;
  isOnboarding: boolean;
  isMinimized: boolean;
  isFirstLoad: boolean;
  position: { x: number; y: number };
  dockMode: DockMode;
  dockEdge: DockEdge;
  displayMessages: BuddyMessage[];
  displayLoading?: boolean;
  displayThinking?: boolean;
  displayInput?: string;
  input: string;
  isLoading: boolean;
  isSaving: boolean;
  thinkingPun: string;
  placeholder: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onInputChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onPositionChange: (pos: { x: number; y: number }) => void;
  onDragEnd: () => void;
  onMinimize: () => void;
  onClose: () => void;
  onToggleDock: () => void;
  onSelectEdge: (edge: DockEdge) => void;
  onSkip?: () => void;
  onAnimationComplete: () => void;
  onSelectSuggestion: (suggestion: { artist: string; title: string }) => void;
  onSelectResult: (result: SearchResult, type: 'chord' | 'tab') => void;
}

function DesktopPanel({
  context, isStatic, isOnboarding, isMinimized, isFirstLoad, position, dockMode, dockEdge,
  displayMessages, displayLoading, displayThinking, displayInput, input, isLoading, isSaving,
  thinkingPun, placeholder, inputRef, onInputChange, onSubmit, onPositionChange, onDragEnd,
  onMinimize, onClose, onToggleDock, onSelectEdge, onSkip, onAnimationComplete, onSelectSuggestion, onSelectResult
}: DesktopPanelProps) {
  const isDocked = dockMode === 'docked';
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; posX: number; posY: number } | null>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isStatic || isDocked) return;
    const target = e.target as HTMLElement;
    if (target.closest('button, input, a, [role="button"]')) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    if (relativeY > BUDDY_HEADER_HEIGHT) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: position.x,
      posY: position.y,
    };
  }, [isStatic, isDocked, position.x, position.y]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !dragStartRef.current) return;

    const deltaX = e.clientX - dragStartRef.current.mouseX;
    const deltaY = e.clientY - dragStartRef.current.mouseY;

    onPositionChange(clampPosition(
      dragStartRef.current.posX + deltaX,
      dragStartRef.current.posY + deltaY
    ));
  }, [isDragging, onPositionChange]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    dragStartRef.current = null;
    onDragEnd();
  }, [isDragging, onDragEnd]);

  const panelVariants = isStatic
    ? BUDDY_LANDING_VARIANTS
    : isFirstLoad
      ? BUDDY_FIRST_LOAD_VARIANTS
      : BUDDY_PANEL_VARIANTS;

  const panelStyle = useMemo<React.CSSProperties>(() => {
    if (isStatic) {
      return {
        touchAction: 'none',
        left: `calc(50% - ${BUDDY_PANEL_WIDTH / 2}px)`,
        top: `calc(50% - ${BUDDY_PANEL_HEIGHT / 2}px)`,
      };
    }
    if (isDocked) {
      return { touchAction: 'none', ...getDockedStyle(dockEdge) };
    }
    return {
      touchAction: 'none',
      left: position.x,
      top: position.y,
      cursor: isDragging ? 'grabbing' : undefined,
    };
  }, [isStatic, isDocked, dockEdge, position.x, position.y, isDragging]);

  return (
    <motion.div
      variants={panelVariants}
      initial="closed"
      animate="open"
      exit="closed"
      onAnimationComplete={onAnimationComplete}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn('fixed z-[60] isolate', isStatic ? 'block' : 'hidden md:block')}
      style={panelStyle}
      layout
      transition={BUDDY_DOCK_SPRING}
    >
      <GlowEffects isFirstLoad={isFirstLoad} />

      <motion.div
        variants={isDocked ? undefined : BUDDY_MINIMIZED_VARIANTS}
        animate={isMinimized ? 'minimized' : 'open'}
        className={cn(
          'overflow-hidden bg-gradient-to-b from-slate-900/95 to-slate-950/95',
          'backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50',
          isDocked ? 'rounded-none h-full w-full flex flex-col' : 'rounded-2xl',
          isMinimized && 'cursor-pointer',
          isFirstLoad && 'ring-2 ring-blue-500/50 ring-offset-2 ring-offset-transparent'
        )}
        onClick={isMinimized ? () => onMinimize() : undefined}
      >
        {!isDocked && <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-50 blur-sm -z-10" />}

        <BuddyHeader
          context={context}
          isStatic={isStatic}
          isOnboarding={isOnboarding}
          isMinimized={isMinimized}
          dockMode={dockMode}
          dockEdge={dockEdge}
          onMinimize={onMinimize}
          onClose={onClose}
          onToggleDock={onToggleDock}
          onSelectEdge={onSelectEdge}
          onSkip={onSkip}
        />

        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: isDocked ? 'auto' : 560 }}
              exit={{ opacity: 0, height: 0 }}
              className={cn('flex flex-col', isDocked && 'flex-1')}
            >
              {!isOnboarding && <BuddyNavBar onNavigate={onClose} />}

              <div className={BUDDY_SCROLL_CONTAINER_CLASS}>
                <BuddyMessageList
                  messages={displayMessages}
                  isLoading={displayLoading ?? false}
                  isThinking={displayThinking ?? false}
                  thinkingPun={isOnboarding ? 'Finding your jam...' : thinkingPun}
                  placeholder={placeholder}
                  isSaving={isSaving}
                  onSelectSuggestion={onSelectSuggestion}
                  onSelectResult={onSelectResult}
                />
              </div>

              <BuddyInput
                input={input}
                isLoading={isLoading}
                isSaving={isSaving}
                isOnboarding={isOnboarding}
                typingText={displayInput}
                inputRef={inputRef}
                onInputChange={onInputChange}
                onSubmit={onSubmit}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function GlowEffects({ isFirstLoad }: { isFirstLoad: boolean }) {
  return (
    <div className="absolute inset-0 -z-10 overflow-visible pointer-events-none" style={{ contain: 'layout' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute -inset-4 rounded-3xl bg-gradient-to-b from-blue-500/8 via-transparent to-purple-500/8 blur-xl"
      />
      {isFirstLoad && (
        <motion.div
          variants={BUDDY_GLOW_VARIANTS}
          initial="hidden"
          animate="visible"
          className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-blue-400/15 via-indigo-500/10 to-purple-400/15 blur-2xl"
        />
      )}
      <div className="absolute -bottom-3 left-4 right-4 h-6 bg-black/20 blur-xl rounded-full" />
    </div>
  );
}
