import type { ReactNode } from "react";
import styles from "./CaseShell.module.css";

/**
 * Calm long-form reading shell for case routes (DESIGN.md §5.10):
 * 68-character reading column, kind label visible near the title,
 * 96–160px major spacing. Body content is Task 5's port; Task 4 supplies
 * the layout and the labelled heading only.
 */
export function CaseShell({
  kindLabel,
  ticketId,
  title,
  children,
}: {
  /** "Shipped product" | "0→1 product concept" | "Product concept" | "Product note" */
  kindLabel: string;
  ticketId?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <main className={styles.main}>
      <article className={styles.column}>
        <p className={styles.kind}>
          {kindLabel}
          {ticketId ? ` · ${ticketId}` : null}
        </p>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.body}>{children}</div>
      </article>
    </main>
  );
}
