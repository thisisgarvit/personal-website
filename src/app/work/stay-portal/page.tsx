import type { Metadata } from "next";
import { CaseShell } from "@/components/case/CaseShell";
import { workBySlug } from "@/data/work";
import Content from "./content.mdx";

const work = workBySlug("stay-portal");

export const metadata: Metadata = {
  title: work.title,
  description: work.summary,
};

export default function StayPortalPage() {
  return (
    <CaseShell kindLabel="Shipped product" ticketId={work.id} title={work.title}>
      <Content />
    </CaseShell>
  );
}
