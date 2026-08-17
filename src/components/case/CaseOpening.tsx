import type { ReactNode } from "react";
import { BACK_TO_BOARD_HREF, type CaseOpeningData } from "@/data/case-openings";
import styles from "./CaseOpening.module.css";

/**
 * Artifact-led case opening (Gate E; immersive spec "Case-study template").
 *
 * A designed product surface before the calm reading column: immediate
 * back-to-board affordance, honest kind label + ticket id, the case title,
 * its one-sentence value, exactly three verified facts (reused from
 * `workItems` via `case-openings.ts`), and ONE large real artifact.
 * No analytics — `CasePreviewDialog` owns `full_case_read`.
 */
export interface CaseOpeningProps extends CaseOpeningData {
  artifact: ReactNode;
}

export function CaseOpening({
  kindLabel,
  ticketId,
  title,
  value,
  facts,
  artifact,
}: CaseOpeningProps) {
  return (
    <header className={styles.opening} data-case-opening>
      <div className={styles.topRow}>
        <a className={styles.back} href={BACK_TO_BOARD_HREF}>
          <span aria-hidden="true">←</span> Back to board
        </a>
        <p className={styles.kind}>
          {kindLabel} · {ticketId}
        </p>
      </div>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.value}>{value}</p>
      <dl className={styles.facts}>
        {facts.map((fact) => (
          <div key={fact.label} className={styles.fact}>
            <dt className={styles.factLabel}>{fact.label}</dt>
            <dd className={styles.factValue}>{fact.value}</dd>
          </div>
        ))}
      </dl>
      <div className={styles.artifact}>{artifact}</div>
    </header>
  );
}
