import { siteConfig } from "@/data/site";
import { latestReleaseLine } from "@/data/releases";
import { VersionPopover } from "./VersionPopover";
import styles from "./ProductChrome.module.css";

/**
 * Sticky product chrome (DESIGN.md §5.1, PRD §5.1).
 *
 * Left: build dot + accessible build-state text, wordmark, clickable
 * version affordance (opens the release-note popover).
 * Center: static latest changelog line (rotation is DESIGN.md §7.6 and
 * belongs to a later lane — Task 4 renders the newest note only).
 * Right: DELHI / IST and compact release status.
 */
export function ProductChrome() {
  return (
    <header className={styles.chrome}>
      <div className={styles.productId}>
        <span className={styles.buildDot} aria-hidden="true" />
        <span className="sr-only">Build healthy</span>
        <span className={styles.wordmark}>{siteConfig.productName}</span>
        <VersionPopover />
      </div>
      <p className={styles.ticker} aria-label="Latest changelog">
        {latestReleaseLine}
      </p>
      <div className={styles.meta}>
        <span className={styles.location}>DELHI / IST</span>
        <span className={styles.status}>STABLE</span>
      </div>
    </header>
  );
}
