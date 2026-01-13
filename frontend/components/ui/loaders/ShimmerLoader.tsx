'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function ShimmerLoader({ size = 'md' }: LoaderProps) {
  const dimension = LOADER_SIZE[size];
  const barCount = 6;

  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex items-center justify-center"
      style={{ width: dimension, height: dimension }}
    >
      <svg width={dimension} height={dimension} viewBox={`0 0 ${dimension} ${dimension}`}>
        <defs>
          <linearGradient id="shimmer-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={SAPPHIRE[3]} stopOpacity="0.2" />
            <stop offset="50%" stopColor={SAPPHIRE[1]} stopOpacity="1" />
            <stop offset="100%" stopColor={SAPPHIRE[3]} stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {Array.from({ length: barCount }).map((_, i) => {
          const x = (dimension * (i + 0.5)) / barCount;
          const barWidth = dimension * 0.05;
          const maxHeight = dimension * 0.7;

          return (
            <motion.rect
              key={i}
              x={x - barWidth / 2}
              width={barWidth}
              fill="url(#shimmer-gradient)"
              rx={barWidth / 2}
              initial={{
                y: dimension / 2,
                height: 0,
              }}
              animate={{
                y: [dimension / 2, dimension / 2 - maxHeight / 2, dimension / 2],
                height: [0, maxHeight, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: i * 0.12,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
