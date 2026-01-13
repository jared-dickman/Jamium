'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function SpiralLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const center = dim / 2;
  const maxRadius = dim * 0.38;
  const turns = 2.5;
  const segments = size === 'sm' ? 24 : size === 'md' ? 32 : 40;

  const points = Array.from({ length: segments }, (_, i) => {
    const progress = i / (segments - 1);
    const angle = progress * Math.PI * 2 * turns;
    const radius = progress * maxRadius;
    const x = center + Math.cos(angle) * radius;
    const y = center + Math.sin(angle) * radius;
    return { x, y, progress };
  });

  const spiralPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        {/* Spiral path */}
        <motion.path
          d={spiralPath}
          fill="none"
          stroke={SAPPHIRE[1]}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.3}
        />

        {/* Animated spiral trace */}
        <motion.path
          d={spiralPath}
          fill="none"
          stroke={SAPPHIRE[2]}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray="0 1000"
          animate={{
            strokeDasharray: ['0 1000', '1000 0', '0 1000'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Traveling dots */}
        {[0, 0.33, 0.66].map((offset, idx) => (
          <motion.circle
            key={idx}
            r={2}
            fill={SAPPHIRE[idx % 4]}
            animate={{
              offsetDistance: ['0%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
              delay: offset * 3,
            }}
          >
            <animateMotion dur="3s" repeatCount="indefinite" begin={`${offset * 3}s`}>
              <mpath href={`#spiral-${size}`} />
            </animateMotion>
          </motion.circle>
        ))}

        <path id={`spiral-${size}`} d={spiralPath} fill="none" />

        {/* Center point */}
        <motion.circle
          cx={center}
          cy={center}
          r={2.5}
          fill={SAPPHIRE[3]}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Outer endpoint */}
        {points.length > 0 && (
          <motion.circle
            cx={points[points.length - 1]?.x}
            cy={points[points.length - 1]?.y}
            r={2}
            fill={SAPPHIRE[0]}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          />
        )}
      </svg>
    </div>
  );
}
