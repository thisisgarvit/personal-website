"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  deriveJourneyInsights,
  furthestJourneyStage,
  getJourneyServerSnapshot,
  getJourneySnapshot,
  journeyStages,
  nextJourneyStage,
  subscribeJourney,
  type JourneyStage,
} from "./journey-store";
import styles from "./SessionJourneySection.module.css";

const labels: Record<JourneyStage, string> = {
  landed: "Landed",
  scrolled: "Scrolled",
  played: "Played",
  "read-work": "Read work",
  converted: "Converted",
};

/** Authored comparison only — intentionally not presented as collected analytics. */
const typicalVisitor = [100, 76, 49, 28, 11] as const;

function formatDuration(milliseconds: number): string {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000));
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

export function SessionJourneySection() {
  const journey = useSyncExternalStore(
    subscribeJourney,
    getJourneySnapshot,
    getJourneyServerSnapshot,
  );
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.visibilityState !== "hidden") setNow(Date.now());
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const furthest = furthestJourneyStage(journey);
  const next = nextJourneyStage(journey);
  const elapsed = journey.startedAt ? now - journey.startedAt : 0;
  const insights = deriveJourneyInsights(journey);

  return (
    <section className={styles.section} aria-labelledby="journey-title">
      <header className={styles.header}>
        <div>
          <h2 id="journey-title" className={styles.title}>
            Your session, instrumented.
          </h2>
          <p className={styles.disclosure}>
            computed in your browser. I never see it.
          </p>
        </div>
        <span className={styles.liveState}>
          <i aria-hidden="true" /> THIS TAB · LIVE
        </span>
      </header>

      <div className={styles.legend} aria-label="Funnel legend">
        <span><i data-series="session" /> this tab</span>
        <span><i data-series="typical" /> typical visitor · authored benchmark</span>
      </div>
      <ol className={styles.funnel} aria-label="This session’s journey funnel">
        {journeyStages.map((stage, index) => (
          <li
            key={stage}
            className={styles.stage}
            data-reached={journey.reached[stage] ? "true" : "false"}
            data-current={stage === journey.lastEvent ? "true" : "false"}
          >
            <div className={styles.stageMeta}>
              <span>
                <i>{String(index + 1).padStart(2, "0")}</i>
                <b>{labels[stage]}</b>
              </span>
              <strong>
                {journey.reached[stage] ? "100" : "0"}%
                <small> step-over-step</small>
              </strong>
            </div>
            <div className={styles.bar} aria-hidden="true">
              <span
                className={styles.typicalBar}
                style={{ width: `${typicalVisitor[index]}%` }}
              />
              <span
                className={styles.sessionBar}
                style={{ width: journey.reached[stage] ? "100%" : "0%" }}
              />
            </div>
            <small className={styles.benchmark}>
              typical {typicalVisitor[index]}% · {journey.reached[stage] ? "seen this tab" : "not yet this tab"}
            </small>
          </li>
        ))}
      </ol>

      <div className={styles.readout}>
        <dl>
          <div>
            <dt>TIME HERE</dt>
            <dd>{formatDuration(elapsed)}</dd>
          </div>
          <div>
            <dt>DELIBERATE ACTS</dt>
            <dd>
              {journey.interactions} {journey.interactions === 1 ? "interaction" : "interactions"}
            </dd>
          </div>
          <div>
            <dt>FURTHEST SIGNAL</dt>
            <dd>{labels[furthest]} · furthest</dd>
          </div>
          <div>
            <dt>OPEN LOOP</dt>
            <dd>{next ? labels[next] : "None. You found the whole thing."}</dd>
          </div>
        </dl>
        <div className={styles.insights} aria-label="Session insights">
          {insights.map((insight) => (
            <p key={insight}>{insight}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
