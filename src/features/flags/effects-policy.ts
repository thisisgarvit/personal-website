"use client";

import { useEffect, useState } from "react";
import { getEffectSuppression, type EffectSuppression } from "./confetti";

export const EFFECTS_POLICY_EVENT = "garvit:effects-policy";
export const EFFECTS_DISABLED_DATASET_VALUE = "true";

interface NavigatorWithConnection extends Navigator {
  connection?: EventTarget & { saveData?: boolean };
}

export function setPerformanceEffectsDisabled(disabled: boolean): void {
  if (typeof document === "undefined") return;
  if (disabled) {
    document.documentElement.dataset.effectsDisabled =
      EFFECTS_DISABLED_DATASET_VALUE;
  } else {
    delete document.documentElement.dataset.effectsDisabled;
  }
  window.dispatchEvent(new Event(EFFECTS_POLICY_EVENT));
}

function readSuppression(enabled: boolean): EffectSuppression | null {
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const connection = (navigator as NavigatorWithConnection).connection;
  return getEffectSuppression({
    enabled,
    reducedMotion: motionQuery.matches,
    saveData: connection?.saveData === true,
    documentHidden: document.visibilityState === "hidden",
    performanceKill:
      document.documentElement.dataset.effectsDisabled ===
      EFFECTS_DISABLED_DATASET_VALUE,
  });
}

export function useEffectSuppression(
  enabled: boolean,
): EffectSuppression | null {
  const [suppression, setSuppression] = useState<EffectSuppression | null>(
    enabled ? null : "flag-disabled",
  );

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as NavigatorWithConnection).connection;
    const update = () => setSuppression(readSuppression(enabled));

    update();
    motionQuery.addEventListener("change", update);
    connection?.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    window.addEventListener(EFFECTS_POLICY_EVENT, update);

    return () => {
      motionQuery.removeEventListener("change", update);
      connection?.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener(EFFECTS_POLICY_EVENT, update);
    };
  }, [enabled]);

  return suppression;
}
