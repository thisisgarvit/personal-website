import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { caseOpeningBySlug } from "@/data/case-openings";
import { CaseOpening } from "./CaseOpening";

describe("CaseOpening (Gate E artifact-led opening)", () => {
  afterEach(cleanup);

  const opening = caseOpeningBySlug("stay-portal");

  function renderOpening() {
    return render(
      <CaseOpening
        {...opening}
        artifact={<div data-testid="artifact">day view</div>}
      />,
    );
  }

  it("leads with back-to-board, kind label, ticket id, title, and value", () => {
    renderOpening();
    expect(
      screen
        .getByRole("link", { name: /back to board/i })
        .getAttribute("href"),
    ).toBe("/#work-board");
    expect(screen.getByText(/Shipped product · GAR-101/)).toBeTruthy();
    expect(
      screen.getByRole("heading", { level: 1, name: "Stay Portal" }),
    ).toBeTruthy();
    expect(
      screen.getByText(
        "Five apartments, flexible bookings, and no more spreadsheet collisions.",
      ),
    ).toBeTruthy();
  });

  it("shows exactly the three workItems facts with their values", () => {
    renderOpening();
    for (const fact of opening.facts) {
      expect(screen.getByText(fact.value)).toBeTruthy();
      expect(screen.getByText(fact.label)).toBeTruthy();
    }
    expect(opening.facts).toHaveLength(3);
  });

  it("renders the single opening artifact inside the opening surface", () => {
    const { container } = renderOpening();
    const surface = container.querySelector("[data-case-opening]");
    expect(surface).toBeTruthy();
    expect(screen.getByTestId("artifact")).toBeTruthy();
    expect(surface?.contains(screen.getByTestId("artifact"))).toBe(true);
  });
});
