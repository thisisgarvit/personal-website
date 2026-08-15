import { MascotExperience } from "@/features/mascot";
import styles from "./ops.module.css";

/**
 * Reserved mount surface for the session-journey analyst figure.
 *
 * OWNERSHIP: the figure itself (SVG poster + lazy R3F scene) is Codex
 * Task 8 (`src/features/mascot/**`). Task 8 renders its poster/canvas
 * INSIDE the element marked `data-mascot-slot` — replace the empty-state
 * contents, keep the stage geometry. This component reserves layout so
 * the operations rail is stable before the mascot lands (no CLS).
 */
export function MascotSlot() {
  return (
    <div className={styles.mascotStage} data-mascot-slot>
      <MascotExperience />
      <span className={styles.trackerLabel}>TRACKING YOUR SESSION</span>
    </div>
  );
}
