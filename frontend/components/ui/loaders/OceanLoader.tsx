'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  SAPPHIRE,
  LOADER_SIZE,
  DURATION,
  type LoaderProps,
} from '@/components/ui/loaders/loader.constants';

export function OceanLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const height = dim * 0.8;

  // Generate wave path using sine function
  const generateWavePath = (amplitude: number, frequency: number, phase: number = 0) => {
    const points = 50;
    const path: string[] = [];

    for (let i = 0; i <= points; i++) {
      const x = (i / points) * dim;
      const y = height / 2 + Math.sin((i / points) * frequency * Math.PI * 2 + phase) * amplitude;
      path.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
    }

    // Close path to create filled wave
    path.push(`L ${dim} ${height}`);
    path.push(`L 0 ${height}`);
    path.push('Z');

    return path.join(' ');
  };

  // Wave configurations - deep sea to shore
  const waves = [
    // Deep ocean waves (slow, large)
    {
      amplitude: dim * 0.08,
      frequency: 1.5,
      duration: DURATION.verySlow * 1.5,
      color: SAPPHIRE[0],
      opacity: 0.4,
      phase: 0,
    },
    {
      amplitude: dim * 0.1,
      frequency: 2,
      duration: DURATION.slow,
      color: SAPPHIRE[1],
      opacity: 0.5,
      phase: Math.PI / 3,
    },
    // Mid-depth waves
    {
      amplitude: dim * 0.12,
      frequency: 2.5,
      duration: DURATION.medium,
      color: SAPPHIRE[2],
      opacity: 0.6,
      phase: Math.PI / 2,
    },
    // Surface waves (faster, sharper)
    {
      amplitude: dim * 0.14,
      frequency: 3,
      duration: DURATION.normal,
      color: SAPPHIRE[3],
      opacity: 0.7,
      phase: Math.PI,
    },
  ];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center overflow-hidden', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        <defs>
          {/* Ocean gradient for depth effect */}
          <linearGradient id={`ocean-gradient-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={SAPPHIRE[0]} stopOpacity="0.2" />
            <stop offset="50%" stopColor={SAPPHIRE[1]} stopOpacity="0.4" />
            <stop offset="100%" stopColor={SAPPHIRE[3]} stopOpacity="0.6" />
          </linearGradient>

          {/* Shimmer effect for wave crests */}
          <linearGradient id={`wave-shimmer-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Radial glow for depth */}
          <radialGradient id={`ocean-depth-${size}`}>
            <stop offset="0%" stopColor={SAPPHIRE[2]} stopOpacity="0.3" />
            <stop offset="100%" stopColor={SAPPHIRE[0]} stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {/* Background ocean depth */}
        <rect width={dim} height={dim} fill={`url(#ocean-depth-${size})`} />

        {/* Multiple wave layers with parallax motion */}
        {waves.map((wave, i) => (
          <motion.path
            key={`wave-${i}`}
            d={generateWavePath(wave.amplitude, wave.frequency, wave.phase)}
            fill={wave.color}
            opacity={wave.opacity}
            animate={{
              d: [
                generateWavePath(wave.amplitude, wave.frequency, wave.phase),
                generateWavePath(wave.amplitude, wave.frequency, wave.phase + Math.PI),
                generateWavePath(wave.amplitude, wave.frequency, wave.phase + Math.PI * 2),
              ],
            }}
            transition={{
              duration: wave.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Animated shimmer highlights on wave crests */}
        {waves.slice(2).map((wave, i) => (
          <motion.path
            key={`shimmer-${i}`}
            d={generateWavePath(wave.amplitude, wave.frequency, wave.phase)}
            fill="none"
            stroke={`url(#wave-shimmer-${size})`}
            strokeWidth={dim * 0.015}
            opacity={0.6}
            animate={{
              d: [
                generateWavePath(wave.amplitude, wave.frequency, wave.phase),
                generateWavePath(wave.amplitude, wave.frequency, wave.phase + Math.PI),
                generateWavePath(wave.amplitude, wave.frequency, wave.phase + Math.PI * 2),
              ],
              strokeOpacity: [0.6, 0.9, 0.6],
            }}
            transition={{
              duration: wave.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Subtle foam particles on surface */}
        {[...Array(6)].map((_, i) => {
          const startX = (i / 6) * dim;
          const randomDelay = i * 0.3;

          return (
            <motion.circle
              key={`foam-${i}`}
              cx={startX}
              cy={height / 2}
              r={dim * 0.012}
              fill="#ffffff"
              initial={{
                opacity: 0,
                scale: 0,
              }}
              animate={{
                opacity: [0, 0.7, 0],
                scale: [0, 1.2, 0.8],
                cx: [startX, startX + dim * 0.15, startX + dim * 0.3],
                cy: [height / 2, height / 2 - dim * 0.05, height / 2 + dim * 0.03],
              }}
              transition={{
                duration: DURATION.slow,
                delay: randomDelay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
