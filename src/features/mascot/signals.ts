/**
 * Shared signal bus — the single event stream that the board, flags,
 * journey, and world modules publish/subscribe through.
 *
 * COMPATIBILITY NOTE (Task 9 / Gate F): the mascot rendering system was
 * retired, but this bus and `reaction-machine.ts` are the preserved,
 * canonical reaction contract now consumed by `src/features/world/**`
 * (WorldProvider subscribes; world-store reduces). The `Mascot*` names
 * are kept to avoid a rename-only churn across live consumers; do not
 * create a parallel event bus in the world feature.
 */
import type { FeatureFlagKey } from "@/features/flags/definitions";
import type { WorkSlug } from "@/data/work";

export type MascotReaction =
  | "idle"
  | "notice"
  | "flag-check"
  | "drag-watch"
  | "shipped"
  | "milestone"
  | "incident"
  | "resolved";

export type JourneySignalSource =
  | "journey:scrolled"
  | "journey:played"
  | "journey:read-work"
  | "journey:converted";

export interface MascotSignal {
  reaction: MascotReaction;
  source:
    | "resume"
    | "contact"
    | "release"
    | FeatureFlagKey
    | WorkSlug
    | JourneySignalSource;
  timestamp: number;
}

export const MASCOT_SIGNAL_EVENT = "garvit:mascot-signal";

type MascotSignalListener = (signal: MascotSignal) => void;

export function subscribeMascotSignals(listener: MascotSignalListener) {
  if (typeof window === "undefined") return () => undefined;
  const handle = (event: Event) => {
    listener((event as CustomEvent<MascotSignal>).detail);
  };
  window.addEventListener(MASCOT_SIGNAL_EVENT, handle);
  return () => window.removeEventListener(MASCOT_SIGNAL_EVENT, handle);
}

export function emitMascotSignal(signal: MascotSignal): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<MascotSignal>(MASCOT_SIGNAL_EVENT, { detail: signal }),
  );
}
