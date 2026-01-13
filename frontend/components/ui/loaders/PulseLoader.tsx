'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function PulseLoader({ size = 'md' }: LoaderProps) {
  const dimension = LOADER_SIZE[size];
  const bars = 8;

  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex items-center justify-center"
      style={{ width: dimension, height: dimension }}
    >
      <svg width={dimension} height={dimension} viewBox={`0 0 ${dimension} ${dimension}`}>
        <defs>
          <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={SAPPHIRE[1]} stopOpacity={0.8} />
            <stop offset="100%" stopColor={SAPPHIRE[3]} stopOpacity={0.9} />
          </linearGradient>
        </defs>
        {Array.from({ length: bars }).map((_, i) => {
          const angle = (i * 360) / bars;
          const delay = i * 0.1;
          const radius = dimension * 0.32;
          const barLength = dimension * 0.15;
          const x = dimension / 2 + radius * Math.cos((angle * Math.PI) / 180);
          const y = dimension / 2 + radius * Math.sin((angle * Math.PI) / 180);

          return (
            <motion.line
              key={i}
              x1={x}
              y1={y}
              x2={x + barLength * Math.cos((angle * Math.PI) / 180)}
              y2={y + barLength * Math.sin((angle * Math.PI) / 180)}
              stroke="url(#pulseGrad)"
              strokeWidth={dimension * 0.04}
              strokeLinecap="round"
              initial={{ opacity: 0.3 }}
              animate={{
                opacity: [0.3, 1, 0.3],
                strokeWidth: [dimension * 0.03, dimension * 0.05, dimension * 0.03],
              }}
              transition={{
                duration: 1.2,
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
