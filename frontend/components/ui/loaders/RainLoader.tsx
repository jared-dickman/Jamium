'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

const raindrops = [
  { x: 18, delay: 0, duration: 1.2, length: 18 },
  { x: 32, delay: 0.4, duration: 0.9, length: 12 },
  { x: 50, delay: 0.15, duration: 1.5, length: 22 },
  { x: 65, delay: 0.65, duration: 1.1, length: 15 },
  { x: 82, delay: 0.25, duration: 1.3, length: 20 },
  { x: 25, delay: 0.75, duration: 0.95, length: 10 },
  { x: 58, delay: 0.5, duration: 1.25, length: 16 },
  { x: 75, delay: 0.1, duration: 1.4, length: 19 },
];

export function RainLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox="0 0 100 100">
        {raindrops.map((drop, i) => (
          <motion.line
            key={i}
            x1={drop.x}
            y1="0"
            x2={drop.x}
            y2={drop.length}
            stroke={SAPPHIRE[i % 4]}
            strokeWidth={i % 3 === 0 ? 2.5 : i % 2 === 0 ? 2 : 1.5}
            strokeLinecap="round"
            initial={{ y1: -drop.length, y2: 0, opacity: 0 }}
            animate={{
              y1: [0, 100],
              y2: [drop.length, 100 + drop.length],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: drop.duration,
              repeat: Infinity,
              delay: drop.delay,
              ease: [0.4, 0, 0.6, 1],
              times: [0, 0.05, 0.92, 1],
            }}
          />
        ))}
        {[0, 1, 2, 3].map(i => (
          <motion.circle
            key={`splash-${i}`}
            cx={22 + i * 21 + (i % 2 === 0 ? 5 : -3)}
            cy="88"
            r="0"
            fill="none"
            stroke={SAPPHIRE[(i + 1) % 4]}
            strokeWidth={i % 2 === 0 ? 1.5 : 1.2}
            animate={{
              r: [0, i % 2 === 0 ? 10 : 7, i % 2 === 0 ? 14 : 11],
              opacity: [0.9, 0.5, 0],
            }}
            transition={{
              duration: i % 3 === 0 ? 1.4 : i % 2 === 0 ? 1.1 : 1.25,
              repeat: Infinity,
              delay: 0.3 * i + (i % 2 === 0 ? 0.1 : 0),
              ease: 'easeOut',
            }}
          />
        ))}
      </svg>
    </div>
  );
}
