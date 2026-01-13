'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  SAPPHIRE,
  LOADER_SIZE,
  type LoaderProps,
  DURATION,
} from '@/components/ui/loaders/loader.constants';
import { useState, useEffect } from 'react';

// Candy colors: SAPPHIRE palette + sweet extras
const CANDY_COLORS = [
  SAPPHIRE[3], // Light blue
  SAPPHIRE[2], // Blue
  '#ec4899', // Pink
  '#a855f7', // Purple
  '#f97316', // Orange
] as const;

type Candy = {
  id: string;
  color: string;
  col: number;
  row: number;
};

export function CandyCrushLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const gridSize = 4;
  const candySize = dim / (gridSize + 1);
  const gap = candySize * 0.2;

  const [candies, setCandies] = useState<Candy[]>([]);
  const [matching, setMatching] = useState<string[]>([]);
  const [sparkles, setSparkles] = useState<{ id: string; x: number; y: number }[]>([]);

  // Initialize grid
  useEffect(() => {
    const initial: Candy[] = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        initial.push({
          id: `${row}-${col}-${Date.now()}`,
          color: CANDY_COLORS[Math.floor(Math.random() * CANDY_COLORS.length)] as string,
          col,
          row,
        });
      }
    }
    setCandies(initial);
  }, []);

  // Match & cascade logic
  useEffect(() => {
    if (candies.length === 0) return;

    const interval = setInterval(() => {
      // Find horizontal matches
      const toMatch: string[] = [];
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col <= gridSize - 3; col++) {
          const c1 = candies.find(c => c.row === row && c.col === col);
          const c2 = candies.find(c => c.row === row && c.col === col + 1);
          const c3 = candies.find(c => c.row === row && c.col === col + 2);
          if (c1 && c2 && c3 && c1.color === c2.color && c2.color === c3.color) {
            toMatch.push(c1.id, c2.id, c3.id);
          }
        }
      }

      if (toMatch.length > 0) {
        setMatching(toMatch);

        // Create sparkles
        const newSparkles = toMatch
          .slice(0, 3)
          .map(id => {
            const candy = candies.find(c => c.id === id);
            if (!candy) return null;
            const x = candy.col * (candySize + gap) + candySize / 2;
            const y = candy.row * (candySize + gap) + candySize / 2;
            return { id: `sparkle-${id}-${Date.now()}`, x, y };
          })
          .filter(Boolean) as { id: string; x: number; y: number }[];

        setSparkles(newSparkles);

        // Remove matched candies and fill
        setTimeout(() => {
          setCandies(prev => {
            const remaining = prev.filter(c => !toMatch.includes(c.id));
            const newCandies: Candy[] = [];

            // Drop existing candies
            for (let col = 0; col < gridSize; col++) {
              const colCandies = remaining.filter(c => c.col === col).sort((a, b) => b.row - a.row);
              let nextRow = gridSize - 1;

              colCandies.forEach(candy => {
                newCandies.push({ ...candy, row: nextRow });
                nextRow--;
              });

              // Add new candies at top
              while (nextRow >= 0) {
                newCandies.push({
                  id: `${nextRow}-${col}-${Date.now()}-${Math.random()}`,
                  color: CANDY_COLORS[Math.floor(Math.random() * CANDY_COLORS.length)] as string,
                  col,
                  row: nextRow,
                });
                nextRow--;
              }
            }

            return newCandies;
          });
          setMatching([]);
          setSparkles([]);
        }, 400);
      }
    }, 1800);

    return () => clearInterval(interval);
  }, [candies, candySize, gap]);

  return (
    <div
      role="status"
      aria-label="Loading"
      className={className}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`} style={{ display: 'block' }}>
        <defs>
          {/* Sparkle gradient */}
          <radialGradient id={`sparkle-${size}`}>
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>

          {/* Shine effect for candies */}
          <radialGradient id={`candy-shine-${size}`}>
            <stop offset="0%" stopColor="#fff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Grid background */}
        <rect width={dim} height={dim} fill="transparent" />

        {/* Candies */}
        <AnimatePresence mode="popLayout">
          {candies.map(candy => {
            const x = candy.col * (candySize + gap) + gap;
            const y = candy.row * (candySize + gap) + gap;
            const isMatching = matching.includes(candy.id);

            return (
              <motion.g
                key={candy.id}
                initial={{ y: -candySize * 2, opacity: 0, scale: 0.5 }}
                animate={{
                  x,
                  y,
                  opacity: isMatching ? 0 : 1,
                  scale: isMatching ? 1.5 : 1,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                  opacity: { duration: 0.2 },
                }}
              >
                {/* Candy body */}
                <motion.circle
                  cx={candySize / 2}
                  cy={candySize / 2}
                  r={candySize / 2.5}
                  fill={candy.color}
                  animate={
                    isMatching ? { scale: [1, 1.2, 0], rotate: [0, 180] } : { scale: [1, 1.05, 1] }
                  }
                  transition={
                    isMatching
                      ? { duration: 0.4 }
                      : { duration: DURATION.slow, repeat: Infinity, ease: 'easeInOut' }
                  }
                />

                {/* Shine effect */}
                <motion.ellipse
                  cx={candySize / 3}
                  cy={candySize / 3}
                  rx={candySize / 6}
                  ry={candySize / 8}
                  fill={`url(#candy-shine-${size})`}
                  opacity={0.8}
                />

                {/* Sweet detail - tiny highlight */}
                <motion.circle
                  cx={candySize / 2.5}
                  cy={candySize / 2.5}
                  r={candySize / 12}
                  fill="#fff"
                  opacity={0.5}
                />
              </motion.g>
            );
          })}
        </AnimatePresence>

        {/* Sparkle effects when matching */}
        <AnimatePresence>
          {sparkles.map(sparkle => (
            <motion.g key={sparkle.id}>
              {/* Central burst */}
              <motion.circle
                cx={sparkle.x}
                cy={sparkle.y}
                r={candySize / 3}
                fill={`url(#sparkle-${size})`}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 3, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />

              {/* Star particles */}
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i * Math.PI * 2) / 8;
                const distance = candySize * 0.8;
                return (
                  <motion.circle
                    key={i}
                    cx={sparkle.x}
                    cy={sparkle.y}
                    r={candySize / 10}
                    fill="#fbbf24"
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: Math.cos(angle) * distance,
                      y: Math.sin(angle) * distance,
                      opacity: 0,
                      scale: 0,
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                );
              })}
            </motion.g>
          ))}
        </AnimatePresence>
      </svg>
    </div>
  );
}
