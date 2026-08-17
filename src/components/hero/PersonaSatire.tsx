"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { PERSONA_STORAGE_KEY } from "@/data/storage";
import { analytics, type VisitorPersona } from "@/lib/analytics";
import styles from "./PersonaSatire.module.css";

const personaChoices: readonly {
  value: VisitorPersona;
  label: string;
}[] = [
  { value: "founder", label: "Founder" },
  { value: "recruiter", label: "Recruiter" },
  { value: "product_lead", label: "Product lead" },
  { value: "just_browsing", label: "Just browsing" },
];

const completedPersonaValues = new Set<string>([
  "skipped",
  ...personaChoices.map(({ value }) => value),
]);

function hasCompletedPersonaPrompt(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const stored = sessionStorage.getItem(PERSONA_STORAGE_KEY);
    return stored !== null && completedPersonaValues.has(stored);
  } catch {
    return false;
  }
}

export function PersonaSatire() {
  const clientReady = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const [selected, setSelected] = useState<VisitorPersona | null>(null);
  const [dismissed, setDismissed] = useState(hasCompletedPersonaPrompt);

  useEffect(() => {
    if (!selected) return;
    const timeout = window.setTimeout(() => setDismissed(true), 1800);
    return () => window.clearTimeout(timeout);
  }, [selected]);

  if (!clientReady || dismissed) return null;

  const choose = (persona: VisitorPersona) => {
    sessionStorage.setItem(PERSONA_STORAGE_KEY, persona);
    analytics.track("persona_selected", {
      persona,
      surface: "hero_onboarding",
      $set: { visitor_persona: persona },
    });
    setSelected(persona);
  };

  const skip = () => {
    sessionStorage.setItem(PERSONA_STORAGE_KEY, "skipped");
    setDismissed(true);
  };

  return (
    <aside
      className={`${styles.tray} ph-no-capture`}
      aria-labelledby="persona-satire-title"
      aria-describedby="persona-satire-disclosure"
      data-persona-satire
    >
      <div className={styles.heading}>
        <div>
          <h2 id="persona-satire-title">What brings you here?</h2>
          <p id="persona-satire-disclosure">Your answer goes to PostHog.</p>
        </div>
        <button
          type="button"
          className={styles.skip}
          onClick={skip}
          data-persona-skip
        >
          Skip
        </button>
      </div>
      <div className={styles.choices} hidden={selected !== null}>
        {personaChoices.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            data-persona-choice={value}
            onClick={() => choose(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <p data-persona-payoff aria-live="polite" hidden={selected === null}>
        Noted. This changes nothing. It never does.
      </p>
    </aside>
  );
}
