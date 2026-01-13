'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function TetrisLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const blockSize = dim * 0.12;
  const gap = dim * 0.02;

  const blocks = [
    // L-piece falling
    { x: 0.3, y: -0.1, delay: 0 },
    { x: 0.3, y: 0.05, delay: 0 },
    { x: 0.3, y: 0.2, delay: 0 },
    { x: 0.45, y: 0.2, delay: 0 },
    // T-piece falling
    { x: 0.55, y: -0.3, delay: 0.5 },
    { x: 0.4, y: -0.15, delay: 0.5 },
    { x: 0.55, y: -0.15, delay: 0.5 },
    { x: 0.7, y: -0.15, delay: 0.5 },
  ];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={className}
      style={{
        width: dim,
        height: dim,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        {/* Stacked blocks at bottom */}
        {[0.2, 0.35, 0.5, 0.65, 0.8].map((x, i) => (
          <rect
            key={`base-${i}`}
            x={dim * x - blockSize / 2}
            y={dim * 0.85 - blockSize / 2}
            width={blockSize}
            height={blockSize}
            rx={dim * 0.01}
            fill={SAPPHIRE[i % 4]}
            opacity={0.4}
          />
        ))}

        {/* Falling blocks */}
        {blocks.map((block, i) => (
          <motion.rect
            key={i}
            x={dim * block.x - blockSize / 2}
            width={blockSize}
            height={blockSize}
            rx={dim * 0.01}
            fill={SAPPHIRE[i % 4]}
            animate={{
              y: [dim * block.y - blockSize / 2, dim * 0.7 - blockSize / 2],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: block.delay,
              ease: 'easeIn',
            }}
          />
        ))}
      </svg>
    </div>
  );
}
