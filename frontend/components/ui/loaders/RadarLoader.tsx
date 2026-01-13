'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  SAPPHIRE,
  LOADER_SIZE,
  LOADER_STROKE,
  type LoaderProps,
} from '@/components/ui/loaders/loader.constants';

export function RadarLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const stroke = LOADER_STROKE[size];
  const centerX = dim / 2;
  const centerY = dim / 2;
  const maxRadius = dim * 0.42;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        <defs>
          <linearGradient id={`radar-sweep-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={SAPPHIRE[2]} stopOpacity="0.9" />
            <stop offset="50%" stopColor={SAPPHIRE[2]} stopOpacity="0.4" />
            <stop offset="100%" stopColor={SAPPHIRE[2]} stopOpacity="0" />
          </linearGradient>
          <radialGradient id={`radar-blip-glow-${size}`}>
            <stop offset="0%" stopColor={SAPPHIRE[3]} stopOpacity="1" />
            <stop offset="50%" stopColor={SAPPHIRE[2]} stopOpacity="0.6" />
            <stop offset="100%" stopColor={SAPPHIRE[2]} stopOpacity="0" />
          </radialGradient>
        </defs>

        {[0.3, 0.55, 0.8, 1].map((scale, i) => (
          <circle
            key={i}
            cx={centerX}
            cy={centerY}
            r={maxRadius * scale}
            fill="none"
            stroke={SAPPHIRE[i]}
            strokeWidth={stroke * 0.7}
            opacity="0.5"
          />
        ))}

        <line
          x1={centerX}
          y1={centerY - maxRadius}
          x2={centerX}
          y2={centerY + maxRadius}
          stroke={SAPPHIRE[1]}
          strokeWidth={stroke * 0.5}
          opacity="0.25"
        />
        <line
          x1={centerX - maxRadius}
          y1={centerY}
          x2={centerX + maxRadius}
          y2={centerY}
          stroke={SAPPHIRE[1]}
          strokeWidth={stroke * 0.5}
          opacity="0.25"
        />

        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          style={{
            transformOrigin: `${centerX}px ${centerY}px`,
            transformBox: 'fill-box',
          }}
        >
          <path
            d={`M ${centerX} ${centerY} L ${centerX + maxRadius} ${centerY} A ${maxRadius} ${maxRadius} 0 0 1 ${centerX} ${centerY - maxRadius} Z`}
            fill={`url(#radar-sweep-${size})`}
            opacity="0.6"
            style={{ filter: `blur(${dim * 0.01}px)` }}
          />
        </motion.g>

        {[30, 120, 200, 280].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const distance = maxRadius * (0.4 + (i % 2) * 0.3);
          const x = centerX + distance * Math.cos(rad);
          const y = centerY + distance * Math.sin(rad);
          return (
            <motion.g key={i}>
              <circle
                cx={x}
                cy={y}
                r={dim * 0.08}
                fill={`url(#radar-blip-glow-${size})`}
                opacity="0.3"
              />
              <motion.circle
                cx={x}
                cy={y}
                r={dim * 0.025}
                fill={SAPPHIRE[3]}
                animate={{
                  opacity: [0, 1, 1, 0.3, 0],
                  scale: [0.5, 1.2, 1, 1, 0.5],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: (angle / 360) * 2.5,
                }}
              />
            </motion.g>
          );
        })}

        <circle cx={centerX} cy={centerY} r={dim * 0.035} fill={SAPPHIRE[2]} opacity="0.8" />
        <circle cx={centerX} cy={centerY} r={dim * 0.02} fill={SAPPHIRE[3]} />
      </svg>
    </div>
  );
}
