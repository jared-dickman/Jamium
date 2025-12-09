/**
 * Canvas Rendering Constants
 * Device pixel ratio, sizing, and rendering settings
 */

export const DEVICE_PIXEL_RATIO = {
  DEFAULT: 1,
  get CURRENT(): number {
    return typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  },
} as const;

/**
 * Sapphire color palette (from globals.css)
 */
export const SAPPHIRE = {
  ABYSS: '#000510',
  DEEP: '#020924',
  DARK: '#0a1744',
  900: '#1e3a8a',
  800: '#1e40af',
  700: '#1d4ed8',
  600: '#2563eb',
  500: '#3b82f6',
  400: '#60a5fa',
  300: '#93c5fd',
  200: '#bfdbfe',
  100: '#dbeafe',
  50: '#eff6ff',
} as const;

export const CANVAS_COLOR = {
  BACKGROUND: SAPPHIRE.ABYSS,
  GRID_LINE: SAPPHIRE.DARK,
  TEXT: SAPPHIRE[100],
  FRETBOARD_BACKGROUND: SAPPHIRE.DEEP,
  FRETBOARD_FRET: SAPPHIRE[600],
  STRING: SAPPHIRE[300],
  MARKER: SAPPHIRE[200],
  ACCENT: SAPPHIRE[400],
} as const;

export const FINGER_COLORS = [
  SAPPHIRE[600], // neutral (0/muted)
  SAPPHIRE[400], // sapphire-400 (1) - Index
  SAPPHIRE[500], // sapphire-500 (2) - Middle
  '#60a5fa', // cyan-400 (3) - Ring
  '#93c5fd', // sky-300 (4) - Pinky
  SAPPHIRE[300], // sapphire-300 (5)
] as const;

export const NOTE_COLORS = {
  WHITE_KEY: '#FFFFFF',
  WHITE_KEY_PRESSED: '#E0E0E0',
  BLACK_KEY: '#000000',
  BLACK_KEY_PRESSED: '#333333',
  ACTIVE_NOTE: '#3b82f6',
} as const;
