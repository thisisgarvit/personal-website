import type { ReactNode } from "react";
import { ProductChrome } from "@/components/chrome/ProductChrome";
import type { CaseOpeningData } from "@/data/case-openings";
import { workBySlug, type WorkItem } from "@/data/work";
import { CaseOpening } from "./CaseOpening";
import styles from "./CaseShell.module.css";

/**
 * Case-route shell (Gate E, plan Task 7; DESIGN.md §5.10):
 * global product chrome → artifact-led opening (back-to-board, kind label,
 * ticket id, title, one-sentence value, three verified facts, one large
 * real artifact) → calm 68ch reading column → linear previous/next case
 * navigation, null-ended (never wraps).
 *
 * No analytics anywhere in this tree — `CasePreviewDialog` remains the
 * sole owner of `full_case_read`.
 */
export interface CaseShellProps extends CaseOpeningData {
  artifact: ReactNode;
  children: ReactNode;
}

export function CaseShell({ artifact, children, ...opening }: CaseShellProps) {
  const previous = opening.previous ? workBySlug(opening.previous) : null;
  const next = opening.next ? workBySlug(opening.next) : null;

  return (
    <>
      <ProductChrome />
      <main className={styles.main}>
        <CaseOpening {...opening} artifact={artifact} />
        <article className={styles.column}>
          <div className={styles.body} data-case-body>
            {children}
          </div>
        </article>
        <nav className={styles.caseNav} aria-label="Case navigation">
          <CaseNavSlot direction="previous" item={previous} />
          <CaseNavSlot direction="next" item={next} />
        </nav>
      </main>
    </>
  );
}

/**
 * One side of the linear case navigation. A null neighbour renders a
 * plain end-of-line marker, not a wrapped link (adjacency is null-ended).
 */
function CaseNavSlot({
  direction,
  item,
}: {
  direction: "previous" | "next";
  item: WorkItem | null;
}) {
  const isNext = direction === "next";
  if (!item) {
    return (
      <span className={`${styles.navEnd} ${isNext ? styles.navRight : ""}`}>
        {isNext ? "End of board" : "Start of board"}
      </span>
    );
  }
  return (
    <a
      className={`${styles.navLink} ${isNext ? styles.navRight : ""}`}
      href={item.route}
      rel={isNext ? "next" : "prev"}
    >
      <span className={styles.navDirection}>
        {isNext ? (
          <>
            Next case <span aria-hidden="true">→</span>
          </>
        ) : (
          <>
            <span aria-hidden="true">←</span> Previous case
          </>
        )}
      </span>
      <span className={styles.navTitle}>{item.title}</span>
    </a>
  );
}
