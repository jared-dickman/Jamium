'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/components/ui/ai/hooks/useReducedMotion';
import { useOnboardingDemo } from '@/lib/hooks/useOnboardingDemo';
import { CoreAgentBuddy } from '@/components/agent/CoreAgentBuddy';
import { BuddyErrorBoundary } from '@/components/agent/BuddyErrorBoundary';
import { CinematicIntro } from '@/components/CinematicIntro';
import { useIntro } from '@/lib/contexts/IntroContext';
import { useHeaderLogoRef } from '@/app/LayoutContent';

function NebulaBackground({ reducedMotion }: { reducedMotion: boolean }) {
  if (reducedMotion) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-sapphire-950 via-background to-sapphire-900/30" />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      >
        {[
          { x: '20%', y: '30%', size: 600, color: 'rgba(99, 102, 241, 0.08)', delay: 0 },
          { x: '70%', y: '20%', size: 500, color: 'rgba(139, 92, 246, 0.06)', delay: 2 },
          { x: '50%', y: '70%', size: 700, color: 'rgba(59, 130, 246, 0.07)', delay: 4 },
          { x: '80%', y: '60%', size: 400, color: 'rgba(168, 85, 247, 0.05)', delay: 6 },
        ].map((cloud, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: cloud.x,
              top: cloud.y,
              width: cloud.size,
              height: cloud.size,
              background: `radial-gradient(circle, ${cloud.color} 0%, transparent 70%)`,
              filter: 'blur(40px)',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: cloud.delay,
            }}
          />
        ))}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
    </div>
  );
}

export function LandingPage() {
  const reducedMotion = useReducedMotion();
  const onboarding = useOnboardingDemo();
  const { introComplete, setIntroComplete } = useIntro();
  const headerLogoRef = useHeaderLogoRef();

  // Only pass onboarding when demo is actively running (not after it completes)
  const showDemo = !onboarding.isComplete;

  // Skip intro for reduced motion users
  const shouldShowIntro = !introComplete && !reducedMotion;

  return (
    <>
      {shouldShowIntro && (
        <CinematicIntro
          onComplete={() => setIntroComplete(true)}
          headerLogoRef={headerLogoRef ?? undefined}
        />
      )}
      {/* Full viewport on mobile (no header), subtract header height on desktop */}
      <div className="relative min-h-screen md:min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center overflow-hidden">
        <NebulaBackground reducedMotion={reducedMotion} />
        <div className="relative z-10">
          <BuddyErrorBoundary>
            <CoreAgentBuddy
              isLanding
              onboarding={showDemo ? onboarding : undefined}
            />
          </BuddyErrorBoundary>
        </div>
      </div>
    </>
  );
}
