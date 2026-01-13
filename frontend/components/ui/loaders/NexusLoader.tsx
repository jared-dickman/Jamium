'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

// Extended color palette for diverse blocks
const NEXUS_COLORS = [
  ...SAPPHIRE,
  '#ef4444', // red
  '#f59e0b', // amber
  '#10b981', // emerald
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
] as const;

type ShapeType = 'square' | 'circle' | 'triangle';

interface Block {
  id: number;
  x: number;
  shape: ShapeType;
  size: number;
  color: string;
  speed: number; // Parallax depth - slower = further away
  rotation: number;
  rotationSpeed: number;
  delay: number;
}

export function NexusLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];

  // Generate diverse falling blocks with parallax
  const blocks: Block[] = Array.from({ length: 12 }, (_, i) => {
    const shapes: ShapeType[] = ['square', 'circle', 'triangle'];
    const shapeIndex = Math.floor(Math.random() * shapes.length);
    const colorIndex = Math.floor(Math.random() * NEXUS_COLORS.length);

    return {
      id: i,
      x: Math.random() * 90 + 5, // Keep within bounds
      shape: shapes[shapeIndex % shapes.length] as ShapeType,
      size: 4 + Math.random() * 6, // Varied sizes
      color: NEXUS_COLORS[colorIndex % NEXUS_COLORS.length] as string,
      speed: 3 + Math.random() * 4, // 3-7s for parallax effect
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 180, // -90 to +90 degrees
      delay: Math.random() * 3, // Stagger starts
    };
  });

  const renderShape = (block: Block) => {
    const { shape, size, color } = block;

    switch (shape) {
      case 'square':
        return (
          <rect
            x={-size / 2}
            y={-size / 2}
            width={size}
            height={size}
            fill={color}
            opacity={0.85}
          />
        );
      case 'circle':
        return <circle r={size / 2} fill={color} opacity={0.85} />;
      case 'triangle':
        const h = size * 0.866; // Height of equilateral triangle
        return (
          <polygon
            points={`0,${-h / 2} ${size / 2},${h / 2} ${-size / 2},${h / 2}`}
            fill={color}
            opacity={0.85}
          />
        );
    }
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
          {/* Subtle glow for depth */}
          <filter id={`nexus-glow-${size}`}>
            <feGaussianBlur stdDeviation="0.3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {blocks.map(block => (
          <motion.g
            key={block.id}
            filter={`url(#nexus-glow-${size})`}
            initial={{
              x: block.x,
              y: -15, // Start above viewport
              rotate: block.rotation,
            }}
            animate={{
              y: [-15, 115], // Fall through viewport
              rotate: [block.rotation, block.rotation + block.rotationSpeed],
            }}
            transition={{
              duration: block.speed,
              repeat: Infinity,
              ease: 'linear',
              delay: block.delay,
            }}
          >
            {renderShape(block)}
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
