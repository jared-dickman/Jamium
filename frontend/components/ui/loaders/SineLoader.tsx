'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function SineLoader({ size = 'md' }: LoaderProps) {
  const dimension = LOADER_SIZE[size];
  const svgSize = dimension * 0.8;
  const points = 100;
  const waves = 3;

  const generatePath = (
    phase: number,
    frequency: number,
    amplitude: number,
    verticalOffset: number
  ) => {
    let path = `M 0 ${svgSize / 2 + verticalOffset}`;
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * svgSize;
      const y =
        svgSize / 2 +
        verticalOffset +
        Math.sin((i / points) * Math.PI * frequency + phase) * amplitude;
      path += ` L ${x} ${y}`;
    }
    return path;
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex items-center justify-center overflow-hidden"
      style={{ width: dimension, height: dimension }}
    >
      <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
        {Array.from({ length: waves }).map((_, i) => {
          const frequency = 3 + i * 0.8;
          const amplitude = svgSize * (0.15 - i * 0.03);
          const verticalOffset = (i - 1) * svgSize * 0.08;
          const delay = i * 0.15;
          const duration = 2.5 - i * 0.2;

          return (
            <motion.path
              key={i}
              d={generatePath(0, frequency, amplitude, verticalOffset)}
              fill="none"
              stroke={SAPPHIRE[i % SAPPHIRE.length]}
              strokeWidth={svgSize * (0.035 - i * 0.008)}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.9 - i * 0.2}
              animate={{
                d: Array.from({ length: 5 }, (_, idx) =>
                  generatePath((idx / 4) * Math.PI * 2, frequency, amplitude, verticalOffset)
                ),
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: 'linear',
                delay,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
