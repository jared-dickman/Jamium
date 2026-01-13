'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function LatticeLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const gridSize = size === 'sm' ? 4 : size === 'md' ? 5 : 6;
  const spacing = dim / (gridSize + 1);

  const nodes: { x: number; y: number; row: number; col: number }[] = [];
  for (let row = 1; row <= gridSize; row++) {
    for (let col = 1; col <= gridSize; col++) {
      nodes.push({
        x: col * spacing,
        y: row * spacing,
        row,
        col,
      });
    }
  }

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        {/* Horizontal grid lines */}
        {Array.from({ length: gridSize }, (_, i) => (
          <motion.line
            key={`h-${i}`}
            x1={spacing}
            y1={(i + 1) * spacing}
            x2={dim - spacing}
            y2={(i + 1) * spacing}
            stroke={SAPPHIRE[1]}
            strokeWidth={0.8}
            strokeLinecap="round"
            animate={{
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3,
              delay: i * 0.1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Vertical grid lines */}
        {Array.from({ length: gridSize }, (_, i) => (
          <motion.line
            key={`v-${i}`}
            x1={(i + 1) * spacing}
            y1={spacing}
            x2={(i + 1) * spacing}
            y2={dim - spacing}
            stroke={SAPPHIRE[1]}
            strokeWidth={0.8}
            strokeLinecap="round"
            animate={{
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3,
              delay: i * 0.1 + 0.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Diagonal connections (creating diamond patterns) */}
        {nodes.map((node, i) => {
          const adjacentNodes = nodes.filter(
            n => Math.abs(n.row - node.row) === 1 && Math.abs(n.col - node.col) === 1
          );
          return adjacentNodes.map((adj, j) => (
            <motion.line
              key={`diag-${i}-${j}`}
              x1={node.x}
              y1={node.y}
              x2={adj.x}
              y2={adj.y}
              stroke={SAPPHIRE[2]}
              strokeWidth={0.5}
              strokeLinecap="round"
              animate={{
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 4,
                delay: (node.row + node.col + j) * 0.08,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ));
        })}

        {/* Intersection nodes */}
        {nodes.map((node, i) => {
          const waveDelay = (node.row + node.col) * 0.1;
          return (
            <motion.circle
              key={i}
              cx={node.x}
              cy={node.y}
              r={2.5}
              fill={SAPPHIRE[(node.row + node.col) % 4]}
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2.5,
                delay: waveDelay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          );
        })}

        {/* Outer corner markers */}
        {[
          { x: spacing, y: spacing },
          { x: dim - spacing, y: spacing },
          { x: dim - spacing, y: dim - spacing },
          { x: spacing, y: dim - spacing },
        ].map((corner, i) => (
          <motion.circle
            key={`corner-${i}`}
            cx={corner.x}
            cy={corner.y}
            r={3}
            fill={SAPPHIRE[3]}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 3,
              delay: i * 0.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>
    </div>
  );
}
