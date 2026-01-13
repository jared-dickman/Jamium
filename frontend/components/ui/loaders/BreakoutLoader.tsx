'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function BreakoutLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const brickWidth = dim * 0.15;
  const brickHeight = dim * 0.08;
  const paddleWidth = dim * 0.25;
  const paddleHeight = dim * 0.06;
  const ballSize = dim * 0.06;

  // Generate brick grid
  const bricks = [];
  const rows = 3;
  const cols = 4;
  const spacing = dim * 0.02;
  const startX = (dim - (cols * brickWidth + (cols - 1) * spacing)) / 2;
  const startY = dim * 0.15;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      bricks.push({
        x: startX + col * (brickWidth + spacing),
        y: startY + row * (brickHeight + spacing),
        delay: (row * cols + col) * 0.3,
        color: SAPPHIRE[row % SAPPHIRE.length],
      });
    }
  }

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
        {/* Bricks */}
        {bricks.map((brick, i) => (
          <motion.rect
            key={i}
            x={brick.x}
            y={brick.y}
            width={brickWidth}
            height={brickHeight}
            rx={dim * 0.01}
            fill={brick.color}
            animate={{
              opacity: [1, 0.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: brick.delay,
            }}
          />
        ))}

        {/* Ball bouncing */}
        <motion.circle
          cx={dim / 2}
          cy={dim / 2}
          r={ballSize}
          fill={SAPPHIRE[3]}
          animate={{
            y: [dim * 0.2, dim * 0.7, dim * 0.2],
            x: [dim * 0.3, dim * 0.7, dim * 0.3],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Paddle moving side to side */}
        <motion.rect
          x={dim / 2 - paddleWidth / 2}
          y={dim * 0.8}
          width={paddleWidth}
          height={paddleHeight}
          rx={paddleHeight / 2}
          fill={SAPPHIRE[2]}
          animate={{
            x: [dim * 0.15, dim * 0.6, dim * 0.15],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </svg>
    </div>
  );
}
