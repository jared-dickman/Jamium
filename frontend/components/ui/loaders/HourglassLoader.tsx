'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function HourglassLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const svgSize = dim * 0.8;

  // Sand particles that fall from top to bottom
  const sandParticles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: i * 0.15,
  }));

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
        overflow: 'hidden',
      }}
    >
      <motion.svg
        width={svgSize}
        height={svgSize}
        viewBox="0 0 100 100"
        animate={{ rotate: 180 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 1.5,
          ease: 'easeInOut',
        }}
      >
        <defs>
          <linearGradient id={`hourglass-gradient-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={SAPPHIRE[3]} stopOpacity="0.3" />
            <stop offset="100%" stopColor={SAPPHIRE[1]} stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Hourglass frame - top triangle */}
        <motion.path
          d="M 20 10 L 80 10 L 50 50 Z"
          stroke={SAPPHIRE[2]}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Hourglass frame - bottom triangle */}
        <motion.path
          d="M 20 90 L 80 90 L 50 50 Z"
          stroke={SAPPHIRE[2]}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Center neck highlight */}
        <motion.circle
          cx={50}
          cy={50}
          r={2}
          fill={SAPPHIRE[3]}
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Falling sand particles */}
        {sandParticles.map(particle => (
          <motion.circle
            key={particle.id}
            r={1.5}
            fill={SAPPHIRE[particle.id % 4]}
            animate={{
              cx: [50 + (Math.random() - 0.5) * 20, 50 + (Math.random() - 0.5) * 10, 50],
              cy: [20, 48, 75],
              opacity: [0, 1, 1, 0.6],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeIn',
              times: [0, 0.4, 0.7, 1],
            }}
          />
        ))}

        {/* Top bulb sand level - decreasing */}
        <motion.path
          d="M 35 20 Q 50 30, 65 20"
          stroke={SAPPHIRE[1]}
          strokeWidth={2}
          fill={`url(#hourglass-gradient-${size})`}
          opacity={0.7}
          animate={{
            d: [
              'M 30 25 Q 50 35, 70 25 L 70 30 Q 50 40, 30 30 Z',
              'M 40 35 Q 50 42, 60 35 L 60 38 Q 50 45, 40 38 Z',
              'M 48 45 Q 50 48, 52 45 L 52 46 Q 50 49, 48 46 Z',
            ],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Bottom bulb sand level - increasing */}
        <motion.path
          d="M 48 52 Q 50 54, 52 52"
          stroke={SAPPHIRE[1]}
          strokeWidth={2}
          fill={`url(#hourglass-gradient-${size})`}
          opacity={0.7}
          animate={{
            d: [
              'M 48 52 Q 50 54, 52 52 L 52 53 Q 50 55, 48 53 Z',
              'M 40 62 Q 50 70, 60 62 L 60 65 Q 50 73, 40 65 Z',
              'M 30 72 Q 50 82, 70 72 L 70 78 Q 50 88, 30 78 Z',
            ],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Frame decorative corners */}
        <motion.rect x={15} y={5} width={8} height={8} fill={SAPPHIRE[3]} opacity={0.4} />
        <motion.rect x={77} y={5} width={8} height={8} fill={SAPPHIRE[3]} opacity={0.4} />
        <motion.rect x={15} y={87} width={8} height={8} fill={SAPPHIRE[3]} opacity={0.4} />
        <motion.rect x={77} y={87} width={8} height={8} fill={SAPPHIRE[3]} opacity={0.4} />

        {/* Elegant frame glow */}
        <motion.path
          d="M 20 10 L 80 10 L 50 50 L 20 10 M 20 90 L 80 90 L 50 50 L 20 90"
          stroke={SAPPHIRE[3]}
          strokeWidth={0.5}
          fill="none"
          opacity={0.6}
          animate={{
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.svg>
    </div>
  );
}
