import styles from "./dynamic-island-continuity.module.css";

/**
 * Dynamic Island continuity/status diagram (Gate E, plan Task 7 Step 7).
 *
 * This research note has no rights-cleared product imagery, so its opening
 * artifact is an AUTHORED DIAGRAM built strictly from the sourced claims in
 * content-source/one-delightful-product-experience.md (the same source as
 * the prose below): the island reads as a surface that is more than a
 * notification and less than a multitasking window, holding live status at
 * zero cognitive load. The three example states (delivery order, Face ID,
 * music controls) are the source's own examples. No invented UI, metrics,
 * or Apple-internal claims.
 */

const STATES = [
  {
    state: "Ongoing order",
    reading: "delivery status stays quietly in view after the app closes",
  },
  {
    state: "Face ID unlock",
    reading: "micro-animations land a small moment of delight",
  },
  {
    state: "Music playing",
    reading: "expands to skip a track mid-chat without taking the screen",
  },
] as const;

export function DynamicIslandContinuity() {
  return (
    <figure className={styles.figure}>
      <div className={styles.frame}>
        {/* The hardware constraint, abstracted: a sensor cutout that
            becomes a live status surface. */}
        <div className={styles.stage}>
          <span className={styles.island}>
            <span className={styles.sensor} aria-hidden="true" />
            live status
          </span>
        </div>
        <div className={styles.spectrum} aria-label="Continuity spectrum">
          <span className={styles.spectrumEnd}>a notification</span>
          <span className={styles.spectrumMid}>
            more than one, less than the other
          </span>
          <span className={styles.spectrumEnd}>a multitasking window</span>
        </div>
        <dl className={styles.states}>
          {STATES.map((entry) => (
            <div key={entry.state} className={styles.stateRow}>
              <dt>{entry.state}</dt>
              <dd>{entry.reading}</dd>
            </div>
          ))}
        </dl>
      </div>
      <figcaption className={styles.caption}>
        Continuity of information and control, read from use: one hardware
        cutout carrying live status between a notification and a window.
        Authored diagram from the sourced teardown; not an Apple asset.
      </figcaption>
    </figure>
  );
}
