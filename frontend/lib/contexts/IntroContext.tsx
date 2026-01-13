'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback } from 'react';

interface IntroContextType {
  introComplete: boolean;
  introLanding: boolean;
  setIntroComplete: (complete: boolean) => void;
  setIntroLanding: (landing: boolean) => void;
}

const IntroContext = createContext<IntroContextType | null>(null);

export function IntroProvider({ children }: { children: ReactNode }) {
  const [introComplete, setIntroCompleteState] = useState(false);
  const [introLanding, setIntroLandingState] = useState(false);

  const setIntroComplete = useCallback((complete: boolean) => {
    setIntroCompleteState(complete);
  }, []);

  const setIntroLanding = useCallback((landing: boolean) => {
    setIntroLandingState(landing);
  }, []);

  return (
    <IntroContext.Provider
      value={{ introComplete, introLanding, setIntroComplete, setIntroLanding }}
    >
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro() {
  const context = useContext(IntroContext);
  if (!context) {
    throw new Error('useIntro must be used within IntroProvider');
  }
  return context;
}
