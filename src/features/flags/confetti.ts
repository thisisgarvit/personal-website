export const SCROLL_DISTANCE_PER_BURST = 480;
export const MAX_BURSTS_PER_TAB = 3;
export const PIECES_PER_BURST = 8;

export type EffectSuppression =
  | "reduced-motion"
  | "save-data"
  | "document-hidden"
  | "performance-kill"
  | "flag-disabled";

interface EffectEnvironment {
  enabled: boolean;
  reducedMotion: boolean;
  saveData: boolean;
  documentHidden: boolean;
  performanceKill: boolean;
}

export function getEffectSuppression(
  environment: EffectEnvironment,
): EffectSuppression | null {
  if (environment.reducedMotion) return "reduced-motion";
  if (environment.saveData) return "save-data";
  if (environment.documentHidden) return "document-hidden";
  if (environment.performanceKill) return "performance-kill";
  if (!environment.enabled) return "flag-disabled";
  return null;
}

/**
 * Module instances survive client-side route changes, keeping the cap
 * independent from the board/reset lifecycle. A hard reload starts a new
 * rendered session while the persisted visible flag state remains intact.
 */
export class ScrollBurstGate {
  private travelled = 0;
  private emitted = 0;

  get burstCount(): number {
    return this.emitted;
  }

  resetTravel(): void {
    this.travelled = 0;
  }

  recordTravel(distance: number, active = true): boolean {
    if (!active || this.emitted >= MAX_BURSTS_PER_TAB) return false;
    this.travelled += Math.max(0, Math.abs(distance));
    if (this.travelled < SCROLL_DISTANCE_PER_BURST) return false;

    this.travelled = 0;
    this.emitted += 1;
    return true;
  }
}

const tabScrollBurstGate = new ScrollBurstGate();

export function getTabScrollBurstGate(): ScrollBurstGate {
  return tabScrollBurstGate;
}

export interface BurstOrigin {
  side: "left" | "right";
  y: number;
}

export interface ConfettiPiece extends BurstOrigin {
  id: string;
  delay: number;
  travelX: number;
  travelY: number;
  rotation: number;
  color: "merge" | "incident" | "question" | "context";
  round: boolean;
}

const colors: readonly ConfettiPiece["color"][] = [
  "merge",
  "incident",
  "question",
  "context",
];

export function createBurstPieces(
  origin: BurstOrigin,
  burstNumber: number,
): ConfettiPiece[] {
  return Array.from({ length: PIECES_PER_BURST }, (_, index) => {
    const direction = origin.side === "left" ? 1 : -1;
    return {
      ...origin,
      id: `${burstNumber}-${index}`,
      delay: index * 22,
      travelX: direction * (54 + ((index * 11 + burstNumber * 7) % 38)),
      travelY: -54 + ((index * 19 + burstNumber * 13) % 108),
      rotation: direction * (95 + index * 37),
      color: colors[(index + burstNumber) % colors.length],
      round: index % 3 === 0,
    };
  });
}

interface RectLike {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface Viewport {
  width: number;
  height: number;
}

function candidateHitsObstacle(
  origin: BurstOrigin,
  viewport: Viewport,
  obstacle: RectLike,
): boolean {
  const corridorRight = origin.side === "left" ? 112 : viewport.width;
  const corridorLeft = origin.side === "left" ? 0 : viewport.width - 112;
  const verticalTop = origin.y - 72;
  const verticalBottom = origin.y + 72;
  return (
    obstacle.left < corridorRight &&
    obstacle.right > corridorLeft &&
    obstacle.top < verticalBottom &&
    obstacle.bottom > verticalTop
  );
}

/** Selects an edge pocket away from the hero title and active control. */
export function chooseBurstOrigin(
  viewport: Viewport,
  obstacles: readonly RectLike[],
  burstNumber: number,
): BurstOrigin {
  const safeHeight = Math.max(viewport.height, 240);
  const yRatios = [0.78, 0.26, 0.62, 0.43] as const;
  const preferredSide = burstNumber % 2 === 0 ? "left" : "right";
  const sides = [preferredSide, preferredSide === "left" ? "right" : "left"] as const;

  for (const ratio of yRatios) {
    const y = Math.round(Math.min(safeHeight - 72, Math.max(72, safeHeight * ratio)));
    for (const side of sides) {
      const origin: BurstOrigin = { side, y };
      if (!obstacles.some((obstacle) => candidateHitsObstacle(origin, viewport, obstacle))) {
        return origin;
      }
    }
  }

  return { side: preferredSide, y: safeHeight - 72 };
}
