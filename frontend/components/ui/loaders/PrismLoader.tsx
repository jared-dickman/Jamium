'use client';

import { motion } from 'framer-motion';
import {
  SAPPHIRE,
  LOADER_SIZE,
  LOADER_STROKE,
  type LoaderProps,
} from '@/components/ui/loaders/loader.constants';

export function PrismLoader({ size = 'md' }: LoaderProps) {
  const dimension = LOADER_SIZE[size];
  const stroke = LOADER_STROKE[size];

  // Rainbow spectrum colors (ROYGBIV)
  const spectrum = [
    '#FF0000', // red
    '#FF7F00', // orange
    '#FFFF00', // yellow
    '#00FF00', // green
    '#0099FF', // blue
    '#4B0082', // indigo
    '#9400D3', // violet
  ];

  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex items-center justify-center"
      style={{ width: dimension, height: dimension }}
    >
      <svg width={dimension} height={dimension} viewBox="0 0 100 100">
        {/* Black background */}
        <rect width="100" height="100" fill="#000000" />

        {/* White light beam entering from left - STATIC */}
        <line
          x1="5"
          y1="50"
          x2="38"
          y2="50"
          stroke="white"
          strokeWidth={stroke * 1.8}
          strokeLinecap="round"
          opacity={0.9}
        />

        {/* Equilateral triangular prism - SMALLER, FLAT BOTTOM like Dark Side of the Moon */}
        <motion.polygon
          points="38,60 62,60 50,38"
          fill="none"
          stroke={SAPPHIRE[2]}
          strokeWidth={stroke * 0.8}
          strokeLinejoin="miter"
          initial={{ opacity: 0.6 }}
          animate={{
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Rainbow spectrum dispersing from prism - LONGER, THICKER lines */}
        {spectrum.map((color, i) => {
          const totalBeams = spectrum.length;
          const angle = (i - (totalBeams - 1) / 2) * 5; // Wider spread
          const startY = 49; // Mid-point of smaller prism right edge

          return (
            <motion.line
              key={i}
              x1="62"
              y1={startY}
              x2="95"
              y2={startY + angle}
              stroke={color}
              strokeWidth={stroke * 2}
              strokeLinecap="round"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{
                opacity: [0, 0.9, 0.9],
                pathLength: [0, 1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.3 + i * 0.08,
                ease: 'easeOut',
              }}
            />
          );
        })}

        {/* Subtle glow effect on the prism edge where light disperses */}
        <motion.circle
          cx="62"
          cy="49"
          r={stroke * 0.8}
          fill="white"
          initial={{ opacity: 0.2 }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </svg>
    </div>
  );
}
