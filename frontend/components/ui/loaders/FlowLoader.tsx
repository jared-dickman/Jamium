'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function FlowLoader({ size = 'md' }: LoaderProps) {
  const dimension = LOADER_SIZE[size];
  const streamCount = 4;

  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex items-center justify-center"
      style={{ width: dimension, height: dimension }}
    >
      <svg width={dimension} height={dimension} viewBox={`0 0 ${dimension} ${dimension}`}>
        <defs>
          {Array.from({ length: streamCount }).map((_, i) => (
            <linearGradient
              key={`grad-${i}`}
              id={`flow-gradient-${i}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={SAPPHIRE[i % SAPPHIRE.length]} stopOpacity="0" />
              <stop offset="50%" stopColor={SAPPHIRE[i % SAPPHIRE.length]} stopOpacity="0.8" />
              <stop offset="100%" stopColor={SAPPHIRE[i % SAPPHIRE.length]} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {Array.from({ length: streamCount }).map((_, i) => {
          const y = (dimension * (i + 1)) / (streamCount + 1);
          const amplitude = dimension * 0.12;

          return (
            <motion.path
              key={i}
              d={`M 0 ${y} Q ${dimension * 0.25} ${y - amplitude}, ${dimension * 0.5} ${y} T ${dimension} ${y}`}
              stroke={`url(#flow-gradient-${i})`}
              strokeWidth={dimension * 0.04}
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
