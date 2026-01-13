'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function SunriseLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const sunRadius = dim * 0.15;
  const horizonY = dim * 0.7;
  const rayCount = 8;

  // Calculate ray opacity based on sun position
  // Y range: dim * 0.15 (top) to dim * 0.15 (bottom after full cycle)
  // Horizon is at horizonY (dim * 0.7)
  const sunAnimationRange = [dim * 0.15, -dim * 0.05, dim * 0.15];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={className}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`} style={{ display: 'block' }}>
        <defs>
          {/* Animated sky gradient */}
          <linearGradient id={`sunrise-sky-${size}`} x1="0" y1="0" x2="0" y2="1">
            <motion.stop offset="0%" stopColor={SAPPHIRE[0]}>
              <animate
                attributeName="stop-color"
                values={`${SAPPHIRE[0]};${SAPPHIRE[1]};${SAPPHIRE[0]}`}
                dur="4s"
                repeatCount="indefinite"
              />
            </motion.stop>
            <motion.stop offset="70%" stopColor={SAPPHIRE[1]}>
              <animate
                attributeName="stop-color"
                values={`${SAPPHIRE[1]};${SAPPHIRE[2]};${SAPPHIRE[1]}`}
                dur="4s"
                repeatCount="indefinite"
              />
            </motion.stop>
            <motion.stop offset="100%" stopColor={SAPPHIRE[2]}>
              <animate
                attributeName="stop-color"
                values={`${SAPPHIRE[2]};${SAPPHIRE[3]};${SAPPHIRE[2]}`}
                dur="4s"
                repeatCount="indefinite"
              />
            </motion.stop>
          </linearGradient>

          {/* Sun gradient */}
          <radialGradient id={`sunrise-sun-${size}`}>
            <stop offset="0%" stopColor={SAPPHIRE[3]} />
            <stop offset="60%" stopColor={SAPPHIRE[2]} />
            <stop offset="100%" stopColor={SAPPHIRE[1]} stopOpacity="0.5" />
          </radialGradient>
        </defs>

        {/* Sky background */}
        <rect width={dim} height={dim} fill={`url(#sunrise-sky-${size})`} />

        {/* Unified animation group - all shapes rise together */}
        <motion.g
          animate={{ y: sunAnimationRange }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: [0.45, 0.05, 0.55, 0.95], // smooth easeInOut
          }}
        >
          {/* Radiating rays - fade in as sun rises above horizon */}
          <motion.g
            style={{
              transformOrigin: `${dim / 2}px ${horizonY}px`,
            }}
            animate={{
              // Opacity tied to sun position: 0 when underwater, 1 when above horizon
              // Maps Y position to opacity: below horizon (y > 0) = 0, above horizon (y < 0) = 1
              opacity: [0, 0, 0.15, 0.9, 0.15, 0, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: [0.45, 0.05, 0.55, 0.95],
              times: [0, 0.2, 0.35, 0.5, 0.65, 0.8, 1], // Matches sun animation keyframes
            }}
          >
            {Array.from({ length: rayCount }).map((_, i) => {
              const angle = (i / rayCount) * Math.PI;
              const startRadius = dim * 0.18;
              const endRadius = dim * 0.4;
              const startX = dim / 2 + Math.cos(angle - Math.PI / 2) * startRadius;
              const startY = horizonY + Math.sin(angle - Math.PI / 2) * startRadius;
              const endX = dim / 2 + Math.cos(angle - Math.PI / 2) * endRadius;
              const endY = horizonY + Math.sin(angle - Math.PI / 2) * endRadius;

              return (
                <motion.line
                  key={i}
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke={SAPPHIRE[3]}
                  strokeWidth={dim * 0.008}
                  strokeLinecap="round"
                  animate={{
                    opacity: [0.3, 0.9, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.2,
                  }}
                />
              );
            })}
          </motion.g>

          {/* Sun outer glow */}
          <motion.circle
            cx={dim / 2}
            cy={horizonY}
            r={sunRadius * 2}
            fill={SAPPHIRE[2]}
            opacity={0.2}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: `${dim / 2}px ${horizonY}px` }}
          />

          {/* Sun glow */}
          <motion.circle
            cx={dim / 2}
            cy={horizonY}
            r={sunRadius * 1.4}
            fill={SAPPHIRE[2]}
            opacity={0.5}
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: `${dim / 2}px ${horizonY}px` }}
          />

          {/* Sun core */}
          <circle cx={dim / 2} cy={horizonY} r={sunRadius} fill={`url(#sunrise-sun-${size})`} />
        </motion.g>

        {/* Horizon line */}
        <line
          x1={0}
          y1={horizonY}
          x2={dim}
          y2={horizonY}
          stroke={SAPPHIRE[1]}
          strokeWidth={dim * 0.01}
        />

        {/* Ground/Horizon silhouette */}
        <rect
          x={0}
          y={horizonY}
          width={dim}
          height={dim - horizonY}
          fill={SAPPHIRE[0]}
          opacity={0.8}
        />
      </svg>
    </div>
  );
}
