'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function CassetteLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const reelRadius = dim * 0.15;
  const spacing = dim * 0.5;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        <rect
          x={dim * 0.1}
          y={dim * 0.25}
          width={dim * 0.8}
          height={dim * 0.5}
          rx={2}
          fill="none"
          stroke={SAPPHIRE[1]}
          strokeWidth="1.5"
        />

        <rect
          x={dim * 0.15}
          y={dim * 0.3}
          width={dim * 0.7}
          height={dim * 0.15}
          fill={SAPPHIRE[0]}
          opacity="0.3"
        />

        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: `${dim * 0.3}px ${dim * 0.5}px` }}
        >
          <circle
            cx={dim * 0.3}
            cy={dim * 0.5}
            r={reelRadius}
            fill={SAPPHIRE[0]}
            stroke={SAPPHIRE[2]}
            strokeWidth="1"
          />
          {[0, 60, 120, 180, 240, 300].map(angle => (
            <line
              key={angle}
              x1={dim * 0.3}
              y1={dim * 0.5}
              x2={dim * 0.3 + reelRadius * 0.6 * Math.cos((angle * Math.PI) / 180)}
              y2={dim * 0.5 + reelRadius * 0.6 * Math.sin((angle * Math.PI) / 180)}
              stroke={SAPPHIRE[3]}
              strokeWidth="0.5"
            />
          ))}
        </motion.g>

        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: `${dim * 0.7}px ${dim * 0.5}px` }}
        >
          <circle
            cx={dim * 0.7}
            cy={dim * 0.5}
            r={reelRadius}
            fill={SAPPHIRE[0]}
            stroke={SAPPHIRE[2]}
            strokeWidth="1"
          />
          {[0, 60, 120, 180, 240, 300].map(angle => (
            <line
              key={angle}
              x1={dim * 0.7}
              y1={dim * 0.5}
              x2={dim * 0.7 + reelRadius * 0.6 * Math.cos((angle * Math.PI) / 180)}
              y2={dim * 0.5 + reelRadius * 0.6 * Math.sin((angle * Math.PI) / 180)}
              stroke={SAPPHIRE[3]}
              strokeWidth="0.5"
            />
          ))}
        </motion.g>

        <line
          x1={dim * 0.3}
          y1={dim * 0.5 - reelRadius}
          x2={dim * 0.7}
          y2={dim * 0.5 - reelRadius}
          stroke={SAPPHIRE[2]}
          strokeWidth="1"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}
