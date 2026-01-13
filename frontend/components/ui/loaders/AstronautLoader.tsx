'use client';

import { motion } from 'framer-motion';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function AstronautLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={className}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox="0 0 100 100" style={{ display: 'block' }}>
        <defs>
          {/* Visor reflection gradient */}
          <linearGradient id={`visor-glint-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={SAPPHIRE[3]} stopOpacity="0.9" />
            <stop offset="100%" stopColor={SAPPHIRE[2]} stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Tether line - waving */}
        <motion.path
          d="M50 20 Q55 35, 50 50 Q45 65, 50 80"
          stroke={SAPPHIRE[1]}
          strokeWidth="0.8"
          fill="none"
          strokeLinecap="round"
          animate={{
            d: [
              'M50 20 Q55 35, 50 50 Q45 65, 50 80',
              'M50 20 Q45 35, 50 50 Q55 65, 50 80',
              'M50 20 Q55 35, 50 50 Q45 65, 50 80',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Astronaut body - slow tumble */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ originX: '50px', originY: '50px' }}
        >
          {/* Helmet */}
          <ellipse
            cx="50"
            cy="45"
            rx="12"
            ry="14"
            fill={SAPPHIRE[0]}
            stroke={SAPPHIRE[2]}
            strokeWidth="1.5"
          />

          {/* Visor with glint */}
          <motion.ellipse
            cx="50"
            cy="44"
            rx="9"
            ry="10"
            fill={`url(#visor-glint-${size})`}
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Helmet reflection glint */}
          <motion.circle
            cx="54"
            cy="40"
            r="2"
            fill={SAPPHIRE[3]}
            animate={{
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          />

          {/* Body/Suit */}
          <rect
            x="43"
            y="56"
            width="14"
            height="18"
            rx="3"
            fill={SAPPHIRE[0]}
            stroke={SAPPHIRE[2]}
            strokeWidth="1.5"
          />

          {/* Chest pack detail */}
          <rect x="46" y="60" width="8" height="6" rx="1" fill={SAPPHIRE[1]} />

          {/* Arms */}
          <rect
            x="38"
            y="58"
            width="5"
            height="12"
            rx="2.5"
            fill={SAPPHIRE[0]}
            stroke={SAPPHIRE[2]}
            strokeWidth="1"
          />
          <rect
            x="57"
            y="58"
            width="5"
            height="12"
            rx="2.5"
            fill={SAPPHIRE[0]}
            stroke={SAPPHIRE[2]}
            strokeWidth="1"
          />

          {/* Legs */}
          <rect
            x="45"
            y="72"
            width="4"
            height="10"
            rx="2"
            fill={SAPPHIRE[0]}
            stroke={SAPPHIRE[2]}
            strokeWidth="1"
          />
          <rect
            x="51"
            y="72"
            width="4"
            height="10"
            rx="2"
            fill={SAPPHIRE[0]}
            stroke={SAPPHIRE[2]}
            strokeWidth="1"
          />

          {/* Boots */}
          <ellipse cx="47" cy="82" rx="2.5" ry="1.5" fill={SAPPHIRE[1]} />
          <ellipse cx="53" cy="82" rx="2.5" ry="1.5" fill={SAPPHIRE[1]} />
        </motion.g>

        {/* Floating particles around astronaut */}
        {[0, 120, 240].map((angle, i) => {
          const radius = 28;
          const x = 50 + Math.cos((angle * Math.PI) / 180) * radius;
          const y = 50 + Math.sin((angle * Math.PI) / 180) * radius;

          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="1.5"
              fill={SAPPHIRE[i % 4]}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.6,
              }}
              style={{ originX: `${x}px`, originY: `${y}px` }}
            />
          );
        })}
      </svg>
    </div>
  );
}
