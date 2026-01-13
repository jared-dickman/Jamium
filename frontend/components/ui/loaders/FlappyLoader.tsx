'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function FlappyLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const center = dim / 2;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={className}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`} style={{ display: 'block' }}>
        {/* Scrolling pipes (background) */}
        {Array.from({ length: 2 }).map((_, i) => {
          const pipeWidth = dim * 0.15;
          const gap = dim * 0.35;
          const topHeight = dim * 0.25 + (i % 2) * dim * 0.1;
          const bottomHeight = dim * 0.25 + ((i + 1) % 2) * dim * 0.1;
          const startX = dim * 1.2 + i * (dim * 0.8);

          return (
            <motion.g
              key={i}
              animate={{
                x: [startX, -pipeWidth],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 1.5,
              }}
            >
              {/* Top pipe */}
              <rect
                x={0}
                y={0}
                width={pipeWidth}
                height={topHeight}
                fill={SAPPHIRE[1]}
                opacity={0.6}
                rx={dim * 0.015}
              />
              <rect
                x={-pipeWidth * 0.1}
                y={topHeight - dim * 0.04}
                width={pipeWidth * 1.2}
                height={dim * 0.04}
                fill={SAPPHIRE[0]}
                opacity={0.7}
                rx={dim * 0.01}
              />

              {/* Bottom pipe */}
              <rect
                x={0}
                y={topHeight + gap}
                width={pipeWidth}
                height={bottomHeight}
                fill={SAPPHIRE[1]}
                opacity={0.6}
                rx={dim * 0.015}
              />
              <rect
                x={-pipeWidth * 0.1}
                y={topHeight + gap}
                width={pipeWidth * 1.2}
                height={dim * 0.04}
                fill={SAPPHIRE[0]}
                opacity={0.7}
                rx={dim * 0.01}
              />
            </motion.g>
          );
        })}

        {/* Flappy bird */}
        <motion.g
          animate={{
            y: [center - dim * 0.1, center + dim * 0.1, center - dim * 0.1],
            rotate: [5, -15, 5],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Bird body */}
          <motion.circle cx={center - dim * 0.1} cy={center} r={dim * 0.1} fill={SAPPHIRE[2]} />

          {/* Bird eye */}
          <circle cx={center - dim * 0.05} cy={center - dim * 0.02} r={dim * 0.02} fill="#ffffff" />
          <circle cx={center - dim * 0.04} cy={center - dim * 0.02} r={dim * 0.01} fill="#000000" />

          {/* Bird beak */}
          <motion.path
            d={`M${center - dim * 0.02} ${center} L${center + dim * 0.04} ${center - dim * 0.01} L${center + dim * 0.04} ${center + dim * 0.01} Z`}
            fill={SAPPHIRE[1]}
            animate={{
              scaleX: [1, 0.9, 1],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Bird wing (flapping) */}
          <motion.ellipse
            cx={center - dim * 0.12}
            cy={center + dim * 0.03}
            rx={dim * 0.08}
            ry={dim * 0.05}
            fill={SAPPHIRE[3]}
            animate={{
              ry: [dim * 0.05, dim * 0.08, dim * 0.05],
              rotate: [0, -20, 0],
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Bird tail */}
          <motion.path
            d={`M${center - dim * 0.18} ${center - dim * 0.02} L${center - dim * 0.24} ${center - dim * 0.06} L${center - dim * 0.2} ${center} L${center - dim * 0.24} ${center + dim * 0.06} Z`}
            fill={SAPPHIRE[2]}
            opacity={0.8}
          />
        </motion.g>

        {/* Flap effect particles */}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.circle
            key={`flap-${i}`}
            r={dim * 0.015}
            fill={SAPPHIRE[3]}
            animate={{
              cx: [center - dim * 0.2, center - dim * 0.35],
              cy: [center + dim * 0.03 + i * dim * 0.02, center + dim * 0.05 + i * dim * 0.03],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: 'easeOut',
              delay: i * 0.1,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
