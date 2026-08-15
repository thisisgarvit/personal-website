import posthog from "posthog-js";

export type PublicAnalyticsEvent =
  | "resume_download"
  | "contact_click"
  | "case_open"
  | "full_case_read";

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
