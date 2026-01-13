'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function MandalaLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const center = dim / 2;
  const petals = size === 'sm' ? 8 : size === 'md' ? 12 : 16;

  const layers = [
    { radius: dim * 0.14, count: 6, strokeWidth: 1.5, duration: 8 },
    { radius: dim * 0.24, count: petals, strokeWidth: 1.2, duration: 10 },
    { radius: dim * 0.34, count: petals, strokeWidth: 1, duration: 12 },
    { radius: dim * 0.42, count: petals / 2, strokeWidth: 1.5, duration: 14 },
  ];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        {/* Rotating layers with petals */}
        {layers.map((layer, layerIndex) => (
          <motion.g
            key={layerIndex}
            animate={{ rotate: layerIndex % 2 === 0 ? [0, 360] : [360, 0] }}
            transition={{
              duration: layer.duration,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{ transformOrigin: `${center}px ${center}px` }}
          >
            {/* Connecting circle */}
            <circle
              cx={center}
              cy={center}
              r={layer.radius}
              fill="none"
              stroke={SAPPHIRE[layerIndex % 4]}
              strokeWidth={0.5}
              opacity={0.2}
            />

            {/* Petals as small circles */}
            {Array.from({ length: layer.count }, (_, i) => {
              const angle = (i / layer.count) * Math.PI * 2;
              const x = center + Math.cos(angle) * layer.radius;
              const y = center + Math.sin(angle) * layer.radius;
              return (
                <motion.circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={2}
                  fill={SAPPHIRE[layerIndex % 4]}
                  animate={{
                    scale: [1, 1.6, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    delay: (i / layer.count) * 0.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              );
            })}

            {/* Radial lines from center to petals */}
            {Array.from({ length: layer.count }, (_, i) => {
              const angle = (i / layer.count) * Math.PI * 2;
              const x = center + Math.cos(angle) * layer.radius;
              const y = center + Math.sin(angle) * layer.radius;
              return (
                <motion.line
                  key={`line-${i}`}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke={SAPPHIRE[layerIndex % 4]}
                  strokeWidth={layer.strokeWidth}
                  strokeLinecap="round"
                  opacity={0.15}
                  animate={{
                    opacity: [0.1, 0.3, 0.1],
                  }}
                  transition={{
                    duration: 3,
                    delay: (i / layer.count) * 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              );
            })}
          </motion.g>
        ))}

        {/* Center ornament */}
        <motion.circle
          cx={center}
          cy={center}
          r={4}
          fill={SAPPHIRE[2]}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <circle cx={center} cy={center} r={2} fill={SAPPHIRE[3]} opacity={0.8} />
      </svg>
    </div>
  );
}
