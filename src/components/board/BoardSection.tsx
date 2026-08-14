import { boardColumns, itemsForColumn } from "@/data/work";
import { Ticket } from "./Ticket";
import styles from "./board.module.css";

/**
 * Sprint-board portfolio shell (DESIGN.md §5.7, PRD §7).
 *
 * Task 4 renders the authored matrix statically: three columns with
 * counts, four tickets, an inert reset control, and the keyboard hint.
 * Drag physics, keyboard moves, persistence, reset behavior, and the
 * reset toast are Codex Task 7 (src/features/board/**). The board helper
 * copy `State lasts for this tab.` ships with that persistence work.
 */
export function BoardSection() {
  return (
    <section className={styles.section} aria-labelledby="board-title">
      <header className={styles.head}>
        <div>
          <h2 id="board-title" className={styles.title}>
            Things I’ve built
          </h2>
          <p className={styles.subtitle}>
            THE BOARD IS THE NAVIGATION · DRAG ANYTHING
          </p>
        </div>
        <div className={styles.actions}>
          <span className={styles.keyboardHint}>
            ENTER opens · ALT + ←/→ moves
          </span>
          {/* Inert in Task 4; Task 7 wires reset + its toast (the sole
              use of "Board reset. No sprint ceremony required.", PRD §5.5). */}
          <button type="button" className={styles.reset}>
            <span aria-hidden="true">↺</span>
            <span className={styles.resetLabel}> Reset board</span>
          </button>
        </div>
      </header>
      <div className={styles.board}>
        {boardColumns.map((column) => {
          const items = itemsForColumn(column.id);
          return (
            <section
              key={column.id}
              className={styles.column}
              data-column={column.id}
              aria-labelledby={`column-${column.id}`}
            >
              <header className={styles.columnHead}>
                <b id={`column-${column.id}`}>{column.label}</b>
                <span className={styles.count}>{items.length}</span>
              </header>
              <div className={styles.ticketList}>
                {items.map((item) => (
                  <Ticket key={item.id} item={item} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
