import type { Metadata } from "next";
import { CaseShell } from "@/components/case/CaseShell";

export const metadata: Metadata = {
  title: "Agentic Calendar",
};

export default function AgenticCalendarPage() {
  return (
    <CaseShell
      kindLabel="Product concept"
      ticketId="GAR-207"
      title="Agentic Calendar"
    >
      <p>Product concept case study — full narrative lands in Task 5.</p>
    </CaseShell>
  );
}
