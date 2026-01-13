'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function CircuitLoader({ size = 'md' }: LoaderProps) {
  const dimension = LOADER_SIZE[size];
  const center = dimension / 2;

  // Circuit board traces - complex paths
  const traces = [
    {
      d: `M ${dimension * 0.1} ${center} L ${dimension * 0.4} ${center} L ${dimension * 0.4} ${dimension * 0.25} L ${dimension * 0.6} ${dimension * 0.25}`,
      delay: 0,
    },
    {
      d: `M ${dimension * 0.9} ${center} L ${dimension * 0.6} ${center} L ${dimension * 0.6} ${dimension * 0.75} L ${dimension * 0.4} ${dimension * 0.75}`,
      delay: 0.3,
    },
    {
      d: `M ${center} ${dimension * 0.1} L ${center} ${dimension * 0.3} L ${dimension * 0.75} ${dimension * 0.3} L ${dimension * 0.75} ${center}`,
      delay: 0.6,
    },
    {
      d: `M ${center} ${dimension * 0.9} L ${center} ${dimension * 0.7} L ${dimension * 0.25} ${dimension * 0.7} L ${dimension * 0.25} ${center}`,
      delay: 0.9,
    },
  ];

  // Connection nodes at intersections
  const nodes = [
    { cx: dimension * 0.4, cy: center },
    { cx: dimension * 0.6, cy: center },
    { cx: dimension * 0.4, cy: dimension * 0.25 },
    { cx: dimension * 0.6, cy: dimension * 0.25 },
    { cx: dimension * 0.4, cy: dimension * 0.75 },
    { cx: dimension * 0.6, cy: dimension * 0.75 },
    { cx: center, cy: dimension * 0.3 },
    { cx: center, cy: dimension * 0.7 },
    { cx: dimension * 0.75, cy: dimension * 0.3 },
    { cx: dimension * 0.25, cy: dimension * 0.7 },
  ];

  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex items-center justify-center"
      style={{ width: dimension, height: dimension }}
    >
      <svg width={dimension} height={dimension} viewBox={`0 0 ${dimension} ${dimension}`}>
        <defs>
          <linearGradient id="circuit-trace" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={SAPPHIRE[1]} stopOpacity="0.3" />
            <stop offset="100%" stopColor={SAPPHIRE[2]} stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="circuit-signal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={SAPPHIRE[2]} />
            <stop offset="50%" stopColor={SAPPHIRE[3]} />
            <stop offset="100%" stopColor={SAPPHIRE[2]} />
          </linearGradient>
        </defs>

        {/* Static circuit traces */}
        {traces.map((trace, i) => (
          <path
            key={`trace-${i}`}
            d={trace.d}
            stroke="url(#circuit-trace)"
            strokeWidth={dimension * 0.03}
            fill="none"
            strokeLinecap="square"
          />
        ))}

        {/* Animated signals flowing through traces */}
        {traces.map((trace, i) => (
          <motion.path
            key={`signal-${i}`}
            d={trace.d}
            stroke="url(#circuit-signal)"
            strokeWidth={dimension * 0.025}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${dimension * 0.15} ${dimension * 2}`}
            animate={{
              strokeDashoffset: [0, -dimension * 2.15],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: trace.delay,
              ease: 'linear',
            }}
          />
        ))}

        {/* Connection nodes */}
        {nodes.map((node, i) => (
          <motion.circle
            key={`node-${i}`}
            cx={node.cx}
            cy={node.cy}
            r={dimension * 0.025}
            fill={SAPPHIRE[0]}
            stroke={SAPPHIRE[3]}
            strokeWidth={dimension * 0.01}
            animate={{
              fill: [SAPPHIRE[0], SAPPHIRE[2], SAPPHIRE[0]],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}

        {/* Central processor node */}
        <motion.circle
          cx={center}
          cy={center}
          r={dimension * 0.06}
          fill={SAPPHIRE[0]}
          stroke={SAPPHIRE[2]}
          strokeWidth={dimension * 0.015}
          animate={{
            stroke: [SAPPHIRE[2], SAPPHIRE[3], SAPPHIRE[2]],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />

        {/* Corner nodes */}
        {[
          { x: dimension * 0.1, y: center },
          { x: dimension * 0.9, y: center },
          { x: center, y: dimension * 0.1 },
          { x: center, y: dimension * 0.9 },
        ].map((corner, i) => (
          <motion.rect
            key={`corner-${i}`}
            x={corner.x - dimension * 0.02}
            y={corner.y - dimension * 0.02}
            width={dimension * 0.04}
            height={dimension * 0.04}
            fill={SAPPHIRE[1]}
            stroke={SAPPHIRE[3]}
            strokeWidth={dimension * 0.008}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
