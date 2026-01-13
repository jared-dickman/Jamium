'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function DialupLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const strokeWidth = dim * 0.02;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={className}
      style={{
        width: dim,
        height: dim,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={dim * 0.8} height={dim * 0.8} viewBox="0 0 100 100">
        {/* Modem body */}
        <rect
          x="10"
          y="35"
          width="80"
          height="40"
          rx="3"
          fill="none"
          stroke={SAPPHIRE[1]}
          strokeWidth={strokeWidth}
        />

        {/* Status lights - blinking */}
        {[0, 1, 2].map(i => (
          <motion.circle
            key={`light-${i}`}
            cx={25 + i * 12}
            cy="50"
            r="2.5"
            fill={SAPPHIRE[3]}
            animate={{
              opacity: [0.2, 1, 0.2],
              fill: [SAPPHIRE[0], SAPPHIRE[3], SAPPHIRE[0]],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          />
        ))}

        {/* Sound wave bars */}
        {[0, 1, 2, 3, 4].map(i => {
          const height = 8 + (i === 2 ? 8 : i % 2 === 0 ? 4 : 0);
          return (
            <motion.rect
              key={`wave-${i}`}
              x={62 + i * 5}
              y={55 - height / 2}
              width="2.5"
              height={height}
              fill={SAPPHIRE[2]}
              animate={{
                scaleY: [0.5, 1.5, 0.8, 1.2, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.15,
              }}
              style={{ originY: '55px' }}
            />
          );
        })}

        {/* Connection progress arc */}
        <motion.path
          d="M 50 20 A 20 20 0 0 1 65 28"
          stroke={SAPPHIRE[3]}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.path
          d="M 50 20 A 20 20 0 0 0 35 28"
          stroke={SAPPHIRE[3]}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.3,
          }}
        />

        {/* Phone handset icon */}
        <motion.path
          d="M 15 80 Q 20 75 25 80 L 30 85 Q 32 87 30 89 L 28 91 Q 25 94 22 92 L 17 87 Q 13 83 15 80 Z"
          fill={SAPPHIRE[1]}
          animate={{
            y: [0, -2, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Signal waves emanating */}
        {[0, 1, 2].map(i => (
          <motion.circle
            key={`signal-${i}`}
            cx="50"
            cy="15"
            r={8 + i * 6}
            fill="none"
            stroke={SAPPHIRE[1]}
            strokeWidth={strokeWidth * 0.8}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0.8, 1.2, 1.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
              delay: i * 0.4,
            }}
            style={{ originX: '50px', originY: '15px' }}
          />
        ))}
      </svg>
    </div>
  );
}
