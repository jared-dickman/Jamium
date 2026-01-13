'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function CrystalLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const unitSize = dim * 0.18;
  const spacing = unitSize * 1.1;
  const startX = dim / 2 - spacing;
  const startY = dim / 2 - spacing;

  // Crystal lattice pattern - center out growth
  const lattice = [
    { x: 1, y: 1, delay: 0, ring: 0 },
    { x: 0, y: 1, delay: 0.05, ring: 1 },
    { x: 1, y: 0, delay: 0.05, ring: 1 },
    { x: 2, y: 1, delay: 0.05, ring: 1 },
    { x: 1, y: 2, delay: 0.05, ring: 1 },
    { x: 0, y: 0, delay: 0.1, ring: 2 },
    { x: 2, y: 0, delay: 0.1, ring: 2 },
    { x: 0, y: 2, delay: 0.1, ring: 2 },
    { x: 2, y: 2, delay: 0.1, ring: 2 },
  ];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        {/* Connection lines */}
        {lattice.map((node, i) => {
          const x = startX + node.x * spacing;
          const y = startY + node.y * spacing;

          return lattice
            .filter(other => {
              const dx = Math.abs(other.x - node.x);
              const dy = Math.abs(other.y - node.y);
              return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
            })
            .map((other, j) => {
              const x2 = startX + other.x * spacing;
              const y2 = startY + other.y * spacing;

              return (
                <motion.line
                  key={`line-${i}-${j}`}
                  x1={x}
                  y1={y}
                  x2={x2}
                  y2={y2}
                  stroke={SAPPHIRE[3]}
                  strokeWidth="1"
                  opacity="0.3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: node.delay + 0.2,
                    ease: 'easeOut',
                  }}
                />
              );
            });
        })}

        {/* Crystal nodes */}
        {lattice.map((node, i) => {
          const x = startX + node.x * spacing;
          const y = startY + node.y * spacing;

          return (
            <g key={i}>
              {/* Outer glow */}
              <motion.circle
                cx={x}
                cy={y}
                r={unitSize * 0.6}
                fill="none"
                stroke={SAPPHIRE[node.ring % 4]}
                strokeWidth="1"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.2, 1],
                  opacity: [0, 0.4, 0.2],
                }}
                transition={{
                  duration: 0.6,
                  delay: node.delay,
                  ease: 'easeOut',
                }}
                style={{ originX: `${x}px`, originY: `${y}px` }}
              />

              {/* Crystal facet */}
              <motion.rect
                x={x - unitSize / 2}
                y={y - unitSize / 2}
                width={unitSize}
                height={unitSize}
                fill={SAPPHIRE[node.ring % 4]}
                stroke={SAPPHIRE[0]}
                strokeWidth="1"
                rx="2"
                initial={{ scale: 0, rotate: -45, opacity: 0 }}
                animate={{
                  scale: [0, 1.1, 1],
                  rotate: [-45, 0, 0],
                  opacity: [0, 1, 1],
                }}
                transition={{
                  duration: 0.5,
                  delay: node.delay,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                style={{ originX: `${x}px`, originY: `${y}px` }}
              />
            </g>
          );
        })}

        {/* Shimmer effect */}
        <motion.path
          d={`M ${dim * 0.2} ${dim * 0.2} L ${dim * 0.8} ${dim * 0.8}`}
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 1],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 1,
            ease: 'easeInOut',
          }}
        />
      </svg>
    </div>
  );
}
