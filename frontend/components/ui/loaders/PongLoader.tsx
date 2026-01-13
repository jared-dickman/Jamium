'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function PongLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const paddleW = dim * 0.05;
  const paddleH = dim * 0.28;
  const ballSize = dim * 0.06;

  // Ball path positions with bounce timing
  const ballX = [dim * 0.15, dim * 0.45, dim * 0.75, dim * 0.45, dim * 0.15];
  const ballY = [dim * 0.35, dim * 0.25, dim * 0.55, dim * 0.65, dim * 0.35];

  // Paddle tracking positions (follow ball's Y)
  const leftPaddleY = [dim * 0.21, dim * 0.11, dim * 0.41, dim * 0.51, dim * 0.21];
  const rightPaddleY = [dim * 0.41, dim * 0.51, dim * 0.41, dim * 0.31, dim * 0.41];

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
          <filter id={`pong-glow-${size}`}>
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Center dotted line */}
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.rect
            key={i}
            x={dim / 2 - dim * 0.008}
            y={dim * 0.05 + i * dim * 0.105}
            width={dim * 0.016}
            height={dim * 0.05}
            fill={SAPPHIRE[3]}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Left paddle with glow */}
        <motion.rect
          x={dim * 0.08}
          width={paddleW}
          height={paddleH}
          rx={paddleW / 2}
          fill={SAPPHIRE[1]}
          filter={`url(#pong-glow-${size})`}
          animate={{ y: leftPaddleY }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: [0.45, 0.05, 0.55, 0.95], // Custom easing for paddle tracking
          }}
        />

        {/* Right paddle with glow */}
        <motion.rect
          x={dim * 0.87}
          width={paddleW}
          height={paddleH}
          rx={paddleW / 2}
          fill={SAPPHIRE[1]}
          filter={`url(#pong-glow-${size})`}
          animate={{ y: rightPaddleY }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: [0.45, 0.05, 0.55, 0.95],
          }}
        />

        {/* Ball trail effect */}
        {[0, 1, 2].map(i => (
          <motion.circle
            key={`trail-${i}`}
            r={ballSize / 2}
            fill={SAPPHIRE[2]}
            animate={{
              cx: ballX,
              cy: ballY,
              opacity: [0.3, 0.2, 0.1],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: -i * 0.08,
              ease: 'linear',
            }}
          />
        ))}

        {/* Ball with glow */}
        <motion.circle
          r={ballSize / 2}
          fill={SAPPHIRE[3]}
          filter={`url(#pong-glow-${size})`}
          animate={{
            cx: ballX,
            cy: ballY,
            scale: [1, 1.15, 1, 1.15, 1], // Slight squash on bounce
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </svg>
    </div>
  );
}
