'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function SierpinskiLoader({ size = 'md' }: LoaderProps) {
  const dimension = LOADER_SIZE[size];
  const containerSize = dimension * 0.75;
  const centerX = dimension / 2;
  const centerY = dimension / 2;

  // Generate Sierpinski triangle points recursively
  const generateSierpinski = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    depth: number,
    maxDepth: number
  ): Array<{ points: string; depth: number; center: { x: number; y: number } }> => {
    if (depth >= maxDepth) {
      const cx = (x1 + x2 + x3) / 3;
      const cy = (y1 + y2 + y3) / 3;
      return [
        {
          points: `${x1},${y1} ${x2},${y2} ${x3},${y3}`,
          depth,
          center: { x: cx, y: cy },
        },
      ];
    }

    // Calculate midpoints
    const mx12 = (x1 + x2) / 2;
    const my12 = (y1 + y2) / 2;
    const mx23 = (x2 + x3) / 2;
    const my23 = (y2 + y3) / 2;
    const mx31 = (x3 + x1) / 2;
    const my31 = (y3 + y1) / 2;

    // Recurse on three smaller triangles
    return [
      ...generateSierpinski(x1, y1, mx12, my12, mx31, my31, depth + 1, maxDepth),
      ...generateSierpinski(mx12, my12, x2, y2, mx23, my23, depth + 1, maxDepth),
      ...generateSierpinski(mx31, my31, mx23, my23, x3, y3, depth + 1, maxDepth),
    ];
  };

  // Create main triangle vertices (equilateral)
  const height = (containerSize * Math.sqrt(3)) / 2;
  const top = { x: containerSize / 2, y: (containerSize - height) / 2 };
  const bottomLeft = { x: 0, y: (containerSize + height) / 2 };
  const bottomRight = { x: containerSize, y: (containerSize + height) / 2 };

  // Generate triangles at multiple depths for animation layers
  const depths = [2, 3, 4, 5];

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
        <defs>
          <radialGradient id={`sierpinski-glow-${size}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={SAPPHIRE[3]} stopOpacity="0.7" />
            <stop offset="50%" stopColor={SAPPHIRE[2]} stopOpacity="0.4" />
            <stop offset="100%" stopColor={SAPPHIRE[0]} stopOpacity="0" />
          </radialGradient>

          {/* Triangle gradient */}
          <linearGradient id={`sierpinski-fill-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            {SAPPHIRE.map((color, i) => (
              <stop key={i} offset={`${(i / (SAPPHIRE.length - 1)) * 100}%`} stopColor={color} />
            ))}
          </linearGradient>
        </defs>

        <g transform={`translate(${centerX - containerSize / 2}, ${centerY - containerSize / 2})`}>
          {/* Pulsing background */}
          <motion.circle
            cx={containerSize / 2}
            cy={containerSize / 2}
            r={containerSize / 1.8}
            fill={`url(#sierpinski-glow-${size})`}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Animated recursive triangle layers */}
          {depths.map((maxDepth, layerIndex) => {
            const triangles = generateSierpinski(
              top.x,
              top.y,
              bottomLeft.x,
              bottomLeft.y,
              bottomRight.x,
              bottomRight.y,
              0,
              maxDepth
            );
            const layerDelay = layerIndex * 0.5;
            const layerOpacity = 0.8 - layerIndex * 0.15;

            return (
              <motion.g
                key={maxDepth}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, layerOpacity, layerOpacity, 0],
                  scale: [0.85, 1, 1.05, 1.1],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  delay: layerDelay,
                  times: [0, 0.2, 0.8, 1],
                  ease: 'easeInOut',
                }}
              >
                {triangles.map((triangle, index) => {
                  const colorIndex = Math.min(
                    SAPPHIRE.length - 1,
                    Math.floor((triangle.depth / maxDepth) * SAPPHIRE.length)
                  );

                  // Calculate distance from center for wave effect
                  const dx = triangle.center.x - containerSize / 2;
                  const dy = triangle.center.y - containerSize / 2;
                  const distance = Math.sqrt(dx * dx + dy * dy);
                  const normalizedDistance = distance / (containerSize / 2);

                  return (
                    <motion.polygon
                      key={index}
                      points={triangle.points}
                      fill={SAPPHIRE[colorIndex]}
                      stroke={SAPPHIRE[Math.min(colorIndex + 1, SAPPHIRE.length - 1)]}
                      strokeWidth={0.5}
                      strokeOpacity={0.6}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 0.9, 0.7],
                        scale: [0, 1.1, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: layerDelay + normalizedDistance * 0.6,
                        ease: 'easeInOut',
                      }}
                      style={{
                        filter: `drop-shadow(0 0 ${dimension * 0.015}px ${SAPPHIRE[colorIndex]})`,
                        transformOrigin: `${triangle.center.x}px ${triangle.center.y}px`,
                      }}
                    />
                  );
                })}
              </motion.g>
            );
          })}

          {/* Main triangle outline - pulses to show structure */}
          <motion.polygon
            points={`${top.x},${top.y} ${bottomLeft.x},${bottomLeft.y} ${bottomRight.x},${bottomRight.y}`}
            fill="none"
            stroke={SAPPHIRE[3]}
            strokeWidth={2}
            strokeOpacity={0.6}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              transformOrigin: `${containerSize / 2}px ${containerSize / 2}px`,
            }}
          />

          {/* Recursive subdivision lines */}
          {[0.33, 0.5, 0.67].map((ratio, i) => {
            const h = height * ratio;
            const y = (containerSize - height) / 2 + (height - h) / 2;
            const x1 = containerSize / 2 - (containerSize * ratio) / 2;
            const x2 = containerSize / 2 + (containerSize * ratio) / 2;
            const topY = (containerSize - height) / 2 + (1 - ratio) * height;

            return (
              <motion.g key={i}>
                {/* Horizontal line */}
                <motion.line
                  x1={x1}
                  y1={y}
                  x2={x2}
                  y2={y}
                  stroke={SAPPHIRE[i % SAPPHIRE.length]}
                  strokeWidth={1}
                  strokeDasharray="3 6"
                  strokeOpacity={0.4}
                  animate={{
                    strokeDashoffset: [0, -18],
                    opacity: [0.2, 0.6, 0.2],
                  }}
                  transition={{
                    strokeDashoffset: {
                      duration: 4,
                      repeat: Infinity,
                      ease: 'linear',
                    },
                    opacity: {
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.3,
                    },
                  }}
                />

                {/* Diagonal lines */}
                <motion.line
                  x1={containerSize / 2}
                  y1={topY}
                  x2={x1}
                  y2={y}
                  stroke={SAPPHIRE[(i + 1) % SAPPHIRE.length]}
                  strokeWidth={1}
                  strokeDasharray="3 6"
                  strokeOpacity={0.4}
                  animate={{
                    strokeDashoffset: [0, -18],
                    opacity: [0.2, 0.6, 0.2],
                  }}
                  transition={{
                    strokeDashoffset: {
                      duration: 4,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: 0.5,
                    },
                    opacity: {
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.3 + 0.5,
                    },
                  }}
                />
              </motion.g>
            );
          })}
        </g>

        {/* Center point indicator */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={dimension * 0.03}
          fill={SAPPHIRE[3]}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            filter: `drop-shadow(0 0 ${dimension * 0.04}px ${SAPPHIRE[3]})`,
          }}
        />

        {/* Outer triangle vertices glow */}
        {[
          { x: centerX, y: centerY - height / 2 },
          { x: centerX - containerSize / 2, y: centerY + height / 2 },
          { x: centerX + containerSize / 2, y: centerY + height / 2 },
        ].map((vertex, i) => (
          <motion.circle
            key={i}
            cx={vertex.x}
            cy={vertex.y}
            r={dimension * 0.025}
            fill={SAPPHIRE[i % SAPPHIRE.length]}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
            style={{
              filter: `drop-shadow(0 0 ${dimension * 0.03}px ${SAPPHIRE[i % SAPPHIRE.length]})`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
