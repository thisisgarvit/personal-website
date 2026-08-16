import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  allowedAnalyticsEvents,
  analytics,
  isAllowedAnalyticsEvent,
} from "./analytics";
import {
  recordJourneyEvent,
  resetJourneyForTests,
  startJourney,
} from "@/features/journey/journey-store";

const { capture } = vi.hoisted(() => ({ capture: vi.fn() }));

vi.mock("posthog-js", () => ({
  default: { capture },
}));

/**
 * Conditional PostHog contract: without public configuration the adapter is
 * a no-op; with configuration it may capture only the four custom events
 * below. PostHog pageviews/autocapture belong to the provider, not this
 * custom-event adapter. The visible journey remains session-local.
 */
describe("analytics custom-event boundary", () => {
  beforeEach(() => {
    capture.mockClear();
    resetJourneyForTests();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("exposes exactly the four approved custom events", () => {
    expect(allowedAnalyticsEvents).toEqual([
      "resume_download",
      "contact_click",
      "case_open",
      "full_case_read",
    ]);

    for (const event of allowedAnalyticsEvents) {
      expect(isAllowedAnalyticsEvent(event)).toBe(true);
    }

    for (const localOnly of [
      "world_scene",
      "guide_reaction",
      "journey_stage",
      "board_position",
    ]) {
      expect(isAllowedAnalyticsEvent(localOnly)).toBe(false);
    }
  });

  it("does not capture custom events without public PostHog configuration", () => {
    analytics.track("resume_download");
    expect(capture).not.toHaveBeenCalled();
  });

  it("captures an approved custom event when PostHog is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "phc_test");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "https://eu.i.posthog.com");

    analytics.track("case_open", { case_slug: "stay-portal" });

    expect(capture).toHaveBeenCalledOnce();
    expect(capture).toHaveBeenCalledWith("case_open", {
      case_slug: "stay-portal",
    });
  });

  it("keeps session journey events out of the custom PostHog adapter", () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "phc_test");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "https://eu.i.posthog.com");

    startJourney(100);
    recordJourneyEvent({ type: "scrolled" });
    recordJourneyEvent({ type: "played", kind: "drag" });
    recordJourneyEvent({ type: "read-work", slug: "stay-portal" });
    recordJourneyEvent({ type: "converted", target: "contact" });

    expect(capture).not.toHaveBeenCalled();
  });
});
