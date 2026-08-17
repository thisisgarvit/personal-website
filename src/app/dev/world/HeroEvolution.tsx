"use client";

import { useEffect, useState } from "react";
import styles from "./world-prototype.module.css";

type HeroPhase = "mvp" | "beta" | "ga";

export function HeroEvolution({ lead, tail }: { lead: string; tail: string }) {
  const [phase, setPhase] = useState<HeroPhase>("ga");
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let beta: number | undefined;
    let ga: number | undefined;
    const start = window.setTimeout(() => {
      if (reduced) {
        setPhase("ga");
        return;
      }
      setPhase("mvp");
      beta = window.setTimeout(() => setPhase("beta"), 720);
      ga = window.setTimeout(() => setPhase("ga"), 1480);
    }, 0);
    return () => {
      window.clearTimeout(start);
      if (beta !== undefined) window.clearTimeout(beta);
      if (ga !== undefined) window.clearTimeout(ga);
    };
  }, [cycle]);

  return (
    <div
      className={styles.evolution}
      data-hero-evolution
      data-hero-phase={phase}
    >
      <div className={styles.phaseRail}>
        {(["MVP", "BETA", "GA"] as const).map((label) => (
          <span
            key={label}
            aria-hidden="true"
            data-active={phase === label.toLowerCase() ? "true" : "false"}
          >
            {label}
          </span>
        ))}
        <button
          type="button"
          aria-label="Replay idea to release"
          onClick={() => setCycle((value) => value + 1)}
        >
          ↻ Replay
        </button>
      </div>
      <h1 id="world-prototype-title" className={styles.headline}>
        <span className={styles.headlineLine}>{lead}</span>{" "}
        <span className={`${styles.headlineLine} ${styles.releaseLine}`}>
          into {tail}
        </span>
      </h1>
    </div>
  );
}
