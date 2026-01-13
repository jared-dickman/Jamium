'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/components/ui/ai/hooks/useReducedMotion';
import { useIntro } from '@/lib/contexts/IntroContext';

interface CinematicIntroProps {
  onComplete: () => void;
  headerLogoRef?: React.RefObject<HTMLHeadingElement | null>;
}

const TRIPLE_CLICK_WINDOW = 300;
const BLACK_DELAY = 0.42;
const FADE_IN = 3.2;
const HOLD = 0.8;
const FLY_TO_HEADER = 0.45;

export function CinematicIntro({ onComplete, headerLogoRef }: CinematicIntroProps) {
  const reducedMotion = useReducedMotion();
  const { setIntroLanding } = useIntro();
  const [phase, setPhase] = useState<'fadeIn' | 'hold' | 'flyToHeader' | 'done'>('fadeIn');
  const [targetPosition, setTargetPosition] = useState<{
    x: number;
    y: number;
    scale: number;
  } | null>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const clickCount = useRef(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  // Cleanup click timer on unmount
  useEffect(() => {
    return () => {
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
      }
    };
  }, []);

  // Skip animation for reduced motion - call onComplete immediately
  useEffect(() => {
    if (reducedMotion) {
      onComplete();
    }
  }, [reducedMotion, onComplete]);

  // Pre-calculate target position during hold phase (before header fades to opacity-0)
  useEffect(() => {
    if (phase === 'hold' && headerLogoRef?.current && textRef.current) {
      const headerRect = headerLogoRef.current.getBoundingClientRect();
      const textRect = textRef.current.getBoundingClientRect();

      // Calculate center-to-center translation
      const headerCenterX = headerRect.left + headerRect.width / 2;
      const headerCenterY = headerRect.top + headerRect.height / 2;
      const textCenterX = textRect.left + textRect.width / 2;
      const textCenterY = textRect.top + textRect.height / 2;

      setTargetPosition({
        x: headerCenterX - textCenterX,
        y: headerCenterY - textCenterY,
        scale: headerRect.width / textRect.width,
      });
    }
  }, [phase, headerLogoRef]);

  // Trigger header logo fade-in midway through fly animation for seamless crossfade
  useEffect(() => {
    if (phase !== 'flyToHeader') return;
    const timer = setTimeout(() => setIntroLanding(true), FLY_TO_HEADER * 300);
    return () => clearTimeout(timer);
  }, [phase, setIntroLanding]);

  const handleClick = useCallback(() => {
    clickCount.current++;
    if (clickTimer.current) clearTimeout(clickTimer.current);

    if (clickCount.current >= 3) {
      onComplete();
      return;
    }

    clickTimer.current = setTimeout(() => {
      clickCount.current = 0;
    }, TRIPLE_CLICK_WINDOW);
  }, [onComplete]);

  // Don't render for reduced motion users
  if (reducedMotion) {
    return null;
  }

  const isFlying = phase === 'flyToHeader' && targetPosition;

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black cursor-pointer"
          onClick={handleClick}
          initial={{ opacity: 1 }}
          animate={{ opacity: isFlying ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FLY_TO_HEADER, delay: isFlying ? 0.1 : 0 }}
          onAnimationComplete={() => {
            if (phase === 'flyToHeader') {
              setPhase('done');
              onComplete();
            }
          }}
        >
          <motion.h1
            ref={textRef}
            className="text-7xl sm:text-[7.5rem] md:text-8xl font-bold tracking-tight logo-gradient select-none"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={
              isFlying
                ? {
                    x: targetPosition.x,
                    y: targetPosition.y,
                    scale: targetPosition.scale,
                    opacity: 1,
                  }
                : { opacity: 1, scale: [0.96, 1.012, 1], x: 0, y: 0 }
            }
            transition={
              isFlying
                ? { duration: FLY_TO_HEADER, ease: [0.32, 0.72, 0, 1] }
                : {
                    duration: FADE_IN,
                    delay: BLACK_DELAY,
                    ease: 'easeOut',
                    scale: {
                      duration: FADE_IN * 1.2,
                      delay: BLACK_DELAY,
                      times: [0, 0.7, 1],
                      ease: 'easeInOut',
                    },
                  }
            }
            onAnimationComplete={() => {
              if (phase === 'fadeIn') {
                setPhase('hold');
                setTimeout(() => setPhase('flyToHeader'), HOLD * 1000);
              }
            }}
          >
            Jamium
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
