'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

export function ElectronLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const nucleusR = dim * 0.1;
  const electronR = dim * 0.04;
  const orbitRadii = [dim * 0.22, dim * 0.32, dim * 0.42];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center', className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        {/* Electron shells */}
        {orbitRadii.map((radius, i) => (
          <motion.ellipse
            key={`shell-${i}`}
            cx={dim / 2}
            cy={dim / 2}
            rx={radius}
            ry={radius * 0.3}
            fill="none"
            stroke={SAPPHIRE[3]}
            strokeWidth="0.5"
            opacity="0.25"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 6 - i,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{ originX: `${dim / 2}px`, originY: `${dim / 2}px` }}
          />
        ))}

        {/* Nucleus with protons/neutrons */}
        <g>
          {[0, 1, 2, 3].map(i => {
            const angle = (i * 90 * Math.PI) / 180;
            const offset = nucleusR * 0.3;
            const cx = dim / 2 + Math.cos(angle) * offset;
            const cy = dim / 2 + Math.sin(angle) * offset;

            return (
              <circle
                key={`nucleon-${i}`}
                cx={cx}
                cy={cy}
                r={nucleusR * 0.4}
                fill={i % 2 === 0 ? SAPPHIRE[0] : SAPPHIRE[1]}
              />
            );
          })}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={nucleusR}
            fill="none"
            stroke={SAPPHIRE[0]}
            strokeWidth="1.5"
            opacity="0.5"
          />
        </g>

        {/* Electrons in orbital motion */}
        {orbitRadii.map((radius, shellIdx) => {
          const electronCount = shellIdx + 2;
          return Array.from({ length: electronCount }).map((_, i) => {
            const angle = (i * (360 / electronCount) * Math.PI) / 180;

            return (
              <motion.ellipse
                key={`electron-${shellIdx}-${i}`}
                cx={dim / 2}
                cy={dim / 2}
                rx={electronR}
                ry={electronR}
                fill={SAPPHIRE[shellIdx + 1]}
                initial={{
                  offsetDistance: '0%',
                }}
                animate={{
                  rotate: [angle * (180 / Math.PI), angle * (180 / Math.PI) + 360],
                }}
                transition={{
                  duration: 3 + shellIdx * 0.5,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: (i / electronCount) * (3 + shellIdx * 0.5),
                }}
                style={{
                  originX: `${dim / 2}px`,
                  originY: `${dim / 2}px`,
                  offsetPath: `path("M ${dim / 2} ${dim / 2 - radius} Q ${dim / 2 + radius} ${dim / 2} ${dim / 2} ${dim / 2 + radius * 0.3} Q ${dim / 2 - radius} ${dim / 2} ${dim / 2} ${dim / 2 - radius} Z")`,
                }}
                transform={`rotate(${angle * (180 / Math.PI)} ${dim / 2} ${dim / 2})`}
              >
                <animateMotion
                  dur={`${3 + shellIdx * 0.5}s`}
                  repeatCount="indefinite"
                  path={`M ${dim / 2 + radius} ${dim / 2} A ${radius} ${radius * 0.3} 0 1 1 ${dim / 2 - radius} ${dim / 2} A ${radius} ${radius * 0.3} 0 1 1 ${dim / 2 + radius} ${dim / 2}`}
                  begin={`${(i / electronCount) * (3 + shellIdx * 0.5)}s`}
                />
              </motion.ellipse>
            );
          });
        })}

        {/* Energy emission pulses */}
        {[0, 1].map(i => (
          <motion.circle
            key={`pulse-${i}`}
            cx={dim / 2}
            cy={dim / 2}
            r={nucleusR}
            fill="none"
            stroke={SAPPHIRE[2]}
            strokeWidth="1.5"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{
              scale: [1, 3.5],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 1.25,
              ease: 'easeOut',
            }}
            style={{ originX: `${dim / 2}px`, originY: `${dim / 2}px` }}
          />
        ))}
      </svg>
    </div>
  );
}
