'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function UFOLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const center = dim / 2;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={className}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`} style={{ display: 'block' }}>
        <defs>
          {/* Tractor beam gradient */}
          <linearGradient id={`ufo-beam-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={SAPPHIRE[2]} stopOpacity="0.7" />
            <stop offset="50%" stopColor={SAPPHIRE[1]} stopOpacity="0.4" />
            <stop offset="100%" stopColor={SAPPHIRE[0]} stopOpacity="0.1" />
          </linearGradient>

          {/* Dome gradient */}
          <radialGradient id={`ufo-dome-${size}`}>
            <stop offset="0%" stopColor={SAPPHIRE[3]} stopOpacity="0.9" />
            <stop offset="70%" stopColor={SAPPHIRE[2]} stopOpacity="0.7" />
            <stop offset="100%" stopColor={SAPPHIRE[1]} stopOpacity="0.5" />
          </radialGradient>
        </defs>

        {/* Hovering wobble container */}
        <motion.g
          animate={{
            y: [-2, 2, -2],
            rotate: [-1.5, 1.5, -1.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ originX: `${center}px`, originY: `${center}px` }}
        >
          {/* Tractor beam cone - pulsing */}
          <motion.path
            d={`M ${center - dim * 0.12} ${center + dim * 0.08}
                L ${center - dim * 0.25} ${center + dim * 0.38}
                L ${center + dim * 0.25} ${center + dim * 0.38}
                L ${center + dim * 0.12} ${center + dim * 0.08} Z`}
            fill={`url(#ufo-beam-${size})`}
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* UFO saucer body - main disc */}
          <ellipse cx={center} cy={center} rx={dim * 0.28} ry={dim * 0.09} fill={SAPPHIRE[1]} />

          {/* Top highlight */}
          <ellipse
            cx={center}
            cy={center - dim * 0.02}
            rx={dim * 0.26}
            ry={dim * 0.07}
            fill={SAPPHIRE[2]}
            opacity="0.6"
          />

          {/* Glass dome */}
          <motion.ellipse
            cx={center}
            cy={center - dim * 0.05}
            rx={dim * 0.12}
            ry={dim * 0.08}
            fill={`url(#ufo-dome-${size})`}
            animate={{
              opacity: [0.6, 0.9, 0.6],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Bottom disc shadow */}
          <ellipse
            cx={center}
            cy={center + dim * 0.02}
            rx={dim * 0.25}
            ry={dim * 0.08}
            fill={SAPPHIRE[0]}
            opacity="0.5"
          />

          {/* Rotating lights around rim */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{ originX: `${center}px`, originY: `${center}px` }}
          >
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const radius = dim * 0.26;
              const x = center + Math.cos(angle) * radius;
              const y = center + Math.sin(angle) * radius * 0.32;

              return (
                <motion.circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={dim * 0.018}
                  fill={SAPPHIRE[3]}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.15,
                  }}
                  style={{ originX: `${x}px`, originY: `${y}px` }}
                />
              );
            })}
          </motion.g>
        </motion.g>

        {/* Beam particles floating up */}
        {Array.from({ length: 5 }).map((_, i) => {
          const x = center + (Math.random() - 0.5) * dim * 0.3;
          const startY = center + dim * 0.38;

          return (
            <motion.circle
              key={i}
              cx={x}
              cy={startY}
              r={dim * 0.01}
              fill={SAPPHIRE[2]}
              animate={{
                y: [-dim * 0.35, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.6,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
