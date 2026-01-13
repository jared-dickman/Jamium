'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function SupernovaLoader({ className, size = 'md' }: LoaderProps) {
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
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        <defs>
          <radialGradient id={`supernova-core-${size}`}>
            <stop offset="0%" stopColor={SAPPHIRE[3]} />
            <stop offset="40%" stopColor={SAPPHIRE[2]} />
            <stop offset="100%" stopColor={SAPPHIRE[1]} stopOpacity="0.3" />
          </radialGradient>
          <radialGradient id={`supernova-burst-${size}`}>
            <stop offset="0%" stopColor={SAPPHIRE[3]} stopOpacity="1" />
            <stop offset="60%" stopColor={SAPPHIRE[2]} stopOpacity="0.6" />
            <stop offset="100%" stopColor={SAPPHIRE[0]} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Expanding shockwave rings */}
        {[0, 1, 2].map(i => (
          <motion.circle
            key={`ring-${i}`}
            cx={center}
            cy={center}
            r={dim * 0.1}
            fill="none"
            stroke={SAPPHIRE[3 - i]}
            strokeWidth={dim * 0.025}
            animate={{
              r: [dim * 0.1, dim * 0.48],
              opacity: [0.9, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 2,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        ))}

        {/* Dramatic burst rays - static angles */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
          <motion.line
            key={`ray-${angle}`}
            x1={center}
            y1={center}
            x2={center + dim * 0.42 * Math.cos((angle * Math.PI) / 180)}
            y2={center + dim * 0.42 * Math.sin((angle * Math.PI) / 180)}
            stroke={SAPPHIRE[i % 4]}
            strokeWidth={dim * 0.02}
            strokeLinecap="round"
            animate={{
              opacity: [0, 0.8, 0],
              strokeWidth: [dim * 0.03, dim * 0.01, dim * 0.03],
            }}
            transition={{
              duration: 7.2,
              repeat: Infinity,
              ease: [0.25, 0.1, 0.25, 1],
              delay: i * 0.32,
            }}
          />
        ))}

        {/* Energy particles */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;

          return (
            <motion.circle
              key={`particle-${i}`}
              cx={center}
              cy={center}
              r={dim * 0.015}
              fill={SAPPHIRE[i % 4]}
              animate={{
                cx: [center, center + dim * 0.35 * Math.cos(angle)],
                cy: [center, center + dim * 0.35 * Math.sin(angle)],
                opacity: [1, 0],
                scale: [1, 0.3],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.24,
              }}
            />
          );
        })}

        {/* Outer burst glow */}
        <motion.circle
          cx={center}
          cy={center}
          r={dim * 0.2}
          fill={`url(#supernova-burst-${size})`}
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: [0.37, 0, 0.63, 1] }}
          style={{ originX: `${center}px`, originY: `${center}px` }}
        />

        {/* Central core */}
        <motion.circle
          cx={center}
          cy={center}
          r={dim * 0.1}
          fill={`url(#supernova-core-${size})`}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 4.8, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
          style={{ originX: `${center}px`, originY: `${center}px` }}
        />

        {/* Bright nucleus */}
        <motion.circle
          cx={center}
          cy={center}
          r={dim * 0.04}
          fill={SAPPHIRE[3]}
          animate={{
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
        />
      </svg>
    </div>
  );
}
