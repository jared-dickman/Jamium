'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function IonLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const ionR = dim * 0.1;
  const spacing = dim * 0.35;

  const positiveX = dim / 2 - spacing / 2;
  const negativeX = dim / 2 + spacing / 2;
  const centerY = dim / 2;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        {/* Negative ion (left) */}
        <g>
          <motion.circle
            cx={positiveX}
            cy={centerY}
            r={ionR}
            fill={SAPPHIRE[1]}
            stroke={SAPPHIRE[0]}
            strokeWidth="2"
            animate={{
              x: [-3, 3, -3],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.line
            x1={positiveX - ionR * 0.5}
            y1={centerY}
            x2={positiveX + ionR * 0.5}
            y2={centerY}
            stroke={SAPPHIRE[0]}
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={{ x: [-3, 3, -3] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </g>

        {/* Positive ion (right) */}
        <g>
          <motion.circle
            cx={negativeX}
            cy={centerY}
            r={ionR}
            fill={SAPPHIRE[2]}
            stroke={SAPPHIRE[3]}
            strokeWidth="2"
            animate={{
              x: [3, -3, 3],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.line
            x1={negativeX - ionR * 0.5}
            y1={centerY}
            x2={negativeX + ionR * 0.5}
            y2={centerY}
            stroke={SAPPHIRE[3]}
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={{ x: [3, -3, 3] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.line
            x1={negativeX}
            y1={centerY - ionR * 0.5}
            x2={negativeX}
            y2={centerY + ionR * 0.5}
            stroke={SAPPHIRE[3]}
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={{ x: [3, -3, 3] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </g>

        {/* Electric field lines */}
        {[-0.3, 0, 0.3].map((offset, i) => (
          <motion.line
            key={`field-${i}`}
            x1={positiveX + ionR}
            y1={centerY + offset * dim}
            x2={negativeX - ionR}
            y2={centerY + offset * dim}
            stroke={SAPPHIRE[2]}
            strokeWidth="1"
            opacity="0.4"
            strokeDasharray="3 3"
            animate={{
              strokeDashoffset: [0, -6],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.2,
            }}
          />
        ))}

        {/* Attraction/repulsion waves */}
        {[0, 1].map(i => (
          <motion.ellipse
            key={`wave-${i}`}
            cx={dim / 2}
            cy={centerY}
            rx={spacing / 2}
            ry={ionR}
            fill="none"
            stroke={SAPPHIRE[3]}
            strokeWidth="1"
            opacity="0.3"
            animate={{
              rx: [spacing / 2, spacing / 2.2, spacing / 2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 1,
            }}
          />
        ))}

        {/* Energy ripples from negative ion */}
        <motion.circle
          cx={positiveX}
          cy={centerY}
          r={ionR * 1.2}
          fill="none"
          stroke={SAPPHIRE[0]}
          strokeWidth="1"
          animate={{
            r: [ionR * 1.2, ionR * 1.8],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />

        {/* Energy ripples from positive ion */}
        <motion.circle
          cx={negativeX}
          cy={centerY}
          r={ionR * 1.2}
          fill="none"
          stroke={SAPPHIRE[3]}
          strokeWidth="1"
          animate={{
            r: [ionR * 1.2, ionR * 1.8],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
            delay: 1,
          }}
        />
      </svg>
    </div>
  );
}
