'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { analyzeChord, getChordColor } from '@/lib/music-theory/intelligentChordEngine';

interface ChordWheelProps {
  currentChord?: string;
  suggestedChords?: string[];
  onChordClick?: (chord: string) => void;
  width?: number;
  height?: number;
}

/**
 * 🎨 CHORD WHEEL VISUALIZATION
 *
 * A stunning D3.js circular visualization showing:
 * - Circle of fifths layout
 * - Current chord highlighted
 * - Suggested next chords with glow
 * - Interactive click to explore
 * - Smooth animations
 * - Color-coded by chord quality
 */
export default function ChordWheel({
  currentChord,
  suggestedChords = [],
  onChordClick,
  width = 600,
  height = 600,
}: ChordWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredChord, setHoveredChord] = useState<string | null>(null);
  const [containerSize, setContainerSize] = useState({ width, height });

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const size = Math.min(rect.width, 600);
        setContainerSize({ width: size, height: size });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const effectiveWidth = containerSize.width;
  const effectiveHeight = containerSize.height;

  // Circle of fifths order
  const circleOfFifths = ['C', 'G', 'D', 'A', 'E', 'B', 'F♯/G♭', 'D♭', 'A♭', 'E♭', 'B♭', 'F'];

  // Inner circle: minor chords
  const minorCircle = [
    'Am',
    'Em',
    'Bm',
    'F♯m',
    'C♯m',
    'G♯m',
    'D♯m/E♭m',
    'B♭m',
    'Fm',
    'Cm',
    'Gm',
    'Dm',
  ];

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const centerX = effectiveWidth / 2;
    const centerY = effectiveHeight / 2;
    const outerRadius = Math.min(effectiveWidth, effectiveHeight) / 2 - 50;
    const innerRadius = outerRadius * 0.6;

    // Scale factor for circles/fonts based on container size (baseline 600px)
    const scaleFactor = effectiveWidth / 600;

    // Create main group
    const g = svg.append('g').attr('transform', `translate(${centerX},${centerY})`);

    // Add gradient definitions
    const defs = svg.append('defs');

    // Glow filter for highlighted chords
    const glowFilter = defs.append('filter').attr('id', 'glow');
    glowFilter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'coloredBlur');
    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Draw major chords (outer circle)
    circleOfFifths.forEach((chord, i) => {
      const angle = (i * 360) / 12 - 90; // Start at top
      const angleRad = (angle * Math.PI) / 180;
      const x = outerRadius * Math.cos(angleRad);
      const y = outerRadius * Math.sin(angleRad);

      const normalizedChord = chord.replace('♯', '#').replace('♭', 'b');
      const chordRoot = normalizedChord.split(/[^A-G#b]/)[0] ?? normalizedChord;
      const analysis = analyzeChord(normalizedChord);
      const isCurrentChord =
        currentChord && currentChord.replace('♯', '#').replace('♭', 'b') === normalizedChord;
      const isSuggested = suggestedChords.some(sc => {
        const normalizedSuggested = sc.replace('♯', '#').replace('♭', 'b');
        return normalizedSuggested.startsWith(chordRoot);
      });

      // Draw connecting line
      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', x * 0.85)
        .attr('y2', y * 0.85)
        .attr('stroke', '#374151')
        .attr('stroke-width', 1)
        .attr('opacity', 0.2);

      // Draw chord circle
      const circle = g
        .append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', (isCurrentChord ? 32 : 28) * scaleFactor)
        .attr('fill', analysis ? getChordColor(analysis.quality) : '#6B7280')
        .attr('stroke', isCurrentChord ? '#FBBF24' : isSuggested ? '#10B981' : '#374151')
        .attr('stroke-width', isCurrentChord ? 4 : isSuggested ? 3 : 2)
        .attr('opacity', isCurrentChord ? 1 : isSuggested ? 0.9 : 0.7)
        .attr('filter', isCurrentChord || isSuggested ? 'url(#glow)' : 'none')
        .style('cursor', 'pointer')
        .on('mouseenter', () => setHoveredChord(chord))
        .on('mouseleave', () => setHoveredChord(null))
        .on('click', () => onChordClick?.(chord.replace('♯', '#').replace('♭', 'b')));

      // Pulse animation for current chord
      if (isCurrentChord) {
        circle
          .append('animate')
          .attr('attributeName', 'r')
          .attr('values', `${32 * scaleFactor};${36 * scaleFactor};${32 * scaleFactor}`)
          .attr('dur', '2s')
          .attr('repeatCount', 'indefinite');
      }

      // Draw chord label
      g.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'white')
        .attr('font-size', `${14 * scaleFactor}px`)
        .attr('font-weight', isCurrentChord ? 'bold' : 'normal')
        .attr('pointer-events', 'none')
        .text(chord);
    });

    // Draw minor chords (inner circle)
    minorCircle.forEach((chord, i) => {
      const angle = (i * 360) / 12 - 90;
      const angleRad = (angle * Math.PI) / 180;
      const x = innerRadius * Math.cos(angleRad);
      const y = innerRadius * Math.sin(angleRad);

      const normalizedChord = chord.replace('♯', '#').replace('♭', 'b');
      const analysis = analyzeChord(normalizedChord);
      const isCurrentChord =
        currentChord && currentChord.replace('♯', '#').replace('♭', 'b') === normalizedChord;
      const isSuggested = suggestedChords.some(
        sc => sc.replace('♯', '#').replace('♭', 'b') === chord.replace('♯', '#').replace('♭', 'b')
      );

      // Draw chord circle
      g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', (isCurrentChord ? 28 : 24) * scaleFactor)
        .attr('fill', analysis ? getChordColor(analysis.quality) : '#6B7280')
        .attr('stroke', isCurrentChord ? '#FBBF24' : isSuggested ? '#10B981' : '#374151')
        .attr('stroke-width', isCurrentChord ? 4 : isSuggested ? 3 : 2)
        .attr('opacity', isCurrentChord ? 1 : isSuggested ? 0.9 : 0.6)
        .attr('filter', isCurrentChord || isSuggested ? 'url(#glow)' : 'none')
        .style('cursor', 'pointer')
        .on('mouseenter', () => setHoveredChord(chord))
        .on('mouseleave', () => setHoveredChord(null))
        .on('click', () => onChordClick?.(chord.replace('♯', '#').replace('♭', 'b')));

      // Draw chord label
      g.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'white')
        .attr('font-size', `${12 * scaleFactor}px`)
        .attr('font-weight', isCurrentChord ? 'bold' : 'normal')
        .attr('pointer-events', 'none')
        .text(chord);
    });

    // Draw center circle
    g.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', innerRadius * 0.5)
      .attr('fill', '#1F2937')
      .attr('stroke', '#374151')
      .attr('stroke-width', 2);

    // Center label
    g.append('text')
      .attr('x', 0)
      .attr('y', -10 * scaleFactor)
      .attr('text-anchor', 'middle')
      .attr('fill', '#9CA3AF')
      .attr('font-size', `${16 * scaleFactor}px`)
      .attr('font-weight', 'bold')
      .text('Circle of');

    g.append('text')
      .attr('x', 0)
      .attr('y', 10 * scaleFactor)
      .attr('text-anchor', 'middle')
      .attr('fill', '#9CA3AF')
      .attr('font-size', `${16 * scaleFactor}px`)
      .attr('font-weight', 'bold')
      .text('Fifths');

    // Legend - horizontal at bottom center
    const legend = svg
      .append('g')
      .attr('transform', `translate(${effectiveWidth / 2 - 150 * scaleFactor}, ${effectiveHeight - 30 * scaleFactor})`);

    const legendData = [
      { label: 'Current', color: '#FBBF24' },
      { label: 'Suggested', color: '#10B981' },
      { label: 'Major', color: 'var(--sapphire-500)' },
      { label: 'Minor', color: '#8B5CF6' },
    ];

    legendData.forEach((item, i) => {
      const xOffset = i * 80 * scaleFactor;
      legend.append('circle').attr('cx', xOffset).attr('cy', 0).attr('r', 6 * scaleFactor).attr('fill', item.color);

      legend
        .append('text')
        .attr('x', xOffset + 12 * scaleFactor)
        .attr('y', 0)
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#9CA3AF')
        .attr('font-size', `${11 * scaleFactor}px`)
        .text(item.label);
    });
  }, [currentChord, suggestedChords, effectiveWidth, effectiveHeight, onChordClick]);

  return (
    <div ref={containerRef} className="relative w-full max-w-[600px] mx-auto">
      <svg
        ref={svgRef}
        width={effectiveWidth}
        height={effectiveHeight}
        className="bg-gray-900 rounded-lg w-full"
        viewBox={`0 0 ${effectiveWidth} ${effectiveHeight}`}
      />
      {hoveredChord && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 px-4 py-2 rounded-lg shadow-lg border border-gray-700">
          <p className="text-sm text-white font-medium">{hoveredChord}</p>
        </div>
      )}
    </div>
  );
}
