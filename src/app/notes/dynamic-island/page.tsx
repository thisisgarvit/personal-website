import type { Metadata } from "next";
import { CaseShell } from "@/components/case/CaseShell";
import { caseOpeningBySlug } from "@/data/case-openings";
import { workBySlug } from "@/data/work";
import Content from "./content.mdx";
import { DynamicIslandContinuity } from "./dynamic-island-continuity";

const work = workBySlug("dynamic-island");
const opening = caseOpeningBySlug("dynamic-island");

export const metadata: Metadata = {
  title: work.title,
  description: work.summary,
};

/**
 * Gate E artifact-led opening: a research note has no product screenshot
 * to show, so it opens on the authored continuity/status diagram built
 * from the teardown's sourced claims only.
 */
export default function DynamicIslandPage() {
  return (
    <CaseShell {...opening} artifact={<DynamicIslandContinuity />}>
      <Content />
    </CaseShell>
  );
}
