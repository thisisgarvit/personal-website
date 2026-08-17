import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { THEME_STORAGE_KEY } from "@/data/storage";
import {
  getJourneySnapshot,
  resetJourneyForTests,
} from "@/features/journey/journey-store";
import { FeatureFlagDock } from "./FeatureFlagDock";

function installMatchMedia() {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn((query: string) => ({
      matches: false,
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

describe("FeatureFlagDock", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    resetJourneyForTests();
    delete document.documentElement.dataset.theme;
    installMatchMedia();
  });

  afterEach(() => cleanup());

  it("preserves the dock landmark and renders the dock panel variant", () => {
    const { container } = render(<FeatureFlagDock className="world-dock" />);

    const dock = screen.getByRole("complementary", {
      name: "Feature flag dock",
    });
    expect(dock.classList.contains("world-dock")).toBe(true);
    expect(dock.hasAttribute("data-world-dock")).toBe(true);
    expect(
      container.querySelector('[data-flag-panel-variant="dock"]'),
    ).not.toBeNull();
    expect(screen.getAllByRole("checkbox")).toHaveLength(4);
  });

  it("keeps the dock wired to the live flag and journey behavior", () => {
    render(<FeatureFlagDock />);

    fireEvent.click(screen.getByLabelText("Toggle dark mode"));

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(
      getJourneySnapshot().events.some(
        (event) => event.type === "played" && event.kind === "dark_mode",
      ),
    ).toBe(true);
  });
});
