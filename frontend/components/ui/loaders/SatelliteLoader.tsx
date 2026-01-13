'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function SatelliteLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={className}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox="0 0 100 100" style={{ display: 'block' }}>
        {/* Planet below */}
        <motion.circle
          cx={50}
          cy={75}
          r={12}
          fill={SAPPHIRE[0]}
          animate={{
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.circle
          cx={50}
          cy={75}
          r={10}
          fill={SAPPHIRE[1]}
          animate={{
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Signal waves emanating from satellite */}
        {[0, 1, 2].map(i => (
          <motion.circle
            key={`wave-${i}`}
            cx={50}
            cy={35}
            r={8}
            fill="none"
            stroke={SAPPHIRE[3]}
            strokeWidth={0.5}
            animate={{
              r: [8, 30],
              opacity: [0.8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
              delay: i * 0.6,
            }}
          />
        ))}

        {/* Rotating satellite body */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ originX: '50px', originY: '35px' }}
        >
          {/* Central satellite body */}
          <rect x={45} y={30} width={10} height={10} fill={SAPPHIRE[2]} rx={1} />
          <rect x={46} y={31} width={8} height={8} fill={SAPPHIRE[3]} rx={0.5} />

          {/* Left solar panel */}
          <rect x={32} y={32} width={12} height={6} fill={SAPPHIRE[1]} opacity={0.7} />
          <line x1={33} y1={32} x2={33} y2={38} stroke={SAPPHIRE[3]} strokeWidth={0.3} />
          <line x1={36} y1={32} x2={36} y2={38} stroke={SAPPHIRE[3]} strokeWidth={0.3} />
          <line x1={39} y1={32} x2={39} y2={38} stroke={SAPPHIRE[3]} strokeWidth={0.3} />
          <line x1={42} y1={32} x2={42} y2={38} stroke={SAPPHIRE[3]} strokeWidth={0.3} />

          {/* Right solar panel */}
          <rect x={56} y={32} width={12} height={6} fill={SAPPHIRE[1]} opacity={0.7} />
          <line x1={57} y1={32} x2={57} y2={38} stroke={SAPPHIRE[3]} strokeWidth={0.3} />
          <line x1={60} y1={32} x2={60} y2={38} stroke={SAPPHIRE[3]} strokeWidth={0.3} />
          <line x1={63} y1={32} x2={63} y2={38} stroke={SAPPHIRE[3]} strokeWidth={0.3} />
          <line x1={66} y1={32} x2={66} y2={38} stroke={SAPPHIRE[3]} strokeWidth={0.3} />

          {/* Antenna */}
          <line x1={50} y1={30} x2={50} y2={25} stroke={SAPPHIRE[2]} strokeWidth={0.5} />

          {/* Blinking antenna signal */}
          <motion.circle
            cx={50}
            cy={25}
            r={1.5}
            fill={SAPPHIRE[3]}
            animate={{
              opacity: [1, 0.2, 1],
              scale: [1, 0.7, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ originX: '50px', originY: '25px' }}
          />
        </motion.g>
      </svg>
    </div>
  );
}
