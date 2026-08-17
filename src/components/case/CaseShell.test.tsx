import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { caseOpeningBySlug } from "@/data/case-openings";
import { workBySlug } from "@/data/work";
import { CaseShell } from "./CaseShell";

/**
 * Gate E shell contract (plan Task 7): artifact-led opening BEFORE the calm
 * 68ch reading column, linear previous/next navigation (null-ended), and no
 * analytics emission — CasePreviewDialog remains the sole `full_case_read`
 * owner.
 */

const trackSpy = vi.fn();
vi.mock("@/lib/analytics", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/analytics")>();
  return {
    ...original,
    analytics: {
      track: (...args: unknown[]) => trackSpy(...args),
    },
  };
});

function renderShell(slug: Parameters<typeof caseOpeningBySlug>[0]) {
  const opening = caseOpeningBySlug(slug);
  return render(
    <CaseShell
      {...opening}
      artifact={<div data-testid="artifact">artifact</div>}
    >
      <p>Long-form prose.</p>
    </CaseShell>,
  );
}

describe("CaseShell (Gate E)", () => {
  beforeEach(() => {
    trackSpy.mockClear();
  });

  afterEach(cleanup);

  it("renders the opening (with artifact) strictly before the prose body", () => {
    const { container } = renderShell("stay-portal");
    const opening = container.querySelector("[data-case-opening]");
    const body = container.querySelector("[data-case-body]");
    expect(opening).toBeTruthy();
    expect(body).toBeTruthy();
    // DOM order: opening precedes body.
    expect(
      opening!.compareDocumentPosition(body!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(opening!.contains(screen.getByTestId("artifact"))).toBe(true);
    expect(body!.textContent).toContain("Long-form prose.");
  });

  it("first case: next only, labelled with the next case title", () => {
    renderShell("stay-portal");
    const nav = screen.getByRole("navigation", { name: /case/i });
    expect(nav.textContent).toContain(workBySlug("maxie").title);
    expect(screen.queryByRole("link", { name: /previous case/i })).toBeNull();
    const next = screen.getByRole("link", { name: /next case/i });
    expect(next.getAttribute("href")).toBe("/work/maxie");
  });

  it("middle case: both neighbours, correct hrefs", () => {
    renderShell("agentic-calendar");
    expect(
      screen.getByRole("link", { name: /previous case/i }).getAttribute("href"),
    ).toBe("/work/maxie");
    expect(
      screen.getByRole("link", { name: /next case/i }).getAttribute("href"),
    ).toBe("/notes/dynamic-island");
  });

  it("last case: previous only — navigation never wraps", () => {
    renderShell("dynamic-island");
    expect(
      screen.getByRole("link", { name: /previous case/i }).getAttribute("href"),
    ).toBe("/work/agentic-calendar");
    expect(screen.queryByRole("link", { name: /next case/i })).toBeNull();
  });

  it("emits no analytics — full_case_read stays with CasePreviewDialog", () => {
    renderShell("stay-portal");
    expect(trackSpy).not.toHaveBeenCalled();
  });
});
