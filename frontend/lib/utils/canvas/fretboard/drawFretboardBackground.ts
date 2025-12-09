import { SAPPHIRE } from '@/lib/constants/canvas.constants';

export function drawFretboardBackground(
  ctx: CanvasRenderingContext2D,
  dimensions: {
    width: number;
    height: number;
    padding: number;
    fretboardWidth: number;
    fretboardHeight: number;
  }
): void {
  const { width, height, padding, fretboardWidth, fretboardHeight } = dimensions;

  // Background - Deep sapphire abyss
  ctx.fillStyle = SAPPHIRE.ABYSS;
  ctx.fillRect(0, 0, width, height);

  // Fretboard - Sapphire electric gradient
  const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
  gradient.addColorStop(0, SAPPHIRE.DEEP);
  gradient.addColorStop(0.5, SAPPHIRE.DARK);
  gradient.addColorStop(1, SAPPHIRE.DEEP);
  ctx.fillStyle = gradient;
  ctx.fillRect(padding, padding, fretboardWidth, fretboardHeight);

  // Subtle glow effect on edges
  const glowGradient = ctx.createLinearGradient(padding, 0, padding + fretboardWidth, 0);
  glowGradient.addColorStop(0, `${SAPPHIRE[900]}40`);
  glowGradient.addColorStop(0.5, `${SAPPHIRE[800]}20`);
  glowGradient.addColorStop(1, `${SAPPHIRE[900]}40`);
  ctx.fillStyle = glowGradient;
  ctx.fillRect(padding, padding, fretboardWidth, fretboardHeight);
}
