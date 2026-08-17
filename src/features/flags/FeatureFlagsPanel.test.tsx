import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { subscribeToasts, type ToastEvent } from "@/components/toast/toast";
import {
  FLAG_CANDID_KEY,
  FLAG_CONFETTI_KEY,
  THEME_STORAGE_KEY,
} from "@/data/storage";
import {
  subscribeMascotSignals,
  type MascotSignal,
} from "@/features/mascot/signals";
import {
  getJourneySnapshot,
  resetJourneyForTests,
} from "@/features/journey/journey-store";
import { FeatureFlagsPanel } from "./FeatureFlagsPanel";

function installMatchMedia({ dark = false, reducedMotion = false } = {}) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn((query: string) => ({
      matches: query.includes("prefers-color-scheme")
        ? dark
        : query.includes("prefers-reduced-motion")
          ? reducedMotion
          : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("FeatureFlagsPanel", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    resetJourneyForTests();
    delete document.documentElement.dataset.theme;
    delete document.documentElement.dataset.candid;
    delete document.documentElement.dataset.effectsDisabled;
    installMatchMedia();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the locked four-row contract with authored defaults", () => {
    const { container } = render(<FeatureFlagsPanel />);

    expect(
      container.querySelector('[data-flag-panel-variant="panel"]'),
    ).not.toBeNull();

    expect(screen.getByText("3 / 4 live")).toBeTruthy();
    expect(screen.getByText("field notes")).toBeTruthy();
    expect(screen.queryByText("CODEX LAB")).toBeNull();
    expect(
      Array.from(container.querySelectorAll("code"), (node) =>
        node.textContent?.trim(),
      ),
    ).toEqual([
      "dark_mode",
      "confetti_on_scroll",
      "candid_mode",
      "comic_sans",
    ]);
    expect(
      Array.from(container.querySelectorAll("small"), (node) =>
        node.textContent?.trim(),
      ),
    ).toEqual(["theme", "ship signal", "field notes", "prod locked"]);
    expect(screen.getAllByRole("checkbox")).toHaveLength(4);
    expect(
      (screen.getByLabelText("Toggle confetti while scrolling") as HTMLInputElement)
        .checked,
    ).toBe(true);
    expect(
      (screen.getByLabelText("Toggle candid ticket annotations") as HTMLInputElement)
        .checked,
    ).toBe(true);
    const comicSans = screen.getByLabelText(
      "Comic Sans disabled",
    ) as HTMLInputElement;
    expect(comicSans.disabled).toBe(true);
    const comicSansDescription = document.getElementById(
      comicSans.getAttribute("aria-describedby")!,
    );
    expect(comicSansDescription?.textContent).toBe(
      "disabled in prod for a reason",
    );
    expect(
      container
        .querySelector("[data-tooltip]")
        ?.getAttribute("data-tooltip"),
    ).toBe("disabled in prod for a reason");
  });

  it("exposes the presentation-only dock variant without changing controls", () => {
    const { container } = render(<FeatureFlagsPanel variant="dock" />);

    expect(
      container.querySelector('[data-flag-panel-variant="dock"]'),
    ).not.toBeNull();
    expect(screen.getAllByRole("checkbox")).toHaveLength(4);
    expect(
      (screen.getByLabelText("Comic Sans disabled") as HTMLInputElement)
        .disabled,
    ).toBe(true);
  });

  it("keeps labels and disabled explanations scoped to each rendered panel", () => {
    const { container } = render(
      <>
        <FeatureFlagsPanel />
        <FeatureFlagsPanel variant="dock" />
      </>,
    );
    const panels = Array.from(
      container.querySelectorAll<HTMLElement>("[data-flag-panel-variant]"),
    );

    expect(panels).toHaveLength(2);
    const headingIds = panels.map((panel) =>
      panel.getAttribute("aria-labelledby"),
    );
    expect(new Set(headingIds).size).toBe(2);

    for (const panel of panels) {
      const headingId = panel.getAttribute("aria-labelledby");
      expect(headingId).toBeTruthy();
      expect(panel.contains(document.getElementById(headingId!))).toBe(true);

      const comicSans = panel.querySelector<HTMLInputElement>("input:disabled");
      const descriptionId = comicSans?.getAttribute("aria-describedby");
      expect(descriptionId).toBeTruthy();
      expect(panel.contains(document.getElementById(descriptionId!))).toBe(
        true,
      );
    }
  });

  it("hydrates from the OS and versioned stores without changing row semantics", async () => {
    installMatchMedia({ dark: true });
    sessionStorage.setItem(FLAG_CONFETTI_KEY, "off");
    sessionStorage.setItem(FLAG_CANDID_KEY, "off");

    render(<FeatureFlagsPanel />);

    await waitFor(() => {
      expect(
        (screen.getByLabelText("Toggle dark mode") as HTMLInputElement).checked,
      ).toBe(true);
    });
    expect(
      (screen.getByLabelText("Toggle confetti while scrolling") as HTMLInputElement)
        .checked,
    ).toBe(false);
    expect(document.documentElement.dataset.candid).toBe("off");
  });

  it("applies and persists each user-controlled effect immediately", () => {
    const events: ToastEvent[] = [];
    const mascotSignals: MascotSignal[] = [];
    const unsubscribe = subscribeToasts((event) => events.push(event));
    const unsubscribeMascot = subscribeMascotSignals((signal) =>
      mascotSignals.push(signal),
    );
    render(<FeatureFlagsPanel />);

    fireEvent.click(screen.getByLabelText("Toggle dark mode"));
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");

    fireEvent.click(screen.getByLabelText("Toggle confetti while scrolling"));
    expect(sessionStorage.getItem(FLAG_CONFETTI_KEY)).toBe("off");

    fireEvent.click(screen.getByLabelText("Toggle candid ticket annotations"));
    expect(sessionStorage.getItem(FLAG_CANDID_KEY)).toBe("off");
    expect(document.documentElement.dataset.candid).toBe("off");

    expect(events.map((event) => event.message)).toEqual([
      "dark_mode enabled",
      "scroll confetti paused",
      "field notes hidden",
    ]);
    expect(events.every((event) => event.announce === false)).toBe(true);
    expect(
      mascotSignals.map(({ reaction, source }) => ({ reaction, source })),
    ).toEqual([
      { reaction: "milestone", source: "journey:played" },
      { reaction: "flag-check", source: "dark_mode" },
      { reaction: "flag-check", source: "confetti_on_scroll" },
      { reaction: "flag-check", source: "candid_mode" },
    ]);
    expect(
      getJourneySnapshot().events
        .filter((event) => event.type === "played")
        .map((event) => event.kind),
    ).toEqual(["dark_mode", "flag", "flag"]);
    unsubscribe();
    unsubscribeMascot();
  });
});
