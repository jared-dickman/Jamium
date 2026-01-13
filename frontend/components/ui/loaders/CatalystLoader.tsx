'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function CatalystLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const particleR = dim * 0.05;
  const catalystR = dim * 0.12;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        {/* Central catalyst surface */}
        <motion.rect
          x={dim / 2 - catalystR}
          y={dim / 2 - catalystR}
          width={catalystR * 2}
          height={catalystR * 2}
          rx={catalystR * 0.3}
          fill={SAPPHIRE[0]}
          stroke={SAPPHIRE[1]}
          strokeWidth="2"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ originX: `${dim / 2}px`, originY: `${dim / 2}px` }}
        />

        {/* Reaction active sites */}
        {[0, 1, 2, 3].map(i => {
          const angle = (i * 90 + 45) * (Math.PI / 180);
          const siteX = dim / 2 + Math.cos(angle) * catalystR * 0.6;
          const siteY = dim / 2 + Math.sin(angle) * catalystR * 0.6;

          return (
            <motion.circle
              key={`site-${i}`}
              cx={siteX}
              cy={siteY}
              r={particleR * 0.4}
              fill={SAPPHIRE[2]}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
              style={{ originX: `${siteX}px`, originY: `${siteY}px` }}
            />
          );
        })}

        {/* Reactant molecules approaching */}
        {[0, 1].map(i => {
          const startY = dim * 0.3 + i * dim * 0.4;
          const endY = dim / 2;

          return (
            <g key={`reactant-${i}`}>
              <motion.circle
                cx={dim * 0.15}
                cy={startY}
                r={particleR}
                fill={SAPPHIRE[1]}
                animate={{
                  cx: [dim * 0.15, dim / 2 - catalystR * 1.2, dim / 2],
                  cy: [startY, endY, endY],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 1.5,
                }}
              />
            </g>
          );
        })}

        {/* Product molecules leaving */}
        {[0, 1].map(i => {
          const startY = dim / 2;
          const endY = dim * 0.3 + i * dim * 0.4;

          return (
            <motion.circle
              key={`product-${i}`}
              cx={dim / 2}
              cy={startY}
              r={particleR}
              fill={SAPPHIRE[3]}
              initial={{ opacity: 0 }}
              animate={{
                cx: [dim / 2, dim / 2 + catalystR * 1.2, dim * 0.85],
                cy: [startY, endY, endY],
                opacity: [0, 1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 1.5 + 1,
              }}
            />
          );
        })}

        {/* Energy wave pulses */}
        <motion.circle
          cx={dim / 2}
          cy={dim / 2}
          r={catalystR}
          fill="none"
          stroke={SAPPHIRE[2]}
          strokeWidth="1"
          animate={{
            r: [catalystR, catalystR * 1.8],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      </svg>
    </div>
  );
}
