import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SessionJourneySection } from "./SessionJourneySection";
import {
  recordJourneyEvent,
  resetJourneyForTests,
  startJourney,
} from "./journey-store";

describe("Your session, instrumented", () => {
  afterEach(() => {
    cleanup();
    resetJourneyForTests();
    vi.useRealTimers();
  });

  it("shows the live funnel, real session facts, and explicit local-only disclosure", () => {
    vi.useFakeTimers();
    vi.setSystemTime(1_000);
    startJourney(1_000);
    render(<SessionJourneySection />);

    expect(
      screen.getByRole("heading", { name: "Your session, instrumented." }),
    ).toBeTruthy();
    expect(screen.getByText("computed in your browser. I never see it.")).toBeTruthy();
    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      expect.stringContaining("Landed"),
      expect.stringContaining("Scrolled"),
      expect.stringContaining("Played"),
      expect.stringContaining("Read work"),
      expect.stringContaining("Converted"),
    ]);

    act(() => {
      recordJourneyEvent({ type: "played", kind: "flag" });
      vi.setSystemTime(12_000);
      vi.advanceTimersByTime(1_000);
    });

    expect(screen.getByText("12s")).toBeTruthy();
    expect(screen.getByText("Played")).toBeTruthy();
    expect(screen.getByText("1 interaction")).toBeTruthy();
  });
});
