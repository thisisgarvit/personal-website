import type { BoardColumn } from "@/data/work";

export interface PointSample {
  x: number;
  y: number;
  time: number;
}

export interface Velocity2D {
  x: number;
  y: number;
}

export const DRAG_HYSTERESIS = 10;
export const RUBBER_BAND_CONSTANT = 0.55;
export const PROJECTION_DECAY = 0.998;
export const MAX_PROJECTION = 280;
export const VELOCITY_WINDOW_MS = 100;
export const MAX_RELEASE_VELOCITY = 2400;

export class GestureHistory {
  private readonly down: PointSample;
  private readonly moves: PointSample[] = [];

  constructor(down: PointSample) {
    this.down = down;
  }

  addMove(sample: PointSample): void {
    this.moves.push(sample);
  }

  finish(up: PointSample, inherited?: Velocity2D): Velocity2D {
    const samples = [this.down, ...this.moves, up];
    let start = this.down;

    if (this.moves.length >= 2) {
      const cutoff = up.time - VELOCITY_WINDOW_MS;
      start = samples.find((sample) => sample.time >= cutoff) ?? samples.at(-2) ?? this.down;
    }

    const elapsed = Math.max(1, up.time - start.time);
    const displacement = { x: up.x - start.x, y: up.y - start.y };
    const velocity = {
      x: clampVelocity((displacement.x / elapsed) * 1000),
      y: clampVelocity((displacement.y / elapsed) * 1000),
    };

    if (
      inherited &&
      Math.abs(up.x - this.down.x) < 1 &&
      Math.abs(up.y - this.down.y) < 1
    ) {
      return {
        x: clampVelocity(inherited.x),
        y: clampVelocity(inherited.y),
      };
    }

    return velocity;
  }
}

function clampVelocity(value: number): number {
  return Math.max(-MAX_RELEASE_VELOCITY, Math.min(MAX_RELEASE_VELOCITY, value));
}

export function applyRubberBand(
  value: number,
  min: number,
  max: number,
  dimension: number,
  constant = RUBBER_BAND_CONSTANT,
): number {
  if (value >= min && value <= max) return value;

  const overshoot = value < min ? value - min : value - max;
  const resisted =
    (overshoot * dimension * constant) /
    (dimension + constant * Math.abs(overshoot));
  return (value < min ? min : max) + resisted;
}

export function projectRelease(
  velocity: number,
  decay = PROJECTION_DECAY,
  cap = MAX_PROJECTION,
): number {
  const projected = (velocity / 1000) * (decay / (1 - decay));
  return Math.max(-cap, Math.min(cap, projected));
}

export function deriveDragRotation(
  horizontalVelocity: number,
  reducedMotion: boolean,
): number {
  if (reducedMotion) return 0;
  return Math.max(-3, Math.min(3, horizontalVelocity / 800));
}

export function resolveReleaseVelocity(
  dragging: boolean,
  gesture: Velocity2D,
  inherited: Velocity2D,
): Velocity2D {
  return dragging ? gesture : inherited;
}

export function nearestColumn(
  center: number,
  columns: readonly { id: BoardColumn; center: number }[],
): BoardColumn {
  if (columns.length === 0) {
    throw new Error("nearestColumn requires at least one column");
  }

  return columns.slice(1).reduce(
    (nearest, candidate) =>
      Math.abs(candidate.center - center) < Math.abs(nearest.center - center)
        ? candidate
        : nearest,
    columns[0],
  ).id;
}

/**
 * DESIGN §7.2 response/damping tokens converted for Motion's physical
 * spring API with mass 1: ω = 2π/response, k = ω², c = 2ζω.
 */
export function springFromResponse(response: number, ratio: number) {
  const mass = 1;
  const angularFrequency = (2 * Math.PI) / response;
  return {
    mass,
    stiffness: angularFrequency ** 2 * mass,
    damping: 2 * ratio * angularFrequency * mass,
  };
}
