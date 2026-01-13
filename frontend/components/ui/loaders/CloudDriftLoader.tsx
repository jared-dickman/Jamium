'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function CloudDriftLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];

  // Fluffy, puffy cloud with overlapping circles for organic shape
  const Cloud = ({
    x,
    y,
    scale = 1,
    delay = 0,
    duration = 8,
    layer = 1,
  }: {
    x: number;
    y: number;
    scale?: number;
    delay?: number;
    duration?: number;
    layer?: number;
  }) => (
    <motion.g
      animate={{
        x: [-30, 130],
        y: [0, Math.sin(delay) * 2, 0],
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
        delay,
      }}
    >
      {/* Puffy cloud - multiple overlapping puffs for realistic shape */}
      {/* Bottom layer - larger puffs */}
      <ellipse
        cx={x}
        cy={y + 4 * scale}
        rx={10 * scale}
        ry={7 * scale}
        fill={SAPPHIRE[layer % 4]}
        opacity="0.7"
      />
      <ellipse
        cx={x + 12 * scale}
        cy={y + 5 * scale}
        rx={11 * scale}
        ry={8 * scale}
        fill={SAPPHIRE[(layer + 1) % 4]}
        opacity="0.75"
      />
      <ellipse
        cx={x + 24 * scale}
        cy={y + 4 * scale}
        rx={10 * scale}
        ry={7 * scale}
        fill={SAPPHIRE[layer % 4]}
        opacity="0.7"
      />

      {/* Top layer - smaller puffs creating fluffy top */}
      <circle
        cx={x + 4 * scale}
        cy={y}
        r={8 * scale}
        fill={SAPPHIRE[(layer + 2) % 4]}
        opacity="0.8"
      />
      <circle
        cx={x + 12 * scale}
        cy={y - 2 * scale}
        r={9 * scale}
        fill={SAPPHIRE[(layer + 3) % 4]}
        opacity="0.85"
      />
      <circle
        cx={x + 20 * scale}
        cy={y - 1 * scale}
        r={8 * scale}
        fill={SAPPHIRE[(layer + 2) % 4]}
        opacity="0.8"
      />
      <circle
        cx={x + 28 * scale}
        cy={y + 1 * scale}
        r={7 * scale}
        fill={SAPPHIRE[(layer + 1) % 4]}
        opacity="0.75"
      />

      {/* Middle puffs for depth */}
      <circle
        cx={x + 8 * scale}
        cy={y + 2 * scale}
        r={6 * scale}
        fill={SAPPHIRE[(layer + 1) % 4]}
        opacity="0.65"
      />
      <circle
        cx={x + 16 * scale}
        cy={y + 1 * scale}
        r={7 * scale}
        fill={SAPPHIRE[(layer + 2) % 4]}
        opacity="0.7"
      />
      <circle
        cx={x + 24 * scale}
        cy={y + 2 * scale}
        r={6 * scale}
        fill={SAPPHIRE[(layer + 1) % 4]}
        opacity="0.65"
      />
    </motion.g>
  );

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center overflow-hidden', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox="0 0 100 100">
        {/* Back layer - slowest, smallest, most distant */}
        <Cloud x={5} y={22} scale={0.45} duration={14} delay={0} layer={0} />
        <Cloud x={35} y={20} scale={0.5} duration={16} delay={4} layer={0} />

        {/* Middle layer - medium speed and size */}
        <Cloud x={0} y={48} scale={0.7} duration={10} delay={1.5} layer={1} />
        <Cloud x={30} y={50} scale={0.75} duration={11} delay={5} layer={1} />

        {/* Front layer - fastest, largest, closest */}
        <Cloud x={-5} y={70} scale={0.95} duration={8} delay={0.8} layer={2} />
        <Cloud x={25} y={72} scale={1.0} duration={9} delay={4.5} layer={2} />
      </svg>
    </div>
  );
}
