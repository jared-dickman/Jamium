'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function EclipseLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const center = dim / 2;
  const radius = dim * 0.35;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={className}
      style={{ width: dim, height: dim }}
    >
      <svg
        width={dim}
        height={dim}
        viewBox={`0 0 ${dim} ${dim}`}
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          <radialGradient id={`sun-glow-${size}`}>
            <stop offset="0%" stopColor={SAPPHIRE[3]} stopOpacity="0.9" />
            <stop offset="50%" stopColor={SAPPHIRE[2]} stopOpacity="0.6" />
            <stop offset="100%" stopColor={SAPPHIRE[2]} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`moon-glow-${size}`}>
            <stop offset="0%" stopColor={SAPPHIRE[0]} />
            <stop offset="100%" stopColor={SAPPHIRE[1]} />
          </radialGradient>
        </defs>

        {/* Sun with corona */}
        <circle
          cx={center}
          cy={center}
          r={radius * 1.5}
          fill={`url(#sun-glow-${size})`}
          opacity="0.4"
        />
        <circle cx={center} cy={center} r={radius} fill={SAPPHIRE[2]} />

        {/* Moon - starts off-screen left, exits off-screen right */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius * 0.95}
          fill={`url(#moon-glow-${size})`}
          animate={{
            x: [-dim * 1.2, dim * 1.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Eclipse ring (visible at overlap) */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius * 1.1}
          fill="none"
          stroke={SAPPHIRE[3]}
          strokeWidth={dim * 0.015}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ originX: `${center}px`, originY: `${center}px` }}
        />
      </svg>
    </div>
  );
}
