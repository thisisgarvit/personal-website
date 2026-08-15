"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/data/site";
import { releases, releaseTypeLabel } from "@/data/releases";
import styles from "./VersionPopover.module.css";
import { recordJourneyEvent } from "@/features/journey/journey-store";

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
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      requestAnimationFrame(() => triggerRef.current?.focus());
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && !rootRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        ref={triggerRef}
        className={styles.trigger}
        data-mascot-notice="release"
        data-state={open ? "open" : "closed"}
        aria-expanded={open}
        aria-controls="release-notes"
        aria-haspopup="dialog"
        onClick={() => {
          if (!open) recordJourneyEvent({ type: "played", kind: "popover" });
          setOpen((current) => !current);
        }}
      >
        v{siteConfig.version}
      </button>
      {open ? (
        <div
          id="release-notes"
          role="dialog"
          className={styles.content}
          data-state="open"
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
        </div>
      ) : null}
    </div>
  );
}
