'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function GraphLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];

  // Graph bounds
  const padding = 15;
  const graphWidth = 100 - 2 * padding;
  const graphHeight = 100 - 2 * padding;
  const originX = padding;
  const originY = 50;

  // Generate sine wave points
  const points = 60;
  const sinePoints = Array.from({ length: points }, (_, i) => {
    const x = originX + (i / (points - 1)) * graphWidth;
    const t = (i / (points - 1)) * Math.PI * 4; // 2 full periods
    const y = originY - Math.sin(t) * (graphHeight * 0.35);
    return { x, y };
  });

  // Create path from points
  const pathData = sinePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Grid lines
  const gridLines = {
    vertical: [25, 40, 55, 70, 85],
    horizontal: [25, 35, 50, 65, 75],
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={className}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox="0 0 100 100" style={{ display: 'block' }}>
        <defs>
          {/* Glow effect for the curve */}
          <filter id={`graph-glow-${size}`}>
            <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradient for curve */}
          <linearGradient id={`curve-gradient-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={SAPPHIRE[1]} />
            <stop offset="50%" stopColor={SAPPHIRE[2]} />
            <stop offset="100%" stopColor={SAPPHIRE[3]} />
          </linearGradient>

          {/* Mask for drawing animation */}
          <mask id={`draw-mask-${size}`}>
            <motion.rect
              x="0"
              y="0"
              width="0"
              height="100"
              fill="white"
              animate={{ width: [0, 100] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
                repeatDelay: 0.5,
              }}
            />
          </mask>
        </defs>

        {/* Grid lines - vertical */}
        {gridLines.vertical.map((x, i) => (
          <line
            key={`v-${i}`}
            x1={x}
            y1={padding}
            x2={x}
            y2={100 - padding}
            stroke={SAPPHIRE[0]}
            strokeWidth="0.3"
            opacity="0.3"
          />
        ))}

        {/* Grid lines - horizontal */}
        {gridLines.horizontal.map((y, i) => (
          <line
            key={`h-${i}`}
            x1={padding}
            y1={y}
            x2={100 - padding}
            y2={y}
            stroke={SAPPHIRE[0]}
            strokeWidth="0.3"
            opacity="0.3"
          />
        ))}

        {/* X-axis */}
        <line
          x1={originX}
          y1={originY}
          x2={100 - padding}
          y2={originY}
          stroke={SAPPHIRE[1]}
          strokeWidth="0.6"
        />

        {/* Y-axis */}
        <line
          x1={originX}
          y1={padding}
          x2={originX}
          y2={100 - padding}
          stroke={SAPPHIRE[1]}
          strokeWidth="0.6"
        />

        {/* Axis arrows */}
        <path d={`M ${100 - padding} ${originY} l -2 -1.5 l 0 3 Z`} fill={SAPPHIRE[1]} />
        <path d={`M ${originX} ${padding} l -1.5 2 l 3 0 Z`} fill={SAPPHIRE[1]} />

        {/* Animated sine curve */}
        <motion.path
          d={pathData}
          stroke={`url(#curve-gradient-${size})`}
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#graph-glow-${size})`}
          mask={`url(#draw-mask-${size})`}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatDelay: 0.5,
          }}
        />

        {/* Moving point along curve */}
        <motion.circle
          cx={originX}
          cy={originY}
          r="1.8"
          fill={SAPPHIRE[3]}
          filter={`url(#graph-glow-${size})`}
          animate={{
            cx: sinePoints.map(p => p.x),
            cy: sinePoints.map(p => p.y),
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatDelay: 0.5,
          }}
        />

        {/* Point trail */}
        <motion.circle
          cx={originX}
          cy={originY}
          r="2.5"
          fill="none"
          stroke={SAPPHIRE[3]}
          strokeWidth="0.5"
          opacity="0.6"
          animate={{
            cx: sinePoints.map(p => p.x),
            cy: sinePoints.map(p => p.y),
            scale: [1, 2, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatDelay: 0.5,
          }}
        />
      </svg>
    </div>
  );
}
