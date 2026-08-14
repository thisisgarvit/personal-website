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
    delete document.documentElement.dataset.theme;
    delete document.documentElement.dataset.candid;
    delete document.documentElement.dataset.effectsDisabled;
    installMatchMedia();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the locked four-row contract with authored defaults", () => {
    render(<FeatureFlagsPanel />);

    expect(screen.getByText("3 / 4 live")).toBeTruthy();
    expect(screen.getByText("field notes")).toBeTruthy();
    expect(screen.queryByText("CODEX LAB")).toBeNull();
    expect(screen.getAllByRole("checkbox")).toHaveLength(4);
    expect(
      (screen.getByLabelText("Toggle confetti while scrolling") as HTMLInputElement)
        .checked,
    ).toBe(true);
    expect(
      (screen.getByLabelText("Toggle candid ticket annotations") as HTMLInputElement)
        .checked,
    ).toBe(true);
    expect(
      (screen.getByLabelText("Comic Sans disabled") as HTMLInputElement).disabled,
    ).toBe(true);
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
      { reaction: "flag-check", source: "dark_mode" },
      { reaction: "flag-check", source: "confetti_on_scroll" },
      { reaction: "flag-check", source: "candid_mode" },
    ]);
    unsubscribe();
    unsubscribeMascot();
  });
});
