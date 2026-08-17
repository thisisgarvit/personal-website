import type { Metadata } from "next";
import { CaseShell } from "@/components/case/CaseShell";
import { caseOpeningBySlug } from "@/data/case-openings";
import { workBySlug } from "@/data/work";
import { AgenticCalendarSystem } from "./agentic-calendar-system";
import Content from "./content.mdx";

const work = workBySlug("agentic-calendar");
const opening = caseOpeningBySlug("agentic-calendar");

export const metadata: Metadata = {
  title: work.title,
  description: work.summary,
};

/**
 * Gate E artifact-led opening: no rights-cleared screenshot exists for
 * this concept, so it opens on a verified product-system diagram built in
 * code from its sourced facts (5 surfaces / 4 capabilities / 1 agentic
 * layer) — never a synthetic screenshot.
 */
export default function AgenticCalendarPage() {
  return (
    <CaseShell {...opening} artifact={<AgenticCalendarSystem />}>
      <Content />
    </CaseShell>
  );
}
