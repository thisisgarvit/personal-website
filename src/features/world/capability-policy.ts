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
  if (snapshot.rendererFailed) return "renderer-failure";
  return null;
}
