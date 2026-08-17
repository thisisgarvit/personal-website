import { act, cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EFFECTS_POLICY_EVENT } from "@/features/flags/effects-policy";

const canvasBoundary = vi.hoisted(() => ({
  mounts: 0,
  props: null as null | {
    playing: boolean;
    onFirstFrame(): void;
    onRendererFailure(): void;
  },
}));

vi.mock("./WorldCanvas", () => ({
  WorldCanvas(props: NonNullable<typeof canvasBoundary.props>) {
    canvasBoundary.mounts += 1;
    canvasBoundary.props = props;
    return <canvas data-world-canvas />;
  },
}));

import { ExperienceWorld } from "./ExperienceWorld";
import { WorldAnchor } from "./WorldAnchor";
import { WorldProvider } from "./WorldProvider";

let reducedMotion = false;
let documentHidden = false;
let saveData = false;

function installCapabilities() {
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
  Object.defineProperty(navigator, "deviceMemory", {
    configurable: true,
    value: 8,
  });
  Object.defineProperty(navigator, "connection", {
    configurable: true,
    value: {
      saveData,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
  });
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    get: () => (documentHidden ? "hidden" : "visible"),
  });
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    top: 100,
    bottom: 700,
    height: 600,
  } as DOMRect);
  Object.defineProperty(window, "requestAnimationFrame", {
    configurable: true,
    value: vi.fn((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    }),
  });
  Object.defineProperty(window, "cancelAnimationFrame", {
    configurable: true,
    value: vi.fn(),
  });
  Object.defineProperty(window, "requestIdleCallback", {
    configurable: true,
    value: vi.fn((callback: IdleRequestCallback) => {
      callback({ didTimeout: false, timeRemaining: () => 50 });
      return 1;
    }),
  });
  Object.defineProperty(window, "cancelIdleCallback", {
    configurable: true,
    value: vi.fn(),
  });
}

function renderWorld() {
  return render(
    <WorldProvider>
      <ExperienceWorld />
      <WorldAnchor id="hero" as="div" />
    </WorldProvider>,
  );
}

describe("ExperienceWorld lifecycle", () => {
  beforeEach(() => {
    reducedMotion = false;
    documentHidden = false;
    saveData = false;
    canvasBoundary.mounts = 0;
    canvasBoundary.props = null;
    delete document.documentElement.dataset.effectsDisabled;
    delete document.documentElement.dataset.theme;
    installCapabilities();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("keeps the matching poster until one pointer-transparent canvas commits", async () => {
    const { container } = renderWorld();
    const stage = container.querySelector("[data-experience-world]") as HTMLElement;

    expect(stage.querySelector("[data-world-poster]")).not.toBeNull();
    expect(stage.dataset.sceneReady).toBe("false");
    expect(stage.getAttribute("aria-hidden")).toBe("true");

    await waitFor(() => expect(canvasBoundary.props).not.toBeNull());
    expect(container.querySelectorAll("[data-world-canvas]")).toHaveLength(1);
    expect(canvasBoundary.mounts).toBe(1);
    act(() => canvasBoundary.props!.onFirstFrame());
    expect(stage.dataset.sceneReady).toBe("true");
  });

  it("never imports the canvas under reduced motion, Save-Data, or a performance kill", async () => {
    reducedMotion = true;
    const reduced = renderWorld();
    await waitFor(() =>
      expect(
        reduced.container.querySelector("[data-experience-world]")?.getAttribute(
          "data-world-fallback",
        ),
      ).toBe("reduced-motion"),
    );
    expect(canvasBoundary.props).toBeNull();
    reduced.unmount();

    reducedMotion = false;
    saveData = true;
    canvasBoundary.props = null;
    installCapabilities();
    const dataSaver = renderWorld();
    await waitFor(() =>
      expect(
        dataSaver.container
          .querySelector("[data-experience-world]")
          ?.getAttribute("data-world-fallback"),
      ).toBe("save-data"),
    );
    expect(canvasBoundary.props).toBeNull();
    dataSaver.unmount();

    saveData = false;
    canvasBoundary.props = null;
    installCapabilities();
    document.documentElement.dataset.effectsDisabled = "true";
    const killed = renderWorld();
    await waitFor(() =>
      expect(
        killed.container.querySelector("[data-experience-world]")?.getAttribute(
          "data-world-fallback",
        ),
      ).toBe("performance-kill"),
    );
    expect(canvasBoundary.props).toBeNull();
  });

  it("restores the poster after renderer failure without removing the stage", async () => {
    const { container } = renderWorld();
    const stage = container.querySelector("[data-experience-world]") as HTMLElement;
    await waitFor(() => expect(canvasBoundary.props).not.toBeNull());
    act(() => canvasBoundary.props!.onFirstFrame());
    expect(stage.dataset.sceneReady).toBe("true");

    act(() => canvasBoundary.props!.onRendererFailure());
    await waitFor(() => expect(stage.dataset.worldFallback).toBe("renderer-failure"));
    expect(stage.dataset.sceneReady).toBe("false");
    expect(stage.querySelector("[data-world-poster]")).not.toBeNull();
  });

  it("pauses the mounted scene when the document becomes hidden", async () => {
    renderWorld();
    await waitFor(() => expect(canvasBoundary.props).not.toBeNull());
    expect(canvasBoundary.props!.playing).toBe(true);

    documentHidden = true;
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(canvasBoundary.props!.playing).toBe(false);
  });

  it("reacts to the existing effects policy event without emitting analytics", async () => {
    const { container } = renderWorld();
    await waitFor(() => expect(canvasBoundary.props).not.toBeNull());

    act(() => {
      document.documentElement.dataset.effectsDisabled = "true";
      window.dispatchEvent(new Event(EFFECTS_POLICY_EVENT));
    });
    await waitFor(() =>
      expect(
        container.querySelector("[data-experience-world]")?.getAttribute(
          "data-world-fallback",
        ),
      ).toBe("performance-kill"),
    );
  });

  it("keeps the world implementation outside the analytics boundary", () => {
    const files = ["ExperienceWorld.tsx", "WorldCanvas.tsx", "GuideScene.tsx"];
    for (const file of files) {
      const source = readFileSync(
        resolve(process.cwd(), "src/features/world", file),
        "utf8",
      );
      expect(source).not.toMatch(/posthog|capture\s*\(/i);
    }
  });
});
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
