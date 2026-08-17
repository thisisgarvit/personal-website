import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import HomePage from "./page";

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

describe("homepage immersive-world composition contract", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    installMatchMedia();
  });

  afterEach(() => cleanup());

  it("renders one main and one h1 with hero, board, then journey anchors", () => {
    const { container } = render(<HomePage />);

    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      Array.from(
        container.querySelectorAll<HTMLElement>("[data-world-anchor]"),
        (anchor) => anchor.dataset.worldAnchor,
      ),
    ).toEqual(["hero", "board", "journey"]);
  });

  it("keeps exactly two primary hero actions and replaces the operations rail with one labelled flag dock", () => {
    const { container } = render(<HomePage />);

    expect(container.querySelectorAll("a[data-primary-cta]")).toHaveLength(2);
    expect(
      screen.queryByRole("complementary", { name: "Product controls" }),
    ).toBeNull();
    expect(
      screen.getAllByRole("complementary", { name: "Feature flag dock" }),
    ).toHaveLength(1);
    expect(container.querySelectorAll("[data-world-dock]")).toHaveLength(1);
  });

  it("keeps one navigation-free ExperienceWorld as a sibling of main", () => {
    const { container } = render(<HomePage />);
    const main = screen.getByRole("main");
    const worlds = container.querySelectorAll<HTMLElement>(
      "[data-experience-world]",
    );

    expect(worlds).toHaveLength(1);
    const world = worlds[0];
    expect(world.parentElement).toBe(main.parentElement);
    expect(world.contains(main)).toBe(false);
    expect(main.contains(world)).toBe(false);
    expect(
      world.querySelector("main, nav, a, button, input, select, textarea"),
    ).toBeNull();
  });

  it("uses non-section world anchors so the migration adds no nested section landmark", () => {
    const { container } = render(<HomePage />);
    const anchors = Array.from(
      container.querySelectorAll<HTMLElement>("[data-world-anchor]"),
    );

    expect(anchors).toHaveLength(3);
    expect(anchors.every((anchor) => anchor.tagName === "DIV")).toBe(true);
    expect(
      container.querySelector("section[data-world-anchor] > section"),
    ).toBeNull();
  });
});
