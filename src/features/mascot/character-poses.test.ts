import { describe, expect, it } from "vitest";
import { characterPose, type CharacterGesture } from "./character-poses";

describe("sourced mascot gesture language", () => {
  it.each<CharacterGesture>([
    "wave",
    "guide",
    "notice",
    "flag-check",
    "drag-watch",
    "shipped",
    "incident",
    "resolved",
  ])("authors %s as a materially distinct, legible pose", (gesture) => {
    const idle = characterPose("idle", 0.25);
    const pose = characterPose(gesture, 0.25);
    const delta = Object.keys(idle).reduce(
      (sum, key) =>
        sum +
        Math.abs(
          pose[key as keyof typeof pose] - idle[key as keyof typeof idle],
        ),
      0,
    );

    expect(delta).toBeGreaterThan(0.35);
  });

  it("makes alert and relief read differently before color is applied", () => {
    const alert = characterPose("incident", 0.1);
    const relief = characterPose("resolved", 0.1);

    expect(alert.spinePitch).toBeLessThan(-0.12);
    expect(alert.rightForearm).toBeGreaterThan(0.8);
    expect(relief.spinePitch).toBeGreaterThan(alert.spinePitch);
    expect(relief.headPitch).toBeGreaterThan(alert.headPitch);
  });
});
