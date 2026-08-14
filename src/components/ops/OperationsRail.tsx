import { FlagsPanel } from "./FlagsPanel";
import { MascotSlot } from "./MascotSlot";
import styles from "./ops.module.css";

/**
 * Operations rail (DESIGN.md §5.6): exactly two authored surfaces — the
 * on-call PM and feature flags. Not a sidebar for secondary biography.
 */
export function OperationsRail() {
  return (
    <aside className={styles.rail} aria-label="Product controls">
      <section className={styles.panel} aria-labelledby="oncall-title">
        <header className={styles.panelTitle}>
          <span id="oncall-title">On-call PM</span>
        </header>
        <MascotSlot />
      </section>
      <FlagsPanel />
    </aside>
  );
}
