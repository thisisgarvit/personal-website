import posthog from "posthog-js";

export const allowedAnalyticsEvents = [
  "resume_download",
  "contact_click",
  "case_open",
  "full_case_read",
] as const;

export type PublicAnalyticsEvent = (typeof allowedAnalyticsEvents)[number];

const allowedAnalyticsEventSet: ReadonlySet<string> = new Set(
  allowedAnalyticsEvents,
);

export function isAllowedAnalyticsEvent(
  event: string,
): event is PublicAnalyticsEvent {
  return allowedAnalyticsEventSet.has(event);
}

export interface AnalyticsAdapter {
  track(
    event: PublicAnalyticsEvent,
    properties?: { case_slug: string } | { ticket_id: string },
  ): void;
}

export const analytics: AnalyticsAdapter = {
  track(event, properties): void {
    if (
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      posthog.capture(event, properties);
    }
  },
};
