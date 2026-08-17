import { capturePostHog } from "./posthog-client";

export const allowedAnalyticsEvents = [
  "resume_download",
  "contact_click",
  "case_open",
  "full_case_read",
  "persona_selected",
] as const;

export type PublicAnalyticsEvent = (typeof allowedAnalyticsEvents)[number];
export type VisitorPersona =
  | "founder"
  | "recruiter"
  | "product_lead"
  | "just_browsing";

type AnalyticsEventProperties = {
  resume_download: undefined;
  contact_click: undefined;
  case_open: { case_slug: string };
  full_case_read: { ticket_id: string };
  persona_selected: {
    persona: VisitorPersona;
    surface: "hero_onboarding";
    $set: { visitor_persona: VisitorPersona };
  };
};

const allowedAnalyticsEventSet: ReadonlySet<string> = new Set(
  allowedAnalyticsEvents,
);

export function isAllowedAnalyticsEvent(
  event: string,
): event is PublicAnalyticsEvent {
  return allowedAnalyticsEventSet.has(event);
}

export interface AnalyticsAdapter {
  track<Event extends PublicAnalyticsEvent>(
    event: Event,
    ...properties: AnalyticsEventProperties[Event] extends undefined
      ? [properties?: undefined]
      : [properties: AnalyticsEventProperties[Event]]
  ): void;
}

export const analytics: AnalyticsAdapter = {
  track(event, ...propertyArgs): void {
    if (!isAllowedAnalyticsEvent(event)) return;

    if (
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      capturePostHog(event, propertyArgs[0]);
    }
  },
};
