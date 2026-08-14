import type { Metadata } from "next";
import { CaseShell } from "@/components/case/CaseShell";

export const metadata: Metadata = {
  title: "AI Browser — Maxie",
};

export default function MaxiePage() {
  return (
    <CaseShell
      kindLabel="0→1 product concept"
      ticketId="GAR-204"
      title="AI Browser — Maxie"
    >
      <p>Product concept case study — full narrative lands in Task 5.</p>
    </CaseShell>
  );
}
