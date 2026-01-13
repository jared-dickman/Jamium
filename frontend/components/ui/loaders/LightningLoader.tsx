'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function LightningLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];

  // Jagged, realistic lightning bolt path with angular segments
  const mainBolt =
    'M50,5 L48,15 L52,18 L49,28 L53,32 L47,42 L51,46 L45,58 L49,62 L42,75 L46,78 L38,95';
  // Secondary branch - splits off midway
  const branch1 = 'M47,42 L42,48 L44,52 L38,62';
  const branch2 = 'M45,58 L52,65 L50,70 L56,78';

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox="0 0 100 100" style={{ display: 'block' }}>
        <defs>
          <filter id="lightning-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer glow - sudden bright flash */}
        <motion.path
          d={mainBolt}
          fill="none"
          stroke={SAPPHIRE[3]}
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          filter="blur(6px)"
          animate={{
            opacity: [0, 1, 0.6, 0.3, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: [0.19, 1, 0.22, 1],
            times: [0, 0.05, 0.12, 0.25, 1],
            repeatDelay: 1.8,
          }}
        />

        {/* Main bolt - sharp, jagged core */}
        <motion.path
          d={mainBolt}
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
          filter="url(#lightning-glow)"
          animate={{
            opacity: [0, 1, 0.85, 0.4, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: [0.19, 1, 0.22, 1],
            times: [0, 0.03, 0.08, 0.2, 1],
            repeatDelay: 1.8,
          }}
        />

        {/* Secondary bolt overlay - electric blue */}
        <motion.path
          d={mainBolt}
          fill="none"
          stroke={SAPPHIRE[2]}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          animate={{
            opacity: [0, 0.9, 0.7, 0.35, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: [0.19, 1, 0.22, 1],
            times: [0, 0.04, 0.1, 0.22, 1],
            repeatDelay: 1.8,
          }}
        />

        {/* Branch 1 - delayed slightly */}
        <motion.path
          d={branch1}
          fill="none"
          stroke={SAPPHIRE[2]}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          filter="url(#lightning-glow)"
          animate={{
            opacity: [0, 0.95, 0.6, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: [0.19, 1, 0.22, 1],
            times: [0, 0.06, 0.14, 1],
            repeatDelay: 1.8,
          }}
        />

        {/* Branch 2 - delayed slightly more */}
        <motion.path
          d={branch2}
          fill="none"
          stroke={SAPPHIRE[2]}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          filter="url(#lightning-glow)"
          animate={{
            opacity: [0, 0.9, 0.55, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: [0.19, 1, 0.22, 1],
            times: [0, 0.07, 0.16, 1],
            repeatDelay: 1.8,
          }}
        />

        {/* Strike point flash - top */}
        <motion.circle
          cx="50"
          cy="5"
          r="6"
          fill={SAPPHIRE[3]}
          filter="blur(4px)"
          animate={{
            scale: [1, 4, 2, 1],
            opacity: [0, 1, 0.4, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: [0.19, 1, 0.22, 1],
            times: [0, 0.04, 0.15, 1],
            repeatDelay: 1.8,
          }}
        />

        {/* Impact flash - bottom */}
        <motion.circle
          cx="38"
          cy="95"
          r="10"
          fill="#ffffff"
          filter="blur(8px)"
          animate={{
            scale: [0, 3.5, 1.8, 0],
            opacity: [0, 1, 0.5, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: [0.19, 1, 0.22, 1],
            times: [0, 0.05, 0.2, 1],
            repeatDelay: 1.8,
          }}
        />

        {/* Afterglow - persists longer */}
        <motion.circle
          cx="38"
          cy="95"
          r="18"
          fill={SAPPHIRE[1]}
          filter="blur(12px)"
          animate={{
            scale: [0, 2, 1.5, 1, 0],
            opacity: [0, 0.7, 0.5, 0.3, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: [0.19, 1, 0.22, 1],
            times: [0, 0.08, 0.25, 0.5, 1],
            repeatDelay: 1.8,
          }}
        />
      </svg>
    </div>
  );
}
