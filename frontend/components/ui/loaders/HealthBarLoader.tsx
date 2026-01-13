'use client';

import { motion } from 'framer-motion';
import {
  SAPPHIRE,
  LOADER_SIZE,
  DURATION,
  TRANSITION,
  type LoaderProps,
} from '@/components/ui/loaders/loader.constants';

export function HealthBarLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const heartSize = dim * 0.2;
  const spacing = dim * 0.26;
  const startX = dim * 0.15;
  const heartY = dim * 0.5 - heartSize * 0.45;

  // Smooth heart SVG path (normalized to 1x1 unit for scaling)
  const createHeartPath = (x: number, y: number, scale: number) => {
    const s = scale;
    return `
      M ${x + s * 0.5} ${y + s * 0.3}
      C ${x + s * 0.5} ${y + s * 0.15}
        ${x + s * 0.3} ${y}
        ${x + s * 0.2} ${y}
      C ${x} ${y}
        ${x} ${y + s * 0.2}
        ${x} ${y + s * 0.3}
      C ${x} ${y + s * 0.45}
        ${x + s * 0.15} ${y + s * 0.6}
        ${x + s * 0.5} ${y + s * 0.9}
      C ${x + s * 0.85} ${y + s * 0.6}
        ${x + s} ${y + s * 0.45}
        ${x + s} ${y + s * 0.3}
      C ${x + s} ${y + s * 0.2}
        ${x + s} ${y}
        ${x + s * 0.8} ${y}
      C ${x + s * 0.7} ${y}
        ${x + s * 0.5} ${y + s * 0.15}
        ${x + s * 0.5} ${y + s * 0.3}
      Z
    `;
  };

  const totalWidth = spacing * 2 + heartSize;

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
      }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        <defs>
          <filter id={`heart-glow-${size}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Linear gradient for shine effect */}
          <linearGradient id={`shine-gradient-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={SAPPHIRE[3]} stopOpacity="0" />
            <stop offset="40%" stopColor={SAPPHIRE[3]} stopOpacity="0" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.8" />
            <stop offset="60%" stopColor={SAPPHIRE[3]} stopOpacity="0" />
            <stop offset="100%" stopColor={SAPPHIRE[3]} stopOpacity="0" />
          </linearGradient>

          {/* Mask for the shine - only shows on hearts */}
          <mask id={`hearts-mask-${size}`}>
            <rect x="0" y="0" width={dim} height={dim} fill="black" />
            <path d={createHeartPath(startX, heartY, heartSize)} fill="white" />
            <path d={createHeartPath(startX + spacing, heartY, heartSize)} fill="white" />
            <path d={createHeartPath(startX + spacing * 2, heartY, heartSize)} fill="white" />
          </mask>
        </defs>

        {/* Heart 1 - Static with subtle pulse */}
        <g>
          {/* Shadow/outline */}
          <path d={createHeartPath(startX, heartY, heartSize)} fill={SAPPHIRE[0]} opacity={0.3} />
          {/* Main heart */}
          <path
            d={createHeartPath(startX, heartY, heartSize)}
            fill={SAPPHIRE[2]}
            filter={`url(#heart-glow-${size})`}
          />
        </g>

        {/* Heart 2 - Static with subtle pulse */}
        <g>
          {/* Shadow/outline */}
          <path
            d={createHeartPath(startX + spacing, heartY, heartSize)}
            fill={SAPPHIRE[0]}
            opacity={0.3}
          />
          {/* Main heart */}
          <path
            d={createHeartPath(startX + spacing, heartY, heartSize)}
            fill={SAPPHIRE[2]}
            filter={`url(#heart-glow-${size})`}
          />
        </g>

        {/* Heart 3 - Static with subtle pulse */}
        <g>
          {/* Shadow/outline */}
          <path
            d={createHeartPath(startX + spacing * 2, heartY, heartSize)}
            fill={SAPPHIRE[0]}
            opacity={0.3}
          />
          {/* Main heart */}
          <path
            d={createHeartPath(startX + spacing * 2, heartY, heartSize)}
            fill={SAPPHIRE[2]}
            filter={`url(#heart-glow-${size})`}
          />
        </g>

        {/* Shine sweep effect - moves left to right across all hearts */}
        <motion.rect
          x={startX - heartSize * 0.3}
          y={0}
          width={heartSize * 0.6}
          height={dim}
          fill={`url(#shine-gradient-${size})`}
          mask={`url(#hearts-mask-${size})`}
          animate={{
            x: [startX - heartSize * 0.3, startX + totalWidth + heartSize * 0.3],
          }}
          transition={{
            duration: DURATION.slow,
            repeat: Infinity,
            ease: 'linear',
            repeatDelay: 0.5,
          }}
        />
      </svg>
    </div>
  );
}
