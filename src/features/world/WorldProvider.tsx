"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { subscribeMascotSignals } from "@/features/mascot/signals";
import type { WorldDirector, WorldDiscreteState } from "./types";
import { createWorldDirector } from "./world-store";

const WorldContext = createContext<WorldDirector | null>(null);

export function WorldProvider({ children }: { children: ReactNode }) {
  const directorRef = useRef<WorldDirector | null>(null);
  /* eslint-disable react-hooks/refs -- stable provider-owned external store */
  if (directorRef.current === null) directorRef.current = createWorldDirector();
  const director = directorRef.current;
  /* eslint-enable react-hooks/refs */

  useEffect(
    () => subscribeMascotSignals((signal) => director.receiveSignal(signal)),
    [director],
  );

  useEffect(() => {
    let timeout: number | null = null;
    const schedule = () => {
      if (timeout !== null) window.clearTimeout(timeout);
      timeout = null;
      const expiresAt = director.getSnapshot().reaction.expiresAt;
      if (expiresAt !== null) {
        timeout = window.setTimeout(
          () => director.advanceReaction(Date.now()),
          Math.max(0, expiresAt - Date.now()),
        );
      }
    };
    schedule();
    const unsubscribe = director.subscribe(schedule);
    return () => {
      unsubscribe();
      if (timeout !== null) window.clearTimeout(timeout);
    };
  }, [director]);

  return <WorldContext.Provider value={director}>{children}</WorldContext.Provider>;
}

export function useWorldDirector(): WorldDirector {
  const director = useContext(WorldContext);
  if (director === null) {
    throw new Error("useWorldDirector must be used within WorldProvider");
  }
  return director;
}

export function useWorldSnapshot(): WorldDiscreteState {
  const director = useWorldDirector();
  return useSyncExternalStore(
    director.subscribe,
    director.getSnapshot,
    director.getSnapshot,
  );
}
