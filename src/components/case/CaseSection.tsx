import type { ReactNode } from "react";
import type { CaseTreatment } from "@/data/case-openings";
import styles from "./CaseSection.module.css";

/**
 * Structured reading treatments (Gate E; immersive spec "Case-study
 * template"): distinct `decision`, `constraint`, and `outcome` section
 * treatments built from rules, type, and material — deliberately NOT a
 * repeated rounded-card stack. Prose sections that are neither of the
 * three stay plain MDX headings.
 */
export function CaseSection({
  treatment,
  title,
  children,
}: {
  treatment: CaseTreatment;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`${styles.section} ${styles[treatment]}`}
      data-treatment={treatment}
    >
      <p className={styles.eyebrow}>{treatment}</p>
      <h2 className={styles.heading}>{title}</h2>
      {children}
    </section>
  );
}
