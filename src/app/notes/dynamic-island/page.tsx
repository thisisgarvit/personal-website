import type { Metadata } from "next";
import { CaseShell } from "@/components/case/CaseShell";

export const metadata: Metadata = {
  title: "Why the notch became delightful",
};

export default function DynamicIslandPage() {
  return (
    <CaseShell
      kindLabel="Product note"
      ticketId="GAR-309"
      title="Why the notch became delightful"
    >
      <p>Product note — full narrative lands in Task 5.</p>
    </CaseShell>
  );
}
