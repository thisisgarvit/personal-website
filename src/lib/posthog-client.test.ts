import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { capture, init } = vi.hoisted(() => ({
  capture: vi.fn(),
  init: vi.fn(),
}));

vi.mock("posthog-js", () => ({ default: { capture, init } }));

describe("lazy PostHog client", () => {
  beforeEach(() => {
    vi.resetModules();
    capture.mockReset();
    init.mockReset();
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
});
