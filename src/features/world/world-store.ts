import {
  advanceMascotState,
  createMascotState,
  receiveMascotSignal,
} from "@/features/mascot/reaction-machine";
import type {
  WorldAnchorMetrics,
  WorldDirector,
  WorldDiscreteState,
  WorldSceneId,
} from "./types";

const SCENE_ORDER: readonly WorldSceneId[] = ["hero", "board", "journey"];
const SWITCH_HYSTERESIS = 0.08;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function initialState(): WorldDiscreteState {
  return {
    activeScene: "hero",
    activeWork: null,
    dragging: false,
    reaction: createMascotState(),
    documentVisible: true,
    activeRegionVisible: false,
  };
}

export function createWorldDirector(): WorldDirector {
  const listeners = new Set<() => void>();
  const presentationListeners = new Set<() => void>();
  const anchors = new Map<WorldSceneId, HTMLElement>();
  const metrics = new Map<WorldSceneId, WorldAnchorMetrics>();
  let snapshot = initialState();

  const publish = (next: WorldDiscreteState) => {
    if (next === snapshot) return;
    snapshot = next;
    listeners.forEach((listener) => listener());
  };

  const patch = (next: Partial<WorldDiscreteState>) => {
    const changed = Object.entries(next).some(
      ([key, value]) => snapshot[key as keyof WorldDiscreteState] !== value,
    );
    if (changed) publish({ ...snapshot, ...next });
  };

  return {
    getSnapshot: () => snapshot,

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    subscribePresentation(listener) {
      presentationListeners.add(listener);
      return () => presentationListeners.delete(listener);
    },

    registerAnchor(id, node) {
      if (node === null) {
        anchors.delete(id);
        metrics.delete(id);
        return;
      }
      anchors.set(id, node);
      metrics.delete(id);
    },

    readAnchor(id) {
      return metrics.get(id) ?? null;
    },

    measure(viewportHeight) {
      const height = Math.max(
        1,
        viewportHeight ??
          (typeof window === "undefined" ? 1 : window.innerHeight),
      );
      const viewportCenter = height / 2;
      const candidates: {
        id: WorldSceneId;
        distance: number;
      }[] = [];

      for (const id of SCENE_ORDER) {
        const node = anchors.get(id);
        if (!node) {
          metrics.delete(id);
          continue;
        }
        const rect = node.getBoundingClientRect();
        const intersecting =
          rect.height > 0 && rect.bottom > 0 && rect.top < height;
        const nextMetrics: WorldAnchorMetrics = {
          id,
          top: rect.top,
          height: rect.height,
          viewportProgress: clamp01(
            (height - rect.top) / (height + Math.max(1, rect.height)),
          ),
          intersecting,
        };
        metrics.set(id, nextMetrics);
        if (intersecting) {
          candidates.push({
            id,
            distance: Math.abs(rect.top + rect.height / 2 - viewportCenter),
          });
        }
      }

      let activeScene = snapshot.activeScene;
      if (candidates.length > 0) {
        candidates.sort((a, b) => {
          const distance = a.distance - b.distance;
          return distance === 0
            ? SCENE_ORDER.indexOf(a.id) - SCENE_ORDER.indexOf(b.id)
            : distance;
        });
        const strongest = candidates[0];
        const current = candidates.find(({ id }) => id === activeScene);
        if (
          !current ||
          (strongest.id !== activeScene &&
            strongest.distance + height * SWITCH_HYSTERESIS <= current.distance)
        ) {
          activeScene = strongest.id;
        }
      }

      patch({
        activeScene,
        activeRegionVisible: candidates.length > 0,
      });
      presentationListeners.forEach((listener) => listener());
    },

    setActiveWork(activeWork) {
      patch({ activeWork });
    },

    setDragging(dragging) {
      patch({ dragging });
    },

    receiveSignal(signal) {
      const reaction = receiveMascotSignal(
        snapshot.reaction,
        signal,
        Date.now(),
      );
      patch({ reaction });
    },

    advanceReaction(now) {
      patch({ reaction: advanceMascotState(snapshot.reaction, now) });
    },

    setDocumentVisible(documentVisible) {
      patch({ documentVisible });
    },
  };
}
