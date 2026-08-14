"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import styles from "./ops.module.css";

/**
 * Feature-flags panel — STATIC VISUAL SHELL (Task 4).
 *
 * OWNERSHIP / INTEGRATION CONTRACT (for Codex Task 6, src/features/flags/**):
 * This component renders the approved visual state only. It has NO toggle
 * handlers and NO state. Task 6 replaces the four <input> elements' wiring
 * (or swaps this component for a stateful one reusing the same CSS module
 * classes) while preserving:
 *   - row order: dark_mode, confetti_on_scroll, candid_mode, comic_sans
 *     (DESIGN.md §5.6);
 *   - descriptors: theme / ship signal / field notes / prod locked —
 *     `candid_mode` must NEVER display "CODEX LAB" (PRD §6);
 *   - native checkbox semantics (PRD §6);
 *   - the Comic Sans tooltip copy: "disabled in prod for a reason";
 *   - header `Feature flags` + `3 / 4 live` ("live" = implemented);
 *   - defaults: dark_mode follows OS (unchecked shell), confetti on,
 *     candid on, comic_sans off + disabled.
 * Intended stateful row props (PRD §6 FeatureFlagDefinition):
 *   { definition: FeatureFlagDefinition; checked: boolean;
 *     onCheckedChange(next: boolean): void }
 * Storage keys live in src/data/storage.ts (FLAG_CONFETTI_KEY,
 * FLAG_CANDID_KEY, THEME_STORAGE_KEY). Panel disclosure is memory-only
 * and expanded on every load (PRD §6) — the header is intentionally not
 * a disclosure button in the static shell.
 */

interface StaticFlagRow {
  key: string;
  descriptor: string;
  defaultChecked: boolean;
  disabled: boolean;
  accessibleLabel: string;
}

const rows: readonly StaticFlagRow[] = [
  {
    key: "dark_mode",
    descriptor: "theme",
    defaultChecked: false, // OS preference until overridden (PRD §6)
    disabled: false,
    accessibleLabel: "Toggle dark mode",
  },
  {
    key: "confetti_on_scroll",
    descriptor: "ship signal",
    defaultChecked: true,
    disabled: false,
    accessibleLabel: "Toggle confetti while scrolling",
  },
  {
    key: "candid_mode",
    descriptor: "field notes",
    defaultChecked: true,
    disabled: false,
    accessibleLabel: "Toggle candid ticket annotations",
  },
  {
    key: "comic_sans",
    descriptor: "prod locked",
    defaultChecked: false,
    disabled: true,
    accessibleLabel: "Comic Sans disabled",
  },
] as const;

export function FlagsPanel() {
  return (
    <section className={styles.panel} aria-labelledby="flags-title">
      <header className={styles.panelTitle}>
        <span id="flags-title">Feature flags</span>
        <span className={styles.flagCount}>3 / 4 live</span>
      </header>
      <div className={styles.flagsBody}>
        {rows.map((row) =>
          row.disabled ? (
            <Tooltip.Provider key={row.key} delayDuration={200}>
              <Tooltip.Root>
                <div className={styles.flagRow}>
                  <span className={styles.flagName}>
                    <code>{row.key}</code>
                    <small>{row.descriptor}</small>
                  </span>
                  <Tooltip.Trigger asChild>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        disabled
                        defaultChecked={row.defaultChecked}
                      />
                      <span className={styles.switchTrack} aria-hidden="true" />
                      <span className="sr-only">{row.accessibleLabel}</span>
                    </label>
                  </Tooltip.Trigger>
                </div>
                <Tooltip.Portal>
                  <Tooltip.Content className={styles.tooltip} sideOffset={6}>
                    disabled in prod for a reason
                    <Tooltip.Arrow className={styles.tooltipArrow} />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          ) : (
            <div key={row.key} className={styles.flagRow}>
              <span className={styles.flagName}>
                <code>{row.key}</code>
                <small>{row.descriptor}</small>
              </span>
              <label className={styles.switch}>
                <input type="checkbox" defaultChecked={row.defaultChecked} />
                <span className={styles.switchTrack} aria-hidden="true" />
                <span className="sr-only">{row.accessibleLabel}</span>
              </label>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
