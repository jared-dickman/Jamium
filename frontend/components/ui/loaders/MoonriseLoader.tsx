'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function MoonriseLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const center = dim / 2;
  const moonRadius = dim * 0.18;

  // Random star positions
  const stars = Array.from({ length: 12 }, (_, i) => ({
    x: (Math.sin(i * 2.7) * 0.5 + 0.5) * dim * 0.85 + dim * 0.075,
    y: (Math.cos(i * 3.1) * 0.5 + 0.5) * dim * 0.4,
    size: dim * (0.008 + Math.random() * 0.005),
    delay: i * 0.3,
    duration: 2 + Math.random() * 2,
  }));

  // Crater positions on the moon
  const craters = [
    { x: moonRadius * 0.4, y: -moonRadius * 0.3, r: moonRadius * 0.15 },
    { x: -moonRadius * 0.3, y: moonRadius * 0.2, r: moonRadius * 0.12 },
    { x: moonRadius * 0.2, y: moonRadius * 0.4, r: moonRadius * 0.08 },
    { x: -moonRadius * 0.5, y: -moonRadius * 0.4, r: moonRadius * 0.1 },
  ];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={className}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`} style={{ display: 'block' }}>
        <defs>
          {/* Moon surface gradient */}
          <radialGradient id={`moon-surface-${size}`}>
            <stop offset="0%" stopColor={SAPPHIRE[3]} stopOpacity="1" />
            <stop offset="70%" stopColor={SAPPHIRE[2]} stopOpacity="0.95" />
            <stop offset="100%" stopColor={SAPPHIRE[1]} stopOpacity="0.9" />
          </radialGradient>

          {/* Halo glow */}
          <radialGradient id={`moon-glow-${size}`}>
            <stop offset="0%" stopColor={SAPPHIRE[2]} stopOpacity="0.6" />
            <stop offset="40%" stopColor={SAPPHIRE[1]} stopOpacity="0.3" />
            <stop offset="100%" stopColor={SAPPHIRE[0]} stopOpacity="0" />
          </radialGradient>

          {/* Crater shadow */}
          <radialGradient id={`crater-${size}`}>
            <stop offset="0%" stopColor={SAPPHIRE[0]} stopOpacity="0.5" />
            <stop offset="100%" stopColor={SAPPHIRE[1]} stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {/* Star field */}
        {stars.map((star, i) => (
          <motion.circle
            key={`star-${i}`}
            cx={star.x}
            cy={star.y}
            r={star.size}
            fill={SAPPHIRE[i % 4]}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: star.delay,
            }}
            style={{ originX: `${star.x}px`, originY: `${star.y}px` }}
          />
        ))}

        {/* Rising moon group */}
        <motion.g
          animate={{
            y: [dim * 0.3, -dim * 0.05, dim * 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Outer halo glow */}
          <motion.circle
            cx={center}
            cy={center}
            r={moonRadius * 2}
            fill={`url(#moon-glow-${size})`}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ originX: `${center}px`, originY: `${center}px` }}
          />

          {/* Inner halo */}
          <motion.circle
            cx={center}
            cy={center}
            r={moonRadius * 1.4}
            fill={`url(#moon-glow-${size})`}
            animate={{
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          />

          {/* Moon body */}
          <motion.circle
            cx={center}
            cy={center}
            r={moonRadius}
            fill={`url(#moon-surface-${size})`}
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ originX: `${center}px`, originY: `${center}px` }}
          />

          {/* Craters */}
          <g transform={`translate(${center}, ${center})`}>
            {craters.map((crater, i) => (
              <motion.circle
                key={`crater-${i}`}
                cx={crater.x}
                cy={crater.y}
                r={crater.r}
                fill={`url(#crater-${size})`}
                animate={{
                  opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.4,
                }}
              />
            ))}

            {/* Crater details - small highlights */}
            {craters.slice(0, 2).map((crater, i) => (
              <circle
                key={`highlight-${i}`}
                cx={crater.x - crater.r * 0.3}
                cy={crater.y - crater.r * 0.3}
                r={crater.r * 0.2}
                fill={SAPPHIRE[3]}
                opacity="0.3"
              />
            ))}
          </g>

          {/* Bright moon core */}
          <motion.circle
            cx={center}
            cy={center}
            r={moonRadius * 0.3}
            fill={SAPPHIRE[3]}
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.g>

        {/* Additional twinkling stars in foreground */}
        {[0, 1, 2].map(i => {
          const angle = (i / 3) * Math.PI * 2;
          const radius = dim * 0.45;
          const x = center + Math.cos(angle) * radius;
          const y = dim * 0.2 + Math.sin(angle) * dim * 0.1;

          return (
            <motion.circle
              key={`fg-star-${i}`}
              cx={x}
              cy={y}
              r={dim * 0.012}
              fill={SAPPHIRE[3]}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 1.5 + i * 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.5,
              }}
              style={{ originX: `${x}px`, originY: `${y}px` }}
            />
          );
        })}
      </svg>
    </div>
  );
}
