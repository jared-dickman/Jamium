'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function EqualizerLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const bars = 7;
  const barWidth = dim / (bars * 1.8);
  const gap = barWidth * 0.4;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        <g transform={`translate(${(dim - (bars * barWidth + (bars - 1) * gap)) / 2}, 0)`}>
          {Array.from({ length: bars }).map((_, i) => {
            const x = i * (barWidth + gap);
            const minHeight = dim * 0.2;
            const maxHeight = dim * 0.8;

            return (
              <motion.rect
                key={i}
                x={x}
                width={barWidth}
                rx={barWidth / 3}
                fill={SAPPHIRE[i % SAPPHIRE.length]}
                initial={{ y: dim / 2, height: minHeight }}
                animate={{
                  y: [dim - minHeight - i * 2, dim - maxHeight + i * 2, dim - minHeight - i * 2],
                  height: [minHeight + i * 2, maxHeight - i * 2, minHeight + i * 2],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.08,
                }}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
