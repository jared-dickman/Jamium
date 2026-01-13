'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function PulleyLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const pulleyRadius = dim * 0.15;
  const ropeWidth = dim * 0.025;
  const weightSize = dim * 0.18;

  const leftPulleyX = dim * 0.3;
  const rightPulleyX = dim * 0.7;
  const pulleyY = dim * 0.25;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        {/* Support beam */}
        <rect
          x={dim * 0.15}
          y={pulleyY - dim * 0.08}
          width={dim * 0.7}
          height={dim * 0.04}
          fill={SAPPHIRE[0]}
          opacity={0.3}
          rx={dim * 0.02}
        />

        {/* Left pulley wheel */}
        <g>
          <circle
            cx={leftPulleyX}
            cy={pulleyY}
            r={pulleyRadius}
            fill="none"
            stroke={SAPPHIRE[0]}
            strokeWidth={dim * 0.025}
            opacity={0.8}
          />
          <circle
            cx={leftPulleyX}
            cy={pulleyY}
            r={pulleyRadius * 0.7}
            fill="none"
            stroke={SAPPHIRE[1]}
            strokeWidth={dim * 0.015}
            opacity={0.5}
          />

          {/* Rotating marks on left pulley - counter-clockwise */}
          <motion.g
            animate={{ rotate: -360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: `${leftPulleyX}px`, originY: `${pulleyY}px` }}
          >
            {[0, 60, 120, 180, 240, 300].map(angle => {
              const rad = (angle * Math.PI) / 180;
              const markX = leftPulleyX + Math.cos(rad) * (pulleyRadius * 0.85);
              const markY = pulleyY + Math.sin(rad) * (pulleyRadius * 0.85);
              return (
                <circle key={angle} cx={markX} cy={markY} r={dim * 0.015} fill={SAPPHIRE[2]} />
              );
            })}
          </motion.g>
        </g>

        {/* Right pulley wheel */}
        <g>
          <circle
            cx={rightPulleyX}
            cy={pulleyY}
            r={pulleyRadius}
            fill="none"
            stroke={SAPPHIRE[0]}
            strokeWidth={dim * 0.025}
            opacity={0.8}
          />
          <circle
            cx={rightPulleyX}
            cy={pulleyY}
            r={pulleyRadius * 0.7}
            fill="none"
            stroke={SAPPHIRE[1]}
            strokeWidth={dim * 0.015}
            opacity={0.5}
          />

          {/* Rotating marks on right pulley - clockwise */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: `${rightPulleyX}px`, originY: `${pulleyY}px` }}
          >
            {[0, 60, 120, 180, 240, 300].map(angle => {
              const rad = (angle * Math.PI) / 180;
              const markX = rightPulleyX + Math.cos(rad) * (pulleyRadius * 0.85);
              const markY = pulleyY + Math.sin(rad) * (pulleyRadius * 0.85);
              return (
                <circle key={angle} cx={markX} cy={markY} r={dim * 0.015} fill={SAPPHIRE[3]} />
              );
            })}
          </motion.g>
        </g>

        {/* Ropes */}
        <line
          x1={leftPulleyX}
          y1={pulleyY + pulleyRadius}
          x2={leftPulleyX}
          y2={dim * 0.85}
          stroke={SAPPHIRE[1]}
          strokeWidth={ropeWidth}
          opacity={0.6}
        />
        <line
          x1={rightPulleyX}
          y1={pulleyY + pulleyRadius}
          x2={rightPulleyX}
          y2={dim * 0.85}
          stroke={SAPPHIRE[1]}
          strokeWidth={ropeWidth}
          opacity={0.6}
        />

        {/* Animated weight on left rope */}
        <motion.g
          animate={{ y: [0, dim * 0.22, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <rect
            x={leftPulleyX - weightSize / 2}
            y={dim * 0.5}
            width={weightSize}
            height={weightSize}
            fill={SAPPHIRE[2]}
            rx={dim * 0.02}
          />
          <rect
            x={leftPulleyX - weightSize / 3}
            y={dim * 0.5 + weightSize * 0.4}
            width={(weightSize * 2) / 3}
            height={weightSize * 0.15}
            fill={SAPPHIRE[0]}
            opacity={0.5}
          />
        </motion.g>

        {/* Static counterweight on right rope */}
        <rect
          x={rightPulleyX - weightSize / 2.5}
          y={dim * 0.65}
          width={weightSize / 1.3}
          height={weightSize / 1.3}
          fill={SAPPHIRE[3]}
          opacity={0.7}
          rx={dim * 0.02}
        />
      </svg>
    </div>
  );
}
