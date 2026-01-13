'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function MinecraftLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const blockSize = dim * 0.35;
  const pixelSize = blockSize / 8; // 8x8 pixel grid per block

  // Minecraft grass block colors
  const GRASS_TOP = '#6ba850';
  const DIRT = '#8b6f47';
  const GRASS_SIDE = '#8b6f47';
  const GRASS_OVERLAY = '#5ca03b';

  // Breaking stage particles (scattered pixel debris)
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i / 12) * Math.PI * 2,
    distance: 15 + Math.random() * 10,
    size: pixelSize * (0.5 + Math.random() * 0.5),
    delay: Math.random() * 0.3,
  }));

  return (
    <div
      role="status"
      aria-label="Loading"
      className={className}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`} style={{ display: 'block' }}>
        {/* Main grass block - pixelated isometric view */}
        <motion.g
          animate={{
            scale: [1, 0.95, 1, 0.9, 1],
            opacity: [1, 0.8, 1, 0.6, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Top face - grass texture */}
          <g transform={`translate(${dim / 2 - blockSize / 2}, ${dim / 2 - blockSize * 0.7})`}>
            {/* Base grass top */}
            <rect width={blockSize} height={blockSize * 0.5} fill={GRASS_TOP} />

            {/* Pixelated grass pattern */}
            {Array.from({ length: 8 }).map((_, row) =>
              Array.from({ length: 8 }).map((_, col) => {
                const isGrass = Math.random() > 0.4;
                if (!isGrass) return null;
                return (
                  <motion.rect
                    key={`top-${row}-${col}`}
                    x={col * pixelSize}
                    y={row * pixelSize * 0.5}
                    width={pixelSize}
                    height={pixelSize * 0.5}
                    fill={Math.random() > 0.5 ? GRASS_OVERLAY : GRASS_TOP}
                    opacity={0.6}
                    animate={{
                      opacity: [0.6, 0.8, 0.6],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: (row + col) * 0.05,
                    }}
                  />
                );
              })
            )}
          </g>

          {/* Left face - dirt with grass overlay */}
          <g transform={`translate(${dim / 2 - blockSize / 2}, ${dim / 2 - blockSize * 0.2})`}>
            <polygon
              points={`0,0 ${blockSize / 2},${blockSize * 0.25} ${blockSize / 2},${blockSize * 0.75} 0,${blockSize * 0.5}`}
              fill={DIRT}
            />
            {/* Grass side overlay - top strip */}
            <polygon
              points={`0,0 ${blockSize / 2},${blockSize * 0.25} ${blockSize / 2},${blockSize * 0.35} 0,${blockSize * 0.1}`}
              fill={GRASS_SIDE}
              opacity={0.7}
            />
          </g>

          {/* Right face - dirt with grass overlay */}
          <g transform={`translate(${dim / 2}, ${dim / 2 - blockSize * 0.2})`}>
            <polygon
              points={`0,0 ${blockSize / 2},${blockSize * 0.25} ${blockSize / 2},${blockSize * 0.75} 0,${blockSize * 0.5}`}
              fill={DIRT}
              opacity={0.9}
            />
            {/* Grass side overlay - top strip */}
            <polygon
              points={`0,0 ${blockSize / 2},${blockSize * 0.25} ${blockSize / 2},${blockSize * 0.35} 0,${blockSize * 0.1}`}
              fill={GRASS_SIDE}
              opacity={0.6}
            />
          </g>
        </motion.g>

        {/* Breaking overlay - crack pattern */}
        <motion.g
          opacity={0}
          animate={{
            opacity: [0, 0, 0.4, 0.7, 0, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Pixelated cracks */}
          {Array.from({ length: 16 }).map((_, i) => {
            const x = dim / 2 - blockSize / 2 + (i % 4) * (blockSize / 4);
            const y = dim / 2 - blockSize * 0.5 + Math.floor(i / 4) * (blockSize / 4);
            const isCrack = Math.random() > 0.6;
            if (!isCrack) return null;
            return (
              <rect
                key={`crack-${i}`}
                x={x}
                y={y}
                width={pixelSize}
                height={pixelSize}
                fill="#000"
                opacity={0.4}
              />
            );
          })}
        </motion.g>

        {/* Breaking particles - scattered debris */}
        {particles.map(particle => {
          const x = dim / 2 + Math.cos(particle.angle) * particle.distance;
          const y = dim / 2 + Math.sin(particle.angle) * particle.distance;

          return (
            <motion.rect
              key={particle.id}
              x={x}
              y={y}
              width={particle.size}
              height={particle.size}
              fill={particle.id % 3 === 0 ? GRASS_TOP : DIRT}
              opacity={0}
              animate={{
                opacity: [0, 0, 0, 0.8, 0],
                scale: [1, 1, 1, 1.5, 0.5],
                x: [x, x, x, x + Math.cos(particle.angle) * 5, x + Math.cos(particle.angle) * 10],
                y: [y, y, y, y + Math.sin(particle.angle) * 5, y + Math.sin(particle.angle) * 10],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
                delay: particle.delay,
              }}
            />
          );
        })}

        {/* Pickaxe swing indicator - sapphire colored */}
        <motion.g
          animate={{
            rotate: [0, 0, -25, 25, 0, 0],
            x: [0, 0, -5, 5, 0, 0],
            y: [0, 0, -3, -3, 0, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            originX: `${dim / 2}px`,
            originY: `${dim / 2}px`,
          }}
        >
          <motion.path
            d={`M ${dim / 2 + blockSize * 0.6} ${dim / 2 - blockSize * 0.6}
                L ${dim / 2 + blockSize * 0.7} ${dim / 2 - blockSize * 0.5}
                L ${dim / 2 + blockSize * 0.5} ${dim / 2 - blockSize * 0.3}
                L ${dim / 2 + blockSize * 0.4} ${dim / 2 - blockSize * 0.4} Z`}
            fill={SAPPHIRE[2]}
            opacity={0}
            animate={{
              opacity: [0, 0, 0.7, 0.7, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        </motion.g>
      </svg>
    </div>
  );
}
