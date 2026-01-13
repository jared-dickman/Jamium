'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function OrbitLoader({ size = 'md' }: LoaderProps) {
  const dimension = LOADER_SIZE[size];
  const svgSize = dimension * 0.8;
  const center = svgSize / 2;
  const orbits = 3;
  const particlesPerOrbit = [3, 5, 7];

  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex items-center justify-center overflow-hidden"
      style={{ width: dimension, height: dimension }}
    >
      <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
        <defs>
          <radialGradient id={`orbitCore-${size}`}>
            <stop offset="0%" stopColor={SAPPHIRE[3]} stopOpacity={1} />
            <stop offset="50%" stopColor={SAPPHIRE[2]} stopOpacity={0.8} />
            <stop offset="100%" stopColor={SAPPHIRE[1]} stopOpacity={0.3} />
          </radialGradient>
          {particlesPerOrbit.map((_, orbitIdx) => (
            <radialGradient key={`particle-grad-${orbitIdx}`} id={`particle-${orbitIdx}-${size}`}>
              <stop
                offset="0%"
                stopColor={SAPPHIRE[(orbitIdx + 1) % SAPPHIRE.length]}
                stopOpacity={1}
              />
              <stop
                offset="100%"
                stopColor={SAPPHIRE[(orbitIdx + 2) % SAPPHIRE.length]}
                stopOpacity={0.6}
              />
            </radialGradient>
          ))}
        </defs>

        {/* Central core with pulse */}
        <motion.circle
          cx={center}
          cy={center}
          r={svgSize * 0.06}
          fill={`url(#orbitCore-${size})`}
          animate={{
            r: [svgSize * 0.06, svgSize * 0.08, svgSize * 0.06],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Orbit paths with subtle glow */}
        {Array.from({ length: orbits }).map((_, orbitIdx) => {
          const radius = svgSize * (0.18 + orbitIdx * 0.12);
          const direction = orbitIdx % 2 === 0 ? 1 : -1;

          return (
            <motion.circle
              key={`orbit-${orbitIdx}`}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={SAPPHIRE[orbitIdx % SAPPHIRE.length]}
              strokeWidth={svgSize * 0.008}
              opacity={0.25}
              strokeDasharray={`${svgSize * 0.04} ${svgSize * 0.06}`}
              animate={{
                rotate: direction * 360,
              }}
              transition={{
                duration: 25 - orbitIdx * 3,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                transformOrigin: `${center}px ${center}px`,
              }}
            />
          );
        })}

        {/* Orbiting particles with smooth bezier easing */}
        {Array.from({ length: orbits }).map((_, orbitIdx) => {
          const radius = svgSize * (0.18 + orbitIdx * 0.12);
          const particles = particlesPerOrbit[orbitIdx] ?? 4;
          const duration = 2.5 + orbitIdx * 0.8;
          const direction = orbitIdx % 2 === 0 ? 1 : -1;

          return Array.from({ length: particles }).map((_, particleIdx) => {
            const startAngle = (particleIdx * 360) / particles;
            const dotRadius = svgSize * (0.04 - orbitIdx * 0.006);
            const delay = (particleIdx * duration) / particles;

            return (
              <motion.circle
                key={`${orbitIdx}-${particleIdx}`}
                cx={center + radius * Math.cos((startAngle * Math.PI) / 180)}
                cy={center + radius * Math.sin((startAngle * Math.PI) / 180)}
                r={dotRadius}
                fill={`url(#particle-${orbitIdx}-${size})`}
                animate={{
                  cx: [
                    center + radius * Math.cos((startAngle * Math.PI) / 180),
                    center + radius * Math.cos(((startAngle + direction * 360) * Math.PI) / 180),
                  ],
                  cy: [
                    center + radius * Math.sin((startAngle * Math.PI) / 180),
                    center + radius * Math.sin(((startAngle + direction * 360) * Math.PI) / 180),
                  ],
                  opacity: [0.7, 1, 0.7],
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration,
                  repeat: Infinity,
                  ease: [0.45, 0, 0.55, 1],
                  delay,
                }}
              />
            );
          });
        })}
      </svg>
    </div>
  );
}
