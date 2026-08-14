"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { announce } from "@/components/toast/toast";
import styles from "./footer.module.css";

/**
 * Footer phone reveal (PRD §5.4) — light scraper deterrent, explicitly
 * approved by Garvit for public display after reveal.
 *
 * Rules enforced here (tested in PRD §16):
 *  - Client-only: renders nothing server-side / for no-JS visitors
 *    (mounted gate) — email remains the always-available path.
 *  - The number exists in source ONLY as digit chunks; it is assembled
 *    at activation time. Never write the assembled number in code,
 *    comments, data modules, metadata, or attributes.
 *  - Revealed href is exactly tel:+91<digits>; visible text is the
 *    formatted +91-spaced form.
 *  - Announces "Phone number revealed" once, politely.
 *  - Reveal state is memory-only; refresh restores the obfuscated state.
 */

// Digit chunks (PRD §5.4). Chunk boundaries intentionally split the
// display groups so no source substring contains a full group.
const CC = "+91";
const CHUNKS = ["750", "88", "836", "55"] as const;

function telHref(): string {
  return `tel:${CC}${CHUNKS.join("")}`;
}

function formatted(): string {
  return `${CC} ${CHUNKS[0]}${CHUNKS[1]} ${CHUNKS[2]}${CHUNKS[3]}`;
}

const emptySubscribe = () => () => {};

export function PhoneReveal() {
  // Hydration-safe client gate: false on the server (renders nothing in
  // server HTML / for no-JS visitors), true after hydration.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const [revealed, setRevealed] = useState(false);
  const announced = useRef(false);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (revealed) linkRef.current?.focus();
  }, [revealed]);

  if (!mounted) return null;

  if (!revealed) {
    return (
      <button
        type="button"
        className={styles.phoneButton}
        onClick={() => {
          setRevealed(true);
          if (!announced.current) {
            announced.current = true;
            announce("Phone number revealed");
          }
        }}
      >
        Reveal phone number
      </button>
    );
  }

  return (
    <a ref={linkRef} className={styles.phoneLink} href={telHref()}>
      {formatted()}
    </a>
  );
}
