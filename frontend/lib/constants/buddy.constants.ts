/**
 * Core Agent Buddy constants
 */

import type { Variants } from 'framer-motion';
import { pageRoutes } from '@/lib/routes';

export const BUDDY_SIDEBAR_WIDTH = 440;
export const BUDDY_PANEL_WIDTH = 420;
export const BUDDY_PANEL_HEIGHT = 640;
export const BUDDY_DOCKED_HEIGHT = 320;
export const BUDDY_EDGE_PADDING = 32;
export const BUDDY_MINIMIZED_WIDTH = 280;
export const BUDDY_MINIMIZED_HEIGHT = 56;
export const BUDDY_HEADER_HEIGHT = 56;
export const BUDDY_PLACEHOLDER_INTERVAL_MS = 8000;
export const BUDDY_MAX_VISIBLE_RESULTS = 3;
export const BUDDY_DEFAULT_RATING = 0;
export const BUDDY_RATING_PRECISION = 1;
export const BUDDY_FIRST_LOAD_DELAY_MS = 500;

export const BUDDY_API_ENDPOINT = '/api/buddy-stream';

export const BUDDY_ERROR_MESSAGE = 'Hit a wrong note. Try again?';
export const BUDDY_DEFAULT_THINKING = 'Thinking...';
export const BUDDY_EMPTY_STATE_SUBTITLE = '';
export const BUDDY_INPUT_PLACEHOLDER = 'Ask anything...';
export const BUDDY_DEFAULT_PLACEHOLDER = 'What would you like to play?';

/** Animation configs */
const SPRING_ANIMATION = { type: 'spring' as const, stiffness: 400, damping: 30 };

/** Shared pulsing glow animation for Buddy icons */
export const BUDDY_ICON_GLOW_ANIMATION = {
  boxShadow: [
    '0 0 8px rgba(59, 130, 246, 0.5)',
    '0 0 16px rgba(147, 51, 234, 0.5)',
    '0 0 8px rgba(59, 130, 246, 0.5)',
  ],
};
export const BUDDY_ICON_GLOW_TRANSITION = { duration: 2, repeat: Infinity };

/** Shared scrollable container class */
export const BUDDY_SCROLL_CONTAINER_CLASS =
  'flex-1 overflow-y-auto overflow-x-hidden px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent';

/** Gradient classes - DRY brand colors */
export const BUDDY_GRADIENT_ICON_BOX = 'rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/10';
export const BUDDY_GRADIENT_USER_MSG = 'bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-white';
export const BUDDY_GRADIENT_SEND_BTN = 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0';

/**
 * Landing page entrance: elegant rise from center after cinematic intro
 * Seamless continuation of the dramatic intro sequence
 */
export const BUDDY_LANDING_VARIANTS: Variants = {
  closed: {
    opacity: 0,
    scale: 0.92,
    y: 40,
    filter: 'blur(8px)',
  },
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 20,
      delay: 0.15,
    },
  },
};

/**
 * First load: dramatic slow entrance from top-right (Buddy button location)
 * Creates "emerging from the button" feeling - SLOW & DRAMATIC
 * Gradient reveal sweeps left (arriving from right)
 */
export const BUDDY_FIRST_LOAD_VARIANTS: Variants = {
  closed: {
    opacity: 0,
    scale: 0.7,
    x: 120,
    y: -50,
    filter: 'blur(10px)',
    clipPath: 'inset(0 0 0 100%)', // Hidden from right
  },
  open: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    filter: 'blur(0px)',
    clipPath: 'inset(0 0 0 0)', // Fully revealed
    transition: {
      type: 'spring',
      stiffness: 160,
      damping: 18,
      delay: 0.08,
    },
  },
};

/**
 * Regular open/close:
 * - Opening: slow dramatic entrance, reveals from right (arriving)
 * - Closing: fast snap home, sweeps to right (leaving)
 */
export const BUDDY_PANEL_VARIANTS: Variants = {
  open: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    clipPath: 'inset(0 0 0 0)', // Fully visible
    transition: { type: 'spring', stiffness: 180, damping: 20 },
  },
  closed: {
    opacity: 0,
    scale: 0.8,
    x: 100,
    y: -45,
    clipPath: 'inset(0 0 0 100%)', // Swept to right (going home)
    transition: { type: 'spring', stiffness: 450, damping: 32 },
  },
};

export const BUDDY_GLOW_VARIANTS: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: [0, 0.4, 0],
    scale: [0.95, 1.1, 1.05],
    transition: { duration: 3, times: [0, 0.3, 1], ease: 'easeOut' as const },
  },
};

export const BUDDY_MINIMIZED_VARIANTS: Variants = {
  open: { width: BUDDY_PANEL_WIDTH, height: BUDDY_PANEL_HEIGHT, transition: SPRING_ANIMATION },
  minimized: { width: BUDDY_MINIMIZED_WIDTH, height: BUDDY_MINIMIZED_HEIGHT, transition: SPRING_ANIMATION },
};

/** Dock transition spring - elastic feel */
export const BUDDY_DOCK_SPRING = { type: 'spring' as const, stiffness: 300, damping: 28 };

/** Edge picker arrow animation - staggered fade-in */
export const BUDDY_EDGE_PICKER_VARIANTS: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.15, ease: 'easeOut' as const },
  },
};

/** Edge picker container - staggered children */
export const BUDDY_EDGE_PICKER_CONTAINER: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

/** State persistence */
export const BUDDY_POSITION_STORAGE_KEY = 'buddy-position';
export const BUDDY_VISIBLE_STORAGE_KEY = 'buddy-visible';
export const BUDDY_MINIMIZED_STORAGE_KEY = 'buddy-minimized';
export const BUDDY_DOCK_MODE_STORAGE_KEY = 'buddy-dock-mode';
export const BUDDY_DOCK_EDGE_STORAGE_KEY = 'buddy-dock-edge';
export const BUDDY_STATE_DEBOUNCE_MS = 1000;

/** Dock defaults */
export const BUDDY_DEFAULT_DOCK_MODE = 'floating' as const;
export const BUDDY_DEFAULT_DOCK_EDGE = 'right' as const;
// Centered: will be calculated on mount if no saved position
export const BUDDY_DEFAULT_POSITION = { x: -1, y: -1 };

/** UI timing */
export const BUDDY_AUTOFOCUS_DELAY_MS = 100;
export const BUDDY_ENTRANCE_DELAY_MS = 1000;

export const BUDDY_THINKING_PUNS = [
  'Tuning up...',
  'Shredding through...',
  'Finding your jam...',
  'Strumming results...',
  'Riffing...',
  'Harmonizing...',
  'Dialing in tone...',
  'Running scales...',
  'Pentatonic matching...',
  'Circle of fifths...',
  'Sound check...',
  'Encore encoding...',
  'Groove grooving...',
  'Tone chasing...',
] as const;

export const STRUCTURED_DATA_TYPES = {
  INFLUENCE_CHAIN: 'influence_chain',
  ARTIST_CARD: 'artist_card',
} as const;

/** Navigation routes for Buddy's mini nav bar - DRY via pageRoutes */
export const BUDDY_NAV_ROUTES = [
  { path: pageRoutes.repertoire, label: 'Repertoire', icon: 'turntable' },
  { path: pageRoutes.jam, label: 'Jam', icon: 'waveform' },
  { path: pageRoutes.composer, label: 'Compose', icon: 'feather' },
] as const;
