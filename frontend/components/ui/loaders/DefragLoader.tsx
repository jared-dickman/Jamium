'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function DefragLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const gridSize = 8; // 8x8 grid of squares
  const squareSize = (dim * 0.8) / gridSize;
  const gap = squareSize * 0.1;
  const actualSquareSize = squareSize - gap;

  // Generate grid positions
  const squares = Array.from({ length: gridSize * gridSize }, (_, i) => {
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;
    return {
      id: i,
      x: col * squareSize + gap / 2,
      y: row * squareSize + gap / 2,
      row,
      col,
    };
  });

  return (
    <div
      role="status"
      aria-label="Loading"
      className={className}
      style={{ width: dim, height: dim }}
    >
      <svg
        width={dim * 0.8}
        height={dim * 0.8}
        viewBox={`0 0 ${dim * 0.8} ${dim * 0.8}`}
        style={{ display: 'block', margin: `${dim * 0.1}px` }}
      >
        {squares.map(square => {
          // Diagonal wave pattern
          const diagonalIndex = square.row + square.col;
          const delay = diagonalIndex * 0.08;

          // Determine color pattern - some squares are "fragmented"
          const isFragmented = (square.row + square.col) % 3 !== 0;
          const colorIndex = isFragmented ? 0 : Math.min(3, Math.floor(diagonalIndex / 4) % 4);

          return (
            <motion.rect
              key={square.id}
              x={square.x}
              y={square.y}
              width={actualSquareSize}
              height={actualSquareSize}
              rx={1}
              fill={SAPPHIRE[colorIndex]}
              animate={{
                opacity: [0.3, 0.6, 0.9, 0.6, 0.3],
                scale: isFragmented ? [1, 0.95, 1] : [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay,
              }}
              style={{
                originX: `${square.x + actualSquareSize / 2}px`,
                originY: `${square.y + actualSquareSize / 2}px`,
              }}
            />
          );
        })}

        {/* Progress sweep overlay */}
        <motion.rect
          x={0}
          y={0}
          width={dim * 0.8}
          height={dim * 0.8}
          fill="url(#defrag-sweep)"
          initial={{ x: -(dim * 0.8) }}
          animate={{ x: [-(dim * 0.8), dim * 0.8] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
            repeatDelay: 0.5,
          }}
        />

        <defs>
          <linearGradient id="defrag-sweep" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={SAPPHIRE[3]} stopOpacity="0" />
            <stop offset="50%" stopColor={SAPPHIRE[3]} stopOpacity="0.3" />
            <stop offset="100%" stopColor={SAPPHIRE[3]} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
