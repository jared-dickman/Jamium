import type { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { logger } from '@/lib/logger';
import { env } from '@/app/config/env';
import { serverErrorTracker } from '@/app/utils/error-tracker.server';
import { validateApiAuth } from '@/lib/auth/apiAuth';
import { buildSystemPrompt, BUDDY_TOOL_NAMES } from '@/lib/agents/buddy';
import {
  executeSearch,
  executeDownload,
  executeListArtists,
  executeGetArtistSongs,
  executeNavigate,
} from '@/lib/agents/buddy/executors';
import { escapeXmlForLlm } from '@/lib/utils/sanitize';
import { checkRateLimit, getRemainingRequests } from '@/app/utils/rate-limiter';

export const runtime = 'nodejs';
export const maxDuration = 60;

const API_BASE_URL = env.API_BASE_URL ?? '';
const MODEL = 'claude-sonnet-4-5-20250929';
const MAX_MESSAGE_LENGTH = 4000;
const MAX_MESSAGES = 50;
const MAX_TURNS = 5;

// Zod schemas for runtime validation
const ChatMessageSchema = z
  .object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1).max(MAX_MESSAGE_LENGTH),
  })
  .strict();

const BuddyContextSchema = z
  .object({
    page: z.string().max(50),
    artist: z.string().max(200).optional(),
    song: z.string().max(200).optional(),
    chords: z.array(z.string().max(20)).max(50).optional(),
    key: z.string().max(20).optional(),
  })
  .strict();

const RequestBodySchema = z
  .object({
    messages: z.array(ChatMessageSchema).min(1).max(MAX_MESSAGES),
    context: BuddyContextSchema.optional(),
  })
  .strict();

// Tool definitions for Anthropic Messages API
const TOOL_DEFINITIONS: Anthropic.Tool[] = [
  {
    name: 'search_ultimate_guitar',
    description: 'Search Ultimate Guitar for tabs and chords. Returns matching results with URLs.',
    input_schema: {
      type: 'object' as const,
      properties: {
        artist: { type: 'string', description: 'Artist name to search for' },
        title: { type: 'string', description: 'Song title to search for' },
      },
      required: ['artist', 'title'],
    },
  },
  {
    name: 'download_song',
    description: 'Download a song from Ultimate Guitar to the library. Requires a valid UG URL.',
    input_schema: {
      type: 'object' as const,
      properties: {
        songUrl: { type: 'string', description: 'The Ultimate Guitar URL to download' },
        artist: { type: 'string', description: 'Artist name (optional, extracted from URL)' },
        title: { type: 'string', description: 'Song title (optional, extracted from URL)' },
      },
      required: ['songUrl'],
    },
  },
  {
    name: 'list_artists',
    description: "List all artists in the user's song library.",
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_artist_songs',
    description: 'Get all songs by a specific artist in the library.',
    input_schema: {
      type: 'object' as const,
      properties: {
        artist: { type: 'string', description: 'Artist name or slug to look up' },
      },
      required: ['artist'],
    },
  },
  {
    name: 'navigate',
    description: 'Navigate the user to a different page in the app.',
    input_schema: {
      type: 'object' as const,
      properties: {
        path: {
          type: 'string',
          description: 'The path to navigate to (e.g., /repertoire/pink-floyd/fearless)',
        },
        reason: { type: 'string', description: 'Brief explanation of why navigating' },
      },
      required: ['path'],
    },
  },
];

interface ToolInput {
  artist?: string;
  title?: string;
  songUrl?: string;
  path?: string;
  reason?: string;
}

async function executeTool(name: string, input: ToolInput): Promise<string> {
  switch (name) {
    case 'search_ultimate_guitar':
      return executeSearch(API_BASE_URL, input.artist || '', input.title || '');
    case 'download_song':
      return executeDownload(API_BASE_URL, input.songUrl || '', input.artist, input.title);
    case 'list_artists':
      return executeListArtists(API_BASE_URL);
    case 'get_artist_songs':
      return executeGetArtistSongs(API_BASE_URL, input.artist || '');
    case 'navigate':
      return executeNavigate(input.path || '', input.reason);
    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}

function createSSEStream() {
  const encoder = new TextEncoder();
  return new TransformStream({
    transform(chunk: string, controller) {
      controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
    },
  });
}

/**
 * Production-ready streaming agent using Anthropic Messages API with tool calling.
 * Handles multi-turn tool execution without needing CLI binary.
 */
export async function POST(request: NextRequest): Promise<Response> {
  const authResult = validateApiAuth(request);
  if (!authResult.authorized) {
    return authResult.response!;
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  if (!checkRateLimit(ip, 10, 60000)) {
    const remaining = getRemainingRequests(ip, 10);
    logger.warn('[buddy-stream/rate-limit]', { ip, remaining });
    return new Response(
      JSON.stringify({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please wait before retrying.',
        retryAfter: 60,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60',
        },
      }
    );
  }

  const { readable, writable } = new TransformStream();
  const sseStream = createSSEStream();
  const writer = sseStream.writable.getWriter();

  const sendEvent = async (event: string, data: unknown) => {
    await writer.write(JSON.stringify({ event, data }));
  };

  (async () => {
    let navigationResult: { path: string; reason?: string } | null = null;

    try {
      const rawBody = await request.json();
      const parseResult = RequestBodySchema.safeParse(rawBody);

      if (!parseResult.success) {
        logger.warn('[buddy-stream/validation]', { errors: parseResult.error.flatten() });
        await sendEvent('error', { message: 'Invalid request format' });
        await writer.close();
        return;
      }

      const { messages, context } = parseResult.data;
      logger.info('[buddy-stream/request]', { context, messageCount: messages.length });

      const systemPrompt = buildSystemPrompt(context || { page: 'home' });
      const lastUserMessage = messages.filter(m => m.role === 'user').pop();

      if (!lastUserMessage) {
        await sendEvent('error', { message: 'No user message found' });
        await writer.close();
        return;
      }

      const historyMessages = messages.slice(0, -1);
      const conversationHistory =
        historyMessages.length > 0
          ? historyMessages
              .map(
                m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${escapeXmlForLlm(m.content)}`
              )
              .join('\n\n')
          : '';

      const fullPrompt = conversationHistory
        ? `<conversation_history>\n${conversationHistory}\n</conversation_history>\n\nUser: ${escapeXmlForLlm(lastUserMessage.content)}`
        : escapeXmlForLlm(lastUserMessage.content);

      await sendEvent('start', { model: MODEL, tools: BUDDY_TOOL_NAMES });

      const anthropic = new Anthropic({
        apiKey: env.ANTHROPIC_API_KEY,
      });

      // Build initial messages
      let apiMessages: Anthropic.MessageParam[] = [{ role: 'user', content: fullPrompt }];

      let turns = 0;
      let totalInputTokens = 0;
      let totalOutputTokens = 0;

      // Agentic loop - keep going until no more tool calls
      while (turns < MAX_TURNS) {
        turns++;
        logger.info('[buddy-stream/turn]', { turn: turns });

        // Stream the response
        const stream = anthropic.messages.stream({
          model: MODEL,
          max_tokens: 4096,
          system: systemPrompt,
          tools: TOOL_DEFINITIONS,
          messages: apiMessages,
        });

        let currentText = '';
        const toolCalls: { id: string; name: string; input: ToolInput }[] = [];

        // Process streaming events
        for await (const event of stream) {
          if (event.type === 'content_block_delta') {
            if (event.delta.type === 'text_delta') {
              currentText += event.delta.text;
              await sendEvent('text', { text: event.delta.text });
            } else if (event.delta.type === 'input_json_delta') {
              // Tool input streaming - accumulate
            }
          } else if (event.type === 'content_block_start') {
            if (event.content_block.type === 'tool_use') {
              await sendEvent('tool_start', {
                tool: event.content_block.name,
                id: event.content_block.id,
              });
              await sendEvent('thinking', {});
            }
          } else if (event.type === 'content_block_stop') {
            // Content block finished
          }
        }

        // Get final message
        const finalMessage = await stream.finalMessage();
        totalInputTokens += finalMessage.usage.input_tokens;
        totalOutputTokens += finalMessage.usage.output_tokens;

        // Extract tool calls from final message
        for (const block of finalMessage.content) {
          if (block.type === 'tool_use') {
            toolCalls.push({
              id: block.id,
              name: block.name,
              input: block.input as ToolInput,
            });
          }
        }

        // If no tool calls, we're done
        if (toolCalls.length === 0 || finalMessage.stop_reason === 'end_turn') {
          break;
        }

        // Execute tools and build tool_result messages
        const toolResults: Anthropic.ToolResultBlockParam[] = [];
        for (const call of toolCalls) {
          logger.info('[buddy-stream/tool-exec]', { tool: call.name, input: call.input });
          const result = await executeTool(call.name, call.input);
          logger.info('[buddy-stream/tool-result]', {
            tool: call.name,
            result: result.substring(0, 200),
          });

          // Check for navigation
          if (call.name === 'navigate') {
            try {
              const navResult = JSON.parse(result);
              if (navResult.navigateTo) {
                navigationResult = { path: navResult.navigateTo, reason: navResult.reason };
              }
            } catch {}
          }

          toolResults.push({
            type: 'tool_result',
            tool_use_id: call.id,
            content: result,
          });
        }

        // Add assistant message and tool results to conversation
        apiMessages.push({
          role: 'assistant',
          content: finalMessage.content,
        });
        apiMessages.push({
          role: 'user',
          content: toolResults,
        });
      }

      await sendEvent('complete', {
        usage: {
          inputTokens: totalInputTokens,
          outputTokens: totalOutputTokens,
        },
        turns,
        ...(navigationResult ? { navigateTo: navigationResult.path } : {}),
      });

      logger.info('[buddy-stream/done]', { turns, totalInputTokens, totalOutputTokens });
    } catch (err) {
      const errorDetails = serverErrorTracker.captureApiError(err, {
        service: 'buddy-stream',
        operation: 'chat',
      });
      logger.error('[buddy-stream/error]', { error: errorDetails.message });
      await sendEvent('error', { message: errorDetails.message });
    } finally {
      await writer.close();
    }
  })();

  sseStream.readable.pipeTo(writable);

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
