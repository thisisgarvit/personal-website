"use client";

import * as Popover from "@radix-ui/react-popover";
import { siteConfig } from "@/data/site";
import { releases, releaseTypeLabel } from "@/data/releases";
import styles from "./VersionPopover.module.css";

/**
 * Release-note popover anchored to the version affordance
 * (DESIGN.md §5.2, PRD §5.1).
 *
 * Exactly three notes; no "Full changelog" affordance (PRD §5.1).
 * Radix handles focus management, Escape, and focus return; motion uses
 * the trigger-origin scale/opacity from DESIGN.md §7.3 (version popover
 * row) via the CSS module.
 */

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
] as const;

/** `2026-08-15` → `15 AUG 2026` (approved slice release-head format). */
function displayDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${Number(day)} ${MONTHS[Number(month) - 1]} ${year}`;
}

export function VersionPopover() {
  return (
    <Popover.Root>
      <Popover.Trigger
        className={styles.trigger}
        data-mascot-notice="release"
      >
        v{siteConfig.version}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className={styles.content}
          align="start"
          sideOffset={8}
          aria-label="Release notes"
        >
          <div className={styles.head}>
            <strong>Release notes</strong>
            <span>{displayDate(releases[0].date)}</span>
          </div>
          <ul className={styles.list}>
            {releases.map((note) => (
              <li key={note.id}>
                <span className={styles.noteMeta}>
                  <b>{releaseTypeLabel(note.type)}</b>
                  <span className={styles.noteVersion}>
                    v{note.version} · {displayDate(note.date)}
                  </span>
                </span>
                <span className={styles.noteCopy}>{note.copy}</span>
              </li>
            ))}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
