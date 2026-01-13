'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function EntropyLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];

  // Generate deterministic random positions
  const particles = SAPPHIRE.flatMap((color, colorIndex) =>
    Array.from({ length: 3 }, (_, particleIndex) => {
      const seed = colorIndex * 3 + particleIndex;
      const angle = (seed * 137.5) % 360; // Golden angle distribution
      const distance = 15 + (seed % 3) * 10;
      return {
        id: seed,
        color,
        x: 50 + distance * Math.cos((angle * Math.PI) / 180),
        y: 50 + distance * Math.sin((angle * Math.PI) / 180),
        targetX: 50 + 40 * Math.cos(((angle + 180) * Math.PI) / 180),
        targetY: 50 + 40 * Math.sin(((angle + 180) * Math.PI) / 180),
      };
    })
  );

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox="0 0 100 100">
        {/* Container boundary */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={SAPPHIRE[0]}
          strokeWidth="1"
          opacity="0.2"
        />

        {/* Particles spreading (increasing entropy) */}
        {particles.map(particle => (
          <motion.circle
            key={particle.id}
            cx="50"
            cy="50"
            r="2"
            fill={particle.color}
            opacity="0.8"
            animate={{
              cx: [50, particle.targetX, particle.x, particle.targetX, 50],
              cy: [50, particle.targetY, particle.y, particle.targetY, 50],
              r: [2, 3, 2],
              opacity: [0.3, 0.9, 0.5, 0.9, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: particle.id * 0.12,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Central order indicator */}
        <motion.circle
          cx="50"
          cy="50"
          r="6"
          fill="none"
          stroke={SAPPHIRE[2]}
          strokeWidth="1.5"
          opacity="0.5"
          animate={{
            r: [6, 3, 6],
            opacity: [0.5, 0.9, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </svg>
    </div>
  );
}
