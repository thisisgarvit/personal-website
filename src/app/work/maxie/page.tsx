import type { Metadata } from "next";
import { CaseFigure } from "@/components/case/CaseFigure";
import { CaseShell } from "@/components/case/CaseShell";
import { caseOpeningBySlug } from "@/data/case-openings";
import { workBySlug } from "@/data/work";
import Content from "./content.mdx";
import prototype from "./maxie-prototype.png";

const work = workBySlug("maxie");
const opening = caseOpeningBySlug("maxie");

export const metadata: Metadata = {
  title: work.title,
  description: work.summary,
};

/**
 * Gate E artifact-led opening: Maxie opens on its real clickable-prototype
 * screenshot (local asset, previously mid-MDX), promoted out of the body.
 */
export default function MaxiePage() {
  return (
    <CaseShell
      {...opening}
      artifact={
        <CaseFigure
          image={prototype}
          alt="Maxie prototype: a browser window with a projects bar of research workspaces across the top, agent icons in a left sidebar, a start screen of project cards in the center, and a Daily Assistant chat panel on the right with proactive suggestions."
          caption="The prototype: projects bar across the top, recruited agents on the left, main viewport in the center, assistant / browsing-tree panel on the right."
          sizes="(max-width: 1120px) 92vw, 1024px"
          priority
        />
      }
    >
      <Content />
    </CaseShell>
  );
}
