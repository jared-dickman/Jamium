'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function FrequencyLoader({ size = 'md' }: LoaderProps) {
  const dimension = LOADER_SIZE[size];
  const bars = 9;
  const barWidth = dimension / (bars * 1.8);

  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex items-center justify-center"
      style={{ width: dimension, height: dimension }}
    >
      <svg width={dimension} height={dimension} viewBox={`0 0 ${dimension} ${dimension}`}>
        <defs>
          <linearGradient id="freqGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={SAPPHIRE[0]} />
            <stop offset="100%" stopColor={SAPPHIRE[2]} />
          </linearGradient>
        </defs>
        {Array.from({ length: bars }).map((_, i) => {
          const x = (dimension / (bars + 1)) * (i + 1);
          const maxHeight = dimension * 0.7;
          const minHeight = dimension * 0.15;
          const delay = i * 0.07;

          return (
            <motion.rect
              key={i}
              x={x - barWidth / 2}
              y={dimension / 2 - minHeight / 2}
              width={barWidth}
              height={minHeight}
              rx={barWidth / 2}
              fill="url(#freqGrad)"
              opacity={0.7}
              animate={{
                height: [minHeight, maxHeight, minHeight],
                y: [
                  dimension / 2 - minHeight / 2,
                  dimension / 2 - maxHeight / 2,
                  dimension / 2 - minHeight / 2,
                ],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
