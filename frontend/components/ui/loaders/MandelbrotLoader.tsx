'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function MandelbrotLoader({ size = 'md' }: LoaderProps) {
  const dimension = LOADER_SIZE[size];
  const containerSize = dimension * 0.85;
  const centerX = dimension / 2;
  const centerY = dimension / 2;

  const resolution = 50;
  const maxIterations = 20;

  const mandelbrot = (cx: number, cy: number): number => {
    let x = 0;
    let y = 0;
    let iteration = 0;

    while (x * x + y * y <= 4 && iteration < maxIterations) {
      const xTemp = x * x - y * y + cx;
      y = 2 * x * y + cy;
      x = xTemp;
      iteration++;
    }

    return iteration;
  };

  const generateMandelbrotPoints = (zoom: number, offsetX: number, offsetY: number) => {
    const points: Array<{ x: number; y: number; iteration: number; distance: number }> = [];
    const step = containerSize / resolution;

    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const screenX = i * step;
        const screenY = j * step;

        const cx = ((screenX - containerSize / 2) / (containerSize / 4)) * zoom + offsetX;
        const cy = ((screenY - containerSize / 2) / (containerSize / 4)) * zoom + offsetY;

        const iteration = mandelbrot(cx, cy);

        if (iteration < maxIterations) {
          const dx = screenX - containerSize / 2;
          const dy = screenY - containerSize / 2;
          const distance = Math.sqrt(dx * dx + dy * dy);

          points.push({
            x: screenX,
            y: screenY,
            iteration,
            distance,
          });
        }
      }
    }

    return points;
  };

  // Generate multiple zoom levels for animated depth
  const zoomLevels = [
    { zoom: 1.0, offsetX: -0.5, offsetY: 0 },
    { zoom: 0.6, offsetX: -0.7, offsetY: 0.1 },
    { zoom: 0.35, offsetX: -0.75, offsetY: 0.05 },
  ];

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
          <radialGradient id={`mandelbrot-glow-${size}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={SAPPHIRE[3]} stopOpacity="0.9" />
            <stop offset="30%" stopColor={SAPPHIRE[2]} stopOpacity="0.6" />
            <stop offset="60%" stopColor={SAPPHIRE[1]} stopOpacity="0.3" />
            <stop offset="100%" stopColor={SAPPHIRE[0]} stopOpacity="0" />
          </radialGradient>

          {/* Iteration gradient for color depth */}
          <linearGradient id={`mandelbrot-depth-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            {SAPPHIRE.map((color, i) => (
              <stop key={i} offset={`${(i / (SAPPHIRE.length - 1)) * 100}%`} stopColor={color} />
            ))}
          </linearGradient>
        </defs>

        <g transform={`translate(${centerX - containerSize / 2}, ${centerY - containerSize / 2})`}>
          {/* Pulsing background aura */}
          <motion.circle
            cx={containerSize / 2}
            cy={containerSize / 2}
            r={containerSize / 2}
            fill={`url(#mandelbrot-glow-${size})`}
            animate={{
              scale: [1, 1.6, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Animated zoom levels - creates depth illusion */}
          {zoomLevels.map((level, levelIndex) => {
            const points = generateMandelbrotPoints(level.zoom, level.offsetX, level.offsetY);
            const layerDelay = levelIndex * 0.3;
            const layerOpacity = 0.8 - levelIndex * 0.2;

            return (
              <motion.g
                key={levelIndex}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, layerOpacity, layerOpacity, 0],
                  scale: [0.8, 1, 1.1, 1.2],
                }}
                transition={{
                  duration: 9,
                  repeat: Infinity,
                  delay: layerDelay,
                  times: [0, 0.3, 0.7, 1],
                  ease: 'easeInOut',
                }}
              >
                {points.map((point, index) => {
                  const colorIndex = Math.min(
                    SAPPHIRE.length - 1,
                    Math.floor((point.iteration / maxIterations) * SAPPHIRE.length)
                  );
                  const baseSize = Math.max(0.8, dimension * 0.012);
                  const sizeVariation = 1 + (point.iteration / maxIterations) * 0.5;
                  const pointSize = baseSize * sizeVariation;

                  return (
                    <motion.circle
                      key={index}
                      cx={point.x}
                      cy={point.y}
                      r={pointSize}
                      fill={SAPPHIRE[colorIndex]}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 0.9, 0.7, 0.5],
                        scale: [0, 1.2, 1, 0.8],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: layerDelay + (point.distance / (containerSize / 2)) * 0.4,
                        ease: 'easeInOut',
                      }}
                      style={{
                        filter: `drop-shadow(0 0 ${dimension * 0.02}px ${SAPPHIRE[colorIndex]})`,
                      }}
                    />
                  );
                })}
              </motion.g>
            );
          })}

          {/* Rotating iteration boundary rings */}
          {[0.25, 0.45, 0.65, 0.85].map((scale, i) => (
            <motion.circle
              key={i}
              cx={containerSize / 2}
              cy={containerSize / 2}
              r={containerSize * scale}
              fill="none"
              stroke={SAPPHIRE[i % SAPPHIRE.length]}
              strokeWidth={0.8}
              strokeDasharray="3 6"
              strokeOpacity={0.4}
              animate={{
                rotate: i % 2 === 0 ? [0, 360] : [360, 0],
                scale: [1, 1.05, 1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                rotate: {
                  duration: 12 + i * 3,
                  repeat: Infinity,
                  ease: 'linear',
                },
                scale: {
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.2,
                },
                opacity: {
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.2,
                },
              }}
            />
          ))}
        </g>

        {/* Center focus point with iteration pulse */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={dimension * 0.035}
          fill={SAPPHIRE[3]}
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            filter: `drop-shadow(0 0 ${dimension * 0.04}px ${SAPPHIRE[3]})`,
          }}
        />

        {/* Outer glow ring */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={dimension * 0.06}
          fill="none"
          stroke={SAPPHIRE[2]}
          strokeWidth={1.5}
          strokeOpacity={0.6}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      </svg>
    </div>
  );
}
