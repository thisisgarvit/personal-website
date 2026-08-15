"use client";

import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import type { PreviewFact } from "@/data/work";
import { analytics } from "@/lib/analytics";
import styles from "./CasePreviewDialog.module.css";

/**
 * Case-preview dialog primitive (DESIGN.md §5.9, PRD §8).
 *
 * OWNERSHIP / INTEGRATION CONTRACT: Task 4 ships this as a styled,
 * accessible primitive only — it is NOT wired to tickets. Codex Task 7
 * (src/features/board/**) opens it from ticket activation/drops and owns
 * open-state plumbing. Radix provides focus trap, labelled title, Escape,
 * inert background, and focus restoration (PRD §8 modal requirements);
 * backdrop pointer handling and URL non-mutation come for free (Radix
 * closes on overlay interaction; opening never touches the URL).
 *
 * Props:
 *  - open/onOpenChange   controlled dialog state
 *  - kindLabel/ticketId  e.g. "SHIPPED PRODUCT" / "GAR-101"
 *  - title/lede          sourced copy
 *  - facts               ≤3 verified facts (PRD §8) — pass from WorkItem
 *  - artifact            visual artifact surface (42% split, §5.9)
 *  - children            situation/bet/decision summary content
 *  - readFullCaseHref    explicit "Read full case" route link (§5.9)
 */
export interface CasePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kindLabel: string;
  ticketId: string;
  title: string;
  lede: string;
  facts: readonly Pick<PreviewFact, "value" | "label">[];
  artifact?: ReactNode;
  children?: ReactNode;
  readFullCaseHref: string;
}

export function CasePreviewDialog({
  open,
  onOpenChange,
  kindLabel,
  ticketId,
  title,
  lede,
  facts,
  artifact,
  children,
  readFullCaseHref,
}: CasePreviewDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <Dialog.Close className={styles.close} aria-label="Close case preview">
            <span aria-hidden="true">×</span>
          </Dialog.Close>
          <div className={styles.split}>
            <div className={styles.artifact}>
              <div className={styles.artifactHead}>
                <span>{kindLabel}</span>
                <span>{ticketId}</span>
              </div>
              <div className={styles.artifactBody}>{artifact}</div>
            </div>
            <article className={styles.copy}>
              <p className={styles.kicker}>
                {kindLabel} · {ticketId}
              </p>
              <Dialog.Title className={styles.title}>{title}</Dialog.Title>
              <Dialog.Description className={styles.lede}>
                {lede}
              </Dialog.Description>
              {facts.length > 0 && (
                <dl className={styles.facts}>
                  {facts.slice(0, 3).map((fact) => (
                    <div key={fact.label} className={styles.fact}>
                      <dt className="sr-only">{fact.label}</dt>
                      <dd>
                        <b>{fact.value}</b>
                        <span>{fact.label}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
              {children}
              <a
                className={styles.readCase}
                href={readFullCaseHref}
                onClick={() =>
                  analytics.track("full_case_read", { ticket_id: ticketId })
                }
              >
                Read full case <span aria-hidden="true">→</span>
              </a>
            </article>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
