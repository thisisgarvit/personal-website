/**
 * Versioned, namespaced storage keys (PRD §11).
 *
 * Single source of truth for every web-storage key the product uses.
 * Both build lanes (Claude structural shell; Codex flags/board/mascot)
 * import these constants — never inline a storage key string.
 *
 * Storage matrix (PRD §11):
 *
 * | Key                     | Store          | Lifetime            |
 * |-------------------------|----------------|---------------------|
 * | THEME_STORAGE_KEY       | localStorage   | until cleared       |
 * | BOARD_STORAGE_KEY       | sessionStorage | current tab         |
 * | BANNER_DISMISSED_KEY    | sessionStorage | current tab         |
 * | FLAG_CONFETTI_KEY       | sessionStorage | current tab         |
 * | FLAG_CANDID_KEY         | sessionStorage | current tab         |
 * | JOURNEY_STORAGE_KEY     | sessionStorage | current tab         |
 *
 * Memory-only state (flags-panel disclosure, phone reveal, active drag,
 * mascot queue) has no key on purpose — do not add one.
 *
 * Invalid or missing stored data always falls back to authored defaults;
 * bump the `:v1` suffix on any schema change so stale data is discarded.
 */

/** `dark_mode` user override: `"light" | "dark"`. Absent → follow OS. */
export const THEME_STORAGE_KEY = "garvit-theme:v1";

/** Sprint-board slug→column mapping (PRD §7 names this key exactly). */
export const BOARD_STORAGE_KEY = "garvit-board:v1";

/** Experiment-strip dismissal marker: `"1"` when dismissed (PRD §5.2). */
export const BANNER_DISMISSED_KEY = "garvit-banner:v1";

/** `confetti_on_scroll` session state: `"on" | "off"` (PRD §6). */
export const FLAG_CONFETTI_KEY = "garvit-flag-confetti:v1";

/** `candid_mode` session state: `"on" | "off"` (PRD §6). */
export const FLAG_CANDID_KEY = "garvit-flag-candid:v1";

/** Local-only session-event stream for the visitor-visible funnel. */
export const JOURNEY_STORAGE_KEY = "garvit-journey:v1";
