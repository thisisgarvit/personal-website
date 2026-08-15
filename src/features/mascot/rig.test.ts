import { describe, expect, it } from "vitest";
import {
  LOOK_DAMPING_RATIO,
  LOOK_RESPONSE_SECONDS,
  splitLookTarget,
  stepSpring,
} from "./rig";

describe("mascot look rig", () => {
  it("splits an extreme glance across torso, head, and pupils without unnatural rotation", () => {
    const pose = splitLookTarget({ x: 1, y: -1 });

    expect(pose).toEqual({
      torsoYaw: 0.12,
      headYaw: 0.22,
      headPitch: -0.16,
      pupilX: 0.08,
      pupilY: -0.05,
    });
  });

  it("uses the locked .30s critically damped spring and settles without overshoot", () => {
    expect(LOOK_RESPONSE_SECONDS).toBe(0.3);
    expect(LOOK_DAMPING_RATIO).toBe(1);

    let spring = { value: 0, velocity: 0 };
    let maximum = 0;
    for (let frame = 0; frame < 120; frame += 1) {
      spring = stepSpring(spring, 1, 1 / 60);
      maximum = Math.max(maximum, spring.value);
    }

    expect(spring.value).toBeCloseTo(1, 4);
    expect(maximum).toBeLessThanOrEqual(1);
  });

  it("retargets from the current value and velocity instead of restarting", () => {
    const moving = stepSpring({ value: 0.4, velocity: 1.2 }, 1, 1 / 60);
    const reversed = stepSpring(moving, -0.4, 1 / 60);

    expect(reversed.value).not.toBe(-0.4);
    expect(reversed.value).toBeGreaterThan(0.35);
    expect(Number.isFinite(reversed.velocity)).toBe(true);
  });
});
