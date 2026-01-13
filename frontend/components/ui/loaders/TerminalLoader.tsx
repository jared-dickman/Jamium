'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  SAPPHIRE,
  LOADER_SIZE,
  LOADER_STROKE,
  type LoaderProps,
} from '@/components/ui/loaders/loader.constants';

export function TerminalLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const stroke = LOADER_STROKE[size];
  const fontSize = dim * 0.13;
  const padding = dim * 0.12;
  const titleBarHeight = dim * 0.18;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        <defs>
          {/* CRT glow effect */}
          <filter id="terminal-glow">
            <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Terminal window frame */}
        <rect
          x={stroke}
          y={stroke}
          width={dim - stroke * 2}
          height={dim - stroke * 2}
          rx={dim * 0.06}
          fill="#000000"
          stroke={SAPPHIRE[0]}
          strokeWidth={stroke}
        />

        {/* Title bar */}
        <rect
          x={stroke}
          y={stroke}
          width={dim - stroke * 2}
          height={titleBarHeight}
          fill={SAPPHIRE[0]}
          rx={dim * 0.06}
        />
        <rect
          x={stroke}
          y={stroke + titleBarHeight * 0.5}
          width={dim - stroke * 2}
          height={titleBarHeight * 0.5}
          fill={SAPPHIRE[0]}
        />

        {/* Title bar dots (macOS style) */}
        <circle cx={dim * 0.15} cy={titleBarHeight * 0.5} r={dim * 0.025} fill="#ff5f56" />
        <circle cx={dim * 0.25} cy={titleBarHeight * 0.5} r={dim * 0.025} fill="#ffbd2e" />
        <circle cx={dim * 0.35} cy={titleBarHeight * 0.5} r={dim * 0.025} fill="#27c93f" />

        {/* Title text */}
        <text
          x={dim / 2}
          y={titleBarHeight * 0.5 + fontSize * 0.3}
          fontFamily="ui-monospace, monospace"
          fontSize={fontSize * 0.7}
          fill="#ffffff"
          textAnchor="middle"
          opacity="0.8"
        >
          terminal
        </text>

        {/* Terminal content with glow */}
        <g filter="url(#terminal-glow)">
          <text
            x={padding}
            y={titleBarHeight + dim * 0.25}
            fontFamily="ui-monospace, monospace"
            fontSize={fontSize}
            fill={SAPPHIRE[2]}
          >
            connecting...
          </text>

          {/* Blinking cursor */}
          <motion.rect
            x={padding + fontSize * 9.5}
            y={titleBarHeight + dim * 0.25 - fontSize * 0.75}
            width={fontSize * 0.55}
            height={fontSize * 0.9}
            fill={SAPPHIRE[2]}
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              times: [0, 0.5, 0.5, 1],
            }}
          />
        </g>
      </svg>
    </div>
  );
}
