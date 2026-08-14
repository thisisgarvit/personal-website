import { describe, expect, it } from "vitest";
import {
  GestureHistory,
  applyRubberBand,
  deriveDragRotation,
  nearestColumn,
  projectRelease,
  resolveReleaseVelocity,
  springFromResponse,
} from "./physics";

describe("applyRubberBand", () => {
  it("tracks one-to-one inside bounds and resists continuously past them", () => {
    expect(applyRubberBand(160, 100, 300, 200)).toBe(160);
    expect(applyRubberBand(340, 100, 300, 200)).toBeCloseTo(319.8198, 3);
    expect(applyRubberBand(60, 100, 300, 200)).toBeCloseTo(80.1802, 3);
  });
});

describe("GestureHistory", () => {
  it("uses pointer-up as the final sample when no move event arrived", () => {
    const history = new GestureHistory({ x: 10, y: 20, time: 100 });

    const velocity = history.finish({ x: 110, y: 70, time: 150 });

    expect(velocity).toEqual({ x: 2000, y: 1000 });
  });

  it("uses the down/up fallback when only one move event arrived", () => {
    const history = new GestureHistory({ x: 0, y: 0, time: 0 });
    history.addMove({ x: 25, y: 5, time: 20 });

    expect(history.finish({ x: 80, y: 20, time: 40 })).toEqual({
      x: 2000,
      y: 500,
    });
  });

  it("derives velocity from the final 100ms window and includes pointer-up", () => {
    const history = new GestureHistory({ x: 0, y: 0, time: 0 });
    history.addMove({ x: 20, y: 0, time: 150 });
    history.addMove({ x: 50, y: 10, time: 180 });

    expect(history.finish({ x: 90, y: 20, time: 200 })).toEqual({
      x: 1400,
      y: 400,
    });
  });

  it("caps implausible release spikes before spring handoff", () => {
    const history = new GestureHistory({ x: 0, y: 0, time: 0 });

    expect(history.finish({ x: 500, y: -500, time: 10 })).toEqual({
      x: 2400,
      y: -2400,
    });
  });
});

describe("projectRelease", () => {
  it("uses decay .998 and caps projected travel to 280px", () => {
    expect(projectRelease(400)).toBeCloseTo(199.6, 5);
    expect(projectRelease(2000)).toBe(280);
    expect(projectRelease(-2000)).toBe(-280);
  });
});

describe("drag motion policy", () => {
  it("removes rotational lean under reduced motion", () => {
    expect(deriveDragRotation(2400, false)).toBe(3);
    expect(deriveDragRotation(-2400, false)).toBe(-3);
    expect(deriveDragRotation(2400, true)).toBe(0);
  });

  it("does not create momentum from an unclassified grip press", () => {
    expect(
      resolveReleaseVelocity(
        false,
        { x: 1800, y: 400 },
        { x: -320, y: 90 },
      ),
    ).toEqual({ x: -320, y: 90 });
    expect(
      resolveReleaseVelocity(
        true,
        { x: 1800, y: 400 },
        { x: -320, y: 90 },
      ),
    ).toEqual({ x: 1800, y: 400 });
  });
});

describe("nearestColumn", () => {
  it("selects the column closest to the projected ticket centre", () => {
    const columns = [
      { id: "shipped" as const, center: 180 },
      { id: "in-progress" as const, center: 520 },
      { id: "backlog" as const, center: 860 },
    ];

    expect(nearestColumn(690, columns)).toBe("in-progress");
    expect(nearestColumn(691, columns)).toBe("backlog");
  });
});

describe("springFromResponse", () => {
  it("converts the locked response and damping ratio into physical constants", () => {
    const settle = springFromResponse(0.36, 1);
    expect(settle.mass).toBe(1);
    expect(settle.stiffness).toBeCloseTo(304.6174, 4);
    expect(settle.damping).toBeCloseTo(34.9066, 4);

    const flick = springFromResponse(0.42, 0.82);
    expect(flick.mass).toBe(1);
    expect(flick.stiffness).toBeCloseTo(223.8006, 4);
    expect(flick.damping).toBeCloseTo(24.5343, 4);
  });
});
