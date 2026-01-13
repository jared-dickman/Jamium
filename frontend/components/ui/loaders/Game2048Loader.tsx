'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

interface Tile {
  id: string;
  value: number;
  row: number;
  col: number;
}

export function Game2048Loader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const gridSize = 4;
  const tileSize = (dim * 0.85) / gridSize;
  const gap = tileSize * 0.1;
  const actualTileSize = tileSize - gap;

  const [tiles, setTiles] = useState<Tile[]>([
    { id: '1', value: 2, row: 0, col: 0 },
    { id: '2', value: 2, row: 1, col: 2 },
    { id: '3', value: 4, row: 2, col: 1 },
  ]);

  const getTileColor = (value: number) => {
    if (value === 2) return SAPPHIRE[0];
    if (value === 4) return SAPPHIRE[1];
    if (value === 8) return SAPPHIRE[2];
    return SAPPHIRE[3]; // 16+
  };

  const getTilePosition = (row: number, col: number) => ({
    x: col * tileSize + gap / 2,
    y: row * tileSize + gap / 2,
  });

  useEffect(() => {
    let tileIdCounter = 4;
    const directions = ['right', 'down', 'left', 'up'] as const;
    let directionIndex = 0;

    const interval = setInterval(() => {
      setTiles(prev => {
        const direction = directions[directionIndex % directions.length];
        directionIndex++;

        // Simple slide and merge simulation
        let newTiles = [...prev];

        // Move tiles in the specified direction
        if (direction === 'right') {
          newTiles = newTiles.map(t => ({ ...t, col: Math.min(3, t.col + 1) }));
        } else if (direction === 'left') {
          newTiles = newTiles.map(t => ({ ...t, col: Math.max(0, t.col - 1) }));
        } else if (direction === 'down') {
          newTiles = newTiles.map(t => ({ ...t, row: Math.min(3, t.row + 1) }));
        } else if (direction === 'up') {
          newTiles = newTiles.map(t => ({ ...t, row: Math.max(0, t.row - 1) }));
        }

        // Check for merges (tiles at same position)
        const merged = new Set<string>();
        const mergedTiles: Tile[] = [];

        newTiles.forEach((tile, i) => {
          if (merged.has(tile.id)) return;

          const samePosition = newTiles.find(
            (t, j) =>
              j > i &&
              t.row === tile.row &&
              t.col === tile.col &&
              t.value === tile.value &&
              !merged.has(t.id)
          );

          if (samePosition) {
            // Merge!
            mergedTiles.push({
              id: `${tileIdCounter++}`,
              value: tile.value * 2,
              row: tile.row,
              col: tile.col,
            });
            merged.add(tile.id);
            merged.add(samePosition.id);
          } else if (!merged.has(tile.id)) {
            mergedTiles.push(tile);
          }
        });

        // Add new random tile occasionally
        if (Math.random() > 0.6 && mergedTiles.length < 8) {
          const emptyCells: { row: number; col: number }[] = [];
          for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
              if (!mergedTiles.some(t => t.row === r && t.col === c)) {
                emptyCells.push({ row: r, col: c });
              }
            }
          }
          if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            if (randomCell) {
              mergedTiles.push({
                id: `${tileIdCounter++}`,
                value: Math.random() > 0.5 ? 2 : 4,
                row: randomCell.row,
                col: randomCell.col,
              });
            }
          }
        }

        return mergedTiles;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      role="status"
      aria-label="Loading"
      className={className}
      style={{ width: dim, height: dim }}
    >
      <svg
        width={dim * 0.85}
        height={dim * 0.85}
        viewBox={`0 0 ${dim * 0.85} ${dim * 0.85}`}
        style={{ display: 'block', margin: `${dim * 0.075}px` }}
      >
        {/* Grid background */}
        {Array.from({ length: 16 }, (_, i) => {
          const row = Math.floor(i / gridSize);
          const col = i % gridSize;
          const pos = getTilePosition(row, col);
          return (
            <rect
              key={`bg-${i}`}
              x={pos.x}
              y={pos.y}
              width={actualTileSize}
              height={actualTileSize}
              rx={2}
              fill={SAPPHIRE[0]}
              opacity={0.15}
            />
          );
        })}

        {/* Animated tiles */}
        <AnimatePresence mode="popLayout">
          {tiles.map(tile => {
            const pos = getTilePosition(tile.row, tile.col);
            return (
              <motion.g key={tile.id}>
                <motion.rect
                  animate={{
                    x: pos.x,
                    y: pos.y,
                    scale: 1,
                    opacity: 1,
                  }}
                  initial={{ x: pos.x, y: pos.y, scale: 0, opacity: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  width={actualTileSize}
                  height={actualTileSize}
                  rx={2}
                  fill={getTileColor(tile.value)}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                  }}
                  style={{
                    originX: `${actualTileSize / 2}px`,
                    originY: `${actualTileSize / 2}px`,
                  }}
                />
                <motion.text
                  animate={{
                    x: pos.x + actualTileSize / 2,
                    y: pos.y + actualTileSize / 2,
                    scale: 1,
                    opacity: 1,
                  }}
                  initial={{
                    x: pos.x + actualTileSize / 2,
                    y: pos.y + actualTileSize / 2,
                    scale: 0,
                    opacity: 0,
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize={actualTileSize * 0.35}
                  fontWeight="bold"
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                  }}
                >
                  {tile.value}
                </motion.text>
              </motion.g>
            );
          })}
        </AnimatePresence>
      </svg>
    </div>
  );
}
