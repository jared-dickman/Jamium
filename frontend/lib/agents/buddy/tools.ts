import { tool, createSdkMcpServer } from '@anthropic-ai/claude-agent-sdk';
// SDK requires Zod 3 (not Zod 4) - see https://github.com/anthropics/claude-agent-sdk-typescript/issues/4
// Type assertion needed: SDK types reference 'zod' (v4 in project) but expects v3 at runtime
import { z } from 'zod3';
// Helper to bridge zod3 schemas to SDK's expected zod types (zod v3 → SDK)

const asSchema = <T extends Record<string, unknown>>(schema: T): any => schema;
import {
  executeSearch,
  executeDownload,
  executeListArtists,
  executeGetArtistSongs,
  executeNavigate,
} from '@/lib/agents/buddy/executors';
import { AllParams, PageParams } from '@/lib/params/pageParams';
import { buddyRoutes } from '@/lib/routes';

// Generate route docs from source of truth
const routeDocs = Object.entries(buddyRoutes)
  .map(([, r]) => `- ${r.path} → ${r.desc}`)
  .join('\n');
const songRoute = `- ${buddyRoutes.repertoire.path}/{Artist}/{Song} → Specific song`;

// Generate param docs from source of truth
const paramDocs = Object.entries(PageParams.jam)
  .map(([, p]) => `- ${p.key}: ${p.description}`)
  .join('\n');

// =============================================================================
// TOOL DEFINITIONS
// Following Anthropic's ACI (Agent-Computer Interface) best practices:
// - Clear descriptions like docstrings for a junior dev
// - Examples for every tool
// - Edge cases documented
// - Poka-yoke: make wrong thing impossible
// =============================================================================

// Tool input schemas using Zod 3 (plain object format per SDK docs)
export const SearchInputSchema = {
  artist: z.string().describe('Full artist/band name. Fix typos. Expand abbreviations.'),
  title: z.string().describe('Song title. Drop unnecessary words if search fails.'),
};

export const DownloadInputSchema = {
  songUrl: z
    .string()
    .describe(
      'The Ultimate Guitar URL from search results. Format: https://tabs.ultimate-guitar.com/...'
    ),
  artist: z.string().optional().describe('Artist name (optional, for logging)'),
  title: z.string().optional().describe('Song title (optional, for logging)'),
};

export const GetArtistSongsInputSchema = {
  artist: z.string().describe('Artist name or slug. Case-insensitive. Partial matches work.'),
};

export const NavigateInputSchema = {
  path: z.string().describe('URL path. Use Title_Case_With_Underscores for slugs.'),
  reason: z.string().optional().describe('Brief reason shown to user. Keep it casual.'),
  params: z
    .record(z.string())
    .optional()
    .describe(
      'URL params to control UI state (bpm, capo, tab, etc). Auto-appended as query string.'
    ),
};

// Tool descriptions
const SEARCH_DESCRIPTION = `Search Ultimate Guitar for tabs and chords.

WHEN TO USE: User wants to find a song they don't have yet.

RETURNS: Array of results with songUrl, artist, title, type, rating.
- Use the songUrl from results to download
- Results include both "Chords" and "Tab" types
- Prefer "Chords" type unless user specifically asks for tabs

EXAMPLES:
- "Find Wonderwall" → artist: "Oasis", title: "Wonderwall"
- "Get me some Hendrix Purple Haze" → artist: "Jimi Hendrix", title: "Purple Haze"
- "Beatles yesterday" → artist: "The Beatles", title: "Yesterday"

TIPS:
- Fix obvious typos: "Nirvan" → "Nirvana"
- Use full artist names: "RHCP" → "Red Hot Chili Peppers"
- If no results, try simpler title (drop "The", parentheticals)`;

const DOWNLOAD_DESCRIPTION = `Download a song to the user's library.

WHEN TO USE: After search_ultimate_guitar returns results, use songUrl to download.

CRITICAL: songUrl MUST come from search results. Never guess or construct URLs.

WORKFLOW:
1. search_ultimate_guitar → get results with songUrl
2. Pick best result (prefer "Chords" type, highest rating)
3. download_song with that songUrl

RETURNS: { success: true, song: { artist, title, artistSlug, songSlug } }
- Use artistSlug/songSlug for navigation after download

COMMON ERRORS:
- "Download failed" → URL might be invalid, try different search result
- Empty songUrl → You must search first to get valid URLs`;

const LIST_ARTISTS_DESCRIPTION = `List all artists in the user's library.

WHEN TO USE:
- "What songs do I have?"
- "Show me my library"
- "What artists are in here?"

RETURNS: { artists: [{ name, slug, songCount }], count: number }

TIP: Use this to answer library questions without needing specifics.`;

const GET_ARTIST_SONGS_DESCRIPTION = `Get all songs by a specific artist from the library.

WHEN TO USE:
- "What Beatles songs do I have?"
- "Show me my Hendrix collection"
- Before navigating to a specific song (to get exact slugs)

RETURNS: { artist, songs: [{ title, artist, artistSlug, songSlug }], count }

IMPORTANT: Use artistSlug and songSlug from results for navigate tool.`;

const NAVIGATE_DESCRIPTION = `Navigate user to a page. Slugs use Title_Case_With_Underscores.

ROUTES:
${routeDocs}
${songRoute}

PARAMS (optional):
${paramDocs}

EXAMPLE: path: "/repertoire/Oasis/Wonderwall", params: { bpm: "80", capo: "2" }`;

export interface NavigationCallback {
  (path: string, reason?: string): void;
}

/**
 * Create buddy MCP server with all tools
 * @param apiBaseUrl - The base URL for API calls (passed at runtime)
 * @param onNavigate - Callback fired when navigate tool is used (captures navigation for SSE)
 */
export function createBuddyMcpServer(apiBaseUrl: string, onNavigate?: NavigationCallback) {
  return createSdkMcpServer({
    name: 'buddy-tools',
    version: '1.0.0',
    tools: [
      tool(
        'search_ultimate_guitar',
        SEARCH_DESCRIPTION,
        asSchema(SearchInputSchema),
        async args => {
          const { artist, title } = args as { artist: string; title: string };
          const result = await executeSearch(apiBaseUrl, artist, title);
          return { content: [{ type: 'text' as const, text: result }] };
        }
      ),
      tool('download_song', DOWNLOAD_DESCRIPTION, asSchema(DownloadInputSchema), async args => {
        const { songUrl, artist, title } = args as {
          songUrl: string;
          artist?: string;
          title?: string;
        };
        return {
          content: [
            {
              type: 'text' as const,
              text: await executeDownload(apiBaseUrl, songUrl, artist, title),
            },
          ],
        };
      }),
      tool('list_artists', LIST_ARTISTS_DESCRIPTION, {}, async () => {
        const result = await executeListArtists(apiBaseUrl);
        return { content: [{ type: 'text' as const, text: result }] };
      }),
      tool(
        'get_artist_songs',
        GET_ARTIST_SONGS_DESCRIPTION,
        asSchema(GetArtistSongsInputSchema),
        async args => {
          const { artist } = args as { artist: string };
          return {
            content: [
              { type: 'text' as const, text: await executeGetArtistSongs(apiBaseUrl, artist) },
            ],
          };
        }
      ),
      tool('navigate', NAVIGATE_DESCRIPTION, asSchema(NavigateInputSchema), async args => {
        const { path, reason, params } = args as {
          path: string;
          reason?: string;
          params?: Record<string, string>;
        };
        // Build full path with query string if params provided
        let fullPath = path;
        if (params && Object.keys(params).length > 0) {
          const validKeys = Object.keys(AllParams);
          const invalidKeys = Object.keys(params).filter(k => !validKeys.includes(k));
          if (invalidKeys.length > 0) {
            return {
              content: [
                {
                  type: 'text' as const,
                  text: JSON.stringify({
                    error: `Invalid params: ${invalidKeys.join(', ')}`,
                    validKeys,
                  }),
                },
              ],
            };
          }
          fullPath = `${path}?${new URLSearchParams(params).toString()}`;
        }
        // Fire callback to capture navigation for SSE event
        onNavigate?.(fullPath, reason);
        return {
          content: [{ type: 'text' as const, text: executeNavigate(fullPath, reason) }],
        };
      }),
    ],
  });
}

// Export tool names for reference
export const BUDDY_TOOL_NAMES = [
  'search_ultimate_guitar',
  'download_song',
  'list_artists',
  'get_artist_songs',
  'navigate',
] as const;

// Export input types
export interface SearchToolInput {
  artist: string;
  title: string;
}
export interface DownloadSongToolInput {
  songUrl: string;
  artist?: string;
  title?: string;
}
export interface GetArtistSongsToolInput {
  artist: string;
}
export interface NavigateToolInput {
  path: string;
  reason?: string;
  params?: Record<string, string>;
}
