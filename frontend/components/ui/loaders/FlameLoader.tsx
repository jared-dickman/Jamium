'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function FlameLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox="0 0 100 100">
        {/* Outer flame layer - coolest */}
        <motion.path
          d="M36,80 Q32,56 36,42 Q38,30 42,24 Q45,30 48,26 Q52,20 55,18 Q58,22 62,26 Q65,30 68,24 Q72,30 74,42 Q78,56 74,80 Z"
          fill={SAPPHIRE[0]}
          opacity="0.5"
          animate={{
            d: [
              'M36,80 Q32,56 36,42 Q38,30 42,24 Q45,30 48,26 Q52,20 55,18 Q58,22 62,26 Q65,30 68,24 Q72,30 74,42 Q78,56 74,80 Z',
              'M35,80 Q31,55 35,41 Q37,29 41,23 Q44,29 47,25 Q51,19 55,17 Q59,21 63,25 Q66,29 69,23 Q73,29 75,41 Q79,55 75,80 Z',
              'M37,80 Q33,57 37,43 Q39,31 43,25 Q46,31 49,27 Q53,21 55,19 Q57,23 61,27 Q64,31 67,25 Q71,31 73,43 Q77,57 73,80 Z',
              'M36,80 Q32,56 36,42 Q38,30 42,24 Q45,30 48,26 Q52,20 55,18 Q58,22 62,26 Q65,30 68,24 Q72,30 74,42 Q78,56 74,80 Z',
            ],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Middle-outer flame layer */}
        <motion.path
          d="M40,78 Q37,58 40,46 Q42,36 45,30 Q47,35 50,32 Q53,26 55,24 Q57,28 60,32 Q62,35 65,30 Q68,36 70,46 Q73,58 70,78 Z"
          fill={SAPPHIRE[1]}
          opacity="0.6"
          animate={{
            d: [
              'M40,78 Q37,58 40,46 Q42,36 45,30 Q47,35 50,32 Q53,26 55,24 Q57,28 60,32 Q62,35 65,30 Q68,36 70,46 Q73,58 70,78 Z',
              'M39,78 Q36,57 39,45 Q41,35 44,29 Q46,34 49,31 Q52,25 55,23 Q58,27 61,31 Q63,34 66,29 Q69,35 71,45 Q74,57 71,78 Z',
              'M41,78 Q38,59 41,47 Q43,37 46,31 Q48,36 51,33 Q54,27 55,25 Q56,29 59,33 Q61,36 64,31 Q67,37 69,47 Q72,59 69,78 Z',
              'M40,78 Q37,58 40,46 Q42,36 45,30 Q47,35 50,32 Q53,26 55,24 Q57,28 60,32 Q62,35 65,30 Q68,36 70,46 Q73,58 70,78 Z',
            ],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.3,
          }}
        />

        {/* Middle-inner flame layer */}
        <motion.path
          d="M44,76 Q42,60 44,50 Q46,42 48,37 Q50,41 52,38 Q54,33 55,31 Q56,35 58,38 Q60,41 62,37 Q64,42 66,50 Q68,60 66,76 Z"
          fill={SAPPHIRE[2]}
          opacity="0.7"
          animate={{
            d: [
              'M44,76 Q42,60 44,50 Q46,42 48,37 Q50,41 52,38 Q54,33 55,31 Q56,35 58,38 Q60,41 62,37 Q64,42 66,50 Q68,60 66,76 Z',
              'M43,76 Q41,59 43,49 Q45,41 47,36 Q49,40 51,37 Q53,32 55,30 Q57,34 59,37 Q61,40 63,36 Q65,41 67,49 Q69,59 67,76 Z',
              'M45,76 Q43,61 45,51 Q47,43 49,38 Q51,42 53,39 Q55,34 55,32 Q55,36 57,39 Q59,42 61,38 Q63,43 65,51 Q67,61 65,76 Z',
              'M44,76 Q42,60 44,50 Q46,42 48,37 Q50,41 52,38 Q54,33 55,31 Q56,35 58,38 Q60,41 62,37 Q64,42 66,50 Q68,60 66,76 Z',
            ],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.6,
          }}
        />

        {/* Core flame - hottest (brightest) */}
        <motion.path
          d="M48,74 Q47,63 48,54 Q49,48 51,44 Q52,46 53,45 Q54,41 55,39 Q56,43 57,45 Q58,46 59,44 Q60,48 61,54 Q62,63 61,74 Z"
          fill={SAPPHIRE[3]}
          opacity="0.85"
          animate={{
            d: [
              'M48,74 Q47,63 48,54 Q49,48 51,44 Q52,46 53,45 Q54,41 55,39 Q56,43 57,45 Q58,46 59,44 Q60,48 61,54 Q62,63 61,74 Z',
              'M47,74 Q46,62 47,53 Q48,47 50,43 Q51,45 52,44 Q53,40 55,38 Q57,42 58,44 Q59,45 60,43 Q61,47 62,53 Q63,62 62,74 Z',
              'M49,74 Q48,64 49,55 Q50,49 52,45 Q53,47 54,46 Q55,42 55,40 Q55,44 56,46 Q57,47 58,45 Q59,49 60,55 Q61,64 60,74 Z',
              'M48,74 Q47,63 48,54 Q49,48 51,44 Q52,46 53,45 Q54,41 55,39 Q56,43 57,45 Q58,46 59,44 Q60,48 61,54 Q62,63 61,74 Z',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.9,
          }}
        />

        {/* Fire base glow */}
        <motion.ellipse
          cx="55"
          cy="78"
          rx="15"
          ry="3"
          fill={SAPPHIRE[1]}
          opacity="0.35"
          animate={{
            rx: [14, 16, 15, 16, 14],
            opacity: [0.3, 0.4, 0.35, 0.4, 0.3],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
}
