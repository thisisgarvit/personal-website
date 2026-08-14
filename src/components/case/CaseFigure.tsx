import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import styles from "./CaseFigure.module.css";

/**
 * Artifact frame for case-route media (DESIGN.md §11): product rule/radius
 * system, restrained presentation, no inversion or blending in dark mode.
 * Uses next/image with statically imported assets so intrinsic dimensions
 * are always known — zero layout shift (PRD §14: CLS ≤ 0.05).
 */
export function CaseFigure({
  image,
  alt,
  caption,
  sizes,
  priority = false,
}: {
  image: StaticImageData;
  alt: string;
  caption?: ReactNode;
  /** Responsive `sizes` hint for next/image. */
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <figure className={styles.figure}>
      <span className={styles.frame}>
        <Image
          src={image}
          alt={alt}
          sizes={sizes}
          priority={priority}
          className={styles.image}
        />
      </span>
      {caption ? (
        <figcaption className={styles.caption}>{caption}</figcaption>
      ) : null}
    </figure>
  );
}

/** Side-by-side layout for narrow (phone-viewport) screenshots. */
export function CaseFigureGrid({ children }: { children: ReactNode }) {
  return <div className={styles.grid}>{children}</div>;
}
