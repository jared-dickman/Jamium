'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function DopplerLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox="0 0 100 100">
        {/* Moving sound source */}
        <motion.circle
          cx="20"
          cy="50"
          r="5"
          fill={SAPPHIRE[3]}
          animate={{
            cx: [20, 80, 20],
            opacity: [0.3, 1, 1, 1, 0.3],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Compressed waves (moving right) */}
        {[0, 1, 2].map(i => (
          <motion.ellipse
            key={`right-${i}`}
            cx="50"
            cy="50"
            rx="10"
            ry="15"
            fill="none"
            stroke={SAPPHIRE[i]}
            strokeWidth="1.5"
            opacity="0.7"
            animate={{
              cx: [20, 80],
              rx: [10, 5],
              opacity: [0.7, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'linear',
            }}
          />
        ))}

        {/* Expanded waves (moving left) */}
        {[0, 1].map(i => (
          <motion.ellipse
            key={`left-${i}`}
            cx="50"
            cy="50"
            rx="10"
            ry="15"
            fill="none"
            stroke={SAPPHIRE[3 - i]}
            strokeWidth="1.5"
            opacity="0.7"
            animate={{
              cx: [80, 20],
              rx: [5, 15],
              opacity: [0.7, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5 + 2,
              ease: 'linear',
            }}
          />
        ))}
      </svg>
    </div>
  );
}
