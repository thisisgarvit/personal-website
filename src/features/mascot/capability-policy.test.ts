import { describe, expect, it } from "vitest";
import { getMascotFallback, LOW_MEMORY_GB } from "./capability-policy";

const capable = {
  reducedMotion: false,
  saveData: false,
  deviceMemory: 8,
  performanceKill: false,
  rendererFailed: false,
};

describe("mascot WebGL capability policy", () => {
  it("keeps the sourced scene eligible on a capable device", () => {
    expect(getMascotFallback(capable)).toBeNull();
  });

  it("uses the poster for every locked fallback signal", () => {
    expect(getMascotFallback({ ...capable, reducedMotion: true })).toBe(
      "reduced-motion",
    );
    expect(getMascotFallback({ ...capable, saveData: true })).toBe(
      "save-data",
    );
    expect(
      getMascotFallback({ ...capable, deviceMemory: LOW_MEMORY_GB }),
    ).toBe("low-memory");
    expect(getMascotFallback({ ...capable, performanceKill: true })).toBe(
      "performance-kill",
    );
    expect(getMascotFallback({ ...capable, rendererFailed: true })).toBe(
      "renderer-failure",
    );
  });

  it("does not penalize browsers that omit the non-standard memory hint", () => {
    expect(getMascotFallback({ ...capable, deviceMemory: undefined })).toBeNull();
  });
});
