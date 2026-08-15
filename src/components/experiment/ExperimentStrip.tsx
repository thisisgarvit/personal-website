"use client";

import { useState, useSyncExternalStore } from "react";
import { BANNER_DISMISSED_KEY } from "@/data/storage";
import { toast } from "@/components/toast/toast";
import styles from "./ExperimentStrip.module.css";

/**
 * Experiment strip (DESIGN.md §5.3, PRD §5.2).
 *
 * Always renders authored variant B server-side (so no-JS visitors keep
 * the banner — PRD §13). After hydration, a same-tab dismissal recorded in
 * sessionStorage hides it. Dismissal shows the fictional logged-event
 * toast (product humor only — never the real analytics adapter) and moves
 * focus to the next logical control, the hero resume CTA (tab order per
 * DESIGN.md §8: chrome → banner → hero CTAs).
 */
const emptySubscribe = () => () => {};

function readStoredDismissal(): boolean {
  try {
    return sessionStorage.getItem(BANNER_DISMISSED_KEY) === "1";
  } catch {
    // Storage unavailable → banner simply stays, matching authored state.
    return false;
  }
}

export function ExperimentStrip() {
  // Hydration-safe stored-dismissal read: server snapshot renders the
  // banner (no-JS visitors keep it); a same-tab stored dismissal hides
  // it on the client without a hydration warning.
  const storedDismissed = useSyncExternalStore(
    emptySubscribe,
    readStoredDismissal,
    () => false,
  );
  const [dismissedNow, setDismissedNow] = useState(false);

  if (storedDismissed || dismissedNow) return null;

  const dismiss = () => {
    try {
      sessionStorage.setItem(BANNER_DISMISSED_KEY, "1");
    } catch {
      // Memory-only dismissal is an acceptable fallback.
    }
    setDismissedNow(true);
    toast("event logged: banner_dismissed. noted.");
    document.getElementById("resume-cta")?.focus();
  };

  return (
    <aside className={styles.strip} aria-label="Experiment status">
      <span className={styles.variant}>EXPERIMENT · B</span>
      <p className={styles.copy}>
        You’re in variant B of this hero.{" "}
        <span className={styles.copyQuiet}>Variant A converts worse.</span>
      </p>
      <button
        type="button"
        className={styles.dismiss}
        aria-label="Dismiss experiment banner"
        onClick={dismiss}
      >
        <span aria-hidden="true">×</span>
      </button>
    </aside>
  );
}
