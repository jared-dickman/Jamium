'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function BondLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const atomR = dim * 0.1;
  const leftX = dim * 0.25;
  const rightX = dim * 0.75;
  const centerY = dim / 2;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        {/* Left atom */}
        <motion.circle
          cx={leftX}
          cy={centerY}
          r={atomR}
          fill={SAPPHIRE[1]}
          stroke={SAPPHIRE[0]}
          strokeWidth="1.5"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ originX: `${leftX}px`, originY: `${centerY}px` }}
        />

        {/* Right atom */}
        <motion.circle
          cx={rightX}
          cy={centerY}
          r={atomR}
          fill={SAPPHIRE[2]}
          stroke={SAPPHIRE[0]}
          strokeWidth="1.5"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
          style={{ originX: `${rightX}px`, originY: `${centerY}px` }}
        />

        {/* Triple bond forming */}
        {[-1, 0, 1].map((offset, i) => {
          const y = centerY + offset * atomR * 0.35;

          return (
            <motion.line
              key={i}
              x1={leftX + atomR}
              y1={y}
              x2={rightX - atomR}
              y2={y}
              stroke={SAPPHIRE[3]}
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 0, 1],
                opacity: [0, 0, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.15,
                times: [0, 0.3, 1],
                ease: 'easeOut',
              }}
            />
          );
        })}

        {/* Electron sharing animation */}
        {[0, 1].map(i => (
          <motion.circle
            key={`electron-${i}`}
            cx={leftX}
            cy={centerY}
            r={atomR * 0.15}
            fill={SAPPHIRE[0]}
            initial={{ cx: leftX }}
            animate={{
              cx: [leftX, rightX, leftX],
              opacity: [0.8, 0.8, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 1,
              ease: 'linear',
            }}
          />
        ))}
      </svg>
    </div>
  );
}
