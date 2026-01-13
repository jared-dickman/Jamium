'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  LOADER_SIZE,
  LOADER_STROKE,
  type LoaderProps,
} from '@/components/ui/loaders/loader.constants';
import { useState, useEffect } from 'react';

// Authentic Nixie tube warm orange/amber palette
const NIXIE_COLORS = {
  tube: '#1a1410', // Dark brown glass
  tubeBorder: '#3d2a1f', // Brown glass edge
  glow: '#ff8c42', // Warm orange glow
  digit: '#ffb366', // Bright orange digit
  digitBright: '#ffd699', // Brightest highlight
  pin: '#4a4a4a', // Metal pins
};

export function NixieLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const stroke = LOADER_STROKE[size];
  const tubeWidth = dim * 0.28;
  const tubeHeight = dim * 0.85;
  const fontSize = dim * 0.35;

  const [digits, setDigits] = useState([0, 1, 2]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDigits(prev => prev.map(() => Math.floor(Math.random() * 10)));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        <defs>
          {/* Warm orange glow gradient */}
          <radialGradient id={`nixie-glow-${size}`}>
            <stop offset="0%" stopColor={NIXIE_COLORS.glow} stopOpacity="0.8" />
            <stop offset="40%" stopColor={NIXIE_COLORS.glow} stopOpacity="0.4" />
            <stop offset="100%" stopColor={NIXIE_COLORS.glow} stopOpacity="0" />
          </radialGradient>

          {/* Digit glow effect */}
          <filter id={`nixie-digit-glow-${size}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Glass reflection gradient */}
          <linearGradient id={`nixie-glass-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {[0, 1, 2].map(tubeIndex => {
          const x = dim * 0.1 + tubeIndex * (tubeWidth + dim * 0.02);
          const y = (dim - tubeHeight) / 2;
          return (
            <g key={tubeIndex}>
              {/* Metal base pins */}
              <rect
                x={x + tubeWidth / 2 - stroke / 2}
                y={y - dim * 0.06}
                width={stroke}
                height={dim * 0.06}
                fill={NIXIE_COLORS.pin}
                opacity="0.8"
              />
              <rect
                x={x + tubeWidth / 2 - stroke / 2}
                y={y + tubeHeight}
                width={stroke}
                height={dim * 0.06}
                fill={NIXIE_COLORS.pin}
                opacity="0.8"
              />

              {/* Glass tube body */}
              <rect
                x={x}
                y={y}
                width={tubeWidth}
                height={tubeHeight}
                rx={tubeWidth * 0.12}
                fill={NIXIE_COLORS.tube}
                fillOpacity="0.9"
                stroke={NIXIE_COLORS.tubeBorder}
                strokeWidth={stroke}
                opacity="0.95"
              />

              {/* Glass reflection */}
              <rect
                x={x}
                y={y}
                width={tubeWidth}
                height={tubeHeight}
                rx={tubeWidth * 0.12}
                fill={`url(#nixie-glass-${size})`}
              />

              {/* Warm glow emanating from digit */}
              <motion.rect
                x={x}
                y={y}
                width={tubeWidth}
                height={tubeHeight}
                rx={tubeWidth * 0.12}
                fill={`url(#nixie-glow-${size})`}
                animate={{
                  opacity: [0.4, 0.7, 0.5, 0.8, 0.4],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: tubeIndex * 0.2,
                }}
              />

              {/* Nixie digit with authentic glow and flicker */}
              <AnimatePresence mode="wait">
                <motion.text
                  key={digits[tubeIndex]}
                  x={x + tubeWidth / 2}
                  y={y + tubeHeight / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="'Courier New', monospace"
                  fontSize={fontSize}
                  fontWeight="700"
                  fill={NIXIE_COLORS.digitBright}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: [0, 1, 0.85, 1, 0.9, 1],
                    scale: [0.8, 1.05, 1],
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    opacity: {
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                    scale: {
                      duration: 0.2,
                    },
                  }}
                  style={{
                    filter: `drop-shadow(0 0 ${dim * 0.12}px ${NIXIE_COLORS.glow}) drop-shadow(0 0 ${dim * 0.06}px ${NIXIE_COLORS.digit})`,
                  }}
                >
                  {digits[tubeIndex]}
                </motion.text>
              </AnimatePresence>

              {/* Pin contact glow indicator */}
              <motion.circle
                cx={x + tubeWidth / 2}
                cy={y - dim * 0.03}
                r={dim * 0.012}
                fill={NIXIE_COLORS.glow}
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: tubeIndex * 0.3,
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
