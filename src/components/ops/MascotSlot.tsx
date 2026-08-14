import styles from "./ops.module.css";

/**
 * Reserved mount surface for the procedural on-call PM figure.
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
      {/* Empty state: stage surface + the ON CALL label that provides the
          joke (DESIGN.md §5.6). Codex Task 8 replaces this comment's
          siblings with the poster/scene, keeping the label. */}
      <span className={styles.onCallLabel}>ON CALL</span>
    </div>
  );
}
