'use client';

import { createContext, useContext, useState, useMemo, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { BUDDY_VISIBLE_STORAGE_KEY, BUDDY_STATE_DEBOUNCE_MS } from '@/lib/constants/buddy.constants';

type PageContext =
  | 'landing'
  | 'library'
  | 'artist'
  | 'song'
  | 'jam'
  | 'composer'
  | 'theory'
  | 'metronome';

interface BuddyContextState {
  page: PageContext;
  artist?: string;
  song?: string;
  chords?: string[];
  key?: string;
}

interface BuddyContextType {
  context: BuddyContextState;
  setArtist: (artist: string | undefined) => void;
  setSong: (song: string | undefined) => void;
  setChords: (chords: string[] | undefined) => void;
  setKey: (key: string | undefined) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleBuddy: () => void;
  openBuddy: () => void;
  expandSignal: number;
}

const BuddyContext = createContext<BuddyContextType | undefined>(undefined);

function derivePageFromPathname(pathname: string): PageContext {
  if (pathname === '/') return 'landing';
  if (pathname === '/repertoire') return 'library';
  if (pathname.startsWith('/repertoire/')) {
    const parts = pathname.split('/').filter(Boolean);
    return parts.length === 3 ? 'song' : 'artist';
  }
  if (pathname === '/jam') return 'jam';
  if (pathname === '/composer') return 'composer';
  if (pathname === '/music-theory') return 'theory';
  if (pathname === '/metronome') return 'metronome';
  return 'library';
}

function extractArtistFromPathname(pathname: string): string | undefined {
  if (pathname.startsWith('/repertoire/')) {
    const parts = pathname.split('/').filter(Boolean);
    const artist = parts[1];
    if (parts.length >= 2 && artist) {
      return decodeURIComponent(artist);
    }
  }
  return undefined;
}

function extractSongFromPathname(pathname: string): string | undefined {
  if (pathname.startsWith('/repertoire/')) {
    const parts = pathname.split('/').filter(Boolean);
    const song = parts[2];
    if (parts.length >= 3 && song) {
      return decodeURIComponent(song);
    }
  }
  return undefined;
}

function loadSavedVisibility(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const saved = localStorage.getItem(BUDDY_VISIBLE_STORAGE_KEY);
    return saved !== 'false'; // Default to true if not set
  } catch {
    return true;
  }
}

export function BuddyProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [manualArtist, setManualArtist] = useState<string>();
  const [manualSong, setManualSong] = useState<string>();
  const [chords, setChords] = useState<string[]>();
  const [key, setKey] = useState<string>();
  const [isOpen, setIsOpenInternal] = useState(true);
  const [expandSignal, setExpandSignal] = useState(0);
  const saveTimeoutRef = useRef<NodeJS.Timeout>(undefined);
  const isInitializedRef = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIsOpenInternal(loadSavedVisibility());
    isInitializedRef.current = true;
  }, []);

  // Debounced setter that persists to localStorage
  const setIsOpen = useCallback((open: boolean) => {
    setIsOpenInternal(open);
    if (!isInitializedRef.current) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem(BUDDY_VISIBLE_STORAGE_KEY, String(open));
    }, BUDDY_STATE_DEBOUNCE_MS);
  }, []);

  const context = useMemo<BuddyContextState>(() => {
    const page = derivePageFromPathname(pathname);
    const pathArtist = extractArtistFromPathname(pathname);
    const pathSong = extractSongFromPathname(pathname);

    return {
      page,
      artist: manualArtist ?? pathArtist,
      song: manualSong ?? pathSong,
      chords,
      key,
    };
  }, [pathname, manualArtist, manualSong, chords, key]);

  const toggleBuddy = useCallback(() => setIsOpen(!isOpen), [isOpen, setIsOpen]);

  // openBuddy: opens AND expands (for explicit summons via button/shortcut)
  const openBuddy = useCallback(() => {
    setIsOpen(true);
    setExpandSignal(s => s + 1);
  }, [setIsOpen]);

  // Ctrl+B keyboard shortcut - always opens expanded
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        if (isOpen) {
          setIsOpen(false);
        } else {
          openBuddy();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen, openBuddy]);

  return (
    <BuddyContext.Provider
      value={{
        context,
        setArtist: setManualArtist,
        setSong: setManualSong,
        setChords,
        setKey,
        isOpen,
        setIsOpen,
        toggleBuddy,
        openBuddy,
        expandSignal,
      }}
    >
      {children}
    </BuddyContext.Provider>
  );
}

export function useBuddy() {
  const ctx = useContext(BuddyContext);
  if (ctx === undefined) {
    return {
      context: { page: 'library' as const },
      setArtist: () => {},
      setSong: () => {},
      setChords: () => {},
      setKey: () => {},
      isOpen: false,
      setIsOpen: () => {},
      toggleBuddy: () => {},
      openBuddy: () => {},
      expandSignal: 0,
    };
  }
  return ctx;
}
