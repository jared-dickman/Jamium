'use client';

import { motion } from 'framer-motion';
import {
  SAPPHIRE,
  LOADER_SIZE,
  DURATION,
  type LoaderProps,
} from '@/components/ui/loaders/loader.constants';

export function AmongUsLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={className}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox="0 0 100 100" style={{ display: 'block' }}>
        {/* Crewmate walking animation */}
        <motion.g
          animate={{
            x: [0, 15, 0, -15, 0],
          }}
          transition={{
            duration: DURATION.slow * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Main body - bean shape */}
          <motion.path
            d="M35 35 Q32 25, 40 20 L60 20 Q68 25, 65 35 L65 60 Q65 70, 55 70 L45 70 Q35 70, 35 60 Z"
            fill={SAPPHIRE[1]}
            stroke={SAPPHIRE[0]}
            strokeWidth="2"
            animate={{
              d: [
                'M35 35 Q32 25, 40 20 L60 20 Q68 25, 65 35 L65 60 Q65 70, 55 70 L45 70 Q35 70, 35 60 Z',
                'M35 37 Q32 25, 40 20 L60 20 Q68 25, 65 37 L65 62 Q65 72, 55 72 L45 72 Q35 72, 35 62 Z',
                'M35 35 Q32 25, 40 20 L60 20 Q68 25, 65 35 L65 60 Q65 70, 55 70 L45 70 Q35 70, 35 60 Z',
              ],
            }}
            transition={{
              duration: DURATION.normal,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Visor/Glass window */}
          <motion.ellipse
            cx="50"
            cy="32"
            rx="14"
            ry="11"
            fill={SAPPHIRE[3]}
            stroke={SAPPHIRE[2]}
            strokeWidth="1.5"
            animate={{
              opacity: [0.9, 1, 0.9],
            }}
            transition={{
              duration: DURATION.medium,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Visor reflection */}
          <motion.ellipse
            cx="48"
            cy="29"
            rx="4"
            ry="3"
            fill="white"
            opacity="0.7"
            animate={{
              opacity: [0.5, 0.9, 0.5],
            }}
            transition={{
              duration: DURATION.medium,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Backpack */}
          <rect
            x="62"
            y="38"
            width="8"
            height="18"
            rx="2"
            fill={SAPPHIRE[0]}
            stroke={SAPPHIRE[0]}
            strokeWidth="1"
          />

          {/* Backpack vent detail */}
          <line x1="64" y1="42" x2="68" y2="42" stroke={SAPPHIRE[2]} strokeWidth="1" />
          <line x1="64" y1="46" x2="68" y2="46" stroke={SAPPHIRE[2]} strokeWidth="1" />
          <line x1="64" y1="50" x2="68" y2="50" stroke={SAPPHIRE[2]} strokeWidth="1" />

          {/* Left leg - walking animation */}
          <motion.ellipse
            cx="42"
            cy="72"
            rx="5"
            ry="7"
            fill={SAPPHIRE[1]}
            stroke={SAPPHIRE[0]}
            strokeWidth="1.5"
            animate={{
              cy: [72, 74, 72, 70, 72],
              rx: [5, 4.5, 5, 5.5, 5],
            }}
            transition={{
              duration: DURATION.slow * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Right leg - walking animation (opposite phase) */}
          <motion.ellipse
            cx="58"
            cy="72"
            rx="5"
            ry="7"
            fill={SAPPHIRE[1]}
            stroke={SAPPHIRE[0]}
            strokeWidth="1.5"
            animate={{
              cy: [72, 70, 72, 74, 72],
              rx: [5, 5.5, 5, 4.5, 5],
            }}
            transition={{
              duration: DURATION.slow * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.g>

        {/* Floating particles/dust behind crewmate */}
        {[0, 1, 2].map(i => (
          <motion.circle
            key={i}
            cx={20 + i * 10}
            cy={65 - i * 5}
            r="1.5"
            fill={SAPPHIRE[i % 4]}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0.5, 1, 0.5],
              x: [0, 20, 40],
            }}
            transition={{
              duration: DURATION.slow,
              repeat: Infinity,
              ease: 'easeOut',
              delay: i * 0.4,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
