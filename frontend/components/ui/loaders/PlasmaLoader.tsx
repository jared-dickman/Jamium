'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function PlasmaLoader({ size = 'md' }: LoaderProps) {
  const dimension = LOADER_SIZE[size];
  const tendrils = 12;
  const particles = 8;

  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex items-center justify-center"
      style={{ width: dimension, height: dimension }}
    >
      <svg width={dimension} height={dimension} viewBox={`0 0 ${dimension} ${dimension}`}>
        <defs>
          <radialGradient id="plasmaCore">
            <stop offset="0%" stopColor={SAPPHIRE[3]} stopOpacity={1} />
            <stop offset="50%" stopColor={SAPPHIRE[2]} stopOpacity={0.8} />
            <stop offset="100%" stopColor={SAPPHIRE[0]} stopOpacity={0.3} />
          </radialGradient>
          <filter id="plasmaSoftGlow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={dimension * 0.15}
          fill="url(#plasmaCore)"
          filter="url(#plasmaSoftGlow)"
          animate={{
            r: [dimension * 0.13, dimension * 0.18, dimension * 0.13],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {Array.from({ length: tendrils }).map((_, i) => {
          const angle = (i * 360) / tendrils + Math.random() * 20;
          const delay = i * 0.08;
          const innerRadius = dimension * 0.16;
          const midRadius = dimension * (0.25 + Math.random() * 0.05);
          const outerRadius = dimension * (0.38 + Math.random() * 0.08);

          const x1 = dimension / 2 + innerRadius * Math.cos((angle * Math.PI) / 180);
          const y1 = dimension / 2 + innerRadius * Math.sin((angle * Math.PI) / 180);
          const xMid =
            dimension / 2 +
            midRadius * Math.cos(((angle + Math.random() * 30 - 15) * Math.PI) / 180);
          const yMid =
            dimension / 2 +
            midRadius * Math.sin(((angle + Math.random() * 30 - 15) * Math.PI) / 180);
          const x2 =
            dimension / 2 +
            outerRadius * Math.cos(((angle + Math.random() * 40 - 20) * Math.PI) / 180);
          const y2 =
            dimension / 2 +
            outerRadius * Math.sin(((angle + Math.random() * 40 - 20) * Math.PI) / 180);

          return (
            <motion.path
              key={`tendril-${i}`}
              d={`M ${x1},${y1} Q ${xMid},${yMid} ${x2},${y2}`}
              stroke={SAPPHIRE[i % SAPPHIRE.length]}
              strokeWidth={dimension * 0.018}
              strokeLinecap="round"
              fill="none"
              filter="url(#plasmaSoftGlow)"
              opacity={0.7}
              animate={{
                strokeWidth: [dimension * 0.012, dimension * 0.025, dimension * 0.012],
                opacity: [0.2, 0.9, 0.2],
              }}
              transition={{
                duration: 1.4 + Math.random() * 0.6,
                repeat: Infinity,
                delay,
                ease: 'easeInOut',
              }}
            />
          );
        })}

        {Array.from({ length: particles }).map((_, i) => {
          const orbitRadius = dimension * (0.2 + Math.random() * 0.15);
          const particleSize = dimension * (0.015 + Math.random() * 0.01);
          const duration = 2 + Math.random() * 2;
          const delay = i * 0.2;

          return (
            <motion.circle
              key={`particle-${i}`}
              r={particleSize}
              fill={SAPPHIRE[i % SAPPHIRE.length]}
              filter="url(#plasmaSoftGlow)"
              animate={{
                cx: [
                  dimension / 2 + orbitRadius * Math.cos(0),
                  dimension / 2 + orbitRadius * Math.cos(Math.PI),
                  dimension / 2 + orbitRadius * Math.cos(Math.PI * 2),
                ],
                cy: [
                  dimension / 2 + orbitRadius * Math.sin(0),
                  dimension / 2 + orbitRadius * Math.sin(Math.PI),
                  dimension / 2 + orbitRadius * Math.sin(Math.PI * 2),
                ],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: 'linear',
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
