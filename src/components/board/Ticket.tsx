import Link from "next/link";
import { kindTicketLabel, type WorkItem } from "@/data/work";
import styles from "./board.module.css";

/**
 * Static ticket (DESIGN.md §5.8) — Task 4 renders the authored resting
 * state only:
 *  - the entire non-grip body is a real route link (this IS the no-JS
 *    path, PRD §7 / DESIGN.md §8);
 *  - the 44px drag grip is rendered but inert (drag logic is Codex
 *    Task 7, src/features/board/**);
 *  - the candid field note markup is present and visible (candid_mode
 *    defaults on); visibility toggling is Codex Task 6/7 — target the
 *    `data-candid-note` attribute.
 */
export function Ticket({ item }: { item: WorkItem }) {
  return (
    <article
      className={styles.ticket}
      data-accent={item.accent}
      data-ticket={item.slug}
    >
      <Link href={item.route} className={styles.ticketBody}>
        <span className={styles.ticketId}>
          {item.id} · {kindTicketLabel(item.kind)}
        </span>
        <h3 className={styles.ticketTitle}>{item.title}</h3>
        <p className={styles.ticketSummary}>{item.summary}</p>
        <span className={styles.chips}>
          <span className={`${styles.chip} ${styles.chipPriority}`}>
            {item.priority}
          </span>
          <span className={styles.chip}>{item.points}</span>
        </span>
        <span className={styles.candidNote} data-candid-note>
          {item.candidNote}
        </span>
      </Link>
      {/* Inert 44px grip (DESIGN.md §5.8 item 2); Task 7 wires pointer
          capture + physics. touch-action: none stays grip-only (§8). */}
      <button
        type="button"
        className={styles.grip}
        aria-label={`Drag ${item.title}`}
      >
        <span aria-hidden="true">⠿</span>
      </button>
    </article>
  );
}
