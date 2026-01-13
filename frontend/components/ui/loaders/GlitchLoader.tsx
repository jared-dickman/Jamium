'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  SAPPHIRE,
  LOADER_SIZE,
  DURATION,
  type LoaderProps,
} from '@/components/ui/loaders/loader.constants';

export function GlitchLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];

  // Controlled chaos: specific glitch moments, not continuous noise
  const glitchMoments = [0, 0.3, 0.6, 0.9];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        <defs>
          {/* VHS tracking error scanlines */}
          <pattern id="scanlines" x="0" y="0" width="100%" height="4" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="100%" height="2" fill={SAPPHIRE[3]} opacity="0.1" />
          </pattern>

          {/* RGB chromatic aberration filters */}
          <filter id="rgb-split">
            <feOffset in="SourceGraphic" dx="-2" dy="0" result="r" />
            <feOffset in="SourceGraphic" dx="2" dy="0" result="b" />
            <feBlend in="r" in2="SourceGraphic" mode="screen" result="rb" />
            <feBlend in="b" in2="rb" mode="screen" />
          </filter>

          <filter id="glitch-corruption">
            <feTurbulence baseFrequency="0.02 0.9" numOctaves="1" result="noise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="3"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        {/* Background corruption pattern */}
        <rect width={dim} height={dim} fill="url(#scanlines)" />

        {/* Main glitch text/shape - "LOAD" with intentional corruption */}
        <g transform={`translate(${dim / 2}, ${dim / 2})`}>
          {/* Red channel - displaced left */}
          <motion.text
            x={-dim * 0.35}
            y={dim * 0.12}
            fontSize={dim * 0.28}
            fontWeight="900"
            fontFamily="monospace"
            fill={SAPPHIRE[0]}
            opacity={0.7}
            animate={{
              x: glitchMoments.flatMap(t => [
                -dim * 0.35,
                -dim * 0.35,
                -dim * 0.38, // glitch left
                -dim * 0.35,
              ]),
              opacity: glitchMoments.flatMap(() => [0.7, 0.7, 0.9, 0.7]),
            }}
            transition={{
              duration: DURATION.medium,
              repeat: Infinity,
              times: [0, 0.29, 0.3, 0.31],
            }}
          >
            LOAD
          </motion.text>

          {/* Green channel - base */}
          <motion.text
            x={-dim * 0.35}
            y={dim * 0.12}
            fontSize={dim * 0.28}
            fontWeight="900"
            fontFamily="monospace"
            fill={SAPPHIRE[1]}
            animate={{
              y: glitchMoments.flatMap(t => [
                dim * 0.12,
                dim * 0.12,
                dim * 0.12,
                dim * 0.12,
                dim * 0.14, // glitch down at 0.6
                dim * 0.12,
              ]),
              scaleY: glitchMoments.flatMap(() => [1, 1, 1, 1, 0.8, 1]),
            }}
            transition={{
              duration: DURATION.medium,
              repeat: Infinity,
              times: [0, 0.59, 0.6, 0.61, 0.62, 0.63],
            }}
          >
            LOAD
          </motion.text>

          {/* Blue channel - displaced right */}
          <motion.text
            x={-dim * 0.35}
            y={dim * 0.12}
            fontSize={dim * 0.28}
            fontWeight="900"
            fontFamily="monospace"
            fill={SAPPHIRE[2]}
            opacity={0.7}
            animate={{
              x: glitchMoments.flatMap(t => [
                -dim * 0.35,
                -dim * 0.35,
                -dim * 0.35,
                -dim * 0.35,
                -dim * 0.35,
                -dim * 0.32, // glitch right at 0.9
                -dim * 0.35,
              ]),
              opacity: glitchMoments.flatMap(() => [0.7, 0.7, 0.7, 0.7, 0.7, 0.9, 0.7]),
            }}
            transition={{
              duration: DURATION.medium,
              repeat: Infinity,
              times: [0, 0.89, 0.9, 0.91, 0.92, 0.93, 0.94],
            }}
          >
            LOAD
          </motion.text>

          {/* Cyan overlay - appears during intense glitch */}
          <motion.text
            x={-dim * 0.35}
            y={dim * 0.12}
            fontSize={dim * 0.28}
            fontWeight="900"
            fontFamily="monospace"
            fill={SAPPHIRE[3]}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0, 0.6, 0, 0, 0.4, 0],
              scaleX: [1, 1, 1.05, 1, 1, 0.95, 1],
            }}
            transition={{
              duration: DURATION.medium,
              repeat: Infinity,
              times: [0, 0.29, 0.3, 0.31, 0.59, 0.6, 0.61],
            }}
          >
            LOAD
          </motion.text>
        </g>

        {/* Pixel displacement bars - VHS tracking errors */}
        {[0.2, 0.5, 0.75].map((yPos, i) => (
          <motion.rect
            key={i}
            x={0}
            y={dim * yPos}
            width={dim}
            height={2}
            fill={SAPPHIRE[i % 4]}
            opacity={0}
            animate={{
              opacity:
                i === 0
                  ? [0, 0, 0.8, 0]
                  : i === 1
                    ? [0, 0, 0, 0, 0, 0.6, 0]
                    : [0, 0, 0, 0, 0, 0, 0, 0, 0.7, 0],
              scaleX:
                i === 0
                  ? [1, 1, 0.7, 1]
                  : i === 1
                    ? [1, 1, 1, 1, 1, 0.85, 1]
                    : [1, 1, 1, 1, 1, 1, 1, 1, 0.6, 1],
            }}
            transition={{
              duration: DURATION.medium,
              repeat: Infinity,
              times:
                i === 0
                  ? [0, 0.29, 0.3, 0.32]
                  : i === 1
                    ? [0, 0.58, 0.59, 0.6, 0.61, 0.62, 0.63]
                    : [0, 0.88, 0.89, 0.9, 0.91, 0.92, 0.93, 0.94, 0.95, 0.96],
            }}
            style={{ transformOrigin: 'left center' }}
          />
        ))}

        {/* Scan line sweep - continuous */}
        <motion.line
          x1={0}
          x2={dim}
          y1={0}
          y2={0}
          stroke={SAPPHIRE[3]}
          strokeWidth={1}
          opacity={0.3}
          animate={{
            y1: [0, dim],
            y2: [0, dim],
          }}
          transition={{
            duration: DURATION.slow,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Corner pixel blocks - digital corruption */}
        {[
          [2, 2],
          [dim - 6, 2],
          [2, dim - 6],
          [dim - 6, dim - 6],
        ].map(([x, y], i) => (
          <motion.rect
            key={`corner-${i}`}
            x={x}
            y={y}
            width={4}
            height={4}
            fill={SAPPHIRE[i]}
            opacity={0}
            animate={{
              opacity: i % 2 === 0 ? [0, 0, 0.9, 0] : [0, 0, 0, 0, 0, 0.9, 0],
            }}
            transition={{
              duration: DURATION.medium,
              repeat: Infinity,
              times: i % 2 === 0 ? [0, 0.29, 0.3, 0.33] : [0, 0.59, 0.6, 0.61, 0.62, 0.63, 0.66],
            }}
          />
        ))}
      </svg>
    </div>
  );
}
