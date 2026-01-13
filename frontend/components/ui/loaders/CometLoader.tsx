'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function CometLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const center = dim / 2;

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
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={`comet-tail-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={SAPPHIRE[0]} stopOpacity="0" />
            <stop offset="40%" stopColor={SAPPHIRE[1]} stopOpacity="0.4" />
            <stop offset="80%" stopColor={SAPPHIRE[2]} stopOpacity="0.7" />
            <stop offset="100%" stopColor={SAPPHIRE[3]} stopOpacity="1" />
          </linearGradient>
          <radialGradient id={`comet-head-${size}`}>
            <stop offset="0%" stopColor={SAPPHIRE[3]} />
            <stop offset="60%" stopColor={SAPPHIRE[2]} />
            <stop offset="100%" stopColor={SAPPHIRE[1]} stopOpacity="0.3" />
          </radialGradient>
          <radialGradient id={`comet-glow-${size}`}>
            <stop offset="0%" stopColor={SAPPHIRE[3]} stopOpacity="0.8" />
            <stop offset="100%" stopColor={SAPPHIRE[2]} stopOpacity="0" />
          </radialGradient>
        </defs>

        <motion.g
          animate={{
            x: [-dim * 0.7, dim * 1.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {/* Trailing tail particles */}
          {[0, 1, 2, 3].map(i => (
            <ellipse
              key={i}
              cx={-dim * (0.15 + i * 0.08)}
              cy={center}
              rx={dim * (0.25 - i * 0.04)}
              ry={dim * (0.06 - i * 0.01)}
              fill={`url(#comet-tail-${size})`}
              opacity={0.7 - i * 0.15}
            />
          ))}

          {/* Outer glow */}
          <circle
            cx={dim * 0.15}
            cy={center}
            r={dim * 0.15}
            fill={`url(#comet-glow-${size})`}
            opacity={0.6}
          />

          {/* Comet head */}
          <circle cx={dim * 0.15} cy={center} r={dim * 0.09} fill={`url(#comet-head-${size})`} />

          {/* Bright core */}
          <circle cx={dim * 0.15} cy={center} r={dim * 0.035} fill={SAPPHIRE[3]} />
        </motion.g>
      </svg>
    </div>
  );
}
