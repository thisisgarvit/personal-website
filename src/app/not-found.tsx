import Link from "next/link";
import { CaseShell } from "@/components/case/CaseShell";
import styles from "./not-found.module.css";

/**
 * Small blameless incident postmortem: the 404 is still product surface.
 */
export default function NotFound() {
  return (
    <CaseShell
      kindLabel="INC-0042 · SEV-3 · RESOLVED"
      title="Visitor reached a nonexistent route."
    >
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
    </CaseShell>
  );
}
