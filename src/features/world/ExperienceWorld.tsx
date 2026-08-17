"use client";

import {
  Component,
  type ComponentType,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  EFFECTS_DISABLED_DATASET_VALUE,
  EFFECTS_POLICY_EVENT,
} from "@/features/flags/effects-policy";
import { getWorldFallback, type WorldFallbackReason } from "./capability-policy";
import type { WorldCanvasProps } from "./WorldCanvas";
import { useWorldDirector, useWorldSnapshot } from "./WorldProvider";
import styles from "./world.module.css";

interface NavigatorHints extends Navigator {
  connection?: EventTarget & { saveData?: boolean };
  deviceMemory?: number;
}

class WorldBoundary extends Component<
  { children: ReactNode; onFailure(): void },
  { failed: boolean }
> {
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

function useWorldCapability(rendererFailed: boolean) {
  const [policy, setPolicy] = useState<{
    checked: boolean;
    fallback: WorldFallbackReason | null;
    generation: number;
  }>({ checked: false, fallback: null, generation: 0 });

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hints = navigator as NavigatorHints;
    const update = () => {
      const fallback = getWorldFallback({
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

function GuidePoster() {
  return <div className={styles.poster} data-world-poster />;
}

export function ExperienceWorld() {
  const director = useWorldDirector();
  const world = useWorldSnapshot();
  const loadRequested = useRef(false);
  const [rendererFailed, setRendererFailed] = useState(false);
  const [Scene, setScene] = useState<ComponentType<WorldCanvasProps> | null>(
    null,
  );
  const [readyGeneration, setReadyGeneration] = useState<number | null>(null);
  const { checked, fallback, generation } =
    useWorldCapability(rendererFailed);

  useEffect(() => {
    let frame: number | null = null;
    const measure = () => {
      frame = null;
      director.measure();
    };
    const schedule = () => {
      if (frame === null) frame = window.requestAnimationFrame(measure);
    };
    schedule();
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("resize", schedule);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [director]);

  useEffect(() => {
    const update = () =>
      director.setDocumentVisible(document.visibilityState !== "hidden");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, [director]);

  useEffect(() => {
    if (
      !checked ||
      fallback !== null ||
      !world.activeRegionVisible ||
      !world.documentVisible ||
      Scene !== null ||
      loadRequested.current
    ) {
      return;
    }

    loadRequested.current = true;
    let idleHandle: number | undefined;
    let fallbackTimer: number | undefined;
    let cancelled = false;
    const load = async () => {
      try {
        const worldCanvas = await import("./WorldCanvas");
        if (!cancelled) setScene(() => worldCanvas.WorldCanvas);
      } catch {
        if (!cancelled) setRendererFailed(true);
      }
    };
    const frame = window.requestAnimationFrame(() => {
      if (typeof window.requestIdleCallback === "function") {
        idleHandle = window.requestIdleCallback(() => void load(), {
          timeout: 1500,
        });
      } else {
        fallbackTimer = window.setTimeout(() => void load(), 0);
      }
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      if (idleHandle !== undefined) window.cancelIdleCallback(idleHandle);
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
      if (Scene === null) loadRequested.current = false;
    };
  }, [Scene, checked, fallback, world.activeRegionVisible, world.documentVisible]);

  const handleRendererFailure = useCallback(() => {
    setRendererFailed(true);
    setReadyGeneration(null);
  }, []);

  const sceneReady =
    fallback === null && Scene !== null && readyGeneration === generation;
  const playing =
    fallback === null && world.activeRegionVisible && world.documentVisible;

  return (
    <div
      className={styles.stage}
      data-experience-world
      data-world-fallback={fallback ?? "none"}
      data-scene-ready={sceneReady ? "true" : "false"}
      aria-hidden="true"
    >
      <GuidePoster />
      {Scene && fallback === null ? (
        <div className={styles.canvasLayer} data-world-canvas-layer>
          <WorldBoundary onFailure={handleRendererFailure}>
            <Scene
              director={director}
              playing={playing}
              onFirstFrame={() => setReadyGeneration(generation)}
              onRendererFailure={handleRendererFailure}
            />
          </WorldBoundary>
        </div>
      ) : null}
    </div>
  );
}
