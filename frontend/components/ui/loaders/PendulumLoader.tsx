'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function PendulumLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const svgSize = dim * 0.8;

  // Body positioning - triangular wooden case
  const bodyTop = 40; // Leave room for arm above
  const bodyBottom = 85;
  const bodyWidth = 35;
  const escapeHoleWidth = 8; // Opening at top for arm

  // Pendulum arm - extends UP from body
  const pivotY = bodyTop + 2; // Just above body
  const armLength = 35; // Extends upward
  const weightY = 15; // Weight position on upper arm
  const maxAngle = 28; // Swing angle

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center overflow-hidden', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={svgSize} height={svgSize} viewBox="0 0 100 100">
        <defs>
          <linearGradient id={`metronome-wood-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={SAPPHIRE[1]} />
            <stop offset="50%" stopColor={SAPPHIRE[0]} />
            <stop offset="100%" stopColor={SAPPHIRE[1]} />
          </linearGradient>
        </defs>

        {/* Tempo tick marks on body */}
        {[0.25, 0.4, 0.55, 0.7, 0.85].map((pos, i) => {
          const y = bodyTop + (bodyBottom - bodyTop) * pos;
          const width = bodyWidth * (1 - pos * 0.3);
          return (
            <line
              key={i}
              x1={50 - width * 0.3}
              y1={y}
              x2={50 + width * 0.3}
              y2={y}
              stroke={SAPPHIRE[3]}
              strokeWidth={0.5}
              opacity={0.4}
            />
          );
        })}

        {/* Metronome body - classic triangular pyramid */}
        <path
          d={`
            M ${50 - escapeHoleWidth / 2} ${bodyTop}
            L ${50 - bodyWidth / 2} ${bodyBottom}
            L ${50 + bodyWidth / 2} ${bodyBottom}
            L ${50 + escapeHoleWidth / 2} ${bodyTop}
            Z
          `}
          fill={`url(#metronome-wood-${size})`}
          stroke={SAPPHIRE[2]}
          strokeWidth={1.2}
          opacity={0.9}
        />

        {/* Escape hole detail (where arm exits) */}
        <rect
          x={50 - escapeHoleWidth / 2}
          y={bodyTop - 1}
          width={escapeHoleWidth}
          height={3}
          fill={SAPPHIRE[0]}
          opacity={0.6}
        />

        {/* Base platform */}
        <rect
          x={50 - bodyWidth / 2 - 2}
          y={bodyBottom}
          width={bodyWidth + 4}
          height={3}
          rx={1}
          fill={SAPPHIRE[2]}
          opacity={0.8}
        />

        {/* Animated pendulum arm - swings ABOVE body */}
        <motion.g
          animate={{
            rotate: [-maxAngle, maxAngle, -maxAngle],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: [0.45, 0.05, 0.55, 0.95], // Realistic pendulum physics
            times: [0, 0.5, 1],
          }}
          style={{
            transformOrigin: '50px 40px', // Pivot point
          }}
        >
          {/* Arm rod extending UPWARD */}
          <line
            x1={50}
            y1={pivotY}
            x2={50}
            y2={pivotY - armLength}
            stroke={SAPPHIRE[3]}
            strokeWidth={1.5}
            strokeLinecap="round"
          />

          {/* Adjustable weight on UPPER portion of arm */}
          <g transform={`translate(50, ${weightY})`}>
            {/* Weight housing */}
            <rect
              x={-4}
              y={-3}
              width={8}
              height={6}
              rx={1}
              fill={SAPPHIRE[0]}
              stroke={SAPPHIRE[3]}
              strokeWidth={0.8}
            />
            {/* Weight detail line */}
            <line x1={-3} y1={0} x2={3} y2={0} stroke={SAPPHIRE[2]} strokeWidth={0.5} />
          </g>

          {/* Pendulum bob at top */}
          <circle
            cx={50}
            cy={pivotY - armLength}
            r={2.5}
            fill={SAPPHIRE[3]}
            stroke={SAPPHIRE[2]}
            strokeWidth={0.8}
          />
        </motion.g>

        {/* Pivot point where arm exits body */}
        <circle cx={50} cy={pivotY} r={1.5} fill={SAPPHIRE[2]} />
      </svg>
    </div>
  );
}
