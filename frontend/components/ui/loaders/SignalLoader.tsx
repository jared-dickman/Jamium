'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function SignalLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const waves = 3;

  const generateWavePath = (frequency: number, amplitude: number, phase: number) => {
    const points = 50;
    const path: string[] = [];

    for (let i = 0; i <= points; i++) {
      const x = (i / points) * dim;
      const y = dim / 2 + Math.sin((i / points) * Math.PI * frequency + phase) * amplitude;
      path.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
    }

    return path.join(' ');
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        <defs>
          <filter id="signalGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {Array.from({ length: waves }).map((_, i) => {
          const amplitude = (dim * 0.15 * (waves - i)) / waves;
          const frequency = 2 + i;

          return (
            <motion.path
              key={i}
              d={generateWavePath(frequency, amplitude, 0)}
              fill="none"
              stroke={SAPPHIRE[i]}
              strokeWidth={size === 'sm' ? 1.5 : size === 'md' ? 2 : 2.5}
              strokeLinecap="round"
              filter="url(#signalGlow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1, 1, 0],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
