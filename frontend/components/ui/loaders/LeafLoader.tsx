'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  SAPPHIRE,
  LOADER_SIZE,
  DURATION,
  OPACITY,
  type LoaderProps,
} from '@/components/ui/loaders/loader.constants';

export function LeafLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];

  // Natural falling motion with bezier curves and organic sway - endless loop with fade
  const fallVariants = (delay: number, xOffset: number) => ({
    animate: {
      y: [0, dim * 1.1], // Fall beyond viewport for smooth loop
      x: [xOffset, xOffset + 15, xOffset - 10, xOffset + 8, xOffset - 5, xOffset],
      rotate: [0, 45, -30, 20, -15, 0],
      opacity: [0, 1, 1, 1, 0.6, 0], // Smooth fade at end
    },
    transition: {
      duration: DURATION.verySlow + delay * 0.3,
      repeat: Infinity,
      delay,
      ease: [0.34, 0.16, 0.42, 0.98] as const, // Gentle bezier for natural fall
    },
  });

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center overflow-hidden', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox="0 0 100 100">
        {/* Layer 1: Background leaf (lightest) */}
        <motion.g {...fallVariants(0, 35)} style={{ transformOrigin: 'center' }}>
          {/* Leaf shape */}
          <path
            d="M50,10 Q65,20 65,35 Q65,50 50,60 Q35,50 35,35 Q35,20 50,10 Z"
            fill={SAPPHIRE[3]}
            opacity={OPACITY.medium}
          />
          {/* Stem */}
          <line
            x1="50"
            y1="10"
            x2="50"
            y2="5"
            stroke={SAPPHIRE[2]}
            strokeWidth="1"
            strokeLinecap="round"
            opacity={OPACITY.medium}
          />
          {/* Veins */}
          <path
            d="M50,15 L45,25 M50,20 L55,30 M50,25 L43,35"
            stroke={SAPPHIRE[2]}
            strokeWidth="0.5"
            opacity={OPACITY.subtle}
          />
        </motion.g>

        {/* Layer 2: Mid leaf */}
        <motion.g {...fallVariants(0.8, 45)} style={{ transformOrigin: 'center' }}>
          <path
            d="M50,15 Q62,23 62,37 Q62,48 50,56 Q38,48 38,37 Q38,23 50,15 Z"
            fill={SAPPHIRE[2]}
            opacity={OPACITY.strong}
          />
          <line
            x1="50"
            y1="15"
            x2="50"
            y2="10"
            stroke={SAPPHIRE[1]}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M50,18 L46,26 M50,22 L54,31 M50,28 L44,37"
            stroke={SAPPHIRE[1]}
            strokeWidth="0.6"
            opacity={OPACITY.medium}
          />
        </motion.g>

        {/* Layer 3: Front leaf (darkest) */}
        <motion.g {...fallVariants(1.5, 55)} style={{ transformOrigin: 'center' }}>
          <path
            d="M50,20 Q60,27 60,39 Q60,48 50,54 Q40,48 40,39 Q40,27 50,20 Z"
            fill={SAPPHIRE[0]}
            opacity={OPACITY.strong}
          />
          <line
            x1="50"
            y1="20"
            x2="50"
            y2="15"
            stroke={SAPPHIRE[0]}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M50,23 L47,29 M50,26 L53,33 M50,31 L45,38"
            stroke={SAPPHIRE[1]}
            strokeWidth="0.7"
            opacity={OPACITY.medium}
          />
        </motion.g>
      </svg>
    </div>
  );
}
