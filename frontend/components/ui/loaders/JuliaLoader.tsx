'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function JuliaLoader({ size = 'md' }: LoaderProps) {
  const dimension = LOADER_SIZE[size];
  const containerSize = dimension * 0.85;
  const centerX = dimension / 2;
  const centerY = dimension / 2;

  const resolution = 45;
  const maxIterations = 18;

  const julia = (zx: number, zy: number, cx: number, cy: number): number => {
    let x = zx;
    let y = zy;
    let iteration = 0;

    while (x * x + y * y <= 4 && iteration < maxIterations) {
      const xTemp = x * x - y * y + cx;
      y = 2 * x * y + cy;
      x = xTemp;
      iteration++;
    }

    return iteration;
  };

  const generateJuliaPoints = (cx: number, cy: number) => {
    const points: Array<{ x: number; y: number; iteration: number; angle: number }> = [];
    const step = containerSize / resolution;

    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const screenX = i * step;
        const screenY = j * step;

        const zx = ((screenX - containerSize / 2) / (containerSize / 4)) * 1.5;
        const zy = ((screenY - containerSize / 2) / (containerSize / 4)) * 1.5;

        const iteration = julia(zx, zy, cx, cy);

        if (iteration < maxIterations) {
          const dx = screenX - containerSize / 2;
          const dy = screenY - containerSize / 2;
          const angle = Math.atan2(dy, dx);

          points.push({
            x: screenX,
            y: screenY,
            iteration,
            angle,
          });
        }
      }
    }

    return points;
  };

  // Morphing Julia set parameters - creates beautiful flowing patterns
  const juliaParams = [
    { cx: -0.4, cy: 0.6 }, // Classic spiral
    { cx: 0.285, cy: 0.01 }, // Delicate branches
    { cx: -0.7, cy: 0.27 }, // Dragon curve
    { cx: -0.8, cy: 0.156 }, // Feathered swirls
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
          <radialGradient id={`julia-glow-${size}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={SAPPHIRE[3]} stopOpacity="0.8" />
            <stop offset="40%" stopColor={SAPPHIRE[2]} stopOpacity="0.5" />
            <stop offset="70%" stopColor={SAPPHIRE[1]} stopOpacity="0.2" />
            <stop offset="100%" stopColor={SAPPHIRE[0]} stopOpacity="0" />
          </radialGradient>

          {/* Spiral gradient following Julia's natural flow */}
          <linearGradient id={`julia-spiral-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            {SAPPHIRE.map((color, i) => (
              <stop key={i} offset={`${(i / (SAPPHIRE.length - 1)) * 100}%`} stopColor={color} />
            ))}
          </linearGradient>
        </defs>

        <g transform={`translate(${centerX - containerSize / 2}, ${centerY - containerSize / 2})`}>
          {/* Morphing background aura */}
          <motion.ellipse
            cx={containerSize / 2}
            cy={containerSize / 2}
            rx={containerSize / 2}
            ry={containerSize / 2.2}
            fill={`url(#julia-glow-${size})`}
            animate={{
              scale: [1, 1.5, 1.3, 1],
              rotate: [0, 45, 90, 135, 180],
              opacity: [0.5, 0.8, 0.6, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Morphing Julia set layers */}
          {juliaParams.map((params, paramIndex) => {
            const points = generateJuliaPoints(params.cx, params.cy);
            const layerDelay = paramIndex * 2;
            const layerOpacity = 0.75 - paramIndex * 0.12;

            return (
              <motion.g
                key={paramIndex}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, layerOpacity, layerOpacity, 0],
                  scale: [0.9, 1, 1.05, 1.1],
                  rotate: [0, paramIndex % 2 === 0 ? 15 : -15, 0],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  delay: layerDelay,
                  times: [0, 0.25, 0.75, 1],
                  ease: 'easeInOut',
                }}
              >
                {points.map((point, index) => {
                  const colorIndex = Math.min(
                    SAPPHIRE.length - 1,
                    Math.floor((point.iteration / maxIterations) * SAPPHIRE.length)
                  );
                  const baseSize = Math.max(0.9, dimension * 0.013);
                  const sizeVariation = 1 + (point.iteration / maxIterations) * 0.6;
                  const pointSize = baseSize * sizeVariation;

                  // Create wave pattern based on angle
                  const waveDelay = (Math.sin(point.angle * 2) + 1) * 0.3;

                  return (
                    <motion.circle
                      key={index}
                      cx={point.x}
                      cy={point.y}
                      r={pointSize}
                      fill={SAPPHIRE[colorIndex]}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 0.95, 0.8, 0.6],
                        scale: [0, 1.3, 1.1, 0.9],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        delay: layerDelay + waveDelay,
                        ease: 'easeInOut',
                      }}
                      style={{
                        filter: `drop-shadow(0 0 ${dimension * 0.025}px ${SAPPHIRE[colorIndex]})`,
                      }}
                    />
                  );
                })}
              </motion.g>
            );
          })}

          {/* Spiral flow lines */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = containerSize / 2 + Math.cos(rad) * (containerSize * 0.15);
            const y1 = containerSize / 2 + Math.sin(rad) * (containerSize * 0.15);
            const x2 = containerSize / 2 + Math.cos(rad) * (containerSize * 0.45);
            const y2 = containerSize / 2 + Math.sin(rad) * (containerSize * 0.45);

            return (
              <motion.line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={SAPPHIRE[i % SAPPHIRE.length]}
                strokeWidth={1.2}
                strokeDasharray="2 8"
                strokeOpacity={0.4}
                strokeLinecap="round"
                animate={{
                  strokeDashoffset: [0, 20],
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
                    delay: i * 0.2,
                  },
                }}
              />
            );
          })}

          {/* Rotating parameter indicator rings */}
          {[0.2, 0.35, 0.5].map((scale, i) => (
            <motion.circle
              key={i}
              cx={containerSize / 2}
              cy={containerSize / 2}
              r={containerSize * scale}
              fill="none"
              stroke={SAPPHIRE[SAPPHIRE.length - 1 - i]}
              strokeWidth={1}
              strokeDasharray="4 8"
              strokeOpacity={0.5}
              animate={{
                rotate: i % 2 === 0 ? [0, 360] : [360, 0],
                scale: [1, 1.08, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                rotate: {
                  duration: 15 + i * 4,
                  repeat: Infinity,
                  ease: 'linear',
                },
                scale: {
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.3,
                },
                opacity: {
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.3,
                },
              }}
            />
          ))}
        </g>

        {/* Center morphing focus */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={dimension * 0.04}
          fill={SAPPHIRE[3]}
          animate={{
            scale: [1, 1.5, 1.2, 1],
            opacity: [0.6, 1, 0.8, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            filter: `drop-shadow(0 0 ${dimension * 0.05}px ${SAPPHIRE[3]})`,
          }}
        />

        {/* Pulsing outer rings */}
        {[1, 1.3, 1.6].map((scale, i) => (
          <motion.circle
            key={i}
            cx={centerX}
            cy={centerY}
            r={dimension * 0.04 * scale}
            fill="none"
            stroke={SAPPHIRE[2]}
            strokeWidth={1}
            strokeOpacity={0.5}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeOut',
              delay: i * 0.4,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
