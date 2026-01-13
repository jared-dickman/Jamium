'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function ClockworkLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const centerX = dim / 2;
  const centerY = dim / 2;
  const outerRadius = dim * 0.38;

  // Create gear teeth for outer mechanism
  const createGearPath = (teeth: number) => {
    const points = [];
    const toothDepth = dim * 0.03;
    const radius = outerRadius - dim * 0.035;

    for (let i = 0; i < teeth; i++) {
      const angle1 = (i / teeth) * Math.PI * 2;
      const angle2 = ((i + 0.4) / teeth) * Math.PI * 2;

      points.push([centerX + Math.cos(angle1) * radius, centerY + Math.sin(angle1) * radius]);
      points.push([
        centerX + Math.cos(angle2) * (radius + toothDepth),
        centerY + Math.sin(angle2) * (radius + toothDepth),
      ]);
    }

    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ') + ' Z';
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox="0 0 100 100">
        {/* Outer casing */}
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke={SAPPHIRE[0]}
          strokeWidth="2.5"
          opacity={0.5}
        />

        {/* Rotating outer gear */}
        <motion.path
          d={(() => {
            const points = [];
            const teeth = 24;
            const toothDepth = 3;
            const radius = 35;

            for (let i = 0; i < teeth; i++) {
              const angle1 = (i / teeth) * Math.PI * 2;
              const angle2 = ((i + 0.4) / teeth) * Math.PI * 2;
              points.push([50 + Math.cos(angle1) * radius, 50 + Math.sin(angle1) * radius]);
              points.push([
                50 + Math.cos(angle2) * (radius + toothDepth),
                50 + Math.sin(angle2) * (radius + toothDepth),
              ]);
            }
            return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ') + ' Z';
          })()}
          fill="none"
          stroke={SAPPHIRE[1]}
          strokeWidth="1.2"
          opacity={0.6}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '50px 50px' }}
        />

        {/* Main clockwork wheel */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '50px 50px' }}
        >
          <circle
            cx="50"
            cy="50"
            r="28"
            fill="none"
            stroke={SAPPHIRE[1]}
            strokeWidth="1.8"
            opacity={0.7}
          />
          {[0, 60, 120, 180, 240, 300].map(angle => {
            const rad = (angle * Math.PI) / 180;
            return (
              <line
                key={angle}
                x1="50"
                y1="50"
                x2={50 + Math.cos(rad) * 28}
                y2={50 + Math.sin(rad) * 28}
                stroke={SAPPHIRE[2]}
                strokeWidth="1.5"
                opacity={0.5}
              />
            );
          })}
        </motion.g>

        {/* Inner escapement wheel */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '50px 50px' }}
        >
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const innerR = 12;
            const outerR = 18;
            return (
              <line
                key={i}
                x1={50 + Math.cos(angle) * innerR}
                y1={50 + Math.sin(angle) * innerR}
                x2={50 + Math.cos(angle) * outerR}
                y2={50 + Math.sin(angle) * outerR}
                stroke={SAPPHIRE[3]}
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}
        </motion.g>

        {/* Central pivot */}
        <circle cx="50" cy="50" r="8" fill={SAPPHIRE[0]} opacity={0.8} />
        <circle cx="50" cy="50" r="5" fill={SAPPHIRE[1]} />
        <circle cx="50" cy="50" r="2.5" fill={SAPPHIRE[2]} />
      </svg>
    </div>
  );
}
