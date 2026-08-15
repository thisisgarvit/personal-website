import { siteConfig, productLabel } from "@/data/site";
import { PhoneReveal } from "./PhoneReveal";
import styles from "./footer.module.css";

/**
 * Footer (DESIGN.md §5.11, PRD §5.4/5.5): one compact full-width build
 * strip — version, Delhi/IST, resume + contact links, phone reveal
 * (client-only), and the candid final build note. LinkedIn is omitted
 * until verified (§5.11 "LinkedIn if verified"). No newsletter block,
 * contact form, site map, or repeated hero.
 */
export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.build}>
          <span>{productLabel}</span>
          <span aria-hidden="true">·</span>
          <span>DELHI / IST</span>
        </div>
        <nav className={styles.links} aria-label="Contact">
          <a
            href={siteConfig.resumePath}
            data-journey-conversion="resume"
            download
          >
            Download resume
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            data-journey-conversion="contact"
          >
            Contact Garvit
          </a>
          <PhoneReveal />
        </nav>
        <p className={styles.note}>
          Built, reviewed, and carrying one known issue.
        </p>
      </div>
    </footer>
  );
}
