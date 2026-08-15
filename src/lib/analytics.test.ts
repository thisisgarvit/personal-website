import { afterEach, describe, expect, it, vi } from "vitest";
import { analytics, type PublicAnalyticsEvent } from "./analytics";

/**
 * PRD §12: the v1 adapter is a no-op. Tracking any of the four defined
 * public events must never produce a network call (fetch, XHR, or
 * sendBeacon) or touch storage.
 */

const ALL_EVENTS: readonly PublicAnalyticsEvent[] = [
  "resume_download",
  "contact_click",
  "case_open",
  "full_case_read",
];

describe("analytics adapter (PRD §12 no-op contract)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("never fires network calls for any public event", () => {
    const fetchSpy = vi.fn();
    const xhrOpenSpy = vi.fn();
    const xhrSendSpy = vi.fn();
    const beaconSpy = vi.fn();

    vi.stubGlobal("fetch", fetchSpy);
    vi.spyOn(XMLHttpRequest.prototype, "open").mockImplementation(xhrOpenSpy);
    vi.spyOn(XMLHttpRequest.prototype, "send").mockImplementation(xhrSendSpy);
    // jsdom has no sendBeacon; install a spy so any use would be caught.
    Object.defineProperty(navigator, "sendBeacon", {
      value: beaconSpy,
      configurable: true,
      writable: true,
    });

    for (const event of ALL_EVENTS) {
      analytics.track(event);
    }

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(xhrOpenSpy).not.toHaveBeenCalled();
    expect(xhrSendSpy).not.toHaveBeenCalled();
    expect(beaconSpy).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it("never writes to local or session storage", () => {
    const localSet = vi.spyOn(Storage.prototype, "setItem");

    for (const event of ALL_EVENTS) {
      analytics.track(event);
    }

    expect(localSet).not.toHaveBeenCalled();
  });

  it("returns undefined (no chaining, no queueing surface)", () => {
    expect(analytics.track("case_open")).toBeUndefined();
  });
});
