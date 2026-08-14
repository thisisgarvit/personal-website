"use client";

import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { toast } from "@/components/toast/toast";
import {
  FLAG_CANDID_KEY,
  FLAG_CONFETTI_KEY,
  THEME_STORAGE_KEY,
} from "@/data/storage";
import {
  authoredFlagState,
  type FeatureFlagKey,
  type FeatureFlagState,
} from "./definitions";
import { emitFlagEffect } from "./flag-events";

function readSessionFlag(key: string, fallback: boolean): boolean {
  try {
    const stored = sessionStorage.getItem(key);
    if (stored === "on") return true;
    if (stored === "off") return false;
  } catch {
    // Storage can be unavailable in privacy-restricted contexts.
  }
  return fallback;
}

function writeSessionFlag(key: string, value: boolean): void {
  try {
    sessionStorage.setItem(key, value ? "on" : "off");
  } catch {
    // The immediate in-memory effect still works without persistence.
  }
}

function readThemeOverride(): "light" | "dark" | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function applyCandidMode(enabled: boolean): void {
  document.documentElement.dataset.candid = enabled ? "on" : "off";
}

export interface FeatureFlagsController {
  flags: FeatureFlagState;
  setFlag: (key: FeatureFlagKey, enabled: boolean) => void;
}

const emptySubscribe = () => () => undefined;

function subscribeResolvedTheme(onStoreChange: () => void): () => void {
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  query.addEventListener("change", onStoreChange);
  return () => query.removeEventListener("change", onStoreChange);
}

function readResolvedTheme(): boolean {
  const override = readThemeOverride();
  return override ? override === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function useFeatureFlags(): FeatureFlagsController {
  const resolvedDark = useSyncExternalStore(
    subscribeResolvedTheme,
    readResolvedTheme,
    () => authoredFlagState.dark_mode,
  );
  const storedConfetti = useSyncExternalStore(
    emptySubscribe,
    () => readSessionFlag(FLAG_CONFETTI_KEY, true),
    () => authoredFlagState.confetti_on_scroll,
  );
  const storedCandid = useSyncExternalStore(
    emptySubscribe,
    () => readSessionFlag(FLAG_CANDID_KEY, true),
    () => authoredFlagState.candid_mode,
  );
  const [userState, setUserState] = useState<Partial<FeatureFlagState>>({});
  const flags: FeatureFlagState = {
    dark_mode: userState.dark_mode ?? resolvedDark,
    confetti_on_scroll:
      userState.confetti_on_scroll ?? storedConfetti,
    candid_mode: userState.candid_mode ?? storedCandid,
    comic_sans: false,
  };

  useEffect(() => {
    applyCandidMode(flags.candid_mode);
  }, [flags.candid_mode]);

  const setFlag = useCallback((key: FeatureFlagKey, enabled: boolean) => {
    if (key === "comic_sans") return;

    setUserState((current) => ({ ...current, [key]: enabled }));

    if (key === "dark_mode") {
      const theme = enabled ? "dark" : "light";
      document.documentElement.dataset.theme = theme;
      try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      } catch {
        // Theme remains applied for the current page.
      }
      toast(`dark_mode ${enabled ? "enabled" : "disabled"}`, {
        announce: false,
      });
    }

    if (key === "confetti_on_scroll") {
      writeSessionFlag(FLAG_CONFETTI_KEY, enabled);
      toast(enabled ? "scroll confetti armed" : "scroll confetti paused", {
        announce: false,
      });
    }

    if (key === "candid_mode") {
      writeSessionFlag(FLAG_CANDID_KEY, enabled);
      applyCandidMode(enabled);
      toast(enabled ? "field notes visible" : "field notes hidden", {
        announce: false,
      });
    }

    emitFlagEffect({ key, enabled, source: "user" });
  }, []);

  return { flags, setFlag };
}
