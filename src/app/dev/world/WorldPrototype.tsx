import { ProductChrome } from "@/components/chrome/ProductChrome";
import { ExperimentStrip } from "@/components/experiment/ExperimentStrip";
import { FeatureFlagDock } from "@/components/ops/FeatureFlagDock";
import { siteConfig } from "@/data/site";
import { kindTicketLabel, workItems } from "@/data/work";
import { PersonaSatire } from "./PersonaSatire";
import styles from "./world-prototype.module.css";

const featuredWork = workItems[0];
const [heroLead, heroTail] = siteConfig.hero.split(" into ");

export function WorldPrototype() {
  return (
    <div className={styles.prototype} data-world-prototype>
      <ProductChrome />
      <div className={styles.experimentFrame} data-world-experiment>
        <ExperimentStrip />
      </div>

      <main className={styles.scene}>
        <section
          className={styles.releaseField}
          aria-labelledby="world-prototype-title"
          data-hero-evolution
          data-hero-phase="ga"
        >
          <div className={styles.copy} data-world-copy>
            <h1 id="world-prototype-title" className={styles.headline}>
              <span className={styles.headlineLine}>
                {heroLead}
              </span>{" "}
              <span className={styles.headlineLine}>
                into {heroTail}
              </span>
            </h1>
            <p className={styles.intro}>
              I’m Garvit. I write PRDs on GitHub, deploy prototypes on weekends,
              and build dashboards before asking engineering.
            </p>
            <div className={styles.actions}>
              <a
                id="resume-cta"
                className={`${styles.action} ${styles.resumeAction}`}
                href={siteConfig.resumePath}
                download
                data-primary-cta
                data-journey-conversion="resume"
              >
                Download resume
              </a>
              <a
                className={`${styles.action} ${styles.contactAction}`}
                href={`mailto:${siteConfig.email}`}
                data-primary-cta
                data-journey-conversion="contact"
              >
                Contact Garvit
              </a>
            </div>
          </div>

          <picture className={styles.guide} data-world-guide>
            <img
              src="/images/world/prototype-guide.webp"
              alt=""
              aria-hidden="true"
              width="1440"
              height="900"
              fetchPriority="high"
            />
          </picture>

          <PersonaSatire />
        </section>

        <a
          className={styles.boardEntry}
          href={featuredWork.route}
          aria-label={`Read ${featuredWork.title}`}
          data-board-entry
        >
          <span className={styles.ticketRail} aria-hidden="true" />
          <span className={styles.ticketMeta}>
            <span>{featuredWork.id}</span>
            <span>{kindTicketLabel(featuredWork.kind)}</span>
          </span>
          <span className={styles.ticketCopy}>
            <strong>{featuredWork.title}</strong>
            <span>{featuredWork.summary}</span>
          </span>
          <span className={styles.ticketFacts}>
            <span>{featuredWork.priority}</span>
            <span>{featuredWork.points}</span>
          </span>
          <span className={styles.ticketAction}>Read case</span>
        </a>

        <FeatureFlagDock className={styles.dock} />
      </main>
    </div>
  );
}
