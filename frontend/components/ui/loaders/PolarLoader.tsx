'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function PolarLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const centerX = 50;
  const centerY = 50;
  const maxRadius = 35;

  // Generate polar rose curve: r = cos(3θ)
  // Creates a beautiful 3-petaled rose pattern
  const points = 180;
  const rosePath =
    Array.from({ length: points }, (_, i) => {
      const theta = (i / points) * Math.PI * 2;
      const r = maxRadius * Math.cos(3 * theta);
      const x = centerX + r * Math.cos(theta);
      const y = centerY + r * Math.sin(theta);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ') + ' Z';

  // Generate cardioid curve: r = a(1 + cos(θ))
  // Beautiful heart-shaped curve
  const cardioidPath =
    Array.from({ length: points }, (_, i) => {
      const theta = (i / points) * Math.PI * 2;
      const r = maxRadius * 0.5 * (1 + Math.cos(theta));
      const x = centerX + r * Math.cos(theta);
      const y = centerY + r * Math.sin(theta);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ') + ' Z';

  // Polar grid - concentric circles
  const gridCircles = [0.33, 0.66, 1].map(scale => maxRadius * scale);

  // Polar grid - radial lines (6 lines at 60° intervals)
  const radialLines = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * Math.PI) / 3;
    return {
      x1: centerX,
      y1: centerY,
      x2: centerX + maxRadius * Math.cos(angle),
      y2: centerY + maxRadius * Math.sin(angle),
    };
  });

  return (
    <div
      role="status"
      aria-label="Loading"
      className={className}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox="0 0 100 100" style={{ display: 'block' }}>
        <defs>
          {/* Gradient for the curve */}
          <linearGradient id={`polar-gradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={SAPPHIRE[0]} />
            <stop offset="33%" stopColor={SAPPHIRE[1]} />
            <stop offset="66%" stopColor={SAPPHIRE[2]} />
            <stop offset="100%" stopColor={SAPPHIRE[3]} />
          </linearGradient>

          {/* Glow effect */}
          <filter id={`polar-glow-${size}`}>
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Polar grid - circles */}
        {gridCircles.map((radius, i) => (
          <motion.circle
            key={`circle-${i}`}
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke={SAPPHIRE[0]}
            strokeWidth="0.3"
            strokeOpacity="0.3"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2,
            }}
          />
        ))}

        {/* Polar grid - radial lines */}
        {radialLines.map((line, i) => (
          <motion.line
            key={`radial-${i}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={SAPPHIRE[0]}
            strokeWidth="0.3"
            strokeOpacity="0.3"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.1,
            }}
          />
        ))}

        {/* Cardioid curve (background, slower) */}
        <motion.path
          d={cardioidPath}
          fill="none"
          stroke={SAPPHIRE[1]}
          strokeWidth="1.5"
          strokeOpacity="0.4"
          filter={`url(#polar-glow-${size})`}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.4, 0.6, 1],
          }}
          style={{ strokeLinecap: 'round' }}
        />

        {/* Rose curve (main animation) */}
        <motion.path
          d={rosePath}
          fill="none"
          stroke={`url(#polar-gradient-${size})`}
          strokeWidth="2"
          filter={`url(#polar-glow-${size})`}
          initial={{ pathLength: 0 }}
          animate={{
            pathLength: [0, 1, 1, 0],
            rotate: [0, 0, 0, 360],
          }}
          transition={{
            pathLength: {
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.5, 0.7, 1],
            },
            rotate: {
              duration: 12,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
          style={{
            strokeLinecap: 'round',
            originX: `${centerX}px`,
            originY: `${centerY}px`,
          }}
        />

        {/* Center point */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r="1.5"
          fill={SAPPHIRE[3]}
          filter={`url(#polar-glow-${size})`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ originX: `${centerX}px`, originY: `${centerY}px` }}
        />

        {/* Tracing dot that follows the rose curve */}
        <motion.circle
          cx={centerX + maxRadius}
          cy={centerY}
          r="2"
          fill={SAPPHIRE[3]}
          filter={`url(#polar-glow-${size})`}
          animate={{
            offsetDistance: ['0%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            offsetPath: `path('${rosePath}')`,
          }}
        />
      </svg>
    </div>
  );
}
