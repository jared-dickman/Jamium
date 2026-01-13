'use client';

import { useEffect, useRef, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { initializeApp } from '@/lib/init';

import { Button } from '@/components/ui/button';
import { pageRoutes } from '@/lib/routes';

import { BuddyProvider, useBuddy } from '@/lib/contexts/BuddyContext';
import { IntroProvider, useIntro } from '@/lib/contexts/IntroContext';
import { CoreAgentBuddy } from '@/components/agent/CoreAgentBuddy';
import { BuddyErrorBoundary } from '@/components/agent/BuddyErrorBoundary';

// Context to share header logo ref with CinematicIntro
const HeaderLogoRefContext = createContext<React.RefObject<HTMLHeadingElement | null> | null>(null);

const LAYOUT_PADDING = 'px-4';
export function useHeaderLogoRef() {
  return useContext(HeaderLogoRefContext);
}

function LayoutInner({
  children,
  headerLogoRef,
}: {
  children: React.ReactNode;
  headerLogoRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  const pathname = usePathname();
  const { isOpen, setIsOpen, openBuddy } = useBuddy();
  const { introComplete, introLanding } = useIntro();

  const isLandingPage = pathname === '/';
  const isSongwriterPage = pathname === '/songwriter';
  // Header logo visible when: not landing page, OR intro is landing/complete (crossfade)
  const headerLogoVisible = !isLandingPage || introLanding || introComplete;

  useEffect(() => {
    initializeApp();
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Unified header - logo, breadcrumbs, buddy toggle in single row */}
        {/* Hidden on mobile landing page for cinematic Buddy-first experience */}
        <header
          className={cn(
            'sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
            isLandingPage && 'hidden md:block'
          )}
        >
          <div className={cn('flex items-center justify-between h-14 w-full', LAYOUT_PADDING)}>
            {/* Logo + Breadcrumbs inline */}
            <div className="flex items-center min-w-0">
              <Link
                href={pageRoutes.home}
                className="flex items-center shrink-0 transition-opacity hover:opacity-80"
              >
                <h1
                  ref={headerLogoRef}
                  className={`text-xl font-bold tracking-tight logo-gradient transition-opacity duration-200 ${headerLogoVisible ? 'opacity-100' : 'opacity-0'}`}
                >
                  Jamium
                </h1>
              </Link>
              {!isLandingPage && <Breadcrumbs />}
            </div>
            {/* Buddy toggle - hidden on landing page where onboarding takes over */}
            {!isLandingPage && (
              <Button
                variant="outline"
                className="font-medium h-auto px-4 py-2 text-sm gap-2 shrink-0 relative overflow-hidden border-sapphire-500/20 bg-sapphire-500/10 hover:border-sapphire-500/30"
                onClick={() => (isOpen ? setIsOpen(false) : openBuddy())}
              >
                {/* Animated gradient fill - sweeps right-to-left on open, follows Buddy out on close */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-[length:200%_100%]"
                  initial={false}
                  animate={{
                    clipPath: isOpen ? 'inset(0 0 0 0)' : 'inset(0 0 0 100%)',
                    backgroundPosition: isOpen ? '100% 0' : '0% 0',
                  }}
                  transition={{
                    clipPath: isOpen
                      ? { type: 'spring', stiffness: 180, damping: 20 } // Open: slow reveal (matches panel)
                      : { type: 'spring', stiffness: 450, damping: 32 }, // Close: fast snap (matches panel)
                    backgroundPosition: { duration: 0.4, ease: 'easeOut' },
                  }}
                />
                <Bot
                  className={cn(
                    'h-4 w-4 relative z-10 transition-colors duration-300',
                    isOpen && 'text-white'
                  )}
                />
                <span
                  className={cn(
                    'hidden sm:inline relative z-10 transition-colors duration-300',
                    isOpen && 'text-white'
                  )}
                >
                  Buddy
                </span>
              </Button>
            )}
          </div>
        </header>
        <main
          className={isSongwriterPage ? 'w-full flex-1' : `w-full ${LAYOUT_PADDING} pt-2 flex-1`}
        >
          {children}
        </main>
      </div>

      {/* Core Agent Buddy - hidden on landing page where onboarding owns it */}
      {!isLandingPage && (
        <BuddyErrorBoundary>
          <CoreAgentBuddy />
        </BuddyErrorBoundary>
      )}
    </div>
  );
}

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const headerLogoRef = useRef<HTMLHeadingElement | null>(null);

  return (
    <IntroProvider>
      <BuddyProvider>
        <HeaderLogoRefContext.Provider value={headerLogoRef}>
          <LayoutInner headerLogoRef={headerLogoRef}>{children}</LayoutInner>
        </HeaderLogoRefContext.Provider>
      </BuddyProvider>
    </IntroProvider>
  );
}
