import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { workItems } from "@/data/work";
import { WorldPrototype } from "./WorldPrototype";

describe("WorldPrototype", () => {
  let reducedMotion = false;

  beforeEach(() => {
    reducedMotion = false;
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn((query: string) => ({
        matches: query.includes("prefers-reduced-motion")
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
  });

  afterEach(() => cleanup());

  it("locks the world stage, semantic anchors, and real portfolio controls", () => {
    const { container } = render(<WorldPrototype />);
    const prototype = container.querySelector("[data-world-prototype]");

    expect(prototype).not.toBeNull();
    expect(prototype?.querySelector("[data-world-copy]")).not.toBeNull();
    expect(
      prototype?.querySelectorAll("[data-experience-world]"),
    ).toHaveLength(1);
    expect(prototype?.querySelector("[data-world-dock]")).not.toBeNull();
    expect(prototype?.querySelector("[data-board-entry]")).not.toBeNull();

    const world = prototype?.querySelector(
      "[data-experience-world]",
    ) as HTMLElement;
    expect(world.getAttribute("aria-hidden")).toBe("true");
    expect(world.dataset.sceneReady).toBe("false");
    expect(world.dataset.worldFallback).toBe("none");
    expect(world.querySelector("[data-world-poster]")).not.toBeNull();

    const anchors = Array.from(
      prototype?.querySelectorAll<HTMLElement>("[data-world-anchor]") ?? [],
      (anchor) => anchor.dataset.worldAnchor,
    );
    expect(anchors).toEqual(["hero", "board", "journey"]);

    const main = screen.getByRole("main");
    expect(main.querySelectorAll("section section")).toHaveLength(0);

    const board = prototype?.querySelector("[data-board-entry]");
    const dock = prototype?.querySelector("[data-world-dock]");
    expect(
      Boolean(
        board &&
          dock &&
          board.compareDocumentPosition(dock) & Node.DOCUMENT_POSITION_FOLLOWING,
      ),
    ).toBe(true);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(container.querySelectorAll("a[data-primary-cta]")).toHaveLength(2);

    const boardEntry = container.querySelector("[data-board-entry]");
    expect(boardEntry).not.toBeNull();
    const workLink = screen.getByRole("link", {
      name: new RegExp(workItems[0].title, "i"),
    });
    expect(workLink.getAttribute("href")).toBe(workItems[0].route);

    const poster = world.querySelector('img[alt=""]');
    expect(poster?.getAttribute("src")).toContain(
      "/images/world/guide-light.webp",
    );

    const boardControls = screen.getByLabelText("Board scene test controls");
    const journeyControls = screen.getByLabelText(
      "Journey scene test controls",
    );
    expect(boardControls.querySelectorAll("button")).toHaveLength(4);
    expect(journeyControls.querySelectorAll("button")).toHaveLength(2);

    for (const name of [
      "Start ticket drag",
      "End ticket drag",
      "Trigger incident",
      "Resolve incident",
      "Reach journey milestone",
      "Ship ticket",
    ]) {
      fireEvent.click(screen.getByRole("button", { name }));
    }
    expect(container.querySelectorAll("[data-experience-world]")).toHaveLength(
      1,
    );
  });

  it("keeps the matching poster for fallback and the canvas input-transparent", async () => {
    reducedMotion = true;
    const { container } = render(<WorldPrototype />);
    const world = container.querySelector(
      "[data-experience-world]",
    ) as HTMLElement;

    await waitFor(() =>
      expect(world.dataset.worldFallback).toBe("reduced-motion"),
    );
    expect(world.dataset.sceneReady).toBe("false");
    expect(world.querySelector("[data-world-poster]")).not.toBeNull();
    expect(world.querySelector("canvas")).toBeNull();

    const canvasSource = readFileSync(
      resolve(process.cwd(), "src/features/world/WorldCanvas.tsx"),
      "utf8",
    );
    const worldCss = readFileSync(
      resolve(process.cwd(), "src/features/world/world.module.css"),
      "utf8",
    );

    expect(canvasSource).toMatch(
      /<Canvas[\s\S]*?data-world-canvas[\s\S]*?aria-hidden="true"/,
    );
    expect(worldCss).toMatch(/\.stage\s*\{[\s\S]*?pointer-events:\s*none/);
    expect(worldCss).toMatch(
      /\.poster,\s*\n\.canvasLayer\s*\{[\s\S]*?pointer-events:\s*none/,
    );
  });

  it("keeps every persona choice inside the narrow-screen tray", () => {
    const css = readFileSync(
      resolve(process.cwd(), "src/app/dev/world/world-prototype.module.css"),
      "utf8",
    );

    expect(css).toMatch(
      /@media \(max-width: 619\.98px\)[\s\S]*?\.personaChoices\s*\{[\s\S]*?grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/,
    );
    expect(css).toMatch(
      /@media \(max-width: 619\.98px\)[\s\S]*?\.personaSatire\s*\{[\s\S]*?right:\s*var\(--space-3\)[\s\S]*?width:\s*auto/,
    );
    expect(css).toMatch(/\.personaChoices button\s*\{[\s\S]*?min-width:\s*0/);
    expect(css).toMatch(
      /@media \(max-width: 619\.98px\)[\s\S]*?\.personaChoices button\s*\{[\s\S]*?min-height:\s*44px/,
    );
    expect(css).not.toMatch(
      /@media \(max-width: 619\.98px\)[\s\S]*?\.intro\s*\{[\s\S]*?font-size:\s*0\.9rem/,
    );
  });

  it("keeps the narrow experiment treatment scoped to the dev prototype", () => {
    const { container } = render(<WorldPrototype />);
    const css = readFileSync(
      resolve(process.cwd(), "src/app/dev/world/world-prototype.module.css"),
      "utf8",
    );

    expect(container.querySelector("[data-world-experiment]")).not.toBeNull();
    expect(css).toMatch(
      /\.experimentFrame[\s\S]*?\[aria-label="Experiment status"\][\s\S]*?span:last-child/,
    );
  });

  it("locks the optional persona satire and final-GA evolution contract", () => {
    const { container } = render(<WorldPrototype />);
    const evolution = container.querySelector("[data-hero-evolution]");
    const persona = container.querySelector("[data-persona-satire]");

    expect(evolution?.getAttribute("data-hero-phase")).toBe("ga");
    expect(persona).not.toBeNull();
    expect(persona?.classList.contains("ph-no-capture")).toBe(true);

    for (const label of [
      "Founder",
      "Recruiter",
      "Product lead",
      "Just browsing",
    ]) {
      expect(screen.getByRole("button", { name: label })).toBeTruthy();
    }

    expect(screen.getByRole("button", { name: "Skip" })).toBeTruthy();
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.getByText("Your answer goes to PostHog.")).toBeTruthy();

    const payoff = container.querySelector("[data-persona-payoff]");
    expect(payoff?.textContent).toContain(
      "Noted. This changes nothing. It never does.",
    );
    expect((payoff as HTMLElement | null)?.hidden).toBe(true);
  });
});
