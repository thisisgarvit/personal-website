import Link from "next/link";
import styles from "./not-found.module.css";

/**
 * Small blameless incident postmortem: the 404 is still product surface.
 * Renders its own calm reading layout — CaseShell is reserved for the
 * four artifact-led case routes (Gate E) and would demand an opening
 * artifact and board adjacency a 404 honestly does not have.
 */
export default function NotFound() {
  return (
    <main className={styles.main}>
      <article className={styles.column}>
        <p className={styles.kind}>INC-0042 · SEV-3 · RESOLVED</p>
        <h1 className={styles.title}>Visitor reached a nonexistent route.</h1>
        <div className={styles.body}>
          <p>No data lost. One tab briefly questioned the sitemap.</p>
          <dl className={styles.postmortem}>
            <div>
              <dt>Impact</dt>
              <dd>You expected a page. The product supplied this postmortem.</dd>
            </div>
            <div>
              <dt>Root cause</dt>
              <dd>PM overestimated his own information architecture.</dd>
            </div>
            <div>
              <dt>Resolution</dt>
              <dd className={styles.actions}>
                <Link href="/">Go home</Link>
                <Link href="/#work-board">Open the board</Link>
              </dd>
            </div>
          </dl>
        </div>
      </article>
    </main>
  );
}
