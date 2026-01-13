'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function HelixLoader({ size = 'md' }: LoaderProps) {
  const dimension = LOADER_SIZE[size];
  const svgSize = dimension * 0.8;
  const segments = 24;
  const radius = svgSize * 0.15;
  const baseRadius = svgSize * 0.035;

  const getStrandPosition = (segment: number, phase: number, strand: 1 | 2) => {
    const t = segment / segments;
    const angle = t * Math.PI * 4 + phase + (strand === 2 ? Math.PI : 0);
    const x = svgSize / 2 + Math.cos(angle) * radius;
    const y = svgSize * 0.15 + t * svgSize * 0.7;
    const z = Math.sin(angle);
    return { x, y, z };
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex items-center justify-center overflow-hidden"
      style={{ width: dimension, height: dimension }}
    >
      <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
        <defs>
          <radialGradient id={`dna-grad-1-${size}`}>
            <stop offset="0%" stopColor={SAPPHIRE[0]} stopOpacity={1} />
            <stop offset="100%" stopColor={SAPPHIRE[1]} stopOpacity={0.7} />
          </radialGradient>
          <radialGradient id={`dna-grad-2-${size}`}>
            <stop offset="0%" stopColor={SAPPHIRE[2]} stopOpacity={1} />
            <stop offset="100%" stopColor={SAPPHIRE[3]} stopOpacity={0.7} />
          </radialGradient>
        </defs>

        {/* Base pairs connecting the strands */}
        {Array.from({ length: segments }).map((_, i) => (
          <motion.line
            key={`base-${i}`}
            x1={svgSize / 2}
            y1={svgSize * 0.15 + (i / segments) * svgSize * 0.7}
            x2={svgSize / 2}
            y2={svgSize * 0.15 + (i / segments) * svgSize * 0.7}
            stroke={SAPPHIRE[1]}
            strokeWidth={baseRadius * 0.5}
            strokeLinecap="round"
            animate={{
              x1: [getStrandPosition(i, 0, 1).x, getStrandPosition(i, Math.PI * 2, 1).x],
              x2: [getStrandPosition(i, 0, 2).x, getStrandPosition(i, Math.PI * 2, 2).x],
              opacity: [
                getStrandPosition(i, 0, 1).z > 0 ? 0.3 : 0.15,
                getStrandPosition(i, Math.PI * 2, 1).z > 0 ? 0.3 : 0.15,
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}

        {/* Strand 1 */}
        {Array.from({ length: segments }).map((_, i) => {
          const pos = getStrandPosition(i, 0, 1);
          return (
            <motion.circle
              key={`strand1-${i}`}
              cx={pos.x}
              cy={pos.y}
              r={baseRadius}
              fill={`url(#dna-grad-1-${size})`}
              animate={{
                cx: [getStrandPosition(i, 0, 1).x, getStrandPosition(i, Math.PI * 2, 1).x],
                opacity: [
                  getStrandPosition(i, 0, 1).z > 0 ? 1 : 0.5,
                  getStrandPosition(i, Math.PI * 2, 1).z > 0 ? 1 : 0.5,
                ],
                scale: [
                  getStrandPosition(i, 0, 1).z > 0 ? 1.2 : 0.9,
                  getStrandPosition(i, Math.PI * 2, 1).z > 0 ? 1.2 : 0.9,
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
            />
          );
        })}

        {/* Strand 2 */}
        {Array.from({ length: segments }).map((_, i) => {
          const pos = getStrandPosition(i, 0, 2);
          return (
            <motion.circle
              key={`strand2-${i}`}
              cx={pos.x}
              cy={pos.y}
              r={baseRadius}
              fill={`url(#dna-grad-2-${size})`}
              animate={{
                cx: [getStrandPosition(i, 0, 2).x, getStrandPosition(i, Math.PI * 2, 2).x],
                opacity: [
                  getStrandPosition(i, 0, 2).z > 0 ? 1 : 0.5,
                  getStrandPosition(i, Math.PI * 2, 2).z > 0 ? 1 : 0.5,
                ],
                scale: [
                  getStrandPosition(i, 0, 2).z > 0 ? 1.2 : 0.9,
                  getStrandPosition(i, Math.PI * 2, 2).z > 0 ? 1.2 : 0.9,
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
            />
          );
        })}
      </svg>
    </div>
  );
}
