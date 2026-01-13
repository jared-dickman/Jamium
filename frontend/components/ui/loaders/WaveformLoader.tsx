'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function WaveformLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const points = 50;
  const amplitude = dim * 0.15;

  const generatePath = (phase: number) => {
    let path = `M 0 ${dim / 2}`;
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * dim;
      const y = dim / 2 + Math.sin((i / points) * Math.PI * 4 + phase) * amplitude;
      path += ` L ${x} ${y}`;
    }
    return path;
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        {[0, 1, 2].map(idx => (
          <motion.path
            key={idx}
            d={generatePath(0)}
            fill="none"
            stroke={SAPPHIRE[idx]}
            strokeWidth={1.5}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0.4 }}
            animate={{
              d: [generatePath(0), generatePath(Math.PI), generatePath(Math.PI * 2)],
              opacity: [0.4, 0.9, 0.4],
              pathLength: [0, 1, 0],
            }}
            transition={{
              duration: 2 + idx * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: idx * 0.2,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
