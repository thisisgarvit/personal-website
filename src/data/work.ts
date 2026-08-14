/**
 * Authored sprint-board work matrix (PRD §7).
 *
 * Implements the PRD §7 data contract exactly. All ticket copy (titles,
 * summaries, candid notes, preview facts) is extracted VERBATIM from the
 * approved slice (slice-product.html board markup + `cases` data), per the
 * Task 4 brief. Task 5 content QA may correct factual conflicts only.
 *
 * Every preview fact carries a `sourceRef` (PRD §7: unsourced facts fail
 * content QA) pointing at the content-source document and/or the approved
 * slice section it was taken from.
 */

export type WorkSlug =
  | "stay-portal"
  | "maxie"
  | "agentic-calendar"
  | "dynamic-island";

export type BoardColumn = "shipped" | "in-progress" | "backlog";
export type WorkKind = "shipped" | "concept" | "research";

export interface PreviewFact {
  value: string;
  label: string;
  sourceRef: string;
}

export interface WorkItem {
  id: `GAR-${number}`;
  slug: WorkSlug;
  route: `/work/${string}` | `/notes/${string}`;
  kind: WorkKind;
  authoredColumn: BoardColumn;
  title: string;
  summary: string;
  priority: "P0" | "P1" | "R&D";
  points: string;
  accent: "merge" | "context" | "question" | "incident";
  candidNote: string;
  previewFacts: readonly PreviewFact[];
}

export const workItems: readonly WorkItem[] = [
  {
    id: "GAR-101",
    slug: "stay-portal",
    route: "/work/stay-portal",
    kind: "shipped",
    authoredColumn: "shipped",
    title: "Stay Portal",
    summary:
      "Five apartments, flexible bookings, and no more spreadsheet collisions.",
    priority: "P0",
    points: "21 SP",
    accent: "merge",
    // Slice annotation reads "* Story points measured after shipping. Very
    // efficient." — the leading asterisk paired with the slice's "21 SP*"
    // chip; PRD §7 locks points as "21 SP", so the dangling "* " is dropped.
    candidNote: "Story points measured after shipping. Very efficient.",
    previewFacts: [
      {
        value: "5",
        label: "rooms",
        sourceRef:
          "airbnb-portal-case-study-raw.md — The product (5 apartments); PRD.md §8 permitted evidence",
      },
      {
        value: "484",
        label: "bookings imported",
        sourceRef:
          "airbnb-portal-case-study-raw.md — Quantifiable facts (484 historical bookings); PRD.md §8 permitted evidence",
      },
      {
        value: "₹0",
        label: "monthly infra",
        sourceRef:
          "airbnb-portal-case-study-raw.md — Quantifiable facts (₹0/month running cost); PRD.md §8 permitted evidence",
      },
    ],
  },
  {
    id: "GAR-204",
    slug: "maxie",
    route: "/work/maxie",
    kind: "concept",
    authoredColumn: "in-progress",
    title: "AI Browser — Maxie",
    summary: "Contextual memory and trainable agents, not another chat sidebar.",
    priority: "P1",
    points: "13 SP",
    accent: "context",
    candidNote: "Assumptions included at no extra cost.",
    previewFacts: [
      {
        value: "20+",
        label: "tabs in the problem",
        sourceRef:
          "content-source/ai-browser-maxie.md; slice-product.html cases.maxie",
      },
      {
        value: "3",
        label: "core systems",
        sourceRef:
          "content-source/ai-browser-maxie.md; slice-product.html cases.maxie",
      },
      {
        value: "6 mo",
        label: "MVP frame",
        sourceRef:
          "content-source/ai-browser-maxie.md; slice-product.html cases.maxie",
      },
    ],
  },
  {
    id: "GAR-207",
    slug: "agentic-calendar",
    route: "/work/agentic-calendar",
    kind: "concept",
    authoredColumn: "in-progress",
    title: "Agentic Calendar",
    summary: "A scheduling proxy that understands context and knows when to ask.",
    priority: "P1",
    points: "8 SP",
    accent: "question",
    candidNote: "Scope says “agentic layer.” The roadmap heard “calendar empire.”",
    previewFacts: [
      {
        value: "5",
        label: "product surfaces",
        sourceRef:
          "content-source/agentic-calendar.md; slice-product.html cases.calendar",
      },
      {
        value: "4",
        label: "core capabilities",
        sourceRef:
          "content-source/agentic-calendar.md; slice-product.html cases.calendar",
      },
      {
        value: "1",
        label: "agentic layer",
        sourceRef:
          "content-source/agentic-calendar.md; slice-product.html cases.calendar",
      },
    ],
  },
  {
    id: "GAR-309",
    slug: "dynamic-island",
    route: "/notes/dynamic-island",
    kind: "research",
    authoredColumn: "backlog",
    title: "Why the notch became delightful",
    summary:
      "A product teardown of Dynamic Island and the organizational bet behind it.",
    priority: "R&D",
    points: "5 SP",
    accent: "incident",
    candidNote:
      "The real dependency was leadership willing to care about the last 10%.",
    previewFacts: [
      {
        value: "1",
        label: "hardware constraint",
        sourceRef:
          "content-source/garvit-sukhija-product-thinking-and-case-studies.md — Dynamic Island teaser (“turning hardware constraints into product magic”); slice-product.html cases.island",
      },
      {
        value: "0",
        label: "new core functions",
        sourceRef:
          "content-source/one-delightful-product-experience.md — What Made it Special (“the functionality in itself was not new”); slice-product.html cases.island",
      },
      {
        value: "10%",
        label: "where delight lives",
        sourceRef:
          "PRD.md §8 /notes/dynamic-island required story (the final 10%); slice-product.html cases.island",
      },
    ],
  },
] as const;

/** Ticket-ID kind annotation, e.g. `GAR-101 · PRODUCT` (slice board markup). */
export function kindTicketLabel(kind: WorkKind): string {
  switch (kind) {
    case "shipped":
      return "PRODUCT";
    case "concept":
      return "CONCEPT";
    case "research":
      return "RESEARCH";
  }
}

/** Column display labels (DESIGN.md §5.7). */
export const boardColumns: readonly { id: BoardColumn; label: string }[] = [
  { id: "shipped", label: "Shipped" },
  { id: "in-progress", label: "In progress" },
  { id: "backlog", label: "Backlog" },
] as const;

export function itemsForColumn(column: BoardColumn): readonly WorkItem[] {
  return workItems.filter((item) => item.authoredColumn === column);
}

/** Lookup by slug; the union type makes a miss unrepresentable. */
export function workBySlug(slug: WorkSlug): WorkItem {
  const item = workItems.find((candidate) => candidate.slug === slug);
  if (!item) {
    throw new Error(`Unknown work slug: ${slug}`);
  }
  return item;
}
