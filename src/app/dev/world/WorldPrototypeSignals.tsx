"use client";

import { emitMascotSignal, type MascotReaction } from "@/features/mascot/signals";
import { useWorldDirector } from "@/features/world";
import styles from "./world-prototype.module.css";

function signal(reaction: MascotReaction, source: "maxie" | "journey:played") {
  emitMascotSignal({ reaction, source, timestamp: Date.now() });
}

export function BoardSignalControls() {
  const director = useWorldDirector();
  return (
    <div className={styles.signalControls} aria-label="Board scene test controls">
      <button
        type="button"
        onClick={() => {
          director.setDragging(true);
          signal("drag-watch", "maxie");
        }}
      >
        Start ticket drag
      </button>
      <button
        type="button"
        onClick={() => {
          director.setDragging(false);
          signal("idle", "maxie");
        }}
      >
        End ticket drag
      </button>
      <button type="button" onClick={() => signal("incident", "maxie")}>
        Trigger incident
      </button>
      <button type="button" onClick={() => signal("resolved", "maxie")}>
        Resolve incident
      </button>
    </div>
  );
}

export function JourneySignalControls() {
  return (
    <div className={styles.signalControls} aria-label="Journey scene test controls">
      <button
        type="button"
        onClick={() => signal("milestone", "journey:played")}
      >
        Reach journey milestone
      </button>
      <button type="button" onClick={() => signal("shipped", "maxie")}>
        Ship ticket
      </button>
    </div>
  );
}
