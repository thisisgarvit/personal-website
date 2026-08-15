import { describe, expect, it } from "vitest";
import { stepSpring } from "./spring";

describe("stepSpring", () => {
  it("advances position and velocity with a semi-implicit physical spring step", () => {
    expect(
      stepSpring(
        { position: 10, velocity: 0 },
        0,
        { stiffness: 100, damping: 10, mass: 1 },
        0.01,
      ),
    ).toEqual({ position: 9.9, velocity: -10 });
  });

  it("applies incoming velocity independently from displacement", () => {
    const next = stepSpring(
      { position: 0, velocity: 100 },
      0,
      { stiffness: 100, damping: 10, mass: 1 },
      0.01,
    );

    expect(next.position).toBeCloseTo(0.9, 8);
    expect(next.velocity).toBeCloseTo(90, 8);
  });
});
