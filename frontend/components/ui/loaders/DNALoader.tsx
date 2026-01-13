'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function DNALoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const helixPoints = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox="0 0 64 64">
        {helixPoints.map(i => {
          const y = 8 + i * 7;
          const phase = (i * Math.PI) / 3;

          return (
            <g key={i}>
              <motion.circle
                cx="32"
                cy={y}
                r="2.5"
                fill={SAPPHIRE[1]}
                animate={{
                  cx: [32 - 12 * Math.sin(phase), 32 + 12 * Math.sin(phase)],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.1,
                }}
              />

              <motion.circle
                cx="32"
                cy={y}
                r="2.5"
                fill={SAPPHIRE[2]}
                animate={{
                  cx: [32 + 12 * Math.sin(phase), 32 - 12 * Math.sin(phase)],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.1,
                }}
              />

              <motion.line
                x1="32"
                y1={y}
                x2="32"
                y2={y}
                stroke={SAPPHIRE[3]}
                strokeWidth="0.8"
                opacity="0.3"
                animate={{
                  x1: [32 - 12 * Math.sin(phase), 32 + 12 * Math.sin(phase)],
                  x2: [32 + 12 * Math.sin(phase), 32 - 12 * Math.sin(phase)],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.1,
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
