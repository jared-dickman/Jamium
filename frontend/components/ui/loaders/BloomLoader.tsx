'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function BloomLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox="0 0 100 100">
        <motion.g
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          {[0, 1, 2, 3, 4, 5].map(i => {
            const angle = (i * 60 * Math.PI) / 180;
            const x = 50 + Math.cos(angle) * 25;
            const y = 50 + Math.sin(angle) * 25;
            return (
              <motion.ellipse
                key={i}
                cx={x}
                cy={y}
                rx="8"
                ry="15"
                fill={SAPPHIRE[i % 4]}
                opacity="0.7"
                transform={`rotate(${i * 60} ${x} ${y})`}
                animate={{
                  opacity: [0.4, 0.9, 0.4],
                  ry: [12, 18, 12],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            );
          })}
        </motion.g>
        <motion.circle
          cx="50"
          cy="50"
          r="8"
          fill={SAPPHIRE[1]}
          animate={{ r: [6, 10, 6], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="15"
          fill="none"
          stroke={SAPPHIRE[2]}
          strokeWidth="1.5"
          opacity="0.4"
          animate={{ r: [12, 20, 12], opacity: [0, 0.5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
        />
      </svg>
    </div>
  );
}
