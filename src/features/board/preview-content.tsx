import type { WorkSlug } from "@/data/work";
import styles from "./preview-artifacts.module.css";

interface PreviewContent {
  kindLabel: string;
  lede: string;
  details: readonly { heading: string; body: string }[];
}

export const previewContent: Record<WorkSlug, PreviewContent> = {
  "stay-portal": {
    kindLabel: "SHIPPED PRODUCT",
    lede:
      "A phone-first booking manager for five flexibly rented apartments—built around the actual messiness of hourly, half-day, and full-day stays.",
    details: [
      {
        heading: "The constraint",
        body: "The owner ran the operation in one Google Sheets tab per room. Several bookings could happen in one room on one day, across Airbnb, walk-ins, and referrals.",
      },
      {
        heading: "The product bet",
        body: "Prevent overlaps at the database layer, make today legible on a phone, and mirror data back to Sheets as an adoption bridge—not a forced migration.",
      },
    ],
  },
  maxie: {
    kindLabel: "0→1 PRODUCT CONCEPT",
    lede:
      "A browser that remembers the work, trains repeatable agents, and keeps a human in control—rather than attaching another chat window to the web.",
    details: [
      {
        heading: "The problem",
        body: "Browsers sit at the center of knowledge work but forget context between pages and sessions. Repeated workflows remain manual.",
      },
      {
        heading: "The bet",
        body: "Contextual memory and one trainable workflow create value before a marketplace. Provenance, permissions, and action logs make automation trustworthy.",
      },
    ],
  },
  "agentic-calendar": {
    kindLabel: "AGENTIC PRODUCT CONCEPT",
    lede:
      "An intelligent layer over the tools people already use—learning work rhythms, preparing context, and acting with explicit guardrails.",
    details: [
      {
        heading: "The principle",
        body: "Do not build another feature-heavy calendar. Use integrations to understand priorities and reduce the work of maintaining the grid.",
      },
      {
        heading: "The control model",
        body: "The agent knows when it can reschedule, prepare, or negotiate—and when a human approval is required. Autonomy is not an excuse to remove control.",
      },
    ],
  },
  "dynamic-island": {
    kindLabel: "PRODUCT RESEARCH",
    lede:
      "A teardown of Dynamic Island as a product decision: turning a hardware constraint into a living surface for continuity and control.",
    details: [
      {
        heading: "What worked",
        body: "The same notification controls already existed elsewhere. Cohesion, placement, and physics made them feel like one discoverable product surface.",
      },
      {
        heading: "The hard part",
        body: "Not the animation—the organizational willingness to spend months on an interaction that could be dismissed as making a notch look pretty.",
      },
    ],
  },
};

export function PreviewDetails({ slug }: { slug: WorkSlug }) {
  return (
    <div className={styles.details}>
      {previewContent[slug].details.map((detail) => (
        <section key={detail.heading}>
          <h3>{detail.heading}</h3>
          <p>{detail.body}</p>
        </section>
      ))}
    </div>
  );
}

export function PreviewArtifact({ slug }: { slug: WorkSlug }) {
  if (slug === "stay-portal") {
    return (
      <div className={`${styles.artifact} ${styles.stay}`} aria-label="Booking timeline model">
        {[72, 44, 63, 36, 58].map((width, index) => (
          <div className={styles.room} key={width}>
            <b>ROOM {index + 1}</b>
            <span><i style={{ width: `${width}%` }} /></span>
          </div>
        ))}
      </div>
    );
  }

  if (slug === "maxie") {
    return (
      <div className={`${styles.artifact} ${styles.maxie}`} aria-label="Maxie browser systems model">
        <aside><b>AGENTS</b><span>Memory</span><span>Research</span><span>QA runner</span></aside>
        <div><h3>A browser that remembers the work.</h3><p><span>CONTEXT</span><span>PROVENANCE</span><span>AGENT</span><span>APPROVAL</span></p></div>
      </div>
    );
  }

  if (slug === "agentic-calendar") {
    return (
      <div className={`${styles.artifact} ${styles.calendar}`} aria-label="Agentic calendar control model">
        <header><b>TUESDAY / OPTIMISED</b><span>HUMAN IN CONTROL</span></header>
        {[
          ["09:00", "CREATIVE · Maxie PRD"],
          ["11:00", "OPERATIONAL · Pilot review"],
          ["14:00", "RESTORATIVE · protected"],
          ["16:00", "APPROVAL · reschedule?"],
        ].map(([time, label]) => <div className={styles.slot} key={time}><span>{time}</span><b>{label}</b></div>)}
      </div>
    );
  }

  return (
    <div className={`${styles.artifact} ${styles.island}`} aria-label="Dynamic Island continuity model">
      <div className={styles.phone}><i /><p><b>Alive, not loud.</b>Enough delivery context to stay informed without reopening the app.</p></div>
    </div>
  );
}
