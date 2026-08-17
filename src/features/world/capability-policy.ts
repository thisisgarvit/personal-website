export const LOW_MEMORY_GB = 4;

export type WorldFallbackReason =
  | "reduced-motion"
  | "save-data"
  | "low-memory"
  | "performance-kill"
  | "renderer-failure";

export interface WorldCapabilitySnapshot {
  reducedMotion: boolean;
  saveData: boolean;
  deviceMemory?: number;
  performanceKill: boolean;
  rendererFailed: boolean;
  /**
   * WebGL context CREATION is impossible (blocked/blocklisted/headless).
   * Distinct from `rendererFailed`, which reports failure after creation:
   * creation failure must be known BEFORE the scene chunk loads, or a dead
   * canvas mounts and the GLB downloads for nothing (Gate C finding).
   */
  webglUnavailable?: boolean;
}

export function getWorldFallback(
  snapshot: WorldCapabilitySnapshot,
): WorldFallbackReason | null {
  if (snapshot.reducedMotion) return "reduced-motion";
  if (snapshot.saveData) return "save-data";
  if (
    snapshot.deviceMemory !== undefined &&
    snapshot.deviceMemory <= LOW_MEMORY_GB
  ) {
    return "low-memory";
  }
  if (snapshot.performanceKill) return "performance-kill";
  if (snapshot.rendererFailed || snapshot.webglUnavailable === true) {
    return "renderer-failure";
  }
  return null;
}

let webglProbeResult: boolean | null = null;

/**
 * One-shot probe: can this browser create a WebGL context at all?
 * Cached for the page lifetime — context creation is not free, and the
 * answer does not change within a session. Reset is test-only.
 */
export function probeWebGlSupport(): boolean {
  if (webglProbeResult !== null) return webglProbeResult;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    webglProbeResult = gl !== null;
    if (gl && "getExtension" in gl) {
      // Free the probe context immediately rather than waiting for GC.
      (gl as WebGLRenderingContext)
        .getExtension("WEBGL_lose_context")
        ?.loseContext();
    }
  } catch {
    webglProbeResult = false;
  }
  return webglProbeResult;
}

export function resetWebGlProbeForTests(): void {
  webglProbeResult = null;
}
