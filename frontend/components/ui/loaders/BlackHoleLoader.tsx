'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function BlackHoleLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const center = dim / 2;
  const horizonRadius = dim * 0.2;

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
        <defs>
          <radialGradient id={`black-hole-horizon-${size}`}>
            <stop offset="0%" stopColor="#000000" />
            <stop offset="70%" stopColor={SAPPHIRE[0]} />
            <stop offset="100%" stopColor={SAPPHIRE[1]} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Accretion disk rings */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          style={{ originX: `${center}px`, originY: `${center}px` }}
        >
          {[1.8, 2.2, 2.6].map((scale, i) => (
            <motion.ellipse
              key={i}
              cx={center}
              cy={center}
              rx={horizonRadius * scale}
              ry={horizonRadius * scale * 0.3}
              fill="none"
              stroke={SAPPHIRE[(i + 1) % 4]}
              strokeWidth={dim * 0.015}
              strokeDasharray={`${dim * 0.1} ${dim * 0.05}`}
              opacity={0.6}
              animate={{
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.3,
              }}
            />
          ))}
        </motion.g>

        {/* Spiraling particles */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          style={{ originX: `${center}px`, originY: `${center}px` }}
        >
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const startRadius = dim * 0.45;
            return (
              <motion.circle
                key={i}
                cx={center + startRadius * Math.cos((angle * Math.PI) / 180)}
                cy={center + startRadius * Math.sin((angle * Math.PI) / 180)}
                r={dim * 0.025}
                fill={SAPPHIRE[i % 4]}
                animate={{
                  cx: [center + startRadius * Math.cos((angle * Math.PI) / 180), center],
                  cy: [center + startRadius * Math.sin((angle * Math.PI) / 180), center],
                  scale: [1, 0],
                  opacity: [1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeIn',
                  delay: i * 0.5,
                }}
              />
            );
          })}
        </motion.g>

        {/* Event horizon */}
        <circle
          cx={center}
          cy={center}
          r={horizonRadius}
          fill={`url(#black-hole-horizon-${size})`}
        />
      </svg>
    </div>
  );
}
