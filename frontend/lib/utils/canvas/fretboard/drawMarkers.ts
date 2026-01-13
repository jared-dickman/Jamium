import { SAPPHIRE } from '@/lib/constants/canvas.constants';

const MARKER_FRETS = [3, 5, 7, 9, 12];
const MARKER_RADIUS = 7;
const DOUBLE_MARKER_FRET = 12;

export function drawMarkers(
  ctx: CanvasRenderingContext2D,
  config: {
    padding: number;
    height: number;
    fretWidth: number;
    stringSpacing: number;
    startFret: number;
    endFret: number;
  }
): void {
  const { padding, height, fretWidth, stringSpacing, startFret, endFret } = config;

  MARKER_FRETS.forEach(fret => {
    if (fret > startFret && fret <= endFret) {
      const fretIndex = fret - startFret;
      const x = padding + (fretIndex - 0.5) * fretWidth;

      const drawMarker = (markerX: number, markerY: number) => {
        // Glow effect
        const glowGradient = ctx.createRadialGradient(
          markerX,
          markerY,
          0,
          markerX,
          markerY,
          MARKER_RADIUS * 2
        );
        glowGradient.addColorStop(0, `${SAPPHIRE[700]}60`);
        glowGradient.addColorStop(1, `${SAPPHIRE[700]}00`);
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(markerX, markerY, MARKER_RADIUS * 2, 0, Math.PI * 2);
        ctx.fill();

        // Main marker
        const markerGradient = ctx.createRadialGradient(
          markerX,
          markerY,
          0,
          markerX,
          markerY,
          MARKER_RADIUS
        );
        markerGradient.addColorStop(0, SAPPHIRE[800]);
        markerGradient.addColorStop(0.7, SAPPHIRE[900]);
        markerGradient.addColorStop(1, SAPPHIRE.DARK);
        ctx.fillStyle = markerGradient;
        ctx.beginPath();
        ctx.arc(markerX, markerY, MARKER_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      };

      if (fret === DOUBLE_MARKER_FRET) {
        drawMarker(x, height / 2 - stringSpacing);
        drawMarker(x, height / 2 + stringSpacing);
      } else {
        drawMarker(x, height / 2);
      }
    }
  });
}
