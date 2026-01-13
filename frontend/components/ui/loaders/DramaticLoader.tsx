'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RandomLoader } from '@/components/ui/loaders/RandomLoader';
import { cn } from '@/lib/utils';

const DRAMATIC_DURATION = 0.666;
/** Minimum time to display loader AFTER data resolves - let users enjoy the show */
const POST_LOAD_DISPLAY_MS = 1420;

interface DramaticLoaderProps {
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function DramaticLoader({ isLoading = true, size = 'lg', className }: DramaticLoaderProps) {
  const [showLoader, setShowLoader] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      // Show immediately when loading starts
      setShowLoader(true);
      return;
    }
    // Data loaded - wait 1.420s so user enjoys the animation
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, POST_LOAD_DISPLAY_MS);

    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <AnimatePresence mode="wait">
      {showLoader && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{
            duration: DRAMATIC_DURATION,
            ease: 'easeInOut',
          }}
          className={cn('flex items-center justify-center absolute inset-0', className)}
        >
          <div className="scale-150">
            <RandomLoader size={size} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PageLoader() {
  return (
    <div className="relative min-h-[50vh] w-full">
      <DramaticLoader size="lg" />
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <DramaticLoader size="lg" />
    </div>
  );
}
