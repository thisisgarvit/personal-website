import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { capture, init, chunkLoad } = vi.hoisted(() => ({
  capture: vi.fn(),
  init: vi.fn(),
  // Simulates a navigation aborting the lazy chunk fetch: while
  // failuresRemaining > 0 loading the posthog-js module rejects.
  chunkLoad: { failuresRemaining: 0 },
}));

// The failure lives in a getter (not a throwing factory) because the mocked
// module namespace is cached across vi.resetModules(); the getter re-runs on
// every lazy load, so each import can fail or succeed independently.
vi.mock("posthog-js", () => ({
  get default() {
    if (chunkLoad.failuresRemaining > 0) {
      chunkLoad.failuresRemaining -= 1;
      throw new Error("Loading chunk 340 failed.");
    }
    return { capture, init };
  },
}));

describe("lazy PostHog client", () => {
  beforeEach(() => {
    vi.resetModules();
    capture.mockReset();
    init.mockReset();
    chunkLoad.failuresRemaining = 0;
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "phc_test");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "https://eu.i.posthog.com");
  });

  afterEach(() => vi.unstubAllEnvs());

  it("defers initialization until the browser is idle", async () => {
    const idleCallbacks: IdleRequestCallback[] = [];
    Object.defineProperty(window, "requestIdleCallback", {
      configurable: true,
      value: vi.fn((callback: IdleRequestCallback) => {
        idleCallbacks.push(callback);
        return 1;
      }),
    });
    const { initializePostHog } = await import("./posthog-client");

    initializePostHog();
    expect(init).not.toHaveBeenCalled();
    expect(idleCallbacks).toHaveLength(1);
    idleCallbacks[0]({
      didTimeout: false,
      timeRemaining: () => 50,
    });

    await vi.waitFor(() => expect(init).toHaveBeenCalledOnce());
    expect(init).toHaveBeenCalledWith("phc_test", {
      api_host: "https://eu.i.posthog.com",
      defaults: "2026-01-30",
      capture_exceptions: true,
      debug: false,
    });
  });

  it("shares one initializer and preserves an event fired before idle", async () => {
    const { capturePostHog, initializePostHog } = await import(
      "./posthog-client"
    );

    initializePostHog();
    capturePostHog("persona_selected", { persona: "founder" });

    await vi.waitFor(() => expect(capture).toHaveBeenCalledOnce());
    expect(init).toHaveBeenCalledOnce();
    expect(capture).toHaveBeenCalledWith("persona_selected", {
      persona: "founder",
    });
  });

  it("treats an aborted lazy chunk load as non-fatal on both paths", async () => {
    // Both the idle initializer and a capture race the same aborted chunk.
    chunkLoad.failuresRemaining = 2;
    // Idle callback that actually runs, so the initialize path exercises
    // the rejected import too (jsdom has no native requestIdleCallback).
    Object.defineProperty(window, "requestIdleCallback", {
      configurable: true,
      value: (callback: IdleRequestCallback) =>
        window.setTimeout(
          () => callback({ didTimeout: true, timeRemaining: () => 0 }),
          0,
        ),
    });
    const unhandled: unknown[] = [];
    const onUnhandledRejection = (reason: unknown) => {
      unhandled.push(reason);
    };
    process.on("unhandledRejection", onUnhandledRejection);
    try {
      const { capturePostHog, initializePostHog } = await import(
        "./posthog-client"
      );

      initializePostHog();
      capturePostHog("case_open", { case_slug: "stay-portal" });

      // Let the scheduled load, the rejections, and Node's
      // unhandled-rejection detection all settle.
      for (let tick = 0; tick < 5; tick += 1) {
        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      expect(unhandled).toEqual([]);
      expect(init).not.toHaveBeenCalled();
      expect(capture).not.toHaveBeenCalled();
    } finally {
      process.off("unhandledRejection", onUnhandledRejection);
    }
  });

  it("retries the lazy import after a failed chunk load", async () => {
    chunkLoad.failuresRemaining = 1;
    const { capturePostHog } = await import("./posthog-client");

    capturePostHog("case_open", { case_slug: "stay-portal" });
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(init).not.toHaveBeenCalled();
    expect(capture).not.toHaveBeenCalled();

    capturePostHog("resume_download", { surface: "hero" });

    await vi.waitFor(() => expect(capture).toHaveBeenCalledOnce());
    expect(init).toHaveBeenCalledOnce();
    expect(capture).toHaveBeenCalledWith("resume_download", {
      surface: "hero",
    });
  });
});
