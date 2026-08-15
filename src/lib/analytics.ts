/**
 * Public analytics event contract (PRD §12).
 *
 * Launch mode has no analytics transport. These four event names are DEFINED
 * but NOT ENABLED: the v1 adapter is a strict no-op, and nothing in the
 * product may bypass it.
 *
 * Forbidden forever by PRD §12 — no properties, identity, URL query
 * persistence, cursor coordinates, ticket paths, flag state, phone
 * reveal, mascot state, replay, heatmap, or fake `banner_dismissed`
 * event may be sent. (The banner-dismiss toast is product humor and must
 * never route through this adapter.)
 */

export type PublicAnalyticsEvent =
  | "resume_download"
  | "contact_click"
  | "case_open"
  | "full_case_read";

export interface AnalyticsAdapter {
  track(event: PublicAnalyticsEvent): void;
}

/**
 * v1 adapter: intentionally does nothing — no network, no storage, no
 * console. Swapping in a real adapter is a deliberate future decision
 * with its own privacy review, not a config flip.
 */
export const analytics: AnalyticsAdapter = {
  track(): void {
    // No-op by design (PRD §12). Do not add transport here.
  },
};
