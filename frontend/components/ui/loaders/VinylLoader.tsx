'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function VinylLoader({ size = 'md' }: LoaderProps) {
  const dimension = LOADER_SIZE[size];

  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex items-center justify-center"
      style={{ width: dimension, height: dimension }}
    >
      <svg width={dimension} height={dimension} viewBox={`0 0 ${dimension} ${dimension}`}>
        <defs>
          <radialGradient id="vinylGrad">
            <stop offset="0%" stopColor={SAPPHIRE[3]} stopOpacity={0.2} />
            <stop offset="40%" stopColor={SAPPHIRE[1]} stopOpacity={0.6} />
            <stop offset="80%" stopColor={SAPPHIRE[0]} stopOpacity={0.9} />
          </radialGradient>
        </defs>

        {/* Record with noticeable warble - all grooves move together */}
        <motion.g
          animate={{
            rotate: [0, 1.2, -1.0, 1.5, -0.8, 0],
            scale: [1, 1.006, 0.995, 1.008, 0.997, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: [0.45, 0.05, 0.55, 0.95],
            times: [0, 0.2, 0.4, 0.6, 0.8, 1],
          }}
          style={{ transformOrigin: `${dimension / 2}px ${dimension / 2}px` }}
        >
          {/* Main record surface */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={dimension * 0.4}
            fill="url(#vinylGrad)"
            stroke={SAPPHIRE[1]}
            strokeWidth={dimension * 0.015}
          />

          {/* Grooves - all warble together */}
          {Array.from({ length: 6 }).map((_, i) => (
            <circle
              key={i}
              cx={dimension / 2}
              cy={dimension / 2}
              r={dimension * (0.15 + i * 0.04)}
              fill="none"
              stroke={SAPPHIRE[i % SAPPHIRE.length]}
              strokeWidth={dimension * 0.005}
              opacity={0.3}
            />
          ))}

          {/* Center label */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={dimension * 0.08}
            fill={SAPPHIRE[2]}
            opacity={0.8}
          />

          {/* Spindle hole */}
          <circle cx={dimension / 2} cy={dimension / 2} r={dimension * 0.03} fill="#0f172a" />
        </motion.g>

        {/* Tonearm - completely static */}
        <g>
          {/* Tonearm pivot point */}
          <circle
            cx={dimension * 0.75}
            cy={dimension * 0.2}
            r={dimension * 0.03}
            fill={SAPPHIRE[1]}
          />

          {/* Tonearm */}
          <line
            x1={dimension * 0.75}
            y1={dimension * 0.2}
            x2={dimension * 0.72}
            y2={dimension * 0.48}
            stroke={SAPPHIRE[2]}
            strokeWidth={dimension * 0.02}
            strokeLinecap="round"
          />

          {/* Needle */}
          <circle
            cx={dimension * 0.72}
            cy={dimension * 0.48}
            r={dimension * 0.025}
            fill={SAPPHIRE[3]}
          />
        </g>
      </svg>
    </div>
  );
}
