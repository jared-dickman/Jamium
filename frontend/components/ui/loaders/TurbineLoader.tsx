'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function TurbineLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const centerX = dim / 2;
  const centerY = dim / 2;
  const bladeLength = dim * 0.32;
  const hubRadius = dim * 0.08;

  // Create curved turbine blade
  const createBlade = (angle: number, colorIndex: number) => {
    const rad = (angle * Math.PI) / 180;
    const tipX = centerX + Math.cos(rad) * bladeLength;
    const tipY = centerY + Math.sin(rad) * bladeLength;
    const midX = centerX + Math.cos(rad) * (bladeLength * 0.6);
    const midY = centerY + Math.sin(rad) * (bladeLength * 0.6);

    // Control points for bezier curve
    const perpRad = rad + Math.PI / 2;
    const curve = bladeLength * 0.18;
    const ctrlX = midX + Math.cos(perpRad) * curve;
    const ctrlY = midY + Math.sin(perpRad) * curve;

    return (
      <path
        d={`M ${centerX + Math.cos(rad) * hubRadius} ${centerY + Math.sin(rad) * hubRadius}
            Q ${ctrlX} ${ctrlY}, ${tipX} ${tipY}
            L ${tipX + Math.cos(rad + 0.3) * (bladeLength * 0.15)} ${tipY + Math.sin(rad + 0.3) * (bladeLength * 0.15)}
            Q ${ctrlX} ${ctrlY}, ${centerX + Math.cos(rad + 0.6) * hubRadius} ${centerY + Math.sin(rad + 0.6) * hubRadius}
            Z`}
        fill={SAPPHIRE[colorIndex]}
        opacity={0.85}
      />
    );
  };

  const bladeAngles = [0, 60, 120, 180, 240, 300];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        {/* Outer ring */}
        <circle
          cx={centerX}
          cy={centerY}
          r={bladeLength * 1.05}
          fill="none"
          stroke={SAPPHIRE[0]}
          strokeWidth={dim * 0.015}
          opacity={0.2}
        />

        {/* Rotating blades - clockwise */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '50% 50%' }}
        >
          {bladeAngles.map((angle, i) => (
            <g key={angle}>{createBlade(angle, (i % 3) + 1)}</g>
          ))}
        </motion.g>

        {/* Central hub with detail */}
        <circle cx={centerX} cy={centerY} r={hubRadius} fill={SAPPHIRE[0]} opacity={0.9} />
        <circle cx={centerX} cy={centerY} r={hubRadius * 0.7} fill={SAPPHIRE[1]} opacity={0.8} />
        <circle cx={centerX} cy={centerY} r={hubRadius * 0.4} fill={SAPPHIRE[2]} />

        {/* Hub bolts */}
        {[0, 90, 180, 270].map(angle => {
          const rad = (angle * Math.PI) / 180;
          const boltX = centerX + Math.cos(rad) * (hubRadius * 0.55);
          const boltY = centerY + Math.sin(rad) * (hubRadius * 0.55);
          return (
            <circle
              key={angle}
              cx={boltX}
              cy={boltY}
              r={hubRadius * 0.12}
              fill={SAPPHIRE[0]}
              opacity={0.6}
            />
          );
        })}
      </svg>
    </div>
  );
}
