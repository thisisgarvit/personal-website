import { describe, expect, it } from "vitest";
import { getWorldFallback, LOW_MEMORY_GB } from "./capability-policy";

const capable = {
  reducedMotion: false,
  saveData: false,
  deviceMemory: 8,
  performanceKill: false,
  rendererFailed: false,
};

describe("persistent world capability policy", () => {
  it("allows the lazy world on a capable device", () => {
    expect(getWorldFallback(capable)).toBeNull();
    expect(
      getWorldFallback({ ...capable, deviceMemory: undefined }),
    ).toBeNull();
  });

  it.each([
    ["reduced-motion", { reducedMotion: true }],
    ["save-data", { saveData: true }],
    ["low-memory", { deviceMemory: LOW_MEMORY_GB }],
    ["performance-kill", { performanceKill: true }],
    ["renderer-failure", { rendererFailed: true }],
  ] as const)("returns %s for its locked fallback", (reason, patch) => {
    expect(getWorldFallback({ ...capable, ...patch })).toBe(reason);
  });

  it("does not classify memory above the inclusive low-memory threshold", () => {
    expect(
      getWorldFallback({ ...capable, deviceMemory: LOW_MEMORY_GB + 0.01 }),
    ).toBeNull();
  });

  it("preserves policy precedence after a renderer failure", () => {
    expect(
      getWorldFallback({
        ...capable,
        reducedMotion: true,
        saveData: true,
        deviceMemory: 2,
        performanceKill: true,
        rendererFailed: true,
      }),
    ).toBe("reduced-motion");
  });

  it("treats WebGL context-creation impossibility as renderer failure", () => {
    // Gate C finding: --disable-webgl left a dead canvas mounted and still
    // downloaded the GLB because creation failure was invisible to policy.
    expect(getWorldFallback({ ...capable, webglUnavailable: true })).toBe(
      "renderer-failure",
    );
  });

  it("does not fall back when the WebGL probe succeeds", () => {
    expect(getWorldFallback({ ...capable, webglUnavailable: false })).toBeNull();
  });
});
