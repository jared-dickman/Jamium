'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function GearLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const centerX = dim / 2;
  const centerY = dim / 2;

  // Precision gear tooth generation with sharp involute-like teeth
  const createGear = (cx: number, cy: number, radius: number, teeth: number) => {
    const points = [];
    const toothHeight = radius * 0.25;
    const toothBase = radius * 0.85;
    const toothTip = toothBase + toothHeight;

    for (let i = 0; i < teeth; i++) {
      const baseAngle = (i / teeth) * Math.PI * 2;
      const nextAngle = ((i + 1) / teeth) * Math.PI * 2;
      const midAngle = (baseAngle + nextAngle) / 2;

      // Tooth valley (base circle)
      const valleyStart = baseAngle + 0.15 * (nextAngle - baseAngle);
      const valleyEnd = nextAngle - 0.15 * (nextAngle - baseAngle);
      points.push([cx + Math.cos(valleyStart) * toothBase, cy + Math.sin(valleyStart) * toothBase]);

      // Rise to tooth peak
      const toothLeft = midAngle - 0.12 * (nextAngle - baseAngle);
      const toothRight = midAngle + 0.12 * (nextAngle - baseAngle);
      points.push([cx + Math.cos(toothLeft) * toothTip, cy + Math.sin(toothLeft) * toothTip]);
      points.push([cx + Math.cos(toothRight) * toothTip, cy + Math.sin(toothRight) * toothTip]);

      // Fall to next valley
      points.push([cx + Math.cos(valleyEnd) * toothBase, cy + Math.sin(valleyEnd) * toothBase]);
    }

    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ') + ' Z';
  };

  // Three interlocking gears with perfect mesh ratios
  const largeGear = {
    cx: centerX - dim * 0.15,
    cy: centerY,
    radius: dim * 0.22,
    teeth: 16,
    speed: 3, // seconds per rotation
  };

  const mediumGear = {
    cx: centerX + dim * 0.18,
    cy: centerY - dim * 0.05,
    radius: dim * 0.16,
    teeth: 12,
    speed: 4, // inverse ratio
  };

  const smallGear = {
    cx: centerX + dim * 0.18,
    cy: centerY + dim * 0.22,
    radius: dim * 0.11,
    teeth: 8,
    speed: 6, // inverse ratio
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        <defs>
          {/* Metallic gradient for sheen effect */}
          <linearGradient id="metalGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={SAPPHIRE[1]} stopOpacity={0.9} />
            <stop offset="50%" stopColor={SAPPHIRE[2]} stopOpacity={1} />
            <stop offset="100%" stopColor={SAPPHIRE[1]} stopOpacity={0.8} />
          </linearGradient>
          <linearGradient id="metalGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={SAPPHIRE[2]} stopOpacity={0.9} />
            <stop offset="50%" stopColor={SAPPHIRE[3]} stopOpacity={1} />
            <stop offset="100%" stopColor={SAPPHIRE[2]} stopOpacity={0.8} />
          </linearGradient>
          <linearGradient id="metalGrad3" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor={SAPPHIRE[0]} stopOpacity={0.9} />
            <stop offset="50%" stopColor={SAPPHIRE[1]} stopOpacity={1} />
            <stop offset="100%" stopColor={SAPPHIRE[0]} stopOpacity={0.8} />
          </linearGradient>
        </defs>

        {/* Large gear - clockwise */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: largeGear.speed, repeat: Infinity, ease: 'linear' }}
          style={{ originX: `${largeGear.cx}px`, originY: `${largeGear.cy}px` }}
        >
          {/* Outer teeth */}
          <path
            d={createGear(largeGear.cx, largeGear.cy, largeGear.radius, largeGear.teeth)}
            fill="url(#metalGrad1)"
          />
          {/* Inner hub with gradient */}
          <circle
            cx={largeGear.cx}
            cy={largeGear.cy}
            r={largeGear.radius * 0.4}
            fill={SAPPHIRE[0]}
            opacity={0.7}
          />
          {/* Hub spokes */}
          {Array.from({ length: 6 }, (_, i) => {
            const angle = (i * 60 * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={largeGear.cx}
                y1={largeGear.cy}
                x2={largeGear.cx + Math.cos(angle) * largeGear.radius * 0.35}
                y2={largeGear.cy + Math.sin(angle) * largeGear.radius * 0.35}
                stroke={SAPPHIRE[1]}
                strokeWidth={dim * 0.012}
                strokeLinecap="round"
                opacity={0.6}
              />
            );
          })}
          {/* Central axle */}
          <circle
            cx={largeGear.cx}
            cy={largeGear.cy}
            r={largeGear.radius * 0.15}
            fill={SAPPHIRE[2]}
          />
        </motion.g>

        {/* Medium gear - counter-clockwise, meshes with large */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: mediumGear.speed, repeat: Infinity, ease: 'linear' }}
          style={{ originX: `${mediumGear.cx}px`, originY: `${mediumGear.cy}px` }}
        >
          <path
            d={createGear(mediumGear.cx, mediumGear.cy, mediumGear.radius, mediumGear.teeth)}
            fill="url(#metalGrad2)"
          />
          <circle
            cx={mediumGear.cx}
            cy={mediumGear.cy}
            r={mediumGear.radius * 0.42}
            fill={SAPPHIRE[1]}
            opacity={0.6}
          />
          {/* Hub detail */}
          {Array.from({ length: 4 }, (_, i) => {
            const angle = (i * 90 * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={mediumGear.cx}
                y1={mediumGear.cy}
                x2={mediumGear.cx + Math.cos(angle) * mediumGear.radius * 0.37}
                y2={mediumGear.cy + Math.sin(angle) * mediumGear.radius * 0.37}
                stroke={SAPPHIRE[2]}
                strokeWidth={dim * 0.01}
                strokeLinecap="round"
                opacity={0.6}
              />
            );
          })}
          <circle
            cx={mediumGear.cx}
            cy={mediumGear.cy}
            r={mediumGear.radius * 0.16}
            fill={SAPPHIRE[3]}
          />
        </motion.g>

        {/* Small gear - clockwise, meshes with medium */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: smallGear.speed, repeat: Infinity, ease: 'linear' }}
          style={{ originX: `${smallGear.cx}px`, originY: `${smallGear.cy}px` }}
        >
          <path
            d={createGear(smallGear.cx, smallGear.cy, smallGear.radius, smallGear.teeth)}
            fill="url(#metalGrad3)"
          />
          <circle
            cx={smallGear.cx}
            cy={smallGear.cy}
            r={smallGear.radius * 0.45}
            fill={SAPPHIRE[0]}
            opacity={0.65}
          />
          {/* Simple 3-spoke hub */}
          {Array.from({ length: 3 }, (_, i) => {
            const angle = (i * 120 * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={smallGear.cx}
                y1={smallGear.cy}
                x2={smallGear.cx + Math.cos(angle) * smallGear.radius * 0.4}
                y2={smallGear.cy + Math.sin(angle) * smallGear.radius * 0.4}
                stroke={SAPPHIRE[1]}
                strokeWidth={dim * 0.01}
                strokeLinecap="round"
                opacity={0.5}
              />
            );
          })}
          <circle
            cx={smallGear.cx}
            cy={smallGear.cy}
            r={smallGear.radius * 0.18}
            fill={SAPPHIRE[2]}
          />
        </motion.g>
      </svg>
    </div>
  );
}
