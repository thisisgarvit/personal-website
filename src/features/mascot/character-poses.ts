export type CharacterGesture =
  | "idle"
  | "wave"
  | "guide"
  | "notice"
  | "flag-check"
  | "drag-watch"
  | "shipped"
  | "incident"
  | "resolved";

export interface CharacterPose {
  rootY: number;
  rootRoll: number;
  spinePitch: number;
  spineRoll: number;
  headPitch: number;
  headRoll: number;
  leftUpperArm: number;
  rightUpperArm: number;
  leftForearm: number;
  rightForearm: number;
  leftHand: number;
  rightHand: number;
  pagerPulse: number;
}

const IDLE: CharacterPose = {
  rootY: 0,
  rootRoll: 0,
  spinePitch: 0,
  spineRoll: 0,
  headPitch: 0,
  headRoll: 0,
  leftUpperArm: -1.32,
  rightUpperArm: 1.32,
  leftForearm: 0,
  rightForearm: 0,
  leftHand: 0,
  rightHand: 0,
  pagerPulse: 0,
};

/**
 * Bone offsets layered over the CC0 character's authored bind pose.
 * Values are deliberately broad enough to read in a 360×204 viewport.
 */
export function characterPose(
  gesture: CharacterGesture,
  phase: number,
): CharacterPose {
  const beat = Math.sin(phase * Math.PI * 2);
  switch (gesture) {
    case "wave":
      return {
        ...IDLE,
        rootY: 0.015,
        spineRoll: -0.08,
        headRoll: 0.1,
        rightUpperArm: 0.12,
        rightForearm: 0.72,
        rightHand: 0.45 + beat * 0.42,
      };
    case "guide":
      return {
        ...IDLE,
        spinePitch: -0.08,
        spineRoll: 0.11,
        headPitch: -0.08,
        leftUpperArm: 0.56,
        leftForearm: 0.42,
        leftHand: -0.2,
      };
    case "notice":
      return {
        ...IDLE,
        spineRoll: -0.05,
        headPitch: -0.08,
        headRoll: 0.16,
        rightUpperArm: -1.08,
      };
    case "flag-check":
      return {
        ...IDLE,
        spinePitch: -0.1,
        headPitch: -0.24,
        headRoll: -0.08,
        rightUpperArm: -0.42,
        rightForearm: 1.18,
        rightHand: 0.18,
        pagerPulse: 0.65 + Math.max(0, beat) * 0.35,
      };
    case "drag-watch":
      return {
        ...IDLE,
        rootY: -0.025,
        spinePitch: -0.24,
        headPitch: 0.13,
        leftUpperArm: 1.08,
        rightUpperArm: -1.08,
      };
    case "shipped":
      return {
        ...IDLE,
        rootY: 0.09 + Math.max(0, beat) * 0.035,
        spinePitch: 0.08,
        headPitch: 0.12,
        leftUpperArm: -0.28,
        rightUpperArm: 0.28,
        leftForearm: 0.42,
        rightForearm: 0.42,
        leftHand: 0.28,
        rightHand: -0.28,
        pagerPulse: 1,
      };
    case "incident":
      return {
        ...IDLE,
        rootY: -0.035,
        rootRoll: beat * 0.012,
        spinePitch: -0.22,
        spineRoll: -0.08,
        headPitch: -0.18,
        headRoll: 0.1,
        leftUpperArm: 0.92,
        rightUpperArm: -0.36,
        leftForearm: 0.32,
        rightForearm: 1.28,
        rightHand: 0.24,
        pagerPulse: 0.72 + Math.max(0, beat) * 0.28,
      };
    case "resolved":
      return {
        ...IDLE,
        rootY: 0.025,
        spinePitch: 0.06,
        spineRoll: 0.06,
        headPitch: 0.14,
        headRoll: -0.1,
        leftUpperArm: 1.18,
        rightUpperArm: -0.72,
        rightForearm: 0.6,
        rightHand: -0.12,
        pagerPulse: 0.25,
      };
    case "idle":
    default:
      return { ...IDLE, rootY: beat * 0.004 };
  }
}
