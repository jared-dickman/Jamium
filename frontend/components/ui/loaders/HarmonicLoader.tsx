'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function HarmonicLoader({ size = 'md' }: LoaderProps) {
  const dimension = LOADER_SIZE[size];
  const svgSize = dimension * 0.8;
  const harmonics = 4;
  const points = 120;

  const generateHarmonic = (
    harmonic: number,
    phase: number,
    amplitude: number,
    yOffset: number
  ) => {
    let path = `M 0 ${yOffset}`;
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * svgSize;
      const y = yOffset + Math.sin((i / points) * Math.PI * 2 * harmonic + phase) * amplitude;
      path += ` L ${x} ${y}`;
    }
    return path;
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex items-center justify-center overflow-hidden"
      style={{ width: dimension, height: dimension }}
    >
      <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
        <defs>
          <linearGradient id={`harmonic-grad-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={SAPPHIRE[0]} stopOpacity={0.6} />
            <stop offset="50%" stopColor={SAPPHIRE[2]} stopOpacity={1} />
            <stop offset="100%" stopColor={SAPPHIRE[3]} stopOpacity={0.6} />
          </linearGradient>
        </defs>

        {/* Fundamental frequency - largest amplitude */}
        <motion.path
          d={generateHarmonic(1, 0, svgSize * 0.18, svgSize / 2)}
          fill="none"
          stroke={SAPPHIRE[0]}
          strokeWidth={svgSize * 0.04}
          strokeLinecap="round"
          opacity={0.95}
          animate={{
            d: Array.from({ length: 10 }, (_, idx) =>
              generateHarmonic(1, (idx / 9) * Math.PI * 2, svgSize * 0.18, svgSize / 2)
            ),
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Overtones - decreasing amplitude, increasing frequency */}
        {Array.from({ length: harmonics - 1 }).map((_, i) => {
          const harmonic = i + 2;
          const amplitude = svgSize * (0.12 / harmonic);
          const yOffset = svgSize / 2;
          const strokeWidth = svgSize * (0.028 / harmonic);

          return (
            <motion.path
              key={harmonic}
              d={generateHarmonic(harmonic, 0, amplitude, yOffset)}
              fill="none"
              stroke={`url(#harmonic-grad-${size})`}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.85 - i * 0.15}
              animate={{
                d: Array.from({ length: 10 }, (_, idx) =>
                  generateHarmonic(harmonic, (idx / 9) * Math.PI * 2, amplitude, yOffset)
                ),
              }}
              transition={{
                duration: 3 / harmonic,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
