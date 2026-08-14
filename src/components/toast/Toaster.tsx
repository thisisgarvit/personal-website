"use client";

import { useEffect, useState } from "react";
import { subscribeToasts, type ToastEvent } from "./toast";
import styles from "./Toaster.module.css";

/**
 * Renders the toast stack and the product's single polite live region
 * (PRD §13). Mounted once in the root layout. See ./toast.ts for the
 * imperative API both build lanes use.
 *
 * Visual toast lifetime follows the approved slice (2.9s); enter/exit
 * timing per DESIGN.md §7.3 toast row (180ms enter, 140ms exit — the
 * CSS handles reduced-motion by collapsing to opacity).
 */

const TOAST_LIFETIME_MS = 2900;

interface ActiveToast {
  id: number;
  message: string;
}

export function Toaster() {
  const [toasts, setToasts] = useState<readonly ActiveToast[]>([]);
  const [liveMessage, setLiveMessage] = useState("");

  useEffect(() => {
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const unsubscribe = subscribeToasts((event: ToastEvent) => {
      if (event.announce) setLiveMessage(event.message);
      if (event.visual) {
        setToasts((current) => [
          ...current,
          { id: event.id, message: event.message },
        ]);
        const timer = setTimeout(() => {
          setToasts((current) => current.filter((t) => t.id !== event.id));
          timers.delete(timer);
        }, TOAST_LIFETIME_MS);
        timers.add(timer);
      }
    });
    return () => {
      unsubscribe();
      for (const timer of timers) clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <div className={styles.stack} aria-hidden="true">
        {toasts.map((t) => (
          <div key={t.id} className={styles.toast}>
            {t.message}
          </div>
        ))}
      </div>
      {/* The one polite live region (PRD §13). */}
      <div aria-live="polite" className="sr-only">
        {liveMessage}
      </div>
    </>
  );
}
