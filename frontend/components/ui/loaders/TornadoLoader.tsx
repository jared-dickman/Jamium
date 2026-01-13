'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function TornadoLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox="0 0 100 100">
        <motion.ellipse
          cx="50"
          cy="25"
          rx="35"
          ry="6"
          fill="none"
          stroke={SAPPHIRE[0]}
          strokeWidth="2"
          animate={{ rx: [35, 30, 35], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.ellipse
          cx="50"
          cy="50"
          rx="25"
          ry="5"
          fill="none"
          stroke={SAPPHIRE[1]}
          strokeWidth="2"
          animate={{ rx: [25, 20, 25], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        />
        <motion.ellipse
          cx="50"
          cy="75"
          rx="15"
          ry="4"
          fill="none"
          stroke={SAPPHIRE[2]}
          strokeWidth="2"
          animate={{ rx: [15, 10, 15], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        />
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          {[0, 1, 2, 3].map(i => (
            <motion.circle
              key={i}
              cx={50 + Math.cos((i * Math.PI) / 2) * 20}
              cy={50 + Math.sin((i * Math.PI) / 2) * 20}
              r="2"
              fill={SAPPHIRE[i % 4]}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.g>
      </svg>
    </div>
  );
}
