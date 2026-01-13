/**
 * Onboarding demo script - plays automatically on landing page
 */

export interface OnboardingStep {
  query: string;
  response: string;
}

export const ONBOARDING_SCRIPT: OnboardingStep[] = [
  {
    query: 'What is this?',
    response: 'Your guitar coach. Pick a song, play along, and I help you nail the hard parts.',
  },
  {
    query: 'How does that work?',
    response: 'I hear your chords in real-time. When you stumble, I show you exactly what to fix.',
  },
  {
    query: 'Any song?',
    response: 'If it has chords online, you can learn it here. What do you want to play?',
  },
  {
    query: "Let's go",
    response: "Alright, enough talk. Let's play something.",
  },
];

export const ONBOARDING_TIMING = {
  INITIAL_DELAY_MS: 1200,
  CHAR_DELAY_MS: 35,
  THINKING_DELAY_MS: 1500,
  POST_RESPONSE_DELAY_MS: 2800,
  CTA_DELAY_MS: 1800,
} as const;

export const ONBOARDING_STORAGE_KEY = 'buddy_onboarding_seen';
