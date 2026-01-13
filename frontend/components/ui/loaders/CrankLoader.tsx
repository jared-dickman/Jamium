'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  SAPPHIRE,
  LOADER_SIZE,
  DURATION,
  type LoaderProps,
} from '@/components/ui/loaders/loader.constants';

export function CrankLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const svgSize = dim * 0.8;
  const cx = svgSize / 2;
  const cy = svgSize / 2;

  // Simple mechanical crank dimensions
  const armLength = svgSize * 0.28;
  const handleWidth = svgSize * 0.12;
  const handleHeight = svgSize * 0.16;
  const gearRadius = svgSize * 0.12;
  const shaftWidth = svgSize * 0.08;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
        {/* Central gear mechanism */}
        <circle
          cx={cx}
          cy={cy}
          r={gearRadius}
          fill={SAPPHIRE[0]}
          stroke={SAPPHIRE[1]}
          strokeWidth={2}
        />

        {/* Gear teeth */}
        {[0, 60, 120, 180, 240, 300].map(angle => {
          const rad = (angle * Math.PI) / 180;
          const x1 = cx + Math.cos(rad) * gearRadius;
          const y1 = cy + Math.sin(rad) * gearRadius;
          const x2 = cx + Math.cos(rad) * (gearRadius + svgSize * 0.04);
          const y2 = cy + Math.sin(rad) * (gearRadius + svgSize * 0.04);
          return (
            <line
              key={angle}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={SAPPHIRE[1]}
              strokeWidth={svgSize * 0.025}
              strokeLinecap="round"
            />
          );
        })}

        {/* Central shaft */}
        <rect
          x={cx - shaftWidth / 2}
          y={cy - shaftWidth / 2}
          width={shaftWidth}
          height={shaftWidth}
          fill={SAPPHIRE[2]}
        />

        {/* Rotating crank arm + handle */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{
            duration: DURATION.slow,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            originX: `${cx}px`,
            originY: `${cy}px`,
          }}
        >
          {/* Crank arm */}
          <line
            x1={cx}
            y1={cy}
            x2={cx + armLength}
            y2={cy}
            stroke={SAPPHIRE[2]}
            strokeWidth={svgSize * 0.03}
            strokeLinecap="round"
          />

          {/* Handle grip - rounded rectangle */}
          <rect
            x={cx + armLength - handleWidth / 2}
            y={cy - handleHeight / 2}
            width={handleWidth}
            height={handleHeight}
            rx={handleWidth * 0.3}
            ry={handleWidth * 0.3}
            fill={SAPPHIRE[3]}
            stroke={SAPPHIRE[1]}
            strokeWidth={2}
          />

          {/* Handle grip detail */}
          <circle cx={cx + armLength} cy={cy} r={svgSize * 0.025} fill={SAPPHIRE[1]} />
        </motion.g>
      </svg>
    </div>
  );
}
