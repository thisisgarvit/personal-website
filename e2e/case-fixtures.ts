import {
  BACK_TO_BOARD_HREF,
  caseOpeningBySlug,
  caseOpenings,
} from "../src/data/case-openings";
import { workBySlug, type WorkSlug } from "../src/data/work";

export { siteConfig, workItems } from "./support";
export { BACK_TO_BOARD_HREF, caseOpeningBySlug, caseOpenings };

/**
 * Kind labels as rendered by each case route's opening (PRD §8: honest
 * shipped/concept/research labelling near the title). Kept as an explicit
 * fixture so a route silently changing its label fails the suite — these
 * strings intentionally do NOT import from `case-openings.ts` labels.
 */
export const workBySlugFixture: Record<WorkSlug, { kindLabel: string }> = {
  "stay-portal": { kindLabel: "Shipped product" },
  maxie: { kindLabel: "0→1 product concept" },
  "agentic-calendar": { kindLabel: "Product concept" },
  "dynamic-island": { kindLabel: "Product note / research" },
};

/** Route for an adjacent slug (null-ended navigation fixture helper). */
export function routeForSlug(slug: WorkSlug): string {
  return workBySlug(slug).route;
}
