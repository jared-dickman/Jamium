'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function PacmanLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const center = dim / 2;
  const pacRadius = dim * 0.25;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={className}
      style={{
        width: dim,
        height: dim,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        {/* Dots being eaten */}
        {[0.55, 0.7, 0.85].map((pos, i) => (
          <motion.circle
            key={i}
            cx={dim * pos}
            cy={center}
            r={dim * 0.04}
            fill={SAPPHIRE[2]}
            animate={{
              opacity: [1, 1, 1, 0, 0],
              x: [-dim * 0.1, -dim * 0.15, -dim * 0.2, -dim * 0.25, -dim * 0.3],
              scale: [1, 1, 1, 0.3, 0],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'linear',
              times: [0, 0.5, 0.65, 0.75, 1],
            }}
          />
        ))}

        {/* Pacman - only mouth animates */}
        <motion.path
          d={`M ${center} ${center}
              L ${center + pacRadius} ${center - pacRadius * 0.6}
              A ${pacRadius} ${pacRadius} 0 1 0 ${center + pacRadius} ${center + pacRadius * 0.6}
              Z`}
          fill={SAPPHIRE[1]}
          animate={{
            d: [
              `M ${center} ${center} L ${center + pacRadius} ${center - pacRadius * 0.6} A ${pacRadius} ${pacRadius} 0 1 0 ${center + pacRadius} ${center + pacRadius * 0.6} Z`,
              `M ${center} ${center} L ${center + pacRadius} ${center - pacRadius * 0.1} A ${pacRadius} ${pacRadius} 0 1 0 ${center + pacRadius} ${center + pacRadius * 0.1} Z`,
              `M ${center} ${center} L ${center + pacRadius} ${center - pacRadius * 0.6} A ${pacRadius} ${pacRadius} 0 1 0 ${center + pacRadius} ${center + pacRadius * 0.6} Z`,
            ],
          }}
          transition={{ duration: 0.3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Static eye */}
        <circle cx={center} cy={center - pacRadius * 0.4} r={dim * 0.03} fill={SAPPHIRE[0]} />
      </svg>
    </div>
  );
}
