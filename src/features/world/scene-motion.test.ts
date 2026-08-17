import { describe, expect, it } from "vitest";
import { createMascotState } from "@/features/mascot/reaction-machine";
import type { WorldDiscreteState } from "./types";
import {
  gestureForWorldState,
  materializeSpring,
  stepSpringRecord,
  stepCriticalSpring,
  targetForScene,
  targetForSceneProgress,
} from "./scene-motion";

describe("world scene motion", () => {
  it("converges without crossing a settled target", () => {
    let state = { value: -2, velocity: 0 };
    let previous = state.value;
    for (let frame = 0; frame < 240; frame += 1) {
      state = stepCriticalSpring(state, 3, 1 / 60);
      expect(state.value).toBeGreaterThanOrEqual(previous);
      expect(state.value).toBeLessThanOrEqual(3);
      previous = state.value;
    }
    expect(state.value).toBeCloseTo(3, 3);
  });

  it("materializes reduced motion directly at the authored target", () => {
    expect(materializeSpring({ value: -4, velocity: 28 }, 2)).toEqual({
      value: 2,
      velocity: 0,
    });
  });

  it("retargets from presentation value and velocity without an origin reset", () => {
    const inFlight = stepCriticalSpring({ value: 0, velocity: 0 }, 10, 0.08);
    const interrupted = stepCriticalSpring(inFlight, -3, 1 / 60);

    expect(inFlight.value).toBeGreaterThan(0);
    expect(interrupted.value).not.toBe(0);
    expect(interrupted.value).not.toBe(-3);
    expect(Number.isFinite(interrupted.velocity)).toBe(true);
  });

  it("authors distinct wide and narrow targets for every scene", () => {
    for (const id of ["hero", "board", "journey"] as const) {
      const wide = targetForScene(id, false);
      const narrow = targetForScene(id, true);
      expect(wide.position).toHaveLength(3);
      expect(wide.camera).toHaveLength(3);
      expect(wide).not.toEqual(narrow);
    }
  });

  it("feeds continuous anchor progress into the authored target", () => {
    const entering = targetForSceneProgress("board", false, 0.2);
    const leaving = targetForSceneProgress("board", false, 0.8);

    expect(entering.position).not.toEqual(leaving.position);
    expect(entering.rotation).not.toEqual(leaving.rotation);
    expect(entering.camera).not.toEqual(leaving.camera);
  });

  it("spring-blends every pose channel and interrupts from presentation state", () => {
    const neutral = {
      arm: { value: 0, velocity: 0 },
      head: { value: 0, velocity: 0 },
    };
    const wave = stepSpringRecord(neutral, { arm: 1, head: 0.3 }, 1 / 60, 0.2);
    const interrupted = stepSpringRecord(
      wave,
      { arm: -0.5, head: -0.2 },
      1 / 60,
      0.2,
    );

    expect(wave.arm.value).toBeGreaterThan(0);
    expect(wave.arm.value).toBeLessThan(1);
    expect(interrupted.arm.value).not.toBe(wave.arm.value);
    expect(interrupted.arm.value).not.toBe(-0.5);
  });

  it("derives legible gestures from discrete world state", () => {
    const base: WorldDiscreteState = {
      activeScene: "hero",
      activeWork: null,
      dragging: false,
      reaction: createMascotState(),
      documentVisible: true,
      activeRegionVisible: true,
    };
    expect(gestureForWorldState(base)).toBe("idle");
    expect(gestureForWorldState({ ...base, activeScene: "board" })).toBe(
      "board-guide",
    );
    expect(gestureForWorldState({ ...base, activeScene: "journey" })).toBe(
      "idle",
    );
    expect(gestureForWorldState({ ...base, dragging: true })).toBe("drag-watch");
    expect(
      gestureForWorldState({
        ...base,
        reaction: { ...base.reaction, reaction: "milestone" },
      }),
    ).toBe("pager-check");
    expect(
      gestureForWorldState({
        ...base,
        reaction: { ...base.reaction, reaction: "shipped" },
      }),
    ).toBe("ship-celebration");
    expect(
      gestureForWorldState({
        ...base,
        reaction: { ...base.reaction, reaction: "resolved" },
      }),
    ).toBe("resolution");
  });
});
