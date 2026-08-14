import type { Metadata } from "next";
import { CaseShell } from "@/components/case/CaseShell";

export const metadata: Metadata = {
  title: "Stay Portal",
};

export default function StayPortalPage() {
  return (
    <CaseShell kindLabel="Shipped product" ticketId="GAR-101" title="Stay Portal">
      <p>Shipped product case study — full narrative lands in Task 5.</p>
    </CaseShell>
  );
}
