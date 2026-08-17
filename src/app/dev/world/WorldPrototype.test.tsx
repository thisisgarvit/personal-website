import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { workItems } from "@/data/work";
import { WorldPrototype } from "./WorldPrototype";

describe("WorldPrototype", () => {
  beforeEach(() => {
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
  });

  afterEach(() => cleanup());

  it("locks the static Scene 1 composition contract", () => {
    const { container } = render(<WorldPrototype />);
    const prototype = container.querySelector("[data-world-prototype]");

    expect(prototype).not.toBeNull();
    expect(prototype?.querySelector("[data-world-copy]")).not.toBeNull();
    expect(prototype?.querySelector("[data-world-guide]")).not.toBeNull();
    expect(prototype?.querySelector("[data-world-dock]")).not.toBeNull();
    expect(prototype?.querySelector("[data-board-entry]")).not.toBeNull();

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

    const poster = container.querySelector(
      '[data-world-guide] img[alt=""][aria-hidden="true"]',
    );
    expect(poster?.getAttribute("src")).toContain(
      "/images/world/prototype-guide.webp",
    );

    expect(container.querySelector("canvas")).toBeNull();
  });

  it("keeps the isolated static prototype free of Three and dynamic imports", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/app/dev/world/WorldPrototype.tsx"),
      "utf8",
    );

    expect(source).not.toMatch(/@react-three\/fiber|three|next\/dynamic/);
    expect(source).not.toContain("<Canvas");
    expect(source).toContain("siteConfig.hero");
  });

  it("keeps every persona choice inside the narrow-screen tray", () => {
    const css = readFileSync(
      resolve(process.cwd(), "src/app/dev/world/world-prototype.module.css"),
      "utf8",
    );

    expect(css).toMatch(
      /@media \(max-width: 619\.98px\)[\s\S]*?\.personaChoices\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/,
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
