import type { WorldDiscreteState, WorldSceneId } from "./types";

export type GuideGesture =
  | "idle"
  | "wave"
  | "board-guide"
  | "drag-watch"
  | "pager-check"
  | "ship-celebration"
  | "resolution";

export interface SceneTarget {
  position: readonly [number, number, number];
  rotation: readonly [number, number, number];
  scale: number;
  camera: readonly [number, number, number];
  lookAt: readonly [number, number, number];
}

export interface SpringValue {
  value: number;
  velocity: number;
}

const WIDE_TARGETS: Readonly<Record<WorldSceneId, SceneTarget>> = {
  hero: {
    position: [1.7, -1.05, 0],
    rotation: [0, -0.22, -0.015],
    scale: 1.28,
    camera: [0, 0.3, 6.3],
    lookAt: [0.35, 0.15, 0],
  },
  board: {
    position: [-1.95, -0.98, -0.1],
    rotation: [0, 0.3, 0.02],
    scale: 1.05,
    camera: [0, 0.15, 6.8],
    lookAt: [-0.2, -0.1, 0],
  },
  journey: {
    position: [2.05, -1.12, -0.2],
    rotation: [0, -0.34, -0.02],
    scale: 0.95,
    camera: [0, 0.05, 7.2],
    lookAt: [0.15, -0.16, 0],
  },
};

const NARROW_TARGETS: Readonly<Record<WorldSceneId, SceneTarget>> = {
  hero: {
    position: [0.58, -0.8, -0.2],
    rotation: [0, -0.2, -0.01],
    scale: 1,
    camera: [0, 0.42, 5.2],
    lookAt: [0.1, 0.14, 0],
  },
  board: {
    position: [-0.7, -1.02, -0.35],
    rotation: [0, 0.28, 0.02],
    scale: 0.85,
    camera: [0, 0.12, 6.2],
    lookAt: [-0.08, -0.12, 0],
  },
  journey: {
    position: [0.72, -1.12, -0.45],
    rotation: [0, -0.3, -0.02],
    scale: 0.8,
    camera: [0, 0, 6.5],
    lookAt: [0.05, -0.18, 0],
  },
};

export function targetForScene(
  id: WorldSceneId,
  narrow: boolean,
): SceneTarget {
  return (narrow ? NARROW_TARGETS : WIDE_TARGETS)[id];
}

export function targetForSceneProgress(
  id: WorldSceneId,
  narrow: boolean,
  viewportProgress: number,
): SceneTarget {
  const base = targetForScene(id, narrow);
  const progress = Math.min(1, Math.max(0, viewportProgress));
  const drift = progress - 0.5;
  const horizontal = id === "board" ? 0.12 : -0.08;
  return {
    position: [
      base.position[0] + drift * horizontal,
      base.position[1] + drift * 0.18,
      base.position[2],
    ],
    rotation: [
      base.rotation[0],
      base.rotation[1] + drift * 0.1,
      base.rotation[2],
    ],
    scale: base.scale,
    camera: [
      base.camera[0],
      base.camera[1] + drift * 0.06,
      base.camera[2],
    ],
    lookAt: [
      base.lookAt[0],
      base.lookAt[1] + drift * 0.08,
      base.lookAt[2],
    ],
  };
}

export function materializeSpring(
  _current: SpringValue,
  target: number,
): SpringValue {
  return { value: target, velocity: 0 };
}

/**
 * Closed-form critically damped motion. Values and velocity are always handed
 * forward, so interruption begins from what is currently on screen.
 */
export function stepCriticalSpring(
  current: SpringValue,
  target: number,
  elapsedSeconds: number,
  responseSeconds = 0.46,
): SpringValue {
  const elapsed = Math.max(0, Math.min(elapsedSeconds, 0.1));
  if (elapsed === 0) return current;
  const omega = (Math.PI * 2) / Math.max(0.12, responseSeconds);
  const offset = current.value - target;
  const helper = current.velocity + omega * offset;
  const decay = Math.exp(-omega * elapsed);
  const value = target + (offset + helper * elapsed) * decay;
  const velocity = (current.velocity - omega * helper * elapsed) * decay;

  if ((target - current.value) * (target - value) < 0) {
    return { value: target, velocity: 0 };
  }
  if (Math.abs(target - value) < 0.0001 && Math.abs(velocity) < 0.0001) {
    return { value: target, velocity: 0 };
  }
  return { value, velocity };
}

export function stepSpringRecord<Key extends string>(
  current: Record<Key, SpringValue>,
  targets: Record<Key, number>,
  elapsedSeconds: number,
  responseSeconds?: number,
): Record<Key, SpringValue> {
  return Object.fromEntries(
    (Object.keys(targets) as Key[]).map((key) => [
      key,
      stepCriticalSpring(
        current[key],
        targets[key],
        elapsedSeconds,
        responseSeconds,
      ),
    ]),
  ) as Record<Key, SpringValue>;
}

export function gestureForWorldState(state: WorldDiscreteState): GuideGesture {
  if (state.dragging || state.reaction.reaction === "drag-watch") {
    return "drag-watch";
  }
  switch (state.reaction.reaction) {
    case "shipped":
      return "ship-celebration";
    case "resolved":
      return "resolution";
    case "notice":
    case "flag-check":
    case "milestone":
    case "incident":
      return "pager-check";
    default:
      return state.activeScene === "board" ? "board-guide" : "idle";
  }
}
