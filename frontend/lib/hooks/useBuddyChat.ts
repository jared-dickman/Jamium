'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { BuddyMessage, Suggestion } from '@/lib/types/buddy.types';
import type { SearchResult } from '@/lib/types';
import { selectRandomWithFallback } from '@/lib/utils';
import { logger } from '@/lib/logger';
import {
  BUDDY_API_ENDPOINT,
  BUDDY_ERROR_MESSAGE,
  BUDDY_DEFAULT_THINKING,
  BUDDY_THINKING_PUNS,
} from '@/lib/constants/buddy.constants';

interface UseBuddyChatOptions {
  context: { page: string; artist?: string; song?: string };
  onSave?: (result: SearchResult, type: 'chord' | 'tab') => void;
}

export function useBuddyChat({ context, onSave }: UseBuddyChatOptions) {
  const router = useRouter();
  const [messages, setMessages] = useState<BuddyMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [thinkingPun, setThinkingPun] = useState('');
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ role: string; content: string }>
  >([]);

  const abortControllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim() || isLoading) return;

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setInput('');
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
      setThinkingPun(selectRandomWithFallback(BUDDY_THINKING_PUNS, BUDDY_DEFAULT_THINKING));
      setIsLoading(true);

      // Scroll to bottom after 0.42s
      setTimeout(() => {
        document.querySelector('[data-buddy-messages-end]')?.scrollIntoView({ behavior: 'smooth' });
      }, 420);

      const newHistory = [...conversationHistory, { role: 'user', content: userMessage }];
      setConversationHistory(newHistory);

      try {
        const response = await fetch(BUDDY_API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: newHistory, context }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        if (!response.body) {
          throw new Error('No response body');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let assistantContent = '';
        let assistantMessage: BuddyMessage = { role: 'assistant', content: '' };

        // Add placeholder assistant message
        setMessages(prev => [...prev, assistantMessage]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;

            try {
              const data = JSON.parse(line.slice(6));

              if (data.event === 'thinking') {
                if (mountedRef.current) {
                  setIsThinking(true);
                  setIsStreaming(false);
                }
              } else if (data.event === 'text') {
                if (mountedRef.current) {
                  setIsThinking(false);
                  setIsStreaming(true);
                }
                assistantContent += data.data.text;
                if (mountedRef.current) {
                  setMessages(prev => {
                    const updated = [...prev];
                    const lastMsg = updated[updated.length - 1];
                    if (lastMsg) {
                      updated[updated.length - 1] = {
                        role: lastMsg.role,
                        content: assistantContent,
                      };
                    }
                    return updated;
                  });
                }
              } else if (data.event === 'complete') {
                if (mountedRef.current) {
                  setIsThinking(false);
                  setIsStreaming(false);
                }
                // Handle navigation
                if (data.data.navigateTo && mountedRef.current) {
                  router.push(data.data.navigateTo);
                }

                // Handle auto-download
                const firstChord = data.data.results?.chords?.[0];
                const shouldAutoDownload = data.data.autoDownload && firstChord && onSave;

                if (shouldAutoDownload && mountedRef.current) {
                  onSave(firstChord, 'chord');
                }

                // Update final message with all metadata
                if (mountedRef.current) {
                  setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      role: 'assistant',
                      content: assistantContent,
                      suggestions: data.data.suggestions,
                      structured: data.data.structured,
                      results: data.data.results,
                      autoDownload: data.data.autoDownload,
                    };
                    return updated;
                  });

                  setConversationHistory(prev => [
                    ...prev,
                    { role: 'assistant', content: assistantContent },
                  ]);
                }
              } else if (data.event === 'error') {
                throw new Error(data.data.message || 'Unknown error');
              }
            } catch (e) {
              logger.error('[useBuddyChat] Malformed SSE line:', line, e);
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          logger.info('[useBuddyChat] Request cancelled');
          return;
        }

        logger.error('[useBuddyChat] Error:', err);

        if (mountedRef.current) {
          setMessages(prev => [...prev, { role: 'assistant', content: BUDDY_ERROR_MESSAGE }]);
        }
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
          setIsThinking(false);
          setIsStreaming(false);
        }
      }
    },
    [isLoading, conversationHistory, context, router, onSave]
  );

  const selectSuggestion = useCallback(
    (suggestion: Suggestion) => {
      const query = `${suggestion.title} by ${suggestion.artist}`;
      sendMessage(query);
    },
    [sendMessage]
  );

  const selectResult = useCallback(
    (result: SearchResult, type: 'chord' | 'tab') => {
      onSave?.(result, type);
    },
    [onSave]
  );

  return {
    messages,
    input,
    setInput,
    isLoading,
    isThinking,
    isStreaming,
    thinkingPun,
    sendMessage,
    selectSuggestion,
    selectResult,
  };
}
