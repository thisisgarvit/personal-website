import { ProductChrome } from "@/components/chrome/ProductChrome";
import { ExperimentStrip } from "@/components/experiment/ExperimentStrip";
import { FeatureFlagDock } from "@/components/ops/FeatureFlagDock";
import { siteConfig } from "@/data/site";
import { kindTicketLabel, workItems } from "@/data/work";
import { ExperienceWorld, WorldAnchor, WorldProvider } from "@/features/world";
import { PersonaSatire } from "./PersonaSatire";
import { HeroEvolution } from "./HeroEvolution";
import {
  BoardSignalControls,
  JourneySignalControls,
} from "./WorldPrototypeSignals";
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

      <WorldProvider>
        <ExperienceWorld />
        <main className={styles.scene}>
          <WorldAnchor id="hero" as="div" className={styles.heroAnchor}>
            <section
              className={styles.releaseField}
              aria-labelledby="world-prototype-title"
            >
          <div className={styles.copy} data-world-copy>
            <HeroEvolution lead={heroLead} tail={heroTail} />
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
          </WorldAnchor>

          <WorldAnchor id="board" as="div" className={styles.fixtureAnchor}>
            <section
              className={styles.fixtureSection}
              aria-labelledby="prototype-board-title"
            >
              <p className={styles.fixtureEyebrow}>Scene 02 / behavioral fixture</p>
              <h2 id="prototype-board-title">Things I’ve built</h2>
              <p>
                The production board lands here after Scene 1 passes. These
                controls prove the guide can follow direct manipulation without
                owning it.
              </p>
              <BoardSignalControls />
            </section>
          </WorldAnchor>

          <WorldAnchor id="journey" as="div" className={styles.fixtureAnchor}>
            <section
              className={styles.fixtureSection}
              aria-labelledby="prototype-journey-title"
            >
              <p className={styles.fixtureEyebrow}>Scene 03 / behavioral fixture</p>
              <h2 id="prototype-journey-title">Your session, instrumented</h2>
              <p>
                Same visitor-local journey stream, now with a guide that reacts
                to progress instead of decorating the dashboard.
              </p>
              <JourneySignalControls />
            </section>
          </WorldAnchor>
        </main>
      </WorldProvider>
    </div>
  );
}
