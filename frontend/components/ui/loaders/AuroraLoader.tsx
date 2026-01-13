'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function AuroraLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];

  const waves = [
    { yBase: dim * 0.2, amplitude: dim * 0.15, color: SAPPHIRE[0], delay: 0 },
    { yBase: dim * 0.35, amplitude: dim * 0.2, color: SAPPHIRE[1], delay: 0.4 },
    { yBase: dim * 0.55, amplitude: dim * 0.18, color: SAPPHIRE[2], delay: 0.8 },
    { yBase: dim * 0.7, amplitude: dim * 0.22, color: SAPPHIRE[3], delay: 1.2 },
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
          {waves.map((wave, i) => (
            <linearGradient
              key={i}
              id={`aurora-gradient-${size}-${i}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={wave.color} stopOpacity="0.7" />
              <stop offset="100%" stopColor={wave.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {waves.map((wave, i) => (
          <motion.path
            key={i}
            d={`M 0 ${wave.yBase} Q ${dim * 0.25} ${wave.yBase - wave.amplitude} ${dim * 0.5} ${wave.yBase} T ${dim} ${wave.yBase} L ${dim} ${dim} L 0 ${dim} Z`}
            fill={`url(#aurora-gradient-${size}-${i})`}
            animate={{
              d: [
                `M 0 ${wave.yBase} Q ${dim * 0.25} ${wave.yBase - wave.amplitude} ${dim * 0.5} ${wave.yBase} T ${dim} ${wave.yBase} L ${dim} ${dim} L 0 ${dim} Z`,
                `M 0 ${wave.yBase} Q ${dim * 0.25} ${wave.yBase + wave.amplitude * 0.5} ${dim * 0.5} ${wave.yBase} T ${dim} ${wave.yBase} L ${dim} ${dim} L 0 ${dim} Z`,
                `M 0 ${wave.yBase} Q ${dim * 0.25} ${wave.yBase - wave.amplitude} ${dim * 0.5} ${wave.yBase} T ${dim} ${wave.yBase} L ${dim} ${dim} L 0 ${dim} Z`,
              ],
              x: [0, dim * 0.1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: wave.delay,
            }}
          />
        ))}

        {/* Shimmering particles */}
        {[...Array(8)].map((_, i) => (
          <motion.circle
            key={i}
            cx={(i * dim) / 8}
            cy={dim * 0.3 + (i % 3) * dim * 0.15}
            r={dim * 0.02}
            fill={SAPPHIRE[i % 4]}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              y: [0, dim * -0.1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
