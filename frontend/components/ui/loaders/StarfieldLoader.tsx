'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function StarfieldLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];

  // Generate star positions with depth (size variation)
  const stars = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 0.3 + Math.random() * 1.2,
    delay: Math.random() * 3,
    duration: 1.5 + Math.random() * 2.5,
    color: SAPPHIRE[Math.floor(Math.random() * SAPPHIRE.length)],
  }));

  // Generate shooting stars
  const shootingStars = Array.from({ length: 3 }, (_, i) => ({
    id: i,
    startX: -10,
    startY: 20 + i * 30,
    endX: 110,
    endY: 50 + i * 20,
    delay: i * 4,
    color: SAPPHIRE[2 + (i % 2)],
  }));

  return (
    <div
      role="status"
      aria-label="Loading"
      className={className}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox="0 0 100 100" style={{ display: 'block' }}>
        <defs>
          {/* Glow effect for stars */}
          <filter id={`star-glow-${size}`}>
            <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Shooting star gradient */}
          <linearGradient id={`shooting-star-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Twinkling stars */}
        {stars.map(star => (
          <motion.circle
            key={star.id}
            cx={star.x}
            cy={star.y}
            r={star.size}
            fill={star.color}
            filter={`url(#star-glow-${size})`}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: star.delay,
            }}
            style={{ originX: `${star.x}px`, originY: `${star.y}px` }}
          />
        ))}

        {/* Shooting stars */}
        {shootingStars.map(star => (
          <motion.g key={`shooting-${star.id}`}>
            {/* Star trail */}
            <motion.line
              x1={star.startX}
              y1={star.startY}
              x2={star.startX + 8}
              y2={star.startY + 2}
              stroke={`url(#shooting-star-${size})`}
              strokeWidth="0.5"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{
                x1: [star.startX, star.endX],
                y1: [star.startY, star.endY],
                x2: [star.startX + 8, star.endX + 8],
                y2: [star.startY + 2, star.endY + 2],
                opacity: [0, 0.8, 0.8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
                delay: star.delay,
                repeatDelay: 10,
              }}
            />

            {/* Star head */}
            <motion.circle
              cx={star.startX}
              cy={star.startY}
              r="1.2"
              fill={star.color}
              filter={`url(#star-glow-${size})`}
              initial={{ opacity: 0 }}
              animate={{
                cx: [star.startX, star.endX],
                cy: [star.startY, star.endY],
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
                delay: star.delay,
                repeatDelay: 10,
              }}
              style={{ originX: `${star.startX}px`, originY: `${star.startY}px` }}
            />
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
