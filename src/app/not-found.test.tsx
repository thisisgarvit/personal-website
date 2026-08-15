import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotFound from "./not-found";

describe("blameless 404 postmortem", () => {
  it("reports the SEV-3 with impact, candid root cause, and two recovery paths", () => {
    render(<NotFound />);

    expect(screen.getByText(/INC-0042 · SEV-3/)).toBeTruthy();
    expect(screen.getByText("Impact")).toBeTruthy();
    expect(
      screen.getByText("PM overestimated his own information architecture."),
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: "Go home" }).getAttribute("href")).toBe("/");
    expect(screen.getByRole("link", { name: "Open the board" }).getAttribute("href")).toBe(
      "/#work-board",
    );
  });
});
