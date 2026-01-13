'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function ReactionLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const bubbleR = dim * 0.05;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        {/* Flask outline */}
        <motion.path
          d={`M ${dim * 0.3} ${dim * 0.2} L ${dim * 0.3} ${dim * 0.4} Q ${dim * 0.2} ${dim * 0.6} ${dim * 0.25} ${dim * 0.8} L ${dim * 0.75} ${dim * 0.8} Q ${dim * 0.8} ${dim * 0.6} ${dim * 0.7} ${dim * 0.4} L ${dim * 0.7} ${dim * 0.2}`}
          fill="none"
          stroke={SAPPHIRE[3]}
          strokeWidth="1.5"
          opacity="0.5"
        />

        {/* Bubbles rising */}
        {[0, 1, 2, 3, 4, 5].map(i => {
          const startX = dim * (0.35 + i * 0.05);
          const endY = dim * 0.25;
          const startY = dim * 0.75;
          const controlX = startX + (Math.random() - 0.5) * dim * 0.1;

          return (
            <motion.circle
              key={i}
              cx={startX}
              cy={startY}
              r={bubbleR}
              fill={SAPPHIRE[i % 4]}
              initial={{ cy: startY, opacity: 0, scale: 0.3 }}
              animate={{
                cy: [startY, endY],
                cx: [startX, controlX, startX + (Math.random() - 0.5) * dim * 0.08],
                opacity: [0, 0.8, 1, 0.6, 0],
                scale: [0.3, 1, 1.2, 1.3, 0.5],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.35,
                ease: 'easeOut',
              }}
            />
          );
        })}

        {/* Energy waves */}
        {[0, 1].map(i => (
          <motion.circle
            key={`wave-${i}`}
            cx={dim / 2}
            cy={dim * 0.65}
            r={dim * 0.15}
            fill="none"
            stroke={SAPPHIRE[2]}
            strokeWidth="1"
            initial={{ scale: 0.5, opacity: 0.6 }}
            animate={{
              scale: [0.5, 2],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 1,
              ease: 'easeOut',
            }}
            style={{ originX: `${dim / 2}px`, originY: `${dim * 0.65}px` }}
          />
        ))}
      </svg>
    </div>
  );
}
