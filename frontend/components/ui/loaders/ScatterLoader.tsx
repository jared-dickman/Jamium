'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function ScatterLoader({ size = 'md' }: LoaderProps) {
  const dimension = LOADER_SIZE[size];
  const particleCount = 12;

  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex items-center justify-center"
      style={{ width: dimension, height: dimension }}
    >
      <svg width={dimension} height={dimension} viewBox={`0 0 ${dimension} ${dimension}`}>
        {Array.from({ length: particleCount }).map((_, i) => {
          const angle = (i / particleCount) * Math.PI * 2;
          const startRadius = dimension * 0.05;
          const endRadius = dimension * 0.45;
          const particleRadius = dimension * 0.04;

          return (
            <motion.circle
              key={i}
              r={particleRadius}
              fill={SAPPHIRE[i % SAPPHIRE.length]}
              initial={{
                cx: dimension / 2,
                cy: dimension / 2,
                opacity: 0,
              }}
              animate={{
                cx: [dimension / 2, dimension / 2 + Math.cos(angle) * endRadius],
                cy: [dimension / 2, dimension / 2 + Math.sin(angle) * endRadius],
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.08,
                ease: 'easeOut',
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
