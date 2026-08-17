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

vi.mock("./posthog-client", () => ({
  capturePostHog: capture,
}));

/**
 * Conditional PostHog contract: without public configuration the adapter is
 * a no-op; with configuration it may capture only the five custom events
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

  it("exposes exactly the five approved custom events", () => {
    expect(allowedAnalyticsEvents).toEqual([
      "resume_download",
      "contact_click",
      "case_open",
      "full_case_read",
      "persona_selected",
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

  it.each([
    "founder",
    "recruiter",
    "product_lead",
    "just_browsing",
  ] as const)("captures the locked persona payload for %s", (persona) => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "phc_test");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "https://eu.i.posthog.com");

    analytics.track("persona_selected", {
      persona,
      surface: "hero_onboarding",
      $set: { visitor_persona: persona },
    });

    expect(capture).toHaveBeenCalledOnce();
    expect(capture).toHaveBeenCalledWith("persona_selected", {
      persona,
      surface: "hero_onboarding",
      $set: { visitor_persona: persona },
    });
  });

  it("drops an event outside the whitelist when JavaScript bypasses the type", () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "phc_test");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "https://eu.i.posthog.com");

    const unsafeTrack = analytics.track as unknown as (
      event: string,
      properties?: Record<string, unknown>,
    ) => void;
    unsafeTrack("world_scene");

    expect(capture).not.toHaveBeenCalled();
  });

  if (false) {
    // @ts-expect-error events outside the five-name contract are rejected.
    analytics.track("persona_viewed");
    analytics.track("persona_selected", {
      // @ts-expect-error fixed-choice persona values cannot drift.
      persona: "hr",
      surface: "hero_onboarding",
      // @ts-expect-error person-property values use the same fixed enum.
      $set: { visitor_persona: "hr" },
    });
  }

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
