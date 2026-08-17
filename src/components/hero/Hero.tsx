import { siteConfig } from "@/data/site";
import { HeroEvolution } from "./HeroEvolution";
import { PersonaSatire } from "./PersonaSatire";
import styles from "./Hero.module.css";

const [heroLead, heroTail] = siteConfig.hero.split(" into ");

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.copy} data-world-copy>
        <HeroEvolution lead={heroLead} tail={heroTail} titleId="hero-title" />
        <p className={styles.intro}>
          I’m Garvit. I write PRDs on GitHub, deploy prototypes on weekends,
          and build dashboards before asking engineering.
        </p>
        <div className={styles.actions}>
          <a
            id="resume-cta"
            data-primary-cta
            data-mascot-notice="resume"
            data-journey-conversion="resume"
            className={`${styles.action} ${styles.resumeAction}`}
            href={siteConfig.resumePath}
            download
          >
            Download resume
          </a>
          <a
            data-primary-cta
            data-mascot-notice="contact"
            data-journey-conversion="contact"
            className={`${styles.action} ${styles.contactAction}`}
            href={`mailto:${siteConfig.email}`}
          >
            Contact Garvit
          </a>
        </div>
      </div>
      <PersonaSatire />
    </section>
  );
}
