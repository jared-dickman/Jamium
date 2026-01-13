import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { DockEdge, DockMode } from '@/lib/types/buddy.types';
import {
  BUDDY_POSITION_STORAGE_KEY,
  BUDDY_MINIMIZED_STORAGE_KEY,
  BUDDY_DOCK_MODE_STORAGE_KEY,
  BUDDY_DOCK_EDGE_STORAGE_KEY,
  BUDDY_STATE_DEBOUNCE_MS,
  BUDDY_DEFAULT_DOCK_MODE,
  BUDDY_DEFAULT_DOCK_EDGE,
  BUDDY_DEFAULT_POSITION,
  BUDDY_PANEL_WIDTH,
  BUDDY_PANEL_HEIGHT,
  BUDDY_EDGE_PADDING,
} from '@/lib/constants/buddy.constants';

/** Clamp position within viewport bounds */
export function clampPosition(x: number, y: number): { x: number; y: number } {
  if (typeof window === 'undefined') return { x, y };
  return {
    x: Math.max(
      BUDDY_EDGE_PADDING,
      Math.min(x, window.innerWidth - BUDDY_PANEL_WIDTH - BUDDY_EDGE_PADDING)
    ),
    y: Math.max(
      BUDDY_EDGE_PADDING,
      Math.min(y, window.innerHeight - BUDDY_PANEL_HEIGHT - BUDDY_EDGE_PADDING)
    ),
  };
}

/** Get centered position */
function getCenteredPosition(): { x: number; y: number } {
  if (typeof window === 'undefined') return { x: 100, y: 100 };
  return clampPosition(
    Math.round((window.innerWidth - BUDDY_PANEL_WIDTH) / 2),
    Math.round((window.innerHeight - BUDDY_PANEL_HEIGHT) / 2)
  );
}

/** Generic localStorage loader with validation */
function loadFromStorage<T>(key: string, validator: (val: unknown) => T | null, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const result = validator(JSON.parse(saved));
      if (result !== null) return result;
    }
  } catch {
    /* Invalid value */
  }
  return fallback;
}

/** Compute CSS style for docked position */
export function getDockedStyle(edge: DockEdge): React.CSSProperties {
  const isHorizontal = edge === 'top' || edge === 'bottom';
  return {
    [edge]: 0,
    ...(isHorizontal
      ? { left: 0, width: '100vw', height: '35vh', maxHeight: 400 }
      : { top: 0, height: '100vh', width: BUDDY_PANEL_WIDTH }),
  };
}

/** Load all saved buddy state */
function loadSavedState() {
  return {
    position: loadFromStorage(
      BUDDY_POSITION_STORAGE_KEY,
      v =>
        typeof v === 'object' && v && 'x' in v && 'y' in v
          ? clampPosition((v as { x: number; y: number }).x, (v as { x: number; y: number }).y)
          : null,
      getCenteredPosition()
    ),
    minimized: loadFromStorage(
      BUDDY_MINIMIZED_STORAGE_KEY,
      v => (v === true ? true : v === false ? false : null),
      false
    ),
    dockMode: loadFromStorage<DockMode>(
      BUDDY_DOCK_MODE_STORAGE_KEY,
      v => (v === 'floating' || v === 'docked' ? (v as DockMode) : null),
      BUDDY_DEFAULT_DOCK_MODE
    ),
    dockEdge: loadFromStorage<DockEdge>(
      BUDDY_DOCK_EDGE_STORAGE_KEY,
      v => (['top', 'bottom', 'left', 'right'].includes(v as string) ? (v as DockEdge) : null),
      BUDDY_DEFAULT_DOCK_EDGE
    ),
  };
}

/** Consolidated panel state - stable object references to prevent re-renders */
export interface BuddyPanelState {
  position: { x: number; y: number };
  isMinimized: boolean;
  dockMode: DockMode;
  dockEdge: DockEdge;
  isDocked: boolean;
}

export interface BuddyPanelActions {
  setPosition: (pos: { x: number; y: number }) => void;
  setIsMinimized: (minimized: boolean) => void;
  setDockEdge: (edge: DockEdge) => void;
  handleToggleDock: () => void;
  handleDragEnd: () => void;
}

/** Get initial state - called once per mount */
function getInitialState(isStatic: boolean) {
  const saved = loadSavedState();
  return {
    position: saved.position,
    cachedFloatPosition: saved.position,
    isMinimized: isStatic ? false : saved.minimized,
    dockMode: isStatic ? ('floating' as DockMode) : saved.dockMode,
    dockEdge: saved.dockEdge,
  };
}

/** Hook for all buddy panel state with persistence */
export function useBuddyPanelState(isStatic: boolean): {
  state: BuddyPanelState;
  actions: BuddyPanelActions;
} {
  // Single lazy load from localStorage
  const initRef = useRef<ReturnType<typeof getInitialState> | null>(null);
  if (!initRef.current) initRef.current = getInitialState(isStatic);
  const init = initRef.current;

  const [position, setPositionInternal] = useState(init.position);
  const [cachedFloatPosition, setCachedFloatPosition] = useState(init.cachedFloatPosition);
  const [isMinimized, setIsMinimizedInternal] = useState(init.isMinimized);
  const [dockMode, setDockModeInternal] = useState<DockMode>(init.dockMode);
  const [dockEdge, setDockEdgeInternal] = useState<DockEdge>(init.dockEdge);

  const saveTimeoutRef = useRef<NodeJS.Timeout>(undefined);

  // Refs for stable access in callbacks
  const positionRef = useRef(position);
  const cachedFloatRef = useRef(cachedFloatPosition);
  useEffect(() => {
    positionRef.current = position;
  }, [position]);
  useEffect(() => {
    cachedFloatRef.current = cachedFloatPosition;
  }, [cachedFloatPosition]);

  /** Persist immediately (for user actions like dock/minimize) */
  const persistNow = useCallback((key: string, value: unknown) => {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  }, []);

  /** Persist debounced (for frequent updates like drag) */
  const persistDebounced = useCallback(
    (key: string, value: unknown) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => persistNow(key, value), BUDDY_STATE_DEBOUNCE_MS);
    },
    [persistNow]
  );

  // Stable actions object
  const actions = useMemo<BuddyPanelActions>(
    () => ({
      setPosition: (pos: { x: number; y: number }) => setPositionInternal(pos),
      setIsMinimized: (minimized: boolean) => {
        setIsMinimizedInternal(minimized);
        persistNow(BUDDY_MINIMIZED_STORAGE_KEY, minimized);
      },
      setDockEdge: (edge: DockEdge) => {
        setDockEdgeInternal(edge);
        persistNow(BUDDY_DOCK_EDGE_STORAGE_KEY, edge);
      },
      handleToggleDock: () => {
        setDockModeInternal(prev => {
          if (prev === 'floating') {
            setCachedFloatPosition(positionRef.current);
            persistNow(BUDDY_POSITION_STORAGE_KEY, positionRef.current);
            setIsMinimizedInternal(false);
            persistNow(BUDDY_DOCK_MODE_STORAGE_KEY, 'docked');
            return 'docked';
          } else {
            setPositionInternal(cachedFloatRef.current);
            persistNow(BUDDY_DOCK_MODE_STORAGE_KEY, 'floating');
            return 'floating';
          }
        });
      },
      handleDragEnd: () => persistDebounced(BUDDY_POSITION_STORAGE_KEY, positionRef.current),
    }),
    [persistNow, persistDebounced]
  );

  // Stable state object - derived isDocked inside
  const state = useMemo<BuddyPanelState>(
    () => ({
      position,
      isMinimized,
      dockMode,
      dockEdge,
      isDocked: dockMode === 'docked',
    }),
    [position, isMinimized, dockMode, dockEdge]
  );

  return { state, actions };
}
