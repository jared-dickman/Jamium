'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function CoinLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const center = dim / 2;
  const coinRadius = dim * 0.32;

  // Multiple sparkles that twinkle and move across the coin
  const sparkles = [
    { delay: 0, x: 0.15, y: 0.2, duration: 1.8 },
    { delay: 0.3, x: 0.25, y: 0.35, duration: 2.0 },
    { delay: 0.6, x: 0.35, y: 0.25, duration: 1.6 },
    { delay: 0.9, x: 0.2, y: 0.3, duration: 2.2 },
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
          <radialGradient id={`coin-gold-${size}`}>
            <stop offset="0%" stopColor={SAPPHIRE[3]} />
            <stop offset="50%" stopColor={SAPPHIRE[2]} />
            <stop offset="100%" stopColor={SAPPHIRE[1]} />
          </radialGradient>
        </defs>

        {/* Coin body - static gold surface */}
        <circle cx={center} cy={center} r={coinRadius} fill={`url(#coin-gold-${size})`} />

        {/* Arcade coin rim/ridge */}
        <circle
          cx={center}
          cy={center}
          r={coinRadius}
          fill="none"
          stroke={SAPPHIRE[0]}
          strokeWidth={dim * 0.015}
          opacity={0.4}
        />

        {/* Center pixel-art star symbol - arcade coin style */}
        <motion.g
          animate={{
            rotate: [0, 360],
            scale: [1, 1.15, 1],
          }}
          transition={{
            rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
            scale: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
          }}
          style={{
            originX: `${center}px`,
            originY: `${center}px`,
          }}
        >
          {/* Five-pointed star - bold video game token style */}
          <path
            d={`
              M ${center} ${center - coinRadius * 0.55}
              L ${center + coinRadius * 0.14} ${center - coinRadius * 0.18}
              L ${center + coinRadius * 0.52} ${center - coinRadius * 0.18}
              L ${center + coinRadius * 0.22} ${center + coinRadius * 0.08}
              L ${center + coinRadius * 0.34} ${center + coinRadius * 0.52}
              L ${center} ${center + coinRadius * 0.28}
              L ${center - coinRadius * 0.34} ${center + coinRadius * 0.52}
              L ${center - coinRadius * 0.22} ${center + coinRadius * 0.08}
              L ${center - coinRadius * 0.52} ${center - coinRadius * 0.18}
              L ${center - coinRadius * 0.14} ${center - coinRadius * 0.18}
              Z
            `}
            fill={SAPPHIRE[0]}
            stroke="#ffffff"
            strokeWidth={dim * 0.012}
            strokeLinejoin="miter"
          />
          {/* Inner highlight for arcade depth */}
          <path
            d={`
              M ${center} ${center - coinRadius * 0.38}
              L ${center + coinRadius * 0.1} ${center - coinRadius * 0.12}
              L ${center + coinRadius * 0.35} ${center - coinRadius * 0.12}
              L ${center + coinRadius * 0.15} ${center + coinRadius * 0.05}
              L ${center + coinRadius * 0.23} ${center + coinRadius * 0.35}
              L ${center} ${center + coinRadius * 0.18}
              L ${center - coinRadius * 0.23} ${center + coinRadius * 0.35}
              L ${center - coinRadius * 0.15} ${center + coinRadius * 0.05}
              L ${center - coinRadius * 0.35} ${center - coinRadius * 0.12}
              L ${center - coinRadius * 0.1} ${center - coinRadius * 0.12}
              Z
            `}
            fill={SAPPHIRE[3]}
            opacity={0.6}
          />
        </motion.g>

        {/* Subtle sparkles that twinkle around the coin */}
        {sparkles.map((sparkle, i) => (
          <motion.g
            key={`sparkle-${i}`}
            animate={{
              opacity: [0, 0.6, 0.6, 0],
              scale: [0.5, 1, 1, 0.5],
            }}
            transition={{
              duration: sparkle.duration,
              repeat: Infinity,
              delay: sparkle.delay,
              ease: 'easeInOut',
            }}
            style={{
              originX: `${center + coinRadius * sparkle.x}px`,
              originY: `${center - coinRadius * sparkle.y}px`,
            }}
          >
            {/* Four-pointed star sparkle */}
            <path
              d={`
                M ${center + coinRadius * sparkle.x} ${center - coinRadius * sparkle.y - dim * 0.04}
                L ${center + coinRadius * sparkle.x + dim * 0.012} ${center - coinRadius * sparkle.y}
                L ${center + coinRadius * sparkle.x} ${center - coinRadius * sparkle.y + dim * 0.04}
                L ${center + coinRadius * sparkle.x - dim * 0.012} ${center - coinRadius * sparkle.y}
                Z
              `}
              fill="#ffffff"
              opacity={0.7}
            />
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
