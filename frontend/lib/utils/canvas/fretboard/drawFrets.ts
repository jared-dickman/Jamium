import { SAPPHIRE } from '@/lib/constants/canvas.constants';

const NUT_WIDTH = 6;
const FRET_WIDTH = 2.5;

export function drawFrets(
  ctx: CanvasRenderingContext2D,
  config: {
    padding: number;
    height: number;
    fretWidth: number;
    visibleFrets: number;
    startFret: number;
  }
): void {
  const { padding, height, fretWidth, visibleFrets, startFret } = config;

  for (let i = 0; i <= visibleFrets; i++) {
    const x = padding + i * fretWidth;
    const isNut = i === 0 && startFret === 0;

    if (isNut) {
      // Nut with electric sapphire gradient
      const nutGradient = ctx.createLinearGradient(x - NUT_WIDTH / 2, padding, x + NUT_WIDTH / 2, height - padding);
      nutGradient.addColorStop(0, SAPPHIRE[500]);
      nutGradient.addColorStop(0.5, SAPPHIRE[400]);
      nutGradient.addColorStop(1, SAPPHIRE[500]);
      ctx.strokeStyle = nutGradient;
      ctx.lineWidth = NUT_WIDTH;
    } else {
      // Regular frets with sapphire metallic look
      ctx.strokeStyle = SAPPHIRE[600];
      ctx.lineWidth = FRET_WIDTH;
    }

    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, height - padding);
    ctx.stroke();
  }
}
