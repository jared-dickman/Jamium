'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function MagnetLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="field-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={SAPPHIRE[0]} stopOpacity="0" />
            <stop offset="100%" stopColor={SAPPHIRE[0]} stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="field-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={SAPPHIRE[1]} stopOpacity="0" />
            <stop offset="100%" stopColor={SAPPHIRE[1]} stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Magnetic poles */}
        <rect x="10" y="35" width="8" height="30" rx="2" fill={SAPPHIRE[0]} />
        <rect x="82" y="35" width="8" height="30" rx="2" fill={SAPPHIRE[3]} />

        {/* Field lines */}
        {[0, 1, 2, 3].map(i => {
          const yOffset = 25 + i * 15;
          return (
            <motion.path
              key={i}
              d={`M 18 ${yOffset} Q 50 ${yOffset + (i % 2 ? 10 : -10)} 82 ${yOffset}`}
              stroke={SAPPHIRE[i]}
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
              strokeDasharray="4 2"
              animate={{
                strokeDashoffset: [0, -12],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          );
        })}

        {/* Particles following field lines */}
        {SAPPHIRE.slice(0, 2).map((color, i) => (
          <motion.circle
            key={i}
            cx="18"
            cy="40"
            r="2.5"
            fill={color}
            animate={{
              cx: [18, 82],
              cy: [40, 40 + (i % 2 ? 10 : -10), 40],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 1.25,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>
    </div>
  );
}
