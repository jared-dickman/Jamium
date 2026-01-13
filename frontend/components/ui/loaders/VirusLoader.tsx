'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function VirusLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const spikes = Array.from({ length: 16 }, (_, i) => i);

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox="0 0 64 64">
        <motion.circle
          cx="32"
          cy="32"
          r="14"
          fill={SAPPHIRE[1] + '30'}
          stroke={SAPPHIRE[1]}
          strokeWidth="1.5"
          animate={{
            r: [14, 15.5, 14],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {spikes.map(i => {
          const angle = (i * 360) / spikes.length;
          const rad = (angle * Math.PI) / 180;
          const x1 = 32 + Math.cos(rad) * 14;
          const y1 = 32 + Math.sin(rad) * 14;
          const x2 = 32 + Math.cos(rad) * 24;
          const y2 = 32 + Math.sin(rad) * 24;

          return (
            <g key={i}>
              <motion.line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={SAPPHIRE[2]}
                strokeWidth="1.5"
                strokeLinecap="round"
                animate={{
                  x2: [x2, 32 + Math.cos(rad) * 26, x2],
                  y2: [y2, 32 + Math.sin(rad) * 26, y2],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.05,
                }}
              />

              <motion.circle
                cx={x2}
                cy={y2}
                r="2"
                fill={SAPPHIRE[0]}
                animate={{
                  cx: [x2, 32 + Math.cos(rad) * 26, x2],
                  cy: [y2, 32 + Math.sin(rad) * 26, y2],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.05,
                }}
              />
            </g>
          );
        })}

        <motion.circle
          cx="32"
          cy="32"
          r="6"
          fill={SAPPHIRE[2]}
          animate={{
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </svg>
    </div>
  );
}
