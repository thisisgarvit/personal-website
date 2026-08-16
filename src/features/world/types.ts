import type { WorkSlug } from "@/data/work";
import type { MascotReactionState } from "@/features/mascot/reaction-machine";
import type { MascotSignal } from "@/features/mascot/signals";

export type WorldSceneId = "hero" | "board" | "journey";

/**
 * Mutable layout data sampled by the renderer. Updating these measurements is
 * not itself a reason to publish a React store snapshot.
 */
export interface WorldAnchorMetrics {
  readonly id: WorldSceneId;
  readonly top: number;
  readonly height: number;
  readonly viewportProgress: number;
  readonly intersecting: boolean;
}

/**
 * Discrete state only. These six fields are the complete notification surface
 * consumed through useSyncExternalStore; pointer and scroll presentation values
 * stay out of React state.
 */
export interface WorldDiscreteState {
  readonly activeScene: WorldSceneId;
  readonly activeWork: WorkSlug | null;
  readonly dragging: boolean;
  readonly reaction: MascotReactionState;
  readonly documentVisible: boolean;
  readonly activeRegionVisible: boolean;
}

export interface WorldDirector {
  getSnapshot(): WorldDiscreteState;
  subscribe(listener: () => void): () => void;
  registerAnchor(id: WorldSceneId, node: HTMLElement | null): void;
  readAnchor(id: WorldSceneId): WorldAnchorMetrics | null;

  /** Refreshes mutable anchor metrics; publishes only discrete state changes. */
  measure(viewportHeight?: number): void;

  setActiveWork(slug: WorkSlug | null): void;
  setDragging(dragging: boolean): void;
  receiveSignal(signal: MascotSignal): void;
  advanceReaction(now: number): void;
  setDocumentVisible(visible: boolean): void;
}
