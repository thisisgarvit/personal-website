import type { FeatureFlagKey } from "./definitions";
import { emitMascotSignal } from "@/features/mascot/signals";

export const FLAG_EFFECT_EVENT = "garvit:flag-effect";

export interface FlagEffectDetail {
  key: FeatureFlagKey;
  enabled: boolean;
  source: "user" | "system";
}

type FlagEffectListener = (detail: FlagEffectDetail) => void;

/** Decorative consumers (notably Task 8's mascot) subscribe here. */
export function subscribeFlagEffects(listener: FlagEffectListener): () => void {
  if (typeof window === "undefined") return () => undefined;

  const handle = (event: Event) => {
    listener((event as CustomEvent<FlagEffectDetail>).detail);
  };
  window.addEventListener(FLAG_EFFECT_EVENT, handle);
  return () => window.removeEventListener(FLAG_EFFECT_EVENT, handle);
}

export function emitFlagEffect(detail: FlagEffectDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<FlagEffectDetail>(FLAG_EFFECT_EVENT, { detail }));
  emitMascotSignal({
    reaction: "flag-check",
    source: detail.key,
    timestamp: Date.now(),
  });
}
