import {
  workItems,
  type PreviewFact,
  type WorkKind,
  type WorkSlug,
} from "./work";

/**
 * Typed artifact-led case openings (Gate E, plan Task 7).
 *
 * Every opening REUSES verified board data from `src/data/work.ts` by
 * reference — titles, ticket ids, one-sentence value (the board summary),
 * and the three sourced preview facts are never copied as strings, so a
 * content QA correction in `work.ts` propagates everywhere. Adjacency is
 * the linear board order, null-ended: `previous: null` on the first case,
 * `next: null` on the last. Navigation never wraps.
 */

export type CaseTreatment = "decision" | "constraint" | "outcome";

export interface CaseOpeningData {
  slug: WorkSlug;
  kindLabel: string;
  ticketId: string;
  title: string;
  value: string;
  facts: readonly PreviewFact[];
  previous: WorkSlug | null;
  next: WorkSlug | null;
}

/** The board section anchor every case's back affordance returns to. */
export const BACK_TO_BOARD_HREF = "/#work-board";

/**
 * Honest human kind labels (PRD §8: shipped/concept/research labelling
 * near the title). These are the exact strings the routes shipped with —
 * only the actually-shipped case may say "Shipped".
 */
const kindLabels: Record<WorkKind, string> = {
  shipped: "Shipped product",
  concept: "Product concept",
  research: "Product note / research",
};

/** Maxie's label is the sharper 0→1 variant of "concept" (route history). */
const kindLabelOverrides: Partial<Record<WorkSlug, string>> = {
  maxie: "0→1 product concept",
};

export const caseOpenings: readonly CaseOpeningData[] = workItems.map(
  (item, index) => ({
    slug: item.slug,
    kindLabel: kindLabelOverrides[item.slug] ?? kindLabels[item.kind],
    ticketId: item.id,
    title: item.title,
    value: item.summary,
    facts: item.previewFacts,
    previous: index > 0 ? workItems[index - 1].slug : null,
    next: index < workItems.length - 1 ? workItems[index + 1].slug : null,
  }),
);

/** Lookup by slug; the union type makes a miss unrepresentable. */
export function caseOpeningBySlug(slug: WorkSlug): CaseOpeningData {
  const opening = caseOpenings.find((candidate) => candidate.slug === slug);
  if (!opening) {
    throw new Error(`Unknown case opening slug: ${slug}`);
  }
  return opening;
}
