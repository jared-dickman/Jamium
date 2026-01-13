'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function FractalLoader({ size = 'md' }: LoaderProps) {
  const dimension = LOADER_SIZE[size];
  const containerSize = dimension * 0.8;
  const centerX = dimension / 2;
  const centerY = dimension / 2;

  const drawFractalTree = (
    x: number,
    y: number,
    angle: number,
    depth: number,
    length: number,
    key: string = '0'
  ): React.JSX.Element[] => {
    if (depth === 0) return [];

    const x2 = x + length * Math.cos(angle);
    const y2 = y + length * Math.sin(angle);

    const elements: React.JSX.Element[] = [
      <motion.line
        key={key}
        x1={x}
        y1={y}
        x2={x2}
        y2={y2}
        stroke={SAPPHIRE[depth % SAPPHIRE.length]}
        strokeWidth={Math.max(1, dimension * 0.008 * depth)}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: [0, 1, 0.8],
          opacity: [0, 0.9, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: (6 - depth) * 0.15,
          ease: 'easeInOut',
        }}
      />,
    ];

    const newLength = length * 0.7;
    const angleVariation = Math.PI / 5;

    return [
      ...elements,
      ...drawFractalTree(x2, y2, angle - angleVariation, depth - 1, newLength, `${key}-l`),
      ...drawFractalTree(x2, y2, angle + angleVariation, depth - 1, newLength, `${key}-r`),
    ];
  };

  const treeDepth = 6;
  const baseLength = containerSize * 0.18;
  const startY = centerY + containerSize * 0.3;

  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex items-center justify-center"
      style={{ width: dimension, height: dimension }}
    >
      <svg
        width={dimension}
        height={dimension}
        viewBox={`0 0 ${dimension} ${dimension}`}
        style={{ overflow: 'visible' }}
      >
        <g transform={`translate(${centerX}, ${centerY})`}>
          <motion.g
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {drawFractalTree(0, startY - centerY, -Math.PI / 2, treeDepth, baseLength)}
          </motion.g>

          {/* Central pulsing core */}
          <motion.circle
            cx={0}
            cy={0}
            r={dimension * 0.05}
            fill={SAPPHIRE[2]}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.circle
            cx={0}
            cy={0}
            r={dimension * 0.035}
            fill={SAPPHIRE[3]}
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.7, 0.9, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </g>
      </svg>
    </div>
  );
}
