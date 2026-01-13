'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function KaleidoscopeLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const center = dim / 2;
  const segments = size === 'sm' ? 6 : size === 'md' ? 8 : 10;
  const radius = dim * 0.42;

  const createTrianglePath = (index: number, total: number) => {
    const angle1 = (index / total) * Math.PI * 2;
    const angle2 = ((index + 1) / total) * Math.PI * 2;

    const x1 = center + Math.cos(angle1) * radius;
    const y1 = center + Math.sin(angle1) * radius;
    const x2 = center + Math.cos(angle2) * radius;
    const y2 = center + Math.sin(angle2) * radius;

    return `M ${center},${center} L ${x1},${y1} L ${x2},${y2} Z`;
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        {/* Main rotating kaleidoscope segments */}
        <motion.g
          animate={{ rotate: [0, 360] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        >
          {Array.from({ length: segments }, (_, i) => (
            <motion.path
              key={i}
              d={createTrianglePath(i, segments)}
              fill={SAPPHIRE[i % 4]}
              stroke={SAPPHIRE[(i + 1) % 4]}
              strokeWidth={0.5}
              strokeLinejoin="miter"
              animate={{
                opacity: [0.4, 0.9, 0.4],
              }}
              transition={{
                duration: 3,
                delay: i * 0.12,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.g>

        {/* Counter-rotating inner segments */}
        <motion.g
          animate={{ rotate: [360, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        >
          {Array.from({ length: segments }, (_, i) => {
            const angle1 = (i / segments) * Math.PI * 2;
            const angle2 = ((i + 1) / segments) * Math.PI * 2;
            const innerRadius = radius * 0.5;

            const x1 = center + Math.cos(angle1) * innerRadius;
            const y1 = center + Math.sin(angle1) * innerRadius;
            const x2 = center + Math.cos(angle2) * innerRadius;
            const y2 = center + Math.sin(angle2) * innerRadius;

            return (
              <motion.path
                key={`inner-${i}`}
                d={`M ${center},${center} L ${x1},${y1} L ${x2},${y2} Z`}
                fill="none"
                stroke={SAPPHIRE[(i + 2) % 4]}
                strokeWidth={1.5}
                strokeLinejoin="miter"
                animate={{
                  opacity: [0.2, 0.7, 0.2],
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.12 + 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            );
          })}
        </motion.g>

        {/* Radial symmetry lines */}
        {Array.from({ length: segments }, (_, i) => {
          const angle = (i / segments) * Math.PI * 2;
          const x = center + Math.cos(angle) * radius;
          const y = center + Math.sin(angle) * radius;

          return (
            <motion.line
              key={`radial-${i}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke={SAPPHIRE[i % 4]}
              strokeWidth={0.5}
              strokeLinecap="round"
              animate={{
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: 2.5,
                delay: i * 0.08,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          );
        })}

        {/* Concentric circles for depth */}
        {[0.3, 0.5, 0.7].map((scale, ringIndex) => {
          const ringRadius = radius * scale;
          return (
            <motion.circle
              key={`ring-${ringIndex}`}
              cx={center}
              cy={center}
              r={ringRadius}
              fill="none"
              stroke={SAPPHIRE[(ringIndex + 1) % 4]}
              strokeWidth={1}
              strokeDasharray="2 4"
              animate={{
                opacity: [0.2, 0.6, 0.2],
                scale: [0.98, 1.02, 0.98],
              }}
              transition={{
                duration: 3,
                delay: ringIndex * 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ transformOrigin: `${center}px ${center}px` }}
            />
          );
        })}

        {/* Center jewel */}
        <motion.circle
          cx={center}
          cy={center}
          r={4}
          fill={SAPPHIRE[1]}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7],
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
