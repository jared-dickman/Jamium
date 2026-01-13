'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function BinaryLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const cols = 5;
  const rows = 4;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {Array.from({ length: cols }).map((_, col) =>
          Array.from({ length: rows }).map((_, row) => {
            const x = (col * dim) / cols + dim / cols / 2;
            const y = (row * dim) / rows + dim / rows / 2;
            const bit = Math.random() > 0.5 ? '1' : '0';
            const delay = col * 0.1 + row * 0.05;

            return (
              <motion.text
                key={`${col}-${row}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={dim / 8}
                fontFamily="monospace"
                fontWeight="600"
                fill={SAPPHIRE[row % SAPPHIRE.length]}
                filter="url(#glow)"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay,
                  ease: 'easeInOut',
                }}
              >
                {bit}
              </motion.text>
            );
          })
        )}
      </svg>
    </div>
  );
}
