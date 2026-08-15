import type { WorkSlug } from "../src/data/work";

export { siteConfig, workItems } from "./support";

/**
 * Kind labels as rendered by each case route's <CaseShell kindLabel=…>
 * (PRD §8: honest shipped/concept/research labelling near the title).
 * Kept as an explicit fixture so a route silently changing its label
 * fails the suite.
 */
export const workBySlugFixture: Record<WorkSlug, { kindLabel: string }> = {
  "stay-portal": { kindLabel: "Shipped product" },
  maxie: { kindLabel: "0→1 product concept" },
  "agentic-calendar": { kindLabel: "Product concept" },
  "dynamic-island": { kindLabel: "Product note / research" },
};
