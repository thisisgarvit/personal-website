/**
 * Release notes for the version popover and changelog ticker (PRD §5.1).
 *
 * Exactly three entries; there is no "Full changelog" affordance or
 * /changelog route (PRD §5.1 rules — this intentionally supersedes the
 * DESIGN.md §5.2 mention of one; PRD owns behavior).
 *
 * Copy is the PRD §5.1 initial candid set, stored WITHOUT the leading
 * `fixed:`/`shipped:`/`known issue:` prefix because `type` already carries
 * it; renderers derive the display prefix via `releaseTypeLabel` so the
 * ticker line reproduces the PRD strings verbatim, e.g.
 * `v2.4.1 — fixed: hero said “passionate”. rolled back.`
 *
 * DATES (content-QA note): PRD §5.1 forbids invented dates — each date
 * below is a real recorded project milestone:
 *  - 2026-08-15 → production build started (DESIGN.md/PRD locked,
 *    Task 3 scaffold committed). Mapped to the v2.4.1 "fixed" note —
 *    the newest entry belongs to the newest milestone.
 *  - 2026-07-17 → approved vertical slice shipped (slice-product.html,
 *    slice-notes.md). Mapped to the "shipped" note — the slice is the
 *    build in which portfolio tickets first became a working board.
 *  - 2026-07-16 → "This site is my product" concept chosen
 *    (design-directions-curated.md / concept spec). Mapped to the
 *    "known issue" note as the oldest surviving entry.
 * Task 12 records the actual v2.4.1 launch date at release.
 */

export interface ReleaseNote {
  id: string;
  version: string;
  date: `${number}-${number}-${number}`;
  type: "fixed" | "shipped" | "known-issue";
  copy: string;
}

/** Display prefix for a note type (mono, lowercase — PRD §5.1 register). */
export function releaseTypeLabel(type: ReleaseNote["type"]): string {
  return type === "known-issue" ? "known issue" : type;
}

/** Newest first. `releases[0]` is the ticker's static latest note. */
export const releases: readonly ReleaseNote[] = [
  {
    id: "rel-2-4-1",
    version: "2.4.1",
    date: "2026-08-15",
    type: "fixed",
    copy: "hero said “passionate”. rolled back.",
  },
  {
    id: "rel-2-4-0",
    version: "2.4.0",
    date: "2026-07-17",
    type: "shipped",
    copy: "portfolio tickets can now escape the backlog.",
  },
  {
    id: "rel-2-3-2",
    version: "2.3.2",
    date: "2026-07-16",
    type: "known-issue",
    copy: "still opens too many product tabs.",
  },
] as const;

/** The single static ticker line (chrome renders only this at Task 4;
 *  rotation belongs to the flags/board lane per DESIGN.md §7.6). */
export const latestReleaseLine = `v${releases[0].version} — ${releaseTypeLabel(
  releases[0].type,
)}: ${releases[0].copy}`;
