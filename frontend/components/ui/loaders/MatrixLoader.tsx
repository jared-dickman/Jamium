'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function MatrixLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const cols = 6;
  const chars = '01アイウ'.split('');

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center overflow-hidden', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        <defs>
          <linearGradient id="matrixGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={SAPPHIRE[0]} stopOpacity="0" />
            <stop offset="30%" stopColor={SAPPHIRE[1]} stopOpacity="1" />
            <stop offset="70%" stopColor={SAPPHIRE[2]} stopOpacity="0.6" />
            <stop offset="100%" stopColor={SAPPHIRE[3]} stopOpacity="0" />
          </linearGradient>
        </defs>

        {Array.from({ length: cols }).map((_, col) => {
          const x = (col * dim) / cols + dim / cols / 2;
          const trail = 5;

          return (
            <g key={col}>
              {Array.from({ length: trail }).map((_, i) => {
                const char = chars[Math.floor(Math.random() * chars.length)];
                const opacity = 1 - i / trail;

                return (
                  <motion.text
                    key={`${col}-${i}`}
                    x={x}
                    y={0}
                    textAnchor="middle"
                    fontSize={dim / 8}
                    fontFamily="monospace"
                    fontWeight="700"
                    fill="url(#matrixGradient)"
                    opacity={opacity}
                    animate={{
                      y: [-((i * dim) / trail), dim + ((trail - i) * dim) / trail],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: col * 0.2,
                      ease: 'linear',
                    }}
                  >
                    {char}
                  </motion.text>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
