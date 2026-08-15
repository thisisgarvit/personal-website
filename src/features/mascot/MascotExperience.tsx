"use client";

import {
  Component,
  type ComponentType,
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  EFFECTS_DISABLED_DATASET_VALUE,
  EFFECTS_POLICY_EVENT,
} from "@/features/flags/effects-policy";
import { MascotPoster } from "./MascotPoster";
import {
  getMascotFallback,
  type MascotFallbackReason,
} from "./capability-policy";
import {
  advanceMascotState,
  createMascotState,
  receiveMascotSignal,
} from "./reaction-machine";
import {
  emitMascotSignal,
  subscribeMascotSignals,
  type MascotSignal,
} from "./signals";
import type { MascotPalette } from "./SourcedMascotScene";
import styles from "./mascot.module.css";

interface SceneProps {
  reaction: MascotSignal["reaction"];
  playing: boolean;
  palette: MascotPalette;
  onFirstFrame(): void;
  onRendererFailure(): void;
}

interface NavigatorHints extends Navigator {
  connection?: EventTarget & { saveData?: boolean };
  deviceMemory?: number;
}

interface BoundaryProps {
  children: ReactNode;
  onFailure(): void;
}

class SceneBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFailure();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const LIGHT_PALETTE: MascotPalette = {
  ink: "#171923",
  release: "#3f49e8",
  incident: "#ff6b52",
  merge: "#cbed45",
  panel: "#f8f9f4",
};

function readPalette(): MascotPalette {
  const styles = getComputedStyle(document.documentElement);
  const token = (name: string, fallback: string) =>
    styles.getPropertyValue(name).trim() || fallback;
  return {
    ink: token("--color-ink", LIGHT_PALETTE.ink),
    release: token("--color-release", LIGHT_PALETTE.release),
    incident: token("--color-incident", LIGHT_PALETTE.incident),
    merge: token("--color-merge", LIGHT_PALETTE.merge),
    panel: token("--color-panel", LIGHT_PALETTE.panel),
  };
}

function useSemanticPalette(): MascotPalette {
  const [palette, setPalette] = useState(LIGHT_PALETTE);

  useEffect(() => {
    const dark = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setPalette(readPalette());
    const observer = new MutationObserver(update);
    update();
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    dark.addEventListener("change", update);
    return () => {
      observer.disconnect();
      dark.removeEventListener("change", update);
    };
  }, []);

  return palette;
}

function useCapabilityPolicy(rendererFailed: boolean) {
  const [policy, setPolicy] = useState<{
    checked: boolean;
    fallback: MascotFallbackReason | null;
    generation: number;
  }>({ checked: false, fallback: null, generation: 0 });

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hints = navigator as NavigatorHints;
    const update = () => {
      const fallback = getMascotFallback({
          reducedMotion: motion.matches,
          saveData: hints.connection?.saveData === true,
          deviceMemory: hints.deviceMemory,
          performanceKill:
            document.documentElement.dataset.effectsDisabled ===
            EFFECTS_DISABLED_DATASET_VALUE,
          rendererFailed,
        });
      setPolicy((current) =>
        current.checked && current.fallback === fallback
          ? current
          : {
              checked: true,
              fallback,
              generation: current.generation + 1,
            },
      );
    };

    update();
    motion.addEventListener("change", update);
    hints.connection?.addEventListener("change", update);
    window.addEventListener(EFFECTS_POLICY_EVENT, update);
    return () => {
      motion.removeEventListener("change", update);
      hints.connection?.removeEventListener("change", update);
      window.removeEventListener(EFFECTS_POLICY_EVENT, update);
    };
  }, [rendererFailed]);

  return policy;
}

function useStageVisibility(stage: RefObject<HTMLDivElement | null>) {
  const [inView, setInView] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);

  useEffect(() => {
    const updateDocument = () =>
      setDocumentVisible(document.visibilityState !== "hidden");
    updateDocument();
    document.addEventListener("visibilitychange", updateDocument);
    return () =>
      document.removeEventListener("visibilitychange", updateDocument);
  }, []);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const Observer = Reflect.get(window, "IntersectionObserver") as
      | typeof IntersectionObserver
      | undefined;
    if (!Observer) {
      const frame = window.requestAnimationFrame(() => setInView(true));
      return () => window.cancelAnimationFrame(frame);
    }
    const observer = new Observer(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "80px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [stage]);

  return { inView, documentVisible };
}

function useNoticeSignals() {
  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const handle = (event: PointerEvent) => {
      if (!finePointer.matches) return;
      const origin = event.target;
      if (!(origin instanceof Element)) return;
      const control = origin.closest<HTMLElement>("[data-mascot-notice]");
      if (!control || control.contains(event.relatedTarget as Node | null)) {
        return;
      }
      const source = control.dataset.mascotNotice;
      if (source !== "resume" && source !== "contact" && source !== "release") {
        return;
      }
      emitMascotSignal({ reaction: "notice", source, timestamp: Date.now() });
    };
    document.addEventListener("pointerover", handle);
    return () => document.removeEventListener("pointerover", handle);
  }, []);
}

export function MascotExperience() {
  const stage = useRef<HTMLDivElement>(null);
  const loadRequested = useRef(false);
  const [rendererFailed, setRendererFailed] = useState(false);
  const [Scene, setScene] = useState<ComponentType<SceneProps> | null>(null);
  const [readyGeneration, setReadyGeneration] = useState<number | null>(null);
  const [reactionState, setReactionState] = useState(createMascotState);
  const palette = useSemanticPalette();
  const { checked, fallback, generation } =
    useCapabilityPolicy(rendererFailed);
  const { inView, documentVisible } = useStageVisibility(stage);

  useNoticeSignals();

  useEffect(
    () =>
      subscribeMascotSignals((signal: MascotSignal) => {
        const now = Date.now();
        setReactionState((current) =>
          receiveMascotSignal(current, signal, now),
        );
      }),
    [],
  );

  useEffect(() => {
    if (reactionState.expiresAt === null) return;
    const remaining = Math.max(0, reactionState.expiresAt - Date.now());
    const timer = window.setTimeout(() => {
      setReactionState((current) => advanceMascotState(current, Date.now()));
    }, remaining);
    return () => window.clearTimeout(timer);
  }, [reactionState]);

  useEffect(() => {
    if (
      !checked ||
      fallback !== null ||
      !inView ||
      !documentVisible ||
      Scene !== null ||
      loadRequested.current
    ) {
      return;
    }

    loadRequested.current = true;
    let idleHandle: number | undefined;
    let fallbackTimer: number | undefined;
    let cancelled = false;
    const loadScene = async () => {
      try {
        const importedScene = await import("./SourcedMascotScene");
        if (!cancelled) setScene(() => importedScene.SourcedMascotScene);
      } catch {
        if (!cancelled) setRendererFailed(true);
      }
    };
    const frame = window.requestAnimationFrame(() => {
      if (typeof window.requestIdleCallback === "function") {
        idleHandle = window.requestIdleCallback(
          () => void loadScene(),
          { timeout: 1500 },
        );
      } else {
        fallbackTimer = window.setTimeout(() => void loadScene(), 0);
      }
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      if (idleHandle !== undefined) window.cancelIdleCallback(idleHandle);
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
      if (Scene === null) loadRequested.current = false;
    };
  }, [Scene, checked, documentVisible, fallback, inView]);

  const handleRendererFailure = useCallback(() => {
    setRendererFailed(true);
    setReadyGeneration(null);
  }, []);

  const sceneReady =
    fallback === null && Scene !== null && readyGeneration === generation;

  return (
    <div
      ref={stage}
      className={styles.runtime}
      data-mascot-reaction={reactionState.reaction}
      data-mascot-fallback={fallback ?? "none"}
      data-scene-ready={sceneReady ? "true" : "false"}
      aria-hidden="true"
    >
      <div className={styles.poster} data-mascot-poster>
        <MascotPoster />
      </div>
      {Scene && fallback === null ? (
        <div className={styles.sceneLayer} data-mascot-scene>
          <SceneBoundary onFailure={handleRendererFailure}>
            <Scene
              reaction={reactionState.reaction}
              playing={inView && documentVisible}
              palette={palette}
              onFirstFrame={() => setReadyGeneration(generation)}
              onRendererFailure={handleRendererFailure}
            />
          </SceneBoundary>
        </div>
      ) : null}
    </div>
  );
}
