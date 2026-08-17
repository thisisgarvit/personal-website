import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HeroEvolution } from "./HeroEvolution";

function motionPreference(reduced: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn(() => ({
      matches: reduced,
      media: "(prefers-reduced-motion: reduce)",
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("HeroEvolution", () => {
  it("keeps the real headline immediate while moving MVP to beta to GA", () => {
    vi.useFakeTimers();
    motionPreference(false);
    const { container } = render(
      <HeroEvolution lead="I turn fuzzy product ideas" tail="things people can use" />,
    );

    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
      "I turn fuzzy product ideas into things people can use",
    );
    const evolution = container.querySelector("[data-hero-evolution]")!;
    act(() => vi.advanceTimersByTime(0));
    expect(evolution.getAttribute("data-hero-phase")).toBe("mvp");

    act(() => vi.advanceTimersByTime(760));
    expect(evolution.getAttribute("data-hero-phase")).toBe("beta");
    act(() => vi.advanceTimersByTime(800));
    expect(evolution.getAttribute("data-hero-phase")).toBe("ga");

    fireEvent.click(screen.getByRole("button", { name: "Replay idea to release" }));
    act(() => vi.advanceTimersByTime(0));
    expect(evolution.getAttribute("data-hero-phase")).toBe("mvp");
  });

  it("materializes the final GA treatment under reduced motion", () => {
    vi.useFakeTimers();
    motionPreference(true);
    const { container } = render(
      <HeroEvolution lead="Fuzzy" tail="usable" />,
    );
    expect(
      container
        .querySelector("[data-hero-evolution]")
        ?.getAttribute("data-hero-phase"),
    ).toBe("ga");
  });
});
