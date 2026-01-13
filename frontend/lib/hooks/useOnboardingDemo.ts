'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ONBOARDING_SCRIPT,
  ONBOARDING_TIMING,
  ONBOARDING_STORAGE_KEY,
  type OnboardingStep,
} from '@/lib/constants/onboarding.constants';

type Phase = 'idle' | 'typing' | 'thinking' | 'responding' | 'complete';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface OnboardingState {
  messages: Message[];
  typingText: string;
  isLoading: boolean;
  isComplete: boolean;
  hasSeenBefore: boolean;
  skip: () => void;
  reset: () => void;
}

// Dev-only override: NEXT_PUBLIC_FORCE_ONBOARDING=true ignores localStorage (never in production)
const IS_DEV = process.env.NODE_ENV === 'development';
const FORCE_ONBOARDING = IS_DEV && process.env.NEXT_PUBLIC_FORCE_ONBOARDING === 'true';

export function useOnboardingDemo(): OnboardingState {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingText, setTypingText] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [stepIndex, setStepIndex] = useState(0);
  const [hasSeenBefore, setHasSeenBefore] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentStep: OnboardingStep | undefined = ONBOARDING_SCRIPT[stepIndex];
  const isComplete = phase === 'complete';
  const isLoading = phase === 'thinking';

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const markSeen = useCallback(() => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    setHasSeenBefore(true);
  }, []);

  const skip = useCallback(() => {
    clearTimer();
    markSeen();
    setPhase('complete');
  }, [clearTimer, markSeen]);

  const reset = useCallback(() => {
    clearTimer();
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    setHasSeenBefore(false);
    setMessages([]);
    setTypingText('');
    setStepIndex(0);
    setPhase('idle');
    timerRef.current = setTimeout(() => setPhase('typing'), ONBOARDING_TIMING.INITIAL_DELAY_MS);
  }, [clearTimer]);

  // Check localStorage on mount (FORCE_ONBOARDING env var overrides for dev)
  useEffect(() => {
    const seen = localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true';
    if (seen && !FORCE_ONBOARDING) {
      setHasSeenBefore(true);
      setPhase('complete');
    } else {
      timerRef.current = setTimeout(() => setPhase('typing'), ONBOARDING_TIMING.INITIAL_DELAY_MS);
    }
    return clearTimer;
  }, [clearTimer]);

  // Typewriter effect
  useEffect(() => {
    if (phase !== 'typing' || !currentStep) return;

    const query = currentStep.query;
    let charIndex = 0;

    const typeNextChar = () => {
      if (charIndex < query.length) {
        setTypingText(query.slice(0, charIndex + 1));
        charIndex++;
        timerRef.current = setTimeout(typeNextChar, ONBOARDING_TIMING.CHAR_DELAY_MS);
      } else {
        // Done typing, "submit"
        setMessages(prev => [...prev, { role: 'user', content: query }]);
        setTypingText('');
        setPhase('thinking');
      }
    };

    timerRef.current = setTimeout(typeNextChar, 100);
    return clearTimer;
  }, [phase, currentStep, clearTimer]);

  // Thinking → Response
  useEffect(() => {
    if (phase !== 'thinking' || !currentStep) return;

    timerRef.current = setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: currentStep.response }]);
      setPhase('responding');
    }, ONBOARDING_TIMING.THINKING_DELAY_MS);

    return clearTimer;
  }, [phase, currentStep, clearTimer]);

  // Response → Next step or complete
  useEffect(() => {
    if (phase !== 'responding') return;

    const nextIndex = stepIndex + 1;
    const hasMoreSteps = nextIndex < ONBOARDING_SCRIPT.length;

    timerRef.current = setTimeout(() => {
      if (hasMoreSteps) {
        setStepIndex(nextIndex);
        setPhase('typing');
      } else {
        markSeen();
        setPhase('complete');
      }
    }, ONBOARDING_TIMING.POST_RESPONSE_DELAY_MS);

    return clearTimer;
  }, [phase, stepIndex, clearTimer, markSeen]);

  return {
    messages,
    typingText,
    isLoading,
    isComplete,
    hasSeenBefore,
    skip,
    reset,
  };
}
