'use client';

import { useEffect, useRef, useState } from 'react';
import { SAPPHIRE, LOADER_SIZE, type LoaderProps } from '@/components/ui/loaders/loader.constants';

const WIN95_SAYINGS = [
  'Windows 95',
  'It is now safe',
  'to turn off',
  'your computer',
  'My Computer',
  'Recycle Bin',
  'Microsoft Plus!',
  'Paint',
  'Solitaire',
  'Minesweeper',
  'Defrag',
  'ScanDisk',
  'Start Me Up',
  '32-bit',
  'Plug and Play',
] as const;

export function ScreensaverLoader({ className, size = 'md' }: LoaderProps) {
  const dim = LOADER_SIZE[size];
  const logoWidth = dim * 0.75; // 3x bigger - takes up most of container
  const logoHeight = dim * 0.45; // 2.5x bigger - prominent and visible

  const [position, setPosition] = useState({
    x: dim / 2 - logoWidth / 2,
    y: dim / 2 - logoHeight / 2,
  });
  const [colorIndex, setColorIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const velocityRef = useRef({ x: 0.6, y: 0.5 });
  const [trail, setTrail] = useState<
    Array<{ x: number; y: number; color: string; opacity: number }>
  >([]);

  useEffect(() => {
    const animate = () => {
      setPosition(prev => {
        let newX = prev.x + velocityRef.current.x;
        let newY = prev.y + velocityRef.current.y;
        let bounced = false;

        // Check horizontal bounds
        if (newX <= 0) {
          newX = 0;
          velocityRef.current.x *= -1;
          bounced = true;
        } else if (newX + logoWidth >= dim) {
          newX = dim - logoWidth;
          velocityRef.current.x *= -1;
          bounced = true;
        }

        // Check vertical bounds
        if (newY <= 0) {
          newY = 0;
          velocityRef.current.y *= -1;
          bounced = true;
        } else if (newY + logoHeight >= dim) {
          newY = dim - logoHeight;
          velocityRef.current.y *= -1;
          bounced = true;
        }

        // Change color on bounce
        if (bounced) {
          setColorIndex(prev => (prev + 1) % SAPPHIRE.length);
          setTextIndex(prev => (prev + 1) % WIN95_SAYINGS.length);
        }

        // Add trail effect (Mystify-style)
        setTrail(prev => {
          const currentColor = SAPPHIRE[colorIndex] || '#3b82f6';
          const newTrail = [
            { x: newX + logoWidth / 2, y: newY + logoHeight / 2, color: currentColor, opacity: 1 },
            ...prev.map(t => ({ ...t, opacity: t.opacity * 0.92 })),
          ].slice(0, 15);
          return newTrail;
        });

        return { x: newX, y: newY };
      });
    };

    const interval = setInterval(animate, 16); // ~60fps
    return () => clearInterval(interval);
  }, [dim, logoWidth, logoHeight, colorIndex]);

  return (
    <div
      role="status"
      aria-label="Loading"
      className={className}
      style={{
        width: dim,
        height: dim,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#000',
      }}
    >
      {/* Mystify trails */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
        {trail.map((point, i) => {
          const nextPoint = trail[i + 1];
          return nextPoint ? (
            <line
              key={i}
              x1={point.x}
              y1={point.y}
              x2={nextPoint.x}
              y2={nextPoint.y}
              stroke={point.color}
              strokeWidth={dim * 0.008}
              opacity={point.opacity * 0.6}
              strokeLinecap="round"
            />
          ) : null;
        })}
      </svg>

      {/* Windows 95 styled window */}
      <div
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          width: logoWidth,
          height: logoHeight,
          // Classic Win95 gray
          backgroundColor: '#C0C0C0',
          // Win95 3D raised border effect
          border: `${dim * 0.005}px solid`,
          borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
          boxShadow: `
            inset ${dim * 0.003}px ${dim * 0.003}px 0 #DFDFDF,
            inset -${dim * 0.003}px -${dim * 0.003}px 0 #000000
          `,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Title bar */}
        <div
          style={{
            background: `linear-gradient(90deg, ${SAPPHIRE[colorIndex]} 0%, ${SAPPHIRE[(colorIndex + 1) % SAPPHIRE.length]} 100%)`,
            height: logoHeight * 0.3,
            display: 'flex',
            alignItems: 'center',
            padding: `0 ${dim * 0.01}px`,
            gap: dim * 0.01,
          }}
        >
          {/* Window icon */}
          <div
            style={{
              width: logoHeight * 0.2,
              height: logoHeight * 0.2,
              backgroundColor: 'white',
              border: `${dim * 0.002}px solid #000`,
            }}
          />
          {/* Title text */}
          <div
            style={{
              fontSize: dim * 0.045,
              fontWeight: 'bold',
              color: 'white',
              flex: 1,
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {WIN95_SAYINGS[textIndex]}
          </div>
          {/* Close button */}
          <div
            style={{
              width: logoHeight * 0.25,
              height: logoHeight * 0.22,
              backgroundColor: '#C0C0C0',
              border: `${dim * 0.003}px solid`,
              borderColor: '#FFFFFF #000000 #000000 #FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: dim * 0.04,
              fontWeight: 'bold',
            }}
          >
            ×
          </div>
        </div>

        {/* Window content area */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
            margin: dim * 0.005,
            border: `${dim * 0.003}px solid`,
            borderColor: '#808080 #FFFFFF #FFFFFF #808080',
          }}
        >
          {/* Windows logo squares */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: dim * 0.008 }}>
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                style={{
                  width: dim * 0.08,
                  height: dim * 0.08,
                  backgroundColor: SAPPHIRE[colorIndex],
                  transform: `rotate(${i * 2}deg)`,
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
