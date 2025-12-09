import { SAPPHIRE } from '@/lib/constants/canvas.constants';

const STRING_COUNT = 6;
const STRING_WIDTH_BASE = 1.2;
const STRING_WIDTH_INCREMENT = 0.5;

export function drawStrings(
  ctx: CanvasRenderingContext2D,
  dimensions: {
    width: number;
    padding: number;
    stringSpacing: number;
    isInverted?: boolean;
  }
): void {
  const { width, padding, stringSpacing, isInverted = false } = dimensions;

  for (let i = 0; i < STRING_COUNT; i++) {
    const stringPosition = isInverted ? STRING_COUNT - 1 - i : i;
    const y = padding + stringPosition * stringSpacing;
    const stringWidth = STRING_WIDTH_BASE + (STRING_COUNT - 1 - i) * STRING_WIDTH_INCREMENT;

    // Gradient from sapphire to brighter sapphire for metallic look
    const gradient = ctx.createLinearGradient(padding, y - stringWidth / 2, padding, y + stringWidth / 2);
    gradient.addColorStop(0, SAPPHIRE[200]);
    gradient.addColorStop(0.5, SAPPHIRE[300]);
    gradient.addColorStop(1, SAPPHIRE[200]);
    ctx.strokeStyle = gradient;

    ctx.lineWidth = stringWidth;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }
}
