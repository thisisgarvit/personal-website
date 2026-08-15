import type { MascotReaction } from "./signals";

export const LOOK_RESPONSE_SECONDS = 0.3;
export const LOOK_DAMPING_RATIO = 1;

export interface SpringState {
  value: number;
  velocity: number;
}

export interface LookTarget {
  x: number;
  y: number;
}

export interface LookPose {
  torsoYaw: number;
  headYaw: number;
  headPitch: number;
  pupilX: number;
  pupilY: number;
}

export interface ReactionPose {
  leftArmZ: number;
  rightArmZ: number;
  headTilt: number;
  torsoLean: number;
  pagerScale: number;
}

function clampUnit(value: number): number {
  return Math.max(-1, Math.min(1, value));
}

/** DESIGN §7.5: 35% torso, 65% head, pupils finish the glance. */
export function splitLookTarget(target: LookTarget): LookPose {
  const x = clampUnit(target.x);
  const y = clampUnit(target.y);
  return {
    torsoYaw: Number((x * 0.12).toFixed(3)),
    headYaw: Number((x * 0.22).toFixed(3)),
    headPitch: Number((y * 0.16).toFixed(3)),
    pupilX: Number((x * 0.08).toFixed(3)),
    pupilY: Number((y * 0.05).toFixed(3)),
  };
}

/**
 * Designer response/damping conversion: ω = 2π/response, k = ω²,
 * c = 2ζω (mass 1). Integration stays on the current value/velocity so every
 * cursor or reaction retarget is interruptible.
 */
export function stepSpring(
  state: SpringState,
  target: number,
  elapsedSeconds: number,
  response = LOOK_RESPONSE_SECONDS,
  dampingRatio = LOOK_DAMPING_RATIO,
): SpringState {
  const delta = Math.max(0, Math.min(elapsedSeconds, 1 / 30));
  if (delta === 0) return state;

  const omega = (Math.PI * 2) / response;
  const stiffness = omega * omega;
  const damping = 2 * dampingRatio * omega;
  const acceleration =
    stiffness * (target - state.value) - damping * state.velocity;
  const velocity = state.velocity + acceleration * delta;
  const value = state.value + velocity * delta;

  if ((target - state.value) * (target - value) < 0) {
    return { value: target, velocity: 0 };
  }
  return { value, velocity };
}

export function reactionPose(reaction: MascotReaction): ReactionPose {
  switch (reaction) {
    case "notice":
      return {
        leftArmZ: 0.18,
        rightArmZ: -0.18,
        headTilt: -0.07,
        torsoLean: 0.025,
        pagerScale: 1,
      };
    case "flag-check":
      return {
        leftArmZ: 0.18,
        rightArmZ: -0.78,
        headTilt: 0.08,
        torsoLean: -0.03,
        pagerScale: 1.16,
      };
    case "drag-watch":
      return {
        leftArmZ: 0.28,
        rightArmZ: -0.28,
        headTilt: 0,
        torsoLean: 0.07,
        pagerScale: 1,
      };
    case "shipped":
      return {
        leftArmZ: -1.7,
        rightArmZ: 1.7,
        headTilt: -0.08,
        torsoLean: -0.04,
        pagerScale: 1.24,
      };
    case "idle":
    default:
      return {
        leftArmZ: 0.18,
        rightArmZ: -0.18,
        headTilt: 0,
        torsoLean: 0,
        pagerScale: 1,
      };
  }
}
