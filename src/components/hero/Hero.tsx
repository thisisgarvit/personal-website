import { siteConfig } from "@/data/site";
import styles from "./Hero.module.css";

/**
 * Hero (DESIGN.md §5.4–5.5, PRD §5.3).
 *
 * Release-blue solid field. Top metadata row, one hero sentence, one lead
 * paragraph, exactly two primary CTAs (resume visually primary). All copy
 * comes from PRD §5.3 / SiteConfig — do not edit copy here.
 */
export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.meta}>
        <span className={styles.availability}>
          <i className={styles.availabilityDot} aria-hidden="true" />
          Product manager · available for the right problem
        </span>
        <span>DELHI / IST</span>
      </div>
      <div className={styles.main}>
        <h1 id="hero-title" className={styles.headline}>
          {siteConfig.hero}
        </h1>
        <p className={styles.intro}>
          I’m Garvit. I write PRDs on GitHub, deploy prototypes on weekends,
          and build dashboards before asking engineering.
        </p>
      </div>
      <div className={styles.ctas}>
        <a
          id="resume-cta"
          data-mascot-notice="resume"
          className={`${styles.cta} ${styles.ctaResume}`}
          href={siteConfig.resumePath}
          download
        >
          <span>Download resume</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden="true"
          >
            <path d="M12 3v12m0 0 5-5m-5 5-5-5M4 20h16" />
          </svg>
        </a>
        <a
          data-mascot-notice="contact"
          className={`${styles.cta} ${styles.ctaContact}`}
          href={`mailto:${siteConfig.email}`}
        >
          <span>Contact Garvit</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden="true"
          >
            <path d="M5 19 19 5M8 5h11v11" />
          </svg>
        </a>
      </div>
    </section>
  );
}
