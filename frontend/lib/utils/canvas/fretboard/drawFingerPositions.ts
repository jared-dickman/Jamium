import { FINGER_COLORS, SAPPHIRE } from '@/lib/constants/canvas.constants';

const MUTED_STRING = -1;
const OPEN_STRING = 0;
const MUTED_SYMBOL_SIZE = 8;
const OPEN_SYMBOL_RADIUS = 8;
const FINGER_DOT_RADIUS = 12;
const BARRE_LINE_WIDTH = 20;
const BARRE_OPACITY = 0.7;
const STRING_COUNT = 6;

interface Barre {
  fret: number;
  fromString: number;
  toString: number;
}

export function drawMutedString(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.strokeStyle = SAPPHIRE[600];
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x - MUTED_SYMBOL_SIZE, y - MUTED_SYMBOL_SIZE);
  ctx.lineTo(x + MUTED_SYMBOL_SIZE, y + MUTED_SYMBOL_SIZE);
  ctx.moveTo(x + MUTED_SYMBOL_SIZE, y - MUTED_SYMBOL_SIZE);
  ctx.lineTo(x - MUTED_SYMBOL_SIZE, y + MUTED_SYMBOL_SIZE);
  ctx.stroke();
}

export function drawOpenString(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  // Draw outer circle with gradient
  ctx.strokeStyle = SAPPHIRE[400];
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(x, y, OPEN_SYMBOL_RADIUS, 0, Math.PI * 2);
  ctx.stroke();

  // Fill with subtle glow
  ctx.fillStyle = `${SAPPHIRE[500]}30`;
  ctx.fill();
}

export function drawFrettedNote(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  finger: number,
  showFingerNumbers: boolean
): void {
  const color =
    finger > 0 && finger <= 4 ? (FINGER_COLORS[finger] ?? FINGER_COLORS[0]) : FINGER_COLORS[0];

  // Draw glow effect
  const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, FINGER_DOT_RADIUS * 1.5);
  glowGradient.addColorStop(0, `${color ?? SAPPHIRE[500]}80`);
  glowGradient.addColorStop(1, `${color ?? SAPPHIRE[500]}00`);
  ctx.fillStyle = glowGradient;
  ctx.beginPath();
  ctx.arc(x, y, FINGER_DOT_RADIUS * 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Draw main dot
  ctx.fillStyle = color ?? SAPPHIRE[500];
  ctx.beginPath();
  ctx.arc(x, y, FINGER_DOT_RADIUS, 0, Math.PI * 2);
  ctx.fill();

  // Add subtle highlight
  const highlightGradient = ctx.createRadialGradient(
    x - FINGER_DOT_RADIUS / 3,
    y - FINGER_DOT_RADIUS / 3,
    0,
    x,
    y,
    FINGER_DOT_RADIUS
  );
  highlightGradient.addColorStop(0, `${SAPPHIRE[200]}40`);
  highlightGradient.addColorStop(1, `${SAPPHIRE[200]}00`);
  ctx.fillStyle = highlightGradient;
  ctx.fill();

  if (showFingerNumbers && finger > 0) {
    ctx.fillStyle = SAPPHIRE.ABYSS;
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(finger.toString(), x, y);
  }
}

export function drawFingerPositions(
  ctx: CanvasRenderingContext2D,
  frets: number[],
  fingers: number[],
  config: {
    padding: number;
    stringSpacing: number;
    fretWidth: number;
    startFret: number;
    endFret: number;
    showFingerNumbers: boolean;
    isInverted?: boolean;
  }
): void {
  const {
    padding,
    stringSpacing,
    fretWidth,
    startFret,
    endFret,
    showFingerNumbers,
    isInverted = false,
  } = config;

  frets.forEach((fret, stringIndex) => {
    const stringPosition = isInverted ? STRING_COUNT - 1 - stringIndex : stringIndex;
    const y = padding + stringPosition * stringSpacing;
    const finger = fingers[stringIndex] ?? 0;

    if (fret === MUTED_STRING) {
      drawMutedString(ctx, padding, y);
    } else if (fret === OPEN_STRING) {
      drawOpenString(ctx, padding, y);
    } else if (fret >= startFret && fret <= endFret) {
      const fretIndex = fret - startFret;
      const x = padding + (fretIndex - 0.5) * fretWidth;
      drawFrettedNote(ctx, x, y, finger, showFingerNumbers);
    }
  });
}

export function drawBarres(
  ctx: CanvasRenderingContext2D,
  barres: Barre[],
  config: {
    padding: number;
    stringSpacing: number;
    fretWidth: number;
    startFret: number;
    isInverted?: boolean;
  }
): void {
  const { padding, stringSpacing, fretWidth, startFret, isInverted = false } = config;

  barres.forEach(barre => {
    const fretIndex = barre.fret - startFret;
    const x = padding + (fretIndex - 0.5) * fretWidth;

    const fromStringPos = STRING_COUNT - barre.fromString;
    const toStringPos = STRING_COUNT - barre.toString;

    const y1Position = isInverted ? STRING_COUNT - 1 - fromStringPos : fromStringPos;
    const y2Position = isInverted ? STRING_COUNT - 1 - toStringPos : toStringPos;

    const y1 = padding + y1Position * stringSpacing;
    const y2 = padding + y2Position * stringSpacing;

    // Draw barre with gradient and glow
    const barreGradient = ctx.createLinearGradient(
      x - BARRE_LINE_WIDTH / 2,
      y1,
      x + BARRE_LINE_WIDTH / 2,
      y2
    );
    barreGradient.addColorStop(0, SAPPHIRE[500]);
    barreGradient.addColorStop(0.5, SAPPHIRE[400]);
    barreGradient.addColorStop(1, SAPPHIRE[500]);

    ctx.strokeStyle = barreGradient;
    ctx.lineWidth = BARRE_LINE_WIDTH;
    ctx.lineCap = 'round';
    ctx.globalAlpha = BARRE_OPACITY;
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  });
}
