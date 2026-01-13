'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  SAPPHIRE,
  LOADER_SIZE,
  LOADER_STROKE,
  type LoaderProps,
} from '@/components/ui/loaders/loader.constants';

export function TempoLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const stroke = LOADER_STROKE[size];
  const centerX = dim / 2;
  const centerY = dim * 0.3;

  const baseWidth = dim * 0.35;
  const baseHeight = dim * 0.55;
  const armLength = dim * 0.4;
  const pivotY = centerY + baseHeight * 0.2;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        <path
          d={`
            M ${centerX - baseWidth / 2} ${centerY + baseHeight}
            L ${centerX} ${centerY}
            L ${centerX + baseWidth / 2} ${centerY + baseHeight}
            Z
          `}
          fill={SAPPHIRE[0]}
          fillOpacity="0.2"
          stroke={SAPPHIRE[1]}
          strokeWidth={stroke}
        />

        <line
          x1={centerX - baseWidth / 2 + stroke * 2}
          y1={centerY + baseHeight}
          x2={centerX + baseWidth / 2 - stroke * 2}
          y2={centerY + baseHeight}
          stroke={SAPPHIRE[2]}
          strokeWidth={stroke * 1.5}
          strokeLinecap="round"
        />

        <motion.g
          animate={{
            rotate: [-25, 25, -25],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: [0.45, 0.05, 0.55, 0.95],
          }}
          style={{ transformOrigin: `${centerX}px ${pivotY}px` }}
        >
          <line
            x1={centerX}
            y1={pivotY}
            x2={centerX}
            y2={pivotY - armLength}
            stroke={SAPPHIRE[2]}
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <circle cx={centerX} cy={pivotY - armLength} r={dim * 0.06} fill={SAPPHIRE[3]} />
        </motion.g>

        <circle cx={centerX} cy={pivotY} r={dim * 0.04} fill={SAPPHIRE[1]} />
      </svg>
    </div>
  );
}
