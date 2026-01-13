'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function VortexLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const center = dim / 2;
  const rings = size === 'sm' ? 4 : size === 'md' ? 5 : 6;
  const maxRadius = dim * 0.42;

  const ringData = Array.from({ length: rings }, (_, i) => {
    const progress = (i + 1) / rings;
    const radiusOuter = maxRadius * (1 - progress * 0.85);
    const radiusInner = radiusOuter * 0.65;
    return {
      radiusOuter,
      radiusInner,
      segments: 6 + i * 2,
      color: SAPPHIRE[i % 4],
      duration: 6 + i * 0.8,
      direction: i % 2 === 0 ? 1 : -1,
    };
  });

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        {ringData.map((ring, ringIndex) => (
          <motion.g
            key={ringIndex}
            animate={{
              rotate: ring.direction > 0 ? [0, 360] : [360, 0],
            }}
            transition={{
              duration: ring.duration,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{ transformOrigin: `${center}px ${center}px` }}
          >
            {/* Ring circle guide (subtle) */}
            <circle
              cx={center}
              cy={center}
              r={ring.radiusOuter}
              fill="none"
              stroke={ring.color}
              strokeWidth={0.5}
              opacity={0.15}
            />

            {/* Radial segments */}
            {Array.from({ length: ring.segments }, (_, i) => {
              const angle = (i / ring.segments) * Math.PI * 2;
              const x1 = center + Math.cos(angle) * ring.radiusOuter;
              const y1 = center + Math.sin(angle) * ring.radiusOuter;
              const x2 = center + Math.cos(angle) * ring.radiusInner;
              const y2 = center + Math.sin(angle) * ring.radiusInner;

              return (
                <motion.line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={ring.color}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    delay: (i / ring.segments) * 0.6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              );
            })}

            {/* Outer arc dots */}
            {Array.from({ length: ring.segments }, (_, i) => {
              const angle = (i / ring.segments) * Math.PI * 2;
              const x = center + Math.cos(angle) * ring.radiusOuter;
              const y = center + Math.sin(angle) * ring.radiusOuter;

              return (
                <motion.circle
                  key={`dot-${i}`}
                  cx={x}
                  cy={y}
                  r={1.5}
                  fill={ring.color}
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    delay: (i / ring.segments) * 0.6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              );
            })}
          </motion.g>
        ))}

        {/* Center vortex point */}
        <motion.circle
          cx={center}
          cy={center}
          r={3.5}
          fill={SAPPHIRE[2]}
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <circle cx={center} cy={center} r={1.5} fill={SAPPHIRE[3]} opacity={0.9} />
      </svg>
    </div>
  );
}
