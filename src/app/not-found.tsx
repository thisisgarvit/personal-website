import Link from "next/link";
import { CaseShell } from "@/components/case/CaseShell";

/**
 * Accessible not-found state (PRD §3): concept-consistent and minimal —
 * not a portfolio section.
 */
export default function NotFound() {
  return (
    <CaseShell kindLabel="404" title="Page not found">
      <p>
        This route does not exist. <Link href="/">Return to the homepage</Link>.
      </p>
    </CaseShell>
  );
}
