import styles from "./agentic-calendar-system.module.css";

/**
 * Agentic Calendar product-system diagram (Gate E, plan Task 7 Step 7).
 *
 * The concept has no rights-cleared product screenshot, so the opening
 * artifact is an AUTHORED DIAGRAM built in code strictly from the sourced
 * facts in content-source/agentic-calendar.md (the same source as this
 * route's prose and the board's preview facts): ONE agentic layer on top
 * of existing calendar tools, FOUR core capabilities, FIVE product
 * surfaces. No invented metrics, screens, or shipped status.
 */

const CAPABILITIES = [
  "Intelligent monitoring of goals and priorities",
  "Autonomous permissions to negotiate on your behalf",
  "An all-time helper across past, present, and future",
  "You stay in control of the smart suggestions",
] as const;

const SURFACES = [
  "Calendar",
  "Actions",
  "Suggestions",
  "Tasks",
  "Analytics",
] as const;

export function AgenticCalendarSystem() {
  return (
    <figure className={styles.figure}>
      <div className={styles.frame}>
        <section className={styles.layer} aria-label="1 agentic layer">
          <p className={styles.bandLabel}>
            <b>1</b> agentic layer
          </p>
          <p className={styles.layerCopy}>
            Sits on top of the calendars you already use — Google Calendar,
            Notion Calendar, tools like Reclaim — not another calendar app.
          </p>
        </section>
        <section
          className={styles.capabilities}
          aria-label="4 core capabilities"
        >
          <p className={styles.bandLabel}>
            <b>4</b> core capabilities
          </p>
          <ul className={styles.capabilityList}>
            {CAPABILITIES.map((capability, index) => (
              <li key={capability}>
                <span className={styles.index}>{index + 1}</span>
                {capability}
              </li>
            ))}
          </ul>
        </section>
        <section className={styles.surfaces} aria-label="5 product surfaces">
          <p className={styles.bandLabel}>
            <b>5</b> product surfaces
          </p>
          <ul className={styles.surfaceList}>
            {SURFACES.map((surface) => (
              <li key={surface}>{surface}</li>
            ))}
          </ul>
        </section>
      </div>
      <figcaption className={styles.caption}>
        The concept&rsquo;s product system — one agentic layer, four capabilities,
        five surfaces. Authored diagram from the sourced spec; not a product
        screenshot.
      </figcaption>
    </figure>
  );
}
