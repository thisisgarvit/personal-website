export const LOW_MEMORY_GB = 4;

export type MascotFallbackReason =
  | "reduced-motion"
  | "save-data"
  | "low-memory"
  | "performance-kill"
  | "renderer-failure";

export interface MascotCapabilitySnapshot {
  reducedMotion: boolean;
  saveData: boolean;
  deviceMemory?: number;
  performanceKill: boolean;
  rendererFailed: boolean;
}

/**
 * Returns the first reason WebGL must not start. `deviceMemory` is a coarse,
 * optional browser hint; 4GB and below stays on the code-native poster, while
 * an absent hint is not treated as failure.
 */
export function getMascotFallback(
  snapshot: MascotCapabilitySnapshot,
): MascotFallbackReason | null {
  if (snapshot.reducedMotion) return "reduced-motion";
  if (snapshot.saveData) return "save-data";
  if (
    snapshot.deviceMemory !== undefined &&
    snapshot.deviceMemory <= LOW_MEMORY_GB
  ) {
    return "low-memory";
  }
  if (snapshot.performanceKill) return "performance-kill";
  if (snapshot.rendererFailed) return "renderer-failure";
  return null;
}
