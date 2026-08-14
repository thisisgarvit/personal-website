import type { Metadata } from "next";
import { CaseShell } from "@/components/case/CaseShell";
import { workBySlug } from "@/data/work";
import Content from "./content.mdx";

const work = workBySlug("dynamic-island");

export const metadata: Metadata = {
  title: work.title,
  description: work.summary,
};

export default function DynamicIslandPage() {
  return (
    <CaseShell
      kindLabel="Product note / research"
      ticketId={work.id}
      title={work.title}
    >
      <Content />
    </CaseShell>
  );
}
