'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function NebulaLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const center = dim / 2;

  const clouds = [
    { cx: center * 0.6, cy: center * 0.7, r: dim * 0.25, color: SAPPHIRE[0], delay: 0 },
    { cx: center * 1.4, cy: center * 0.8, r: dim * 0.28, color: SAPPHIRE[1], delay: 0.5 },
    { cx: center, cy: center * 1.3, r: dim * 0.22, color: SAPPHIRE[2], delay: 1 },
    { cx: center * 1.2, cy: center * 1.2, r: dim * 0.2, color: SAPPHIRE[3], delay: 1.5 },
  ];

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
        <defs>
          {clouds.map((cloud, i) => (
            <radialGradient key={i} id={`nebula-cloud-${size}-${i}`}>
              <stop offset="0%" stopColor={cloud.color} stopOpacity="0.6" />
              <stop offset="60%" stopColor={cloud.color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={cloud.color} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        {clouds.map((cloud, i) => (
          <motion.circle
            key={i}
            cx={cloud.cx}
            cy={cloud.cy}
            r={cloud.r}
            fill={`url(#nebula-cloud-${size}-${i})`}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.5, 0.9, 0.5],
              x: [0, dim * 0.05, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: cloud.delay,
            }}
            style={{ originX: `${cloud.cx}px`, originY: `${cloud.cy}px` }}
          />
        ))}

        {/* Twinkling stars */}
        {[...Array(6)].map((_, i) => (
          <motion.circle
            key={`star-${i}`}
            cx={(center + i * dim * 0.15) % dim}
            cy={(center + i * dim * 0.2) % dim}
            r={dim * 0.015}
            fill={SAPPHIRE[3]}
            animate={{
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>
    </div>
  );
}
