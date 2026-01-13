'use client';

import { motion } from 'framer-motion';
import {
  SAPPHIRE,
  LOADER_SIZE,
  DURATION,
  OPACITY,
  TRANSITION,
  type LoaderProps,
} from '@/components/ui/loaders/loader.constants';

export function AtomLoader({ size = 'md' }: LoaderProps) {
  const dimension = LOADER_SIZE[size];
  const center = dimension / 2;
  const nucleusRadius = dimension * 0.12;
  const particleRadius = dimension * 0.025;

  // Nucleus particles - protons and neutrons clustered together
  const nucleusParticles = [
    { cx: center, cy: center, type: 'proton' },
    { cx: center - particleRadius * 1.8, cy: center - particleRadius * 1.2, type: 'neutron' },
    { cx: center + particleRadius * 1.6, cy: center - particleRadius * 1.4, type: 'proton' },
    { cx: center - particleRadius * 1.2, cy: center + particleRadius * 1.6, type: 'neutron' },
    { cx: center + particleRadius * 1.4, cy: center + particleRadius * 1.8, type: 'proton' },
    { cx: center + particleRadius * 0.6, cy: center + particleRadius * 0.8, type: 'neutron' },
    { cx: center - particleRadius * 0.8, cy: center + particleRadius * 0.4, type: 'proton' },
  ];

  // Electron orbits - 3 elliptical paths at different angles
  const orbits = [
    { rx: dimension * 0.28, ry: dimension * 0.15, angle: 0, duration: DURATION.slow },
    { rx: dimension * 0.32, ry: dimension * 0.18, angle: 60, duration: DURATION.medium },
    { rx: dimension * 0.36, ry: dimension * 0.16, angle: 120, duration: 2.3 },
  ];

  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex items-center justify-center"
      style={{ width: dimension, height: dimension }}
    >
      <svg width={dimension} height={dimension} viewBox={`0 0 ${dimension} ${dimension}`}>
        <defs>
          {/* Nucleus glow */}
          <radialGradient id="nucleusGlow">
            <stop offset="0%" stopColor={SAPPHIRE[3]} stopOpacity={0.4} />
            <stop offset="100%" stopColor={SAPPHIRE[0]} stopOpacity={0} />
          </radialGradient>
          {/* Proton gradient - brighter blue */}
          <radialGradient id="proton">
            <stop offset="0%" stopColor={SAPPHIRE[3]} />
            <stop offset="100%" stopColor={SAPPHIRE[2]} />
          </radialGradient>
          {/* Neutron gradient - deeper blue */}
          <radialGradient id="neutron">
            <stop offset="0%" stopColor={SAPPHIRE[1]} />
            <stop offset="100%" stopColor={SAPPHIRE[0]} />
          </radialGradient>
        </defs>

        {/* Nucleus glow effect */}
        <motion.circle
          cx={center}
          cy={center}
          r={nucleusRadius * 1.8}
          fill="url(#nucleusGlow)"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: DURATION.slow, ...TRANSITION.smooth }}
        />

        {/* Nucleus particles - clustered protons and neutrons */}
        {nucleusParticles.map((particle, i) => (
          <motion.circle
            key={i}
            cx={particle.cx}
            cy={particle.cy}
            r={particleRadius}
            fill={`url(#${particle.type})`}
            stroke={particle.type === 'proton' ? SAPPHIRE[2] : SAPPHIRE[0]}
            strokeWidth={dimension * 0.004}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.9, 1, 0.9],
            }}
            transition={{
              duration: DURATION.medium,
              delay: i * 0.1,
              ...TRANSITION.smooth,
            }}
          />
        ))}

        {/* Electron orbits and electrons */}
        {orbits.map((orbit, i) => (
          <g key={i}>
            {/* Orbit path - elliptical */}
            <ellipse
              cx={center}
              cy={center}
              rx={orbit.rx}
              ry={orbit.ry}
              fill="none"
              stroke={SAPPHIRE[i % SAPPHIRE.length]}
              strokeWidth={dimension * 0.008}
              opacity={OPACITY.faint}
              transform={`rotate(${orbit.angle} ${center} ${center})`}
              strokeDasharray="3,3"
            />

            {/* Electron orbiting smoothly */}
            <motion.g
              animate={{ rotate: 360 }}
              transition={{
                duration: orbit.duration,
                ...TRANSITION.linear,
              }}
              style={{ transformOrigin: `${center}px ${center}px` }}
            >
              <g transform={`rotate(${orbit.angle} ${center} ${center})`}>
                <motion.circle
                  cx={center + orbit.rx}
                  cy={center}
                  r={dimension * 0.035}
                  fill={SAPPHIRE[3]}
                  stroke={SAPPHIRE[2]}
                  strokeWidth={dimension * 0.006}
                  animate={{
                    scale: [1, 1.15, 1],
                  }}
                  transition={{
                    duration: DURATION.fast,
                    ...TRANSITION.smooth,
                  }}
                />
              </g>
            </motion.g>
          </g>
        ))}
      </svg>
    </div>
  );
}
