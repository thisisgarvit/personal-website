import { act, cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EFFECTS_POLICY_EVENT } from "@/features/flags/effects-policy";

const sceneBoundary = vi.hoisted(() => ({
  props: null as null | {
    onFirstFrame(): void;
    playing: boolean;
  },
}));

vi.mock("./ProceduralMascotScene", () => ({
  ProceduralMascotScene: function SceneBoundary(props: {
      onFirstFrame(): void;
      playing: boolean;
    }) {
      sceneBoundary.props = props;
      return null;
    },
}));

import { MascotExperience } from "./MascotExperience";

let reducedMotion = false;

function installBrowserCapabilities() {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn((query: string) => ({
      matches: query.includes("prefers-reduced-motion")
        ? reducedMotion
        : query.includes("pointer: fine"),
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
      saveData: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
  });
  Object.defineProperty(window, "requestAnimationFrame", {
    configurable: true,
    value: (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    },
  });
  Object.defineProperty(window, "cancelAnimationFrame", {
    configurable: true,
    value: vi.fn(),
  });
  Object.defineProperty(window, "requestIdleCallback", {
    configurable: true,
    value: (callback: () => void) => {
      callback();
      return 1;
    },
  });
  Object.defineProperty(window, "cancelIdleCallback", {
    configurable: true,
    value: vi.fn(),
  });
  class VisibleObserver {
    constructor(
      private callback: IntersectionObserverCallback,
    ) {}
    observe(element: Element) {
      this.callback(
        [{ isIntersecting: true, target: element } as IntersectionObserverEntry],
        this as unknown as IntersectionObserver,
      );
    }
    disconnect() {}
    unobserve() {}
    takeRecords() {
      return [];
    }
    root = null;
    rootMargin = "0px";
    thresholds = [0];
  }
  Object.defineProperty(window, "IntersectionObserver", {
    configurable: true,
    value: VisibleObserver,
  });
}

describe("MascotExperience poster handoff", () => {
  beforeEach(() => {
    reducedMotion = false;
    sceneBoundary.props = null;
    delete document.documentElement.dataset.effectsDisabled;
    installBrowserCapabilities();
  });

  afterEach(() => cleanup());

  it("keeps the poster visible until the lazy renderer commits its first frame", async () => {
    const { container } = render(<MascotExperience />);
    const runtime = container.firstElementChild as HTMLElement;

    expect(runtime.querySelector("[data-mascot-poster]")).not.toBeNull();
    expect(runtime.dataset.sceneReady).toBe("false");

    await waitFor(() => expect(sceneBoundary.props).not.toBeNull());
    act(() => sceneBoundary.props!.onFirstFrame());
    expect(runtime.dataset.sceneReady).toBe("true");
  });

  it("returns to the poster across a runtime kill and requires the remounted renderer to recommit", async () => {
    const { container } = render(<MascotExperience />);
    const runtime = container.firstElementChild as HTMLElement;
    await waitFor(() => expect(sceneBoundary.props).not.toBeNull());
    act(() => sceneBoundary.props!.onFirstFrame());
    expect(runtime.dataset.sceneReady).toBe("true");

    act(() => {
      document.documentElement.dataset.effectsDisabled = "true";
      window.dispatchEvent(new Event(EFFECTS_POLICY_EVENT));
    });
    await waitFor(() =>
      expect(runtime.dataset.mascotFallback).toBe("performance-kill"),
    );
    expect(runtime.dataset.sceneReady).toBe("false");

    sceneBoundary.props = null;
    act(() => {
      delete document.documentElement.dataset.effectsDisabled;
      window.dispatchEvent(new Event(EFFECTS_POLICY_EVENT));
    });
    await waitFor(() => expect(sceneBoundary.props).not.toBeNull());
    expect(runtime.dataset.sceneReady).toBe("false");
    act(() => sceneBoundary.props!.onFirstFrame());
    expect(runtime.dataset.sceneReady).toBe("true");
  });

  it("never requests WebGL under reduced motion", async () => {
    reducedMotion = true;
    const { container } = render(<MascotExperience />);
    const runtime = container.firstElementChild as HTMLElement;

    await waitFor(() =>
      expect(runtime.dataset.mascotFallback).toBe("reduced-motion"),
    );
    expect(sceneBoundary.props).toBeNull();
    expect(runtime.querySelector("[data-mascot-poster]")).not.toBeNull();
  });
});
