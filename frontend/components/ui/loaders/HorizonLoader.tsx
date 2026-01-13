'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function HorizonLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const horizonY = dim * 0.5;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={className}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`} style={{ display: 'block' }}>
        <defs>
          {/* Sky gradient with sunrise/sunset colors */}
          <linearGradient id={`horizon-sky-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <motion.stop offset="0%" stopColor={SAPPHIRE[0]} stopOpacity="0.4" />
            <motion.stop offset="100%" stopColor={SAPPHIRE[1]} stopOpacity="0.7" />
          </linearGradient>

          {/* Ground gradient with warm tones */}
          <linearGradient id={`horizon-ground-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <motion.stop offset="0%" stopColor={SAPPHIRE[2]} stopOpacity="0.7" />
            <motion.stop offset="100%" stopColor={SAPPHIRE[0]} stopOpacity="0.3" />
          </linearGradient>

          {/* Enhanced horizon glow */}
          <linearGradient id={`horizon-glow-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={SAPPHIRE[3]} stopOpacity="0" />
            <stop offset="40%" stopColor={SAPPHIRE[3]} stopOpacity="0.9" />
            <stop offset="60%" stopColor={SAPPHIRE[2]} stopOpacity="1" />
            <stop offset="100%" stopColor={SAPPHIRE[3]} stopOpacity="0" />
          </linearGradient>

          {/* Sun glow radial gradient */}
          <radialGradient id={`horizon-sun-${size}`}>
            <stop offset="0%" stopColor={SAPPHIRE[3]} stopOpacity="1" />
            <stop offset="50%" stopColor={SAPPHIRE[2]} stopOpacity="0.6" />
            <stop offset="100%" stopColor={SAPPHIRE[1]} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sky */}
        <rect x="0" y="0" width={dim} height={horizonY} fill={`url(#horizon-sky-${size})`} />

        {/* Ground */}
        <rect
          x="0"
          y={horizonY}
          width={dim}
          height={horizonY}
          fill={`url(#horizon-ground-${size})`}
        />

        {/* Rising/setting sun */}
        <motion.g>
          <motion.circle
            cx={dim / 2}
            cy={horizonY}
            r={dim * 0.12}
            fill={`url(#horizon-sun-${size})`}
            animate={{
              cy: [horizonY + dim * 0.05, horizonY - dim * 0.02, horizonY + dim * 0.05],
              opacity: [0.6, 0.9, 0.6],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ originX: `${dim / 2}px`, originY: `${horizonY}px` }}
          />
        </motion.g>

        {/* Enhanced pulsing glow at horizon */}
        <motion.rect
          x="0"
          y={horizonY - dim * 0.12}
          width={dim}
          height={dim * 0.24}
          fill={`url(#horizon-glow-${size})`}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Horizon line with glow */}
        <motion.line
          x1="0"
          y1={horizonY}
          x2={dim}
          y2={horizonY}
          stroke={SAPPHIRE[3]}
          strokeWidth={dim * 0.02}
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Birds crossing the horizon */}
        {Array.from({ length: 3 }).map((_, i) => {
          const birdY = horizonY + dim * (0.02 - i * 0.02);
          const startX = -dim * 0.1;
          const endX = dim * 1.1;

          return (
            <motion.g
              key={i}
              animate={{
                x: [startX, endX],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 1.2,
              }}
            >
              {/* Simple bird V shape */}
              <path
                d={`M 0 ${birdY} l ${dim * 0.03} ${-dim * 0.02} M 0 ${birdY} l ${dim * 0.03} ${dim * 0.02}`}
                stroke={SAPPHIRE[2 - (i % 2)]}
                strokeWidth={dim * 0.008}
                strokeLinecap="round"
                fill="none"
                opacity={0.8}
              />
            </motion.g>
          );
        })}

        {/* Atmospheric particles */}
        {Array.from({ length: 5 }).map((_, i) => {
          const particleY = horizonY + dim * (Math.random() * 0.3 - 0.15);
          const particleX = dim * (0.2 + i * 0.15);

          return (
            <motion.circle
              key={`particle-${i}`}
              cx={particleX}
              cy={particleY}
              r={dim * 0.008}
              fill={SAPPHIRE[i % 4]}
              animate={{
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.5,
              }}
              style={{ originX: `${particleX}px`, originY: `${particleY}px` }}
            />
          );
        })}
      </svg>
    </div>
  );
}
