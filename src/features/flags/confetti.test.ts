import { describe, expect, it } from "vitest";
import {
  ScrollBurstGate,
  createBurstPieces,
  getEffectSuppression,
} from "./confetti";

describe("ScrollBurstGate", () => {
  it("requires 480px of deliberate travel and caps a tab at three bursts", () => {
    const gate = new ScrollBurstGate();

    expect(gate.recordTravel(479)).toBe(false);
    expect(gate.recordTravel(1)).toBe(true);
    expect(gate.recordTravel(480)).toBe(true);
    expect(gate.recordTravel(960)).toBe(true);
    expect(gate.recordTravel(480)).toBe(false);
    expect(gate.burstCount).toBe(3);
  });

  it("does not bank progress while effects are suppressed or disabled", () => {
    const gate = new ScrollBurstGate();

    expect(gate.recordTravel(600, false)).toBe(false);
    expect(gate.recordTravel(400)).toBe(false);
    expect(gate.recordTravel(80)).toBe(true);
  });
});

describe("createBurstPieces", () => {
  it("creates no more than eight compact pieces at the selected viewport edge", () => {
    const pieces = createBurstPieces({ side: "right", y: 320 }, 2);

    expect(pieces).toHaveLength(8);
    expect(pieces.every((piece) => piece.side === "right")).toBe(true);
    expect(pieces.every((piece) => piece.y === 320)).toBe(true);
  });
});

describe("getEffectSuppression", () => {
  it.each([
    ["reduced-motion", { reducedMotion: true }],
    ["save-data", { saveData: true }],
    ["document-hidden", { documentHidden: true }],
    ["performance-kill", { performanceKill: true }],
  ] as const)("gives %s precedence over the visible flag", (reason, override) => {
    expect(
      getEffectSuppression({
        enabled: true,
        reducedMotion: false,
        saveData: false,
        documentHidden: false,
        performanceKill: false,
        ...override,
      }),
    ).toBe(reason);
  });

  it("reports a disabled visible flag separately", () => {
    expect(
      getEffectSuppression({
        enabled: false,
        reducedMotion: false,
        saveData: false,
        documentHidden: false,
        performanceKill: false,
      }),
    ).toBe("flag-disabled");
  });
});
