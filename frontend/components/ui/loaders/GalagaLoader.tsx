'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function GalagaLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center overflow-hidden', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim * 0.85} height={dim * 0.85} viewBox="0 0 100 100">
        <defs>
          <radialGradient id={`galaga-flash-${size}`}>
            <stop offset="0%" stopColor={SAPPHIRE[3]} stopOpacity="1" />
            <stop offset="100%" stopColor={SAPPHIRE[2]} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`galaga-glow-${size}`}>
            <stop offset="0%" stopColor={SAPPHIRE[2]} stopOpacity="0.8" />
            <stop offset="100%" stopColor={SAPPHIRE[1]} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Star field background */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.circle
            key={`star-${i}`}
            cx={15 + (i % 5) * 18}
            cy={8 + Math.floor(i / 5) * 25}
            r={0.6}
            fill={SAPPHIRE[i % 3]}
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5 + (i % 3) * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.12,
            }}
          />
        ))}

        {/* Enemy formation - 3 aliens in classic pattern */}
        {[0, 1, 2].map(i => {
          const baseX = 30 + i * 20;
          return (
            <motion.g key={`enemy-${i}`}>
              {/* Enemy glow */}
              <motion.circle
                cx={baseX}
                cy={20}
                r={5}
                fill={`url(#galaga-glow-${size})`}
                animate={{
                  x: [0, Math.sin(i * Math.PI * 0.6) * 4, 0],
                  y: [0, Math.cos(i * Math.PI * 0.6) * 3, 0],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.3,
                }}
              />

              {/* Enemy body - butterfly shape */}
              <motion.g
                animate={{
                  x: [0, Math.sin(i * Math.PI * 0.6) * 4, 0],
                  y: [0, Math.cos(i * Math.PI * 0.6) * 3, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.3,
                }}
              >
                {/* Body center */}
                <rect x={baseX - 2} y={18} width={4} height={5} fill={SAPPHIRE[2]} rx={1} />
                {/* Wings */}
                <path
                  d={`M${baseX - 2},20 L${baseX - 5},18 L${baseX - 5},22 Z`}
                  fill={SAPPHIRE[1]}
                />
                <path
                  d={`M${baseX + 2},20 L${baseX + 5},18 L${baseX + 5},22 Z`}
                  fill={SAPPHIRE[1]}
                />
                {/* Antennae */}
                <circle cx={baseX - 1} cy={17} r={0.8} fill={SAPPHIRE[3]} />
                <circle cx={baseX + 1} cy={17} r={0.8} fill={SAPPHIRE[3]} />
              </motion.g>
            </motion.g>
          );
        })}

        {/* Player projectiles - staggered firing */}
        {[0, 1, 2].map(i => (
          <motion.g key={`bullet-${i}`}>
            {/* Bullet trail glow */}
            <motion.line
              x1={50}
              y1={78}
              x2={50}
              y2={72}
              stroke={SAPPHIRE[3]}
              strokeWidth={2.5}
              strokeLinecap="round"
              opacity={0.4}
              animate={{
                y1: [78, 10],
                y2: [72, 5],
                opacity: [0, 0.6, 0.6, 0],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.45,
              }}
            />
            {/* Bullet core */}
            <motion.line
              x1={50}
              y1={78}
              x2={50}
              y2={73}
              stroke={SAPPHIRE[3]}
              strokeWidth={1.2}
              strokeLinecap="round"
              animate={{
                y1: [78, 10],
                y2: [73, 6],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.45,
              }}
            />
          </motion.g>
        ))}

        {/* Player ship - classic Galaga design with aggressive dodging */}
        <motion.g
          animate={{
            x: [-8, 8, -5, 6, -8],
            y: [0, -1, 1, -0.5, 0],
            rotate: [-3, 3, -2, 2, -3],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
        >
          {/* Ship glow */}
          <motion.circle
            cx={50}
            cy={85}
            r={7}
            fill={`url(#galaga-glow-${size})`}
            animate={{
              opacity: [0.5, 0.8, 0.5],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          {/* Main body */}
          <path
            d="M50,78 L45,86 L55,86 Z"
            fill={SAPPHIRE[2]}
            stroke={SAPPHIRE[3]}
            strokeWidth={0.4}
          />
          {/* Wings */}
          <path d="M45,86 L42,88 L45,88 Z" fill={SAPPHIRE[1]} />
          <path d="M55,86 L58,88 L55,88 Z" fill={SAPPHIRE[1]} />
          {/* Cockpit */}
          <circle cx={50} cy={83} r={1.5} fill={SAPPHIRE[3]} />
          {/* Engine glow */}
          <motion.circle
            cx={50}
            cy={86.5}
            r={1}
            fill={SAPPHIRE[3]}
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 0.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.g>

        {/* Muzzle flash - synced with bullet firing */}
        {[0, 1, 2].map(i => (
          <motion.circle
            key={`flash-${i}`}
            cx={50}
            cy={77}
            r={3}
            fill={`url(#galaga-flash-${size})`}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.3, 1.5, 0.3],
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              ease: 'easeOut',
              delay: i * 0.45,
              repeatDelay: 0.9,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
