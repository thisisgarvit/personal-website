import Image from "next/image";
import styles from "./mascot.module.css";

/** Same-crop render of the sourced scene for reduced-motion and WebGL fallback. */
export function MascotPoster() {
  return (
    <>
      <Image
        className={styles.posterLight}
        aria-hidden="true"
        data-mascot-part="session-analyst"
        src="/mascot/session-analyst-poster.webp"
        alt=""
        width={760}
        height={408}
        sizes="(max-width: 879px) 50vw, 380px"
        priority
      />
      <Image
        className={styles.posterDark}
        aria-hidden="true"
        src="/mascot/session-analyst-poster-dark.webp"
        alt=""
        width={760}
        height={408}
        sizes="(max-width: 879px) 50vw, 380px"
      />
    </>
  );
}
