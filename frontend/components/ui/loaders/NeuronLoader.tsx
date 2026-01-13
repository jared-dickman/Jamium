'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function NeuronLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const dendrites = Array.from({ length: 6 }, (_, i) => i);

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
          r="8"
          fill={SAPPHIRE[1]}
          animate={{
            r: [8, 9.5, 8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {dendrites.map(i => {
          const angle = (i * 360) / dendrites.length;
          const rad = (angle * Math.PI) / 180;
          const x1 = 32 + Math.cos(rad) * 8;
          const y1 = 32 + Math.sin(rad) * 8;
          const x2 = 32 + Math.cos(rad) * 22;
          const y2 = 32 + Math.sin(rad) * 22;

          return (
            <g key={i}>
              <motion.path
                d={`M ${x1} ${y1} Q ${32 + Math.cos(rad) * 15} ${32 + Math.sin(rad) * 15 + 4} ${x2} ${y2}`}
                fill="none"
                stroke={SAPPHIRE[2]}
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 1, 1, 0],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'easeInOut',
                }}
              />

              <motion.circle
                cx={x2}
                cy={y2}
                r="2.5"
                fill={SAPPHIRE[0]}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 1, 0],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3 + 0.8,
                  ease: 'easeInOut',
                }}
              />

              <motion.circle
                cx="32"
                cy="32"
                r="3"
                fill={SAPPHIRE[3]}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3 + 1.2,
                  ease: 'easeInOut',
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
