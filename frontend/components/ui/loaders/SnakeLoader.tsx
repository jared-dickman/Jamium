'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function SnakeLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const gridSize = 12; // 12x12 grid
  const cellSize = (dim * 0.85) / gridSize;

  // Define snake path coordinates (x, y on 12x12 grid)
  const snakePath = [
    // Top row right
    [6, 2],
    [7, 2],
    [8, 2],
    [9, 2],
    // Down
    [9, 3],
    [9, 4],
    [9, 5],
    [9, 6],
    // Left across middle
    [8, 6],
    [7, 6],
    [6, 6],
    [5, 6],
    [4, 6],
    [3, 6],
    // Down
    [3, 7],
    [3, 8],
    [3, 9],
    // Right across bottom
    [4, 9],
    [5, 9],
    [6, 9],
    [7, 9],
    [8, 9],
    // Up
    [8, 8],
    [8, 7],
    // Left
    [7, 7],
    [6, 7],
    // Up to center
    [6, 6],
    [6, 5],
    [6, 4],
    [6, 3],
    // Left across top
    [5, 3],
    [4, 3],
    [3, 3],
    [2, 3],
  ];

  const foodPositions = [
    [10, 5],
    [2, 8],
    [5, 2],
    [9, 9],
  ];

  const snakeLength = 8; // visible segments

  return (
    <div
      role="status"
      aria-label="Loading"
      className={className}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`} style={{ display: 'block' }}>
        {/* Food dots */}
        {foodPositions.map((pos, idx) => (
          <motion.circle
            key={`food-${idx}`}
            cx={pos[0]! * cellSize + cellSize / 2}
            cy={pos[1]! * cellSize + cellSize / 2}
            r={cellSize * 0.25}
            fill={SAPPHIRE[3]}
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: idx * 0.3,
            }}
          />
        ))}

        {/* Snake segments */}
        {Array.from({ length: snakeLength }).map((_, segmentIdx) => (
          <motion.rect
            key={`segment-${segmentIdx}`}
            width={cellSize * 0.9}
            height={cellSize * 0.9}
            rx={cellSize * 0.15}
            fill={
              segmentIdx === 0 ? SAPPHIRE[0] : SAPPHIRE[Math.min(3, Math.floor(segmentIdx / 2) + 1)]
            }
            animate={{
              x: snakePath.map(p => p[0]! * cellSize + cellSize * 0.05),
              y: snakePath.map(p => p[1]! * cellSize + cellSize * 0.05),
            }}
            transition={{
              duration: snakePath.length * 0.15,
              repeat: Infinity,
              ease: 'linear',
              delay: segmentIdx * 0.15,
            }}
            style={{
              filter: segmentIdx === 0 ? 'drop-shadow(0 0 4px rgba(30, 64, 175, 0.6))' : undefined,
            }}
          />
        ))}

        {/* Snake head eyes */}
        <motion.g
          animate={{
            x: snakePath.map(p => p[0]! * cellSize),
            y: snakePath.map(p => p[1]! * cellSize),
          }}
          transition={{
            duration: snakePath.length * 0.15,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <circle cx={cellSize * 0.35} cy={cellSize * 0.35} r={cellSize * 0.08} fill="white" />
          <circle cx={cellSize * 0.65} cy={cellSize * 0.35} r={cellSize * 0.08} fill="white" />
        </motion.g>

        {/* Grid overlay for retro feel */}
        {Array.from({ length: gridSize + 1 }).map((_, i) => (
          <g key={`grid-${i}`}>
            <line
              x1={i * cellSize}
              y1={0}
              x2={i * cellSize}
              y2={dim * 0.85}
              stroke={SAPPHIRE[0]}
              strokeWidth={0.3}
              opacity={0.15}
            />
            <line
              x1={0}
              y1={i * cellSize}
              x2={dim * 0.85}
              y2={i * cellSize}
              stroke={SAPPHIRE[0]}
              strokeWidth={0.3}
              opacity={0.15}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
