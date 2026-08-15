import { FeatureFlagsPanel } from "@/features/flags";
import { MascotSlot } from "./MascotSlot";
import styles from "./ops.module.css";

/**
 * Operations rail: the session-journey analyst and live feature flags.
 */
export function OperationsRail() {
  return (
    <aside className={styles.rail} aria-label="Product controls">
      <section className={styles.panel} aria-labelledby="journey-analyst-title">
        <header className={styles.panelTitle}>
          <span id="journey-analyst-title">Session analyst</span>
          <span className={styles.analystState}>THIS TAB</span>
        </header>
        <MascotSlot />
      </section>
      <FeatureFlagsPanel />
    </aside>
  );
}
