/**
 * Buddy chat types - shared across components and hooks
 */

import type { SearchResult } from '@/lib/types';

/** Dock feature types */
export type DockEdge = 'top' | 'bottom' | 'left' | 'right';
export type DockMode = 'floating' | 'docked';

export interface Suggestion {
  artist: string;
  title: string;
}

export interface StructuredData {
  type: string;
  [key: string]: unknown;
}

export interface BuddyMessage {
  role: 'user' | 'assistant';
  content: string;
  autoDownload?: boolean;
  suggestions?: Suggestion[];
  structured?: StructuredData;
  results?: {
    chords: SearchResult[];
    tabs: SearchResult[];
  };
}

export interface BuddyApiResponse {
  message: string;
  autoDownload?: boolean;
  suggestions?: Suggestion[];
  structured?: StructuredData;
  results?: { chords: SearchResult[]; tabs: SearchResult[] };
  navigateTo?: string;
}

export interface BuddyChatState {
  messages: BuddyMessage[];
  input: string;
  isLoading: boolean;
  thinkingPun: string;
  conversationHistory: Array<{ role: string; content: string }>;
}

export interface BuddyPanelPosition {
  x: number;
  y: number;
}
