'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function HexagonLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const center = dim / 2;
  const radius = dim * 0.3;

  const hexagonPoints = (r: number) => {
    return Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        {/* Nested hexagons with rotating and scaling */}
        {[0, 1, 2].map(index => {
          const scale = 1 - index * 0.25;
          return (
            <motion.polygon
              key={index}
              points={hexagonPoints(radius * scale)}
              fill="none"
              stroke={SAPPHIRE[index]}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{
                rotate: index % 2 === 0 ? [0, 360] : [360, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                rotate: {
                  duration: 4 + index * 0.5,
                  repeat: Infinity,
                  ease: 'linear',
                },
                opacity: {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
              style={{ transformOrigin: `${center}px ${center}px` }}
            />
          );
        })}

        {/* Corner accent dots */}
        {Array.from({ length: 6 }, (_, i) => {
          const angle = (Math.PI / 3) * i - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <motion.circle
              key={`dot-${i}`}
              cx={x}
              cy={y}
              r={2}
              fill={SAPPHIRE[3]}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
