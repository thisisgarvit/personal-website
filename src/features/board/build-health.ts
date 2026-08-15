import { emitMascotSignal } from "@/features/mascot/signals";
import type { BoardPositions } from "./storage";
import { recordJourneyEvent } from "@/features/journey/journey-store";

export type BuildHealth = "healthy" | "incident";

const listeners = new Set<() => void>();
let currentHealth: BuildHealth = "healthy";

/** The only actually shipped product is the build invariant. */
export function deriveBuildHealth(positions: BoardPositions): BuildHealth {
  return positions["stay-portal"] === "shipped" ? "healthy" : "incident";
}

export function getBuildHealthSnapshot(): BuildHealth {
  return currentHealth;
}

export function getBuildHealthServerSnapshot(): BuildHealth {
  return "healthy";
}

export function subscribeBuildHealth(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function publishBoardHealth(positions: BoardPositions): void {
  const next = deriveBuildHealth(positions);
  if (next === currentHealth) return;

  currentHealth = next;
  listeners.forEach((listener) => listener());
  if (next === "incident") {
    recordJourneyEvent({ type: "played", kind: "board-incident" });
  }
  emitMascotSignal({
    reaction: next === "incident" ? "incident" : "resolved",
    source: "stay-portal",
    timestamp: Date.now(),
  });
}

export function resetBuildHealthForTests(): void {
  currentHealth = "healthy";
}
