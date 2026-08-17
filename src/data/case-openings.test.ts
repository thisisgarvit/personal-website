import { describe, expect, it } from "vitest";
import {
  BACK_TO_BOARD_HREF,
  caseOpeningBySlug,
  caseOpenings,
} from "./case-openings";
import { workBySlug, workItems } from "./work";

/**
 * Gate E data contract (plan Task 7, Step 2):
 * exactly four openings, facts REUSED from workItems by reference (never
 * copied strings), linear previous/next adjacency null-ended at both ends,
 * honest kind labels, and no opening claim outside approved data.
 */

describe("case-openings data", () => {
  it("has exactly the four work slugs, in board order", () => {
    expect(caseOpenings.map((opening) => opening.slug)).toEqual(
      workItems.map((item) => item.slug),
    );
    expect(caseOpenings).toHaveLength(4);
  });

  it("reuses facts, title, ticket id, and value from workItems by reference", () => {
    for (const opening of caseOpenings) {
      const work = workBySlug(opening.slug);
      // Reference equality: openings must not copy fact strings.
      expect(opening.facts).toBe(work.previewFacts);
      expect(opening.facts).toHaveLength(3);
      expect(opening.title).toBe(work.title);
      expect(opening.ticketId).toBe(work.id);
      // The one-sentence value is the approved board summary, reused.
      expect(opening.value).toBe(work.summary);
    }
  });

  it("chains linear previous/next adjacency, null-ended at both ends", () => {
    expect(caseOpenings[0].previous).toBeNull();
    expect(caseOpenings[caseOpenings.length - 1].next).toBeNull();
    for (let i = 0; i < caseOpenings.length; i += 1) {
      expect(caseOpenings[i].previous).toBe(
        i === 0 ? null : caseOpenings[i - 1].slug,
      );
      expect(caseOpenings[i].next).toBe(
        i === caseOpenings.length - 1 ? null : caseOpenings[i + 1].slug,
      );
    }
  });

  it("labels kinds honestly — only the shipped case says Shipped", () => {
    for (const opening of caseOpenings) {
      const work = workBySlug(opening.slug);
      if (work.kind === "shipped") {
        expect(opening.kindLabel).toBe("Shipped product");
      } else {
        expect(opening.kindLabel).not.toMatch(/shipped/i);
      }
    }
    expect(caseOpeningBySlug("maxie").kindLabel).toBe("0→1 product concept");
    expect(caseOpeningBySlug("agentic-calendar").kindLabel).toBe(
      "Product concept",
    );
    expect(caseOpeningBySlug("dynamic-island").kindLabel).toBe(
      "Product note / research",
    );
  });

  it("looks up openings by slug and exposes the back-to-board href", () => {
    expect(caseOpeningBySlug("stay-portal").slug).toBe("stay-portal");
    expect(BACK_TO_BOARD_HREF).toBe("/#work-board");
  });
});
